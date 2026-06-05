import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, MenuItem,
  Select, InputLabel, FormControl, IconButton,
  Dialog, DialogTitle, DialogContent, Fade, LinearProgress,
  useMediaQuery, useTheme, Drawer, AppBar, Toolbar,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import server from "../environment";

const CATEGORIES = ["pyq", "mindmap", "shortnotes", "fullstack", "dsa_files", "completenotes", "videos"];

const AdminFileUpload = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open,            setOpen]            = useState(false);
  const [title,           setTitle]           = useState("");
  const [category,        setCategory]        = useState("");
  const [file,            setFile]            = useState(null);
  const [uploading,       setUploading]       = useState(false);
  const [progress,        setProgress]        = useState(0);
  const [resources,       setResources]       = useState([]);
  const [filterCat,       setFilterCat]       = useState("all");
  const [filterDrawer,    setFilterDrawer]    = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${server}/api/resources`, authHeader());
      setResources(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleUpload = async () => {
    if (!title || !category || !file) return alert("Fill all fields and select a file");
    const formData = new FormData();
    formData.append("title",    title);
    formData.append("category", category);
    formData.append("file",     file);

    setUploading(true);
    try {
      await axios.post(`${server}/api/resources/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      setTitle(""); setCategory(""); setFile(null); setProgress(0);
      setOpen(false);
      fetchResources();
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      await axios.delete(`${server}/api/resources/${id}`, authHeader());
      fetchResources();
    } catch { alert("Delete failed"); }
  };

  const filtered = filterCat === "all" ? resources : resources.filter(r => r.category === filterCat);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');`}</style>

      <Fade in timeout={500}>
        <Box sx={{ px: { xs: 0, sm: 0 } }}>

          {/* ── Header ── */}
          <Box sx={{
            mb: { xs: 3, sm: 4 },
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}>
            <Box>
              <Typography sx={{
                fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 800,
                color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5,
              }}>
                Admin Panel
              </Typography>
              <Typography sx={{
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
                fontSize: { xs: 22, sm: 30 }, color: "#1a1a2e", letterSpacing: "-1px",
              }}>
                File Manager
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#aaa", mt: 0.5 }}>
                Upload and manage files across all categories
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => setOpen(true)}
              fullWidth={isMobile}
              sx={{
                background: "#1a1a2e", borderRadius: "14px",
                fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14,
                py: 1.4, px: 3, textTransform: "none", boxShadow: "none",
                "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
              }}
            >
              Upload File
            </Button>
          </Box>

          {/* ── Filter: scrollable row on mobile, wrap on desktop ── */}
          {isMobile ? (
            <Box sx={{ display: "flex", gap: 1, mb: 3, overflowX: "auto", pb: 1, mx: -2, px: 2,
              scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
              {["all", ...CATEGORIES].map((cat) => (
                <Button key={cat} onClick={() => setFilterCat(cat)}
                  sx={{
                    borderRadius: "10px", fontFamily: "'DM Sans'", fontWeight: 600,
                    fontSize: 12, py: 0.7, px: 2, textTransform: "none", whiteSpace: "nowrap",
                    flexShrink: 0,
                    background: filterCat === cat ? "#1a1a2e" : "#f4f4f6",
                    color: filterCat === cat ? "#fff" : "#666",
                    boxShadow: "none",
                    minWidth: "unset",
                    "&:hover": { background: filterCat === cat ? "#2d2d4e" : "#e8e8e8" },
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
              {["all", ...CATEGORIES].map((cat) => (
                <Button key={cat} onClick={() => setFilterCat(cat)}
                  sx={{
                    borderRadius: "10px", fontFamily: "'DM Sans'", fontWeight: 600,
                    fontSize: 12, py: 0.8, px: 2, textTransform: "none",
                    background: filterCat === cat ? "#1a1a2e" : "#f4f4f6",
                    color: filterCat === cat ? "#fff" : "#666",
                    boxShadow: "none",
                    "&:hover": { background: filterCat === cat ? "#2d2d4e" : "#e8e8e8" },
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Box>
          )}

          {/* ── Files grid ── */}
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <InsertDriveFileIcon sx={{ fontSize: 48, color: "#e0e0e0", mb: 1 }} />
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#ccc" }}>
                No files in this category
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(260px, 1fr))",
              },
              gap: { xs: 1.5, sm: 2 },
            }}>
              {filtered.map((r) => (
                <Box key={r._id} sx={{
                  background: "#fff",
                  border: "1px solid #f0f0f0",
                  borderRadius: "16px",
                  p: { xs: 2, sm: 2.5 },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: "11px",
                        background: "#f4f4f6", display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <InsertDriveFileIcon sx={{ fontSize: 20, color: "#1a1a2e" }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{
                          fontFamily: "'DM Sans'", fontWeight: 700,
                          fontSize: { xs: 13, sm: 14 }, color: "#1a1a2e", lineHeight: 1.3,
                          overflow: "hidden", textOverflow: "ellipsis",
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        }}>
                          {r.title}
                        </Typography>
                        <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#aaa", mt: 0.3 }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={() => handleDelete(r._id)} size="small"
                      sx={{
                        color: "#ccc", borderRadius: "8px", p: 0.6, flexShrink: 0,
                        "&:hover": { color: "#e53935", background: "#fff0f0" },
                      }}>
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ px: 1.2, py: 0.3, borderRadius: "8px", background: "#f4f4f6" }}>
                      <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700, color: "#555" }}>
                        {r.category}
                      </Typography>
                    </Box>
                    <Button
                      href={r.fileUrl} target="_blank" size="small"
                      sx={{
                        fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 12,
                        color: "#1a1a2e", textTransform: "none", p: 0,
                        "&:hover": { background: "transparent", textDecoration: "underline" },
                      }}
                    >
                      View File →
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Fade>

      {/* ── Upload Modal ── */}
      <Dialog
        open={open}
        onClose={() => !uploading && setOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "20px" },
            fontFamily: "'DM Sans'",
            boxShadow: "0 32px 80px rgba(0,0,0,0.15)",
            m: { xs: 0, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 800, fontSize: { xs: 18, sm: 20 },
          color: "#1a1a2e", borderBottom: "1px solid #f0f0f0",
          pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          Upload New File
          {isMobile && (
            <IconButton onClick={() => !uploading && setOpen(false)} size="small" sx={{ color: "#aaa" }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          display: "flex", flexDirection: "column",
          gap: { xs: 2, sm: 2.5 },
          mt: 1,
          overflowY: "auto",
        }}>

          <TextField
            label="Title" fullWidth value={title}
            onChange={(e) => setTitle(e.target.value)}
            size={isMobile ? "medium" : "medium"}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px", fontFamily: "'DM Sans'",
                "& fieldset": { borderColor: "#e8e8e8" },
                "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: "'DM Sans'" }}>Category</InputLabel>
            <Select
              value={category} label="Category"
              onChange={(e) => setCategory(e.target.value)}
              MenuProps={{ PaperProps: { sx: { maxHeight: 220 } } }}
              sx={{
                borderRadius: "14px", fontFamily: "'DM Sans'",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8e8e8" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1a1a2e" },
              }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c} sx={{ fontFamily: "'DM Sans'" }}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* File picker */}
          <Box
            component="label"
            sx={{
              border: "2px dashed #e8e8e8", borderRadius: "14px",
              p: { xs: 2.5, sm: 3 }, textAlign: "center", cursor: "pointer",
              "&:hover": { borderColor: "#1a1a2e", background: "#fafafa" },
              transition: "all 0.2s ease",
              minHeight: { xs: 100, sm: 120 },
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
            <UploadFileIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: file ? "#1a1a2e" : "#ccc", mb: 1 }} />
            <Typography sx={{
              fontFamily: "'DM Sans'", fontSize: { xs: 12, sm: 13 },
              color: file ? "#1a1a2e" : "#aaa", fontWeight: file ? 700 : 400,
              wordBreak: "break-word", px: 1,
            }}>
              {file ? file.name : "Tap to choose a file (PDF, image, video)"}
            </Typography>
          </Box>

          {uploading && (
            <Box>
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#aaa", mb: 0.8 }}>
                Uploading… {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress}
                sx={{ borderRadius: "4px", "& .MuiLinearProgress-bar": { background: "#1a1a2e" } }} />
            </Box>
          )}

          <Button
            variant="contained" onClick={handleUpload} disabled={uploading}
            fullWidth
            sx={{
              background: "#1a1a2e", borderRadius: "14px",
              fontFamily: "'DM Sans'", fontWeight: 700,
              fontSize: { xs: 15, sm: 14 },
              py: { xs: 1.8, sm: 1.5 },
              textTransform: "none", boxShadow: "none",
              "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
              "&:disabled": { background: "#ccc" },
              mt: { xs: "auto", sm: 0 },
            }}
          >
            {uploading ? `Uploading ${progress}%…` : "Upload File"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminFileUpload;