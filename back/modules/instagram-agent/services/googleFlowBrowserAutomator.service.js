// googleFlowBrowserAutomator.service.js
// ─────────────────────────────────────────────────────────────
// Antigravity Live Google Flow Autonomous Engine
// Proven & verified end-to-end studio automation for labs.google/fx/tools/flow
// ─────────────────────────────────────────────────────────────

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import path from "path";
import fs from "fs";
import os from "os";
import { cloudinary } from "../../../config/cloudinary.js";
import { logInstagramActivity } from "./instagramAgent.service.js";
import InstagramContent from "../schema/InstagramContent.model.js";

puppeteer.use(StealthPlugin());

export const liveFlowSessions = new Map();

async function uploadBufferToCloudinary(buffer, resourceType = "auto", folder = "instagram-agent/flow-creations") {
  const tempDir = path.join(process.cwd(), "data", "google-flow-downloads");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const tempId = `flow_buf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const isLikelyVideo = buffer.slice(0, 30).includes(Buffer.from("ftyp")) || buffer.slice(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])) || resourceType === "video";
  const ext = isLikelyVideo ? ".mp4" : ".png";
  const tempPath = path.join(tempDir, `${tempId}${ext}`);

  try {
    fs.writeFileSync(tempPath, buffer);
    return await uploadLocalFileToCloudinary(tempPath, "auto", folder);
  } finally {
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch {}
  }
}

async function uploadLocalFileToCloudinary(filePath, resourceType = "auto", folder = "instagram-agent/flow-creations") {
  const tryUpload = (type) => new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: type,
        quality: "auto:best",
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
  });

  try {
    return await tryUpload(resourceType || "auto");
  } catch (err) {
    console.warn(`[Cloudinary Upload] Attempt with "${resourceType}" failed: ${err.message}. Retrying...`);
    if (err.message && (err.message.includes("Unsupported video format") || err.message.includes("Invalid file"))) {
      try {
        return await tryUpload("image");
      } catch (err2) {
        return await tryUpload("auto");
      }
    }
    if (resourceType !== "auto") {
      return await tryUpload("auto");
    }
    throw err;
  }
}

/**
 * Autonomous Headless Worker: Interacts directly with Google Flow Studio,
 * types the prompt, submits generation, and extracts the rendered creation.
 */
export async function automateGoogleFlowReelGeneration(prompt, contentId = "live_session", isVideo = true) {
  let browser = null;
  let activePage = null;
  const runStartedAt = Date.now();
  const sessionId = String(contentId);

  const sessionData = {
    contentId: sessionId,
    prompt: prompt,
    status: "running",
    startedAt: new Date(),
    steps: [],
  };
  liveFlowSessions.set(sessionId, sessionData);

  const addStep = async (stepName, detail, page = null) => {
    let screenshotUrl = null;
    if (page && !page.isClosed()) {
      try {
        const screenshotBuf = await page.screenshot({ type: "jpeg", quality: 80 });
        const upload = await uploadBufferToCloudinary(screenshotBuf, "image", "instagram-agent/flow-steps");
        screenshotUrl = upload.secure_url;
      } catch (err) {
        console.warn("[Google Flow Inspector] Screenshot notice:", err.message);
      }
    }

    const stepObj = {
      step: stepName,
      detail: detail,
      timestamp: new Date().toLocaleTimeString(),
      screenshotUrl: screenshotUrl,
    };
    sessionData.steps.push(stepObj);
    console.log(`[Google Flow Agent Step] ${stepName}: ${detail}`);
  };

  // Google Flow changes CSS class names frequently. Use the labels recorded from
  // the user's Flow session instead of brittle coordinates or generated IDs.
  const clickLabeledControl = async (page, labels, timeout = 15000) => {
    await page.waitForFunction(
      (wanted) => Array.from(document.querySelectorAll("button, [role='button'], [contenteditable='true'], textarea, input"))
        .some((element) => wanted.some((label) => (element.innerText || element.getAttribute("aria-label") || element.placeholder || "").trim().toLowerCase().includes(label))),
      { timeout },
      labels.map((label) => label.toLowerCase())
    );

    const clicked = await page.evaluate((wanted) => {
      const elements = Array.from(document.querySelectorAll("button, [role='button'], [contenteditable='true'], textarea, input"));
      const element = elements.find((candidate) => {
        const label = (candidate.innerText || candidate.getAttribute("aria-label") || candidate.placeholder || "").trim().toLowerCase();
        return wanted.some((value) => label.includes(value));
      });
      if (!element) return false;
      element.click();
      return true;
    }, labels.map((label) => label.toLowerCase()));

    if (!clicked) throw new Error(`Google Flow control not found: ${labels.join(" / ")}`);
  };

  const focusPrompt = async (page) => {
    const focused = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll("textarea, [contenteditable='true'], input[type='text']"));
      const prompt = candidates.find((element) => {
        const label = [
          element.getAttribute("aria-label"),
          element.getAttribute("placeholder"),
          element.innerText,
        ].filter(Boolean).join(" ").toLowerCase();
        return label.includes("what do you want to create") || label.includes("describe");
      }) || candidates.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 200 && rect.height > 20;
      });
      if (!prompt) return false;
      prompt.focus();
      prompt.click();
      return true;
    });
    if (!focused) throw new Error("Google Flow prompt field was not found in the current editor.");
  };

  const selectFlowMediaMode = async (page, isVideo) => {
    const targetMode = isVideo ? "video" : "image";
    const opened = await page.evaluate(() => {
      const controls = Array.from(document.querySelectorAll("button, [role='button'], div"));
      const selector = controls.find((element) => {
        const text = (element.innerText || element.getAttribute("aria-label") || "").toLowerCase();
        const rect = element.getBoundingClientRect();
        return /^video\s*[·•]/.test(text) && rect.top > window.innerHeight * 0.6 && rect.width > 120;
      });
      if (!selector) return false;
      selector.click();
      return true;
    });
    // Flow renders this control in a canvas-like surface on some accounts,
    // where its visible label is absent from the DOM. Its position is stable
    // for the 1366×850 automation viewport used by this worker.
    if (!opened) {
      await page.mouse.click(900, 740);
      await new Promise((resolve) => setTimeout(resolve, 750));
    }
    await page.waitForFunction((mode) => Array.from(document.querySelectorAll("button, [role='menuitem'], [role='button'], div"))
      .some((element) => (element.innerText || "").trim().toLowerCase() === mode), { timeout: 3000 }, targetMode).catch(() => {});
    const selected = await page.evaluate((mode) => {
      const option = Array.from(document.querySelectorAll("button, [role='menuitem'], [role='button'], div"))
        .find((element) => (element.innerText || "").trim().toLowerCase() === mode);
      if (!option) return false;
      option.click();
      return true;
    }, targetMode);
    if (!selected) {
      // Screenshot-verified menu positions: Image is left and Video is right.
      await page.mouse.click(isVideo ? 930 : 735, 405);
    }

    // Instagram content is vertical. The menu exposes 9:16 for both image and video.
    await page.waitForFunction(() => Array.from(document.querySelectorAll("button, [role='button'], div"))
      .some((element) => (element.innerText || "").trim() === "9:16"), { timeout: 5000 }).catch(() => {});
    const ratioSelected = await page.evaluate(() => {
      const ratio = Array.from(document.querySelectorAll("button, [role='button'], div"))
        .find((element) => (element.innerText || "").trim() === "9:16");
      if (!ratio) return false;
      ratio.click();
      return true;
    });
    if (!ratioSelected) await page.mouse.click(735, 480);
  };

  const downloadDir = path.join(process.cwd(), "data", "google-flow-downloads");
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const systemDownloadsDir = path.join(os.homedir(), "Downloads");
  const sessionDir = path.join(process.cwd(), "data", "google-flow-session");
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  // Pre-configure Chrome profile preferences for automatic downloads
  try {
    const defaultPrefDir = path.join(sessionDir, "Default");
    if (!fs.existsSync(defaultPrefDir)) fs.mkdirSync(defaultPrefDir, { recursive: true });
    const prefFile = path.join(defaultPrefDir, "Preferences");
    let prefs = {};
    if (fs.existsSync(prefFile)) {
      try { prefs = JSON.parse(fs.readFileSync(prefFile, "utf-8")); } catch {}
    }
    prefs.download = prefs.download || {};
    prefs.download.default_directory = downloadDir;
    prefs.download.prompt_for_download = false;
    prefs.download.directory_upgrade = true;
    prefs.safebrowsing = prefs.safebrowsing || {};
    prefs.safebrowsing.enabled = true;
    fs.writeFileSync(prefFile, JSON.stringify(prefs));
  } catch (e) {
    console.warn("[Google Flow Preferences] Notice:", e.message);
  }

  const candidateDirs = [downloadDir, systemDownloadsDir, path.join(sessionDir, "Default", "Downloads")].filter(d => fs.existsSync(d));
  const snapshotFiles = () => {
    const set = new Set();
    for (const dir of candidateDirs) {
      try {
        const files = fs.readdirSync(dir);
        for (const f of files) {
          set.add(path.join(dir, f));
        }
      } catch {}
    }
    return set;
  };

  const initialExistingFiles = snapshotFiles();

  try {
    const isLinux = process.platform === "linux";
    let flowExecutablePath = undefined;
    if (isLinux) {
      const systemPaths = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/google-chrome",
        "/snap/bin/chromium",
      ].filter(Boolean);
      flowExecutablePath = systemPaths.find((p) => fs.existsSync(p));
    }

    // Remove stale Chromium lockfiles if left by previous container run/crash
    const lockFiles = ["SingletonLock", "SingletonCookie", "SingletonSocket"];
    for (const lock of lockFiles) {
      const lockPath = path.join(sessionDir, lock);
      try {
        if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
      } catch (_) {}
    }

    const launchArgs = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-quic",
      "--disable-session-crashed-bubble",
      "--no-first-run",
      "--window-size=1366,850",
      `--download-default-directory=${downloadDir}`,
    ];

    const launchOptions = {
      headless: "new",
      userDataDir: sessionDir,
      protocolTimeout: 300000,
      timeout: 60000,
      args: launchArgs,
    };
    if (flowExecutablePath) {
      launchOptions.executablePath = flowExecutablePath;
    }

    browser = await puppeteer.launch(launchOptions);

    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    activePage = page;
    await page.setViewport({ width: 1366, height: 850 });

    // Enable automated downloads in Chrome via CDP
    try {
      const client = await page.target().createCDPSession();
      await client.send("Browser.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadDir,
        eventsEnabled: true,
      }).catch(() => {});
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadDir,
      }).catch(() => {});
    } catch {}

    await addStep("2. Open Google Flow", "Navigating to https://labs.google/fx/tools/flow...", page);
    await page.goto("https://labs.google/fx/tools/flow", { waitUntil: "networkidle2", timeout: 45000 }).catch(() => {});
    // Give Google redirects a moment to settle before inspecting the page.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const flowPageState = await page.evaluate(() => ({
      title: document.title,
      url: location.href,
      text: (document.body?.innerText || "").slice(0, 1200),
    }));
    const pageText = flowPageState.text.toLowerCase();
    const flowHost = new URL(flowPageState.url).hostname;
    if (flowHost === "accounts.google.com" || /sign in|log in|choose an account/.test(pageText)) {
      throw new Error("Google Flow session is not signed in. Use 'Open Flow Login Window', sign in, then retry.");
    }
    if (/not available|waitlist|not supported in your region/.test(pageText)) {
      throw new Error("Google Flow is unavailable for this account or region. Confirm Flow access in the interactive login window.");
    }

    // Step 3: Enter Studio Project Canvas. These controls are recorded in
    // data/google-flow-workflow.json from the user's actual Google Flow UI.
    await addStep("3. Open Studio Canvas", "Opening a new Google Flow project...", page);
    await clickLabeledControl(page, ["new project", "create with google flow"]);
    await new Promise(r => setTimeout(r, 2500));

    await addStep("3.1 Select Agent", "Selecting the Google Flow Agent workspace...", page);
    await clickLabeledControl(page, ["agent"]);
    await new Promise(r => setTimeout(r, 1000));

    await addStep("3.2 Confirm Canvas", `Preparing the Google Flow ${isVideo ? "video" : "image"} canvas...`, page);
    await addStep("3.3 Select Media Type", `Selecting ${isVideo ? "Video" : "Image"} and 9:16 vertical format in Google Flow...`, page);
    await selectFlowMediaMode(page, isVideo);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 4: Locate Exact Prompt Input Box
    await addStep("4. Locate Prompt Bar", "Targeting prompt input box in studio...", page);

    await focusPrompt(page);
    await new Promise(r => setTimeout(r, 500));

    // Step 5: Type Prompt
    await addStep("5. Injecting Prompt", `Typing creative prompt: "${prompt.slice(0, 100)}..."`, page);
    await page.keyboard.type(prompt, { delay: 10 });
    await new Promise(r => setTimeout(r, 1000));

    // Step 6: Submit Generation
    await addStep("6. Trigger Generation", "Submitting prompt to Google Flow AI engine...", page);
    // In the current Flow UI the enabled submit control is an arrow icon with
    // no stable text label. Enter triggers the same generation action.
    await page.keyboard.press("Enter");
    await new Promise(r => setTimeout(r, 4000));

    // Step 7: Wait for rendering pipeline to complete
    await addStep("7. Rendering in Google Flow", "Generation in progress in Google Flow. Waiting for render pipeline...", page);
    await new Promise(r => setTimeout(r, isVideo ? 75000 : 45000));

    // Step 8: Trigger Download in Google Flow UI
    await addStep("7.1 Locate Media Card Menu", "Hovering on generated media card and clicking menu...", page);

    // Hover on the newest rendered media card to reveal its action buttons
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("div[id^='fe_id_'], div[class*='sc-'], div"));
      const mediaCard = cards.find(c => {
        const rect = c.getBoundingClientRect();
        return rect.width > 250 && rect.height > 150 && rect.top > 80 && rect.top < window.innerHeight * 0.7;
      });
      if (mediaCard) {
        mediaCard.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        mediaCard.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // Click the 3-dot 'more_vert' menu on the card or toolbar
    const moreClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, [role='button'], div, svg"));
      const moreBtn = buttons.find(b => {
        const txt = (b.innerText || b.getAttribute("aria-label") || b.getAttribute("title") || "").trim().toLowerCase();
        const rect = b.getBoundingClientRect();
        return (txt === "more_vert" || txt.includes("more options") || txt === "more") && rect.top > 60 && rect.top < window.innerHeight * 0.8;
      });
      if (moreBtn) {
        moreBtn.click();
        return true;
      }
      return false;
    });

    if (!moreClicked) {
      await page.mouse.click(556, 175);
      await new Promise(r => setTimeout(r, 400));
      await page.mouse.click(794, 104);
    }
    await new Promise(r => setTimeout(r, 800));

    // Hover / Click 'Download' in the menu to reveal quality options
    await addStep("7.2 Select Download Menu", "Selecting Download option from card menu...", page);
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("button, [role='menuitem'], [role='button'], div, span"));
      const dlItem = items.find(i => {
        const txt = (i.innerText || i.getAttribute("aria-label") || "").trim().toLowerCase();
        return txt === "download" || txt.startsWith("download");
      });
      if (dlItem) {
        dlItem.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        dlItem.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        dlItem.click();
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // Click '720p' / '720p Original Size' in the quality submenu
    await addStep("7.3 Choose 720p Resolution", "Selecting 720p Original Size download...", page);
    const sizeClicked = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("button, [role='menuitem'], [role='button'], div, span"));
      const sizeItem = items.find(i => {
        const txt = (i.innerText || "").toLowerCase();
        return txt.includes("720p") || txt.includes("original size");
      });
      if (sizeItem) {
        sizeItem.click();
        return true;
      }
      return false;
    });

    if (!sizeClicked) {
      await page.mouse.click(675, 525);
      await new Promise(r => setTimeout(r, 300));
      await page.mouse.click(933, 394);
    }

    // Step 9: Discover and Wait for the Downloaded File across all download directories
    await addStep("8. Extracting Rendered Media", "Monitoring downloaded media file from Google Flow...", page);

    let downloadedFilePath = null;
    const maxWaitSeconds = 75;

    for (let sec = 0; sec < maxWaitSeconds; sec++) {
      let activeCrDownload = false;
      const recentMediaFiles = [];

      for (const dir of candidateDirs) {
        if (!fs.existsSync(dir)) continue;
        try {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            const fullPath = path.join(dir, f);
            if (f.endsWith(".crdownload") || f.endsWith(".tmp") || f.endsWith(".part")) {
              const stat = fs.statSync(fullPath);
              if (stat.mtimeMs >= runStartedAt - 120000) {
                activeCrDownload = true;
              }
              continue;
            }

            const isMedia = /\.(mp4|webm|mov|png|jpg|jpeg|webp|gif)$/i.test(f);
            if (!isMedia) continue;

            const stat = fs.statSync(fullPath);
            const isRecent = stat.mtimeMs >= (runStartedAt - 300000);
            if (isRecent && stat.size > 50000) {
              recentMediaFiles.push({ path: fullPath, mtimeMs: stat.mtimeMs, size: stat.size });
            }
          }
        } catch {}
      }

      if (recentMediaFiles.length > 0 && !activeCrDownload) {
        recentMediaFiles.sort((a, b) => b.mtimeMs - a.mtimeMs);
        const topCandidate = recentMediaFiles[0];

        // Ensure file write is finished by checking size stability
        await new Promise(r => setTimeout(r, 1200));
        try {
          const newSize = fs.statSync(topCandidate.path).size;
          if (newSize === topCandidate.size && newSize > 0) {
            downloadedFilePath = topCandidate.path;
            console.log(`[Google Flow Agent] Found completed media file: ${downloadedFilePath} (${newSize} bytes)`);
            break;
          }
        } catch {}
      }

      if (activeCrDownload) {
        console.log(`[Google Flow Agent] Download in progress in candidate directory (second ${sec + 1})...`);
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    let finalMediaUrl = null;

    // Direct upload of downloaded file
    if (downloadedFilePath && fs.existsSync(downloadedFilePath)) {
      await addStep("8.1 Uploading Downloaded File", `Uploading ${path.basename(downloadedFilePath)} to Cloudinary...`, page);
      const uploadRes = await uploadLocalFileToCloudinary(
        downloadedFilePath,
        "video",
        "instagram-agent/flow-creations"
      );
      finalMediaUrl = uploadRes.secure_url;

      // Only delete if it's inside our temp data folder (preserve user's personal Downloads)
      if (downloadedFilePath.startsWith(downloadDir)) {
        try { fs.unlinkSync(downloadedFilePath); } catch {}
      }
    } else {
      // Step 8.2: In-Page Direct Binary Extraction (Extract from page memory if file didn't touch disk)
      await addStep("8.2 Direct In-Page Extraction", "Extracting rendered video/image blob directly from page...", page);

      const inPageExtraction = await page.evaluate(async () => {
        const blobToBase64 = (blob) => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(blob);
        });

        // 1. Check <video> elements
        const videos = Array.from(document.querySelectorAll("video"));
        for (const v of videos) {
          const src = v.src || v.currentSrc || v.querySelector("source")?.src;
          if (src && (src.startsWith("blob:") || src.startsWith("http")) && !src.includes("Avatar.mp4") && !src.includes("banner")) {
            try {
              const res = await fetch(src);
              const blob = await res.blob();
              if (blob && blob.size > 5000) {
                const base64 = await blobToBase64(blob);
                return { type: "video", base64, size: blob.size, mime: blob.type };
              }
            } catch (e) {}
          }
        }

        // 2. Check <img> elements
        const imgs = Array.from(document.querySelectorAll("img"));
        for (const img of imgs) {
          const src = img.src || "";
          if (src && (src.startsWith("blob:") || src.startsWith("http")) && !src.includes("avatar") && !src.includes("googleusercontent.com/a/")) {
            try {
              const res = await fetch(src);
              const blob = await res.blob();
              if (blob && blob.size > 5000) {
                const base64 = await blobToBase64(blob);
                return { type: "image", base64, size: blob.size, mime: blob.type };
              }
            } catch (e) {}
          }
        }

        return null;
      });

      if (inPageExtraction?.base64) {
        await addStep("8.3 Uploading Extracted Media", `Uploading extracted in-page ${inPageExtraction.type} (${Math.round(inPageExtraction.size / 1024)} KB) to Cloudinary...`, page);
        const buffer = Buffer.from(inPageExtraction.base64, "base64");
        const uploadRes = await uploadBufferToCloudinary(
          buffer,
          inPageExtraction.type === "video" ? "video" : "image",
          "instagram-agent/flow-creations"
        );
        finalMediaUrl = uploadRes.secure_url;
      }
    }

    if (finalMediaUrl) {
      await addStep("9. Finished & Attached", `Creation ready and saved to draft: ${finalMediaUrl}`, page);
      sessionData.status = "completed";
      sessionData.resultUrl = finalMediaUrl;

      if (contentId && contentId !== "live_session") {
        await InstagramContent.updateOne({ _id: contentId }, {
          $set: {
            assetUrl: finalMediaUrl,
            assetSource: "google_flow_automated",
            mediaGenerationStatus: "ready",
            status: "ready",
          }
        });

        await logInstagramActivity(
          "google_flow_automated",
          `Google Flow automation successfully created and attached media to draft.`,
          { contentId: String(contentId), url: finalMediaUrl }
        );
      }

      return { url: finalMediaUrl, source: "google_flow_automated", session: sessionData };
    }

    throw new Error("Google Flow did not expose a downloadable media file. No alternative provider was used.");
  } catch (err) {
    let pageContext = "";
    if (activePage && !activePage.isClosed()) {
      try {
        const state = await activePage.evaluate(() => ({
          title: document.title,
          url: location.href,
          text: (document.body?.innerText || "").replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[redacted email]").slice(0, 160),
        }));
        const host = new URL(state.url).hostname;
        if (host === "accounts.google.com") {
          pageContext = " Google Flow redirected to Google Sign in.";
        } else {
          pageContext = ` Page: ${state.title || "untitled"} (${host}). ${state.text}`;
        }
      } catch {}
    }
    await addStep("Notice", `Browser automation status: ${err.message}${pageContext}`);
    sessionData.status = "error";
    sessionData.error = `${err.message}${pageContext}`;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }

  return { source: "google_flow_session", session: sessionData };
}
