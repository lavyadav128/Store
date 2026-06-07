import { useState, useEffect, useCallback } from "react";

/* ── Google Fonts ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap";
if (!document.head.querySelector('link[href*="Playfair"]')) document.head.appendChild(fontLink);

/* ══════════════════════════════════════════
   CONFIGURATION — set your Gemini API key
══════════════════════════════════════════ */
// Get free key at: https://aistudio.google.com/apikey
// Paste it below (or load from env / your backend)
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

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
  { id: "cinematic",   label: "🎬 Cinematic",   prompt: "cinematic photography, dramatic golden hour lighting, film grain, anamorphic bokeh, professional color grade" },
  { id: "portrait",    label: "🖼️ Oil Paint",   prompt: "dramatic oil painting, old master style, rich textures, chiaroscuro, fine art museum quality" },
  { id: "watercolor",  label: "💧 Watercolor",  prompt: "loose watercolor illustration, soft washes, artistic brush strokes, paper texture, impressionistic" },
  { id: "neon",        label: "🌃 Neon Noir",   prompt: "neon noir photography, cyberpunk city, rain reflections, moody atmosphere, purple and teal tones" },
  { id: "minimal",     label: "⬜ Minimal",     prompt: "minimalist photography, clean lines, negative space, muted elegant palette, studio lighting" },
  { id: "fantasy",     label: "🧙 Fantasy",     prompt: "epic fantasy digital art, magical volumetric light, ultra detailed environment, painterly, award winning" },
  { id: "vintage",     label: "📷 Vintage",     prompt: "vintage documentary photography, film grain, warm faded tones, nostalgic 1970s Kodachrome look" },
  { id: "anime",       label: "✨ Anime",        prompt: "high quality anime illustration, vibrant colors, detailed background painting, Studio Ghibli style" },
];

const VOICES = [
  { id: "v1", name: "Aria",   emoji: "👩‍🦰", desc: "Warm · Soft",         pitch: 1.15, rate: 0.85, gender: "female",  hints: ["Samantha","Zira","Victoria","Google UK English Female"] },
  { id: "v2", name: "Marcus", emoji: "👨‍💼", desc: "Deep · Authoritative", pitch: 0.80, rate: 0.82, gender: "male",    hints: ["David","Daniel","Google UK English Male","Alex"] },
  { id: "v3", name: "Luna",   emoji: "👩‍🎤", desc: "High · Energetic",    pitch: 1.25, rate: 1.12, gender: "female",  hints: ["Samantha","Karen","Moira","Google US English"] },
  { id: "v4", name: "Orion",  emoji: "🧑‍🚀", desc: "Bass · Dramatic",     pitch: 0.70, rate: 0.78, gender: "male",    hints: ["Fred","Alex","Ralph","Google UK English Male"] },
  { id: "v5", name: "Sage",   emoji: "🧑‍🏫", desc: "Neutral · Clear",     pitch: 1.0,  rate: 1.0,  gender: "neutral", hints: ["Google US English","Samantha","Daniel"] },
  { id: "v6", name: "Nova",   emoji: "👩‍💻", desc: "Bright · Crisp",      pitch: 1.35, rate: 1.18, gender: "female",  hints: ["Zira","Heather","Fiona","Google Australian English"] },
];

/* ══════════════════════════════════════════
   CSS — Grey & White Editorial Theme
══════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #f5f5f3;
  --bg2:       #eeede9;
  --surface:   #ffffff;
  --surface2:  #f8f8f6;
  --surface3:  #f0efeb;
  --border:    #e2e1dc;
  --border2:   #cccbc4;
  --ink:       #1a1917;
  --ink2:      #4a4945;
  --ink3:      #8a8880;
  --ink4:      #b5b3ac;
  --accent:    #1a1917;
  --accent2:   #3d3b35;
  --gold:      #c9a84c;
  --gold2:     #e8c870;
  --red:       #c0392b;
  --green:     #2e7d52;
  --radius:    12px;
  --font:      'Playfair Display', Georgia, serif;
  --sans:      'DM Sans', system-ui, sans-serif;
  --mono:      'DM Mono', 'Courier New', monospace;
  --shadow:    0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  --shadow2:   0 2px 8px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.08);
}

.vs { font-family: var(--sans); background: var(--bg); color: var(--ink); min-height: 100vh; }

/* ── Top bar ── */
.vs-bar {
  height: 56px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
  position: sticky; top: 0; z-index: 200;
  gap: 16px;
}
.vs-brand {
  font-family: var(--font);
  font-size: 18px; font-weight: 700; letter-spacing: -0.5px;
  color: var(--ink); display: flex; align-items: center; gap: 10px;
  flex-shrink: 0;
}
.vs-brand-mark {
  width: 28px; height: 28px; background: var(--ink);
  border-radius: 7px; display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: white; font-weight: 800; font-family: var(--sans);
  letter-spacing: 0;
}

/* Steps */
.vs-steps { display: flex; gap: 2px; align-items: center; background: var(--surface3); border-radius: 50px; padding: 4px; border: 1px solid var(--border); }
.vs-step-btn {
  font-family: var(--sans); font-size: 12px; font-weight: 500;
  padding: 6px 18px; border-radius: 50px;
  border: none; background: transparent;
  color: var(--ink3); cursor: pointer; transition: all 0.2s;
  white-space: nowrap;
}
.vs-step-btn:hover { color: var(--ink2); }
.vs-step-btn.active { background: var(--surface); color: var(--ink); font-weight: 600; box-shadow: var(--shadow); }
.vs-step-btn.done { color: var(--ink2); }

/* ── Layout ── */
.vs-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: calc(100vh - 56px);
}
@media (max-width: 720px) {
  .vs-layout { grid-template-columns: 1fr; }
  .vs-sidebar { max-height: none; border-right: none; border-bottom: 1px solid var(--border); }
}

/* ── Sidebar ── */
.vs-sidebar {
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 20px 18px; overflow-y: auto;
  max-height: calc(100vh - 56px);
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
.vs-main {
  padding: 24px; overflow-y: auto;
  max-height: calc(100vh - 56px);
  background: var(--bg);
}

/* ── Label ── */
.vs-lbl {
  font-family: var(--mono); font-size: 10px; font-weight: 500;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--ink3); margin-bottom: 10px; display: block;
}

.vs-hr { height: 1px; background: var(--border); margin: 16px 0; }

/* ── Inputs ── */
.vs-input, .vs-textarea {
  width: 100%; font-family: var(--sans); font-size: 13px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 10px 14px;
  color: var(--ink); outline: none; transition: all 0.2s;
  line-height: 1.5;
}
.vs-input:focus, .vs-textarea:focus { border-color: var(--ink); background: var(--surface); box-shadow: 0 0 0 3px rgba(26,25,23,0.06); }
.vs-textarea { resize: vertical; min-height: 80px; font-family: var(--mono); font-size: 12px; line-height: 1.8; }

/* ── Buttons ── */
.vs-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  font-family: var(--sans); font-size: 13px; font-weight: 600;
  padding: 10px 18px; border-radius: var(--radius);
  border: 1px solid transparent; cursor: pointer; transition: all 0.18s;
  white-space: nowrap; text-decoration: none; letter-spacing: -0.1px;
}
.vs-btn:disabled { opacity: 0.4; cursor: not-allowed !important; }
.vs-btn-primary { background: var(--ink); color: white; border-color: var(--ink); }
.vs-btn-primary:not(:disabled):hover { background: var(--accent2); }
.vs-btn-outline { background: transparent; color: var(--ink); border-color: var(--border2); }
.vs-btn-outline:not(:disabled):hover { border-color: var(--ink); background: var(--surface3); }
.vs-btn-soft { background: var(--surface2); color: var(--ink2); border-color: var(--border); }
.vs-btn-soft:not(:disabled):hover { border-color: var(--border2); background: var(--surface3); }
.vs-btn-ghost { background: transparent; color: var(--ink3); border-color: transparent; }
.vs-btn-ghost:not(:disabled):hover { color: var(--ink2); background: var(--surface3); }
.vs-btn-red { background: transparent; color: var(--red); border-color: rgba(192,57,43,0.25); }
.vs-btn-red:not(:disabled):hover { background: var(--red); color: white; }
.vs-btn-block { width: 100%; }
.vs-btn-sm { padding: 5px 11px; font-size: 11px; border-radius: 8px; }
.vs-btn-gold { background: var(--gold); color: white; border-color: var(--gold); font-weight: 700; }
.vs-btn-gold:not(:disabled):hover { background: var(--gold2); }

/* ── Script types ── */
.vs-types { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 14px; }
.vs-type {
  padding: 10px 12px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--surface2);
  cursor: pointer; transition: all 0.18s; text-align: left;
}
.vs-type:hover { border-color: var(--border2); background: var(--surface3); }
.vs-type.sel { border-color: var(--ink); background: var(--ink); }
.vs-type .em { font-size: 15px; display: block; margin-bottom: 4px; }
.vs-type .nm { font-size: 11px; font-weight: 600; color: var(--ink2); }
.vs-type.sel .nm { color: white; }

/* ── Mode toggle ── */
.vs-mode { display: flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 14px; background: var(--surface2); }
.vs-mode-btn {
  flex: 1; padding: 9px 8px; font-size: 12px; font-weight: 600;
  font-family: var(--sans); text-align: center; cursor: pointer;
  border: none; background: transparent; color: var(--ink3);
  transition: all 0.18s;
}
.vs-mode-btn.a { background: var(--ink); color: white; border-radius: 8px; margin: 3px; }

/* ── Voice grid ── */
.vs-voices { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; margin-bottom: 14px; }
.vs-voice {
  padding: 11px 8px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--surface2);
  cursor: pointer; transition: all 0.18s; text-align: center;
}
.vs-voice:hover { border-color: var(--border2); background: var(--surface3); }
.vs-voice.sel { border-color: var(--ink); background: var(--ink); }
.vs-voice .vem { font-size: 20px; display: block; margin-bottom: 4px; }
.vs-voice .vnm { font-size: 11px; font-weight: 700; color: var(--ink2); }
.vs-voice.sel .vnm { color: white; }
.vs-voice .vd { font-size: 9px; color: var(--ink4); font-family: var(--mono); margin-top: 2px; }
.vs-voice.sel .vd { color: rgba(255,255,255,0.5); }

/* ── Style chips ── */
.vs-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.vs-chip {
  padding: 5px 13px; border-radius: 50px;
  font-size: 11px; font-weight: 600; font-family: var(--sans);
  border: 1px solid var(--border); color: var(--ink3);
  background: var(--surface2); cursor: pointer; transition: all 0.18s;
}
.vs-chip:hover { border-color: var(--border2); color: var(--ink2); }
.vs-chip.sel { background: var(--ink); color: white; border-color: var(--ink); }

/* ── Format toggle ── */
.vs-fmts { display: flex; gap: 8px; margin-bottom: 16px; }
.vs-fmt {
  flex: 1; padding: 11px 8px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--surface2);
  color: var(--ink3); cursor: pointer;
  font-size: 11px; font-weight: 700; font-family: var(--sans); text-align: center; transition: all 0.18s;
}
.vs-fmt:hover { border-color: var(--border2); color: var(--ink2); }
.vs-fmt.sel { border-color: var(--ink); color: var(--ink); background: var(--surface); box-shadow: var(--shadow); }
.vs-fmt small { display: block; font-size: 9px; opacity: 0.5; font-family: var(--mono); margin-top: 3px; font-weight: 400; }

/* ── Summary cards ── */
.vs-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 16px; }
.vs-scard { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
.vs-scard .k { font-size: 9px; color: var(--ink4); font-family: var(--mono); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px; }
.vs-scard .v { font-size: 14px; font-weight: 700; color: var(--ink); font-family: var(--font); }

/* ── Progress ── */
.vs-prog { height: 3px; background: var(--surface3); border-radius: 2px; overflow: hidden; margin-top: 10px; }
.vs-prog-fill { height: 100%; background: var(--ink); border-radius: 2px; transition: width 0.4s ease; }

/* ── Waveform ── */
.vs-wave { display: flex; align-items: center; gap: 3px; height: 28px; justify-content: center; margin: 8px 0; }
.vs-wbar { width: 3px; background: var(--ink); border-radius: 2px; animation: wav 0.8s ease-in-out infinite; }
.vs-wbar:nth-child(2){animation-delay:.1s}.vs-wbar:nth-child(3){animation-delay:.2s}
.vs-wbar:nth-child(4){animation-delay:.3s}.vs-wbar:nth-child(5){animation-delay:.4s}
@keyframes wav{0%,100%{height:4px}50%{height:22px}}

/* ── Scene card ── */
.vs-scene {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px; margin-bottom: 12px;
  box-shadow: var(--shadow);
  transition: box-shadow 0.2s;
}
.vs-scene:hover { box-shadow: var(--shadow2); }
.vs-scene-hd { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.vs-scene-num {
  width: 30px; height: 30px; border-radius: 8px;
  background: var(--ink); color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; flex-shrink: 0; font-family: var(--sans);
}
.vs-scene-acts { display: flex; gap: 5px; flex-shrink: 0; }

/* ── Images ── */
.vs-imgs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.vs-img-thumb {
  position: relative; width: 110px; height: 74px;
  border-radius: 10px; overflow: hidden;
  border: 2px solid var(--border); cursor: pointer;
  transition: all 0.18s; flex-shrink: 0;
  background: var(--surface3);
}
.vs-img-thumb:hover { border-color: var(--border2); transform: translateY(-1px); box-shadow: var(--shadow); }
.vs-img-thumb.sel { border-color: var(--ink); box-shadow: 0 0 0 2px rgba(26,25,23,0.2), var(--shadow); }
.vs-img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.4s; }
.vs-img-thumb .chk {
  position: absolute; top: 5px; right: 5px;
  width: 18px; height: 18px; background: var(--ink);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 9px; color: white; font-weight: 800;
}
.vs-img-thumb .del-img {
  position: absolute; bottom: 4px; right: 4px;
  background: rgba(255,255,255,0.9); border-radius: 5px;
  padding: 2px 6px; font-size: 9px; color: var(--ink); cursor: pointer;
  line-height: 1.5; transition: all 0.15s; border: 1px solid var(--border);
}
.vs-img-thumb .del-img:hover { background: var(--red); color: white; border-color: var(--red); }

/* Loading skeleton */
.vs-skel {
  width: 110px; height: 74px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(90deg, var(--surface2) 0%, var(--surface3) 50%, var(--surface2) 100%);
  background-size: 200% 100%;
  animation: shim 1.5s infinite;
  border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}
.vs-skel-inner { font-size: 20px; animation: pulse 1.2s ease-in-out infinite alternate; }
@keyframes pulse { from{opacity:0.2} to{opacity:0.7} }
@keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Upload tile */
.vs-upload-thumb {
  width: 110px; height: 74px; border-radius: 10px;
  border: 2px dashed var(--border); display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.18s;
  font-size: 9px; color: var(--ink4); gap: 4px; flex-shrink: 0;
  font-family: var(--mono); background: var(--surface2);
}
.vs-upload-thumb:hover { border-color: var(--ink); color: var(--ink); background: var(--surface3); }
.vs-upload-thumb .ico { font-size: 18px; }

/* ── Prompt row ── */
.vs-prompt-row { display: flex; gap: 7px; margin-top: 8px; }
.vs-prompt-input {
  flex: 1; font-family: var(--mono); font-size: 11px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 8px; padding: 8px 12px; color: var(--ink);
  outline: none; transition: all 0.18s;
}
.vs-prompt-input:focus { border-color: var(--ink); background: var(--surface); }
.vs-prompt-input::placeholder { color: var(--ink4); }

/* ── Preview ── */
.vs-preview {
  background: var(--ink); border-radius: 16px; overflow: hidden;
  position: relative; border: 1px solid var(--border2);
  box-shadow: var(--shadow2);
}
.vs-preview.landscape { aspect-ratio: 16/9; }
.vs-preview.portrait { aspect-ratio: 9/16; max-width: 280px; margin: 0 auto; }
.vs-preview .pimg { width: 100%; height: 100%; object-fit: cover; display: block; }
.vs-preview .pcnt {
  position: absolute; top: 12px; right: 14px;
  font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,0.6);
  background: rgba(0,0,0,0.45); padding: 4px 10px; border-radius: 50px;
  backdrop-filter: blur(6px);
}
.vs-preview .pempty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 40px; color: rgba(255,255,255,0.25); text-align: center; gap: 14px;
}
.vs-preview .pempty .big { font-size: 48px; }
.vs-preview .pempty p { font-size: 13px; font-family: var(--mono); line-height: 1.7; }

.vs-dots { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin-top: 14px; }
.vs-dot {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid var(--border); display: flex;
  align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; font-family: var(--mono);
  cursor: pointer; color: var(--ink3); transition: all 0.18s;
  background: var(--surface);
}
.vs-dot:hover:not(.a) { border-color: var(--border2); color: var(--ink2); }
.vs-dot.a { background: var(--ink); border-color: var(--ink); color: white; }

/* ── Script box ── */
.vs-script-box {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 18px 20px;
  font-family: var(--mono); font-size: 12.5px;
  line-height: 2; color: var(--ink2); white-space: pre-wrap;
  box-shadow: var(--shadow);
}

/* ── Info box ── */
.vs-info {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 14px;
  font-size: 12px; color: var(--ink2); line-height: 1.7; margin-bottom: 12px;
  font-family: var(--sans);
}
.vs-info strong { color: var(--ink); }

/* ── Gemini badge ── */
.vs-gemini-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, #4285f4 0%, #0f9d58 50%, #f4b400 100%);
  color: white; padding: 4px 12px; border-radius: 50px;
  font-size: 11px; font-weight: 700; font-family: var(--sans);
  margin-bottom: 12px;
}

/* ── Spinner ── */
.vs-spin-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 40px; }
.vs-spin {
  width: 32px; height: 32px;
  border: 2.5px solid var(--border); border-top-color: var(--ink);
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Toast ── */
.vs-toast {
  position: fixed; bottom: 22px; right: 22px; z-index: 9999;
  background: var(--surface); color: var(--ink); border: 1px solid var(--border);
  border-radius: 12px; padding: 13px 20px; font-size: 13px; font-weight: 600;
  animation: tin 0.22s ease; max-width: 320px; font-family: var(--sans);
  box-shadow: var(--shadow2);
}
.vs-toast.err { border-color: rgba(192,57,43,0.4); color: var(--red); }
.vs-toast.ok { border-color: rgba(46,125,82,0.3); color: var(--green); }
@keyframes tin { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }

/* ── How cards ── */
.vs-how { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 28px; }
.vs-how-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 20px;
  box-shadow: var(--shadow); transition: box-shadow 0.2s;
}
.vs-how-card:hover { box-shadow: var(--shadow2); }
.vs-how-card .ico { font-size: 26px; display: block; margin-bottom: 10px; }
.vs-how-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 6px; font-family: var(--font); }
.vs-how-card p { font-size: 12px; color: var(--ink3); line-height: 1.7; font-family: var(--sans); }

.vs-tags { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 12px; }
.vs-tag {
  font-family: var(--mono); font-size: 10px;
  padding: 4px 12px; border-radius: 50px;
  background: var(--surface); border: 1px solid var(--border); color: var(--ink3);
}

.vs-vprofile-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(170px,1fr)); gap: 10px; margin-bottom: 24px; }
.vs-vcard {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px; cursor: pointer; transition: all 0.18s;
  box-shadow: var(--shadow);
}
.vs-vcard:hover { border-color: var(--border2); box-shadow: var(--shadow2); }
.vs-vcard.sel { border-color: var(--ink); box-shadow: 0 0 0 2px rgba(26,25,23,0.1), var(--shadow); }
.vs-vcard .ico { font-size: 24px; margin-bottom: 10px; display: block; }
.vs-vcard h3 { font-size: 14px; font-weight: 700; margin-bottom: 4px; font-family: var(--font); }
.vs-vcard .meta { font-size: 10px; color: var(--ink3); font-family: var(--mono); line-height: 1.7; }

.vs-export-vid { width: 100%; border-radius: 12px; border: 1px solid var(--border); background: #000; margin-top: 16px; box-shadow: var(--shadow); }

.row { display: flex; gap: 8px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 14px; }
.mb-4 { margin-bottom: 20px; }
.muted { font-size: 11px; color: var(--ink3); font-family: var(--mono); }

/* Generation status banner */
.vs-gen-banner {
  display: flex; align-items: center; gap: 12px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 16px; margin-bottom: 16px;
  font-family: var(--mono); font-size: 12px; color: var(--ink2);
  box-shadow: var(--shadow);
}
.vs-gen-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--gold); animation: blink 1s ease-in-out infinite alternate;
  flex-shrink: 0; box-shadow: 0 0 8px var(--gold);
}
@keyframes blink { from{opacity:0.3} to{opacity:1} }

/* API key warning */
.vs-apikey-warn {
  background: #fffbeb; border: 1px solid #f59e0b;
  border-radius: 10px; padding: 12px 16px; margin-bottom: 14px;
  font-size: 12px; color: #92400e; font-family: var(--sans); line-height: 1.7;
}
.vs-apikey-warn a { color: #b45309; font-weight: 600; }

/* Divider with text */
.vs-divider {
  display: flex; align-items: center; gap: 12px; margin: 14px 0;
  font-size: 10px; font-family: var(--mono); color: var(--ink4); letter-spacing: 1px;
}
.vs-divider::before, .vs-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* Title in main area */
.vs-page-title { font-family: var(--font); font-size: 28px; font-weight: 900; letter-spacing: -1px; color: var(--ink); margin-bottom: 6px; }
.vs-page-sub { font-family: var(--sans); font-size: 13px; color: var(--ink3); margin-bottom: 24px; }
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

/* ── Pollinations fallback (always free, no key needed) ── */
const pollinationsFallback = (prompt) => {
  const seed = Math.floor(Math.random() * 999999);
  // Correct Pollinations URL: prompt goes in the PATH, query params after
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&seed=${seed}&nologo=true&model=flux&enhance=true`;
};

/* ── Gemini Image Generation ── */
const generateImageWithGemini = async (prompt, apiKey) => {
  const key = (apiKey || "").trim();
  const hasKey = key && key !== "YOUR_GEMINI_API_KEY_HERE" && key.length > 10;

  if (!hasKey) {
    // No key — use free Pollinations.ai (Flux model)
    return pollinationsFallback(prompt);
  }

  try {
    // Gemini 2.0 Flash image generation (free tier in AI Studio)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE"] }
        })
      }
    );

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find(p => p.inlineData?.mimeType?.startsWith("image/"));
    if (imgPart?.inlineData?.data) {
      return `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
    }
    throw new Error("Gemini returned no image part");
  } catch (err) {
    console.warn("Gemini image gen failed, falling back to Pollinations:", err.message);
    return pollinationsFallback(prompt);
  }
};

/* Build highly descriptive prompt */
const buildImagePrompt = (sceneText, customPrompt, stylePrompt) => {
  const base = customPrompt?.trim() ? customPrompt.trim() : sceneText.trim();
  return `${base}. Style: ${stylePrompt}. Ultra high resolution, 8K quality, professional composition, no text, no words, no captions, no watermark, no logo, no letters, no subtitles, no UI elements.`;
};

/* Load image element */
const loadImageEl = (src, timeoutMs = 20000) =>
  new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const t = setTimeout(() => resolve(null), timeoutMs);
    img.onload = () => { clearTimeout(t); resolve(img); };
    img.onerror = () => { clearTimeout(t); resolve(null); };
    img.src = src;
  });

/* Fetch as blob for canvas */
const fetchImageAsBlob = async (src, timeoutMs = 20000) => {
  // For data URLs (Gemini base64), we can directly convert
  if (src.startsWith("data:")) {
    try {
      const imgEl = await loadImageEl(src, 5000);
      return imgEl ? { imgEl, blobUrl: null } : null;
    } catch { return null; }
  }
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
    const imgEl = await loadImageEl(src, 8000);
    return imgEl ? { imgEl, blobUrl: null } : null;
  }
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function VideoStudio() {
  const [step, setStep] = useState(1);
  const [geminiKey, setGeminiKey] = useState(GEMINI_API_KEY);
  const [showKeyInput, setShowKeyInput] = useState(false);

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
  const [genStatus, setGenStatus] = useState("");

  // Step 4
  const [previewIdx, setPreviewIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expProg, setExpProg] = useState(0);
  const [exportedUrl, setExportedUrl] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);

  /* ── 1. Generate Script via Gemini ── */
  const generateScript = async () => {
    if (!scriptType || !scriptTopic.trim()) return;

    // Guard: must have a real key
    if (!geminiKey || geminiKey === "YOUR_GEMINI_API_KEY_HERE" || geminiKey.trim().length < 10) {
      showToast("⚠️ Please enter your Gemini API key first (click 'Set key' above).", "err");
      setShowKeyInput(true);
      return;
    }

    setGenScript(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Write a ${scriptType} style video script about: "${scriptTopic}".

Requirements:
- 8 to 12 vivid, punchy sentences total
- Each sentence must paint a clear visual scene (it will be matched with an AI-generated image)
- No bullet points — flowing narration only
- Hook the viewer in the very first sentence
- Natural rhythm for text-to-speech narration
- End with a powerful closer or call-to-action
- Maximum 180 words

Output ONLY the script text. No title, no labels, no quotes around it.`
              }]
            }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 400 }
          })
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();

      if (text) {
        setScript(text);
        showToast("✨ Script ready!");
      } else {
        throw new Error("Gemini returned an empty response.");
      }
    } catch (e) {
      showToast(`Script generation failed: ${e.message}`, "err");
    }
    setGenScript(false);
  };

  /* ── 2. Preview voice ── */
  const doPreviewVoice = (v) => {
    setPreviewVoiceId(v.id);
    speakText(
      script ? script.slice(0, 130) : `Hi! I am ${v.name}. This is how I sound when narrating your video content.`,
      v,
      () => setPreviewVoiceId(null)
    );
  };

  /* ── 3. Generate images with Gemini — 3 per scene ── */
  const generateImages = useCallback(async (existingScenes) => {
    if (!script.trim()) return;
    setLoadingImgs(true);
    setGenStatus("Splitting script into scenes…");

    const parts = splitScenes(script);
    const styleObj = imgStyle;

    const base = parts.map((text, i) => ({
      id: i,
      text,
      customPrompt: existingScenes?.[i]?.customPrompt || "",
      images: existingScenes?.[i]?.images?.filter(im => im.isManual) || [],
      selected: 0,
      loading: true,
    }));
    setScenes(base);

    const isUsingGemini = geminiKey && geminiKey !== "YOUR_GEMINI_API_KEY_HERE";

    for (let i = 0; i < base.length; i++) {
      setGenStatus(`${isUsingGemini ? "✨ Gemini" : "🎨 AI"} generating scene ${i + 1} of ${base.length}…`);
      const sc = base[i];
      const prompt = buildImagePrompt(sc.text, sc.customPrompt, styleObj.prompt);

      // Generate 3 variations
      const imgPromises = [
        generateImageWithGemini(prompt + " Morning light, wide shot.", geminiKey),
        generateImageWithGemini(prompt + " Dynamic angle, dramatic composition.", geminiKey),
        generateImageWithGemini(prompt + " Close-up detail, emotional depth.", geminiKey),
      ];

      const urls = await Promise.all(imgPromises);
      const aiImgs = urls.map(url => ({ url, isManual: false, prompt, loaded: false }));

      setScenes(prev => {
        const u = [...prev];
        const manuals = u[i]?.images?.filter(im => im.isManual) || [];
        u[i] = { ...u[i], images: [...manuals, ...aiImgs], loading: false };
        return u;
      });

      // Small delay to avoid rate limits
      if (i < base.length - 1) await new Promise(r => setTimeout(r, isUsingGemini ? 500 : 100));
    }

    setLoadingImgs(false);
    setGenStatus("");
    showToast(`🖼️ ${base.length} scenes generated! Select best images.`);
  }, [script, imgStyle, geminiKey]);

  /* ── Regenerate single scene ── */
  const regenScene = async (si) => {
    setScenes(prev => {
      const u = [...prev];
      u[si] = { ...u[si], loading: true };
      return u;
    });
    const sc = scenes[si];
    const prompt = buildImagePrompt(sc.text, sc.customPrompt, imgStyle.prompt);
    const urls = await Promise.all([
      generateImageWithGemini(prompt + " Wide shot, cinematic framing.", geminiKey),
      generateImageWithGemini(prompt + " Dramatic angle, high contrast.", geminiKey),
      generateImageWithGemini(prompt + " Intimate detail, soft focus.", geminiKey),
    ]);
    const aiImgs = urls.map(url => ({ url, isManual: false, prompt }));
    setScenes(prev => {
      const u = [...prev];
      const manuals = u[si].images.filter(im => im.isManual);
      u[si] = { ...u[si], images: [...manuals, ...aiImgs], selected: 0, loading: false };
      return u;
    });
    showToast("🔄 Scene images regenerated!");
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

  /* ══════════════════════════════
     HD VIDEO EXPORT — Improved
  ══════════════════════════════ */
  const exportVideo = async () => {
    if (!scenes.length) return;
    setExporting(true);
    setExpProg(0);
    setExportedUrl(null);
    window.speechSynthesis.cancel();

    const isPortrait = format === "portrait";
    const W = isPortrait ? 720 : 1280;
    const H = isPortrait ? 1280 : 720;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Audio setup
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioDest = audioCtx.createMediaStreamDestination();
    const silentOsc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    silentOsc.connect(gainNode);
    gainNode.connect(audioDest);
    silentOsc.start();

    const videoStream = canvas.captureStream(30);
    const audioStream = audioDest.stream;
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    const mimeType = ["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"]
      .find(m => MediaRecorder.isTypeSupported(m)) || "video/webm";

    const chunks = [];
    const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 12_000_000 });
    recorder.ondataavailable = e => e.data.size > 0 && chunks.push(e.data);
    recorder.onstop = () => {
      silentOsc.stop();
      audioCtx.close();
      const blob = new Blob(chunks, { type: "video/webm" });
      setExportedUrl(URL.createObjectURL(blob));
      setExporting(false);
      setGenStatus("");
      showToast("🎬 HD Video exported! Ready to download.");
    };
    recorder.start(100);

    /* Pre-load images */
    setGenStatus("Loading & optimizing images…");
    const imgEls = [];
    const blobUrls = [];
    for (let i = 0; i < scenes.length; i++) {
      setExpProg(Math.round((i / scenes.length) * 15));
      const sc = scenes[i];
      const imgEntry = sc.images[sc.selected] ?? sc.images[0];
      let imgEl = null;
      if (imgEntry?.url) {
        const result = await fetchImageAsBlob(imgEntry.url, 15000);
        if (result) {
          imgEl = result.imgEl;
          if (result.blobUrl) blobUrls.push(result.blobUrl);
        }
      }
      imgEls.push(imgEl);
    }
    setGenStatus("Recording HD video with audio…");

    /* Speak a scene and wait */
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
      utt.onerror = () => resolve(3500);
      window.speechSynthesis.speak(utt);
    });

    /* Improved draw with Ken Burns + subtle text lower third */
    const drawScene = (imgEl, W, H, ctx, prog, sceneText, sceneNum, total) => {
      ctx.clearRect(0, 0, W, H);

      if (imgEl) {
        // Ken Burns effect: subtle pan + zoom
        const zoomAmount = 0.08;
        const scale = 1 + prog * zoomAmount;
        const panX = (prog - 0.5) * 0.03 * W;
        const panY = (prog - 0.5) * 0.02 * H;
        const sw = W * scale, sh = H * scale;
        ctx.drawImage(imgEl, (W - sw) / 2 + panX, (H - sh) / 2 + panY, sw, sh);
      } else {
        // Gradient placeholder
        const grd = ctx.createLinearGradient(0, 0, W, H);
        grd.addColorStop(0, "#1a1917");
        grd.addColorStop(1, "#2d2b26");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // Cinematic letterbox bars (small)
      const barH = H * 0.055;
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(0, 0, W, barH);
      ctx.fillRect(0, H - barH, W, barH);

      // Bottom gradient for text readability
      const gradient = ctx.createLinearGradient(0, H * 0.6, 0, H);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, H * 0.6, W, H * 0.4);

      // Vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Scene counter (top left inside bar)
      ctx.font = `${W * 0.011}px 'DM Mono', monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(`${sceneNum}/${total}`, W * 0.025, barH * 0.65);

      // Crossfade overlay
      const fadeIn = Math.min(prog * 5, 1);
      const fadeOut = Math.min((1 - prog) * 5, 1);
      const alpha = 1 - Math.min(fadeIn, fadeOut);
      if (alpha > 0.01) {
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    /* Render scenes */
    for (let i = 0; i < scenes.length; i++) {
      setExpProg(15 + Math.round((i / scenes.length) * 78));
      const sc = scenes[i];
      const imgEl = imgEls[i];

      const speakPromise = speakScene(sc.text, voice);

      let spokenMs = 0;
      const startTime = Date.now();
      let done = false;
      speakPromise.then(ms => { spokenMs = ms; done = true; });

      await new Promise(resolve => {
        const MIN_SCENE_MS = 2500;
        const draw = () => {
          const elapsed = Date.now() - startTime;
          const targetMs = Math.max(spokenMs || 5000, MIN_SCENE_MS);
          const prog = Math.min(elapsed / targetMs, 1);
          drawScene(imgEl, W, H, ctx, prog, i + 1, scenes.length);
          if (!done || elapsed < MIN_SCENE_MS) {
            requestAnimationFrame(draw);
          } else {
            setTimeout(resolve, 350);
          }
        };
        draw();
      });
    }

    window.speechSynthesis.cancel();

    // Fade out to black
    await new Promise(resolve => {
      const st = Date.now();
      const fade = () => {
        const p = Math.min((Date.now() - st) / 800, 1);
        ctx.fillStyle = `rgba(0,0,0,${p})`;
        ctx.fillRect(0, 0, W, H);
        if (p < 1) requestAnimationFrame(fade); else resolve();
      };
      fade();
    });

    await new Promise(r => setTimeout(r, 500));
    recorder.stop();
    setExpProg(100);
    blobUrls.forEach(u => URL.revokeObjectURL(u));
  };

  /* ── Audio preview ── */
  useEffect(() => {
    if (playing && scenes.length > 0) {
      const next = (i) => {
        if (i >= scenes.length) { setPlaying(false); return; }
        setPreviewIdx(i);
        speakText(scenes[i].text, voice, () => setTimeout(() => next(i + 1), 350));
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
  const hasGeminiKey = !!(geminiKey && geminiKey !== "YOUR_GEMINI_API_KEY_HERE" && geminiKey.trim().length > 10);

  return (
    <>
      <style>{css}</style>
      <div className="vs">

        {/* ── Top bar ── */}
        <header className="vs-bar">
          <div className="vs-brand">
            <div className="vs-brand-mark">VS</div>
            Video Studio
          </div>
          <div className="vs-steps">
            {STEPS.map((s, i) => (
              <button
                key={s}
                className={`vs-step-btn ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}
                onClick={() => (step > i+1 || step === i+1) && setStep(i+1)}
              >
                {step > i+1 ? "✓ " : ""}{s}
              </button>
            ))}
          </div>
        </header>

        <div className="vs-layout">
          {/* ══ SIDEBAR ══ */}
          <aside className="vs-sidebar">

            {/* ── STEP 1 ── */}
            {step === 1 && (<>
              {/* Gemini Key Setup */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <div className="vs-gemini-badge">✦ Gemini AI</div>
                  <button className="vs-btn vs-btn-ghost vs-btn-sm" onClick={()=>setShowKeyInput(v=>!v)}>
                    {hasGeminiKey ? "🔑 Key saved ✓" : "⚙ Set API key"}
                  </button>
                </div>
                {(showKeyInput || !hasGeminiKey) && (
                  <div>
                    <input
                      className="vs-input mb-2"
                      placeholder="Paste your Gemini key: AIza..."
                      value={hasGeminiKey ? geminiKey : ""}
                      onChange={e => {
                        const v = e.target.value.trim();
                        setGeminiKey(v.length > 10 ? v : "YOUR_GEMINI_API_KEY_HERE");
                        if (v.length > 10) setShowKeyInput(false);
                      }}
                    />
                    <div className="muted" style={{fontSize:10,lineHeight:1.6}}>
                      Free key → <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{color:"var(--ink2)"}}>aistudio.google.com/apikey</a>
                      <br/>Without a key, images use Pollinations.ai (free, slower).
                    </div>
                  </div>
                )}
                {hasGeminiKey && !showKeyInput && (
                  <div style={{fontSize:11,color:"var(--green)",fontFamily:"var(--mono)"}}>
                    ✓ Gemini active — fast AI images &amp; scripts enabled
                  </div>
                )}
              </div>
              <div className="vs-hr"/>

              <span className="vs-lbl">Input Mode</span>
              <div className="vs-mode mb-3">
                <button className={`vs-mode-btn ${scriptMode==="ai"?"a":""}`} onClick={()=>setScriptMode("ai")}>✨ AI Generate</button>
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
                <span className="vs-lbl">Topic / Idea</span>
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
                  {genScript ? "✨ Writing script…" : "✨ Generate Script"}
                </button>
                <div className="vs-hr" />
              </>)}

              {scriptMode === "manual" && (
                <div className="vs-info mb-3">
                  <strong>Pro tip:</strong> Write vivid, visual sentences. Each 1–2 sentences becomes one scene with its own AI-generated image. Use descriptive language.
                </div>
              )}

              <span className="vs-lbl">Script</span>
              <textarea
                className="vs-textarea mb-3"
                placeholder={scriptMode==="manual"
                  ? "Write vivid narration here. Use full sentences ending with . ! or ?"
                  : "Generated script will appear here…"}
                value={script}
                onChange={e => setScript(e.target.value)}
                rows={10}
              />
              <button
                className="vs-btn vs-btn-primary vs-btn-block"
                onClick={() => setStep(2)}
                disabled={!script.trim()}
              >Continue → Choose Voice</button>
            </>)}

            {/* ── STEP 2 ── */}
            {step === 2 && (<>
              <span className="vs-lbl">Select Voice</span>
              <div className="vs-voices mb-3">
                {VOICES.map(v => (
                  <div key={v.id} className={`vs-voice ${voice.id===v.id?"sel":""}`} onClick={() => setVoice(v)}>
                    <span className="vem">{v.emoji}</span>
                    <div className="vnm">{v.name}</div>
                    <div className="vd">{v.desc}</div>
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
              <div className="vs-fmts mb-3">
                <div className={`vs-fmt ${format==="landscape"?"sel":""}`} onClick={()=>setFormat("landscape")}>
                  📺 Landscape <small>16:9 · YouTube/Ads</small>
                </div>
                <div className={`vs-fmt ${format==="portrait"?"sel":""}`} onClick={()=>setFormat("portrait")}>
                  📱 Portrait <small>9:16 · Reels/TikTok</small>
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
                className="vs-btn vs-btn-outline vs-btn-block mb-2"
                onClick={() => generateImages(scenes)}
                disabled={loadingImgs}
              >{loadingImgs ? "🎨 Generating…" : "🔄 Regenerate All Images"}</button>

              <button className="vs-btn vs-btn-soft vs-btn-block mb-3" onClick={addScene}>+ Add Scene</button>

              <div className="vs-info mb-3">
                <strong>Tip:</strong> Each scene gets 3 AI image variations. Click to select, or upload your own. Use the custom prompt field for precise control.
              </div>

              <div className="row">
                <button className="vs-btn vs-btn-ghost" style={{flex:1}} onClick={()=>setStep(2)}>← Back</button>
                <button
                  className="vs-btn vs-btn-primary"
                  style={{flex:1}}
                  onClick={()=>setStep(4)}
                  disabled={scenes.length===0}
                >Preview & Export →</button>
              </div>
            </>)}

            {/* ── STEP 4 ── */}
            {step === 4 && (<>
              <span className="vs-lbl">Video Summary</span>
              <div className="vs-summary mb-3">
                {[
                  {k:"Scenes",  v:scenes.length},
                  {k:"Format",  v:format==="portrait"?"9:16 Portrait":"16:9 Landscape"},
                  {k:"Voice",   v:`${voice.emoji} ${voice.name}`},
                  {k:"Style",   v:imgStyle.label},
                ].map(it => (
                  <div key={it.k} className="vs-scard"><div className="k">{it.k}</div><div className="v">{it.v}</div></div>
                ))}
              </div>

              <div className="vs-info mb-3">
                <strong>Keep volume ON</strong> during export — TTS audio is captured live into the video file. Don't mute your device.
              </div>

              <button
                className="vs-btn vs-btn-outline vs-btn-block mb-2"
                onClick={() => setPlaying(p=>!p)}
              >{playing ? "⏹ Stop Preview" : "▶ Preview with Audio"}</button>

              {playing && (
                <div className="vs-wave mb-3">{[1,2,3,4,5].map(i=><div key={i} className="vs-wbar"/>)}</div>
              )}

              <button
                className="vs-btn vs-btn-primary vs-btn-block mb-2"
                onClick={exportVideo}
                disabled={exporting}
              >{exporting ? `⚙️ Rendering ${expProg}%…` : "🎬 Export HD Video"}</button>

              {(exporting || expProg > 0) && (
                <div className="vs-prog mb-2"><div className="vs-prog-fill" style={{width:`${expProg}%`}}/></div>
              )}

              {exporting && genStatus && (
                <div className="muted mb-2" style={{textAlign:"center"}}>{genStatus}</div>
              )}

              {exportedUrl && (<>
                <a
                  href={exportedUrl}
                  download={`studio_${format}_${Date.now()}.webm`}
                  className="vs-btn vs-btn-primary vs-btn-block mb-2"
                  style={{textDecoration:"none"}}
                >⬇️ Download Video (.webm)</a>
                <button
                  className="vs-btn vs-btn-red vs-btn-block mb-2"
                  onClick={() => { if(exportedUrl) URL.revokeObjectURL(exportedUrl); setExportedUrl(null); setExpProg(0); }}
                >🗑 Clear Export</button>
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
                <div className="vs-page-title">Video Studio</div>
                <div className="vs-page-sub">Generate professional short-form videos with AI — scripts, voiceovers & images in minutes.</div>
                <span className="vs-lbl">How It Works</span>
                <div className="vs-how">
                  {[
                    {ico:"📝",title:"Script",desc:"Gemini AI writes a vivid, visual script optimised for text-to-speech. Or write your own — each 1–2 sentences becomes one scene."},
                    {ico:"🎙️",title:"Voice",desc:"6 voice profiles with distinct pitch, rate and character. Preview on your actual script before committing."},
                    {ico:"🖼️",title:"AI Images",desc:"Gemini generates 3 highly relevant images per scene, directly from your script text. Custom prompts and uploads also supported."},
                    {ico:"🎬",title:"HD Export",desc:"12 Mbps HD video with Ken Burns effect, cinematic letterboxing, and live TTS audio baked in. No text overlays."},
                  ].map(c=>(
                    <div key={c.title} className="vs-how-card">
                      <span className="ico">{c.ico}</span>
                      <h3>{c.title}</h3><p>{c.desc}</p>
                    </div>
                  ))}
                </div>
                {genScript && (
                  <div className="vs-spin-wrap"><div className="vs-spin"/><div className="muted">Crafting your {scriptType} script…</div></div>
                )}
                {script && !genScript && (<>
                  <span className="vs-lbl">Script Preview</span>
                  <div className="vs-script-box">{script}</div>
                  <div className="vs-tags">
                    <span className="vs-tag">📝 {splitScenes(script).length} scenes</span>
                    <span className="vs-tag">⏱ ~{Math.ceil(script.split(" ").length/2.5)}s estimated</span>
                    <span className="vs-tag">📋 {script.split(" ").length} words</span>
                    <span className="vs-tag">{hasGeminiKey ? "✦ Gemini powered" : "🎨 Free tier"}</span>
                  </div>
                </>)}
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div>
                <div className="vs-page-title">Choose a Voice</div>
                <div className="vs-page-sub">Select and preview the voice that best fits your video's tone.</div>
                <div className="vs-vprofile-grid">
                  {VOICES.map(v => (
                    <div key={v.id} className={`vs-vcard ${voice.id===v.id?"sel":""}`} onClick={()=>setVoice(v)}>
                      <span className="ico">{v.emoji}</span>
                      <h3>{v.name}</h3>
                      <div className="meta">{v.desc}<br/>Pitch {v.pitch}× · Rate {v.rate}×<br/>{v.gender}</div>
                      <button
                        className="vs-btn vs-btn-sm vs-btn-soft"
                        style={{marginTop:12,width:"100%"}}
                        onClick={e=>{e.stopPropagation(); doPreviewVoice(v);}}
                      >{previewVoiceId===v.id?"🔊 Playing…":"▶ Preview"}</button>
                    </div>
                  ))}
                </div>
                <span className="vs-lbl">Your Script</span>
                <div className="vs-script-box">{script}</div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div>
                {loadingImgs && genStatus && (
                  <div className="vs-gen-banner">
                    <div className="vs-gen-dot"/>
                    <span>{genStatus}</span>
                  </div>
                )}

                <div className="vs-page-title">Scene Images</div>
                <div className="vs-page-sub">Select the best AI-generated image for each scene, or upload your own.</div>

                {scenes.length === 0 && !loadingImgs && (
                  <div style={{textAlign:"center",padding:"80px 20px",color:"var(--ink4)"}}>
                    <div style={{fontSize:48,marginBottom:14}}>🖼️</div>
                    <div className="muted">Click "Regenerate All Images" in the sidebar to generate scene images.</div>
                  </div>
                )}

                {scenes.map((sc, si) => (
                  <div key={sc.id} className="vs-scene">
                    <div className="vs-scene-hd">
                      <div className="vs-scene-num">{si+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <textarea
                          className="vs-textarea"
                          style={{minHeight:52,fontSize:12,marginBottom:8}}
                          value={sc.text}
                          onChange={e=>updateScene(si,"text",e.target.value)}
                          placeholder="Scene narration text…"
                        />
                      </div>
                      <div className="vs-scene-acts">
                        <button className="vs-btn vs-btn-ghost vs-btn-sm" onClick={()=>regenScene(si)} title="Regenerate">🔄</button>
                        <button className="vs-btn vs-btn-red vs-btn-sm" onClick={()=>delScene(si)} title="Delete scene">✕</button>
                      </div>
                    </div>

                    <div style={{marginBottom:10}}>
                      <div className="muted" style={{marginBottom:5}}>Custom image prompt (optional — leave blank to use scene text):</div>
                      <div className="vs-prompt-row">
                        <input
                          className="vs-prompt-input"
                          placeholder={`Describe exactly what you want to see…`}
                          value={sc.customPrompt || ""}
                          onChange={e=>updateScene(si,"customPrompt",e.target.value)}
                        />
                        <button className="vs-btn vs-btn-outline vs-btn-sm" style={{flexShrink:0}} onClick={()=>regenScene(si)}>
                          ✨ Gen
                        </button>
                      </div>
                    </div>

                    <div className="muted" style={{marginBottom:7}}>Click an image to select it for this scene:</div>
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
                              onError={e=>{ e.target.parentElement.style.background="var(--surface3)"; e.target.style.display="none"; }}
                            />
                            {sc.selected===ii && <div className="chk">✓</div>}
                            <div className="del-img" onClick={e=>{e.stopPropagation();delImg(si,ii);}}>✕</div>
                          </div>
                        ))
                      }
                      <label className="vs-upload-thumb">
                        <input type="file" accept="image/*" hidden onChange={e=>e.target.files[0]&&addImgFile(si,e.target.files[0])}/>
                        <span className="ico">📁</span>
                        <span>Upload</span>
                      </label>
                    </div>

                    <PasteUrl onAdd={url=>addImgUrl(si,url)}/>
                  </div>
                ))}
              </div>
            )}

            {/* ── Step 4 ── */}
            {step === 4 && (
              <div>
                <div className="vs-page-title">Preview & Export</div>
                <div className="vs-page-sub">Review your video and export in HD quality with audio narration.</div>
                <div className={`vs-preview ${format}`}>
                  {scenes.length > 0 && curScene ? (<>
                    {previewImgUrl
                      ? <img key={previewIdx} src={previewImgUrl} className="pimg" crossOrigin="anonymous"
                          onError={e=>{e.target.style.display="none";}} alt="scene preview"/>
                      : <div style={{width:"100%",height:"100%",background:"var(--ink)"}}/>
                    }
                    <div className="pcnt">{previewIdx+1} / {scenes.length}</div>
                  </>) : (
                    <div className="pempty">
                      <div className="big">🎬</div>
                      <p>Complete steps 1–3<br/>to see your preview here.</p>
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
                  <span className="vs-lbl" style={{marginTop:28,display:"block"}}>Exported Video</span>
                  <div className="vs-info">
                    ✅ HD video with TTS audio baked in. Play below to verify, then download. <strong>.webm</strong> plays in Chrome, Firefox, and VLC — convert to MP4 with Handbrake if needed.
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
    <div className="row" style={{marginTop:8}}>
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