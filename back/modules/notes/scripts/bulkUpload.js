

import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import { promisify } from "util";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

const execFileAsync = promisify(execFile);

// Same fix as index.js — the default Windows/system DNS resolver can fail
// on the SRV lookup that mongodb+srv:// connection strings require.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Resolve .env relative to THIS file's location (back/.env), not the
// directory you happen to run `node` from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// CRITICAL: these are dynamically imported AFTER dotenv.config() runs.
// Static `import` statements at the top of an ES module execute before
// ANY other code in the file — including dotenv.config() — so if
// config/cloudinary.js reads process.env.CLOUDINARY_* at import time
// (very likely, since it's a config module), it would have seen
// `undefined` credentials and every upload would silently fail auth.
// This was the actual cause of all 473 uploads failing.
const { cloudinary } = await import("../../../config/cloudinary.js");
const { default: Resource } = await import("../schema/Resource.model.js");

// ── CONFIG: adjust only if your local paths differ ──
// Script lives at back/scripts/bulkUpload.js, files live at dash/public/images
// (dash is a sibling folder to back), so we go up two levels then across.
const IMAGES_ROOT = path.resolve(__dirname, "../../dash/public/images");

// category -> local folder name (folder name matches your Mongoose enum
// values exactly, so no renaming needed). "songs" is intentionally
// excluded — it has no matching enum value yet, left untouched.
const FOLDER_MAP = {
  completenotes: "completenotes",
  dsa_files: "dsa_files",
  fullstack: "fullstack",
  mindmap: "mindmap",
  pyq: "pyq",
  shortnotes: "shortnotes",
};

// How many files to upload in parallel at once (keeps it fast without
// hammering Cloudinary's rate limits)
const CONCURRENCY = 8;

// Generic resource_type detection by extension — since dsa_files/fullstack
// may contain non-PDF files (zips, docs, code, etc.), not just notes.
function getResourceType(ext) {
  const audioExts = [".mp3", ".wav", ".m4a", ".aac"];
  const videoExts = [".mp4", ".mov", ".avi", ".mkv"];
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  if (audioExts.includes(ext) || videoExts.includes(ext)) return "video";
  if (imageExts.includes(ext)) return "image";
  return "raw"; // pdf, doc, docx, zip, txt, code files, etc.
}

function mimeFromExt(ext) {
  const map = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".zip": "application/zip",
    ".txt": "text/plain",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
  };
  return map[ext] || "application/octet-stream";
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Normalizes a string for prefix-comparison only (lowercase, strip anything
// that isn't a letter/digit) so "Theory", "theory", "THEORY-DBMS" etc. all
// compare consistently regardless of case or separator style.
function normalizeForCompare(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Builds the DB "slug" (title) for a file, prefixing subfolder names in for
// uniqueness — but skips a subfolder segment if the filename ALREADY starts
// with that same word, so we don't get double-stamped names like
// "theory-theory-dbms" or "python-python" when the file itself is already
// named e.g. "theory-dbms.pdf" inside a "theory/" folder.
function buildSlug(relDir, baseName) {
  if (!relDir) return baseName;

  const baseNorm = normalizeForCompare(baseName);
  const segments = relDir
    .split("/")
    .filter((seg) => !baseNorm.startsWith(normalizeForCompare(seg)));

  return segments.length ? `${segments.join("-")}-${baseName}` : baseName;
}

// Recursively walks a folder and returns every FILE found, at any depth —
// so nested subfolders (e.g. fullstack/frontend/, fullstack/python/) get
// picked up too, not just files sitting directly inside the category folder.
// Returns [{ absPath, relDir }] where relDir is the path of subfolders
// between the category root and the file (posix-style, "" for top-level
// files, "frontend" for fullstack/frontend/x.pdf,
// "frontend/css" for fullstack/frontend/css/x.pdf, etc.)
function walkFilesRecursive(rootDir, relDir = "") {
  const currentDir = path.join(rootDir, relDir);
  const entries = fs.readdirSync(currentDir);

  let files = [];
  for (const entry of entries) {
    const absPath = path.join(currentDir, entry);
    const entryRelDir = relDir ? `${relDir}/${entry}` : entry;
    const stat = fs.statSync(absPath);

    if (stat.isDirectory()) {
      files = files.concat(walkFilesRecursive(rootDir, entryRelDir));
    } else if (stat.isFile()) {
      files.push({ absPath, relDir });
    }
  }

  return files;
}

// Confirmed via real test runs: Cloudinary's free-plan raw file upload cap
// is exactly 10485760 bytes (10MB), and it's enforced on Cloudinary's side
// regardless of chunked upload — chunking only fixes request-size/timeout
// issues, not this account-level ceiling. PDFs over this size must be
// compressed before upload, or hosted elsewhere.
const RAW_SIZE_CAP_BYTES = 10 * 1024 * 1024;
const COMPRESSION_TARGET_BYTES = RAW_SIZE_CAP_BYTES - 300 * 1024; // small safety margin

// Ghostscript's command name differs by OS/install
const GS_CANDIDATES = process.platform === "win32" ? ["gswin64c", "gswin32c"] : ["gs"];

// On Windows, Ghostscript's installer often does NOT add itself to PATH,
// so "gswin64c" alone may not resolve even when it's installed. Fall back
// to checking its default install location directly.
function findGhostscriptInDefaultWindowsPaths() {
  const roots = ["C:\\Program Files\\gs", "C:\\Program Files (x86)\\gs"];

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;

    const versionDirs = fs.readdirSync(root).filter((name) => {
      try {
        return fs.statSync(path.join(root, name)).isDirectory();
      } catch {
        return false;
      }
    });

    for (const versionDir of versionDirs) {
      for (const exeName of ["gswin64c.exe", "gswin32c.exe"]) {
        const candidate = path.join(root, versionDir, "bin", exeName);
        if (fs.existsSync(candidate)) return candidate;
      }
    }
  }

  return null;
}

async function findGhostscript() {
  for (const cmd of GS_CANDIDATES) {
    try {
      await execFileAsync(cmd, ["-version"]);
      return cmd;
    } catch {
      // try next candidate
    }
  }

  if (process.platform === "win32") {
    const fallbackPath = findGhostscriptInDefaultWindowsPaths();
    if (fallbackPath) {
      try {
        await execFileAsync(fallbackPath, ["-version"]);
        return fallbackPath; // full path works even though it's not on PATH
      } catch {
        // fall through to null below
      }
    }
  }

  return null;
}

// Tries progressively more aggressive Ghostscript compression settings
// until the output fits under targetMaxBytes. Returns the path to a
// compressed temp file, or null if it couldn't get under the target.
async function compressPdf(gsCmd, inputPath, targetMaxBytes) {
  const settings = ["/ebook", "/screen"]; // /ebook = good quality, /screen = smallest/most aggressive

  for (const setting of settings) {
    const outPath = path.join(
      os.tmpdir(),
      `compressed-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`
    );

    try {
      await execFileAsync(gsCmd, [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        `-dPDFSETTINGS=${setting}`,
        "-dNOPAUSE",
        "-dBATCH",
        "-dQUIET",
        `-sOutputFile=${outPath}`,
        inputPath,
      ]);

      const size = fs.statSync(outPath).size;
      if (size <= targetMaxBytes) {
        return outPath;
      }
      fs.unlinkSync(outPath); // still too big, try next (more aggressive) setting
    } catch {
      // this setting failed, try the next one
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    }
  }

  return null; // couldn't get under target with any setting
}

// Detects Cloudinary quota-exceeded / plan-limit / account-suspended style
// errors, which should stop the whole run rather than being retried per-file.
function isQuotaError(err) {
  const msg = (err?.message || err?.error?.message || "").toLowerCase();
  return (
    msg.includes("quota") ||
    msg.includes("plan") ||
    msg.includes("exceeded") ||
    msg.includes("disabled") ||
    err?.http_code === 420 || // Cloudinary's rate/quota status code
    err?.error?.http_code === 420
  );
}

// upload_large's built-in Promise support isn't reliable across SDK
// versions — in testing it returned the raw internal stream object
// instead of the final Cloudinary response. Wrapping it ourselves with
// the callback form guarantees we get the real result or a real error.
function uploadLargeAsync(filePath, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

async function uploadOne({ filePath, ext, category, slug }, gsCmd) {
  const resourceType = getResourceType(ext);

  // Skip if this exact title+category already exists in DB
  const existing = await Resource.findOne({ title: slug, category });
  if (existing) {
    console.log(`SKIP (already in DB): ${category}/${slug}${ext}`);
    return { status: "skipped", category, slug, ext };
  }

  let uploadPath = filePath; // may become a temp compressed file below
  let tempFileToCleanup = null;

  try {
    const stats = fs.statSync(filePath);

    if (stats.size === 0) {
      console.error(`FAILED: ${category}/${slug}${ext} — local file is 0 bytes (empty/corrupted), skipping upload.`);
      return { status: "failed", category, slug, ext, error: "Local file is 0 bytes", quotaError: false };
    }

    let effectiveSize = stats.size;

    // PDFs over Cloudinary's confirmed 10MB raw cap must be compressed
    // first — chunked upload does NOT bypass this account-level limit.
    if (ext === ".pdf" && stats.size > RAW_SIZE_CAP_BYTES) {
      if (!gsCmd) {
        console.error(
          `FAILED: ${category}/${slug}${ext} — over 10MB and Ghostscript not found. ` +
            `Install it from https://ghostscript.com/releases/gsdnld.html to enable auto-compression.`
        );
        return {
          status: "failed",
          category,
          slug,
          ext,
          error: "File >10MB and Ghostscript not installed",
          quotaError: false,
        };
      }

      console.log(
        `Compressing (over 10MB, ${(stats.size / 1024 / 1024).toFixed(1)}MB): ${category}/${slug}${ext} ...`
      );
      const compressedPath = await compressPdf(gsCmd, filePath, COMPRESSION_TARGET_BYTES);

      if (!compressedPath) {
        console.error(
          `FAILED: ${category}/${slug}${ext} — could not compress under 10MB even with maximum compression.`
        );
        return {
          status: "failed",
          category,
          slug,
          ext,
          error: "Could not compress under 10MB cap even at max compression",
          quotaError: false,
        };
      }

      uploadPath = compressedPath;
      tempFileToCleanup = compressedPath;
      effectiveSize = fs.statSync(compressedPath).size;
      console.log(
        `Compressed ${category}/${slug}${ext} to ${(effectiveSize / 1024 / 1024).toFixed(1)}MB`
      );
    }

    // Chunk anything still fairly large after compression (or non-PDF
    // large files) to avoid single-request timeouts.
    const CHUNK_THRESHOLD_BYTES = 9 * 1024 * 1024;

    const uploadOptions = {
      folder: `notenova/${category}`,
      resource_type: resourceType,
      type: "upload",
      access_mode: "public",
      public_id: slug,
    };

    const result =
      effectiveSize > CHUNK_THRESHOLD_BYTES
        ? await uploadLargeAsync(uploadPath, {
            ...uploadOptions,
            chunk_size: 6 * 1024 * 1024,
          })
        : await cloudinary.uploader.upload(uploadPath, uploadOptions);

    // Validate before saving — if Cloudinary returns no secure_url, surface
    // the full response here instead of letting Mongoose throw a confusing
    // "fileUrl is required" error with no context.
    if (!result?.secure_url) {
      throw new Error(`Cloudinary returned no secure_url. Full response: ${JSON.stringify(result)}`);
    }

    await Resource.create({
      title: slug,
      category,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: mimeFromExt(ext),
    });

    console.log(`UPLOADED: ${category}/${slug}${ext} -> ${result.secure_url}`);
    return { status: "uploaded", category, slug, ext };
  } catch (err) {
    // Cloudinary errors sometimes nest the real message at err.error.message
    // rather than err.message, which is why we were seeing "undefined".
    const realMessage =
      err?.message || err?.error?.message || JSON.stringify(err) || String(err);
    console.error(`FAILED: ${category}/${slug}${ext} — ${realMessage}`);
    return {
      status: "failed",
      category,
      slug,
      ext,
      error: realMessage,
      quotaError: isQuotaError(err),
    };
  } finally {
    // Clean up the temp compressed file regardless of success/failure
    if (tempFileToCleanup && fs.existsSync(tempFileToCleanup)) {
      fs.unlinkSync(tempFileToCleanup);
    }
  }
}

async function run() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI not found in back/.env — check that back/.env exists and contains MONGO_URI=..."
    );
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const gsCmd = await findGhostscript();
  if (gsCmd) {
    console.log(`Ghostscript found (${gsCmd}) — oversized PDFs will be auto-compressed.`);
  } else {
    console.warn(
      "Ghostscript NOT found — PDFs over 10MB will fail instead of being compressed.\n" +
        "Install it from https://ghostscript.com/releases/gsdnld.html and re-run to handle those.\n"
    );
  }

  const tasks = [];

  for (const [category, dir] of Object.entries(FOLDER_MAP)) {
    const folderPath = path.join(IMAGES_ROOT, dir);

    if (!fs.existsSync(folderPath)) {
      console.warn(`Folder not found, skipping: ${folderPath}`);
      continue;
    }

    // Recurse into subfolders too (e.g. fullstack/frontend/, fullstack/python/)
    // instead of only reading files directly inside the category folder.
    const files = walkFilesRecursive(folderPath);

    for (const { absPath, relDir } of files) {
      const file = path.basename(absPath);
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);

      // Prefix the subfolder path into the slug so nested files stay unique
      // and identifiable (e.g. fullstack/frontend/notes.pdf -> "frontend-notes"),
      // but skip a segment if the filename already starts with it
      // (e.g. fullstack/theory/theory-dbms.pdf -> "theory-dbms", not
      // "theory-theory-dbms"). Top-level files are unaffected: relDir is ""
      // so slug === baseName, exactly matching the previous behavior.
      const slug = buildSlug(relDir, baseName);

      tasks.push({ filePath: absPath, ext, category, slug });
    }
  }

  console.log(`Found ${tasks.length} files to process.`);

  const results = { uploaded: [], skipped: [], failed: [] };
  let stoppedEarly = false;

  const batches = chunk(tasks, CONCURRENCY);
  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map((task) => uploadOne(task, gsCmd)));

    for (const r of batchResults) {
      if (!r) continue;
      results[r.status].push(r);
    }

    // If Cloudinary is telling us we've hit a quota/plan limit, stop
    // immediately instead of burning through the remaining files with
    // the same failure repeated hundreds of times.
    const hitQuota = batchResults.some((r) => r?.status === "failed" && r.quotaError);
    if (hitQuota) {
      console.error(
        "\nDetected a Cloudinary quota/plan-limit error — stopping early instead of retrying the rest of the batch.\n" +
          "Check your Cloudinary dashboard usage, then re-run this script later; already-uploaded files will be skipped automatically.\n"
      );
      stoppedEarly = true;
      break;
    }
  }

  // Write failed files to a log so you have a clean list to review,
  // instead of scrolling terminal output.
  if (results.failed.length > 0) {
    const logPath = path.resolve(__dirname, "failed-uploads.json");
    fs.writeFileSync(logPath, JSON.stringify(results.failed, null, 2));
    console.log(`\nFailed file details written to: ${logPath}`);
  }

  console.log("\n── SUMMARY ──");
  console.log(`Uploaded: ${results.uploaded.length}`);
  console.log(`Skipped (already in DB): ${results.skipped.length}`);
  console.log(`Failed: ${results.failed.length}`);
  if (stoppedEarly) {
    console.log(`Stopped early due to quota/plan limit — ${tasks.length - (results.uploaded.length + results.skipped.length + results.failed.length)} files not yet attempted.`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration script failed:", err);
  process.exit(1);
});