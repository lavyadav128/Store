// record-google-flow-workflow.mjs
// ─────────────────────────────────────────────────────────────
// 🎓 Interactive Demonstration & Workflow Recorder
// ─────────────────────────────────────────────────────────────

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import path from "path";
import fs from "fs";

puppeteer.use(StealthPlugin());

async function startTrainingRecorder() {
  const sessionDir = path.join(process.cwd(), "data", "google-flow-session");
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const workflowFilePath = path.join(dataDir, "google-flow-workflow.json");

  console.log("================================================================");
  console.log("🎓 GOOGLE FLOW AGENT INTERACTIVE TRAINING RECORDER ACTIVE");
  console.log("================================================================");
  console.log("1. Opening Google Flow in single clean tab...");
  console.log("2. Perform your steps in the opened window:");
  console.log("   - Click '+ New project'");
  console.log("   - Click 'Agent' / Select Image or Video");
  console.log("   - Type your prompt in 'What do you want to create?'");
  console.log("   - Click '➔' (Submit/Generate)");
  console.log("3. When finished, press Ctrl + C in this terminal to save playbook!");
  console.log("================================================================\n");

  const recordedActions = [];

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: sessionDir,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-session-crashed-bubble",
      "--no-first-run",
      "--start-maximized",
      "https://labs.google/fx/tools/flow",
    ],
  });

  const pages = await browser.pages();
  const page = pages[0];

  // Close any duplicate restored tabs
  for (let i = 1; i < pages.length; i++) {
    await pages[i].close().catch(() => {});
  }

  // Expose binding so browser DOM events report back to Node
  await page.exposeFunction("reportUserAction", (action) => {
    console.log(`🎯 [Learned Action] ${action.type}: "${action.label || action.selector}"`);
    recordedActions.push({
      ...action,
      timestamp: new Date().toISOString(),
    });
    fs.writeFileSync(workflowFilePath, JSON.stringify(recordedActions, null, 2), "utf8");
  });

  // Inject event listeners on page creation & navigation
  await page.evaluateOnNewDocument(() => {
    function getCssPath(el) {
      if (!(el instanceof Element)) return "";
      const path = [];
      while (el && el.nodeType === Node.ELEMENT_NODE && el.tagName !== "BODY" && el.tagName !== "HTML") {
        let selector = el.tagName.toLowerCase();
        if (el.id) {
          selector += "#" + el.id;
          path.unshift(selector);
          break;
        } else {
          if (el.className && typeof el.className === "string") {
            const classes = el.className.trim().split(/\s+/).filter(c => !c.includes("hover") && !c.includes("focus")).slice(0, 2);
            if (classes.length) selector += "." + classes.join(".");
          }
          let sibling = el;
          let nth = 1;
          while (sibling.previousElementSibling) {
            sibling = sibling.previousElementSibling;
            if (sibling.tagName === el.tagName) nth++;
          }
          if (nth > 1) selector += `:nth-of-type(${nth})`;
        }
        path.unshift(selector);
        el = el.parentElement;
      }
      return path.join(" > ");
    }

    document.addEventListener("click", (e) => {
      const target = e.target.closest("button, a, div[role='button'], div, span, [contenteditable='true'], textarea, input") || e.target;
      const text = (target.innerText || target.textContent || "").trim().slice(0, 60);
      const aria = target.getAttribute ? (target.getAttribute("aria-label") || target.getAttribute("placeholder") || "") : "";
      const selector = getCssPath(target);
      const rect = target.getBoundingClientRect ? target.getBoundingClientRect() : { x: e.clientX, y: e.clientY };

      window.reportUserAction({
        type: "click",
        label: text || aria || selector,
        selector: selector,
        ariaLabel: aria,
        text: text,
        tagName: target.tagName,
        coords: { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) }
      });
    }, true);

    document.addEventListener("input", (e) => {
      const target = e.target;
      const selector = getCssPath(target);
      const placeholder = target.getAttribute ? (target.getAttribute("placeholder") || target.getAttribute("aria-label") || "") : "";
      window.reportUserAction({
        type: "input",
        label: placeholder || selector,
        selector: selector,
        placeholder: placeholder,
        tagName: target.tagName
      });
    }, true);
  });

  await page.goto("https://labs.google/fx/tools/flow", { waitUntil: "networkidle2" }).catch(() => {});
  console.log("✅ Google Flow is ready! Start performing your steps in the Chrome window...");

  const saveAndExit = () => {
    fs.writeFileSync(workflowFilePath, JSON.stringify(recordedActions, null, 2), "utf8");
    console.log(`\n💾 Saved ${recordedActions.length} actions to ${workflowFilePath}`);
    console.log("🤖 The Agent is now trained and will follow these exact steps!");
    process.exit(0);
  };

  process.on("SIGINT", saveAndExit);
  process.on("SIGTERM", saveAndExit);
}

startTrainingRecorder().catch(err => console.error("Recorder error:", err));
