// login-gemini.mjs
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const sessionDir = "c:\\Users\\yadav\\OneDrive\\Desktop\\Store\\back\\data\\gemini-session";
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

// Find chrome executable path
const possibleChromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Users\\yadav\\.cache\\puppeteer\\chrome\\win64-148.0.7778.97\\chrome-win64\\chrome.exe",
  "C:\\Users\\yadav\\.cache\\puppeteer\\chrome\\win64-140.0.7339.80\\chrome-win64\\chrome.exe",
];

const chromePath = possibleChromePaths.find((p) => fs.existsSync(p)) || "chrome";

console.log("Launching Google Chrome for Gemini login with executable:", chromePath);
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
console.log("Chrome launched with persistent profile:", sessionDir);
