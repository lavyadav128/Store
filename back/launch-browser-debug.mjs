// launch-browser-debug.mjs
// ─────────────────────────────────────────────────────────────
// Universal Remote Debugging Browser Launcher (CDP Port 9222)
// Automatically locates Chrome or Edge on Windows and opens with CDP port.
// ─────────────────────────────────────────────────────────────

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import path from "path";
import fs from "fs";

puppeteer.use(StealthPlugin());

async function launchBrowserDebug() {
  const sessionDir = path.join(process.cwd(), "data", "google-flow-session");
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  console.log("================================================================");
  console.log("🌐 LAUNCHING CHROME / EDGE REMOTE DEBUGGING (PORT 9222)");
  console.log("================================================================");
  console.log("👉 Opening browser on https://labs.google/fx/tools/flow...");
  console.log("👉 Agent can now attach and control this browser in real-time!");
  console.log("================================================================\n");

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: sessionDir,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--remote-debugging-port=9222",
      "--start-maximized",
      "https://labs.google/fx/tools/flow",
    ],
  });

  const pages = await browser.pages();
  for (let i = 1; i < pages.length; i++) {
    await pages[i].close().catch(() => {});
  }

  const page = pages[0];
  await page.goto("https://labs.google/fx/tools/flow", { waitUntil: "networkidle2" }).catch(() => {});

  console.log("✅ Browser is active on Remote Debugging Port 9222!");
  console.log("⚡ You can now click 'Watch Flow Live' on your dashboard to see the Agent control it live.");
}

launchBrowserDebug().catch(err => {
  console.error("Launcher error:", err);
});
