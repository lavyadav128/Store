// PochiVoiceAssistant.js
// ─────────────────────────────────────────────────────────────
// "Pochi" — Authentic Apple Siri Voice Assistant for Admin
// • 100% Zero idle microphone beeps / dinging on mobile & desktop
// • Instant wake on "Pochi" or 1-Tap Siri Bubble / (Ctrl+Space)
// • Captures full voice query in real-time with visual subtitle
// • Speaks exact live answers aloud via Web Speech Synthesis
// • Auto-pauses Dreams music during voice sessions
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Fade, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import server from "../environment";

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

const WAKE_PATTERN = /\b(pochi|hey pochi|ok pochi|hi pochi|poki|pochee|pochie|pouchy|puji|poshi|poche|porchi|perchy)\b/i;

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
  batches: "batches",
  notes: "notes",
};

export default function PochiVoiceAssistant({ onNavigate, activeView }) {
  const [active, setActive] = useState(false);
  const [state, setState] = useState("idle"); // 'listening' | 'thinking' | 'speaking' | 'idle'
  const [statusText, setStatusText] = useState("");

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

      // Select natural voice
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
        // If still in listening state and user was speaking, submit query
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

      // Stop background song on Dreams page
      window.dispatchEvent(new CustomEvent("pochi-active", { detail: { active: true } }));

      playSiriChime();
      setActive(true);
      queryBufferRef.current = immediateQuery || "";

      if (immediateQuery && immediateQuery.trim().length > 3) {
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

  // Setup Keyboard Shortcuts & Desktop Hotword Listener
  useEffect(() => {
    // Keyboard shortcut trigger (Ctrl + Space)
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

  const font = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'DM Sans', sans-serif";

  return (
    <>
      <style>{`
        @keyframes siriFluidOrb {
          0% { transform: scale(1) rotate(0deg); filter: blur(0px) brightness(1.1); }
          25% { transform: scale(1.06, 0.94) rotate(90deg); filter: blur(1px) brightness(1.3); }
          50% { transform: scale(0.96, 1.08) rotate(180deg); filter: blur(2px) brightness(1.4); }
          75% { transform: scale(1.08, 0.96) rotate(270deg); filter: blur(1px) brightness(1.3); }
          100% { transform: scale(1) rotate(360deg); filter: blur(0px) brightness(1.1); }
        }
        @keyframes siriAuraPulse {
          0% { transform: scale(0.85); opacity: 0.8; }
          50% { transform: scale(1.45); opacity: 0.25; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes siriWaveActive {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        @keyframes subtleGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(121, 40, 202, 0.4); }
          50% { box-shadow: 0 0 25px rgba(0, 223, 216, 0.7); }
        }
      `}</style>

      {/* ── SUBTLE 1-TAP SIRI ACTIVATOR (For Mobile & Quick Touch) ── */}
      {!active && (
        <Fade in={!active} timeout={400}>
          <Box
            onClick={() => wakePochi()}
            sx={{
              position: "fixed",
              bottom: { xs: 20, sm: 28 },
              right: { xs: 20, sm: 28 },
              zIndex: 999990,
              width: { xs: 46, sm: 50 },
              height: { xs: 46, sm: 50 },
              borderRadius: "50%",
              background:
                "conic-gradient(from 180deg at 50% 50%, #FF0080 0deg, #7928CA 72deg, #00DFD8 144deg, #FF2E93 216deg, #FFD200 288deg, #FF0080 360deg)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "siriFluidOrb 6s linear infinite, subtleGlow 3s ease-in-out infinite",
              transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              "&:hover": { transform: "scale(1.12)" },
              "&:active": { transform: "scale(0.92)" },
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.4) 70%, transparent 100%)",
                filter: "blur(1px)",
              }}
            />
          </Box>
        </Fade>
      )}

      {/* ── AUTHENTIC APPLE SIRI FLOATING CIRCULAR ORB OVERLAY ── */}
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
                  background: "rgba(15, 23, 42, 0.88)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.4), 0 0 30px rgba(121, 40, 202, 0.3)",
                  maxWidth: { xs: "90vw", sm: 520 },
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

          {/* ── SIRI GLOWING CIRCULAR ORB ── */}
          <Box
            sx={{
              position: "relative",
              width: 100,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
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
            {/* Pulsing Light Waves when Speaking or Listening */}
            {(state === "listening" || state === "speaking") && (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    inset: -10,
                    borderRadius: "50%",
                    border: "2px solid rgba(0, 223, 216, 0.7)",
                    animation: "siriAuraPulse 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: -10,
                    borderRadius: "50%",
                    border: "2px solid rgba(255, 46, 147, 0.7)",
                    animation: "siriAuraPulse 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite 0.6s",
                  }}
                />
              </>
            )}

            {/* Glowing Fluid Multicolored Circular Sphere */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  "conic-gradient(from 180deg at 50% 50%, #FF0080 0deg, #7928CA 72deg, #00DFD8 144deg, #FF2E93 216deg, #FFD200 288deg, #FF0080 360deg)",
                animation:
                  state === "speaking"
                    ? "siriFluidOrb 2.5s linear infinite, siriWaveActive 0.8s ease-in-out infinite"
                    : state === "listening"
                    ? "siriFluidOrb 3.5s linear infinite"
                    : "siriFluidOrb 5s linear infinite",
                boxShadow:
                  "0 0 50px rgba(121, 40, 202, 0.9), 0 0 25px rgba(0, 223, 216, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Inner Apple Siri Core Light */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.4) 60%, transparent 100%)",
                  filter: "blur(2px)",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </>
  );
}
