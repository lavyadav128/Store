// dash/src/features/analytics/FloodMentorChatWidget.js
// Step-Aware AI Mentor exclusively for Flood Assist AI (project-main) Stages 0-9

import React, { useState, useRef, useEffect } from "react";
import {
  Box, Typography, IconButton, TextField, Chip, Paper, CircularProgress,
  Button, Tooltip
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import axios from "axios";
import server from "../../shared/environment";

const STEP_QUICK_PROMPTS = {
  0: [
    "Why use a 316,616-point CFD dataset instead of dummy flood data?",
    "Explain what (x, y, z) and (V, Vx, Vy, Vz) mean physically",
    "Why is cellnumber sliced away by parts[1:8]?",
  ],
  1: [
    "How does parse_scenario() extract parameters from filenames?",
    "Explain the underscore bug in '1.5_3_30_20%'!",
    "How does train_model.py read both space & CSV scientific notation?",
  ],
  2: [
    "What is the Hydraulic Jump Surge Zone around x = 6.5m to 8.5m?",
    "Why is velocity higher at y=0.03m vs y=0.30m in 1_3_60?",
    "Explain the 25 streamwise slices in model_metadata.json",
  ],
  3: [
    "Explain how cKDTree k=4 Inverse Distance Weighting predicts velocity + formula",
    "Why did R² hit 0.98853 across 316,616 points?",
    "Explain the critique about x/y/z velocity metrics inside train_model.py",
  ],
  4: [
    "Why convert 316,616 points into an 80×30 predictor_grid.json?",
    "Difference between Python bilinear interpolation & Node.js Math.round() lookup",
    "How does distanceKm map onto [-6.25m, +12.00m]?",
  ],
  5: [
    "Walk through Wave Celerity c = √(g·h) + 1.2·V and Manning Q^0.4",
    "Calculate arrival time & DEFRA Hazard for 5km + 50mm rain",
    "Explain the 4 DEFRA Hazard thresholds (<0.75, 1.25, 2.0)",
  ],
  6: [
    "How does getRegionalFloodProfile() match all 36 States + custom rivers?",
    "Walk through what happens if a user types 'Patna near Kosi'",
    "Explain official helplines & fallback catchment logic",
  ],
  7: [
    "Trace POST /api/chat from user question to live ML prompt injection",
    "Why MUST dotenv.config() run inside llm.js in ES Modules?",
    "Explain detectPredictionIntent() regex edge cases in server.js",
  ],
  8: [
    "How does Web Speech API voice input work across 8 Indian languages?",
    "How does ChatWindow.jsx render typewriter streaming & prediction cards?",
    "Explain localStorage persistence inside App.jsx",
  ],
  9: [
    "Give me a 2-minute technical interview pitch of Flood Assist AI",
    "What 4 limitations should I honestly highlight in an interview?",
  ],
};

function renderInlineTokens(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;
  let k = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(<strong key={k++} style={{ color: "#0f172a" }}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={k++}
          style={{
            background: "#e2e8f0",
            color: "#0f172a",
            padding: "1px 5px",
            borderRadius: "4px",
            fontFamily: "'Fira Code', monospace",
            fontSize: "0.9em",
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(<em key={k++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function MentorMessageContent({ content }) {
  const segments = String(content || "").split(/(```[\s\S]*?```)/g);
  return (
    <Box sx={{ fontSize: 12.5, color: "#1e293b", lineHeight: 1.6 }}>
      {segments.map((seg, sIdx) => {
        if (seg.startsWith("```") && seg.endsWith("```")) {
          const inner = seg.slice(3, -3).replace(/^[a-zA-Z0-9_+-]*\n/, "");
          return (
            <Box
              key={sIdx}
              component="pre"
              sx={{
                my: 1,
                p: 1.5,
                borderRadius: "10px",
                background: "#0f172a",
                color: "#e2e8f0",
                fontFamily: "'Fira Code', monospace",
                fontSize: 11.2,
                overflowX: "auto",
                lineHeight: 1.5,
              }}
            >
              {inner.trim()}
            </Box>
          );
        }

        const lines = seg.split("\n");
        const elements = [];
        let i = 0;
        while (i < lines.length) {
          const line = lines[i];

          if (line.trim().startsWith("|") && i + 1 < lines.length && /^\|\s*[-:]+/.test(lines[i + 1].trim())) {
            const headers = line.split("|").map((c) => c.trim()).filter(Boolean);
            i += 2;
            const rows = [];
            while (i < lines.length && lines[i].trim().startsWith("|")) {
              const cells = lines[i].split("|").map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
              if (cells.length) rows.push(cells);
              i++;
            }
            elements.push(
              <Box key={`tbl-${sIdx}-${i}`} sx={{ my: 1, overflowX: "auto", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} style={{ padding: "6px 8px", borderBottom: "1px solid #cbd5e1", color: "#0f172a" }}>
                          {renderInlineTokens(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: "1px solid #f1f5f9", background: "#fff" }}>
                        {r.map((cell, cIdx) => (
                          <td key={cIdx} style={{ padding: "5px 8px", color: "#334155" }}>
                            {renderInlineTokens(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            );
            continue;
          }

          if (line.startsWith("## ") || line.startsWith("### ")) {
            elements.push(
              <Typography key={`h-${sIdx}-${i}`} sx={{ fontWeight: 800, fontSize: line.startsWith("## ") ? 14 : 13, color: "#0f766e", mt: 1.2, mb: 0.4 }}>
                {renderInlineTokens(line.replace(/^#{2,3}\s+/, ""))}
              </Typography>
            );
          } else if (line.trim() === "---") {
            elements.push(<Box key={`hr-${sIdx}-${i}`} sx={{ borderTop: "1px solid #e2e8f0", my: 1 }} />);
          } else if (line.trim().startsWith("> ")) {
            elements.push(
              <Box key={`bq-${sIdx}-${i}`} sx={{ pl: 1.2, borderLeft: "3px solid #0d9488", background: "#f0fdfa", py: 0.5, my: 0.6, borderRadius: "0 6px 6px 0", fontSize: 12 }}>
                {renderInlineTokens(line.trim().slice(2))}
              </Box>
            );
          } else if (/^\s*[-*•]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
            elements.push(
              <Box key={`li-${sIdx}-${i}`} sx={{ pl: 1, my: 0.3, display: "flex", gap: 0.6 }}>
                <span style={{ color: "#0d9488", fontWeight: 800 }}>•</span>
                <Box sx={{ flex: 1 }}>{renderInlineTokens(line.replace(/^\s*([-*•]|\d+\.)\s+/, ""))}</Box>
              </Box>
            );
          } else if (line.trim()) {
            elements.push(
              <Typography key={`p-${sIdx}-${i}`} sx={{ fontSize: 12.5, my: 0.35, color: "#1e293b" }}>
                {renderInlineTokens(line)}
              </Typography>
            );
          }
          i++;
        }
        return <React.Fragment key={sIdx}>{elements}</React.Fragment>;
      })}
    </Box>
  );
}

const FloodMentorChatWidget = ({ activeStep, stepLabel, open, setOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "### 🌊 Welcome to Your Flood Assist AI Mentor!\nI have **100% indexed knowledge of all 10 Stages (Steps 0–9)** of `Flood Assist AI` — from the **316,616-point CFD fluid simulation** & `cKDTree` IDW training (`R²=0.98853`), through `predictor_grid.json` quantization, open-channel wave physics, 36-State basins, Express/LLM routing, and the React UI.\n\nI automatically see whichever step tab you're currently on! Try asking me anything below.",
      meta: "Synced to All 10 Stages",
    },
  ]);

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  const sendMessage = async (textOverride) => {
    const query = (textOverride !== undefined ? textOverride : input).trim();
    if (!query || loading) return;

    const userMsg = { role: "user", content: query };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (textOverride === undefined) setInput("");
    setLoading(true);

    try {
      const historyPayload = nextMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await axios.post(`${server}/api/analytics/flood-mentor`, {
        message: query,
        currentStep: activeStep,
        history: historyPayload,
      });

      if (res.data?.success && res.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.reply,
            meta: `${res.data.detectedStep || stepLabel} • ${res.data.provider || "AI Mentor"}`,
          },
        ]);
      } else {
        throw new Error("Invalid mentor response");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Could not reach `/api/analytics/flood-mentor` right now. Please confirm the backend server is active!",
          meta: "Connection Warning",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = STEP_QUICK_PROMPTS[activeStep] || STEP_QUICK_PROMPTS[0];

  if (!open) {
    return (
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<SmartToyIcon />}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          borderRadius: "999px",
          px: 2.5,
          py: 1.2,
          textTransform: "none",
          fontWeight: 800,
          fontSize: 13,
          background: "linear-gradient(135deg, #0d9488 0%, #0f172a 100%)",
          boxShadow: "0 8px 25px rgba(13,148,136,0.4)",
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 30px rgba(13,148,136,0.5)" },
          transition: "all 0.2s ease",
        }}
      >
        Ask Flood AI Mentor (On: {stepLabel})
      </Button>
    );
  }

  return (
    <Paper
      elevation={12}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1350,
        width: expanded ? { xs: "95vw", md: 760 } : { xs: "94vw", sm: 440 },
        height: expanded ? "85vh" : { xs: "78vh", sm: 600 },
        borderRadius: "18px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid #cbd5e1",
        transition: "width 0.25s ease, height 0.25s ease",
      }}
    >
      <Box sx={{ background: "linear-gradient(135deg, #0f172a 0%, #115e59 100%)", color: "#fff", px: 2, py: 1.4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 13.5, display: "flex", alignItems: "center", gap: 0.8 }}>
            <SmartToyIcon sx={{ fontSize: 18, color: "#5eead4" }} /> Flood Assist AI Project Mentor (A–Z)
          </Typography>
          <Typography sx={{ fontSize: 10.5, color: "#5eead4", fontWeight: 700, mt: 0.2 }}>
            📍 Aware of Current Tab: {stepLabel} (All 10 Stages Indexed)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 0.4 }}>
          <Tooltip title="Clear Chat">
            <IconButton size="small" onClick={() => setMessages(messages.slice(0, 1))} sx={{ color: "#94a3b8", "&:hover": { color: "#fff" } }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={expanded ? "Compact View" : "Expand Workspace"}>
            <IconButton size="small" onClick={() => setExpanded((e) => !e)} sx={{ color: "#94a3b8", "&:hover": { color: "#fff" } }}>
              {expanded ? <CloseFullscreenIcon fontSize="small" /> : <OpenInFullIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Minimize">
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#94a3b8", "&:hover": { color: "#fff" } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ px: 1.5, py: 1, background: "#f0fdfa", borderBottom: "1px solid #ccfbf1", display: "flex", gap: 0.8, overflowX: "auto", flexShrink: 0 }}>
        <AutoAwesomeIcon sx={{ fontSize: 15, color: "#0d9488", mt: 0.5, flexShrink: 0 }} />
        {quickPrompts.map((qp, idx) => (
          <Chip
            key={idx}
            label={qp}
            size="small"
            onClick={() => sendMessage(qp)}
            sx={{
              fontSize: 10.5,
              fontWeight: 600,
              cursor: "pointer",
              background: "#ccfbf1",
              color: "#115e59",
              border: "1px solid #99f6e4",
              flexShrink: 0,
              "&:hover": { background: "#99f6e4" },
            }}
          />
        ))}
      </Box>

      <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: 2, background: "#ffffff", display: "flex", flexDirection: "column", gap: 1.5 }}>
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <Box key={idx} sx={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: isUser ? "82%" : "96%" }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  background: isUser ? "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" : "#f8fafc",
                  color: isUser ? "#fff" : "#0f172a",
                  border: isUser ? "none" : "1px solid #e2e8f0",
                }}
              >
                {isUser ? (
                  <Typography sx={{ fontSize: 12.8, fontWeight: 600 }}>{m.content}</Typography>
                ) : (
                  <MentorMessageContent content={m.content} />
                )}
              </Box>
              {m.meta && !isUser && (
                <Typography sx={{ fontSize: 9.8, color: "#94a3b8", mt: 0.3, ml: 0.5 }}>{m.meta}</Typography>
              )}
            </Box>
          );
        })}

        {loading && (
          <Box sx={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 1, p: 1.2, background: "#f0fdfa", borderRadius: "12px" }}>
            <CircularProgress size={14} sx={{ color: "#0d9488" }} />
            <Typography sx={{ fontSize: 11.5, color: "#115e59", fontWeight: 600 }}>
              Analyzing {stepLabel} & preparing hydrodynamic example...
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 1.5, borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", gap: 1, alignItems: "flex-end" }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          size="small"
          placeholder={`Ask anything about ${stepLabel} or any of the 10 stages...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          sx={{
            background: "#fff",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": { fontSize: 12.5, borderRadius: "10px" },
          }}
        />
        <IconButton
          disabled={!input.trim() || loading}
          onClick={() => sendMessage()}
          sx={{
            background: "#0d9488",
            color: "#fff",
            borderRadius: "10px",
            width: 40,
            height: 40,
            "&:hover": { background: "#0f766e" },
            "&.Mui-disabled": { background: "#cbd5e1", color: "#fff" },
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default FloodMentorChatWidget;
