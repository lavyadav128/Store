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
import ffmpegStatic from "ffmpeg-static";
import chromium from "@sparticuz/chromium";

const execPromise = util.promisify(exec);

const getFfmpegBin = () => {
  if (ffmpegStatic && typeof ffmpegStatic === "string" && fs.existsSync(ffmpegStatic)) {
    return ffmpegStatic;
  }
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }
  return "ffmpeg";
};

async function mergeImageWithAudio(inputImagePath, inputAudioPath, outputVideoPath, durationSeconds = 12) {
  try {
    const ffmpeg = getFfmpegBin();
    const cmd = `"${ffmpeg}" -y -loop 1 -i "${inputImagePath}" -i "${inputAudioPath}" -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0008,1.12)':d=${durationSeconds * 25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25[v]" -map "[v]" -map 1:a -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k -t ${durationSeconds} -shortest "${outputVideoPath}"`;
    await execPromise(cmd);
    if (fs.existsSync(outputVideoPath) && fs.statSync(outputVideoPath).size > 1000) {
      return true;
    }
  } catch (err) {
    console.warn("FFmpeg audio-image merge notice:", err.message);
  }
  return false;
}

async function convertImageToAnimatedReelVideo(inputImagePath, outputVideoPath, durationSeconds = 10) {
  try {
    const ffmpeg = getFfmpegBin();
    const cmd = `"${ffmpeg}" -y -loop 1 -i "${inputImagePath}" -f lavfi -i "anoisesrc=c=pink:r=44100:a=0.02,lowpass=f=350,volume=0.35" -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.001,1.15)':d=${durationSeconds * 25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25[v]" -map "[v]" -map 1:a -t ${durationSeconds} -pix_fmt yuv420p -c:v libx264 -c:a aac -b:a 128k "${outputVideoPath}"`;
    await execPromise(cmd);
    if (fs.existsSync(outputVideoPath) && fs.statSync(outputVideoPath).size > 1000) {
      return true;
    }
  } catch (err) {
    console.warn("FFmpeg animated video conversion notice:", err.message);
  }
  return false;
}

async function uploadBufferToCloudinary(buffer, isVideo = true, folder = "instagram-agent/nature-reels", audioBuffer = null) {
  const tempImgPath = path.join(os.tmpdir(), `gemini_img_${Date.now()}_${Math.random().toString(36).slice(2)}.png`);
  const tempAudioPath = path.join(os.tmpdir(), `gemini_audio_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);
  const tempVideoPath = path.join(os.tmpdir(), `gemini_vid_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`);
  
  try {
    fs.writeFileSync(tempImgPath, buffer);
    let fileToUpload = tempImgPath;
    let resourceType = "image";

    // If native Gemini audio track was captured alongside image, merge them into 16:9 MP4 Reel
    if (audioBuffer && audioBuffer.length > 3000) {
      fs.writeFileSync(tempAudioPath, audioBuffer);
      const merged = await mergeImageWithAudio(tempImgPath, tempAudioPath, tempVideoPath, 15);
      if (merged) {
        fileToUpload = tempVideoPath;
        resourceType = "video";
        isVideo = true;
      }
    } else if (isVideo) {
      resourceType = "video";
      const isAlreadyMp4 = buffer.slice(4, 8).toString("utf8") === "ftyp" || buffer.slice(0, 4).toString("utf8") === "\x00\x00\x00\x18";
      if (!isAlreadyMp4) {
        const converted = await convertImageToAnimatedReelVideo(tempImgPath, tempVideoPath, 12);
        if (converted) {
          fileToUpload = tempVideoPath;
        }
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
    try { if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath); } catch {}
    try { if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath); } catch {}
  }
}

export function getDetailedSoundscapeDescription(realm = "", title = "", soundscape = "") {
  if (soundscape && soundscape.length > 10) return soundscape;
  const r = `${realm} ${title}`.toLowerCase();
  if (r.includes("morning") || r.includes("sunrise") || r.includes("dawn")) {
    return "soothing morning birdsong, gentle valley breeze, and uplifting acoustic guitar melodies";
  }
  if (r.includes("sunset") || r.includes("dusk") || r.includes("golden hour")) {
    return "calming ocean surf resonance, warm twilight breeze, and deep ambient meditation frequencies";
  }
  if (r.includes("wildlife") || r.includes("deer") || r.includes("tiger") || r.includes("elephant")) {
    return "peaceful wilderness atmosphere, soft leaves rustling, and gentle resonant cello chords";
  }
  if (r.includes("forest") || r.includes("wood") || r.includes("jungle") || r.includes("tree")) {
    return "soothing ancient forest wind, trickling brook water, and Zen bamboo flute harmonies";
  }
  if (r.includes("ocean") || r.includes("sea") || r.includes("coast") || r.includes("beach")) {
    return "rhythmic turquoise waves crashing softly, sea spray whisper, and warm acoustic synthesizer pads";
  }
  if (r.includes("rain") || r.includes("storm") || r.includes("waterfall") || r.includes("river")) {
    return "gentle rainfall dripping from vibrant green leaves, cascading waterfall resonance, and calming piano notes";
  }
  if (r.includes("night") || r.includes("milky way") || r.includes("star") || r.includes("aurora") || r.includes("celestial")) {
    return "ethereal celestial space pads, subtle night crickets, and peaceful crystalline harp resonance";
  }
  if (r.includes("tiny") || r.includes("butterfly") || r.includes("bird") || r.includes("flower") || r.includes("macro")) {
    return "delicate acoustic harp melodies, soft morning breeze chimes, and gentle nature birdsong";
  }
  if (r.includes("mountain") || r.includes("peak") || r.includes("alps") || r.includes("cliff")) {
    return "crisp mountain breeze whisper, soaring alpine string harmonies, and grounding acoustic cello";
  }
  if (r.includes("season") || r.includes("autumn") || r.includes("winter") || r.includes("snow") || r.includes("spring")) {
    return "cozy leaves rustling, peaceful singing bowl harmonics, and gentle acoustic piano chords";
  }
  return "soothing ambient nature soundscape with gentle acoustic resonance and peaceful wilderness breeze";
}

export function formatNaturePrompt({ title = "", realm = "", background = "", soundscape = "", rawPrompt = "", isVideo = true }) {
  let topic = title || realm || rawPrompt || background || "nature";
  
  // Clean wrapper tokens to get concise topic
  topic = topic
    .replace(/^create\s+(one\s+)?(animated\s+video|video|photorealistic\s+8k\s+image|image)\s+(on|of)\s+/gi, "")
    .replace(/\s+(in\s+16:9\s+format|with|along\s+with|Audio\s*&|Scene\s*\d|Detailed)[\s\S]*$/gi, "")
    .replace(/["'{}\[\]\n\r]/g, " ")
    .replace(/[🌅🌄🦌🌲🌊🌧️🌌🦋🏔️🍂🐘🌍✨🌿🌊🏔️]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Keep topic concise (3-5 words max)
  const words = topic.split(" ").filter(Boolean);
  if (words.length > 5) {
    topic = words.slice(0, 5).join(" ");
  }

  if (!topic) topic = "nature";

  if (isVideo) {
    return `create video on ${topic.toLowerCase()}`;
  } else {
    return `create image on ${topic.toLowerCase()}`;
  }
}

export function formatNatureVideoPrompt(opts) {
  return formatNaturePrompt({ ...opts, isVideo: true });
}

export function formatNatureImagePrompt(opts) {
  return formatNaturePrompt({ ...opts, isVideo: false });
}

export function cleanPromptForGemini(rawPrompt, isVideo = true) {
  return formatNaturePrompt({ rawPrompt, isVideo });
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
  let soundscape = "";

  if (contentId && contentId !== "live_session" && mongoose.Types.ObjectId.isValid(contentId)) {
    try {
      const doc = await InstagramContent.findById(contentId);
      if (doc) {
        title = doc.topic || doc.quote || "";
        realm = doc.themeCategory || "";
        background = doc.visualScene || doc.creativeBrief || doc.topic || "";
        soundscape = doc.soundscape || doc.audioTrack?.title || "";
        if (doc.type === "post" || doc.type === "image") {
          isVideo = false;
        } else if (doc.type === "reel" || doc.type === "video") {
          isVideo = true;
        }
      }
    } catch {}
  }

  const fullPrompt = formatNaturePrompt({ title, realm, background, soundscape, rawPrompt: prompt, isVideo });
  let page = null;

  const sessionData = {
    contentId: sessionId,
    status: "running",
    prompt: fullPrompt,
    mediaType: isVideo ? "video" : "image",
    startedAt: new Date().toISOString(),
    steps: [],
    lastScreenshot: null,
    currentStep: "Starting",
    currentDetail: `Initializing live flow for 16:9 ${isVideo ? "Video" : "Image"}...`,
    resultUrl: null,
    error: null,
  };
  activeGeminiSessions.set(sessionId, sessionData);
  activeGeminiSessions.set("latest", sessionData);

  const addStep = async (stepName, detail) => {
    let shot = null;
    if (page && !page.isClosed()) {
      try {
        const base64Buf = await page.screenshot({ encoding: "base64", type: "jpeg", quality: 40 });
        shot = `data:image/jpeg;base64,${base64Buf}`;
      } catch (_) {}
    }
    const stepObj = {
      step: stepName,
      detail: detail,
      timestamp: new Date().toLocaleTimeString(),
      screenshotUrl: shot,
    };
    sessionData.steps.push(stepObj);
    if (shot) sessionData.lastScreenshot = shot;
    sessionData.currentStep = stepName;
    sessionData.currentDetail = detail;
    activeGeminiSessions.set(sessionId, { ...sessionData });
    activeGeminiSessions.set("latest", { ...sessionData });
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

  // Configure Puppeteer with robust Linux & Windows support
  const isLinux = process.platform === "linux";
  
  let resolvedExecutablePath = undefined;
  if (isLinux) {
    // 1. Prioritize explicit environment variable or installed system Chromium / Chrome
    const systemPaths = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/google-chrome",
      "/snap/bin/chromium",
    ].filter(Boolean);

    resolvedExecutablePath = systemPaths.find((p) => fs.existsSync(p));

    // 2. Only inspect cache directories if system binaries are not installed
    if (!resolvedExecutablePath) {
      const cacheDirs = [
        "/opt/render/.cache/puppeteer/chrome",
        path.join(os.homedir(), ".cache", "puppeteer", "chrome"),
        "/root/.cache/puppeteer/chrome",
      ];

      for (const base of cacheDirs) {
        if (fs.existsSync(base)) {
          try {
            const subdirs = fs.readdirSync(base);
            for (const sub of subdirs) {
              const chromeBin = path.join(base, sub, "chrome-linux64", "chrome");
              if (fs.existsSync(chromeBin)) {
                resolvedExecutablePath = chromeBin;
                break;
              }
              const altBin = path.join(base, sub, "chrome");
              if (fs.existsSync(altBin)) {
                resolvedExecutablePath = altBin;
                break;
              }
            }
          } catch (_) {}
        }
        if (resolvedExecutablePath) break;
      }
    }

    // 3. If no binary is found on cloud host, try self-contained @sparticuz/chromium
    if (!resolvedExecutablePath) {
      try {
        const spartPath = await chromium.executablePath();
        if (spartPath && fs.existsSync(spartPath)) {
          resolvedExecutablePath = spartPath;
          console.log(`[Gemini Agent] Using bundled standalone Chromium binary: ${spartPath}`);
        }
      } catch (spartErr) {
        console.warn("[Gemini Agent] Standalone chromium resolution notice:", spartErr.message);
      }
    }
  }

  const launchArgs = isLinux
    ? [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-blink-features=AutomationControlled",
        "--single-process",
        "--no-zygote",
        "--window-size=1366,850",
      ]
    : [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1366,850",
      ];

  const vendorLibDirs = [
    path.join(process.cwd(), "back", "vendor", "libs", "usr", "lib", "x86_64-linux-gnu"),
    path.join(process.cwd(), "vendor", "libs", "usr", "lib", "x86_64-linux-gnu"),
    path.join(process.cwd(), "back", "vendor", "libs", "usr", "lib"),
    path.join(process.cwd(), "vendor", "libs", "usr", "lib"),
    "/usr/lib/x86_64-linux-gnu",
    "/usr/lib",
    "/usr/local/lib",
    "/lib/x86_64-linux-gnu",
    "/lib",
  ].filter(Boolean);

  const launchOptions = {
    headless: "new",
    userDataDir: sessionDir,
    args: launchArgs,
    env: {
      ...process.env,
      LD_LIBRARY_PATH: `${vendorLibDirs.join(":")}:${process.env.LD_LIBRARY_PATH || ""}`,
    },
  };
  if (resolvedExecutablePath) {
    launchOptions.executablePath = resolvedExecutablePath;
  }

  try {
    await addStep("1. Launch Browser", "Starting Chromium with persistent Google Gemini profile...");
    try {
      browser = await puppeteer.launch(launchOptions);
    } catch (launchErr) {
      if (
        launchErr.message.includes("shared libraries") ||
        launchErr.message.includes("libnspr4") ||
        launchErr.message.includes("127") ||
        launchErr.message.includes("error while loading")
      ) {
        throw new Error(
          `Linux Chromium missing system dependencies (${launchErr.message}).\n` +
          `Please run on your server (or deploy with Dockerfile):\n` +
          `sudo apt-get update && sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 ffmpeg`
        );
      }
      throw launchErr;
    }

    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 850 });

    let capturedAudioBuffer = null;
    let capturedVideoBuffer = null;

    page.on("response", async (response) => {
      try {
        const ct = (response.headers()["content-type"] || "").toLowerCase();
        const url = response.url().toLowerCase();
        if (
          ct.includes("video/") ||
          url.includes(".mp4") ||
          url.includes(".webm") ||
          url.includes("videoplayback") ||
          url.includes("googlevideo")
        ) {
          const buf = await response.buffer();
          if (buf && buf.length > 50000) {
            capturedVideoBuffer = buf;
            console.log(`[Gemini Agent] Captured Gemini native video stream (${(buf.length / 1024 / 1024).toFixed(2)} MB)!`);
          }
        } else if (
          ct.includes("audio/") ||
          url.includes(".mp3") ||
          url.includes(".wav") ||
          url.includes(".m4a") ||
          url.includes(".ogg") ||
          url.includes("audioplayer") ||
          url.includes("music") ||
          url.includes("sound")
        ) {
          const buf = await response.buffer();
          if (buf && buf.length > 3000) {
            capturedAudioBuffer = buf;
            console.log(`[Gemini Agent] Captured Gemini native audio stream (${(buf.length / 1024).toFixed(1)} KB)!`);
          }
        }
      } catch (_) {}
    });

    // Enable Chrome download behavior to capture MP4 downloads via both Browser and Page CDP sessions
    try {
      const cdpSession = await page.target().createCDPSession();
      await cdpSession.send("Browser.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
        eventsEnabled: true,
      }).catch(() => {});
      await cdpSession.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
      }).catch(() => {});
    } catch (_) {}

    await addStep("2. Open Google Gemini", "Navigating to https://gemini.google.com/app...");
    await page.goto("https://gemini.google.com/app", { waitUntil: "networkidle2", timeout: 35000 }).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if captcha or signed out
    const pageStatus = await page.evaluate(() => {
      const bodyText = (document.body?.innerText || "").toLowerCase();
      if (bodyText.includes("unusual traffic") || bodyText.includes("i'm not a robot") || bodyText.includes("recaptcha")) {
        return "captcha";
      }
      if (location.href.includes("accounts.google.com")) return "sign_in";

      const hasSignInBtn = Array.from(document.querySelectorAll("a, button, [role='button']")).some(el => {
        const text = (el.innerText || el.getAttribute("aria-label") || "").trim().toLowerCase();
        const href = el.getAttribute("href") || "";
        return (text === "sign in" || text.includes("sign in")) && (href.includes("accounts.google.com") || href.includes("ServiceLogin") || el.tagName === "BUTTON" || el.tagName === "A");
      });

      const hasSignInBanner = bodyText.includes("sign in to connect to google apps") || bodyText.includes("sign in to create images");
      const hasUserAvatar = !!document.querySelector("img[src*='googleusercontent.com/a/'], a[aria-label*='Google Account' i], button[aria-label*='Google Account' i], [aria-label*='Account Information' i]");

      if ((hasSignInBtn || hasSignInBanner) && !hasUserAvatar) {
        return "sign_in";
      }
      return "ok";
    });

    if (pageStatus === "captcha") {
      throw new Error("Google reCAPTCHA challenge detected. Click 'Gemini Login' in the dashboard, check 'I'm not a robot' in the opened window, then retry.");
    }
    if (pageStatus === "sign_in") {
      throw new Error("Google Gemini is not signed in. Click 'Gemini Login' in the dashboard (or run 'npm run gemini:login' in terminal), sign in to your Google account in the opened Chrome window, close it, and retry.");
    }

    // Step 3: Target Gemini Chat Prompt Input
    await addStep("3. Target Prompt Bar", "Focusing Gemini prompt input area...");
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

    // Step 4: Inject Creative Generation Prompt (Trusted Types CSP safe)
    await addStep("4. Injecting Prompt", `Sending prompt to Gemini: "${fullPrompt}"`);
    
    // Focus, clear any existing text, and insert prompt via TrustedHTML-safe execCommand
    const inserted = await page.evaluate((text) => {
      const el = document.querySelector("div[role='textbox'], rich-textarea textarea, textarea, [contenteditable='true']");
      if (el) {
        el.focus();
        try {
          document.execCommand("selectAll", false, null);
          document.execCommand("delete", false, null);
        } catch (_) {}
        const ok = document.execCommand("insertText", false, text);
        if (!ok) {
          if (el.isContentEditable) {
            el.textContent = text;
          } else {
            el.value = text;
          }
        }
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
      return false;
    }, fullPrompt);

    if (!inserted) {
      await page.keyboard.type(fullPrompt, { delay: 10 });
    }
    await new Promise((r) => setTimeout(r, 600));

    // Step 5: Submit Prompt to Gemini Engine with Confirmed Submission Loop
    await addStep("5. Submit to Gemini", "Submitting creative prompt to Gemini AI engine...");

    let isSubmitted = false;
    for (let submitAttempt = 1; submitAttempt <= 8; submitAttempt++) {
      // Check if already submitted (input cleared, stop button appeared, or responses streaming)
      isSubmitted = await page.evaluate(() => {
        const el = document.querySelector("div[role='textbox'], rich-textarea textarea, textarea, [contenteditable='true']");
        const currentText = (el ? (el.innerText || el.value || "") : "").trim();
        const hasStopBtn = !!document.querySelector("button[aria-label*='Stop' i], button[aria-label*='pause' i], .stop-generating-button");
        const hasResponses = document.querySelectorAll("message-content, .model-response-text, [data-test-id='model-response']").length > 0;
        return currentText === "" || hasStopBtn || hasResponses;
      });

      if (isSubmitted) {
        console.log(`[Gemini Agent] Confirmed prompt successfully submitted on attempt ${submitAttempt}!`);
        break;
      }

      console.log(`[Gemini Agent] Prompt not yet sent (attempt ${submitAttempt}/8). Focusing and sending click/Enter...`);

      // 1. Focus the textbox and trigger Enter keydown
      await page.evaluate(() => {
        const el = document.querySelector("div[role='textbox'], rich-textarea textarea, textarea, [contenteditable='true']");
        if (el) {
          el.focus();
          el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true }));
          el.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true }));
        }
      });
      await page.keyboard.press("Enter");
      await new Promise((r) => setTimeout(r, 400));

      // 2. Find exact coordinates of the blue Send button (↑) and click with native mouse
      const btnCoords = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button, [role='button'], div.send-button, mat-icon-button, [aria-label*='Send' i], [aria-label*='Submit' i]"));
        for (const b of buttons.reverse()) {
          const aria = (b.getAttribute("aria-label") || b.getAttribute("title") || b.innerText || "").toLowerCase();
          const hasSend = aria.includes("send") || aria.includes("submit");
          const hasSvg = !!b.querySelector("svg, mat-icon, [fonticon*='send' i], [fonticon*='arrow' i]");
          const rect = b.getBoundingClientRect();
          const isVisible = rect.width >= 15 && rect.height >= 15 && rect.top > 0 && rect.top < window.innerHeight;
          if ((hasSend || hasSvg) && isVisible && !b.disabled && b.getAttribute("aria-disabled") !== "true") {
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
        }

        // Fallback: Click the right side of the prompt input bar where the ↑ button resides
        const inputEl = document.querySelector("div[role='textbox'], rich-textarea, .input-area");
        if (inputEl) {
          const rect = inputEl.getBoundingClientRect();
          return { x: rect.right - 25, y: rect.top + rect.height / 2 };
        }
        return null;
      });

      if (btnCoords) {
        try {
          await page.mouse.click(btnCoords.x, btnCoords.y);
        } catch (_) {}
      }

      // 3. Fallback: try elementHandle click
      try {
        const sendHandle = await page.$("button[aria-label*='Send' i], button.send-button, [data-test-id='send-button'], button:has(mat-icon)");
        if (sendHandle) await sendHandle.click();
      } catch (_) {}

      await new Promise((r) => setTimeout(r, 1200));
    }

    // Step 6: Wait for Gemini to generate and render the creation (Full 5 minutes timeout)
    const modeDesc = isVideo ? "16:9 animated video with background music (waiting up to 5 minutes)" : "16:9 8K photorealistic image with volumetric lighting (waiting up to 5 minutes)";
    await addStep("6. Generating in Gemini", `Prompt submitted. Gemini is rendering ${modeDesc}...`);
    console.log(`[Gemini Agent] Generation submitted for ${isVideo ? "Video" : "Image"}. Waiting up to 5 minutes for render...`);
    await new Promise((r) => setTimeout(r, 3000));

    await addStep("7. Searching for Media", `Scanning for rendered 16:9 ${isVideo ? "video and download streams" : "8K image"} (waiting up to 5 minutes)...`);
    let extractedMediaBuffer = null;
    let isVideoResult = isVideo;
    const maxAttempts = 100; // Full 5 minutes (100 attempts * 3s = 300s)

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const elapsed = attempt * 3;

      // Stream live screenshot to the dashboard on every polling step
      try {
        const shotBuf = await page.screenshot({ encoding: "base64", type: "jpeg", quality: 40 });
        sessionData.lastScreenshot = `data:image/jpeg;base64,${shotBuf}`;
        activeGeminiSessions.set(sessionId, { ...sessionData });
        activeGeminiSessions.set("latest", { ...sessionData });
      } catch (_) {}

      if (attempt % 5 === 0 || attempt === 1) {
        console.log(`[Gemini Agent] Waiting for media... Attempt ${attempt}/${maxAttempts} (${elapsed}s / 300s elapsed)`);
        await addStep("Rendering in Gemini", `Gemini is generating 16:9 ${isVideo ? "video" : "image"} (${elapsed}s / 300s elapsed - waiting up to 5 minutes)...`);
      }

      // Check for Gemini Sign-In Notice in response
      const signinNotice = await page.evaluate(() => {
        const messageContainers = Array.from(document.querySelectorAll("message-content, .model-response-text, [data-test-id='model-response'], .response-container, .markdown, p"));
        for (const el of messageContainers.reverse()) {
          const text = (el.innerText || "").trim().toLowerCase();
          if (
            text.includes("are you signed in?") ||
            text.includes("can't seem to create any for you right now") ||
            text.includes("sign in to connect to google apps") ||
            text.includes("sign in to create images")
          ) {
            return { needsSignIn: true, rawText: el.innerText.trim() };
          }
        }
        return { needsSignIn: false };
      });

      if (signinNotice?.needsSignIn) {
        const signinMsg = `Google Gemini Sign-In Required: Gemini requires you to be logged into a Google account to create images and videos. Please click the 'Gemini Login' button at the top of the dashboard (or run 'npm run gemini:login' in terminal), sign in with your Google account in the opened Chrome window, close it, and retry.`;
        await addStep("Sign-In Required", signinMsg);
        throw new Error(signinMsg);
      }

      // Check for Gemini Subscription / Paywall / Limit Text Notice (primarily for video generation)
      if (isVideo) {
        const textNotice = await page.evaluate(() => {
          const messageContainers = Array.from(document.querySelectorAll("message-content, .model-response-text, [data-test-id='model-response'], .response-container, .markdown, p"));
          for (const el of messageContainers.reverse()) {
            const text = (el.innerText || "").trim().toLowerCase();
            if (text.length > 15) {
              const hasSubscription = text.includes("gemini advanced") || text.includes("subscription") || text.includes("upgrade to") || text.includes("upgrade your plan") || text.includes("pricing");
              const isVideoRef = text.includes("video") || text.includes("generate video") || text.includes("create video");
              const cannotGen = text.includes("i cannot generate video") || text.includes("i can't generate video") || text.includes("cannot create video");

              if ((hasSubscription && isVideoRef) || cannotGen) {
                return { isPaywall: true, rawText: el.innerText.trim() };
              }
            }
          }
          return { isPaywall: false };
        });

        if (textNotice?.isPaywall) {
          const paywallMsg = `Google Gemini Subscription Notice: ${textNotice.rawText}. Gemini video generation requires a Gemini Advanced / Subscription plan. Please upgrade your Google account subscription.`;
          await addStep("Subscription Required", paywallMsg);
          throw new Error(paywallMsg);
        }
      }

      // 1. Check Network Sniffer Captured Video Buffer
      if (isVideo && capturedVideoBuffer && capturedVideoBuffer.length > 50000) {
        extractedMediaBuffer = capturedVideoBuffer;
        isVideoResult = true;
        console.log(`[Gemini Agent] Attempt ${attempt}: Media found! Captured live video network stream (${(capturedVideoBuffer.length / 1024 / 1024).toFixed(2)} MB).`);
        await addStep("Media Found", `Captured video network stream (${(capturedVideoBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
        break;
      }

      // 2. Check CDP Downloaded Files in temporary folder
      if (isVideo) {
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
                console.log(`[Gemini Agent] Attempt ${attempt}: Media found! Downloaded MP4 captured (${(buf.length / 1024 / 1024).toFixed(2)} MB).`);
                await addStep("Media Found", `Captured downloaded video file (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
                break;
              }
            }
          }
        } catch (_) {}
      }

      // 3. Wide DOM Inspection: Video Elements, In-Page Fetch, Download Buttons, and Generated Images
      const domMedia = await page.evaluate((isVid) => {
        if (isVid) {
          // Find video element
          const vids = Array.from(document.querySelectorAll("video, video-player video, g-video video"));
          let targetVideo = null;
          for (const v of vids.reverse()) {
            const s = v.src || v.currentSrc || v.querySelector("source")?.src || "";
            if (s && !s.startsWith("data:image")) {
              targetVideo = { src: s, element: v };
              break;
            }
          }

          // Hover video container if present to trigger action overlay
          if (targetVideo?.element) {
            try {
              const parentContainer = targetVideo.element.closest("div, section, article, .video-container") || targetVideo.element;
              parentContainer.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
              parentContainer.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
            } catch (_) {}
          }

          // Find Download Button on page or video player
          const buttons = Array.from(document.querySelectorAll("button, a, [role='button'], [tabindex='0']"));
          const downloadBtn = buttons.find((b) => {
            const aria = (b.getAttribute("aria-label") || b.getAttribute("title") || b.innerText || "").toLowerCase();
            const hasDownloadText = aria.includes("download video") || aria.includes("download") || aria.includes("save video") || aria.includes("download full");
            const hasDownloadSvg = !!b.querySelector("svg path[d*='M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z'], svg[aria-label*='download' i]");
            return hasDownloadText || hasDownloadSvg;
          });

          if (downloadBtn) {
            try {
              downloadBtn.click();
            } catch (_) {}
          }

          // Check if video src is fetchable
          if (targetVideo?.src) {
            return { type: "video", src: targetVideo.src, clickedDownload: !!downloadBtn };
          }

          // Check any direct video links in hrefs
          const links = Array.from(document.querySelectorAll("a[href]"));
          for (const a of links.reverse()) {
            const h = a.href || "";
            if (h.includes(".mp4") || h.includes("googlevideo") || (a.hasAttribute("download") && !h.startsWith("data:image"))) {
              return { type: "video_link", src: h, clickedDownload: !!downloadBtn };
            }
          }
        }

        // Check generated image element (for Image Mode, or image fallback)
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
                return { type: "image", base64: dataUrl.split(",")[1] };
              }
            } catch (e) {}
          }
        }

        return { clickedDownload: false };
      }, isVideo);

      // 4. If video stream URL found, fetch in browser context
      if (domMedia?.src && (domMedia.type === "video" || domMedia.type === "video_link")) {
        try {
          const base64Data = await page.evaluate(async (vSrc) => {
            const resp = await fetch(vSrc);
            const blob = await resp.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(",")[1]);
              reader.readAsDataURL(blob);
            });
          }, domMedia.src);

          if (base64Data && base64Data.length > 5000) {
            extractedMediaBuffer = Buffer.from(base64Data, "base64");
            isVideoResult = true;
            console.log(`[Gemini Agent] Attempt ${attempt}: Media found! Direct video stream extracted.`);
            await addStep("Media Found", `Extracted video stream from browser (Attempt ${attempt})`);
            break;
          }
        } catch (_) {}
      }

      // 5. If image captured (Image Mode or Image visual)
      if (domMedia?.base64 && domMedia.type === "image") {
        extractedMediaBuffer = Buffer.from(domMedia.base64, "base64");
        isVideoResult = false;
        console.log(`[Gemini Agent] Attempt ${attempt}: Media found! 16:9 Image captured.`);
        await addStep("Media Found", `Captured 16:9 8K Image (Attempt ${attempt})`);

        // Check if Gemini also rendered an audio music player widget below the image
        try {
          const clickedAudio = await page.evaluate(() => {
            const playBtns = Array.from(document.querySelectorAll("button, [role='button'], [tabindex='0']")).filter((b) => {
              const aria = (b.getAttribute("aria-label") || b.getAttribute("title") || b.innerText || "").toLowerCase();
              const isPlay = aria.includes("play") || aria.includes("listen") || aria.includes("music");
              const hasPlaySvg = !!b.querySelector("svg");
              const insideAudioWidget = !!b.closest("div[class*='audio'], div[class*='player'], div[class*='card'], [role='region'], .model-response-text");
              return isPlay || (hasPlaySvg && insideAudioWidget);
            });

            for (const btn of playBtns) {
              try {
                btn.click();
                return true;
              } catch (_) {}
            }
            return false;
          });

          if (clickedAudio && !capturedAudioBuffer) {
            console.log("[Gemini Agent] Clicked Gemini audio player card to capture native audio stream...");
            await new Promise((r) => setTimeout(r, 4000));
          }
        } catch (_) {}

        break;
      }

      // If download was triggered, give it 3 seconds to complete write to disk
      if (domMedia?.clickedDownload && isVideo) {
        await new Promise((r) => setTimeout(r, 3000));
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
                console.log(`[Gemini Agent] Attempt ${attempt}: Downloaded MP4 captured after click!`);
                await addStep("Media Found", `Downloaded MP4 captured successfully`);
                break;
              }
            }
          }
        } catch (_) {}
      }

      await new Promise((r) => setTimeout(r, 3000));
    }

    // Direct Element Screenshot fallback if needed
    if (!extractedMediaBuffer) {
      try {
        if (isVideo) {
          const vidHandles = await page.$$("video");
          if (vidHandles.length > 0) {
            const lastVid = vidHandles[vidHandles.length - 1];
            extractedMediaBuffer = await lastVid.screenshot({ type: "png" });
            isVideoResult = false;
            console.log("[Gemini Agent] Captured video frame via Element Screenshot!");
          }
        }
        if (!extractedMediaBuffer) {
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
        }
      } catch (err) {}
    }

    if (!extractedMediaBuffer) {
      throw new Error(`Gemini generation completed, but no downloadable ${isVideo ? "video" : "image"} element was found in the response.`);
    }

    // Step 8: Upload to Cloudinary & Attach
    const isMergedVideo = isVideoResult || (capturedAudioBuffer && capturedAudioBuffer.length > 3000);
    const mediaTypeLabel = isMergedVideo ? "16:9 video reel with native audio" : "16:9 8K photo";
    await addStep("8. Uploading Media", `Uploading ${mediaTypeLabel} to Cloudinary...`);
    const uploadRes = await uploadBufferToCloudinary(
      extractedMediaBuffer,
      isVideoResult,
      isMergedVideo ? "instagram-agent/nature-reels" : "instagram-agent/nature-images",
      capturedAudioBuffer
    );

    const finalMediaUrl = uploadRes.secure_url;

    // Step 8: Attach to MongoDB Draft
    await addStep("8. Finished & Attached", `Creation ready and attached: ${finalMediaUrl}`);
    sessionData.status = "completed";
    sessionData.resultUrl = finalMediaUrl;

    if (contentId && contentId !== "live_session" && mongoose.Types.ObjectId.isValid(contentId)) {
      await InstagramContent.updateOne({ _id: contentId }, {
        $set: {
          assetUrl: finalMediaUrl,
          assetSource: "gemini_browser_automated",
          mediaGenerationStatus: "ready",
          status: "ready",
          type: isVideoResult ? "reel" : "post",
        },
      });

      await logInstagramActivity(
        "gemini_browser_automated",
        `Gemini browser automation successfully created and attached ${isVideoResult ? "video reel" : "image post"} to draft.`,
        { contentId: String(contentId), url: finalMediaUrl, isVideo: isVideoResult }
      );
    }

    return { url: finalMediaUrl, source: "gemini_browser_automated", session: sessionData };
  } catch (err) {
    const errorMsg = err.message;
    await addStep("Notice", `Gemini automation status: ${errorMsg}`);
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
