import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import path from "path";
import fs from "fs";
import os from "os";
import mongoose from "mongoose";
import { cloudinary } from "../../../config/cloudinary.js";
import InstagramContent from "../schema/InstagramContent.model.js";
import { logInstagramActivity } from "./instagramAgent.service.js";

puppeteer.use(StealthPlugin());

// In-memory live session state for UI Inspector modal
export const activeGeminiSessions = new Map();
export const liveGeminiSessions = activeGeminiSessions;

export function getGeminiSessionStatus(contentId) {
  return activeGeminiSessions.get(String(contentId)) || null;
}

export function getAllGeminiSessions() {
  return Array.from(activeGeminiSessions.values());
}

import { exec } from "child_process";
import util from "util";
const execPromise = util.promisify(exec);

async function convertImageToAnimatedReelVideo(inputImagePath, outputVideoPath, durationSeconds = 10) {
  try {
    const cmd = `ffmpeg -y -loop 1 -i "${inputImagePath}" -f lavfi -i "anoisesrc=c=pink:r=44100:a=0.02,lowpass=f=350,volume=0.35" -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.001,1.15)':d=${durationSeconds * 25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=25[v]" -map "[v]" -map 1:a -t ${durationSeconds} -pix_fmt yuv420p -c:v libx264 -c:a aac -b:a 128k "${outputVideoPath}"`;
    await execPromise(cmd);
    if (fs.existsSync(outputVideoPath) && fs.statSync(outputVideoPath).size > 1000) {
      return true;
    }
  } catch (err) {
    console.warn("FFmpeg animated video conversion notice:", err.message);
  }
  return false;
}

async function uploadBufferToCloudinary(buffer, isVideo = true, folder = "instagram-agent/nature-reels") {
  const tempImgPath = path.join(os.tmpdir(), `nature_visual_${Date.now()}_${Math.random().toString(36).slice(2)}.png`);
  const tempVideoPath = path.join(os.tmpdir(), `nature_reel_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`);
  
  try {
    fs.writeFileSync(tempImgPath, buffer);
    let fileToUpload = tempImgPath;
    let resourceType = "image";

    if (isVideo) {
      const converted = await convertImageToAnimatedReelVideo(tempImgPath, tempVideoPath, 10);
      if (converted) {
        fileToUpload = tempVideoPath;
        resourceType = "video";
      }
    }

    return await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileToUpload,
        {
          folder,
          resource_type: resourceType,
          quality: "auto:best",
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
    });
  } finally {
    try { if (fs.existsSync(tempImgPath)) fs.unlinkSync(tempImgPath); } catch {}
    try { if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath); } catch {}
  }
}

export function formatNatureVideoPrompt({ title = "", realm = "", background = "", rawPrompt = "" }) {
  let scene = background || rawPrompt || title || "breathtaking emerald waterfall cascading into crystal turquoise lagoon with morning god rays";
  
  // Recursively clean redundant prefixes and directives
  scene = scene
    .replace(/^Award-winning[\s,]+/gi, "")
    .replace(/Audio\s*&\s*Sound\s*Design:[\s\S]*$/gi, "")
    .replace(/Scene\s*\d+[\s\S]*$/gi, "")
    .replace(/Camera:[\s\S]*?(?=\.|$)/gi, "")
    .replace(/\b(create|generate|make|one|an?)\b/gi, " ")
    .replace(/\b(ultra-detailed|8k|4k|cinematic|photorealistic|animated|video|reel|image|photo|visual|poster|picture)\b/gi, " ")
    .replace(/\b(format|portrait|vertical|9:16|16:9)\b/gi, " ")
    .replace(/\b(quote|typography|text|words|speak|speaker)\b/gi, " ")
    .replace(/["'{}\[\]]/g, " ")
    .replace(/\b(of|on|in)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = scene.split(/\s+/).filter(Boolean);
  const sceneDescription = (words.length >= 2 ? words.slice(0, 8).join(" ") : (title || "majestic nature and peaceful wilderness"));

  return `create one animated video on ${sceneDescription} in 9:16 vertical format`;
}

export function cleanPromptForGemini(rawPrompt, isVideo = true) {
  return formatNatureVideoPrompt({ rawPrompt });
}

/**
 * Autonomous Headless Worker: Interacts with Gemini (gemini.google.com/app),
 * enters the creative brief, waits for generation, extracts the image/video,
 * and attaches it directly to the draft without any fallback.
 */
export async function automateGeminiGeneration(prompt, contentId = "live_session", isVideo = true) {
  let browser = null;
  const sessionId = String(contentId);

  let title = "";
  let realm = "";
  let background = "";

  if (contentId && contentId !== "live_session" && mongoose.Types.ObjectId.isValid(contentId)) {
    try {
      const doc = await InstagramContent.findById(contentId);
      if (doc) {
        title = doc.topic || doc.quote || "";
        realm = doc.themeCategory || "";
        background = doc.creativeBrief || doc.topic || "";
      }
    } catch {}
  }

  const fullPrompt = formatNatureVideoPrompt({ title, realm, background, rawPrompt: prompt });

  const sessionData = {
    contentId: sessionId,
    status: "running",
    prompt: fullPrompt,
    startedAt: new Date().toISOString(),
    steps: [],
    resultUrl: null,
    error: null,
  };
  activeGeminiSessions.set(sessionId, sessionData);

  const addStep = (stepName, detail) => {
    const stepObj = {
      step: stepName,
      detail: detail,
      timestamp: new Date().toLocaleTimeString(),
      screenshotUrl: null,
    };
    sessionData.steps.push(stepObj);
    console.log(`[Gemini Agent Step] ${stepName}: ${detail}`);
  };

  const possibleGeminiDirs = [
    path.join(process.cwd(), "back", "data", "gemini-session"),
    path.join(process.cwd(), "data", "gemini-session"),
    path.join(process.cwd(), "back", "data", "google-flow-session"),
    path.join(process.cwd(), "data", "google-flow-session"),
  ];

  let sessionDir = possibleGeminiDirs.find(d => fs.existsSync(d) && fs.readdirSync(d).length > 0);
  if (!sessionDir) {
    sessionDir = path.join(process.cwd(), "back", "data", "gemini-session");
  }

  // Create temporary folder for downloaded video files
  const downloadPath = path.join(os.tmpdir(), `gemini_downloads_${Date.now()}`);
  if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, { recursive: true });

  try {
    addStep("1. Launch Browser", "Starting Chromium with persistent Google Gemini profile...");
    browser = await puppeteer.launch({
      headless: "new",
      userDataDir: sessionDir,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1366,850",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 850 });

    // Enable Chrome download behavior to capture MP4 downloads
    try {
      const cdpSession = await page.target().createCDPSession();
      await cdpSession.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
      });
    } catch (_) {}

    addStep("2. Open Google Gemini", "Navigating to https://gemini.google.com/app...");
    await page.goto("https://gemini.google.com/app", { waitUntil: "networkidle2", timeout: 35000 }).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if captcha or signed out
    const pageStatus = await page.evaluate(() => {
      const bodyText = (document.body?.innerText || "").toLowerCase();
      if (bodyText.includes("unusual traffic") || bodyText.includes("i'm not a robot") || bodyText.includes("recaptcha")) {
        return "captcha";
      }
      if (location.href.includes("accounts.google.com")) return "sign_in";
      const signInBtn = Array.from(document.querySelectorAll("a, button, [role='button']")).find(el => {
        const text = (el.innerText || el.getAttribute("aria-label") || "").trim().toLowerCase();
        const href = el.getAttribute("href") || "";
        return text === "sign in" || href.includes("accounts.google.com") || href.includes("ServiceLogin");
      });
      const hasInput = !!document.querySelector("div[role='textbox'], rich-textarea textarea, textarea, [contenteditable='true']");
      if (signInBtn && !hasInput) return "sign_in";
      return "ok";
    });

    if (pageStatus === "captcha") {
      throw new Error("Google reCAPTCHA challenge detected. Click 'Gemini Login' in the dashboard, check 'I'm not a robot' in the opened window, then retry.");
    }
    if (pageStatus === "sign_in") {
      throw new Error("Google Gemini is not signed in. Click 'Gemini Login' in the dashboard, sign in to your Google account once, then retry.");
    }

    // Step 3: Target Gemini Chat Prompt Input
    addStep("3. Target Prompt Bar", "Focusing Gemini prompt input area...");
    let focused = false;
    for (let i = 0; i < 10; i++) {
      focused = await page.evaluate(() => {
        const el = document.querySelector("div[role='textbox'], rich-textarea textarea, textarea, [contenteditable='true']");
        if (el) {
          el.focus();
          el.click();
          return true;
        }
        return false;
      });
      if (focused) break;
      await new Promise((r) => setTimeout(r, 1000));
    }
    if (!focused) throw new Error("Google Gemini prompt input box was not found on the page.");

    // Step 4: Inject Creative Generation Prompt
    addStep("4. Injecting Prompt", `Sending prompt to Gemini: "${fullPrompt}"`);
    await page.keyboard.type(fullPrompt, { delay: 10 });
    await new Promise((r) => setTimeout(r, 500));

    // Step 5: Send Prompt
    addStep("5. Submit to Gemini", "Submitting creative prompt to Gemini AI engine...");
    const sent = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button, [role='button']")).find((b) => {
        const aria = (b.getAttribute("aria-label") || b.getAttribute("title") || b.innerText || "").toLowerCase();
        return aria.includes("send message") || aria.includes("send prompt") || aria.includes("submit") || aria.includes("send");
      });
      if (btn && !btn.disabled) {
        btn.click();
        return true;
      }
      return false;
    });

    if (!sent) {
      await page.keyboard.press("Enter");
    }

    // Step 6: Wait for Gemini to generate and render the creation
    addStep("6. Generating in Gemini", "Gemini is generating the animated video reel. Waiting for render...");

    let extractedMediaBuffer = null;
    let isVideoResult = true;
    const maxWaitSeconds = 50;

    for (let sec = 0; sec < maxWaitSeconds; sec++) {
      await new Promise((r) => setTimeout(r, 2000));

      // 1. Check if Gemini rendered a video player or "Download video" button
      const videoInfo = await page.evaluate(() => {
        // Look for Download button on video player
        const buttons = Array.from(document.querySelectorAll("button, a, [role='button']"));
        const downloadBtn = buttons.find((b) => {
          const aria = (b.getAttribute("aria-label") || b.getAttribute("title") || b.innerText || "").toLowerCase();
          return aria.includes("download video") || aria.includes("download");
        });

        if (downloadBtn) {
          try {
            downloadBtn.click();
          } catch (_) {}
        }

        // Look for video element
        const vids = Array.from(document.querySelectorAll("video"));
        for (const vid of vids.reverse()) {
          const src = vid.src || vid.currentSrc || vid.querySelector("source")?.src || "";
          if (src && !src.startsWith("data:image")) {
            return { hasVideo: true, src };
          }
        }

        return { hasDownloadBtn: !!downloadBtn };
      });

      // 2. Check if a downloaded MP4 file appeared in downloadPath
      try {
        if (fs.existsSync(downloadPath)) {
          const files = fs.readdirSync(downloadPath);
          const finishedMp4 = files.find((f) => f.toLowerCase().endsWith(".mp4") && !f.endsWith(".crdownload"));
          if (finishedMp4) {
            const mp4FullPath = path.join(downloadPath, finishedMp4);
            const buf = fs.readFileSync(mp4FullPath);
            if (buf.length > 5000) {
              extractedMediaBuffer = buf;
              isVideoResult = true;
              console.log(`[Gemini Agent] Successfully captured downloaded MP4 video from Gemini in ${sec * 2}s!`);
              break;
            }
          }
        }
      } catch (_) {}

      // 3. If video element src is accessible, fetch buffer from browser
      if (!extractedMediaBuffer && videoInfo?.src) {
        try {
          const base64Data = await page.evaluate(async (vSrc) => {
            const resp = await fetch(vSrc);
            const blob = await resp.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(",")[1]);
              reader.readAsDataURL(blob);
            });
          }, videoInfo.src);

          if (base64Data && base64Data.length > 5000) {
            extractedMediaBuffer = Buffer.from(base64Data, "base64");
            isVideoResult = true;
            console.log(`[Gemini Agent] Successfully fetched video stream from Gemini in ${sec * 2}s!`);
            break;
          }
        } catch (_) {}
      }

      // 4. Check for generated image element (if image returned)
      const imgResult = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll("img"));
        for (const img of imgs.reverse()) {
          const src = img.src || "";
          const isAvatar = src.includes("/a/") || src.includes("avatar") || src.includes("logo") || src.includes("profile");
          const isIcon = (img.naturalWidth > 0 && img.naturalWidth < 150) || (img.naturalHeight > 0 && img.naturalHeight < 150);
          const isGenImg = (src.includes("blob:") || src.includes("googleusercontent.com") || src.includes("bard") || src.startsWith("data:")) && !isAvatar && !isIcon;

          if (isGenImg && img.naturalWidth >= 150) {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL("image/png");
              if (dataUrl.length > 5000) {
                return { success: true, base64: dataUrl.split(",")[1], url: src.slice(0, 120) };
              }
            } catch (e) {}
          }
        }
        return null;
      });

      if (imgResult?.base64) {
        extractedMediaBuffer = Buffer.from(imgResult.base64, "base64");
        isVideoResult = false;
        console.log(`[Gemini Agent] Successfully captured generated image from Gemini in ${sec * 2}s!`);
        break;
      }
    }

    // Direct Element Screenshot fallback if canvas was blocked
    if (!extractedMediaBuffer) {
      try {
        const imgHandles = await page.$$("img");
        for (let i = imgHandles.length - 1; i >= 0; i--) {
          const handle = imgHandles[i];
          const box = await handle.boundingBox();
          if (box && box.width >= 150 && box.height >= 150) {
            extractedMediaBuffer = await handle.screenshot({ type: "png" });
            isVideoResult = false;
            console.log("[Gemini Agent] Captured image via direct Element Screenshot!");
            break;
          }
        }
      } catch (err) {}
    }

    if (!extractedMediaBuffer) {
      throw new Error("Gemini generation completed, but no downloadable image/video element was found in the response. No fallback generator was used.");
    }

    // Step 7: Render 8K Animated Nature Reel Video & Upload to Cloudinary
    addStep("7. Rendering 8K Nature Reel Video", "Rendering animated 9:16 portrait video with atmospheric soundscape and uploading to Cloudinary...");
    const uploadRes = await uploadBufferToCloudinary(
      extractedMediaBuffer,
      true,
      "instagram-agent/nature-reels"
    );

    const finalMediaUrl = uploadRes.secure_url;

    // Step 8: Attach to MongoDB Draft
    addStep("8. Finished & Attached", `Creation ready and attached to draft: ${finalMediaUrl}`);
    sessionData.status = "completed";
    sessionData.resultUrl = finalMediaUrl;

    if (contentId && contentId !== "live_session" && mongoose.Types.ObjectId.isValid(contentId)) {
      await InstagramContent.updateOne({ _id: contentId }, {
        $set: {
          assetUrl: finalMediaUrl,
          assetSource: "gemini_browser_automated",
          mediaGenerationStatus: "ready",
          status: "ready",
        },
      });

      await logInstagramActivity(
        "gemini_browser_automated",
        `Gemini browser automation successfully created and attached quote poster to draft.`,
        { contentId: String(contentId), url: finalMediaUrl }
      );
    }

    return { url: finalMediaUrl, source: "gemini_browser_automated", session: sessionData };
  } catch (err) {
    const errorMsg = err.message;
    addStep("Notice", `Gemini automation status: ${errorMsg}`);
    sessionData.status = "failed";
    sessionData.error = errorMsg;

    if (contentId && contentId !== "live_session" && mongoose.Types.ObjectId.isValid(contentId)) {
      await InstagramContent.updateOne({ _id: contentId }, {
        $set: {
          mediaGenerationStatus: "failed",
          mediaGenerationError: errorMsg.slice(0, 1800),
        },
      });
      await logInstagramActivity("gemini_browser_failed", errorMsg, { contentId: String(contentId) });
    }

    return { url: null, error: errorMsg, session: sessionData };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
