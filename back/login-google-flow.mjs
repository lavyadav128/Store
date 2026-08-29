// login-google-flow.mjs
// ─────────────────────────────────────────────────────────────
// 1-Time Google Flow Interactive Session Initializer
// ─────────────────────────────────────────────────────────────

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import path from "path";
import fs from "fs";

puppeteer.use(StealthPlugin());

async function startLoginSession() {
  const sessionDir = path.join(process.cwd(), "data", "google-flow-session");
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  console.log("=================================================");
  console.log("🚀 Launching Google Flow Login Window...");
  console.log("👉 Please sign in to your Google account in the opened window.");
  console.log("👉 After signing in and seeing Google Flow, close the window.");
  console.log("=================================================");

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: sessionDir,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-quic",
      "--disable-session-crashed-bubble",
      "--no-first-run",
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
  console.log("✅ Google Flow opened! All login session data is saved to:", sessionDir);
}

startLoginSession().catch(err => {
  console.error("Error opening login session:", err);
});
