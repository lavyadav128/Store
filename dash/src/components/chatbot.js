import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Button,
  Slide
} from '@mui/material';

import server from "../environment";

const ChatbotWidget = () => {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');

  const [loading, setLoading] = useState(false);

  const toggleDialog = () => {

    setOpen(!open);

    // Welcome message only first time
    if (!open && messages.length === 0) {

      setMessages([
        {
          sender: 'bot',
          text: "Hello 👋 I am your AI assistant. How can I help you today?",
        },
      ]);
    }
  };

  const handleSend = async () => {

    if (!input.trim() || loading) return;

    const userInput = input;

    // User message
    const userMsg = {
      sender: 'user',
      text: userInput,
    };

    // Update UI instantly
    setMessages((prev) => [...prev, userMsg]);

    setInput('');

    setLoading(true);

    try {

      // Convert messages into OpenAI/OpenRouter format
      const history = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch(
        `${server}/api/chatbot`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            message: userInput,
            history,
          }),
        }
      );

      const data = await response.json();

      // Handle backend errors
      if (!response.ok) {

        throw new Error(
          data?.details ||
          data?.error ||
          "Something went wrong"
        );
      }

      const botMsg = {
        sender: 'bot',
        text: data.reply || "No response generated",
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text:
            error.message ||
            "Oops! Something went wrong.",
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Face Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <IconButton
          onClick={toggleDialog}
          sx={{
            backgroundColor: '#fff',
            boxShadow: 3,
            width: 56,
            height: 56,
            padding: 0,
            '&:hover': {
              backgroundColor: '#f0f0f0'
            },
          }}
        >
          <Box
            component="img"
            src="/images/chatbot.jpg"
            alt="AI Assistant"
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #1976d2',
            }}
          />
        </IconButton>
      </Box>

      {/* Chat Dialog */}
      <Dialog
        open={open}
        onClose={toggleDialog}
        fullWidth
        maxWidth="xs"
        TransitionComponent={Slide}
        PaperProps={{
          sx: {
            borderRadius: 4,
            height: 500
          }
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >

          <Typography
            variant="h6"
            sx={{ mb: 1 }}
          >
            AI Assistant
          </Typography>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 1,
              border: '1px solid #eee',
              borderRadius: 2,
              mb: 2,
              bgcolor: '#fafafa',
            }}
          >

            {messages.map((msg, i) => (

              <Box
                key={i}
                sx={{
                  mb: 1,
                  display: 'flex',
                  justifyContent:
                    msg.sender === 'user'
                      ? 'flex-end'
                      : 'flex-start',
                }}
              >

                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor:
                      msg.sender === 'user'
                        ? '#1976d2'
                        : '#e0e0e0',

                    color:
                      msg.sender === 'user'
                        ? '#fff'
                        : '#000',

                    maxWidth: '80%',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </Typography>

              </Box>
            ))}

            {/* Loading Message */}
            {loading && (

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: '#e0e0e0',
                    color: '#000',
                  }}
                >
                  Typing...
                </Typography>
              </Box>
            )}

          </Box>

          {/* Input Area */}
          <Box
            sx={{
              display: 'flex',
              gap: 1
            }}
          >

            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type your message..."
              value={input}

              onChange={(e) =>
                setInput(e.target.value)
              }

              onKeyDown={(e) => {

                if (
                  e.key === 'Enter' &&
                  !loading
                ) {
                  handleSend();
                }
              }}
            />

            <Button
              onClick={handleSend}
              variant="contained"
              size="small"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </Button>

          </Box>

        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotWidget;