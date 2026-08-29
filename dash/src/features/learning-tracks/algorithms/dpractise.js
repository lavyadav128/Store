import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import questionsData from "./ddata";

const PracticePage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const questions = questionsData[topicId] || [];

  const [currentQIndex, setCurrentQIndex] = useState(0);

  const [showBruteCode, setShowBruteCode] = useState(false);
  const [showOptimalCode, setShowOptimalCode] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const q = questions[currentQIndex];

  return (
    <Box
      sx={{
        py: { xs: 3, sm: 5 },
        px: { xs: 2, sm: 4, md: 8 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
        sx={{
          mb: 4,
          fontWeight: 600,
          fontSize: "0.8rem",
          backgroundColor: "#ffffff",
          border: "1.5px solid #d0d0d0",
          borderRadius: "8px",
          textTransform: "none",
          px: 2.5,
          py: 0.9,
          color: "#444",
          letterSpacing: "0.02em",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          "&:hover": {
            backgroundColor: "#f0f0f0",
            borderColor: "#b0b0b0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          },
        }}
      >
        Back
      </Button>

      {/* Page Title */}
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight={800}
        align="center"
        gutterBottom
        sx={{
          color: "#111",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: { xs: "1rem", sm: "1.25rem" },
          mb: 1,
        }}
      >
        {topicId.replace(/-/g, " ")}
      </Typography>

      {/* Thin accent line under title */}
      <Box
        sx={{
          width: 48,
          height: 3,
          backgroundColor: "#333",
          borderRadius: 2,
          mx: "auto",
          mb: 4,
        }}
      />

      {/* Question Navigation */}
      {questions.length > 0 && (
        <Box
          sx={{
            overflowX: "auto",
            py: 1.5,
            mb: 4,
            px: 1,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: "max-content",
              flexWrap: "nowrap",
            }}
          >
            {questions.map((_, index) => (
              <Button
                key={index}
                onClick={() => {
                  setCurrentQIndex(index);
                  setShowBruteCode(false);
                  setShowOptimalCode(false);
                }}
                sx={{
                  minWidth: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: "50%",
                  border: "2px solid #333",
                  backgroundColor: index === currentQIndex ? "#222" : "#ffffff",
                  color: index === currentQIndex ? "#fff" : "#333",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  boxShadow:
                    index === currentQIndex
                      ? "0 2px 8px rgba(0,0,0,0.18)"
                      : "none",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor:
                      index === currentQIndex ? "#111" : "#ebebeb",
                  },
                }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {q ? (
        <>
          {/* Question Number */}
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              color: "#888",
              letterSpacing: "0.12em",
              display: "block",
              mb: 0.5,
            }}
          >
            Question {currentQIndex + 1} of {questions.length}
          </Typography>

          {/* Question Box */}
          <Box
            mt={0.5}
            p={{ xs: 2.5, sm: 3 }}
            sx={{
              borderRadius: "12px",
              bgcolor: "#ffffff",
              border: "1.5px solid #e0e0e0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              whiteSpace="pre-line"
              sx={{
                fontSize: isMobile ? "1rem" : "1.08rem",
                lineHeight: 1.75,
                color: "#0a0a0a",
                fontWeight: 700,
                letterSpacing: "0.01em",
              }}
            >
              {q.title}
            </Typography>
          </Box>

          {/* Brute Force Section */}
          <Box
            mt={3}
            p={{ xs: 2.5, sm: 3 }}
            sx={{
              borderRadius: "12px",
              bgcolor: "#ffffff",
              border: "1.5px solid #e0e0e0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 4,
                  height: 22,
                  borderRadius: 2,
                  backgroundColor: "#999",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#222", fontSize: { xs: "1rem", sm: "1.1rem" } }}
              >
                Brute Force
              </Typography>
            </Box>

            <Typography
              whiteSpace="pre-line"
              sx={{ color: "#444", fontSize: "0.95rem", lineHeight: 1.7 }}
            >
              {q.bruteForceComplexity}
            </Typography>

            {q.bruteForceCode && (
              <Button
                variant="outlined"
                sx={{
                  mt: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  borderColor: "#bbb",
                  color: "#333",
                  borderRadius: "8px",
                  px: 2.5,
                  "&:hover": {
                    borderColor: "#888",
                    backgroundColor: "#f5f5f5",
                  },
                }}
                onClick={() => setShowBruteCode(!showBruteCode)}
              >
                {showBruteCode ? "Hide Code" : "Show Code"}
              </Button>
            )}

            {showBruteCode && (
              <Box
                mt={2.5}
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid #2a2a2a",
                }}
              >
                <SyntaxHighlighter language="java" style={oneDark}>
                  {q.bruteForceCode}
                </SyntaxHighlighter>
              </Box>
            )}
          </Box>

          {/* Optimal Section */}
          <Box
            mt={3}
            p={{ xs: 2.5, sm: 3 }}
            sx={{
              borderRadius: "12px",
              bgcolor: "#ffffff",
              border: "1.5px solid #e0e0e0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 4,
                  height: 22,
                  borderRadius: 2,
                  backgroundColor: "#333",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#111", fontSize: { xs: "1rem", sm: "1.1rem" } }}
              >
                Optimal Approach
              </Typography>
            </Box>

            <Typography
              whiteSpace="pre-line"
              sx={{ color: "#444", fontSize: "0.95rem", lineHeight: 1.7 }}
            >
              {q.optimalComplexity}
            </Typography>

            {q.optimalCode && (
              <Button
                variant="contained"
                sx={{
                  mt: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  backgroundColor: "#222",
                  borderRadius: "8px",
                  px: 2.5,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#111",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  },
                }}
                onClick={() => setShowOptimalCode(!showOptimalCode)}
              >
                {showOptimalCode ? "Hide Code" : "Show Code"}
              </Button>
            )}

            {showOptimalCode && (
              <Box
                mt={2.5}
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid #2a2a2a",
                }}
              >
                <SyntaxHighlighter language="java" style={oneDark}>
                  {q.optimalCode}
                </SyntaxHighlighter>
              </Box>
            )}
          </Box>

          {/* Navigation Buttons */}
          <Grid container spacing={2} justifyContent="center" mt={4} mb={2}>
            <Grid item xs={6} sm={4} md={2.5}>
              <Button
                fullWidth
                variant="outlined"
                disabled={currentQIndex === 0}
                onClick={() => {
                  setCurrentQIndex((prev) => Math.max(prev - 1, 0));
                  setShowBruteCode(false);
                  setShowOptimalCode(false);
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  color: "#333",
                  py: 1.2,
                  "&:hover": {
                    borderColor: "#888",
                    backgroundColor: "#f5f5f5",
                  },
                  "&.Mui-disabled": {
                    borderColor: "#e5e5e5",
                    color: "#ccc",
                  },
                }}
              >
                ← Previous
              </Button>
            </Grid>

            <Grid item xs={6} sm={4} md={2.5}>
              <Button
                fullWidth
                variant="contained"
                disabled={currentQIndex === questions.length - 1}
                onClick={() => {
                  setCurrentQIndex((prev) =>
                    Math.min(prev + 1, questions.length - 1)
                  );
                  setShowBruteCode(false);
                  setShowOptimalCode(false);
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  backgroundColor: "#222",
                  py: 1.2,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#111",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#e0e0e0",
                    color: "#aaa",
                  },
                }}
              >
                Next →
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography
          variant="h6"
          color="text.secondary"
          mt={5}
          align="center"
        >
          No questions available for this topic.
        </Typography>
      )}
    </Box>
  );
};

export default PracticePage;