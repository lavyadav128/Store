// dash/src/features/analytics/TelcoMentorChatWidget.js
// Step-Aware AI Mentor exclusively for the Telco Customer Intelligence System page (Steps 0-9)

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
    "Why is TotalCharges stored as object dtype?",
    "Walk through customer 9237-HQITU across all 21 columns",
    "Why must we drop customerID before ML training?",
  ],
  1: [
    "How does load_raw_dataset() handle missing files offline?",
    "What validation checks run on downloaded mirror CSVs?",
    "Does Pipeline 1 perform any data cleaning or scaling?",
  ],
  2: [
    "Explain Pearson correlation with example & how this project implements it",
    "Difference between p-value and Cramér's V for Contract?",
    "How do EDA and Preprocessing handle blank TotalCharges differently?",
  ],
  3: [
    "Transform customer 9237-HQITU step-by-step from 21 to 38 features",
    "Why use drop_first=True in One-Hot Encoding?",
    "Explain the fit_transform data leakage issue in this project",
  ],
  4: [
    "How did the Soft Voting Ensemble hit 0.8496 ROC-AUC?",
    "Break down the Confusion Matrix [[940,95],[180,194]] with math",
    "Explain 5-Fold StratifiedKFold CV inside classification.py",
  ],
  5: [
    "Why did tuning threshold from 0.50 to 0.15 add +$30,660 net profit?",
    "Are local risk weights (+32%, +24%) mathematically real SHAP values?",
    "Explain Bias-Variance curve at depth 6 vs depth 20",
  ],
  6: [
    "Explain K-Means centroid clustering & the Elbow Curve",
    "What is the raw_df.iloc[:len(X_train)] index mismatch bug?",
    "How does 38D → 3D PCA compress customer variance?",
  ],
  7: [
    "Why did Degree-2 Polynomial Regression jump R² to 0.9991?",
    "How did Lasso(alpha=1.0) zero 10 features while Ridge kept all?",
    "Why is TotalCharges not true future 12-month CLV?",
  ],
  8: [
    "Explain Q-Learning Bellman update & all 12 MDP states",
    "How does Genetic Algorithm evolve optimal Random Forest genes?",
    "Explain Scratch PCA Σ·v₁ = λ₁·v₁ & Curse of Dimensionality",
  ],
  9: [
    "Give me a crisp 90-second interview summary of all 8 pipelines",
    "What are the 4 biggest code critiques to mention honestly in interviews?",
  ],
};

// Format inline markdown (**bold**, `code`, *italic*) into React elements
function renderInlineTokens(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;
  let k = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
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

// Render Markdown blocks (fenced code, tables, headings, bullets, blockquotes)
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

        // Process non-code blocks line by line, grouping markdown tables
        const lines = seg.split("\n");
        const elements = [];
        let i = 0;
        while (i < lines.length) {
          const line = lines[i];

          // Detect Markdown Table
          if (line.trim().startsWith("|") && i + 1 < lines.length && /^\|\s*[-:]+/.test(lines[i + 1].trim())) {
            const headers = line.split("|").map((c) => c.trim()).filter(Boolean);
            i += 2; // skip header & separator line
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
              <Typography key={`h-${sIdx}-${i}`} sx={{ fontWeight: 800, fontSize: line.startsWith("## ") ? 14 : 13, color: "#1e1b4b", mt: 1.2, mb: 0.4 }}>
                {renderInlineTokens(line.replace(/^#{2,3}\s+/, ""))}
              </Typography>
            );
          } else if (line.trim() === "---") {
            elements.push(<Box key={`hr-${sIdx}-${i}`} sx={{ borderTop: "1px solid #e2e8f0", my: 1 }} />);
          } else if (line.trim().startsWith("> ")) {
            elements.push(
              <Box key={`bq-${sIdx}-${i}`} sx={{ pl: 1.2, borderLeft: "3px solid #0284c7", background: "#f0f9ff", py: 0.5, my: 0.6, borderRadius: "0 6px 6px 0", fontSize: 12 }}>
                {renderInlineTokens(line.trim().slice(2))}
              </Box>
            );
          } else if (/^\s*[-*•]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
            elements.push(
              <Box key={`li-${sIdx}-${i}`} sx={{ pl: 1, my: 0.3, display: "flex", gap: 0.6 }}>
                <span style={{ color: "#0284c7", fontWeight: 800 }}>•</span>
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

const TelcoMentorChatWidget = ({ activeStep, stepLabel, open, setOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "### 👋 Hi! I am your Dedicated AI Project Mentor!\nI have **100% indexed knowledge of all 10 Stages (Steps 0–9)** of your `AI-Powered-Customer-Intelligence-System` codebase — AND I can see whichever step tab you are currently studying!\n\nAsk me anything! For example: *\"Explain Pearson correlation with an example and how this project implements it\"* or *\"Walk me through customer 9237-HQITU step by step\"*.",
      meta: "Synced to All 10 Stages",
    },
  ]);

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
      const res = await axios.post(`${server}/api/analytics/telco-mentor`, {
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
          content: "Sorry, could not reach the AI Mentor endpoint right now. Please make sure the backend server is running and try again!",
          meta: "Connection Warning",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = STEP_QUICK_PROMPTS[activeStep] || STEP_QUICK_PROMPTS[0];

  // Floating Pill Button when closed
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
          background: "linear-gradient(135deg, #0284c7 0%, #1e1b4b 100%)",
          boxShadow: "0 8px 25px rgba(2,132,199,0.4)",
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 30px rgba(2,132,199,0.5)" },
          transition: "all 0.2s ease",
        }}
      >
        Ask Project AI Mentor (On: {stepLabel})
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
      {/* Header */}
      <Box sx={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", color: "#fff", px: 2, py: 1.4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 13.5, display: "flex", alignItems: "center", gap: 0.8 }}>
            <SmartToyIcon sx={{ fontSize: 18, color: "#38bdf8" }} /> Telco AI Project Mentor (A–Z)
          </Typography>
          <Typography sx={{ fontSize: 10.5, color: "#38bdf8", fontWeight: 700, mt: 0.2 }}>
            📍 Aware of Current Tab: {stepLabel} (All 10 Steps Indexed)
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

      {/* Dynamic Step-Aware Quick Prompts Strip */}
      <Box sx={{ px: 1.5, py: 1, background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 0.8, overflowX: "auto", flexShrink: 0 }}>
        <AutoAwesomeIcon sx={{ fontSize: 15, color: "#0284c7", mt: 0.5, flexShrink: 0 }} />
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
              background: "#eff6ff",
              color: "#1e40af",
              border: "1px solid #bfdbfe",
              flexShrink: 0,
              "&:hover": { background: "#dbeafe" },
            }}
          />
        ))}
      </Box>

      {/* Scrollable Message Stream */}
      <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: 2, background: "#ffffff", display: "flex", flexDirection: "column", gap: 1.5 }}>
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <Box key={idx} sx={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: isUser ? "82%" : "96%" }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  background: isUser ? "linear-gradient(135deg, #0284c7 0%, #1e40af 100%)" : "#f8fafc",
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
          <Box sx={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 1, p: 1.2, background: "#f1f5f9", borderRadius: "12px" }}>
            <CircularProgress size={14} sx={{ color: "#0284c7" }} />
            <Typography sx={{ fontSize: 11.5, color: "#475569", fontWeight: 600 }}>
              Analyzing {stepLabel} & preparing worked example...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 1.5, borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", gap: 1, alignItems: "flex-end" }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          size="small"
          placeholder={`Ask anything about ${stepLabel} or any of the 10 steps...`}
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
          color="primary"
          disabled={!input.trim() || loading}
          onClick={() => sendMessage()}
          sx={{
            background: "#0284c7",
            color: "#fff",
            borderRadius: "10px",
            width: 40,
            height: 40,
            "&:hover": { background: "#0369a1" },
            "&.Mui-disabled": { background: "#cbd5e1", color: "#fff" },
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default TelcoMentorChatWidget;
