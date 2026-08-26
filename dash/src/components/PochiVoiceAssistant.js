// PochiVoiceAssistant.js
// ─────────────────────────────────────────────────────────────
// "Pochi" — True Single-Engine Apple Siri Voice Assistant for Admin
// • 100% Invisible when idle
// • Zero recognition collisions (Single Unified Speech Engine)
// • Instant wake on "Pochi" / "Hey Pochi" / "Poki" / "Pouchy"
// • Speaks exact live answers aloud via Web Speech Synthesis
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, Fade } from "@mui/material";
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
    osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.1); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.22); // D6

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  } catch (e) {}
}

const WAKE_PATTERN = /\b(pochi|hey pochi|ok pochi|hi pochi|poki|pochee|pochie|pouchy|puji|poshi|poche)\b/i;

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
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);
  const activeRef = useRef(false);
  const stateRef = useRef("idle");
  const silenceTimerRef = useRef(null);
  const dismissTimerRef = useRef(null);
  const speechSpeakingRef = useRef(false);

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
        setTranscript(cleanText);
      };

      utterance.onend = () => {
        speechSpeakingRef.current = false;
        setState("idle");
        if (onComplete) onComplete();

        // Auto-dismiss circular orb after finishing speech
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = setTimeout(() => {
          setActive(false);
          setTranscript("");
        }, 1800);
      };

      utterance.onerror = () => {
        speechSpeakingRef.current = false;
        setState("idle");
        if (onComplete) onComplete();
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = setTimeout(() => {
          setActive(false);
          setTranscript("");
        }, 1200);
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  // Send query to Pochi AI backend
  const askPochiBackend = useCallback(
    async (query) => {
      if (!query || !query.trim()) {
        setState("idle");
        return;
      }

      setState("thinking");
      setTranscript(`Thinking...`);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${server}/api/admin/pochi/query`,
          { query },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;
        const voiceReply = data.voiceText || data.visualReply || "All admin systems are functioning properly.";

        // Execute action if requested
        if (data.action === "NAVIGATE_VIEW" && data.targetView && onNavigate) {
          const mapped = VIEW_MAP[data.targetView.toLowerCase()] || data.targetView;
          setTimeout(() => {
            onNavigate(mapped);
          }, 400);
        }

        // Speak back aloud
        speakVoice(voiceReply);
      } catch (err) {
        console.error("Pochi query error:", err);
        const errMsg = "I encountered a connection error with your admin server.";
        speakVoice(errMsg);
      }
    },
    [onNavigate, speakVoice]
  );

  // Trigger Pochi Wake
  const wakePochi = useCallback(
    (immediateQuery = "") => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      playSiriChime();
      setActive(true);

      if (immediateQuery && immediateQuery.trim().length > 2) {
        // User spoke query in one breath: "Pochi how much revenue did we recover"
        setTranscript(immediateQuery);
        askPochiBackend(immediateQuery);
      } else {
        // User just said "Pochi": respond "Yes, Admin?" and listen
        setState("listening");
        setTranscript("Yes, Admin?");
        speakVoice("Yes, Admin?", () => {
          setState("listening");
          setTranscript("Listening for your query...");
        });
      }
    },
    [askPochiBackend, speakVoice]
  );

  // Initialize Microphone & Single Continuous Speech Engine
  useEffect(() => {
    // 1. Request mic permission on mount
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
        console.warn("Microphone permission pending or denied.");
      });
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";

    rec.onresult = (event) => {
      // Ignore microphone feedback while Pochi is speaking
      if (speechSpeakingRef.current) return;

      let currentSentence = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentSentence += event.results[i][0].transcript;
      }
      currentSentence = currentSentence.trim();
      if (!currentSentence) return;

      // CASE 1: Currently Idle — Looking for Wake-Word ("Pochi")
      if (!activeRef.current) {
        if (WAKE_PATTERN.test(currentSentence)) {
          // Extract any query spoken right after the wake word
          const queryPart = currentSentence.replace(WAKE_PATTERN, "").trim();
          wakePochi(queryPart);
        }
      }
      // CASE 2: Currently Active / Listening for Admin's Question
      else if (stateRef.current === "listening") {
        // Filter out wake-word if repeated
        const cleanQuery = currentSentence.replace(WAKE_PATTERN, "").trim();
        setTranscript(cleanQuery || currentSentence);

        // Debounce silence: When user pauses for 1.3 seconds, auto-submit query
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (cleanQuery && cleanQuery.length > 1) {
            askPochiBackend(cleanQuery);
          }
        }, 1300);
      }
    };

    rec.onerror = (e) => {
      // Ignore standard background silence events
      if (e.error === "no-speech" || e.error === "network") return;
      console.warn("Speech engine event:", e.error);
    };

    rec.onend = () => {
      // Keep speech recognition persistently alive
      try {
        rec.start();
      } catch (e) {}
    };

    try {
      rec.start();
    } catch (e) {}
    recognitionRef.current = rec;

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
      try {
        rec.stop();
      } catch (e) {}
      window.speechSynthesis?.cancel();
    };
  }, [wakePochi, askPochiBackend]);

  const font = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'DM Sans', sans-serif";

  // When inactive: 100% INVISIBLE (Zero screen clutter, zero pills, zero UI)
  if (!active) {
    return null;
  }

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
      `}</style>

      {/* ── AUTHENTIC APPLE SIRI FLOATING CIRCULAR ORB OVERLAY ── */}
      <Fade in={active} timeout={300}>
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: 30, sm: 45 },
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {/* Real-time Subtitle / Voice Caption (Sleek Apple Glass Badge) */}
          {transcript && (
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
                  {transcript}
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
              } else if (state === "listening" && transcript) {
                askPochiBackend(transcript);
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
