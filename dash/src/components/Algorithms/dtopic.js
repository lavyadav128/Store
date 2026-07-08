import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const topics = [
  { id: "arrays", name: "Arrays" },
  { id: "binary-search", name: "Binary Search" },
  { id: "strings", name: "Strings" },
  { id: "bit-manipulation", name: "Bit Manipulation" },
  { id: "recurssion-&-backtracking", name: "Recurssion-&-Backtracking"},
  { id: "linked-list", name: "Linked List" },
  { id: "stack-&-queue", name: "Stack-&-Queue" },
  { id: "Greedy-algorithm", name: "Greedy-algorithm" },
  { id: "bt-&-bst", name: "BT-&-BST" },
  { id: "heaps", name: "Heaps" },
  { id: "tries", name: "Tries" },
  { id: "sliding-and-two-pointer", name: "Sliding and two pointer" },
  { id: "graphs", name: "Graphs" },
  { id: "dynamic-programming", name: "Dynamic Programming" },
];

const TopicPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIosNewIcon />}
        sx={{
          mb: 3,
          backgroundColor: "#fff",
          color: "#333",
          border: "1px solid #ddd",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          px: 2.5,
          py: 1,
          boxShadow: 1,
          "&:hover": {
            backgroundColor: "#f0f0f0",
            boxShadow: 2,
          },
        }}
      >
        Back
      </Button>

      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        gutterBottom
        sx={{ color: "#333" }}
      >
        Explore DSA Topics
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign="center"
        mb={6}
        color="text.secondary"
      >
        Choose a topic to start practicing.
      </Typography>

      <Grid container spacing={3}>
        {topics.map((topic) => (
          <Grid item xs={12} sm={6} md={4} key={topic.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 5,
                  transform: "translateY(-4px)",
                },
                transition: "all 0.3s",
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/dpractice/${topic.id}`)}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    py: 2,
                    backgroundColor: "#fff",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                  >
                    {topic.name}
                  </Typography>
                  <Chip
                    label="Start Practice"
                    size="small"
                    sx={{
                      mt: 1.5,
                      backgroundColor: "white",
                      color: "#333",
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TopicPage;
