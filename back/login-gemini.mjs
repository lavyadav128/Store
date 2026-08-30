// login-gemini.mjs
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

const candidateSessionDirs = [
  path.join(process.cwd(), "back", "data", "gemini-session"),
  path.join(process.cwd(), "data", "gemini-session"),
];

let sessionDir = candidateSessionDirs.find((d) => fs.existsSync(d));
if (!sessionDir) {
  sessionDir = path.join(process.cwd(), "data", "gemini-session");
  fs.mkdirSync(sessionDir, { recursive: true });
}

// Find chrome executable path across Windows & Linux
const isWin = process.platform === "win32";
const userHome = os.homedir();

const possibleChromePaths = isWin
  ? [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      path.join(userHome, "AppData", "Local", "Google", "Chrome", "Application", "chrome.exe"),
      path.join(userHome, ".cache", "puppeteer", "chrome", "win64-148.0.7778.97", "chrome-win64", "chrome.exe"),
      path.join(userHome, ".cache", "puppeteer", "chrome", "win64-140.0.7339.80", "chrome-win64", "chrome.exe"),
    ]
  : [
      "/usr/bin/google-chrome-stable",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
    ];

const chromePath = possibleChromePaths.find((p) => fs.existsSync(p)) || (isWin ? "chrome" : "google-chrome");

console.log("🌐 Launching Google Chrome for Gemini login with executable:", chromePath);
console.log("📁 Using persistent profile directory:", sessionDir);

const child = spawn(chromePath, [
  `--user-data-dir=${sessionDir}`,
  "--no-first-run",
  "--start-maximized",
  "https://gemini.google.com/app",
], {
  detached: true,
  stdio: "ignore",
});

child.unref();
console.log("✅ Chrome launched! Please sign into your Google account in the opened window, then close it.");

