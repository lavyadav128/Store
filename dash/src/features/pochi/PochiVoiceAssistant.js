// PochiVoiceAssistant.js
// ─────────────────────────────────────────────────────────────
// "Pochi" — Exact Apple Siri Obsidian Glass Voice Assistant
// • Pixel-perfect match with official Apple iOS Siri Orb
// • Fluid layered iridescent ribbons (Cyan, Magenta, Mint)
// • Brilliant white-hot glowing core flare
// • Specular glass reflections and 3D depth
// • 1-Tap Activator + Ctrl+Space + Voice-in Voice-out
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Fade } from "@mui/material";
import axios from "axios";
import server from "../../shared/environment";
import Pochi3DViewerModal from "./Pochi3DViewerModal.js";

// Native Web Audio Synth Chime for Siri-like trigger sound
function playSiriChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.08); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.18); // D6

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch (e) {}
}

const WAKE_PATTERN = /\b(hey pochi|ok pochi|okay pochi|hi pochi|hello pochi|pochi|poki)\b/i;

const VIEW_MAP = {
  revenue: "revenue-recovery",
  "revenue-recovery": "revenue-recovery",
  instagram: "instagram-agent",
  "instagram-agent": "instagram-agent",
  client: "client-agent",
  client_agent: "client-agent",
  "client-agent": "client-agent",
  dreams: "dreams",
  admin: "admin",
  dashboard: "admin",
  batches: "batches",
  batch: "batches",
  notes: "notes",
  "best-notes": "notes",
  bestnotes: "notes",
  files: "files",
  file: "files",
  "file-manager": "files",
  filemanager: "files",
};

/**
 * Exact Apple Siri Obsidian Sphere Component
 * Renders the dark glossy glass ball with fluid multi-color ribbon waves & white-hot core
 */
function SiriSphere({ size = 96, isSpeaking = false, isListening = false }) {
  const speed = isSpeaking ? "1.8s" : isListening ? "2.6s" : "4.5s";

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle at 50% 120%, #0a0f24 0%, #030611 65%, #010206 100%)",
        boxShadow: `
          0 16px 40px rgba(0, 0, 0, 0.7),
          0 0 35px rgba(0, 220, 255, 0.35),
          0 0 20px rgba(255, 0, 128, 0.25),
          inset 0 1.5px 3px rgba(255, 255, 255, 0.75),
          inset 0 -6px 16px rgba(0, 0, 0, 0.95),
          inset 0 0 15px rgba(0, 210, 255, 0.2)
        `,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          transform: "scale(1.06)",
        },
      }}
    >
      {/* ── Internal Ambient Aura ── */}
      <Box
        sx={{
          position: "absolute",
          inset: "8%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 230, 255, 0.25) 0%, rgba(255, 0, 128, 0.2) 50%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* ── Ribbon 1: Cyan / Electric Turquoise Wave ── */}
      <Box
        sx={{
          position: "absolute",
          width: "88%",
          height: "88%",
          borderRadius: "44% 56% 60% 40% / 50% 40% 60% 50%",
          background: "radial-gradient(ellipse at center, rgba(0, 240, 255, 0.85) 0%, rgba(0, 150, 255, 0.6) 45%, transparent 72%)",
          mixBlendMode: "screen",
          filter: "blur(4px)",
          animation: `siriMorphOne ${speed} ease-in-out infinite alternate, siriRotateCW 8s linear infinite`,
        }}
      />

      {/* ── Ribbon 2: Magenta / Coral / Violet Wave ── */}
      <Box
        sx={{
          position: "absolute",
          width: "82%",
          height: "82%",
          borderRadius: "60% 40% 48% 52% / 40% 60% 40% 60%",
          background: "radial-gradient(ellipse at center, rgba(255, 30, 120, 0.85) 0%, rgba(180, 20, 220, 0.65) 45%, transparent 72%)",
          mixBlendMode: "screen",
          filter: "blur(4px)",
          animation: `siriMorphTwo ${speed} ease-in-out infinite alternate 0.5s, siriRotateCCW 7s linear infinite`,
        }}
      />

      {/* ── Ribbon 3: Emerald Mint / Cyan Accent Wave ── */}
      <Box
        sx={{
          position: "absolute",
          width: "74%",
          height: "74%",
          borderRadius: "52% 48% 62% 38% / 48% 52% 48% 52%",
          background: "radial-gradient(ellipse at center, rgba(0, 255, 190, 0.8) 0%, rgba(0, 180, 255, 0.5) 45%, transparent 70%)",
          mixBlendMode: "screen",
          filter: "blur(3px)",
          animation: `siriMorphThree ${speed} ease-in-out infinite alternate 1s, siriRotateCW 9s linear infinite`,
        }}
      />

      {/* ── Center White-Hot Luminous Core Flare ── */}
      <Box
        sx={{
          position: "absolute",
          width: isSpeaking ? "44%" : "36%",
          height: isSpeaking ? "44%" : "36%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.95) 25%, rgba(180, 240, 255, 0.7) 50%, rgba(255, 40, 140, 0.3) 75%, transparent 100%)",
          mixBlendMode: "screen",
          filter: "blur(1.5px)",
          animation: `siriCoreFlare ${isSpeaking ? "1.2s" : "2s"} ease-in-out infinite alternate`,
          zIndex: 4,
        }}
      />

      {/* ── Intense Center Sparkle ── */}
      <Box
        sx={{
          position: "absolute",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#ffffff",
          boxShadow: "0 0 16px 5px #ffffff, 0 0 30px 10px rgba(0, 230, 255, 0.8)",
          zIndex: 5,
        }}
      />

      {/* ── Top Glass Crescent Specular Reflection ── */}
      <Box
        sx={{
          position: "absolute",
          top: "4%",
          left: "16%",
          width: "68%",
          height: "32%",
          borderRadius: "50% 50% 40% 40%",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 60%, transparent 100%)",
          filter: "blur(0.8px)",
          pointerEvents: "none",
          zIndex: 6,
        }}
      />

      {/* ── Outer Glass Sphere Vignette ── */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(2, 4, 10, 0.85) 90%, #010206 100%)",
          pointerEvents: "none",
          zIndex: 7,
        }}
      />
    </Box>
  );
}

export default function PochiVoiceAssistant({ onNavigate, activeView }) {
  const [active, setActive] = useState(false);
  const [state, setState] = useState("idle"); // 'listening' | 'thinking' | 'speaking' | 'idle'
  const [statusText, setStatusText] = useState("");
  const [model3dData, setModel3dData] = useState(null);
  const [show3dModal, setShow3dModal] = useState(false);

  const activeRef = useRef(false);
  const stateRef = useRef("idle");
  const silenceTimerRef = useRef(null);
  const dismissTimerRef = useRef(null);
  const speechSpeakingRef = useRef(false);
  const queryBufferRef = useRef("");
  const recognitionRef = useRef(null);

  activeRef.current = active;
  stateRef.current = state;

  // Speak aloud via browser Web Speech Synthesis
  const speakVoice = useCallback(
    (text, onComplete) => {
      if (!("speechSynthesis" in window) || !text) {
        if (onComplete) onComplete();
        return;
      }
      window.speechSynthesis.cancel();

      // Clean speech text
      const cleanText = text.replace(/[*_#`]/g, "").replace(/₹/g, "rupees ").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Select natural Siri voice
      const voices = window.speechSynthesis.getVoices();
      const siriVoice =
        voices.find((v) => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Victoria") || v.name.includes("Google UK English Female") || v.name.includes("Google US English")) ||
        voices.find((v) => v.lang.startsWith("en-US") || v.lang.startsWith("en-IN") || v.lang.startsWith("en-GB")) ||
        voices[0];

      if (siriVoice) utterance.voice = siriVoice;
      utterance.rate = 1.05;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        speechSpeakingRef.current = true;
        setState("speaking");
        setStatusText(cleanText);
      };

      utterance.onend = () => {
        speechSpeakingRef.current = false;
        setState("idle");
        if (onComplete) onComplete();

        // Auto-dismiss circular orb after finishing speech
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = setTimeout(() => {
          setActive(false);
          setStatusText("");
          window.dispatchEvent(new CustomEvent("pochi-active", { detail: { active: false } }));
        }, 2200);
      };

      utterance.onerror = () => {
        speechSpeakingRef.current = false;
        setState("idle");
        if (onComplete) onComplete();
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = setTimeout(() => {
          setActive(false);
          setStatusText("");
          window.dispatchEvent(new CustomEvent("pochi-active", { detail: { active: false } }));
        }, 1200);
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  // Send query to Pochi AI backend
  const askPochiBackend = useCallback(
    async (query) => {
      const q = query ? query.trim() : "";
      if (!q || q.length < 2) {
        setState("idle");
        return;
      }

      // Stop mic listener while thinking and speaking
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      setState("thinking");
      setStatusText(`Thinking...`);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${server}/api/admin/pochi/query`,
          { query: q },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;
        const voiceReply = data.voiceText || data.visualReply || "All systems are running properly, Admin.";

        // Execute logout action if requested
        if (data.action === "LOGOUT") {
          speakVoice(voiceReply, () => {
            setTimeout(() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }, 600);
          });
          return;
        }

        // Execute 3D Model visualization action if requested
        if (data.action === "SHOW_3D_MODEL" || data.model3d || /3d|three d|3-d|animation/i.test(q)) {
          const modelPayload = data.model3d || {
            title: q.replace(/(show me|3d|view of|animation|model)/gi, "").trim() || "3D Interactive Simulation",
            query: q,
            type: q,
            description: "Drag to rotate 360°, scroll to zoom, and explore in 3D.",
          };
          setModel3dData(modelPayload);
          setShow3dModal(true);
        }

        // Execute navigation action if requested
        if (data.action === "NAVIGATE_VIEW" && data.targetView && onNavigate) {
          const mapped = VIEW_MAP[data.targetView.toLowerCase()] || data.targetView;
          setTimeout(() => {
            onNavigate(mapped);
          }, 400);
        }

        // Speak back aloud
        speakVoice(voiceReply);
      } catch (err) {
        console.error("Pochi error:", err);
        const errMsg = "I encountered a connection error with your admin server.";
        speakVoice(errMsg);
      }
    },
    [onNavigate, speakVoice]
  );

  // Start Speech Recognition when Pochi wakes up
  const startListeningSession = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API not supported in this browser.");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = navigator.language || "en-US";

      rec.onresult = (event) => {
        if (speechSpeakingRef.current) return;

        let transcriptChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcriptChunk += event.results[i][0].transcript;
        }
        transcriptChunk = transcriptChunk.trim();
        if (!transcriptChunk) return;

        const cleanQuery = transcriptChunk.replace(WAKE_PATTERN, "").trim();
        const currentQuery = cleanQuery || transcriptChunk;

        if (currentQuery) {
          queryBufferRef.current = currentQuery;
          setStatusText(currentQuery);

          // Auto-submit after 950ms of silence
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (queryBufferRef.current && queryBufferRef.current.trim().length > 1) {
              askPochiBackend(queryBufferRef.current);
            }
          }, 950);
        }
      };

      rec.onerror = (e) => {
        if (e.error === "no-speech" || e.error === "network") return;
        console.warn("Speech session event:", e.error);
      };

      rec.onend = () => {
        if (stateRef.current === "listening" && queryBufferRef.current && queryBufferRef.current.length > 1) {
          askPochiBackend(queryBufferRef.current);
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.warn("Speech recognition error:", err);
    }
  }, [askPochiBackend]);

  // Trigger Pochi Wake
  const wakePochi = useCallback(
    (immediateQuery = "") => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      playSiriChime();
      setActive(true);
      queryBufferRef.current = immediateQuery || "";

      if (immediateQuery && immediateQuery.trim().length > 2) {
        setStatusText(immediateQuery);
        askPochiBackend(immediateQuery);
      } else {
        setState("listening");
        setStatusText("Listening for Admin...");
        startListeningSession();
      }
    },
    [askPochiBackend, startListeningSession]
  );

  // Setup Keyboard Shortcuts (Ctrl+Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        wakePochi();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      window.speechSynthesis?.cancel();
    };
  }, [wakePochi]);

  // Ambient Voice Wake-Word Listener ("Pochi", "Hey Pochi", "Poki")
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let ambientRec = null;
    let isRunning = true;

    const startAmbient = () => {
      if (!isRunning || activeRef.current || speechSpeakingRef.current) return;
      try {
        ambientRec = new SpeechRecognition();
        ambientRec.continuous = true;
        ambientRec.interimResults = true;
        ambientRec.lang = navigator.language || "en-US";

        ambientRec.onresult = (e) => {
          if (activeRef.current || speechSpeakingRef.current) return;
          let text = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
          }
          text = text.trim();
          if (WAKE_PATTERN.test(text)) {
            const queryAfterWake = text.replace(WAKE_PATTERN, "").trim();
            console.log("Pochi wake word called by admin. Query:", queryAfterWake);
            try { ambientRec.stop(); } catch (err) {}
            wakePochi(queryAfterWake);
          }
        };

        ambientRec.onerror = (e) => {
          if (e.error === "not-allowed") {
            isRunning = false;
            return;
          }
        };

        ambientRec.onend = () => {
          if (isRunning && !activeRef.current && !speechSpeakingRef.current) {
            setTimeout(startAmbient, 600);
          }
        };

        ambientRec.start();
      } catch (err) {
        if (isRunning && !activeRef.current) {
          setTimeout(startAmbient, 2500);
        }
      }
    };

    startAmbient();

    return () => {
      isRunning = false;
      if (ambientRec) {
        try { ambientRec.stop(); } catch (e) {}
      }
    };
  }, [wakePochi]);

  const font = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'DM Sans', sans-serif";

  return (
    <>
      <style>{`
        @keyframes siriMorphOne {
          0% { border-radius: 44% 56% 60% 40% / 50% 40% 60% 50%; transform: scale(1) translateY(0); }
          50% { border-radius: 58% 42% 45% 55% / 42% 58% 42% 58%; transform: scale(1.08) translateY(-3px); }
          100% { border-radius: 40% 60% 52% 48% / 60% 40% 55% 45%; transform: scale(0.95) translateY(3px); }
        }
        @keyframes siriMorphTwo {
          0% { border-radius: 60% 40% 48% 52% / 40% 60% 40% 60%; transform: scale(1) translateX(0); }
          50% { border-radius: 46% 54% 58% 42% / 54% 46% 58% 42%; transform: scale(1.1) translateX(3px); }
          100% { border-radius: 54% 46% 40% 60% / 45% 55% 45% 55%; transform: scale(0.94) translateX(-3px); }
        }
        @keyframes siriMorphThree {
          0% { border-radius: 52% 48% 62% 38% / 48% 52% 48% 52%; transform: scale(1); }
          50% { border-radius: 42% 58% 46% 54% / 56% 44% 56% 44%; transform: scale(1.06); }
          100% { border-radius: 58% 42% 54% 46% / 44% 56% 44% 56%; transform: scale(0.96); }
        }
        @keyframes siriRotateCW {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes siriRotateCCW {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes siriCoreFlare {
          0% { transform: scale(0.85); opacity: 0.8; }
          50% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.85; }
        }
        @keyframes siriFloatingWave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      {/* ── 1-TAP OBSIDIAN SIRI ORB (Bottom-Right Shortcut) ── */}
      {!active && (
        <Fade in={!active} timeout={400}>
          <Box
            onClick={() => wakePochi()}
            sx={{
              position: "fixed",
              bottom: { xs: 20, sm: 28 },
              right: { xs: 20, sm: 28 },
              zIndex: 999990,
              animation: "siriFloatingWave 3s ease-in-out infinite",
            }}
          >
            <SiriSphere size={52} isSpeaking={false} isListening={false} />
          </Box>
        </Fade>
      )}

      {/* ── ACTIVE FULL-SIZE APPLE SIRI MODAL HUD ── */}
      <Fade in={active} timeout={300}>
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: 35, sm: 50 },
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999999,
            display: active ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {/* Real-time Subtitle / Voice Caption (Sleek Apple Glass Badge) */}
          {statusText && (
            <Fade in timeout={200}>
              <Box
                sx={{
                  mb: 2.5,
                  px: 3,
                  py: 1.2,
                  borderRadius: "30px",
                  background: "rgba(10, 15, 30, 0.85)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5), 0 0 35px rgba(0, 240, 255, 0.25)",
                  maxWidth: { xs: "90vw", sm: 540 },
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: font,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#f8fafc",
                    letterSpacing: "-0.2px",
                    lineHeight: 1.45,
                  }}
                >
                  {statusText}
                </Typography>
              </Box>
            </Fade>
          )}

          {/* ── ACTIVE SIRI OBSIDIAN SPHERE ── */}
          <Box
            sx={{ pointerEvents: "auto" }}
            onClick={() => {
              if (state === "speaking") {
                window.speechSynthesis?.cancel();
                setActive(false);
                window.dispatchEvent(new CustomEvent("pochi-active", { detail: { active: false } }));
              } else if (state === "listening" && queryBufferRef.current) {
                askPochiBackend(queryBufferRef.current);
              }
            }}
          >
            <SiriSphere
              size={96}
              isSpeaking={state === "speaking"}
              isListening={state === "listening"}
            />
          </Box>
        </Box>
      </Fade>

      {/* ── INTERACTIVE 3D VIEWER MODAL ── */}
      <Pochi3DViewerModal
        open={show3dModal}
        onClose={() => setShow3dModal(false)}
        modelData={model3dData}
      />
    </>
  );
}
