// export-gemini-cookies.mjs
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import path from "path";
import fs from "fs";

import os from "os";

puppeteer.use(StealthPlugin());

const candidateSessionDirs = [
  path.join(process.cwd(), "back", "data", "gemini-session"),
  path.join(process.cwd(), "data", "gemini-session"),
  path.join(process.cwd(), "gemini-session"),
];

const sessionDir = candidateSessionDirs.find((d) => fs.existsSync(d)) || path.join(process.cwd(), "data", "gemini-session");
console.log("📁 Reading session profile from:", sessionDir);

async function exportCookies() {
  let browser = null;
  try {
    const lockFiles = ["SingletonLock", "SingletonSocket", "SingletonCookie", "DevToolsActivePort"];
    for (const f of lockFiles) {
      const p = path.join(sessionDir, f);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }

    browser = await puppeteer.launch({
      headless: "new",
      userDataDir: sessionDir,
      protocolTimeout: 300000,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    await page.goto("https://gemini.google.com/app", { waitUntil: "networkidle2", timeout: 45000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 4000));

    const client = await page.target().createCDPSession();
    const { cookies } = await client.send("Network.getAllCookies");

    const googleCookies = cookies.filter(
      (c) =>
        c.domain.includes("google.com") ||
        c.domain.includes("googleusercontent.com") ||
        c.domain.includes("gstatic.com")
    );

    if (googleCookies.length === 0) {
      console.warn("⚠️ No Google cookies found. Please run 'npm run gemini:login' first to log in, then run this script.");
      return;
    }

    console.log(`✅ Extracted ${googleCookies.length} Google/Gemini session cookies!`);

    const exportPath = path.join(path.dirname(sessionDir), "gemini-cookies.json");
    fs.writeFileSync(exportPath, JSON.stringify(googleCookies, null, 2));
    console.log(`💾 Saved cookies to: ${exportPath}`);

    const rootExportPath = path.join(process.cwd(), "gemini-cookies.json");
    fs.writeFileSync(rootExportPath, JSON.stringify(googleCookies, null, 2));

    const jsonStr = JSON.stringify(googleCookies);
    console.log("\n=======================================================");
    console.log("🔑 GEMINI_COOKIES_JSON (Copy this value into Render Environment Variables):");
    console.log("=======================================================");
    console.log(jsonStr);
    console.log("=======================================================\n");

  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch (_) {}
  }
}

exportCookies().catch(console.error);

