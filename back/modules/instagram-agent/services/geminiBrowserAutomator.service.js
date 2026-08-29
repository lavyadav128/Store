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

async function uploadBufferToCloudinary(buffer, resourceType = "image", folder = "instagram-agent/gemini-creations") {
  const tempPath = path.join(os.tmpdir(), `gemini_creation_${Date.now()}_${Math.random().toString(36).slice(2)}.png`);
  try {
    fs.writeFileSync(tempPath, buffer);
    return await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        tempPath,
        {
          folder,
          resource_type: resourceType === "video" ? "video" : "image",
          quality: "auto:best",
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
    });
  } finally {
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch {}
  }
}

export function formatNatureVideoPrompt({ title = "", realm = "", background = "", rawPrompt = "" }) {
  let scene = background || rawPrompt || title || "breathtaking emerald waterfall into crystal lagoon with golden sunbeams";
  scene = scene.replace(/^Award-winning[\s,]+/i, "")
               .replace(/Audio\s*&\s*Sound\s*Design:[\s\S]*$/i, "")
               .replace(/Scene\s*\d+[\s\S]*$/i, "")
               .replace(/Camera:[\s\S]*?(?=\.|$)/gi, "")
               .replace(/^(create|generate)\s+(an\s+)?(image|visual|reel|video|poster)\s+of\s+/i, "")
               .replace(/(in\s+)?9:16\s+vertical\s+(format|visual|poster)?/gi, "")
               .replace(/\s+beautifully/gi, "")
               .replace(/["'{}\[\]]/g, " ")
               .trim();

  const sceneWords = scene.split(/\s+/).slice(0, 10).join(" ") || "majestic nature landscape";
  return `create ultra-detailed 8K cinematic animated nature video of ${sceneWords} in 9:16 vertical format`;
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
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
  }

  try {
    addStep("1. Launch Browser", "Starting Chromium with persistent Google Gemini profile...");
    browser = await puppeteer.launch({
      headless: "new",
      userDataDir: sessionDir,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-quic",
        "--disable-session-crashed-bubble",
        "--no-first-run",
        "--window-size=1366,850",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 850 });

    addStep("2. Open Google Gemini", "Navigating to https://gemini.google.com/app...");
    await page.goto("https://gemini.google.com/app", { waitUntil: "networkidle2", timeout: 35000 }).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if definitely logged out
    const isSignedOut = await page.evaluate(() => {
      if (location.href.includes("accounts.google.com")) return true;
      const signInBtn = Array.from(document.querySelectorAll("a, button, [role='button']")).find(el => {
        const text = (el.innerText || el.getAttribute("aria-label") || "").trim().toLowerCase();
        const href = el.getAttribute("href") || "";
        return text === "sign in" || href.includes("accounts.google.com") || href.includes("ServiceLogin");
      });
      const hasInput = !!document.querySelector("div[role='textbox'], rich-textarea textarea, textarea, [contenteditable='true']");
      return !!signInBtn && !hasInput;
    });

    if (isSignedOut) {
      throw new Error("Google Gemini is not signed in. Click 'Open Gemini Login Window' in dashboard, sign in to your Google account once, then retry.");
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
    addStep("6. Generating in Gemini", "Gemini is generating the quote visual. Waiting for render...");

    let extractedMediaBuffer = null;
    let extractedMediaUrl = null;
    const maxWaitSeconds = 40;

    for (let sec = 0; sec < maxWaitSeconds; sec++) {
      await new Promise((r) => setTimeout(r, 2000));

      const result = await page.evaluate(() => {
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

      if (result?.base64) {
        extractedMediaBuffer = Buffer.from(result.base64, "base64");
        extractedMediaUrl = result.url;
        console.log(`[Gemini Agent] Successfully captured generated quote poster from Gemini in ${sec * 2}s!`);
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
            console.log("[Gemini Agent] Captured image via direct Element Screenshot!");
            break;
          }
        }
      } catch (err) {}
    }

    if (!extractedMediaBuffer) {
      throw new Error("Gemini generation completed, but no downloadable image/video element was found in the response. No fallback generator was used.");
    }

    // Step 7: Upload Captured Media to Cloudinary
    addStep("7. Uploading Creation", "Uploading Gemini generated quote poster to Cloudinary...");
    const uploadRes = await uploadBufferToCloudinary(
      extractedMediaBuffer,
      "image",
      "instagram-agent/gemini-creations"
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
