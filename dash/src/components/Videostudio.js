import { useState, useEffect, useCallback, useRef } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap";
if (!document.head.querySelector('link[href*="Playfair"]')) document.head.appendChild(fontLink);

const IMAGE_STYLES = [
  { id: "cinematic",  label: "🎬 Cinematic",  prompt: "cinematic photography, dramatic golden hour lighting, film grain, anamorphic bokeh, professional color grade" },
  { id: "oil",        label: "🖼️ Oil Paint",  prompt: "dramatic oil painting, old master style, rich textures, chiaroscuro, fine art museum quality" },
  { id: "watercolor", label: "💧 Watercolor", prompt: "loose watercolor illustration, soft washes, artistic brush strokes, paper texture, impressionistic" },
  { id: "neon",       label: "🌃 Neon Noir",  prompt: "neon noir photography, cyberpunk city, rain reflections, moody atmosphere, purple and teal tones" },
  { id: "minimal",    label: "⬜ Minimal",    prompt: "minimalist photography, clean lines, negative space, muted elegant palette, studio lighting" },
  { id: "fantasy",    label: "🧙 Fantasy",    prompt: "epic fantasy digital art, magical volumetric light, ultra detailed environment, painterly, award winning" },
];

const VOICES = [
  { id: "v1", name: "Aria",    emoji: "👩‍🦰", desc: "Warm · Soft",          pitch: 1.15, rate: 0.85, gender: "female",  hints: ["Samantha","Zira","Victoria","Google UK English Female"] },
  { id: "v2", name: "Marcus",  emoji: "👨‍💼", desc: "Deep · Authoritative", pitch: 0.80, rate: 0.82, gender: "male",    hints: ["David","Daniel","Google UK English Male","Alex"] },
  { id: "v3", name: "Luna",    emoji: "👩‍🎤", desc: "High · Energetic",     pitch: 1.28, rate: 1.12, gender: "female",  hints: ["Samantha","Karen","Moira","Google US English"] },
  { id: "v4", name: "Orion",   emoji: "🧑‍🚀", desc: "Bass · Dramatic",      pitch: 0.68, rate: 0.77, gender: "male",    hints: ["Fred","Alex","Ralph","Google UK English Male"] },
  { id: "v5", name: "Sage",    emoji: "🧑‍🏫", desc: "Neutral · Clear",      pitch: 1.0,  rate: 1.0,  gender: "neutral", hints: ["Google US English","Samantha","Daniel"] },
  { id: "v6", name: "Nova",    emoji: "👩‍💻", desc: "Bright · Crisp",       pitch: 1.38, rate: 1.18, gender: "female",  hints: ["Zira","Heather","Fiona","Google Australian English"] },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f5f5f3;--bg2:#eeede9;--surface:#ffffff;--surface2:#f8f8f6;--surface3:#f0efeb;
  --border:#e2e1dc;--border2:#cccbc4;
  --ink:#1a1917;--ink2:#4a4945;--ink3:#8a8880;--ink4:#b5b3ac;
  --gold:#c9a84c;--red:#c0392b;--green:#2e7d52;
  --radius:12px;
  --font:'Playfair Display',Georgia,serif;
  --sans:'DM Sans',system-ui,sans-serif;
  --mono:'DM Mono','Courier New',monospace;
  --shadow:0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);
  --shadow2:0 2px 8px rgba(0,0,0,0.08),0 12px 40px rgba(0,0,0,0.08);
}
.vs{font-family:var(--sans);background:var(--bg);color:var(--ink);min-height:100vh}

/* Bar */
.vs-bar{
  height:56px;background:var(--surface);border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;position:sticky;top:0;z-index:200;gap:16px;
}
.vs-brand{font-family:var(--font);font-size:18px;font-weight:700;letter-spacing:-0.5px;color:var(--ink);display:flex;align-items:center;gap:10px;flex-shrink:0}
.vs-brand-mark{width:28px;height:28px;background:var(--ink);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;color:white;font-weight:800;font-family:var(--sans)}
.vs-steps{display:flex;gap:2px;align-items:center;background:var(--surface3);border-radius:50px;padding:4px;border:1px solid var(--border)}
.vs-step-btn{font-family:var(--sans);font-size:12px;font-weight:500;padding:6px 16px;border-radius:50px;border:none;background:transparent;color:var(--ink3);cursor:pointer;transition:all .2s;white-space:nowrap}
.vs-step-btn:hover{color:var(--ink2)}
.vs-step-btn.active{background:var(--surface);color:var(--ink);font-weight:600;box-shadow:var(--shadow)}
.vs-step-btn.done{color:var(--ink2)}

/* Layout */
.vs-layout{display:grid;grid-template-columns:300px 1fr;min-height:calc(100vh - 56px)}
@media(max-width:768px){
  .vs-layout{grid-template-columns:1fr}
  .vs-sidebar{max-height:none;border-right:none;border-bottom:1px solid var(--border)}
  .vs-bar{padding:0 16px}
  .vs-brand span{display:none}
}

/* Sidebar */
.vs-sidebar{background:var(--surface);border-right:1px solid var(--border);padding:20px 18px;overflow-y:auto;max-height:calc(100vh - 56px);scrollbar-width:thin;scrollbar-color:var(--border) transparent}
.vs-main{padding:28px 32px;overflow-y:auto;max-height:calc(100vh - 56px);background:var(--bg)}
@media(max-width:768px){.vs-main{padding:20px 16px}}

/* Label */
.vs-lbl{font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:10px;display:block}
.vs-hr{height:1px;background:var(--border);margin:16px 0}

/* Inputs */
.vs-input,.vs-textarea{width:100%;font-family:var(--sans);font-size:13px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;color:var(--ink);outline:none;transition:all .2s;line-height:1.5}
.vs-input:focus,.vs-textarea:focus{border-color:var(--ink);background:var(--surface);box-shadow:0 0 0 3px rgba(26,25,23,0.06)}
.vs-textarea{resize:vertical;min-height:80px;font-family:var(--mono);font-size:12px;line-height:1.8}

/* Buttons */
.vs-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:var(--sans);font-size:13px;font-weight:600;padding:10px 18px;border-radius:var(--radius);border:1px solid transparent;cursor:pointer;transition:all .18s;white-space:nowrap}
.vs-btn:disabled{opacity:.4;cursor:not-allowed!important}
.vs-btn-primary{background:var(--ink);color:white;border-color:var(--ink)}
.vs-btn-primary:not(:disabled):hover{background:#3d3b35}
.vs-btn-outline{background:transparent;color:var(--ink);border-color:var(--border2)}
.vs-btn-outline:not(:disabled):hover{border-color:var(--ink);background:var(--surface3)}
.vs-btn-soft{background:var(--surface2);color:var(--ink2);border-color:var(--border)}
.vs-btn-soft:not(:disabled):hover{border-color:var(--border2);background:var(--surface3)}
.vs-btn-ghost{background:transparent;color:var(--ink3);border-color:transparent}
.vs-btn-ghost:not(:disabled):hover{color:var(--ink2);background:var(--surface3)}
.vs-btn-red{background:transparent;color:var(--red);border-color:rgba(192,57,43,.25)}
.vs-btn-red:not(:disabled):hover{background:var(--red);color:white}
.vs-btn-block{width:100%}
.vs-btn-sm{padding:5px 11px;font-size:11px;border-radius:8px}

/* Voices */
.vs-voices{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px}
.vs-voice{padding:11px 8px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);cursor:pointer;transition:all .18s;text-align:center}
.vs-voice:hover{border-color:var(--border2);background:var(--surface3)}
.vs-voice.sel{border-color:var(--ink);background:var(--ink)}
.vs-voice .vem{font-size:20px;display:block;margin-bottom:4px}
.vs-voice .vnm{font-size:11px;font-weight:700;color:var(--ink2)}
.vs-voice.sel .vnm{color:white}
.vs-voice .vd{font-size:9px;color:var(--ink4);font-family:var(--mono);margin-top:2px}
.vs-voice.sel .vd{color:rgba(255,255,255,.5)}

/* Image style chips */
.vs-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.vs-chip{padding:5px 13px;border-radius:50px;font-size:11px;font-weight:600;font-family:var(--sans);border:1px solid var(--border);color:var(--ink3);background:var(--surface2);cursor:pointer;transition:all .18s}
.vs-chip:hover{border-color:var(--border2);color:var(--ink2)}
.vs-chip.sel{background:var(--ink);color:white;border-color:var(--ink)}

/* Format */
.vs-fmts{display:flex;gap:8px;margin-bottom:16px}
.vs-fmt{flex:1;padding:11px 8px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--ink3);cursor:pointer;font-size:11px;font-weight:700;font-family:var(--sans);text-align:center;transition:all .18s}
.vs-fmt:hover{border-color:var(--border2);color:var(--ink2)}
.vs-fmt.sel{border-color:var(--ink);color:var(--ink);background:var(--surface);box-shadow:var(--shadow)}
.vs-fmt small{display:block;font-size:9px;opacity:.5;font-family:var(--mono);margin-top:3px;font-weight:400}

/* Summary cards */
.vs-summary{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:16px}
.vs-scard{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px}
.vs-scard .k{font-size:9px;color:var(--ink4);font-family:var(--mono);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px}
.vs-scard .v{font-size:14px;font-weight:700;color:var(--ink);font-family:var(--font)}

/* Progress */
.vs-prog{height:3px;background:var(--surface3);border-radius:2px;overflow:hidden;margin-top:10px}
.vs-prog-fill{height:100%;background:var(--ink);border-radius:2px;transition:width .4s ease}

/* Waveform */
.vs-wave{display:flex;align-items:center;gap:3px;height:28px;justify-content:center;margin:8px 0}
.vs-wbar{width:3px;background:var(--ink);border-radius:2px;animation:wav .8s ease-in-out infinite}
.vs-wbar:nth-child(2){animation-delay:.1s}.vs-wbar:nth-child(3){animation-delay:.2s}
.vs-wbar:nth-child(4){animation-delay:.3s}.vs-wbar:nth-child(5){animation-delay:.4s}
@keyframes wav{0%,100%{height:4px}50%{height:22px}}

/* SCENE — no card, just direct layout */
.vs-scene-wrap{margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid var(--border)}
.vs-scene-wrap:last-child{border-bottom:none}
.vs-scene-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px}
.vs-scene-num{width:34px;height:34px;border-radius:10px;background:var(--ink);color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;font-family:var(--sans)}
.vs-scene-acts{display:flex;gap:5px;flex-shrink:0;margin-left:auto}

/* Image grid */
.vs-img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:12px}
@media(max-width:480px){.vs-img-grid{grid-template-columns:repeat(2,1fr)}}
.vs-img-thumb{position:relative;aspect-ratio:16/9;border-radius:10px;overflow:hidden;border:2px solid var(--border);cursor:pointer;transition:all .18s;background:var(--surface3)}
.vs-img-thumb:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:var(--shadow)}
.vs-img-thumb.sel{border-color:var(--ink);box-shadow:0 0 0 2px rgba(26,25,23,.2),var(--shadow)}
.vs-img-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .4s}
.vs-img-thumb .chk{position:absolute;top:6px;right:6px;width:20px;height:20px;background:var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;color:white;font-weight:800}
.vs-img-thumb .del-img{position:absolute;bottom:5px;right:5px;background:rgba(255,255,255,.92);border-radius:5px;padding:2px 7px;font-size:9px;color:var(--ink);cursor:pointer;line-height:1.5;transition:all .15s;border:1px solid var(--border)}
.vs-img-thumb .del-img:hover{background:var(--red);color:white;border-color:var(--red)}

/* Upload tile */
.vs-upload-tile{aspect-ratio:16/9;border-radius:10px;border:2px dashed var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all .18s;font-size:10px;color:var(--ink4);gap:5px;font-family:var(--mono);background:var(--surface2)}
.vs-upload-tile:hover{border-color:var(--ink);color:var(--ink);background:var(--surface3)}
.vs-upload-tile .ico{font-size:20px}

/* Prompt row */
.vs-prompt-row{display:flex;gap:7px;margin-top:8px}
.vs-prompt-input{flex:1;font-family:var(--mono);font-size:11px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--ink);outline:none;transition:all .18s}
.vs-prompt-input:focus{border-color:var(--ink);background:var(--surface)}
.vs-prompt-input::placeholder{color:var(--ink4)}

/* Preview */
.vs-preview{background:var(--ink);border-radius:16px;overflow:hidden;position:relative;border:1px solid var(--border2);box-shadow:var(--shadow2)}
.vs-preview.landscape{aspect-ratio:16/9}
.vs-preview.portrait{aspect-ratio:9/16;max-width:280px;margin:0 auto}
.vs-preview .pimg{width:100%;height:100%;object-fit:cover;display:block}
.vs-preview .pcnt{position:absolute;top:12px;right:14px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.6);background:rgba(0,0,0,.45);padding:4px 10px;border-radius:50px;backdrop-filter:blur(6px)}
.vs-preview .pempty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 40px;color:rgba(255,255,255,.25);text-align:center;gap:14px}
.vs-preview .pempty .big{font-size:48px}
.vs-preview .pempty p{font-size:13px;font-family:var(--mono);line-height:1.7}

/* Dots */
.vs-dots{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:14px}
.vs-dot{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:var(--mono);cursor:pointer;color:var(--ink3);transition:all .18s;background:var(--surface)}
.vs-dot:hover:not(.a){border-color:var(--border2);color:var(--ink2)}
.vs-dot.a{background:var(--ink);border-color:var(--ink);color:white}

/* Page titles */
.vs-page-title{font-family:var(--font);font-size:32px;font-weight:900;letter-spacing:-1.5px;color:var(--ink);margin-bottom:6px}
.vs-page-sub{font-family:var(--sans);font-size:14px;color:var(--ink3);margin-bottom:32px;line-height:1.6}
@media(max-width:768px){.vs-page-title{font-size:24px}.vs-page-sub{margin-bottom:24px}}

/* Section heading */
.vs-section{font-family:var(--font);font-size:20px;font-weight:700;color:var(--ink);margin:32px 0 16px;letter-spacing:-0.5px}

/* Step intro */
.vs-intro{margin-bottom:32px}
.vs-intro-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-top:16px}
.vs-intro-item{}
.vs-intro-item .ico{font-size:28px;display:block;margin-bottom:10px}
.vs-intro-item h3{font-size:15px;font-weight:700;margin-bottom:6px;font-family:var(--font)}
.vs-intro-item p{font-size:12px;color:var(--ink3);line-height:1.7;font-family:var(--sans)}

/* Hint text */
.vs-hint{font-size:11px;color:var(--ink3);font-family:var(--mono);line-height:1.6;margin-bottom:12px}

/* Toast */
.vs-toast{position:fixed;bottom:22px;right:22px;z-index:9999;background:var(--surface);color:var(--ink);border:1px solid var(--border);border-radius:12px;padding:13px 20px;font-size:13px;font-weight:600;animation:tin .22s ease;max-width:320px;font-family:var(--sans);box-shadow:var(--shadow2)}
.vs-toast.err{border-color:rgba(192,57,43,.4);color:var(--red)}
.vs-toast.ok{border-color:rgba(46,125,82,.3);color:var(--green)}
@keyframes tin{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}

/* Voice profile big */
.vs-vprofile-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:28px}
.vs-vcard{padding:18px 16px;border-radius:14px;border:1px solid var(--border);background:transparent;cursor:pointer;transition:all .18s}
.vs-vcard:hover{border-color:var(--border2);background:var(--surface)}
.vs-vcard.sel{border-color:var(--ink);background:var(--surface);box-shadow:0 0 0 2px rgba(26,25,23,.08),var(--shadow)}
.vs-vcard .ico{font-size:26px;margin-bottom:10px;display:block}
.vs-vcard h3{font-size:15px;font-weight:700;margin-bottom:5px;font-family:var(--font)}
.vs-vcard .meta{font-size:10px;color:var(--ink3);font-family:var(--mono);line-height:1.8}

/* Export video */
.vs-export-vid{width:100%;border-radius:12px;border:1px solid var(--border);background:#000;margin-top:16px;box-shadow:var(--shadow)}

/* Tags */
.vs-tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}
.vs-tag{font-family:var(--mono);font-size:10px;padding:4px 12px;border-radius:50px;background:var(--surface);border:1px solid var(--border);color:var(--ink3)}

/* Script display */
.vs-script-display{font-family:var(--mono);font-size:13px;line-height:2;color:var(--ink2);white-space:pre-wrap;padding:0;margin-bottom:16px}

/* Add scene button area */
.vs-add-scene{display:flex;align-items:center;gap:12px;margin-top:20px;padding-top:20px;border-top:2px dashed var(--border)}

/* Gen status */
.vs-gen-banner{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 16px;margin-bottom:20px;font-family:var(--mono);font-size:12px;color:var(--ink2);box-shadow:var(--shadow)}
.vs-gen-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);animation:blink 1s ease-in-out infinite alternate;flex-shrink:0;box-shadow:0 0 8px var(--gold)}
@keyframes blink{from{opacity:.3}to{opacity:1}}

.row{display:flex;gap:8px}
.mb-2{margin-bottom:8px}
.mb-3{margin-bottom:14px}
.muted{font-size:11px;color:var(--ink3);font-family:var(--mono)}
`;

/* ── Helpers ── */
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

const fetchImageAsBlob = async (src, timeoutMs = 20000) => {
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    const imgEl = await new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      const t = setTimeout(() => resolve(null), 8000);
      img.onload = () => { clearTimeout(t); resolve(img); };
      img.onerror = () => { clearTimeout(t); resolve(null); };
      img.src = src;
    });
    return imgEl ? { imgEl, blobUrl: null } : null;
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const resp = await fetch(src, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    const blobUrl = URL.createObjectURL(blob);
    const imgEl = await new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      const t = setTimeout(() => resolve(null), 8000);
      img.onload = () => { clearTimeout(t); resolve(img); };
      img.onerror = () => { clearTimeout(t); resolve(null); };
      img.src = blobUrl;
    });
    return imgEl ? { imgEl, blobUrl } : null;
  } catch {
    return null;
  }
};

/* ════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════ */
export default function VideoStudio() {
  const [step, setStep] = useState(1);

  // Step 1 — Script
  const [script, setScript] = useState("");

  // Step 2 — Voice
  const [voice, setVoice] = useState(VOICES[0]);
  const [previewVoiceId, setPreviewVoiceId] = useState(null);
  const [format, setFormat] = useState("landscape");

  // Step 3 — Images
  const [imgStyle, setImgStyle] = useState(IMAGE_STYLES[0]);
  const [scenes, setScenes] = useState([]);

  // Step 4 — Export
  const [previewIdx, setPreviewIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expProg, setExpProg] = useState(0);
  const [exportedUrl, setExportedUrl] = useState(null);
  const [genStatus, setGenStatus] = useState("");

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);

  // Parse script into scenes when moving to step 3
  const buildScenesFromScript = () => {
    const sentences = (script.match(/[^.!?\n]+[.!?\n]+/g) || [script]).filter(s => s.trim().length > 5);
    const chunks = [];
    for (let i = 0; i < sentences.length; i += 2) {
      chunks.push(sentences.slice(i, i + 2).join(" ").trim());
    }
    const newScenes = chunks.filter(c => c.length > 3).map((text, i) => ({
      id: i + "_" + Date.now(),
      text,
      images: [],
      selected: 0,
    }));
    setScenes(newScenes.length > 0 ? newScenes : [{ id: "0_" + Date.now(), text: script.trim(), images: [], selected: 0 }]);
  };

  const addImgFile = (si, file) => {
    const objectUrl = URL.createObjectURL(file);
    setScenes(prev => {
      const u = [...prev];
      u[si] = { ...u[si], images: [...u[si].images, { url: objectUrl, name: file.name }] };
      return u;
    });
  };

  const addImgUrl = (si, url) => {
    if (!url.trim()) return;
    setScenes(prev => {
      const u = [...prev];
      u[si] = { ...u[si], images: [...u[si].images, { url: url.trim(), name: "URL" }] };
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
    setScenes(prev => [...prev, { id: Date.now(), text: "", images: [], selected: 0 }]);
  };

  const updateScene = (si, field, val) => {
    setScenes(prev => { const u = [...prev]; u[si] = { ...u[si], [field]: val }; return u; });
  };

  /* Preview voice */
  const doPreviewVoice = (v) => {
    setPreviewVoiceId(v.id);
    speakText(
      script ? script.slice(0, 130) : `Hi! I am ${v.name}. This is how I sound when narrating your video content.`,
      v,
      () => setPreviewVoiceId(null)
    );
  };

  /* Audio preview playback */
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

  /* ══════════════════════════
     HD VIDEO EXPORT
  ══════════════════════════ */
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

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioDest = audioCtx.createMediaStreamDestination();
    const silentOsc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    silentOsc.connect(gainNode);
    gainNode.connect(audioDest);
    silentOsc.start();

    const videoStream = canvas.captureStream(30);
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioDest.stream.getAudioTracks(),
    ]);

    const mimeType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
      .find(m => MediaRecorder.isTypeSupported(m)) || "video/webm";

    const chunks = [];
    const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 14_000_000 });
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

    setGenStatus("Loading images…");
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

    setGenStatus("Recording HD video with voice…");

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

    const drawScene = (imgEl, W, H, ctx, prog, sceneNum, total) => {
      ctx.clearRect(0, 0, W, H);
      if (imgEl) {
        const zoomAmount = 0.07;
        const scale = 1 + prog * zoomAmount;
        const panX = (prog - 0.5) * 0.025 * W;
        const panY = (prog - 0.5) * 0.018 * H;
        const sw = W * scale, sh = H * scale;
        ctx.drawImage(imgEl, (W - sw) / 2 + panX, (H - sh) / 2 + panY, sw, sh);
      } else {
        const grd = ctx.createLinearGradient(0, 0, W, H);
        grd.addColorStop(0, "#1a1917");
        grd.addColorStop(1, "#2d2b26");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // Cinematic bars
      const barH = H * 0.052;
      ctx.fillStyle = "rgba(0,0,0,0.88)";
      ctx.fillRect(0, 0, W, barH);
      ctx.fillRect(0, H - barH, W, barH);

      // Bottom gradient
      const grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, H * 0.55, W, H * 0.45);

      // Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.18, W / 2, H / 2, H * 0.82);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.38)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Scene counter
      ctx.font = `${W * 0.011}px 'DM Mono', monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(`${sceneNum}/${total}`, W * 0.025, barH * 0.68);

      // Crossfade
      const fadeIn = Math.min(prog * 6, 1);
      const fadeOut = Math.min((1 - prog) * 6, 1);
      const alpha = 1 - Math.min(fadeIn, fadeOut);
      if (alpha > 0.01) {
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    for (let i = 0; i < scenes.length; i++) {
      setExpProg(15 + Math.round((i / scenes.length) * 78));
      const sc = scenes[i];
      const imgEl = imgEls[i];
      const speakPromise = speakScene(sc.text, voice);
      let spokenMs = 0;
      let done = false;
      const startTime = Date.now();
      speakPromise.then(ms => { spokenMs = ms; done = true; });

      await new Promise(resolve => {
        const MIN_SCENE_MS = 2500;
        const draw = () => {
          const elapsed = Date.now() - startTime;
          const targetMs = Math.max(spokenMs || 5000, MIN_SCENE_MS);
          const prog = Math.min(elapsed / targetMs, 1);
          drawScene(imgEl, W, H, ctx, prog, i + 1, scenes.length);
          if (!done || elapsed < MIN_SCENE_MS) requestAnimationFrame(draw);
          else setTimeout(resolve, 350);
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

    await new Promise(r => setTimeout(r, 500));
    recorder.stop();
    setExpProg(100);
    blobUrls.forEach(u => URL.revokeObjectURL(u));
  };

  const STEPS = ["Script", "Voice", "Images", "Export"];
  const curScene = scenes[previewIdx];
  const previewImgUrl = curScene?.images?.[curScene.selected]?.url;
  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <style>{css}</style>
      <div className="vs">

        {/* Top bar */}
        <header className="vs-bar">
          <div className="vs-brand">
            <div className="vs-brand-mark">VS</div>
            <span>Video Studio</span>
          </div>
          <div className="vs-steps">
            {STEPS.map((s, i) => (
              <button
                key={s}
                className={`vs-step-btn ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}
                onClick={() => step > i + 1 && setStep(i + 1)}
              >
                {step > i + 1 ? "✓ " : ""}{s}
              </button>
            ))}
          </div>
        </header>

        <div className="vs-layout">

          {/* ══ SIDEBAR ══ */}
          <aside className="vs-sidebar">

            {/* Step 1 sidebar */}
            {step === 1 && (<>
              <span className="vs-lbl">Your Script</span>
              <div className="vs-hint mb-2">Write your narration below. Each 1–2 sentences will become one video scene. Use vivid, visual language.</div>
              <textarea
                className="vs-textarea mb-3"
                placeholder="Write your full video narration here.&#10;&#10;Example: The sun rose over the city as the streets came alive. People rushed through morning light, carrying dreams and coffee cups. By afternoon, the plaza hummed with energy..."
                value={script}
                onChange={e => setScript(e.target.value)}
                rows={14}
              />
              {wordCount > 0 && (
                <div className="vs-tags mb-3">
                  <span className="vs-tag">📝 ~{Math.ceil(wordCount / 2.5)}s narration</span>
                  <span className="vs-tag">{wordCount} words</span>
                </div>
              )}
              <button
                className="vs-btn vs-btn-primary vs-btn-block"
                onClick={() => setStep(2)}
                disabled={script.trim().length < 20}
              >Continue → Choose Voice</button>
            </>)}

            {/* Step 2 sidebar */}
            {step === 2 && (<>
              <span className="vs-lbl">Voice</span>
              <div className="vs-voices mb-3">
                {VOICES.map(v => (
                  <div key={v.id} className={`vs-voice ${voice.id === v.id ? "sel" : ""}`} onClick={() => setVoice(v)}>
                    <span className="vem">{v.emoji}</span>
                    <div className="vnm">{v.name}</div>
                    <div className="vd">{v.desc}</div>
                  </div>
                ))}
              </div>
              <button className="vs-btn vs-btn-outline vs-btn-block mb-3" onClick={() => doPreviewVoice(voice)}>
                {previewVoiceId === voice.id ? "🔊 Playing…" : "▶ Preview Voice"}
              </button>
              <div className="vs-hr" />
              <span className="vs-lbl">Format</span>
              <div className="vs-fmts mb-3">
                <div className={`vs-fmt ${format === "landscape" ? "sel" : ""}`} onClick={() => setFormat("landscape")}>
                  📺 Landscape<small>16:9 · YouTube</small>
                </div>
                <div className={`vs-fmt ${format === "portrait" ? "sel" : ""}`} onClick={() => setFormat("portrait")}>
                  📱 Portrait<small>9:16 · Reels</small>
                </div>
              </div>
              <div className="row">
                <button className="vs-btn vs-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="vs-btn vs-btn-primary" style={{ flex: 1 }} onClick={() => { buildScenesFromScript(); setStep(3); }}>
                  Add Images →
                </button>
              </div>
            </>)}

            {/* Step 3 sidebar */}
            {step === 3 && (<>
              <span className="vs-lbl">Visual Style</span>
              <div className="vs-hint mb-2">Choose a cinematic style for your video look.</div>
              <div className="vs-chips mb-3">
                {IMAGE_STYLES.map(s => (
                  <div key={s.id} className={`vs-chip ${imgStyle.id === s.id ? "sel" : ""}`} onClick={() => setImgStyle(s)}>
                    {s.label}
                  </div>
                ))}
              </div>
              <div className="vs-hr" />
              <div className="vs-hint mb-3">
                <strong style={{ color: "var(--ink2)" }}>Instructions:</strong><br />
                Each scene below needs at least one image. Upload a photo or paste an image URL for each scene.
              </div>
              <button className="vs-btn vs-btn-soft vs-btn-block mb-3" onClick={addScene}>+ Add Scene</button>
              <div className="row">
                <button className="vs-btn vs-btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                <button
                  className="vs-btn vs-btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => setStep(4)}
                  disabled={scenes.length === 0}
                >Preview →</button>
              </div>
            </>)}

            {/* Step 4 sidebar */}
            {step === 4 && (<>
              <span className="vs-lbl">Summary</span>
              <div className="vs-summary mb-3">
                {[
                  { k: "Scenes", v: scenes.length },
                  { k: "Format", v: format === "portrait" ? "9:16 Portrait" : "16:9 Landscape" },
                  { k: "Voice", v: `${voice.emoji} ${voice.name}` },
                  { k: "Style", v: imgStyle.label },
                ].map(it => (
                  <div key={it.k} className="vs-scard"><div className="k">{it.k}</div><div className="v">{it.v}</div></div>
                ))}
              </div>

              <div className="vs-hint mb-3" style={{ background: "var(--surface2)", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
                🔊 Keep device volume ON during export — voice audio is captured live into the video file.
              </div>

              <button className="vs-btn vs-btn-outline vs-btn-block mb-2" onClick={() => setPlaying(p => !p)}>
                {playing ? "⏹ Stop Preview" : "▶ Preview with Audio"}
              </button>
              {playing && <div className="vs-wave mb-3">{[1, 2, 3, 4, 5].map(i => <div key={i} className="vs-wbar" />)}</div>}

              <button className="vs-btn vs-btn-primary vs-btn-block mb-2" onClick={exportVideo} disabled={exporting}>
                {exporting ? `⚙️ Rendering ${expProg}%…` : "🎬 Export HD Video"}
              </button>
              {(exporting || expProg > 0) && <div className="vs-prog mb-2"><div className="vs-prog-fill" style={{ width: `${expProg}%` }} /></div>}
              {exporting && genStatus && <div className="muted mb-2" style={{ textAlign: "center" }}>{genStatus}</div>}

              {exportedUrl && (<>
                <a href={exportedUrl} download={`video_${format}_${Date.now()}.webm`} className="vs-btn vs-btn-primary vs-btn-block mb-2" style={{ textDecoration: "none" }}>
                  ⬇️ Download Video (.webm)
                </a>
                <button className="vs-btn vs-btn-red vs-btn-block mb-2" onClick={() => { URL.revokeObjectURL(exportedUrl); setExportedUrl(null); setExpProg(0); }}>
                  🗑 Clear Export
                </button>
              </>)}

              <div className="vs-hr" />
              <button className="vs-btn vs-btn-ghost vs-btn-block" onClick={() => setStep(3)}>← Back to Images</button>
            </>)}
          </aside>

          {/* ══ MAIN ══ */}
          <main className="vs-main">

            {/* Step 1 — Script intro */}
            {step === 1 && (
              <div>
                <div className="vs-page-title">Write Your Script</div>
                <div className="vs-page-sub">Your narration drives the entire video — write it clearly and visually, then add images in step 3.</div>

                <div className="vs-intro-grid mb-3" style={{ marginBottom: 36 }}>
                  {[
                    { ico: "📝", title: "Write narration", desc: "Type your full script in the sidebar. Each 1–2 sentences automatically becomes one scene with its own image." },
                    { ico: "🎙️", title: "Choose a voice", desc: "Pick from 6 professional voice profiles — warm, authoritative, energetic, bass, neutral, or crisp." },
                    { ico: "🖼️", title: "Add images", desc: "Upload your photos or paste image URLs for each scene. Supports JPG, PNG, WebP." },
                    { ico: "🎬", title: "Export HD video", desc: "One click renders a 14 Mbps HD video with Ken Burns motion, cinematic bars, and live voice narration baked in." },
                  ].map(c => (
                    <div key={c.title} className="vs-intro-item">
                      <span className="ico">{c.ico}</span>
                      <h3>{c.title}</h3>
                      <p>{c.desc}</p>
                    </div>
                  ))}
                </div>

                {script.trim().length > 0 && (<>
                  <div className="vs-section" style={{ marginTop: 0 }}>Script Preview</div>
                  <div className="vs-script-display">{script}</div>
                  <div className="vs-tags">
                    <span className="vs-tag">📝 ~{Math.ceil(wordCount / 2.5)}s estimated</span>
                    <span className="vs-tag">{wordCount} words</span>
                  </div>
                </>)}
              </div>
            )}

            {/* Step 2 — Voice */}
            {step === 2 && (
              <div>
                <div className="vs-page-title">Choose a Voice</div>
                <div className="vs-page-sub">Six distinct voices for every mood and style. Preview each one on your actual script.</div>
                <div className="vs-vprofile-grid">
                  {VOICES.map(v => (
                    <div key={v.id} className={`vs-vcard ${voice.id === v.id ? "sel" : ""}`} onClick={() => setVoice(v)}>
                      <span className="ico">{v.emoji}</span>
                      <h3>{v.name}</h3>
                      <div className="meta">{v.desc}<br />Pitch {v.pitch}× · Rate {v.rate}×<br />{v.gender}</div>
                      <button className="vs-btn vs-btn-sm vs-btn-soft" style={{ marginTop: 12, width: "100%" }}
                        onClick={e => { e.stopPropagation(); doPreviewVoice(v); }}>
                        {previewVoiceId === v.id ? "🔊 Playing…" : "▶ Preview"}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="vs-section">Your Script</div>
                <div className="vs-script-display">{script}</div>
              </div>
            )}

            {/* Step 3 — Images */}
            {step === 3 && (
              <div>
                <div className="vs-page-title">Add Scene Images</div>
                <div className="vs-page-sub">Upload a photo or paste a URL for each scene below. Each scene will display its image during that narration.</div>

                {scenes.map((sc, si) => (
                  <div key={sc.id} className="vs-scene-wrap">
                    <div className="vs-scene-header">
                      <div className="vs-scene-num">{si + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <textarea
                          className="vs-textarea"
                          style={{ minHeight: 52, fontSize: 12, marginBottom: 0 }}
                          value={sc.text}
                          onChange={e => updateScene(si, "text", e.target.value)}
                          placeholder="Scene narration text…"
                        />
                      </div>
                      <div className="vs-scene-acts">
                        <button className="vs-btn vs-btn-red vs-btn-sm" onClick={() => delScene(si)}>✕</button>
                      </div>
                    </div>

                    <div className="muted mb-2" style={{ marginTop: 4 }}>
                      {sc.images.length === 0
                        ? "⚠️ No image yet — upload or paste a URL below"
                        : `${sc.images.length} image${sc.images.length > 1 ? "s" : ""} · click to select which appears in video`}
                    </div>

                    <div className="vs-img-grid">
                      {sc.images.map((img, ii) => (
                        <div
                          key={ii}
                          className={`vs-img-thumb ${sc.selected === ii ? "sel" : ""}`}
                          onClick={() => updateScene(si, "selected", ii)}
                        >
                          <img
                            src={img.url}
                            alt={`scene${si + 1}_img${ii + 1}`}
                            crossOrigin="anonymous"
                            style={{ opacity: 0 }}
                            onLoad={e => { e.target.style.opacity = 1; }}
                            onError={e => { e.target.parentElement.style.background = "var(--surface3)"; e.target.style.display = "none"; }}
                          />
                          {sc.selected === ii && <div className="chk">✓</div>}
                          <div className="del-img" onClick={e => { e.stopPropagation(); delImg(si, ii); }}>✕</div>
                        </div>
                      ))}
                      <label className="vs-upload-tile">
                        <input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && addImgFile(si, e.target.files[0])} />
                        <span className="ico">📁</span>
                        <span>Upload photo</span>
                      </label>
                    </div>

                    <PasteUrl onAdd={url => addImgUrl(si, url)} />
                  </div>
                ))}

                <div className="vs-add-scene">
                  <button className="vs-btn vs-btn-outline" onClick={addScene}>+ Add Another Scene</button>
                  <span className="muted">{scenes.length} scene{scenes.length !== 1 ? "s" : ""} total</span>
                </div>
              </div>
            )}

            {/* Step 4 — Export */}
            {step === 4 && (
              <div>
                <div className="vs-page-title">Preview & Export</div>
                <div className="vs-page-sub">Review your video scene by scene, then export as a cinematic HD video with voice narration.</div>

                <div className={`vs-preview ${format}`}>
                  {scenes.length > 0 && curScene ? (<>
                    {previewImgUrl
                      ? <img key={previewIdx} src={previewImgUrl} className="pimg" crossOrigin="anonymous"
                        onError={e => { e.target.style.display = "none"; }} alt="scene preview" />
                      : <div style={{ width: "100%", height: "100%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--mono)", fontSize: 12 }}>no image</span>
                      </div>
                    }
                    <div className="pcnt">{previewIdx + 1} / {scenes.length}</div>
                  </>) : (
                    <div className="pempty">
                      <div className="big">🎬</div>
                      <p>Complete steps 1–3<br />to preview your video here.</p>
                    </div>
                  )}
                </div>

                {scenes.length > 0 && (
                  <div className="vs-dots">
                    {scenes.map((_, i) => (
                      <div key={i} className={`vs-dot ${previewIdx === i ? "a" : ""}`} onClick={() => setPreviewIdx(i)}>{i + 1}</div>
                    ))}
                  </div>
                )}

                {scenes.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <div className="vs-section" style={{ marginTop: 0, marginBottom: 12 }}>Scene Overview</div>
                    {scenes.map((sc, i) => (
                      <div key={sc.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, cursor: "pointer" }} onClick={() => setPreviewIdx(i)}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: previewIdx === i ? "var(--ink)" : "var(--surface3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: previewIdx === i ? "white" : "var(--ink3)", flexShrink: 0, fontFamily: "var(--sans)" }}>{i + 1}</div>
                        {sc.images[sc.selected]?.url && (
                          <div style={{ width: 56, height: 36, borderRadius: 7, overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0, background: "var(--surface3)" }}>
                            <img src={sc.images[sc.selected].url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" crossOrigin="anonymous" />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink2)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sc.text || "(empty scene)"}</div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)", marginTop: 2 }}>{sc.images.length} image{sc.images.length !== 1 ? "s" : ""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {exportedUrl && (<>
                  <div className="vs-section">Exported Video</div>
                  <div className="muted mb-2">.webm plays in Chrome, Firefox & VLC. Use Handbrake to convert to MP4 if needed.</div>
                  <video src={exportedUrl} controls className="vs-export-vid" />
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

/* Paste URL sub-component */
function PasteUrl({ onAdd }) {
  const [val, setVal] = useState("");
  return (
    <div className="vs-prompt-row" style={{ marginTop: 8 }}>
      <input
        className="vs-prompt-input"
        placeholder="Or paste an image URL and press Enter…"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && val.trim()) { onAdd(val.trim()); setVal(""); } }}
      />
      <button className="vs-btn vs-btn-soft vs-btn-sm" style={{ flexShrink: 0 }} onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(""); } }}>
        Add URL
      </button>
    </div>
  );
}