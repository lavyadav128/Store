
import { useState, useEffect, useRef, useCallback } from "react";
import server from "../environment";
// ── Google Fonts ──
if (typeof document !== "undefined") {
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap";
  if (!document.head.querySelector('link[href*="Playfair"]')) document.head.appendChild(fontLink);
}

const IMAGE_STYLES = [
  { id: "cinematic",  label: "🎬 Cinematic",  prompt: "cinematic photography, dramatic golden hour lighting, film grain, anamorphic bokeh" },
  { id: "oil",        label: "🖼️ Oil Paint",  prompt: "dramatic oil painting, old master style, rich textures, chiaroscuro" },
  { id: "watercolor", label: "💧 Watercolor", prompt: "loose watercolor illustration, soft washes, artistic brush strokes, paper texture" },
  { id: "neon",       label: "🌃 Neon Noir",  prompt: "neon noir photography, cyberpunk city, rain reflections, moody atmosphere" },
  { id: "minimal",    label: "⬜ Minimal",    prompt: "minimalist photography, clean lines, negative space, muted elegant palette" },
  { id: "fantasy",    label: "🧙 Fantasy",    prompt: "epic fantasy digital art, magical volumetric light, ultra detailed environment" },
];

const EL_VOICES = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah",   emoji: "👩‍🦰", desc: "Warm · Conversational", tags: ["narration","story"] },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam",    emoji: "👨‍💼", desc: "Deep · Authoritative",  tags: ["narration","news"] },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte",emoji: "👩‍🎤", desc: "Bright · Expressive",   tags: ["story","reels"] },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian",   emoji: "🧑‍🏫", desc: "Neutral · Clear",        tags: ["explainer"] },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel",  emoji: "🎙️",  desc: "British · Polished",    tags: ["narration","formal"] },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily",    emoji: "🌸",  desc: "Soft · Gentle",          tags: ["story","calm"] },
];

const SONG_LIBRARY = [
  { id: "cinematic1",   title: "Epic Cinematic",     artist: "Free Music",  emoji: "🎬", genre: "cinematic",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  duration: "3:22" },
  { id: "lofi1",        title: "Lo-Fi Chill",         artist: "ChillBeats",  emoji: "☕", genre: "lo-fi",        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",  duration: "2:58" },
  { id: "upbeat1",      title: "Upbeat Vlog",         artist: "VibeWorks",   emoji: "✨", genre: "upbeat",       url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",  duration: "2:45" },
  { id: "emotional1",   title: "Emotional Journey",   artist: "Soulbeats",   emoji: "💙", genre: "emotional",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",  duration: "3:10" },
  { id: "hiphop1",      title: "Hip Hop Beat",        artist: "BeatMaker",   emoji: "🎤", genre: "hip-hop",      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",  duration: "2:35" },
  { id: "acoustic1",    title: "Acoustic Guitar",     artist: "StringWorks", emoji: "🎸", genre: "acoustic",     url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",  duration: "3:00" },
  { id: "electronic1",  title: "Electronic Pop",      artist: "SynthWave",   emoji: "🎹", genre: "electronic",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",  duration: "2:50" },
  { id: "relaxing1",    title: "Relaxing Ambient",    artist: "AmbientFlow", emoji: "🌊", genre: "ambient",      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",  duration: "4:10" },
];

const SONG_GENRES = ["all", "cinematic", "lo-fi", "upbeat", "emotional", "hip-hop", "acoustic", "electronic", "ambient"];

// ─────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f5f5f3;--bg2:#eeede9;--surface:#ffffff;--surface2:#f8f8f6;--surface3:#f0efeb;
  --border:#e2e1dc;--border2:#cccbc4;
  --ink:#1a1917;--ink2:#4a4945;--ink3:#8a8880;--ink4:#b5b3ac;
  --gold:#c9a84c;--red:#c0392b;--green:#2e7d52;--blue:#2563eb;--purple:#7c3aed;
  --radius:12px;
  --font:'Playfair Display',Georgia,serif;
  --sans:'DM Sans',system-ui,sans-serif;
  --mono:'DM Mono','Courier New',monospace;
  --shadow:0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06);
  --shadow2:0 2px 8px rgba(0,0,0,0.08),0 12px 40px rgba(0,0,0,0.08);
}
.vs{font-family:var(--sans);background:var(--bg);color:var(--ink);min-height:100vh}
.vs-bar{height:56px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 16px;position:sticky;top:0;z-index:200;gap:10px}
.vs-brand{font-family:var(--font);font-size:18px;font-weight:700;letter-spacing:-0.5px;color:var(--ink);display:flex;align-items:center;gap:10px;flex-shrink:0}
.vs-brand-mark{width:28px;height:28px;background:var(--ink);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;color:white;font-weight:800;font-family:var(--sans);flex-shrink:0}
.vs-steps{display:flex;gap:2px;align-items:center;background:var(--surface3);border-radius:50px;padding:3px;border:1px solid var(--border);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:calc(100vw - 120px)}
.vs-steps::-webkit-scrollbar{display:none}
.vs-step-btn{font-family:var(--sans);font-size:11px;font-weight:500;padding:5px 11px;border-radius:50px;border:none;background:transparent;color:var(--ink3);cursor:pointer;transition:all .2s;white-space:nowrap;-webkit-tap-highlight-color:transparent}
.vs-step-btn:hover{color:var(--ink2)}
.vs-step-btn.active{background:var(--surface);color:var(--ink);font-weight:600;box-shadow:var(--shadow)}
.vs-step-btn.done{color:var(--ink2)}

/* DESKTOP layout */
.vs-layout{display:grid;grid-template-columns:300px 1fr;min-height:calc(100vh - 56px)}

/* MOBILE layout — sidebar becomes bottom sheet / stacked panel */
@media(max-width:768px){
  .vs-layout{grid-template-columns:1fr;grid-template-rows:auto 1fr;min-height:calc(100vh - 56px)}
  .vs-sidebar{
    max-height:none;
    border-right:none;
    border-bottom:1px solid var(--border);
    padding:16px 14px;
    /* Allow natural height on mobile */
    overflow-y:visible;
  }
  .vs-main{
    padding:16px 14px;
    max-height:none;
    overflow-y:visible;
  }
  .vs-bar{padding:0 12px}
  .vs-brand span{display:none}
}

.vs-sidebar{background:var(--surface);border-right:1px solid var(--border);padding:20px 18px;overflow-y:auto;max-height:calc(100vh - 56px);scrollbar-width:thin;scrollbar-color:var(--border) transparent}
.vs-main{padding:28px 32px;overflow-y:auto;max-height:calc(100vh - 56px);background:var(--bg)}

.vs-lbl{font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:10px;display:block}
.vs-hr{height:1px;background:var(--border);margin:16px 0}
.vs-input,.vs-textarea{width:100%;font-family:var(--sans);font-size:13px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px;color:var(--ink);outline:none;transition:all .2s;line-height:1.5;-webkit-appearance:none}
.vs-input:focus,.vs-textarea:focus{border-color:var(--ink);background:var(--surface);box-shadow:0 0 0 3px rgba(26,25,23,0.06)}
.vs-textarea{resize:vertical;min-height:80px;font-family:var(--mono);font-size:12px;line-height:1.8}
.vs-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:var(--sans);font-size:13px;font-weight:600;padding:10px 18px;border-radius:var(--radius);border:1px solid transparent;cursor:pointer;transition:all .18s;white-space:nowrap;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
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
.vs-btn-blue{background:var(--blue);color:white;border-color:var(--blue)}
.vs-btn-blue:not(:disabled):hover{background:#1d4ed8}
.vs-btn-green{background:var(--green);color:white;border-color:var(--green)}
.vs-btn-green:not(:disabled):hover{background:#1f5c3a}
.vs-btn-purple{background:var(--purple);color:white;border-color:var(--purple)}
.vs-btn-purple:not(:disabled):hover{background:#6d28d9}
.vs-btn-block{width:100%}
.vs-btn-sm{padding:5px 11px;font-size:11px;border-radius:8px}

/* Touch-friendly tap targets on mobile */
@media(max-width:768px){
  .vs-btn{min-height:44px;padding:10px 16px}
  .vs-btn-sm{min-height:36px;padding:6px 12px}
}

/* MODE TOGGLE */
.vs-mode-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.vs-mode-card{padding:16px 12px;border-radius:14px;border:2px solid var(--border);background:var(--surface2);cursor:pointer;transition:all .2s;text-align:center;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-mode-card:hover{border-color:var(--border2);background:var(--surface)}
.vs-mode-card.sel{border-color:var(--ink);background:var(--surface);box-shadow:var(--shadow)}
.vs-mode-card .mic{font-size:28px;display:block;margin-bottom:8px}
.vs-mode-card h3{font-size:13px;font-weight:700;margin-bottom:4px;font-family:var(--font)}
.vs-mode-card p{font-size:10px;color:var(--ink3);font-family:var(--mono);line-height:1.6}
.vs-mode-card.sel h3{color:var(--ink)}

/* API KEY BOX */
.vs-apikey-box{background:linear-gradient(135deg,#fafaf8,#f3f2ee);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:16px}
.vs-apikey-box .title{font-family:var(--mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.vs-apikey-box .title .dot{width:6px;height:6px;border-radius:50%;background:var(--green)}
.vs-apikey-box .title .dot.off{background:var(--red)}
.vs-apikey-input-wrap{display:flex;gap:6px}
.vs-apikey-input-wrap input{flex:1;font-family:var(--mono);font-size:11px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--ink);outline:none;transition:all .18s}
.vs-apikey-input-wrap input:focus{border-color:var(--ink)}

/* VOICES */
.vs-voices{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px}
.vs-voice{padding:12px 10px;border-radius:12px;border:1px solid var(--border);background:var(--surface2);cursor:pointer;transition:all .18s;text-align:center;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-voice:hover{border-color:var(--border2);background:var(--surface3)}
.vs-voice.sel{border-color:var(--ink);background:var(--ink)}
.vs-voice .vem{font-size:22px;display:block;margin-bottom:5px}
.vs-voice .vnm{font-size:12px;font-weight:700;color:var(--ink2)}
.vs-voice.sel .vnm{color:white}
.vs-voice .vd{font-size:9px;color:var(--ink4);font-family:var(--mono);margin-top:2px}
.vs-voice.sel .vd{color:rgba(255,255,255,.5)}

/* SONG LIBRARY */
.vs-song-genres{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px}
.vs-genre-chip{padding:4px 11px;border-radius:50px;font-size:10px;font-weight:600;font-family:var(--mono);border:1px solid var(--border);color:var(--ink3);background:var(--surface2);cursor:pointer;transition:all .18s;text-transform:capitalize;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-genre-chip:hover{border-color:var(--border2);color:var(--ink2)}
.vs-genre-chip.sel{background:var(--ink);color:white;border-color:var(--ink)}
.vs-song-list{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;max-height:220px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent;-webkit-overflow-scrolling:touch}
.vs-song-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);cursor:pointer;transition:all .18s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-song-item:hover{border-color:var(--border2);background:var(--surface)}
.vs-song-item.sel{border-color:var(--ink);background:var(--surface);box-shadow:var(--shadow)}
.vs-song-item .sico{font-size:18px;flex-shrink:0}
.vs-song-item .smeta{flex:1;min-width:0}
.vs-song-item .stitle{font-size:12px;font-weight:700;color:var(--ink);font-family:var(--sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vs-song-item .sartist{font-size:10px;color:var(--ink3);font-family:var(--mono)}
.vs-song-item .sdur{font-size:10px;color:var(--ink4);font-family:var(--mono);flex-shrink:0}
.vs-song-item .play-mini{background:var(--surface3);border:1px solid var(--border);border-radius:6px;padding:4px 8px;font-size:10px;cursor:pointer;transition:all .15s;flex-shrink:0;min-height:32px;display:flex;align-items:center}
.vs-song-item .play-mini:hover{background:var(--ink);color:white;border-color:var(--ink)}
.vs-song-item.sel .play-mini{background:var(--ink);color:white;border-color:var(--ink)}

/* UPLOAD MUSIC */
.vs-music-upload{border:2px dashed var(--border);border-radius:12px;padding:16px;text-align:center;cursor:pointer;transition:all .18s;margin-bottom:12px;font-family:var(--mono);font-size:11px;color:var(--ink3);display:block;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-music-upload:hover{border-color:var(--ink);color:var(--ink);background:var(--surface3)}
.vs-music-upload .ico{font-size:24px;margin-bottom:6px;display:block}
.vs-selected-song{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid var(--green);background:#f0fdf4;margin-bottom:12px;font-family:var(--mono);font-size:11px;color:#166534}
.vs-volume-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;font-family:var(--mono);font-size:11px;color:var(--ink3)}
.vs-volume-row input[type=range]{flex:1;accent-color:var(--ink);height:20px}

/* OTHER */
.vs-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.vs-chip{padding:5px 13px;border-radius:50px;font-size:11px;font-weight:600;font-family:var(--sans);border:1px solid var(--border);color:var(--ink3);background:var(--surface2);cursor:pointer;transition:all .18s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-chip:hover{border-color:var(--border2);color:var(--ink2)}
.vs-chip.sel{background:var(--ink);color:white;border-color:var(--ink)}
.vs-fmts{display:flex;gap:8px;margin-bottom:16px}
.vs-fmt{flex:1;padding:11px 8px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--ink3);cursor:pointer;font-size:11px;font-weight:700;font-family:var(--sans);text-align:center;transition:all .18s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-fmt:hover{border-color:var(--border2);color:var(--ink2)}
.vs-fmt.sel{border-color:var(--ink);color:var(--ink);background:var(--surface);box-shadow:var(--shadow)}
.vs-fmt small{display:block;font-size:9px;opacity:.5;font-family:var(--mono);margin-top:3px;font-weight:400}
.vs-summary{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:16px}
.vs-scard{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px}
.vs-scard .k{font-size:9px;color:var(--ink4);font-family:var(--mono);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px}
.vs-scard .v{font-size:14px;font-weight:700;color:var(--ink);font-family:var(--font)}
.vs-prog{height:3px;background:var(--surface3);border-radius:2px;overflow:hidden;margin-top:10px}
.vs-prog-fill{height:100%;background:var(--ink);border-radius:2px;transition:width .4s ease}
.vs-wave{display:flex;align-items:center;gap:3px;height:28px;justify-content:center;margin:8px 0}
.vs-wbar{width:3px;background:var(--ink);border-radius:2px;animation:wav .8s ease-in-out infinite}
.vs-wbar:nth-child(2){animation-delay:.1s}.vs-wbar:nth-child(3){animation-delay:.2s}
.vs-wbar:nth-child(4){animation-delay:.3s}.vs-wbar:nth-child(5){animation-delay:.4s}
@keyframes wav{0%,100%{height:4px}50%{height:22px}}
.vs-scene-wrap{margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid var(--border)}
.vs-scene-wrap:last-child{border-bottom:none}
.vs-scene-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px}
.vs-scene-num{width:34px;height:34px;border-radius:10px;background:var(--ink);color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;font-family:var(--sans)}
.vs-scene-acts{display:flex;gap:5px;flex-shrink:0;margin-left:auto}
.vs-img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:12px}
@media(max-width:480px){.vs-img-grid{grid-template-columns:repeat(2,1fr)}}
.vs-img-thumb{position:relative;aspect-ratio:16/9;border-radius:10px;overflow:hidden;border:2px solid var(--border);cursor:pointer;transition:all .18s;background:var(--surface3);-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-img-thumb:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:var(--shadow)}
.vs-img-thumb.sel{border-color:var(--ink);box-shadow:0 0 0 2px rgba(26,25,23,.2),var(--shadow)}
.vs-img-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .4s}
.vs-img-thumb .chk{position:absolute;top:6px;right:6px;width:20px;height:20px;background:var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;color:white;font-weight:800}
.vs-img-thumb .del-img{position:absolute;bottom:5px;right:5px;background:rgba(255,255,255,.92);border-radius:5px;padding:2px 7px;font-size:9px;color:var(--ink);cursor:pointer;line-height:1.5;transition:all .15s;border:1px solid var(--border)}
.vs-img-thumb .del-img:hover{background:var(--red);color:white;border-color:var(--red)}
.vs-img-thumb .auto-badge{position:absolute;top:6px;left:6px;background:var(--gold);border-radius:4px;padding:2px 6px;font-size:8px;font-weight:700;color:#000;font-family:var(--mono)}
.vs-upload-tile{aspect-ratio:16/9;border-radius:10px;border:2px dashed var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all .18s;font-size:10px;color:var(--ink4);gap:5px;font-family:var(--mono);background:var(--surface2);-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-upload-tile:hover{border-color:var(--ink);color:var(--ink);background:var(--surface3)}
.vs-upload-tile .ico{font-size:20px}
.vs-prompt-row{display:flex;gap:7px;margin-top:8px}
.vs-prompt-input{flex:1;font-family:var(--mono);font-size:11px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--ink);outline:none;transition:all .18s;-webkit-appearance:none;min-height:40px}
.vs-prompt-input:focus{border-color:var(--ink);background:var(--surface)}
.vs-prompt-input::placeholder{color:var(--ink4)}
.vs-preview{background:var(--ink);border-radius:16px;overflow:hidden;position:relative;border:1px solid var(--border2);box-shadow:var(--shadow2)}
.vs-preview.landscape{aspect-ratio:16/9}
.vs-preview.portrait{aspect-ratio:9/16;max-width:280px;margin:0 auto}
.vs-preview .pimg{width:100%;height:100%;object-fit:cover;display:block}
.vs-preview .pcnt{position:absolute;top:12px;right:14px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.6);background:rgba(0,0,0,.45);padding:4px 10px;border-radius:50px;backdrop-filter:blur(6px)}
.vs-preview .pempty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 40px;color:rgba(255,255,255,.25);text-align:center;gap:14px}
.vs-preview .pempty .big{font-size:48px}
.vs-preview .pempty p{font-size:13px;font-family:var(--mono);line-height:1.7}
.vs-dots{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:14px}
.vs-dot{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:var(--mono);cursor:pointer;color:var(--ink3);transition:all .18s;background:var(--surface);-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-dot:hover:not(.a){border-color:var(--border2);color:var(--ink2)}
.vs-dot.a{background:var(--ink);border-color:var(--ink);color:white}
.vs-page-title{font-family:var(--font);font-size:32px;font-weight:900;letter-spacing:-1.5px;color:var(--ink);margin-bottom:6px}
.vs-page-sub{font-family:var(--sans);font-size:14px;color:var(--ink3);margin-bottom:32px;line-height:1.6}
@media(max-width:768px){.vs-page-title{font-size:22px}.vs-page-sub{margin-bottom:18px;font-size:13px}}
.vs-section{font-family:var(--font);font-size:20px;font-weight:700;color:var(--ink);margin:32px 0 16px;letter-spacing:-0.5px}
.vs-intro-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;margin-top:16px}
.vs-intro-item .ico{font-size:28px;display:block;margin-bottom:10px}
.vs-intro-item h3{font-size:15px;font-weight:700;margin-bottom:6px;font-family:var(--font)}
.vs-intro-item p{font-size:12px;color:var(--ink3);line-height:1.7;font-family:var(--sans)}
.vs-hint{font-size:11px;color:var(--ink3);font-family:var(--mono);line-height:1.6;margin-bottom:12px}
.vs-toast{position:fixed;bottom:22px;right:16px;left:16px;z-index:9999;background:var(--surface);color:var(--ink);border:1px solid var(--border);border-radius:12px;padding:13px 20px;font-size:13px;font-weight:600;animation:tin .22s ease;font-family:var(--sans);box-shadow:var(--shadow2);text-align:center}
@media(min-width:480px){.vs-toast{left:auto;max-width:320px}}
.vs-toast.err{border-color:rgba(192,57,43,.4);color:var(--red)}
.vs-toast.ok{border-color:rgba(46,125,82,.3);color:var(--green)}
@keyframes tin{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
.vs-vprofile-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:28px}
.vs-vcard{padding:18px 16px;border-radius:14px;border:1px solid var(--border);background:transparent;cursor:pointer;transition:all .18s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.vs-vcard:hover{border-color:var(--border2);background:var(--surface)}
.vs-vcard.sel{border-color:var(--ink);background:var(--surface);box-shadow:0 0 0 2px rgba(26,25,23,.08),var(--shadow)}
.vs-vcard .ico{font-size:26px;margin-bottom:10px;display:block}
.vs-vcard h3{font-size:15px;font-weight:700;margin-bottom:5px;font-family:var(--font)}
.vs-vcard .meta{font-size:10px;color:var(--ink3);font-family:var(--mono);line-height:1.8}
.vs-export-vid{width:100%;border-radius:12px;border:1px solid var(--border);background:#000;margin-top:16px;box-shadow:var(--shadow)}
.vs-tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}
.vs-tag{font-family:var(--mono);font-size:10px;padding:4px 12px;border-radius:50px;background:var(--surface);border:1px solid var(--border);color:var(--ink3)}
.vs-script-display{font-family:var(--mono);font-size:13px;line-height:2;color:var(--ink2);white-space:pre-wrap;padding:0;margin-bottom:16px}
.vs-add-scene{display:flex;align-items:center;gap:12px;margin-top:20px;padding-top:20px;border-top:2px dashed var(--border)}
.vs-gen-banner{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 16px;margin-bottom:20px;font-family:var(--mono);font-size:12px;color:var(--ink2);box-shadow:var(--shadow)}
.vs-gen-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);animation:blink 1s ease-in-out infinite alternate;flex-shrink:0;box-shadow:0 0 8px var(--gold)}
@keyframes blink{from{opacity:.3}to{opacity:1}}
.vs-match-banner{background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #f59e0b;border-radius:10px;padding:12px 14px;margin-bottom:16px;font-family:var(--mono);font-size:11px;color:#92400e;display:flex;align-items:center;gap:10px}
.vs-export-actions{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.vs-cloudinary-box{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-top:8px}
.vs-cloudinary-box .title{font-family:var(--mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:10px;display:block}
.vs-saving-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:500;display:flex;align-items:center;justify-content:center}
.vs-saving-modal{background:var(--surface);border-radius:16px;padding:32px 40px;text-align:center;font-family:var(--sans);box-shadow:var(--shadow2);max-width:300px}
.vs-saving-modal .spin{font-size:36px;animation:spin 1s linear infinite;display:block;margin-bottom:14px}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.rec-live{display:flex;align-items:center;gap:8px;background:#fff0f0;border:1px solid #fca5a5;border-radius:10px;padding:11px 14px;margin-bottom:10px;font-family:var(--mono);font-size:11px;color:#991b1b}
.rec-dot{width:9px;height:9px;border-radius:50%;background:#ef4444;animation:blink 0.7s ease-in-out infinite alternate;flex-shrink:0}
.row{display:flex;gap:8px}
.mb-2{margin-bottom:8px}
.mb-3{margin-bottom:14px}
.muted{font-size:11px;color:var(--ink3);font-family:var(--mono)}
.el-status{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-family:var(--mono);font-size:10px;margin-bottom:12px}
.el-status.ok{background:#f0fdf4;border:1px solid #86efac;color:#166534}
.el-status.err{background:#fff0f0;border:1px solid #fca5a5;color:#991b1b}
.el-status.idle{background:var(--surface2);border:1px solid var(--border);color:var(--ink3)}
.el-generating{display:flex;align-items:center;gap:8px;padding:10px 14px;background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #c4b5fd;border-radius:10px;font-family:var(--mono);font-size:11px;color:#5b21b6;margin-bottom:12px}

/* Mobile-specific recording warning */
.vs-mobile-warn{display:none}
@media(max-width:768px){
  .vs-mobile-warn{display:flex;align-items:flex-start;gap:10px;background:#fffbeb;border:1px solid #f59e0b;border-radius:10px;padding:12px 14px;margin-bottom:14px;font-family:var(--mono);font-size:10px;color:#92400e;line-height:1.6}
}
`;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const loadImageEl = (src, timeoutMs = 20000) => new Promise(resolve => {
  if (!src) return resolve(null);
  const img = new Image();
  img.crossOrigin = "anonymous";
  const t = setTimeout(() => { img.src = ""; resolve(null); }, timeoutMs);
  const done = (result) => { clearTimeout(t); resolve(result); };
  img.onload = () => done(img);
  img.onerror = () => done(null);
  if (src.startsWith("blob:") || src.startsWith("data:")) {
    img.src = src;
  } else {
    fetch(src).then(r => r.blob()).then(blob => { img.src = URL.createObjectURL(blob); }).catch(() => { img.src = src; });
  }
});

const tokenize = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 3);
const similarity = (a, b) => {
  const sa = new Set(tokenize(a)), sb = new Set(tokenize(b));
  if (!sa.size || !sb.size) return 0;
  let common = 0; sa.forEach(w => { if (sb.has(w)) common++; });
  return common / Math.max(sa.size, sb.size);
};

const autoMatchImages = async (scenes, allImages) => {
  if (!allImages.length || !scenes.length) return scenes;
  const imageDescriptions = allImages.map((img, idx) => ({
    idx, name: (img.name || `image_${idx}`).replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").replace(/\d+/g, " ").trim()
  }));
  try {
    const prompt = `You are a video editor AI. Match each scene text to the most visually suitable image.
Scenes: ${scenes.map((s, i) => `Scene ${i}: "${s.text}"`).join("\n")}
Available images: ${imageDescriptions.map(img => `Image ${img.idx}: "${img.name}"`).join("\n")}
Rules: Every scene MUST get exactly one image. Multiple scenes can share images.
Return ONLY a JSON array: [{"sceneIndex":0,"imageIndex":2},...]`;
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 600, messages: [{ role: "user", content: prompt }] })
    });
    const data = await resp.json();
    const raw = data.content?.[0]?.text || "[]";
    const matches = JSON.parse((raw.match(/\[[\s\S]*\]/) || ["[]"])[0]);
    if (!matches.length) throw new Error("empty");
    return scenes.map((scene, si) => {
      const match = matches.find(m => m.sceneIndex === si);
      if (!match) return scene;
      const targetImg = allImages[match.imageIndex];
      if (!targetImg) return scene;
      let imgIdx = scene.images.findIndex(img => img.url === targetImg.url);
      if (imgIdx === -1) return { ...scene, images: [...scene.images, targetImg], selected: scene.images.length, autoMatched: true };
      return { ...scene, selected: imgIdx, autoMatched: true };
    });
  } catch {
    return scenes.map(scene => {
      let bestIdx = 0, bestScore = -1;
      imageDescriptions.forEach(img => { const s = similarity(scene.text, img.name); if (s > bestScore) { bestScore = s; bestIdx = img.idx; } });
      const targetImg = allImages[bestIdx];
      if (!targetImg) return scene;
      let imgIdx = scene.images.findIndex(img => img.url === targetImg.url);
      if (imgIdx === -1) return { ...scene, images: [...scene.images, targetImg], selected: scene.images.length, autoMatched: true };
      return { ...scene, selected: imgIdx, autoMatched: true };
    });
  }
};

// ─────────────────────────────────────────────────────────────
// ELEVENLABS TTS — returns ArrayBuffer
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// ELEVENLABS TTS — returns ArrayBuffer (XHR for mobile compat)
// ─────────────────────────────────────────────────────────────
const elevenLabsTTS = (text, voiceId) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${server}/api/video-studio/tts`);
  xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = "arraybuffer";
  xhr.timeout = 60000;
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      resolve(xhr.response);
    } else {
      reject(new Error(`TTS error ${xhr.status}`));
    }
  };
  xhr.onerror = () => reject(new Error("Network error on TTS request"));
  xhr.ontimeout = () => reject(new Error("TTS request timed out"));
  xhr.send(JSON.stringify({ text, voiceId }));
});

// ─────────────────────────────────────────────────────────────
// CLOUDINARY SAVE — uses XMLHttpRequest for mobile compatibility
// (fetch + FormData + Authorization header is blocked on some
//  iOS/Android browsers; XHR avoids that restriction)
// ─────────────────────────────────────────────────────────────
const saveToCloudinaryXHR = (blob, token) => new Promise((resolve, reject) => {
  const formData = new FormData();
  formData.append("video", blob, `video_${Date.now()}.webm`);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${server}/api/video-studio/save-to-cloudinary`);
  xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try { resolve(JSON.parse(xhr.responseText)); }
      catch { reject(new Error("Invalid JSON response")); }
    } else {
      try {
        const err = JSON.parse(xhr.responseText);
        reject(new Error(err.message || `Server error ${xhr.status}`));
      } catch {
        reject(new Error(`Server error ${xhr.status}`));
      }
    }
  };
  xhr.onerror = () => reject(new Error("Network error — check your connection"));
  xhr.ontimeout = () => reject(new Error("Upload timed out"));
  xhr.timeout = 120000; // 2 min timeout for large video files
  xhr.send(formData);
});

// ─────────────────────────────────────────────────────────────
// DRAW FRAME
// ─────────────────────────────────────────────────────────────
const drawFrame = (ctx, imgEl, progress, sceneNum, total, W, H) => {
  ctx.fillStyle = "#1a1917";
  ctx.fillRect(0, 0, W, H);
  if (imgEl) {
    const scale = 1 + progress * 0.06;
    const panX = (progress - 0.5) * 0.02 * W;
    const panY = (progress - 0.5) * 0.015 * H;
    const sw = W * scale, sh = H * scale;
    ctx.drawImage(imgEl, (W - sw) / 2 + panX, (H - sh) / 2 + panY, sw, sh);
  } else {
    const grd = ctx.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, "#1a1917"); grd.addColorStop(1, "#2d2b26");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
  }
  const barH = H * 0.052;
  ctx.fillStyle = "rgba(0,0,0,0.88)"; ctx.fillRect(0, 0, W, barH); ctx.fillRect(0, H - barH, W, barH);
  const grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
  grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.65)");
  ctx.fillStyle = grad; ctx.fillRect(0, H * 0.55, W, H * 0.45);
  const vig = ctx.createRadialGradient(W/2, H/2, H*0.18, W/2, H/2, H*0.82);
  vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.36)");
  ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
  ctx.font = `${Math.round(W*0.011)}px 'DM Mono', monospace`;
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillText(`${sceneNum}/${total}`, W*0.025, barH*0.68);
  const FADE_FRAC = 0.12;
  let fadeAlpha = 0;
  if (progress < FADE_FRAC) fadeAlpha = 1 - (progress / FADE_FRAC);
  else if (progress > 1 - FADE_FRAC) fadeAlpha = (progress - (1 - FADE_FRAC)) / FADE_FRAC;
  if (fadeAlpha > 0.01) { ctx.fillStyle = `rgba(0,0,0,${Math.min(fadeAlpha,1)})`; ctx.fillRect(0,0,W,H); }
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function VideoStudio() {
  const [step, setStep]                   = useState(1);
  const [videoMode, setVideoMode]         = useState("story");
  const [script, setScript]               = useState("");
  const [elVoice, setElVoice]             = useState(EL_VOICES[0]);
  const [elStatus, setElStatus]           = useState("idle");
  const [elStatusMsg, setElStatusMsg]     = useState("");
  const [format, setFormat]               = useState("landscape");
  const [imgStyle, setImgStyle]           = useState(IMAGE_STYLES[0]);
  const [scenes, setScenes]               = useState([]);
  const [previewIdx, setPreviewIdx]       = useState(0);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewAudio, setPreviewAudio]   = useState(null);

  const [selectedSong, setSelectedSong]   = useState(null);
  const [customSongFile, setCustomSongFile] = useState(null);
  const [customSongUrl, setCustomSongUrl] = useState(null);
  const [songVolume, setSongVolume]       = useState(0.7);
  const [songGenreFilter, setSongGenreFilter] = useState("all");
  const [songPreviewAudio, setSongPreviewAudio] = useState(null);
  const [playingSongId, setPlayingSongId] = useState(null);

  const [recording, setRecording]         = useState(false);
  const [recProg, setRecProg]             = useState(0);
  const [recStatus, setRecStatus]         = useState("");
  const [exportedUrl, setExportedUrl]     = useState(null);
  const [exportedBlob, setExportedBlob]   = useState(null);

  const [matching, setMatching]           = useState(false);
  const [lastMatchedCount, setLastMatchedCount] = useState(0);
  const [savingToCloud, setSavingToCloud] = useState(false);
  const [cloudUrl, setCloudUrl]           = useState(null);
  const [toast, setToast]                 = useState(null);

  const stopRecordingRef = useRef(null);

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 5000); };

  // ── Resume AudioContext on user gesture (required on mobile) ──
  const ensureAudioContext = async (audioCtx) => {
    if (audioCtx.state === "suspended") {
      try { await audioCtx.resume(); } catch (e) { /* ignore */ }
    }
  };

  const testElKey = () => {
    setElStatus("idle"); setElStatusMsg("Testing…");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${server}/api/video-studio/tts`);
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "arraybuffer";
    xhr.timeout = 30000;
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setElStatus("ok"); setElStatusMsg("✓ Connected to ElevenLabs");
        showToast("✅ ElevenLabs connected!");
      } else {
        setElStatus("err"); setElStatusMsg(`✗ HTTP ${xhr.status}`);
        showToast(`ElevenLabs error: HTTP ${xhr.status}`, "err");
      }
    };
    xhr.onerror = () => { setElStatus("err"); setElStatusMsg("✗ Network error"); showToast("Network error — check connection", "err"); };
    xhr.ontimeout = () => { setElStatus("err"); setElStatusMsg("✗ Timeout"); showToast("Connection timed out", "err"); };
    xhr.send(JSON.stringify({ text: "Connection test.", voiceId: EL_VOICES[0].id }));
  };

  const previewElVoice = async (v) => {
    if (previewAudio) { previewAudio.pause(); }
    showToast(`🔊 Loading ${v.name}…`);
    try {
      const sampleText = script ? script.slice(0, 100) : `Hi, I'm ${v.name}. This is how I sound when narrating your video.`;
      const ab = await elevenLabsTTS(sampleText, v.id);

      // ── MOBILE FIX: decode and play via AudioContext instead of
      //    Audio element, which can silently fail on iOS for ArrayBuffers ──
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      await ensureAudioContext(ctx);
      const decoded = await ctx.decodeAudioData(ab.slice(0)); // slice to copy
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      source.start();
      source.onended = () => ctx.close();
      setElStatus("ok"); setElStatusMsg("✓ Voice preview playing");
    } catch (err) {
      setElStatus("err"); setElStatusMsg(`✗ ${err.message}`);
      showToast(`Voice preview failed: ${err.message}`, "err");
    }
  };

  const previewSong = (song) => {
    if (songPreviewAudio) { songPreviewAudio.pause(); setPlayingSongId(null); }
    if (playingSongId === song.id) { setSongPreviewAudio(null); setPlayingSongId(null); return; }
    const audio = new Audio(song.url);
    audio.volume = 0.4;
    // ── MOBILE FIX: must call play() in direct response to user tap ──
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => showToast("Could not play preview — tap again", "err"));
    }
    audio.onended = () => setPlayingSongId(null);
    setSongPreviewAudio(audio);
    setPlayingSongId(song.id);
  };

  const handleCustomSongUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (customSongUrl) URL.revokeObjectURL(customSongUrl);
    const url = URL.createObjectURL(f);
    setCustomSongFile(f);
    setCustomSongUrl(url);
    setSelectedSong({ id: "custom", title: f.name.replace(/\.[^.]+$/, ""), artist: "Uploaded", emoji: "🎵", url, custom: true });
    showToast(`🎵 Song loaded: ${f.name}`);
  };

  const buildScenesFromScript = () => {
    const sentences = (script.match(/[^.!?\n]+[.!?\n]+/g) || [script]).filter(s => s.trim().length > 5);
    const chunks = [];
    for (let i = 0; i < sentences.length; i += 2) chunks.push(sentences.slice(i, i + 2).join(" ").trim());
    const newScenes = chunks.filter(c => c.length > 3).map((text, i) => ({
      id: `${i}_${Date.now()}`, text, images: [], selected: 0, autoMatched: false,
    }));
    setScenes(newScenes.length > 0 ? newScenes : [{ id: `0_${Date.now()}`, text: script.trim(), images: [], selected: 0, autoMatched: false }]);
    setLastMatchedCount(0);
  };

  const addImgFiles = (si, files) => {
    const newImgs = Array.from(files).map(f => ({ url: URL.createObjectURL(f), name: f.name }));
    setScenes(prev => { const u = [...prev]; u[si] = { ...u[si], images: [...u[si].images, ...newImgs] }; return u; });
  };
  const addImgUrl = (si, url) => {
    if (!url.trim()) return;
    setScenes(prev => { const u = [...prev]; u[si] = { ...u[si], images: [...u[si].images, { url: url.trim(), name: url.split("/").pop() || "URL" }] }; return u; });
  };
  const delImg = (si, ii) => {
    setScenes(prev => { const u = [...prev]; const imgs = u[si].images.filter((_, idx) => idx !== ii); u[si] = { ...u[si], images: imgs, selected: Math.min(u[si].selected, Math.max(0, imgs.length - 1)) }; return u; });
  };
  const delScene = (si) => { setScenes(prev => prev.filter((_, i) => i !== si)); if (previewIdx >= si && previewIdx > 0) setPreviewIdx(p => p - 1); };
  const addScene  = () => setScenes(prev => [...prev, { id: Date.now(), text: "", images: [], selected: 0, autoMatched: false }]);
  const updateScene = (si, field, val) => setScenes(prev => { const u = [...prev]; u[si] = { ...u[si], [field]: val }; return u; });

  const handleAutoMatch = async () => {
    const seen = new Set(), allImages = [];
    scenes.forEach(sc => sc.images.forEach(img => { if (!seen.has(img.url)) { seen.add(img.url); allImages.push(img); } }));
    if (!allImages.length) { showToast("Upload at least one image to any scene first!", "err"); return; }
    setMatching(true); showToast("🤖 AI is matching images to scenes…");
    try {
      const updated = await autoMatchImages(scenes, allImages);
      setScenes(updated);
      const matched = updated.filter(s => s.autoMatched).length;
      setLastMatchedCount(matched);
      showToast(`✅ Auto-matched ${matched} of ${scenes.length} scenes!`);
    } catch (e) { showToast(`Auto-match error: ${e.message}`, "err"); }
    setMatching(false);
  };

  // ══════════════════════════════════════════════════════════════
  // RECORD VIDEO
  //
  // MOBILE FIXES applied here:
  //  1. AudioContext.resume() called immediately after creation
  //     (mobile browsers suspend context until user gesture;
  //      we're inside a button click so resume() works)
  //  2. canvas.captureStream() guarded with existence check
  //  3. Reduced resolution on mobile to avoid OOM crashes
  //  4. ElevenLabs ArrayBuffer copied before decodeAudioData
  //     (some mobile WebKit versions consume the buffer)
  // ══════════════════════════════════════════════════════════════
  const recordVideo = async () => {
    if (!scenes.length) return;

    if (videoMode === "music" && !selectedSong) {
      showToast("Choose a song or upload your own for music mode!", "err"); return;
    }

    // ── MOBILE FIX: check captureStream support upfront ──
    const testCanvas = document.createElement("canvas");
    if (typeof testCanvas.captureStream !== "function") {
      showToast("❌ Video recording not supported on this browser. Try Chrome on Android or desktop.", "err");
      return;
    }

    setRecording(true); setRecProg(0); setRecStatus("Preparing…");
    setExportedUrl(null); setExportedBlob(null); setCloudUrl(null);

    const isPortrait = format === "portrait";
    // ── MOBILE FIX: lower resolution on mobile to prevent OOM ──
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const W = isPortrait ? (isMobile ? 540 : 720) : (isMobile ? 960 : 1280);
    const H = isPortrait ? (isMobile ? 960 : 1280) : (isMobile ? 540 : 720);
    const FPS = isMobile ? 24 : 30;
    const MS = Math.round(1000 / FPS);

    setRecStatus("🖼️ Loading images…");
    const imgEls = [];
    for (let i = 0; i < scenes.length; i++) {
      const sc = scenes[i], imgEntry = sc.images[sc.selected] ?? sc.images[0];
      imgEls.push(imgEntry?.url ? await loadImageEl(imgEntry.url, 18000) : null);
    }

    // ── MOBILE FIX: create AudioContext inside button click handler
    //    (this call IS inside the click — recordVideo is triggered by onClick)
    //    Then immediately resume() to unlock it on mobile ──
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtxClass({ sampleRate: 44100 });
    await ensureAudioContext(audioCtx); // unlock immediately

    const audioDest = audioCtx.createMediaStreamDestination();
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.0;
    masterGain.connect(audioDest);

    // Keep-alive oscillator (prevents iOS from suspending context mid-recording)
    const keepAlive = audioCtx.createOscillator();
    const keepGain  = audioCtx.createGain();
    keepGain.gain.value = 0.00001;
    keepAlive.connect(keepGain); keepGain.connect(audioDest); keepAlive.start();

    let sceneAudioBuffers = [];
    let musicAudioBuffer  = null;

    if (videoMode === "story") {
      setRecStatus("🎙️ Generating narration with ElevenLabs…");
      for (let i = 0; i < scenes.length; i++) {
        setRecProg(Math.round((i / scenes.length) * 40));
        setRecStatus(`🎙️ Generating voice ${i + 1}/${scenes.length}…`);
        try {
          const ab = await elevenLabsTTS(scenes[i].text, elVoice.id);
          // ── MOBILE FIX: slice() to get a fresh copy before decode
          //    (WebKit on iOS sometimes transfers the buffer, making it detached) ──
          const decoded = await audioCtx.decodeAudioData(ab.slice(0));
          sceneAudioBuffers.push(decoded);
        } catch (err) {
          showToast(`TTS error scene ${i+1}: ${err.message}`, "err");
          sceneAudioBuffers.push(null);
        }
      }
    } else {
      setRecStatus("🎵 Loading song…");
      try {
        const songResp = await fetch(selectedSong.url);
        const songAb   = await songResp.arrayBuffer();
        musicAudioBuffer = await audioCtx.decodeAudioData(songAb.slice(0));
      } catch (err) {
        showToast(`Song load failed: ${err.message}`, "err");
        await audioCtx.close();
        setRecording(false); return;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    drawFrame(ctx, imgEls[0], 0, 1, scenes.length, W, H);

    const videoStream = canvas.captureStream(FPS);
    const combined = new MediaStream([...videoStream.getVideoTracks(), ...audioDest.stream.getAudioTracks()]);

    const mimeType = ["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm","video/mp4"]
      .find(m => MediaRecorder.isTypeSupported(m)) || "video/webm";

    const chunks = [];
    const recOptions = { mimeType };
    // ── MOBILE FIX: lower bitrate on mobile to prevent buffer overflows ──
    if (!isMobile) {
      recOptions.videoBitsPerSecond = 14_000_000;
      recOptions.audioBitsPerSecond = 192_000;
    } else {
      recOptions.videoBitsPerSecond = 4_000_000;
      recOptions.audioBitsPerSecond = 128_000;
    }

    const recorder = new MediaRecorder(combined, recOptions);
    recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

    stopRecordingRef.current = () => { if (recorder.state === "recording") recorder.stop(); };

    const finalBlob = await new Promise((resolve, reject) => {
      recorder.onstop = () => {
        audioCtx.close();
        resolve(new Blob(chunks, { type: mimeType.split(";")[0] }));
      };
      recorder.onerror = (e) => reject(e.error || new Error("Recorder error"));
      recorder.start(100); // larger chunk interval on mobile is more stable

      (async () => {
        if (videoMode === "story") {
          for (let i = 0; i < scenes.length; i++) {
            if (recorder.state !== "recording") break;
            setRecProg(40 + Math.round((i / scenes.length) * 55));
            setRecStatus(`🎬 Recording scene ${i + 1} of ${scenes.length}…`);
            const imgEl    = imgEls[i];
            const audioBuf = sceneAudioBuffers[i];
            const durationSec = audioBuf ? audioBuf.duration + 0.3 : 3;
            const durationMs  = durationSec * 1000;

            let audioEnded = false;
            if (audioBuf) {
              const source = audioCtx.createBufferSource();
              source.buffer = audioBuf;
              const gainNode = audioCtx.createGain();
              gainNode.gain.value = 1.0;
              source.connect(gainNode); gainNode.connect(masterGain);
              source.onended = () => { audioEnded = true; };
              // ── MOBILE FIX: schedule slightly in the future to avoid
              //    "start time in the past" errors on slow mobile devices ──
              source.start(audioCtx.currentTime + 0.05);
            } else {
              audioEnded = true;
            }

            const sceneStart = Date.now();
            await new Promise(resolveScene => {
              const timer = setInterval(() => {
                const elapsed  = Date.now() - sceneStart;
                const progress = Math.min(elapsed / durationMs, 0.999);
                drawFrame(ctx, imgEl, progress, i + 1, scenes.length, W, H);
                if ((audioEnded && elapsed >= durationMs * 0.5) || elapsed > durationMs + 2000) {
                  clearInterval(timer);
                  if (i + 1 < scenes.length) drawFrame(ctx, imgEls[i + 1], 0, i + 2, scenes.length, W, H);
                  resolveScene();
                }
              }, MS);
            });
          }
        } else {
          const totalSceneDurationSec = scenes.length * 4;
          const musicGain = audioCtx.createGain();
          musicGain.gain.value = songVolume;
          musicGain.connect(masterGain);

          if (musicAudioBuffer) {
            const src = audioCtx.createBufferSource();
            src.buffer = musicAudioBuffer;
            src.loop = true;
            src.connect(musicGain);
            src.start(audioCtx.currentTime + 0.05);
            src.stop(audioCtx.currentTime + totalSceneDurationSec + 1.05);
          }

          const perSceneMs = 4000;
          for (let i = 0; i < scenes.length; i++) {
            if (recorder.state !== "recording") break;
            setRecProg(Math.round((i / scenes.length) * 90));
            setRecStatus(`🎬 Recording scene ${i + 1} of ${scenes.length}…`);
            const imgEl     = imgEls[i];
            const sceneStart = Date.now();
            await new Promise(resolveScene => {
              const timer = setInterval(() => {
                const elapsed  = Date.now() - sceneStart;
                const progress = Math.min(elapsed / perSceneMs, 0.999);
                drawFrame(ctx, imgEl, progress, i + 1, scenes.length, W, H);
                if (elapsed >= perSceneMs) {
                  clearInterval(timer);
                  if (i + 1 < scenes.length) drawFrame(ctx, imgEls[i + 1], 0, i + 2, scenes.length, W, H);
                  resolveScene();
                }
              }, MS);
            });
          }
        }

        setRecStatus("✨ Finishing up…");
        const fadeStart = Date.now();
        await new Promise(res => {
          const fadeTimer = setInterval(() => {
            const p = Math.min((Date.now() - fadeStart) / 800, 1);
            ctx.fillStyle = `rgba(0,0,0,${p})`; ctx.fillRect(0, 0, W, H);
            if (p >= 1) { clearInterval(fadeTimer); res(); }
          }, MS);
        });
        await new Promise(r => setTimeout(r, 400));
        recorder.stop();
      })();
    });

    const url = URL.createObjectURL(finalBlob);
    setExportedBlob(finalBlob); setExportedUrl(url);
    setRecording(false); setRecProg(100); setRecStatus("");
    showToast("🎬 Video ready! Download or save to Cloudinary.");
    stopRecordingRef.current = null;
  };

  const stopRecording = () => {
    if (stopRecordingRef.current) stopRecordingRef.current();
    setRecording(false);
  };

  // ── CLOUDINARY SAVE — uses XHR for mobile compatibility ──
  const saveToCloudinary = async () => {
    if (!exportedBlob) { showToast("No video to save!", "err"); return; }
    setSavingToCloud(true);
    try {
      const token = localStorage.getItem("token");

      // Use XHR instead of fetch to avoid mobile browser CORS/auth issues
      const data = await saveToCloudinaryXHR(exportedBlob, token);
      setCloudUrl(data.secure_url);

      // Save to resources
      await fetch(`${server}/api/resources/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Video – ${new Date().toLocaleDateString()}`,
          category: "videos",
          resourceUrl: data.secure_url,
        }),
      });

      showToast("☁️ Video saved to Cloudinary & added to File Manager!");
    } catch (err) {
      showToast(`Cloudinary save failed: ${err.message}`, "err");
    }
    setSavingToCloud(false);
  };

  const clearExport = () => {
    if (exportedUrl) URL.revokeObjectURL(exportedUrl);
    setExportedUrl(null); setExportedBlob(null); setCloudUrl(null); setRecProg(0);
    showToast("🗑 Recording cleared");
  };

  const STEPS = ["Script", "Voice / Music", "Images", "Record"];
  const curScene = scenes[previewIdx];
  const previewImgUrl = curScene?.images?.[curScene.selected]?.url;
  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  const filteredSongs = SONG_LIBRARY.filter(s => songGenreFilter === "all" || s.genre === songGenreFilter);

  return (
    <>
      <style>{css}</style>
      <div className="vs">
        <header className="vs-bar">
          <div className="vs-brand">
            <div className="vs-brand-mark">VS</div>
            <span>Video Studio</span>
          </div>
          <div className="vs-steps">
            {STEPS.map((s, i) => (
              <button key={s} className={`vs-step-btn ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}
                onClick={() => step > i+1 && setStep(i+1)}>
                {step > i+1 ? "✓ " : ""}{s}
              </button>
            ))}
          </div>
        </header>

        <div className="vs-layout">
          {/* ══ SIDEBAR ══ */}
          <aside className="vs-sidebar">

            {step === 1 && (<>
              <span className="vs-lbl">Video Mode</span>
              <div className="vs-mode-toggle mb-3">
                <div className={`vs-mode-card ${videoMode === "story" ? "sel" : ""}`} onClick={() => setVideoMode("story")}>
                  <span className="mic">🎙️</span>
                  <h3>Story</h3>
                  <p>AI narration via ElevenLabs TTS</p>
                </div>
                <div className={`vs-mode-card ${videoMode === "music" ? "sel" : ""}`} onClick={() => setVideoMode("music")}>
                  <span className="mic">🎵</span>
                  <h3>Music</h3>
                  <p>Background song / Instagram-style reel</p>
                </div>
              </div>
              <span className="vs-lbl">Your Script</span>
              <div className="vs-hint mb-2">
                {videoMode === "story" ? "Write your narration. Each 1–2 sentences = one scene." : "Describe what each scene shows. No narration needed."}
              </div>
              <textarea className="vs-textarea mb-3"
                placeholder={videoMode === "story"
                  ? "The sun rose over the city as streets came alive. People rushed through morning light, carrying dreams and coffee cups."
                  : "Scene 1: Sunrise over mountains.\nScene 2: Waves crashing on beach.\nScene 3: City lights at night."}
                value={script} onChange={e => setScript(e.target.value)} rows={12} />
              {wordCount > 0 && (
                <div className="vs-tags mb-3">
                  <span className="vs-tag">📝 {wordCount} words</span>
                  {videoMode === "story" && <span className="vs-tag">~{Math.ceil(wordCount / 2.5)}s narration</span>}
                </div>
              )}
              <button className="vs-btn vs-btn-primary vs-btn-block"
                onClick={() => setStep(2)} disabled={script.trim().length < 10}>
                Continue →
              </button>
            </>)}

            {step === 2 && videoMode === "story" && (<>
              <div className="vs-apikey-box mb-3">
                <div className="title">
                  <div className={`dot ${elStatus === "ok" ? "" : elStatus === "err" ? "off" : ""}`} />
                  {elStatus === "ok" ? "ElevenLabs Connected" : elStatus === "err" ? "Connection Error" : "ElevenLabs (Server)"}
                </div>
                {elStatusMsg && (
                  <div className={`el-status ${elStatus}`} style={{ marginTop: 8 }}>{elStatusMsg}</div>
                )}
                <button className="vs-btn vs-btn-outline vs-btn-block" style={{ marginTop: 8, fontSize: 11 }}
                  onClick={testElKey}>Test Connection</button>
              </div>
              <span className="vs-lbl">Voice</span>
              <div className="vs-voices mb-3">
                {EL_VOICES.map(v => (
                  <div key={v.id} className={`vs-voice ${elVoice.id === v.id ? "sel" : ""}`} onClick={() => setElVoice(v)}>
                    <span className="vem">{v.emoji}</span>
                    <div className="vnm">{v.name}</div>
                    <div className="vd">{v.desc}</div>
                    <button className="vs-btn vs-btn-sm vs-btn-soft"
                      style={{ marginTop: 8, width: "100%", fontSize: 10 }}
                      onClick={e => { e.stopPropagation(); previewElVoice(v); }}>
                      ▶ Preview
                    </button>
                  </div>
                ))}
              </div>
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
                <button className="vs-btn vs-btn-primary" style={{ flex: 1 }}
                  onClick={() => { buildScenesFromScript(); setStep(3); }}>
                  Add Images →
                </button>
              </div>
            </>)}

            {step === 2 && videoMode === "music" && (<>
              <span className="vs-lbl">Song Library</span>
              <div className="vs-song-genres mb-2">
                {SONG_GENRES.map(g => (
                  <div key={g} className={`vs-genre-chip ${songGenreFilter === g ? "sel" : ""}`}
                    onClick={() => setSongGenreFilter(g)}>{g}</div>
                ))}
              </div>
              <div className="vs-song-list mb-3">
                {filteredSongs.map(song => (
                  <div key={song.id} className={`vs-song-item ${selectedSong?.id === song.id ? "sel" : ""}`}
                    onClick={() => setSelectedSong(song)}>
                    <span className="sico">{song.emoji}</span>
                    <div className="smeta">
                      <div className="stitle">{song.title}</div>
                      <div className="sartist">{song.artist}</div>
                    </div>
                    <span className="sdur">{song.duration}</span>
                    <div className="play-mini" onClick={e => { e.stopPropagation(); previewSong(song); }}>
                      {playingSongId === song.id ? "⏸" : "▶"}
                    </div>
                  </div>
                ))}
              </div>

              <span className="vs-lbl" style={{ marginBottom: 6 }}>Upload Your Song</span>
              <label className="vs-music-upload">
                <input type="file" accept="audio/*" hidden onChange={handleCustomSongUpload} />
                <span className="ico">🎵</span>
                <span>Click to upload MP3, WAV, M4A…</span>
              </label>
              {selectedSong?.custom && (
                <div className="vs-selected-song mb-2">
                  🎵 {selectedSong.title}
                  <button className="vs-btn vs-btn-sm vs-btn-ghost" style={{ marginLeft: "auto" }}
                    onClick={() => { setSelectedSong(null); setCustomSongFile(null); }}>✕</button>
                </div>
              )}

              <div className="vs-volume-row mb-2">
                <span>🔊 Volume</span>
                <input type="range" min={0} max={1} step={0.05} value={songVolume}
                  onChange={e => setSongVolume(Number(e.target.value))} />
                <span>{Math.round(songVolume * 100)}%</span>
              </div>

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
                <button className="vs-btn vs-btn-primary" style={{ flex: 1 }}
                  onClick={() => { buildScenesFromScript(); setStep(3); }}
                  disabled={!selectedSong}>
                  Add Images →
                </button>
              </div>
            </>)}

            {step === 3 && (<>
              <span className="vs-lbl">Visual Style</span>
              <div className="vs-chips mb-3">
                {IMAGE_STYLES.map(s => (
                  <div key={s.id} className={`vs-chip ${imgStyle.id === s.id ? "sel" : ""}`} onClick={() => setImgStyle(s)}>
                    {s.label}
                  </div>
                ))}
              </div>
              <div className="vs-hr" />
              <div className="vs-hint mb-2">
                Upload images to scenes, then hit <strong>Auto-Match</strong> to let AI distribute them.
              </div>
              <button className="vs-btn vs-btn-primary vs-btn-block mb-2" onClick={handleAutoMatch} disabled={matching}>
                {matching ? "🤖 Matching…" : "✨ AI Auto-Match All Scenes"}
              </button>
              {lastMatchedCount > 0 && (
                <div className="vs-hint mb-2" style={{ color: "var(--green)" }}>✅ {lastMatchedCount}/{scenes.length} scenes matched!</div>
              )}
              <button className="vs-btn vs-btn-soft vs-btn-block mb-3" onClick={addScene}>+ Add Scene</button>
              <div className="row">
                <button className="vs-btn vs-btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                <button className="vs-btn vs-btn-primary" style={{ flex: 1 }} onClick={() => setStep(4)} disabled={scenes.length === 0}>
                  Record →
                </button>
              </div>
            </>)}

            {step === 4 && (<>
              <span className="vs-lbl">Summary</span>
              <div className="vs-summary mb-3">
                {[
                  { k: "Mode",    v: videoMode === "story" ? "🎙️ Narration" : "🎵 Music" },
                  { k: "Scenes",  v: scenes.length },
                  { k: "Format",  v: format === "portrait" ? "9:16" : "16:9" },
                  { k: videoMode === "story" ? "Voice" : "Song",
                    v: videoMode === "story" ? `${elVoice.emoji} ${elVoice.name}` : (selectedSong?.title || "—") },
                ].map(it => (
                  <div key={it.k} className="vs-scard">
                    <div className="k">{it.k}</div>
                    <div className="v" style={{ fontSize: 12 }}>{it.v}</div>
                  </div>
                ))}
              </div>

              {/* Mobile recording warning */}
              <div className="vs-mobile-warn">
                ⚠️ Mobile recording uses lower resolution for stability. Use Chrome on Android for best results. Safari/iOS has limited WebM support.
              </div>

              <div className="vs-hint mb-2" style={{ background: "var(--surface2)", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
                🔕 <strong>Silent recording</strong> — audio goes through AudioContext directly into the video file. No speaker volume needed.
                {videoMode === "story" && " ElevenLabs voices are generated server-side."}
              </div>

              {recording ? (<>
                <div className="rec-live mb-2">
                  <div className="rec-dot" />
                  🔴 Recording… {recProg}%
                </div>
                <div className="vs-prog mb-2">
                  <div className="vs-prog-fill" style={{ width: `${recProg}%` }} />
                </div>
                {recStatus && <div className="muted mb-2" style={{ textAlign: "center" }}>{recStatus}</div>}
                <button className="vs-btn vs-btn-red vs-btn-block mb-2" onClick={stopRecording}>⏹ Stop Recording</button>
              </>) : (
                <button className="vs-btn vs-btn-primary vs-btn-block mb-2" onClick={recordVideo} disabled={recording}>
                  🔴 Record Video
                </button>
              )}

              {exportedUrl && (
                <div className="vs-cloudinary-box">
                  <span className="title">Recording Ready</span>
                  <div className="vs-export-actions">
                    <a href={exportedUrl} download={`video_${format}_${Date.now()}.webm`}
                      className="vs-btn vs-btn-primary"
                      style={{ textDecoration: "none", width: "100%", justifyContent: "center" }}>
                      ⬇️ Download (.webm)
                    </a>
                    {!cloudUrl ? (
                      <button className="vs-btn vs-btn-blue vs-btn-block" onClick={saveToCloudinary} disabled={savingToCloud}>
                        {savingToCloud ? "☁️ Uploading…" : "☁️ Save to Cloudinary"}
                      </button>
                    ) : (
                      <a href={cloudUrl} target="_blank" rel="noopener noreferrer"
                        className="vs-btn vs-btn-green"
                        style={{ textDecoration: "none", width: "100%", justifyContent: "center" }}>
                        ✅ View on Cloudinary ↗
                      </a>
                    )}
                    <button className="vs-btn vs-btn-red vs-btn-block" onClick={clearExport}>🗑 Delete Recording</button>
                  </div>
                </div>
              )}
              <div className="vs-hr" />
              <button className="vs-btn vs-btn-ghost vs-btn-block" onClick={() => setStep(3)}>← Back to Images</button>
            </>)}
          </aside>

          {/* ══ MAIN ══ */}
          <main className="vs-main">

            {step === 1 && (
              <div>
                <div className="vs-page-title">
                  {videoMode === "story" ? "🎙️ Story Mode" : "🎵 Music Mode"}
                </div>
                <div className="vs-page-sub">
                  {videoMode === "story"
                    ? "Write your narration script. ElevenLabs will voice it — no browser TTS, no microphone needed."
                    : "Choose images and a song. Each scene plays for 4 seconds with your chosen track."}
                </div>
                <div className="vs-intro-grid mb-3" style={{ marginBottom: 36 }}>
                  {(videoMode === "story" ? [
                    { ico: "📝", title: "Write script",      desc: "Each 1–2 sentences becomes one scene with its own image." },
                    { ico: "🎙️", title: "ElevenLabs voice",  desc: "Real AI voices — not browser TTS. No speaker volume, no external audio bleed." },
                    { ico: "🖼️", title: "AI image match",    desc: "Upload images, Auto-Match assigns the best one per scene." },
                    { ico: "🔕", title: "Silent recording",  desc: "All audio is routed internally — device speakers stay silent during recording." },
                  ] : [
                    { ico: "🎵", title: "Pick a song",       desc: "Choose from the library or upload your own MP3/WAV." },
                    { ico: "🖼️", title: "Add scene images",  desc: "Each image shows for 4 seconds with Ken Burns effect." },
                    { ico: "🎚️", title: "Mix volume",        desc: "Adjust song volume. Music is mixed directly into the video file." },
                    { ico: "📱", title: "Reel-ready",        desc: "Export in 9:16 portrait for Instagram / TikTok reels." },
                  ]).map(c => (
                    <div key={c.title} className="vs-intro-item">
                      <span className="ico">{c.ico}</span><h3>{c.title}</h3><p>{c.desc}</p>
                    </div>
                  ))}
                </div>
                {script.trim().length > 0 && (<>
                  <div className="vs-section" style={{ marginTop: 0 }}>Script Preview</div>
                  <div className="vs-script-display">{script}</div>
                  <div className="vs-tags">
                    <span className="vs-tag">📝 {wordCount} words</span>
                    {videoMode === "story" && <span className="vs-tag">~{Math.ceil(wordCount / 2.5)}s narration</span>}
                  </div>
                </>)}
              </div>
            )}

            {step === 2 && videoMode === "story" && (
              <div>
                <div className="vs-page-title">ElevenLabs Voice</div>
                <div className="vs-page-sub">
                  Real AI voices via ElevenLabs — no browser TTS, no microphone.<br/>
                  Audio is routed through AudioContext directly into the video file.
                </div>
                <div style={{ background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "1px solid #c4b5fd", borderRadius: 14, padding: "16px 18px", marginBottom: 28, fontFamily: "var(--mono)", fontSize: 11, color: "#5b21b6", lineHeight: 1.8 }}>
                  🔒 <strong>ElevenLabs is configured on the server.</strong><br/>
                  Your API key is securely stored in the backend — no setup needed here.<br/>
                  Click <strong>Test Connection</strong> in the sidebar to verify it's working.
                </div>
                <div className="vs-vprofile-grid">
                  {EL_VOICES.map(v => (
                    <div key={v.id} className={`vs-vcard ${elVoice.id === v.id ? "sel" : ""}`} onClick={() => setElVoice(v)}>
                      <span className="ico">{v.emoji}</span>
                      <h3>{v.name}</h3>
                      <div className="meta">{v.desc}<br/>{v.tags.join(", ")}</div>
                      <button className="vs-btn vs-btn-sm vs-btn-soft"
                        style={{ marginTop: 12, width: "100%" }}
                        onClick={e => { e.stopPropagation(); previewElVoice(v); }}>
                        ▶ Preview
                      </button>
                    </div>
                  ))}
                </div>
                <div className="vs-section">Your Script</div>
                <div className="vs-script-display">{script}</div>
              </div>
            )}

            {step === 2 && videoMode === "music" && (
              <div>
                <div className="vs-page-title">Choose Your Song</div>
                <div className="vs-page-sub">
                  Pick from the free library below, or upload your own MP3/WAV/M4A.<br/>
                  The song plays across your entire reel — no microphone needed.
                </div>
                <div className="vs-section" style={{ marginTop: 0, marginBottom: 16 }}>Song Library</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 32 }}>
                  {SONG_LIBRARY.map(song => (
                    <div key={song.id}
                      onClick={() => setSelectedSong(song)}
                      style={{ padding: "16px 14px", borderRadius: 14, border: `2px solid ${selectedSong?.id === song.id ? "var(--ink)" : "var(--border)"}`, background: selectedSong?.id === song.id ? "var(--surface)" : "var(--surface2)", cursor: "pointer", transition: "all .18s", boxShadow: selectedSong?.id === song.id ? "var(--shadow)" : "none", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{song.emoji}</div>
                      <div style={{ fontFamily: "var(--font)", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{song.title}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink3)", marginBottom: 10 }}>{song.artist} · {song.duration} · {song.genre}</div>
                      <button className="vs-btn vs-btn-sm vs-btn-soft" style={{ width: "100%" }}
                        onClick={e => { e.stopPropagation(); previewSong(song); }}>
                        {playingSongId === song.id ? "⏸ Stop" : "▶ Preview"}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="vs-section">Upload Your Own</div>
                <label style={{ display: "block", border: "2px dashed var(--border)", borderRadius: 14, padding: "28px", textAlign: "center", cursor: "pointer", transition: "all .18s", fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink3)", background: "var(--surface2)", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--ink)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  <input type="file" accept="audio/*" hidden onChange={handleCustomSongUpload} />
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🎵</div>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>Drop or click to upload</div>
                  <div>MP3, WAV, M4A, OGG supported</div>
                  {customSongFile && <div style={{ marginTop: 10, color: "var(--green)", fontWeight: 700 }}>✓ {customSongFile.name}</div>}
                </label>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="vs-page-title">Add Scene Images</div>
                <div className="vs-page-sub">
                  Upload images to scenes. Use <strong>AI Auto-Match</strong> to assign images automatically.
                </div>
                {lastMatchedCount > 0 && (
                  <div className="vs-match-banner">
                    ✨ AI matched <strong>{lastMatchedCount} scenes</strong> — gold <strong>AI</strong> badge = auto-assigned.
                  </div>
                )}
                {scenes.map((sc, si) => (
                  <div key={sc.id} className="vs-scene-wrap">
                    <div className="vs-scene-header">
                      <div className="vs-scene-num">{si + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <textarea className="vs-textarea" style={{ minHeight: 52, fontSize: 12, marginBottom: 0 }}
                          value={sc.text} onChange={e => updateScene(si, "text", e.target.value)}
                          placeholder="Scene text…" />
                      </div>
                      <div className="vs-scene-acts">
                        <button className="vs-btn vs-btn-red vs-btn-sm" onClick={() => delScene(si)}>✕</button>
                      </div>
                    </div>
                    <div className="muted mb-2" style={{ marginTop: 4 }}>
                      {sc.images.length === 0 ? "⚠️ No image yet" : `${sc.images.length} image${sc.images.length > 1 ? "s" : ""} · click to select`}
                    </div>
                    <div className="vs-img-grid">
                      {sc.images.map((img, ii) => (
                        <div key={ii} className={`vs-img-thumb ${sc.selected === ii ? "sel" : ""}`}
                          onClick={() => updateScene(si, "selected", ii)}>
                          <img src={img.url} alt="" crossOrigin="anonymous"
                            style={{ opacity: 0 }}
                            onLoad={e => { e.target.style.opacity = 1; }}
                            onError={e => { e.target.parentElement.style.background = "var(--surface3)"; e.target.style.display = "none"; }} />
                          {sc.selected === ii && <div className="chk">✓</div>}
                          {sc.autoMatched && sc.selected === ii && <div className="auto-badge">AI</div>}
                          <div className="del-img" onClick={e => { e.stopPropagation(); delImg(si, ii); }}>✕</div>
                        </div>
                      ))}
                      <label className="vs-upload-tile">
                        <input type="file" accept="image/*" multiple hidden onChange={e => addImgFiles(si, e.target.files)} />
                        <span className="ico">📁</span>
                        <span>Upload photo(s)</span>
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

            {step === 4 && (
              <div>
                <div className="vs-page-title">Record & Download</div>
                <div className="vs-page-sub">
                  {videoMode === "story"
                    ? "ElevenLabs voices are generated first, then played through AudioContext — no speaker required."
                    : "Song is loaded and mixed via AudioContext — completely internal, no microphone needed."}
                </div>

                <div className={`vs-preview ${format}`}>
                  {scenes.length > 0 && curScene ? (<>
                    {previewImgUrl
                      ? <img key={previewIdx} src={previewImgUrl} className="pimg" crossOrigin="anonymous"
                          onError={e => { e.target.style.display = "none"; }} alt="preview" />
                      : <div style={{ width: "100%", height: "100%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "rgba(255,255,255,.2)", fontFamily: "var(--mono)", fontSize: 12 }}>no image</span>
                        </div>
                    }
                    <div className="pcnt">{previewIdx + 1} / {scenes.length}</div>
                    {recording && (
                      <div style={{ position: "absolute", top: 12, left: 14, background: "rgba(239,68,68,0.9)", borderRadius: 6, padding: "3px 10px", fontFamily: "var(--mono)", fontSize: 10, color: "white", fontWeight: 700 }}>● REC</div>
                    )}
                  </>) : (
                    <div className="pempty">
                      <div className="big">🎬</div>
                      <p>Complete steps 1–3<br/>to preview your video.</p>
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
                      <div key={sc.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, cursor: "pointer" }}
                        onClick={() => setPreviewIdx(i)}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: previewIdx === i ? "var(--ink)" : "var(--surface3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: previewIdx === i ? "white" : "var(--ink3)", flexShrink: 0, fontFamily: "var(--sans)" }}>{i + 1}</div>
                        {sc.images[sc.selected]?.url && (
                          <div style={{ width: 56, height: 36, borderRadius: 7, overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0, background: "var(--surface3)" }}>
                            <img src={sc.images[sc.selected].url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" crossOrigin="anonymous" />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink2)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {sc.text || "(empty scene)"}
                          </div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)", marginTop: 2 }}>
                            {sc.images.length} image{sc.images.length !== 1 ? "s" : ""}{sc.autoMatched ? " · 🤖 auto-matched" : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {exportedUrl && (<>
                  <div className="vs-section">Recorded Video</div>
                  <div className="muted mb-2">.webm plays in Chrome, Firefox, VLC. Convert to .mp4 with Handbrake if needed.</div>
                  <video src={exportedUrl} controls className="vs-export-vid" playsInline />
                  {cloudUrl && (
                    <div style={{ marginTop: 12, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, fontFamily: "var(--mono)", fontSize: 11, color: "#166534" }}>
                      ☁️ <a href={cloudUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>{cloudUrl}</a>
                    </div>
                  )}
                </>)}
              </div>
            )}
          </main>
        </div>
      </div>

      {savingToCloud && (
        <div className="vs-saving-overlay">
          <div className="vs-saving-modal">
            <span className="spin">☁️</span>
            <div style={{ fontFamily: "var(--font)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Saving to Cloudinary</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink3)" }}>Uploading your video…</div>
          </div>
        </div>
      )}
      {toast && <div className={`vs-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

function PasteUrl({ onAdd }) {
  const [val, setVal] = useState("");
  return (
    <div className="vs-prompt-row" style={{ marginTop: 8 }}>
      <input className="vs-prompt-input" placeholder="Or paste an image URL and press Enter…"
        value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && val.trim()) { onAdd(val.trim()); setVal(""); } }} />
      <button className="vs-btn vs-btn-soft vs-btn-sm" style={{ flexShrink: 0 }}
        onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(""); } }}>Add URL</button>
    </div>
  );
}