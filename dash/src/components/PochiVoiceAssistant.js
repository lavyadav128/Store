// PochiVoiceAssistant.js
// ─────────────────────────────────────────────────────────────
// "Pochi" — Apple Siri-Style Voice & AI Assistant for Admin Panel
// Features:
// 1. Background Wake-Word Detection ("Pochi", "Hey Pochi")
// 2. Multi-color Glowing Siri-style Circular Orb / Floating HUD
// 3. Browser Web Speech Synthesis & Recognition
// 4. Omniscient Admin Knowledge & Automated Voice Navigation
// 5. Native Web Audio Chime Synthesis (Zero asset dependencies)
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Fade,
  Grow,
  Paper,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import axios from "axios";
import server from "../environment";

// Native Web Audio Synth Chime for Siri-like trigger sound
function playPochiChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.12); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

// Markdown parser for Pochi HUD
function renderPochiMarkdown(text = "") {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/`([^`]+)`/g, "<code style='background:rgba(255,255,255,0.12);padding:2px 6px;border-radius:6px;font-size:12px;'>$1</code>");
  // Headers
  html = html.replace(/^### (.+)$/gm, "<h4 style='margin:8px 0 4px;color:#fff;font-weight:700;font-size:14px;'>$1</h4>");
  html = html.replace(/^## (.+)$/gm, "<h3 style='margin:10px 0 6px;color:#fff;font-weight:800;font-size:16px;'>$1</h3>");
  // Lists
  html = html.replace(/^[-*•] (.+)$/gm, "<li style='margin:3px 0 3px 16px;color:#e2e8f0;font-size:13px;'>$1</li>");
  // Paragraph breaks
  html = html.replace(/\n/g, "<br/>");
  return html;
}

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
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [pochiResponse, setPochiResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const hotwordRecRef = useRef(null);
  const activeRef = useRef(active);
  const thinkingRef = useRef(thinking);
  const speakingRef = useRef(speaking);

  activeRef.current = active;
  thinkingRef.current = thinking;
  speakingRef.current = speaking;

  // Speak with Web Speech Synthesis
  const speakVoice = useCallback(
    (text) => {
      if (voiceMuted || !("speechSynthesis" in window) || !text) return;
      window.speechSynthesis.cancel();

      const cleanText = text.replace(/[*_#`]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Select high-quality natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice =
        voices.find((v) => v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Rishi")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];

      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = 1.05;
      utterance.pitch = 1.05;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [voiceMuted]
  );

  // Ask Pochi backend brain
  const submitToPochi = useCallback(
    async (userQuery) => {
      if (!userQuery || userQuery.trim().length === 0) return;
      setThinking(true);
      setLastQuery(userQuery);
      setTranscript("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${server}/api/admin/pochi/query`,
          { query: userQuery, history },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;
        setPochiResponse(data);
        setHistory((prev) => [
          ...prev.slice(-4),
          { role: "user", content: userQuery },
          { role: "assistant", content: data.visualReply || data.voiceText },
        ]);

        // Voice output
        if (data.voiceText) {
          speakVoice(data.voiceText);
        }

        // Voice Action Navigation
        if (data.action === "NAVIGATE_VIEW" && data.targetView && onNavigate) {
          const mapped = VIEW_MAP[data.targetView.toLowerCase()] || data.targetView;
          setTimeout(() => {
            onNavigate(mapped);
          }, 600);
        }
      } catch (err) {
        console.error("Pochi query error:", err);
        const errMsg = "Sorry Admin, I could not complete that request right now.";
        setPochiResponse({
          voiceText: errMsg,
          visualReply: "❌ Could not reach the Admin intelligence backend. Please verify your connection.",
        });
        speakVoice(errMsg);
      } finally {
        setThinking(false);
      }
    },
    [history, onNavigate, speakVoice]
  );

  // Trigger Pochi Wake
  const activatePochi = useCallback(
    (greeting = "Yes, Admin?") => {
      playPochiChime();
      setActive(true);
      setTranscript("");
      speakVoice(greeting);

      // Start capturing query speech
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    },
    [speakVoice]
  );

  // Dismiss Pochi
  const dismissPochi = useCallback(() => {
    setActive(false);
    setListening(false);
    setSpeaking(false);
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, []);

  // Setup Continuous Wake-Word ("Pochi") Listener
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    // 1. Hotword Background Listener
    const hotwordRec = new SpeechRecognition();
    hotwordRec.continuous = true;
    hotwordRec.interimResults = true;
    hotwordRec.lang = "en-US";

    hotwordRec.onresult = (event) => {
      if (activeRef.current || thinkingRef.current || speakingRef.current) return;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript.toLowerCase();
        if (/\b(pochi|hey pochi|ok pochi|hi pochi|pochee|poki)\b/i.test(text)) {
          activatePochi("Yes, how can I help you?");
          break;
        }
      }
    };

    hotwordRec.onerror = () => {};
    hotwordRec.onend = () => {
      // Auto-restart hotword background listening
      if (!activeRef.current) {
        try {
          hotwordRec.start();
        } catch (e) {}
      }
    };

    try {
      hotwordRec.start();
    } catch (e) {}
    hotwordRecRef.current = hotwordRec;

    // 2. Query Speech Recognition (when Pochi is active)
    const queryRec = new SpeechRecognition();
    queryRec.continuous = false;
    queryRec.interimResults = true;
    queryRec.lang = "en-IN";

    queryRec.onstart = () => setListening(true);
    queryRec.onresult = (event) => {
      let currentText = "";
      for (let i = 0; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }
      setTranscript(currentText);

      // Check for close voice commands
      if (/\b(close|dismiss|bye|stop listening|thank you)\b/i.test(currentText)) {
        dismissPochi();
      }
    };

    queryRec.onend = () => {
      setListening(false);
      // If user finished speaking a query, auto-submit
      setTranscript((finalTranscript) => {
        if (finalTranscript && finalTranscript.trim().length > 1 && !/\b(close|dismiss|bye)\b/i.test(finalTranscript)) {
          submitToPochi(finalTranscript);
        }
        return finalTranscript;
      });

      // Resume hotword listening if closed
      setTimeout(() => {
        if (!activeRef.current && hotwordRecRef.current) {
          try {
            hotwordRecRef.current.start();
          } catch (e) {}
        }
      }, 500);
    };

    queryRec.onerror = () => setListening(false);
    recognitionRef.current = queryRec;

    // Keyboard shortcut (Ctrl + Space / Cmd + Space)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        if (activeRef.current) {
          dismissPochi();
        } else {
          activatePochi("Yes?");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      try {
        hotwordRec.stop();
      } catch (e) {}
      try {
        queryRec.stop();
      } catch (e) {}
      window.speechSynthesis?.cancel();
    };
  }, [activatePochi, dismissPochi, submitToPochi]);

  const font = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  return (
    <>
      <style>{`
        @keyframes siriOrbGlow {
          0% { transform: scale(1) rotate(0deg); filter: blur(0px) brightness(1.1); }
          50% { transform: scale(1.08) rotate(180deg); filter: blur(2px) brightness(1.35); }
          100% { transform: scale(1) rotate(360deg); filter: blur(0px) brightness(1.1); }
        }
        @keyframes siriPulseRing {
          0% { transform: scale(0.9); opacity: 0.9; }
          50% { transform: scale(1.35); opacity: 0.25; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes waveBar {
          0%, 100% { height: 6px; }
          50% { height: 28px; }
        }
      `}</style>

      {/* ── PERSISTENT SUBTLE TRIGGER PILL (Bottom Left Stealth Mode) ── */}
      {!active && (
        <Fade in timeout={600}>
          <Box
            onClick={() => activatePochi("Yes, Admin?")}
            sx={{
              position: "fixed",
              bottom: 24,
              left: 24,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              px: 2,
              py: 1,
              borderRadius: "30px",
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              "&:hover": {
                transform: "translateY(-3px) scale(1.03)",
                boxShadow: "0 16px 44px rgba(99, 102, 241, 0.35)",
                borderColor: "rgba(168, 85, 247, 0.4)",
              },
            }}
          >
            {/* Glowing Mini Siri Orb */}
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "conic-gradient(from 180deg, #FF2E93, #7928CA, #00DFD8, #FF0080, #FF2E93)",
                animation: "siriOrbGlow 6s linear infinite",
                boxShadow: "0 0 12px rgba(121, 40, 202, 0.7)",
              }}
            />
            <Typography sx={{ fontFamily: font, fontSize: 12.5, fontWeight: 700, color: "#fff", letterSpacing: "0.2px" }}>
              Pochi Voice AI
            </Typography>
            <Chip
              size="small"
              label="Say 'Pochi' or Ctrl+Space"
              sx={{
                height: 18,
                fontSize: 9.5,
                fontWeight: 700,
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#cbd5e1",
                borderRadius: "6px",
              }}
            />
          </Box>
        </Fade>
      )}

      {/* ── EXPANDED SIRI-STYLE VOICE HUD ── */}
      {active && (
        <Fade in timeout={300}>
          <Box
            sx={{
              position: "fixed",
              bottom: { xs: 16, sm: 28 },
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10000,
              width: { xs: "92%", sm: 540 },
              maxWidth: "100%",
            }}
          >
            <Paper
              elevation={24}
              sx={{
                background: "rgba(10, 15, 29, 0.92)",
                backdropFilter: "blur(28px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "28px",
                p: { xs: 2.5, sm: 3 },
                boxShadow: "0 32px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(121, 40, 202, 0.25)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top Bar */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "conic-gradient(#FF2E93, #7928CA, #00DFD8, #FF2E93)",
                      animation: "siriOrbGlow 4s linear infinite",
                    }}
                  />
                  <Typography sx={{ fontFamily: font, fontWeight: 800, fontSize: 13, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>
                    Pochi Admin Voice
                  </Typography>
                  {thinking && (
                    <Chip size="small" label="Thinking..." sx={{ height: 18, fontSize: 10, bgcolor: "rgba(168,85,247,0.25)", color: "#e9d5ff", fontWeight: 700 }} />
                  )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <IconButton size="small" onClick={() => setVoiceMuted(!voiceMuted)} sx={{ color: voiceMuted ? "#f43f5e" : "#94a3b8" }}>
                    {voiceMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" onClick={dismissPochi} sx={{ color: "#94a3b8", "&:hover": { color: "#fff" } }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* ── SIRI GLOWING CIRCULAR ORB ANIMATION ── */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 2 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (!listening && recognitionRef.current) {
                      try {
                        recognitionRef.current.start();
                      } catch (e) {}
                    }
                  }}
                >
                  {/* Outer Pulsing Wave Rings */}
                  {(listening || speaking) && (
                    <>
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          border: "2px solid rgba(0, 223, 216, 0.6)",
                          animation: "siriPulseRing 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          border: "2px solid rgba(255, 46, 147, 0.6)",
                          animation: "siriPulseRing 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite 0.6s",
                        }}
                      />
                    </>
                  )}

                  {/* Core Glowing Multicolored Siri Sphere */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "conic-gradient(from 180deg at 50% 50%, #FF0080 0deg, #7928CA 90deg, #00DFD8 180deg, #FF2E93 270deg, #FF0080 360deg)",
                      animation: "siriOrbGlow 4s linear infinite",
                      boxShadow: "0 0 32px rgba(121, 40, 202, 0.8), inset 0 0 16px rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {thinking ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      <MicIcon sx={{ color: "#fff", fontSize: 24, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />
                    )}
                  </Box>
                </Box>

                {/* Real-Time Audio Transcription or Listening Status */}
                <Typography
                  sx={{
                    fontFamily: font,
                    fontSize: 14,
                    color: listening ? "#38bdf8" : "#94a3b8",
                    fontWeight: 600,
                    mt: 1.5,
                    textAlign: "center",
                    minHeight: 22,
                  }}
                >
                  {transcript
                    ? `“${transcript}”`
                    : listening
                    ? "Listening for your query... (Speak now)"
                    : speaking
                    ? "Pochi is speaking..."
                    : "Tap mic or speak your command"}
                </Typography>
              </Box>

              {/* ── RESPONSE HUD CARD ── */}
              {pochiResponse && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: "18px",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    maxHeight: 240,
                    overflowY: "auto",
                  }}
                >
                  {lastQuery && (
                    <Typography sx={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: "#a855f7", mb: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Query: {lastQuery}
                    </Typography>
                  )}
                  <Box
                    sx={{ fontFamily: font, color: "#f8fafc", lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: renderPochiMarkdown(pochiResponse.visualReply || pochiResponse.voiceText) }}
                  />
                </Box>
              )}

              {/* Quick Action Suggestions */}
              <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  "Take me to Revenue Recovery",
                  "Show Instagram Agent",
                  "Client project status",
                  "How much revenue recovered?",
                ].map((q) => (
                  <Chip
                    key={q}
                    size="small"
                    label={q}
                    onClick={() => submitToPochi(q)}
                    sx={{
                      fontSize: 11,
                      fontFamily: font,
                      fontWeight: 600,
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                      borderColor: "rgba(255,255,255,0.12)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        </Fade>
      )}
    </>
  );
}
