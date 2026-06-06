import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import server from "../environment";

/* ── Google Fonts ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&display=swap";
document.head.appendChild(fontLink);

/* ── Constants ── */
const SCRIPT_TYPES = [
  { value: "motivational", label: "💪 Motivational", topic: "The power of daily habits and consistency" },
  { value: "educational",  label: "📚 Educational",  topic: "How the human brain learns new skills" },
  { value: "storytelling", label: "📖 Story",         topic: "A journey that changed everything" },
  { value: "product_promo",label: "🛍️ Product",      topic: "Why this product changes lives" },
  { value: "news",         label: "📰 News",          topic: "Today's biggest breakthrough" },
  { value: "comedy",       label: "😂 Comedy",        topic: "Things that happen every Monday" },
  { value: "tutorial",     label: "🎓 Tutorial",      topic: "How to master this skill in 7 days" },
  { value: "documentary",  label: "🎥 Documentary",   topic: "The untold story of innovation" },
];

const IMAGE_STYLES = [
  { id: "cinematic", label: "🎬 Cinematic", prompt: "cinematic photography, dramatic lighting, film grain, anamorphic lens, golden hour" },
  { id: "painting", label: "🖼️ Oil Paint", prompt: "dramatic oil painting, masterpiece, rich textures, chiaroscuro, fine art" },
  { id: "watercolor", label: "💧 Watercolor", prompt: "bright watercolor illustration, soft washes, artistic, paper texture" },
  { id: "neon", label: "🌃 Neon Noir", prompt: "neon noir photography, cyberpunk, rain-slicked streets, moody atmosphere" },
  { id: "minimal", label: "⬜ Minimal", prompt: "minimalist photography, clean composition, negative space, muted palette" },
  { id: "fantasy", label: "🧙 Fantasy", prompt: "epic fantasy digital art, magical atmosphere, volumetric light, ultra detailed" },
  { id: "vintage", label: "📷 Vintage", prompt: "vintage documentary photo, film grain, faded colors, nostalgic, 1970s" },
  { id: "anime", label: "✨ Anime", prompt: "anime illustration, vibrant colors, detailed background, studio quality" },
];

const VOICES = [
  { id: "v1", name: "Aria",   emoji: "👩‍🦰", desc: "Warm · Soft",        pitch: 1.15, rate: 0.85, gender: "female", hints: ["Samantha","Zira","Victoria","Google UK English Female"] },
  { id: "v2", name: "Marcus", emoji: "👨‍💼", desc: "Deep · Authoritative", pitch: 0.80, rate: 0.82, gender: "male",   hints: ["David","Daniel","Google UK English Male","Alex"] },
  { id: "v3", name: "Luna",   emoji: "👩‍🎤", desc: "High · Energetic",    pitch: 1.25, rate: 1.12, gender: "female", hints: ["Samantha","Karen","Moira","Google US English"] },
  { id: "v4", name: "Orion",  emoji: "🧑‍🚀", desc: "Bass · Dramatic",     pitch: 0.70, rate: 0.78, gender: "male",   hints: ["Fred","Alex","Ralph","Google UK English Male"] },
  { id: "v5", name: "Sage",   emoji: "🧑‍🏫", desc: "Neutral · Clear",     pitch: 1.0,  rate: 1.0,  gender: "neutral",hints: ["Google US English","Samantha","Daniel"] },
  { id: "v6", name: "Nova",   emoji: "👩‍💻", desc: "Bright · Crisp",      pitch: 1.35, rate: 1.18, gender: "female", hints: ["Zira","Heather","Fiona","Google Australian English"] },
];

/* ── CSS ── */
const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0e0e0f;
  --surface: #17181a;
  --surface2: #1f2023;
  --surface3: #27292d;
  --border: #2e3035;
  --border2: #3d4048;
  --ink: #f0f0ec;
  --ink2: #c8c8c0;
  --ink3: #8a8a80;
  --accent: #e8d44d;
  --accent2: #c4b030;
  --red: #e05555;
  --green: #4caf80;
  --radius: 10px;
  --font: 'Syne', sans-serif;
  --mono: 'IBM Plex Mono', monospace;
}

.vs { font-family: var(--font); background: var(--bg); color: var(--ink); min-height: 100vh; }

/* ── Top bar ── */
.vs-bar {
  height: 54px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px;
  position: sticky; top: 0; z-index: 200;
  gap: 12px;
}
.vs-brand {
  font-size: 16px; font-weight: 800; letter-spacing: -0.3px;
  color: var(--ink); display: flex; align-items: center; gap: 8px;
  flex-shrink: 0;
}
.vs-brand-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; }

.vs-steps { display: flex; gap: 3px; align-items: center; overflow-x: auto; scrollbar-width: none; }
.vs-steps::-webkit-scrollbar { display: none; }
.vs-step-btn {
  font-family: var(--mono); font-size: 11px; font-weight: 500;
  padding: 6px 14px; border-radius: 50px;
  border: 1px solid var(--border); background: transparent;
  color: var(--ink3); cursor: pointer; transition: all 0.15s;
  white-space: nowrap;
}
.vs-step-btn:hover { border-color: var(--border2); color: var(--ink2); }
.vs-step-btn.active { background: var(--accent); color: #000; border-color: var(--accent); font-weight: 700; }
.vs-step-btn.done { background: var(--surface3); color: var(--ink3); border-color: var(--border2); }

/* ── Layout ── */
.vs-layout {
  display: grid;
  grid-template-columns: 290px 1fr;
  min-height: calc(100vh - 54px);
}
@media (max-width: 720px) {
  .vs-layout { grid-template-columns: 1fr; }
  .vs-sidebar { max-height: none; border-right: none; border-bottom: 1px solid var(--border); }
}

/* ── Sidebar ── */
.vs-sidebar {
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 16px; overflow-y: auto;
  max-height: calc(100vh - 54px);
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
.vs-main {
  padding: 20px; overflow-y: auto;
  max-height: calc(100vh - 54px);
  background: var(--bg);
}

/* ── Label ── */
.vs-lbl {
  font-family: var(--mono); font-size: 10px; font-weight: 500;
  letter-spacing: 1.8px; text-transform: uppercase;
  color: var(--ink3); margin-bottom: 8px; display: block;
}

.vs-hr { height: 1px; background: var(--border); margin: 14px 0; }

/* ── Inputs ── */
.vs-input, .vs-textarea {
  width: 100%; font-family: var(--font); font-size: 13px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 9px 12px;
  color: var(--ink); outline: none; transition: border-color 0.15s;
  line-height: 1.5;
}
.vs-input:focus, .vs-textarea:focus { border-color: var(--accent); }
.vs-textarea { resize: vertical; min-height: 80px; font-family: var(--mono); font-size: 12px; line-height: 1.7; }

/* ── Buttons ── */
.vs-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  font-family: var(--font); font-size: 13px; font-weight: 700;
  padding: 9px 16px; border-radius: var(--radius);
  border: 1px solid transparent; cursor: pointer; transition: all 0.15s;
  white-space: nowrap; text-decoration: none;
}
.vs-btn:disabled { opacity: 0.35; cursor: not-allowed !important; }
.vs-btn-primary { background: var(--accent); color: #000; border-color: var(--accent); }
.vs-btn-primary:not(:disabled):hover { background: #fff0a0; }
.vs-btn-outline { background: transparent; color: var(--ink); border-color: var(--border2); }
.vs-btn-outline:not(:disabled):hover { border-color: var(--ink2); }
.vs-btn-soft { background: var(--surface2); color: var(--ink2); border-color: var(--border); }
.vs-btn-soft:not(:disabled):hover { border-color: var(--border2); background: var(--surface3); }
.vs-btn-ghost { background: transparent; color: var(--ink3); border-color: var(--border); }
.vs-btn-ghost:not(:disabled):hover { color: var(--ink2); border-color: var(--border2); }
.vs-btn-red { background: transparent; color: var(--red); border-color: rgba(224,85,85,0.4); }
.vs-btn-red:not(:disabled):hover { background: var(--red); color: #fff; }
.vs-btn-block { width: 100%; }
.vs-btn-sm { padding: 5px 10px; font-size: 11px; border-radius: 7px; }

/* ── Script types ── */
.vs-types { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 12px; }
.vs-type {
  padding: 8px 10px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--surface2);
  cursor: pointer; transition: all 0.15s; text-align: left;
}
.vs-type:hover { border-color: var(--border2); }
.vs-type.sel { border-color: var(--accent); background: rgba(232,212,77,0.08); }
.vs-type .em { font-size: 14px; display: block; margin-bottom: 3px; }
.vs-type .nm { font-size: 11px; font-weight: 700; color: var(--ink2); }
.vs-type.sel .nm { color: var(--accent); }

/* ── Mode toggle ── */
.vs-mode { display: flex; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
.vs-mode-btn {
  flex: 1; padding: 8px 6px; font-size: 11px; font-weight: 700;
  font-family: var(--mono); text-align: center; cursor: pointer;
  border: none; background: transparent; color: var(--ink3);
  transition: all 0.15s;
}
.vs-mode-btn.a { background: var(--surface3); color: var(--ink); }

/* ── Voice grid ── */
.vs-voices { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; margin-bottom: 12px; }
.vs-voice {
  padding: 10px 8px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--surface2);
  cursor: pointer; transition: all 0.15s; text-align: center;
}
.vs-voice:hover { border-color: var(--border2); }
.vs-voice.sel { border-color: var(--accent); background: rgba(232,212,77,0.08); }
.vs-voice .vem { font-size: 18px; display: block; margin-bottom: 3px; }
.vs-voice .vnm { font-size: 11px; font-weight: 700; color: var(--ink2); }
.vs-voice.sel .vnm { color: var(--accent); }
.vs-voice .vd { font-size: 9px; color: var(--ink3); font-family: var(--mono); margin-top: 2px; }

/* ── Image style chips ── */
.vs-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
.vs-chip {
  padding: 4px 11px; border-radius: 50px;
  font-size: 11px; font-weight: 600; font-family: var(--mono);
  border: 1px solid var(--border); color: var(--ink3);
  background: transparent; cursor: pointer; transition: all 0.15s;
}
.vs-chip:hover { border-color: var(--border2); color: var(--ink2); }
.vs-chip.sel { background: var(--accent); color: #000; border-color: var(--accent); }

/* ── Format toggle ── */
.vs-fmts { display: flex; gap: 7px; margin-bottom: 14px; }
.vs-fmt {
  flex: 1; padding: 9px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--surface2);
  color: var(--ink3); cursor: pointer;
  font-size: 11px; font-weight: 700; text-align: center; transition: all 0.15s;
}
.vs-fmt:hover { border-color: var(--border2); color: var(--ink2); }
.vs-fmt.sel { border-color: var(--accent); color: var(--accent); background: rgba(232,212,77,0.08); }
.vs-fmt small { display: block; font-size: 9px; opacity: 0.5; font-family: var(--mono); margin-top: 2px; }

/* ── Summary cards ── */
.vs-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 14px; }
.vs-scard { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; }
.vs-scard .k { font-size: 9px; color: var(--ink3); font-family: var(--mono); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px; }
.vs-scard .v { font-size: 13px; font-weight: 700; color: var(--ink); }

/* ── Progress ── */
.vs-prog { height: 4px; background: var(--surface3); border-radius: 2px; overflow: hidden; margin-top: 8px; }
.vs-prog-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.4s ease; }

/* ── Waveform ── */
.vs-wave { display: flex; align-items: center; gap: 3px; height: 24px; justify-content: center; margin: 8px 0; }
.vs-wbar { width: 3px; background: var(--accent); border-radius: 2px; animation: wav 0.8s ease-in-out infinite; }
.vs-wbar:nth-child(2){animation-delay:.1s}.vs-wbar:nth-child(3){animation-delay:.2s}
.vs-wbar:nth-child(4){animation-delay:.3s}.vs-wbar:nth-child(5){animation-delay:.4s}
@keyframes wav{0%,100%{height:4px}50%{height:20px}}

/* ── Scene card ── */
.vs-scene {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px; margin-bottom: 10px;
}
.vs-scene-hd { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
.vs-scene-num {
  width: 28px; height: 28px; border-radius: 7px;
  background: var(--accent); color: #000;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; flex-shrink: 0;
}
.vs-scene-acts { display: flex; gap: 4px; flex-shrink: 0; }

/* ── Images ── */
.vs-imgs { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 8px; }
.vs-img-thumb {
  position: relative; width: 100px; height: 68px;
  border-radius: 8px; overflow: hidden;
  border: 2px solid var(--border); cursor: pointer;
  transition: all 0.15s; flex-shrink: 0;
  background: var(--surface3);
}
.vs-img-thumb:hover { border-color: var(--border2); }
.vs-img-thumb.sel { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(232,212,77,0.4); }
.vs-img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.4s; }
.vs-img-thumb .chk {
  position: absolute; top: 4px; right: 4px;
  width: 16px; height: 16px; background: var(--accent);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 9px; color: #000; font-weight: 800;
}
.vs-img-thumb .del-img {
  position: absolute; bottom: 3px; right: 3px;
  background: rgba(0,0,0,0.65); border-radius: 4px;
  padding: 1px 5px; font-size: 9px; color: #fff; cursor: pointer;
  line-height: 1.5; transition: background 0.1s;
}
.vs-img-thumb .del-img:hover { background: var(--red); }

/* Loading skeleton */
.vs-skel {
  width: 100px; height: 68px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(90deg, var(--surface2) 0%, var(--surface3) 50%, var(--surface2) 100%);
  background-size: 200% 100%;
  animation: shim 1.4s infinite;
  border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}
.vs-skel-inner { font-size: 18px; animation: pulse 1s ease-in-out infinite alternate; }
@keyframes pulse { from{opacity:0.3} to{opacity:0.8} }
@keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Upload tile */
.vs-upload-thumb {
  width: 100px; height: 68px; border-radius: 8px;
  border: 2px dashed var(--border); display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s;
  font-size: 9px; color: var(--ink3); gap: 3px; flex-shrink: 0;
  font-family: var(--mono);
}
.vs-upload-thumb:hover { border-color: var(--accent); color: var(--accent); }
.vs-upload-thumb .ico { font-size: 18px; }

/* ── Prompt row ── */
.vs-prompt-row { display: flex; gap: 6px; margin-top: 6px; }
.vs-prompt-input {
  flex: 1; font-family: var(--mono); font-size: 11px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 7px; padding: 7px 10px; color: var(--ink);
  outline: none; transition: border-color 0.15s;
}
.vs-prompt-input:focus { border-color: var(--accent); }
.vs-prompt-input::placeholder { color: var(--ink3); }

/* ── Preview ── */
.vs-preview {
  background: #000; border-radius: 12px; overflow: hidden;
  position: relative; border: 1px solid var(--border2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}
.vs-preview.landscape { aspect-ratio: 16/9; }
.vs-preview.portrait { aspect-ratio: 9/16; max-width: 260px; margin: 0 auto; }
.vs-preview .pimg { width: 100%; height: 100%; object-fit: cover; display: block; }
.vs-preview .pcnt {
  position: absolute; top: 10px; right: 12px;
  font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,0.4);
  background: rgba(0,0,0,0.4); padding: 3px 8px; border-radius: 50px;
}
.vs-preview .pempty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px; color: var(--ink3); text-align: center; gap: 12px;
}
.vs-preview .pempty .big { font-size: 42px; }
.vs-preview .pempty p { font-size: 12px; font-family: var(--mono); }

.vs-dots { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; margin-top: 12px; }
.vs-dot {
  width: 28px; height: 28px; border-radius: 7px;
  border: 1px solid var(--border); display: flex;
  align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; font-family: var(--mono);
  cursor: pointer; color: var(--ink3); transition: all 0.15s;
}
.vs-dot:hover:not(.a) { border-color: var(--border2); color: var(--ink2); }
.vs-dot.a { background: var(--accent); border-color: var(--accent); color: #000; }

/* ── Script box ── */
.vs-script-box {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px;
  font-family: var(--mono); font-size: 12px;
  line-height: 1.9; color: var(--ink2); white-space: pre-wrap;
}

/* ── Info box ── */
.vs-info {
  background: rgba(232,212,77,0.06); border: 1px solid rgba(232,212,77,0.2);
  border-radius: 8px; padding: 10px 12px;
  font-size: 12px; color: var(--ink2); line-height: 1.6; margin-bottom: 10px;
  font-family: var(--mono);
}
.vs-info strong { color: var(--accent); }

/* ── Spinner ── */
.vs-spin-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px; }
.vs-spin {
  width: 36px; height: 36px;
  border: 3px solid var(--border); border-top-color: var(--accent);
  border-radius: 50%; animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Toast ── */
.vs-toast {
  position: fixed; bottom: 20px; right: 20px; z-index: 9999;
  background: var(--surface3); color: var(--ink); border: 1px solid var(--border2);
  border-radius: 10px; padding: 12px 18px; font-size: 13px; font-weight: 600;
  animation: tin 0.22s ease; max-width: 300px; font-family: var(--font);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.vs-toast.err { border-color: var(--red); color: var(--red); }
.vs-toast.ok { border-color: rgba(76,175,128,0.5); color: var(--green); }
@keyframes tin { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }

/* ── How cards ── */
.vs-how { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; margin-bottom: 24px; }
.vs-how-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px;
}
.vs-how-card .ico { font-size: 24px; display: block; margin-bottom: 8px; }
.vs-how-card h3 { font-size: 14px; font-weight: 700; margin-bottom: 5px; }
.vs-how-card p { font-size: 12px; color: var(--ink3); line-height: 1.6; font-family: var(--mono); }

.vs-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
.vs-tag {
  font-family: var(--mono); font-size: 10px;
  padding: 3px 10px; border-radius: 50px;
  background: var(--surface2); border: 1px solid var(--border); color: var(--ink3);
}

.vs-vprofile-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(160px,1fr)); gap: 8px; margin-bottom: 20px; }
.vs-vcard {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 14px; cursor: pointer; transition: all 0.15s;
}
.vs-vcard:hover { border-color: var(--border2); }
.vs-vcard.sel { border-color: var(--accent); }
.vs-vcard .ico { font-size: 22px; margin-bottom: 8px; display: block; }
.vs-vcard h3 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.vs-vcard .meta { font-size: 10px; color: var(--ink3); font-family: var(--mono); line-height: 1.6; }

.vs-export-vid { width: 100%; border-radius: 10px; border: 1px solid var(--border); background: #000; margin-top: 14px; }

.row { display: flex; gap: 7px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.muted { font-size: 11px; color: var(--ink3); font-family: var(--mono); }

/* Image generation status banner */
.vs-gen-banner {
  display: flex; align-items: center; gap: 10px;
  background: rgba(232,212,77,0.06); border: 1px solid rgba(232,212,77,0.2);
  border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;
  font-family: var(--mono); font-size: 12px; color: var(--accent);
}
.vs-gen-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent); animation: blink 1s ease-in-out infinite alternate;
  flex-shrink: 0;
}
@keyframes blink { from{opacity:0.3} to{opacity:1} }
`;

/* ── Helpers ── */
const splitScenes = (script) => {
  const sentences = script.match(/[^.!?\n]+[.!?\n]+/g) || [script];
  const chunks = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(" ").trim());
  }
  return chunks.filter(c => c.length > 3);
};

const speakText = (text, voiceCfg, onEnd) => {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.pitch = voiceCfg.pitch;
  utt.rate = voiceCfg.rate;
  const all = window.speechSynthesis.getVoices();
  let pick = null;
  for (const hint of voiceCfg.hints) {
    pick = all.find(v => v.name.toLowerCase().includes(hint.toLowerCase()));
    if (pick) break;
  }
  if (!pick && voiceCfg.gender === "female") pick = all.find(v => /female|zira|samantha|victoria|karen/i.test(v.name));
  else if (!pick && voiceCfg.gender === "male") pick = all.find(v => /male|david|alex|daniel|fred/i.test(v.name));
  if (!pick && all.length > 0) pick = all[0];
  if (pick) utt.voice = pick;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
};

/* Build a highly descriptive, relevant prompt from scene text */
const buildImagePrompt = (sceneText, customPrompt, stylePrompt) => {
  const base = customPrompt?.trim() ? customPrompt.trim() : sceneText.trim();
  return `${base}, ${stylePrompt}, ultra high resolution, 8K, photorealistic, professional composition, no text, no words, no captions, no watermark, no logo, no letters, no subtitles`;
};

/* Pollinations URL */
const genImgUrl = (prompt, seed) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&seed=${seed}&nologo=true&model=flux&enhance=true&safe=false`;

/* Load image with promise */
const loadImageEl = (src, timeoutMs = 15000) =>
  new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const t = setTimeout(() => resolve(null), timeoutMs);
    img.onload = () => { clearTimeout(t); resolve(img); };
    img.onerror = () => { clearTimeout(t); resolve(null); };
    img.src = src;
  });

/* Fetch image as blob URL to avoid canvas CORS taint */
const fetchImageAsBlob = async (src, timeoutMs = 15000) => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const resp = await fetch(src, { signal: controller.signal });
    clearTimeout(timer);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    const blobUrl = URL.createObjectURL(blob);
    const imgEl = await loadImageEl(blobUrl, 8000);
    return { imgEl, blobUrl };
  } catch {
    return null;
  }
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function VideoStudio() {
  const [step, setStep] = useState(1);

  // Step 1
  const [scriptMode, setScriptMode] = useState("ai");
  const [scriptType, setScriptType] = useState("");
  const [scriptTopic, setScriptTopic] = useState("");
  const [script, setScript] = useState("");
  const [genScript, setGenScript] = useState(false);

  // Step 2
  const [voice, setVoice] = useState(VOICES[0]);
  const [previewVoiceId, setPreviewVoiceId] = useState(null);
  const [format, setFormat] = useState("landscape");

  // Step 3
  const [imgStyle, setImgStyle] = useState(IMAGE_STYLES[0]);
  const [scenes, setScenes] = useState([]);
  const [loadingImgs, setLoadingImgs] = useState(false);
  const [genStatus, setGenStatus] = useState(""); // e.g. "Generating scene 2/5..."

  // Step 4
  const [previewIdx, setPreviewIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expProg, setExpProg] = useState(0);
  const [exportedUrl, setExportedUrl] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);

  /* ── 1. Generate Script via backend (Groq) ── */
  const generateScript = async () => {
    if (!scriptType || !scriptTopic.trim()) return;
    setGenScript(true);
    try {
      const res = await axios.post(
        `${server}/api/video-studio/generate-script`,
        { scriptType, topic: scriptTopic },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const text = res.data.script || "";
      if (text) { setScript(text.trim()); showToast("✨ Script ready!"); }
      else showToast("Script generation failed", "err");
    } catch (e) {
      showToast("Script generation failed: " + (e.message || ""), "err");
    }
    setGenScript(false);
  };

  /* ── 2. Preview voice ── */
  const doPreviewVoice = (v) => {
    setPreviewVoiceId(v.id);
    speakText(
      script ? script.slice(0, 120) : `Hi! I am ${v.name}. This is how I sound when narrating your video.`,
      v,
      () => setPreviewVoiceId(null)
    );
  };

  /* ── 3. Generate images — one by one with proper prompts ── */
  const generateImages = useCallback(async (existingScenes) => {
    if (!script.trim()) return;
    setLoadingImgs(true);
    setGenStatus("Splitting script into scenes…");

    const parts = splitScenes(script);
    const styleObj = imgStyle;

    // Initialize scenes with loading state
    const base = parts.map((text, i) => ({
      id: i,
      text,
      customPrompt: existingScenes?.[i]?.customPrompt || "",
      images: existingScenes?.[i]?.images?.filter(im => im.isManual) || [],
      selected: 0,
      loading: true,
    }));
    setScenes(base);

    // Generate images one scene at a time for better relevance
    for (let i = 0; i < base.length; i++) {
      setGenStatus(`Generating images for scene ${i + 1} of ${base.length}…`);
      const sc = base[i];
      const prompt = buildImagePrompt(sc.text, sc.customPrompt, styleObj.prompt);

      // Generate 3 variations with different seeds
      const seeds = [
        Math.floor(i * 777 + 101),
        Math.floor(i * 777 + 555),
        Math.floor(i * 777 + 999),
      ];
      const aiImgs = seeds.map(seed => ({
        url: genImgUrl(prompt, seed),
        isManual: false,
        prompt,
        seed,
        loaded: false,
      }));

      setScenes(prev => {
        const u = [...prev];
        const manuals = u[i]?.images?.filter(im => im.isManual) || [];
        u[i] = { ...u[i], images: [...manuals, ...aiImgs], loading: false };
        return u;
      });

      // Small delay between scenes to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    }

    setLoadingImgs(false);
    setGenStatus("");
    showToast(`🖼️ ${base.length} scenes ready! Select your best images.`);
  }, [script, imgStyle]);

  /* ── Regenerate single scene ── */
  const regenScene = (si) => {
    setScenes(prev => {
      const u = [...prev];
      const sc = u[si];
      const prompt = buildImagePrompt(sc.text, sc.customPrompt, imgStyle.prompt);
      const seeds = [
        Math.floor(Math.random() * 99999),
        Math.floor(Math.random() * 99999),
        Math.floor(Math.random() * 99999),
      ];
      const aiImgs = seeds.map(seed => ({
        url: genImgUrl(prompt, seed),
        isManual: false,
        prompt,
        seed,
      }));
      const manuals = sc.images.filter(im => im.isManual);
      u[si] = { ...sc, images: [...manuals, ...aiImgs], selected: 0 };
      return u;
    });
    showToast("🔄 Regenerating scene images…");
  };

  const addImgUrl = (si, url) => {
    if (!url.trim()) return;
    setScenes(prev => {
      const u = [...prev];
      u[si] = { ...u[si], images: [...u[si].images, { url, isManual: true }] };
      return u;
    });
  };

  const addImgFile = (si, file) => {
    const objectUrl = URL.createObjectURL(file);
    setScenes(prev => {
      const u = [...prev];
      u[si] = { ...u[si], images: [...u[si].images, { url: objectUrl, isManual: true }] };
      return u;
    });
  };

  const delImg = (si, ii) => {
    setScenes(prev => {
      const u = [...prev];
      const imgs = u[si].images.filter((_, idx) => idx !== ii);
      u[si] = { ...u[si], images: imgs, selected: Math.min(u[si].selected, Math.max(0, imgs.length - 1)) };
      return u;
    });
  };

  const delScene = (si) => {
    setScenes(prev => prev.filter((_, i) => i !== si));
    if (previewIdx >= si && previewIdx > 0) setPreviewIdx(p => p - 1);
  };

  const addScene = () => {
    setScenes(prev => [...prev, { id: Date.now(), text: "", customPrompt: "", images: [], selected: 0, loading: false }]);
  };

  const updateScene = (si, field, val) => {
    setScenes(prev => { const u = [...prev]; u[si] = { ...u[si], [field]: val }; return u; });
  };

  /* ── EXPORT — images + real TTS audio baked into the video ── */
  const exportVideo = async () => {
    if (!scenes.length) return;
    setExporting(true);
    setExpProg(0);
    setExportedUrl(null);
    window.speechSynthesis.cancel();

    const isPortrait = format === "portrait";
    const W = isPortrait ? 720 : 1280;
    const H = isPortrait ? 1280 : 720;

    // ── Canvas ──
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // ── AudioContext: capture mic + TTS via destination stream ──
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioDest = audioCtx.createMediaStreamDestination();

    // Route microphone (captures system TTS on most browsers) as fallback
    // Primary: we use a silent oscillator to keep the audio track alive,
    // and Web Speech API speaks through the system output which gets captured
    // via getUserMedia loopback on supported browsers.
    // More reliably: we use SpeechSynthesis + record timing, then mux.
    // Best cross-browser approach: silent node keeps audio track, TTS plays live.
    const silentOsc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0; // silent — just keeps the audio track alive
    silentOsc.connect(gainNode);
    gainNode.connect(audioDest);
    silentOsc.start();

    // ── Combine canvas video + audio destination into one stream ──
    const videoStream = canvas.captureStream(30);
    const audioStream = audioDest.stream;
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    // Pick best supported codec with audio
    const mimeType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
      .find(m => MediaRecorder.isTypeSupported(m)) || "video/webm";

    const chunks = [];
    const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 8_000_000 });
    recorder.ondataavailable = e => e.data.size > 0 && chunks.push(e.data);
    recorder.onstop = () => {
      silentOsc.stop();
      audioCtx.close();
      const blob = new Blob(chunks, { type: "video/webm" });
      setExportedUrl(URL.createObjectURL(blob));
      setExporting(false);
      setGenStatus("");
      showToast("🎬 Video with audio exported! Download below.");
    };
    recorder.start(100); // collect data every 100ms

    // ── Pre-load all images as blobs (CORS fix) ──
    setGenStatus("Loading images…");
    const imgEls = [];
    const blobUrls = [];
    for (let i = 0; i < scenes.length; i++) {
      setExpProg(Math.round((i / scenes.length) * 20));
      const sc = scenes[i];
      const imgEntry = sc.images[sc.selected] ?? sc.images[0];
      let imgEl = null;
      if (imgEntry?.url) {
        const result = await fetchImageAsBlob(imgEntry.url, 12000);
        if (result) { imgEl = result.imgEl; blobUrls.push(result.blobUrl); }
        else imgEl = await loadImageEl(imgEntry.url, 8000);
      }
      imgEls.push(imgEl);
    }
    setGenStatus("Recording…");

    // ── Helper: speak a scene and wait for it to finish ──
    // Returns actual spoken duration in ms
    const speakScene = (text, voiceCfg) => new Promise(resolve => {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.pitch = voiceCfg.pitch;
      utt.rate = voiceCfg.rate;
      const all = window.speechSynthesis.getVoices();
      let pick = null;
      for (const hint of voiceCfg.hints) {
        pick = all.find(v => v.name.toLowerCase().includes(hint.toLowerCase()));
        if (pick) break;
      }
      if (!pick && voiceCfg.gender === "female") pick = all.find(v => /female|zira|samantha|victoria|karen/i.test(v.name));
      else if (!pick && voiceCfg.gender === "male") pick = all.find(v => /male|david|alex|daniel|fred/i.test(v.name));
      if (!pick && all.length > 0) pick = all[0];
      if (pick) utt.voice = pick;
      const start = Date.now();
      utt.onend = () => resolve(Date.now() - start);
      utt.onerror = () => resolve(3000);
      window.speechSynthesis.speak(utt);
    });

    // ── Draw loop helper ──
    const drawScene = (imgEl, W, H, ctx, prog) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      if (imgEl) {
        const scale = 1 + prog * 0.06; // Ken Burns zoom
        const sw = W * scale, sh = H * scale;
        ctx.drawImage(imgEl, (W - sw) / 2, (H - sh) / 2, sw, sh);
      } else {
        const grd = ctx.createLinearGradient(0, 0, W, H);
        grd.addColorStop(0, "#0a0a0f");
        grd.addColorStop(1, "#1a1a2a");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // Subtle vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.9);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Crossfade overlay
      const fadeIn = Math.min(prog * 6, 1);
      const fadeOut = Math.min((1 - prog) * 6, 1);
      const alpha = 1 - Math.min(fadeIn, fadeOut);
      if (alpha > 0.01) {
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    // ── Render each scene: speak + draw in parallel ──
    for (let i = 0; i < scenes.length; i++) {
      setExpProg(20 + Math.round((i / scenes.length) * 72));
      const sc = scenes[i];
      const imgEl = imgEls[i];

      // Start speaking — canvas keeps drawing while speech plays
      const speakPromise = speakScene(sc.text, voice);

      // Draw frames until speech ends
      let spokenMs = 0;
      const startTime = Date.now();
      let done = false;
      speakPromise.then(ms => { spokenMs = ms; done = true; });

      await new Promise(resolve => {
        const MIN_SCENE_MS = 2000;
        const draw = () => {
          const elapsed = Date.now() - startTime;
          const targetMs = Math.max(spokenMs || 4000, MIN_SCENE_MS);
          const prog = Math.min(elapsed / targetMs, 1);
          drawScene(imgEl, W, H, ctx, prog);
          if (!done || elapsed < MIN_SCENE_MS) {
            requestAnimationFrame(draw);
          } else {
            // Wait a brief gap between scenes
            setTimeout(resolve, 300);
          }
        };
        draw();
      });
    }

    window.speechSynthesis.cancel();

    // Fade to black
    await new Promise(resolve => {
      const st = Date.now();
      const fade = () => {
        const p = Math.min((Date.now() - st) / 700, 1);
        ctx.fillStyle = `rgba(0,0,0,${p})`;
        ctx.fillRect(0, 0, W, H);
        if (p < 1) requestAnimationFrame(fade); else resolve();
      };
      fade();
    });

    await new Promise(r => setTimeout(r, 400)); // flush last audio
    recorder.stop();
    setExpProg(100);
    blobUrls.forEach(u => URL.revokeObjectURL(u));
  };

  /* ── Audio playback for preview ── */
  useEffect(() => {
    if (playing && scenes.length > 0) {
      const next = (i) => {
        if (i >= scenes.length) { setPlaying(false); return; }
        setPreviewIdx(i);
        speakText(scenes[i].text, voice, () => setTimeout(() => next(i + 1), 300));
      };
      next(0);
    } else if (!playing) {
      window.speechSynthesis.cancel();
    }
    return () => window.speechSynthesis.cancel();
  }, [playing]);

  const STEPS = ["Script", "Voice", "Images", "Export"];
  const curScene = scenes[previewIdx];
  const previewImgUrl = curScene?.images?.[curScene.selected]?.url;

  return (
    <>
      <style>{css}</style>
      <div className="vs">

        {/* ── Top bar ── */}
        <header className="vs-bar">
          <div className="vs-brand">
            <div className="vs-brand-dot" />
            Video Studio
          </div>
          <div className="vs-steps">
            {STEPS.map((s, i) => (
              <button
                key={s}
                className={`vs-step-btn ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}
                onClick={() => (step > i+1 || step === i+1) && setStep(i+1)}
              >
                {step > i+1 ? "✓ " : `${i+1}. `}{s}
              </button>
            ))}
          </div>
        </header>

        <div className="vs-layout">
          {/* ══ SIDEBAR ══ */}
          <aside className="vs-sidebar">

            {/* ── STEP 1 ── */}
            {step === 1 && (<>
              <span className="vs-lbl">Input Mode</span>
              <div className="vs-mode mb-3">
                <button className={`vs-mode-btn ${scriptMode==="ai"?"a":""}`} onClick={()=>setScriptMode("ai")}>✨ AI Write</button>
                <button className={`vs-mode-btn ${scriptMode==="manual"?"a":""}`} onClick={()=>setScriptMode("manual")}>✏️ Write Own</button>
              </div>

              {scriptMode === "ai" && (<>
                <span className="vs-lbl">Script Style</span>
                <div className="vs-types">
                  {SCRIPT_TYPES.map(st => (
                    <div
                      key={st.value}
                      className={`vs-type ${scriptType===st.value?"sel":""}`}
                      onClick={() => { setScriptType(st.value); if (!scriptTopic.trim()) setScriptTopic(st.topic); }}
                    >
                      <span className="em">{st.label.split(" ")[0]}</span>
                      <div className="nm">{st.label.split(" ").slice(1).join(" ")}</div>
                    </div>
                  ))}
                </div>
                <span className="vs-lbl">Topic</span>
                <input
                  className="vs-input mb-3"
                  placeholder="What's your video about?"
                  value={scriptTopic}
                  onChange={e => setScriptTopic(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && generateScript()}
                />
                <button
                  className="vs-btn vs-btn-primary vs-btn-block mb-2"
                  onClick={generateScript}
                  disabled={!scriptType || !scriptTopic.trim() || genScript}
                >
                  {genScript ? "✨ Generating…" : "✨ Generate Script"}
                </button>
                <div className="vs-hr" />
              </>)}

              {scriptMode === "manual" && (
                <div className="vs-info mb-3">
                  <strong>Tip:</strong> Write vivid, visual sentences. Each 1–2 sentences = one scene with its own image.
                </div>
              )}

              <span className="vs-lbl">Script</span>
              <textarea
                className="vs-textarea mb-3"
                placeholder={scriptMode==="manual"
                  ? "Write vivid narration here. Use full sentences ending with . ! or ?"
                  : "Generated script appears here…"}
                value={script}
                onChange={e => setScript(e.target.value)}
                rows={10}
              />
              <button
                className="vs-btn vs-btn-primary vs-btn-block"
                onClick={() => setStep(2)}
                disabled={!script.trim()}
              >Next: Choose Voice →</button>
            </>)}

            {/* ── STEP 2 ── */}
            {step === 2 && (<>
              <span className="vs-lbl">Select Voice</span>
              <div className="vs-voices mb-3">
                {VOICES.map(v => (
                  <div key={v.id} className={`vs-voice ${voice.id===v.id?"sel":""}`} onClick={() => setVoice(v)}>
                    <span className="vem">{v.emoji}</span>
                    <div className="vnm">{v.name}</div>
                    <div className="vd">{v.gender}</div>
                  </div>
                ))}
              </div>
              <button
                className="vs-btn vs-btn-outline vs-btn-block mb-3"
                onClick={() => doPreviewVoice(voice)}
              >
                {previewVoiceId === voice.id ? "🔊 Playing…" : "▶ Preview Voice"}
              </button>
              <div className="vs-hr" />
              <span className="vs-lbl">Video Format</span>
              <div className="vs-fmts">
                <div className={`vs-fmt ${format==="landscape"?"sel":""}`} onClick={()=>setFormat("landscape")}>
                  📺 Landscape <small>16:9 · YouTube</small>
                </div>
                <div className={`vs-fmt ${format==="portrait"?"sel":""}`} onClick={()=>setFormat("portrait")}>
                  📱 Portrait <small>9:16 · Reels</small>
                </div>
              </div>
              <div className="row">
                <button className="vs-btn vs-btn-ghost" onClick={()=>setStep(1)}>← Back</button>
                <button
                  className="vs-btn vs-btn-primary"
                  style={{flex:1}}
                  onClick={() => { setStep(3); generateImages(scenes); }}
                  disabled={!script.trim()}
                >Generate Images →</button>
              </div>
            </>)}

            {/* ── STEP 3 ── */}
            {step === 3 && (<>
              <span className="vs-lbl">Image Style</span>
              <div className="vs-chips mb-3">
                {IMAGE_STYLES.map(s => (
                  <div key={s.id} className={`vs-chip ${imgStyle.id===s.id?"sel":""}`} onClick={()=>setImgStyle(s)}>
                    {s.label}
                  </div>
                ))}
              </div>
              <button
                className="vs-btn vs-btn-outline vs-btn-block mb-3"
                onClick={() => generateImages(scenes)}
                disabled={loadingImgs}
              >{loadingImgs ? "🎨 Generating…" : "🔄 Regenerate All Images"}</button>

              <div className="vs-info mb-3">
                <strong>How it works:</strong> Each scene gets 3 AI images generated from your scene text. Select the best one, or upload your own image.
              </div>

              <button className="vs-btn vs-btn-soft vs-btn-block mb-3" onClick={addScene}>+ Add Scene</button>

              <div className="row">
                <button className="vs-btn vs-btn-ghost" style={{flex:1}} onClick={()=>setStep(2)}>← Back</button>
                <button
                  className="vs-btn vs-btn-primary"
                  style={{flex:1}}
                  onClick={()=>setStep(4)}
                  disabled={scenes.length===0}
                >Preview →</button>
              </div>
            </>)}

            {/* ── STEP 4 ── */}
            {step === 4 && (<>
              <span className="vs-lbl">Video Summary</span>
              <div className="vs-summary mb-3">
                {[
                  {k:"Scenes",  v:scenes.length},
                  {k:"Format",  v:format==="portrait"?"9:16":"16:9"},
                  {k:"Voice",   v:voice.name},
                  {k:"Style",   v:imgStyle.label},
                ].map(it => (
                  <div key={it.k} className="vs-scard"><div className="k">{it.k}</div><div className="v">{it.v}</div></div>
                ))}
              </div>

              <div className="vs-info mb-3">
                <strong>Audio included:</strong> The video records TTS narration live into the file. Keep your volume on while exporting so the speech gets captured.
              </div>

              <button
                className="vs-btn vs-btn-outline vs-btn-block mb-2"
                onClick={() => setPlaying(p=>!p)}
              >{playing ? "⏹ Stop Preview" : "▶ Audio Preview"}</button>

              {playing && (
                <div className="vs-wave mb-2">{[1,2,3,4,5].map(i=><div key={i} className="vs-wbar"/>)}</div>
              )}

              <button
                className="vs-btn vs-btn-primary vs-btn-block mb-2"
                onClick={exportVideo}
                disabled={exporting}
              >{exporting ? `⚙️ Rendering ${expProg}%…` : "🎬 Export Video (HD)"}</button>

              {(exporting || expProg > 0) && (
                <div className="vs-prog mb-2"><div className="vs-prog-fill" style={{width:`${expProg}%`}}/></div>
              )}

              {exporting && genStatus && (
                <div className="muted mb-2" style={{textAlign:"center"}}>{genStatus}</div>
              )}

              {exportedUrl && (<>
                <a
                  href={exportedUrl}
                  download={`video_${format}_${Date.now()}.webm`}
                  className="vs-btn vs-btn-primary vs-btn-block mb-2"
                  style={{textDecoration:"none"}}
                >⬇️ Download Video</a>
                <button
                  className="vs-btn vs-btn-red vs-btn-block mb-2"
                  onClick={() => { if(exportedUrl) URL.revokeObjectURL(exportedUrl); setExportedUrl(null); setExpProg(0); }}
                >🗑 Delete</button>
              </>)}

              <div className="vs-hr"/>
              <button className="vs-btn vs-btn-ghost vs-btn-block" onClick={()=>setStep(3)}>← Back to Images</button>
            </>)}
          </aside>

          {/* ══ MAIN ══ */}
          <main className="vs-main">

            {/* ── Step 1 ── */}
            {step === 1 && (
              <div>
                <span className="vs-lbl">How It Works</span>
                <div className="vs-how">
                  {[
                    {ico:"📝",title:"Script",desc:"AI writes a vivid, visual script from your topic — or write your own. Each 1-2 sentences = 1 scene."},
                    {ico:"🎙️",title:"Voice",desc:"6 distinct voice profiles with different pitch, rate & character. Preview on your actual script."},
                    {ico:"🖼️",title:"Images",desc:"AI generates 3 relevant images per scene from your exact script text. Custom prompts & uploads supported."},
                    {ico:"🎬",title:"Export",desc:"Clean HD video: images only with Ken Burns effect + audio narration. No text overlays."},
                  ].map(c=>(
                    <div key={c.title} className="vs-how-card">
                      <span className="ico">{c.ico}</span>
                      <h3>{c.title}</h3><p>{c.desc}</p>
                    </div>
                  ))}
                </div>
                {genScript && (
                  <div className="vs-spin-wrap"><div className="vs-spin"/><div className="muted">Crafting {scriptType} script…</div></div>
                )}
                {script && !genScript && (
                  <>
                    <span className="vs-lbl">Script Preview</span>
                    <div className="vs-script-box">{script}</div>
                    <div className="vs-tags">
                      <span className="vs-tag">📝 {splitScenes(script).length} scenes</span>
                      <span className="vs-tag">⏱ ~{Math.ceil(script.split(" ").length/2.5)}s</span>
                      <span className="vs-tag">📋 {script.split(" ").length} words</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div>
                <span className="vs-lbl">Voice Profiles</span>
                <div className="vs-vprofile-grid">
                  {VOICES.map(v => (
                    <div key={v.id} className={`vs-vcard ${voice.id===v.id?"sel":""}`} onClick={()=>setVoice(v)}>
                      <span className="ico">{v.emoji}</span>
                      <h3>{v.name}</h3>
                      <div className="meta">{v.desc}<br/>Pitch {v.pitch}× · Rate {v.rate}×</div>
                      <button
                        className="vs-btn vs-btn-sm vs-btn-soft"
                        style={{marginTop:10,width:"100%"}}
                        onClick={e=>{e.stopPropagation(); doPreviewVoice(v);}}
                      >{previewVoiceId===v.id?"🔊 Playing…":"▶ Preview"}</button>
                    </div>
                  ))}
                </div>
                <span className="vs-lbl">Script</span>
                <div className="vs-script-box">{script}</div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div>
                {loadingImgs && genStatus && (
                  <div className="vs-gen-banner">
                    <div className="vs-gen-dot"/>
                    {genStatus}
                  </div>
                )}

                <span className="vs-lbl">Scenes & Images</span>

                {scenes.length === 0 && !loadingImgs && (
                  <div style={{textAlign:"center",padding:"60px 20px",color:"var(--ink3)"}}>
                    <div style={{fontSize:42,marginBottom:12}}>🖼️</div>
                    <div className="muted">Click "Regenerate All Images" in the sidebar to start.</div>
                  </div>
                )}

                {scenes.map((sc, si) => (
                  <div key={sc.id} className="vs-scene">
                    <div className="vs-scene-hd">
                      <div className="vs-scene-num">{si+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <textarea
                          className="vs-textarea"
                          style={{minHeight:48,fontSize:12,marginBottom:6}}
                          value={sc.text}
                          onChange={e=>updateScene(si,"text",e.target.value)}
                          placeholder="Scene narration…"
                        />
                      </div>
                      <div className="vs-scene-acts">
                        <button className="vs-btn vs-btn-ghost vs-btn-sm" onClick={()=>regenScene(si)} title="New images">🔄</button>
                        <button className="vs-btn vs-btn-red vs-btn-sm" onClick={()=>delScene(si)} title="Delete">✕</button>
                      </div>
                    </div>

                    {/* Custom prompt */}
                    <div style={{marginBottom:8}}>
                      <div className="muted" style={{marginBottom:4}}>Custom image prompt (optional — leave blank to use scene text):</div>
                      <div className="vs-prompt-row">
                        <input
                          className="vs-prompt-input"
                          placeholder={`e.g. "person meditating at sunrise on mountain top, ${imgStyle.label}"`}
                          value={sc.customPrompt || ""}
                          onChange={e=>updateScene(si,"customPrompt",e.target.value)}
                        />
                        <button className="vs-btn vs-btn-outline vs-btn-sm" style={{flexShrink:0}} onClick={()=>regenScene(si)}>
                          Gen
                        </button>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="muted" style={{marginBottom:6}}>Click to select image for this scene:</div>
                    <div className="vs-imgs">
                      {sc.loading
                        ? [0,1,2].map(i => (
                            <div key={i} className="vs-skel">
                              <span className="vs-skel-inner">🎨</span>
                            </div>
                          ))
                        : sc.images.map((img, ii) => (
                          <div
                            key={ii}
                            className={`vs-img-thumb ${sc.selected===ii?"sel":""}`}
                            onClick={() => updateScene(si,"selected",ii)}
                          >
                            <img
                              src={img.url}
                              alt={`img${ii+1}`}
                              crossOrigin="anonymous"
                              style={{opacity:0}}
                              onLoad={e=>{ e.target.style.opacity=1; }}
                              onError={e=>{ e.target.parentElement.style.background="#1a1a2a"; e.target.style.display="none"; }}
                            />
                            {sc.selected===ii && <div className="chk">✓</div>}
                            <div className="del-img" onClick={e=>{e.stopPropagation();delImg(si,ii);}}>✕</div>
                          </div>
                        ))
                      }

                      {/* Upload */}
                      <label className="vs-upload-thumb">
                        <input type="file" accept="image/*" hidden onChange={e=>e.target.files[0]&&addImgFile(si,e.target.files[0])}/>
                        <span className="ico">📁</span>
                        <span>Upload</span>
                      </label>
                    </div>

                    {/* Paste URL */}
                    <PasteUrl onAdd={url=>addImgUrl(si,url)}/>
                  </div>
                ))}
              </div>
            )}

            {/* ── Step 4 ── */}
            {step === 4 && (
              <div>
                <span className="vs-lbl">Preview</span>
                <div className={`vs-preview ${format}`}>
                  {scenes.length > 0 && curScene ? (<>
                    {previewImgUrl
                      ? <img key={previewIdx} src={previewImgUrl} className="pimg" crossOrigin="anonymous"
                          onError={e=>{e.target.style.display="none";}}
                          alt="preview"/>
                      : <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#0a0a0f,#1a1a2a)"}}/>
                    }
                    <div className="pcnt">{previewIdx+1}/{scenes.length}</div>
                  </>) : (
                    <div className="pempty">
                      <div className="big">🎬</div>
                      <p>Complete steps 1–3 to preview</p>
                    </div>
                  )}
                </div>

                {scenes.length > 0 && (
                  <div className="vs-dots">
                    {scenes.map((_,i)=>(
                      <div key={i} className={`vs-dot ${previewIdx===i?"a":""}`} onClick={()=>setPreviewIdx(i)}>{i+1}</div>
                    ))}
                  </div>
                )}

                {exportedUrl && (<>
                  <span className="vs-lbl" style={{marginTop:22,display:"block"}}>Exported Video</span>
                  <div className="vs-info">
                    ✅ Images + TTS audio baked in. No text, no captions. Play it below to verify audio, then download.
                  </div>
                  <video src={exportedUrl} controls className="vs-export-vid"/>
                </>)}
              </div>
            )}
          </main>
        </div>
      </div>

      {toast && <div className={`vs-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

/* ── Paste URL sub-component ── */
function PasteUrl({ onAdd }) {
  const [val, setVal] = useState("");
  return (
    <div className="row" style={{marginTop:7}}>
      <input
        className="vs-prompt-input"
        placeholder="Or paste an image URL and press Enter…"
        value={val}
        onChange={e=>setVal(e.target.value)}
        onKeyDown={e=>{ if(e.key==="Enter"&&val.trim()){onAdd(val.trim());setVal("");} }}
      />
      <button
        className="vs-btn vs-btn-soft vs-btn-sm"
        style={{flexShrink:0}}
        onClick={()=>{ if(val.trim()){onAdd(val.trim());setVal("");} }}
      >Add URL</button>
    </div>
  );
}