import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, TextField, Button, Snackbar, Alert,
  Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, Fade,
  Checkbox, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Tooltip, InputAdornment, CircularProgress,
  useTheme, useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ForumIcon from "@mui/icons-material/Forum";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SchoolIcon from "@mui/icons-material/School";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import server from "../../shared/environment";

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [sending, setSending] = useState(false);

  const [doubts, setDoubts] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [openDoubts, setOpenDoubts] = useState(false);

  // ── Aims state ──
  const [openAims, setOpenAims] = useState(false);
  const [aims, setAims] = useState([]);
  const [newAim, setNewAim] = useState("");

  // ── Tasks state ──
  const [openTasks, setOpenTasks] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // ── Delete User Confirmation State ──
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // ── Fetch aims & tasks from MongoDB on mount ──
  const fetchList = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/list`, authHeader());
      setAims(res.data.aims || []);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch list", err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ── Fetch enriched users ── */
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get(`${server}/api/admin/users`, authHeader());
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ── Fetch doubts ── */
  const [doubtsLoading, setDoubtsLoading] = useState(false);
  const fetchDoubts = async () => {
    setDoubtsLoading(true);
    try {
      const res = await axios.get(`${server}/api/admin/doubts`, authHeader());
      setDoubts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch doubts", err);
    } finally {
      setDoubtsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
    const handleNewDoubt = (e) => {
      if (e.detail) {
        setDoubts((prev) => {
          const exists = prev.some((d) => d._id === e.detail._id);
          return exists ? prev : [e.detail, ...prev];
        });
      }
    };
    window.addEventListener("new-doubt", handleNewDoubt);
    return () => window.removeEventListener("new-doubt", handleNewDoubt);
  }, []);

  /* ── Send broadcast / direct message ── */
  const sendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await axios.post(
        `${server}/api/admin/send-message`,
        { text: message, toUsername: username || null },
        authHeader()
      );
      setSnackbarMsg("Message sent successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setMessage("");
      setUsername(null);
    } catch {
      setSnackbarMsg("Failed to send message");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSending(false);
    }
  };

  /* ── Reply to doubt ── */
  const sendReply = async (id) => {
    if (!replyText[id]) return;
    try {
      await axios.post(
        `${server}/api/admin/reply-doubt/${id}`,
        { reply: replyText[id] },
        authHeader()
      );
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      fetchDoubts();
      setSnackbarMsg("Reply sent to student!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      alert("Failed to send reply");
    }
  };

  /* ── Delete User Confirmation & Cascade Purge ── */
  const promptDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const executeDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    const doomed = { ...userToDelete };
    try {
      const targetId = encodeURIComponent(doomed._id || doomed.username);
      const queryParams = new URLSearchParams();
      if (doomed.username) queryParams.set("username", doomed.username);
      if (doomed.email) queryParams.set("email", doomed.email);
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

      const res = await axios.delete(`${server}/api/admin/users/${targetId}${queryString}`, authHeader());

      // Optimistically remove user from table immediately
      setUsers((prev) =>
        prev.filter((u) => u._id !== doomed._id && u.username !== doomed.username && u.email !== doomed.email)
      );

      setSnackbarMsg(res.data?.message || `Student "${doomed.name || doomed.username}" and all data permanently purged!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);

      // If user was already removed or 404/already missing, remove from list and notify
      if (err.response?.status === 404 || err.response?.data?.error?.includes("not found")) {
        setUsers((prev) =>
          prev.filter((u) => u._id !== doomed._id && u.username !== doomed.username && u.email !== doomed.email)
        );
        setSnackbarMsg(`Student "${doomed.name || doomed.username}" is already removed from MongoDB.`);
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        const errMsg = err.response?.data?.details || err.response?.data?.error || err.response?.data?.message || "Failed to delete user from database.";
        setSnackbarMsg(errMsg);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ── AIMS CRUD ── */
  const addAim = async () => {
    if (!newAim.trim()) return;
    try {
      const res = await axios.post(`${server}/api/admin/list/aims`, { title: newAim }, authHeader());
      setAims((prev) => [res.data.aim, ...prev]);
      setNewAim("");
    } catch {
      alert("Failed to add aim");
    }
  };

  const toggleAim = async (id, completed) => {
    try {
      const res = await axios.patch(`${server}/api/admin/list/aims/${id}`, { completed }, authHeader());
      setAims((prev) => prev.map((a) => (a._id === id ? res.data.aim : a)));
    } catch {
      alert("Failed to update aim");
    }
  };

  const deleteAim = async (id) => {
    try {
      await axios.delete(`${server}/api/admin/list/aims/${id}`, authHeader());
      setAims((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Failed to delete aim");
    }
  };

  /* ── TASKS CRUD ── */
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${server}/api/admin/list/tasks`, { title: newTask }, authHeader());
      setTasks((prev) => [res.data.task, ...prev]);
      setNewTask("");
    } catch {
      alert("Failed to add task");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await axios.patch(`${server}/api/admin/list/tasks/${id}`, { completed }, authHeader());
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
    } catch {
      alert("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${server}/api/admin/list/tasks/${id}`, authHeader());
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete task");
    }
  };

  const unrepliedCount = doubts.filter((d) => !d.replied).length;

  // Filtered users for table
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return users;
    const q = userSearchQuery.toLowerCase();
    return users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
  }, [users, userSearchQuery]);

  // Modal helper for aims / tasks
  const renderListModal = ({ open, onClose, title, icon, items, newVal, setNewVal, onAdd, onToggle, onDelete, placeholder }) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "20px", fontFamily: "'DM Sans', sans-serif" } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, color: "#1a1a2e", pb: 1, borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </Box>
          {title}
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "#aaa" }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onAdd(); }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                "& fieldset": { borderColor: "#e8e8e8" },
                "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={onAdd}
            startIcon={<AddIcon />}
            sx={{
              background: "#1a1a2e",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              px: 2.5,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { background: "#2d2d4e" },
            }}
          >
            Add
          </Button>
        </Box>

        {items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#aaa" }}>
              No items yet. Add one above!
            </Typography>
          </Box>
        ) : (
          items.map((item) => (
            <Box
              key={item._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                mb: 1,
                background: "#fafafa",
                borderRadius: "12px",
                border: "1px solid #f0f0f0",
              }}
            >
              <Checkbox
                checked={item.completed}
                onChange={(e) => onToggle(item._id, e.target.checked)}
                size="small"
                sx={{ color: "#ccc", "&.Mui-checked": { color: "#1a1a2e" }, p: 0.5 }}
              />
              <Typography
                sx={{
                  flex: 1,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: item.completed ? "#aaa" : "#1a1a2e",
                  textDecoration: item.completed ? "line-through" : "none",
                }}
              >
                {item.title}
              </Typography>
              <IconButton onClick={() => onDelete(item._id)} size="small" sx={{ color: "#ccc", "&:hover": { color: "#d32f2f" } }}>
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <style>{`
        .admin-card { transition: all 0.25s cubic-bezier(0.16,1,0.3,1); }
        .admin-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(26,26,46,0.08) !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <Fade in timeout={500}>
        <Box sx={{ pb: 6 }}>
          {/* ── Page Header (Clean, without duplicate in-page studio tabs) ── */}
          <Box sx={{ mb: 3.5, display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 11, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5 }}>
                Admin Operations
              </Typography>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 26, sm: 32 }, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-1px" }}>
                Admin Dashboard
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", mt: 0.5 }}>
                Direct message broadcast, academic doubts resolution, task planner, and complete student account lifecycle management.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => { fetchUsers(); fetchDoubts(); }}
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: "#e0e0e0",
                color: "#1a1a2e",
                borderRadius: "12px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 12.5,
                textTransform: "none",
                px: 2,
                "&:hover": { borderColor: "#1a1a2e", background: "#f8f8fa" },
              }}
            >
              Refresh Data
            </Button>
          </Box>

          {/* ── STATS STRIP ── */}
          <Box sx={{ display: "flex", gap: 2, mb: 3.5, flexWrap: "wrap" }}>
            {[
              { label: "Registered Students", value: users.length, tag: "Atlas Users" },
              { label: "Academic Doubts", value: doubts.length, tag: "Received" },
              { label: "Pending Replies", value: unrepliedCount, tag: "Action Needed" },
              { label: "Resolved Queries", value: doubts.length - unrepliedCount, tag: "Resolved" },
            ].map(({ label, value, tag }) => (
              <Box key={label} className="admin-card" sx={{ flex: "1 1 140px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", p: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#ccc", letterSpacing: "1.2px", textTransform: "uppercase", mb: 0.5 }}>{tag}</Typography>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 28, color: "#1a1a2e", lineHeight: 1 }}>{value}</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa", mt: 0.5 }}>{label}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── TWO ACTION CARDS: SEND MESSAGE & DOUBTS ── */}
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" }, alignItems: "stretch", mb: 3.5 }}>
            {/* ── SEND MESSAGE CARD ── */}
            <Box className="admin-card" sx={{ flex: 1, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 3, sm: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: "13px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SendIcon sx={{ color: "#fff", fontSize: 19 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: "-0.3px" }}>Send Announcement</Typography>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>Broadcast or target a specific student</Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Type your notification message to students…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13.5,
                    "& fieldset": { borderColor: "#e8e8e8" },
                    "&:hover fieldset": { borderColor: "#c0c0c0" },
                    "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
                  },
                }}
              />

              <Autocomplete
                options={users.map((u) => u.username)}
                value={username}
                onChange={(e, val) => setUsername(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="All Students (Broadcast) or select student…"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        "& fieldset": { borderColor: "#e8e8e8" },
                        "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
                      },
                    }}
                  />
                )}
                sx={{ mb: 2.5 }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={sendMessage}
                disabled={sending}
                sx={{
                  background: "#1a1a2e",
                  borderRadius: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 13.5,
                  py: 1.3,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
                  "&:disabled": { background: "#ccc" },
                }}
              >
                {sending ? "Sending…" : "Send Notification"}
              </Button>
            </Box>

            {/* ── USER DOUBTS CARD ── */}
            <Box className="admin-card" sx={{ flex: 1, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 3, sm: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Box sx={{ width: 56, height: 56, borderRadius: "18px", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
                <ForumIcon sx={{ fontSize: 28, color: "#1a1a2e" }} />
              </Box>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 19, color: "#1a1a2e", mb: 0.5 }}>
                Student Doubts & Questions
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#aaa", maxWidth: 320, mb: 2 }}>
                Review and respond to academic questions asked by registered students.
              </Typography>
              {unrepliedCount > 0 && (
                <Box sx={{ px: 2, py: 0.5, borderRadius: "30px", background: "#1a1a2e", display: "inline-flex", alignItems: "center", gap: 0.8, mb: 2 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: "pulse 1.4s infinite" }} />
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 700, color: "#fff" }}>
                    {unrepliedCount} pending {unrepliedCount === 1 ? "reply" : "replies"}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                onClick={() => { fetchDoubts(); setOpenDoubts(true); }}
                sx={{
                  background: "#1a1a2e",
                  borderRadius: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 13.5,
                  py: 1.3,
                  px: 4,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
                }}
              >
                {doubtsLoading ? "Loading…" : "Open Doubts Portal"}
              </Button>
            </Box>
          </Box>

          {/* ── AIMS & TASKS BUTTONS ── */}
          <Box sx={{ display: "flex", gap: 2, mb: 3.5, flexWrap: "wrap" }}>
            <Box className="admin-card" sx={{ flex: "1 1 200px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "18px", p: { xs: 2.5, sm: 3 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: "#f4f4f6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrackChangesIcon sx={{ fontSize: 22, color: "#1a1a2e" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>Aims of My Life</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>{aims.filter(a => a.completed).length}/{aims.length} completed</Typography>
              </Box>
              <Button variant="contained" onClick={() => setOpenAims(true)} sx={{ background: "#1a1a2e", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, py: 1, px: 2, textTransform: "none", boxShadow: "none", "&:hover": { background: "#2d2d4e" } }}>
                Manage
              </Button>
            </Box>

            <Box className="admin-card" sx={{ flex: "1 1 200px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "18px", p: { xs: 2.5, sm: 3 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: "#f4f4f6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AssignmentIcon sx={{ fontSize: 22, color: "#1a1a2e" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>Today's Tasks</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>{tasks.filter(t => t.completed).length}/{tasks.length} completed</Typography>
              </Box>
              <Button variant="contained" onClick={() => setOpenTasks(true)} sx={{ background: "#1a1a2e", borderRadius: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, py: 1, px: 2, textTransform: "none", boxShadow: "none", "&:hover": { background: "#2d2d4e" } }}>
                Manage
              </Button>
            </Box>
          </Box>

          {/* ══════════════════════════════════════════════════════════════
              REGISTERED NOTENOVA STUDENTS & CASCADE USER DELETION
             ══════════════════════════════════════════════════════════════ */}
          <Box sx={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 2.5, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: 2, mb: 3 }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: "12px", background: "#ffebee", display: "flex", alignItems: "center", justifyContent: "center", color: "#d32f2f" }}>
                    <PersonRemoveIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 18, sm: 22 }, color: "#1a1a2e" }}>
                    Registered Students & Cascade Account Purge
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#777", maxWidth: 720 }}>
                  Review all genuine Notenova students. When you delete a user here, they are permanently erased from MongoDB along with all their enrolled purchases, payment attempts, recovery records, and doubts.
                </Typography>
              </Box>

              <TextField
                size="small"
                placeholder="Search by student name or @handle…"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: "#aaa" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 280 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    background: "#fdfdfd",
                  },
                }}
              />
            </Box>

            {usersLoading ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <CircularProgress size={32} sx={{ color: "#1a1a2e" }} />
                <Typography sx={{ mt: 1.5, fontSize: 13, color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
                  Loading real students from MongoDB Atlas...
                </Typography>
              </Box>
            ) : filteredUsers.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5, background: "#fafafa", borderRadius: "14px", border: "1px dashed #e0e0e0" }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888" }}>
                  No students found matching your search.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: "14px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <Table size="small" sx={{ minWidth: { xs: 650, md: "auto" } }}>
                  <TableHead sx={{ background: "#fafafa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Enrolled Batches</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12 }}>Total Spend</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12 }}>Doubts</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Registered Date</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12 }}>Permanent Purge</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u._id} hover sx={{ "&:hover": { background: "#fafbfc" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: "10px", background: "#1a1a2e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                              {u.name?.[0]?.toUpperCase() || "S"}
                            </Box>
                            <Box>
                              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>
                                {u.name}
                              </Typography>
                              <Typography sx={{ fontSize: 11, color: "#888" }}>
                                @{u.username}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${u.purchaseCount || 0} Batches`}
                            size="small"
                            sx={{
                              background: (u.purchaseCount || 0) > 0 ? "#e8f5e9" : "#f4f4f6",
                              color: (u.purchaseCount || 0) > 0 ? "#2e7d32" : "#888",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12.5, color: "#1a1a2e" }}>
                          ₹{(u.totalSpend || 0).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={u.doubtsCount || 0}
                            size="small"
                            sx={{ background: "#f4f4f6", fontWeight: 700, fontSize: 11 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 11.5, color: "#777" }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Delete user and all their records from MongoDB">
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => promptDeleteUser(u)}
                              startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                              sx={{
                                textTransform: "none",
                                borderRadius: "8px",
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: 11.5,
                                py: 0.4,
                                px: 1.2,
                              }}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Fade>

      {/* ── CASCADE DELETE CONFIRMATION MODAL ── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "18px", p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#d32f2f", fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
          <WarningAmberIcon sx={{ fontSize: 26 }} />
          Permanent Deletion Warning
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#333", mb: 2 }}>
            Are you sure you want to permanently delete student <strong>{userToDelete?.name}</strong> (<code>@{userToDelete?.username}</code>)?
          </Typography>
          <Box sx={{ p: 2, background: "#fff8f8", borderRadius: "12px", border: "1px solid #ffcdd2", mb: 1 }}>
            <Typography sx={{ fontSize: 11.5, color: "#c62828", fontWeight: 700, mb: 0.8 }}>
              ⚡ The following will be permanently erased across MongoDB:
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>
              • User record from <code>users</code> collection<br />
              • All batch purchases from <code>purchases</code> collection<br />
              • All doubts and questions from <code>doubts</code> collection<br />
              • Payment logs, failed transactions, and recovery offers<br />
              • Chapter notes & personalized bookmarks
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 11, color: "#888", fontStyle: "italic", mt: 1.5 }}>
            All platform data analyses and AI/ML model benchmarks will automatically recalculate on genuine remaining students.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
            sx={{ textTransform: "none", color: "#666", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={executeDeleteUser}
            disabled={deleteLoading}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            {deleteLoading ? "Purging…" : "Permanently Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DOUBTS MODAL ── */}
      <Dialog
        open={openDoubts}
        onClose={() => setOpenDoubts(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 32px 80px rgba(0,0,0,0.15)" } }}
      >
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, color: "#1a1a2e", pb: 1, borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            User Doubts
            {unrepliedCount > 0 && (
              <Box component="span" sx={{ px: 1.2, py: 0.3, borderRadius: "8px", background: "#1a1a2e", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#fff" }}>
                {unrepliedCount} pending
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button size="small" onClick={fetchDoubts} disabled={doubtsLoading} sx={{ textTransform: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#1a1a2e", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
              {doubtsLoading ? "Refreshing…" : "Refresh"}
            </Button>
            <IconButton size="small" onClick={() => setOpenDoubts(false)} sx={{ color: "#aaa" }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {doubts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "#e0e0e0", mb: 1 }} />
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#ccc" }}>No doubts yet</Typography>
            </Box>
          ) : (
            doubts.map((d) => (
              <Box key={d._id} sx={{ mb: 2.5, p: 3, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                  <Box sx={{ px: 1.4, py: 0.3, borderRadius: "8px", background: "#f4f4f6" }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#555" }}>{d.username}</Typography>
                  </Box>
                  <Box sx={{ px: 1.4, py: 0.3, borderRadius: "8px", background: "#f9f9f9" }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#aaa" }}>{d.subject}</Typography>
                  </Box>
                  {d.contact && (
                    <Box sx={{ px: 1.4, py: 0.3, borderRadius: "8px", background: "#eef7fe" }}>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#1976d2" }}>Contact: {d.contact}</Typography>
                    </Box>
                  )}
                  {d.createdAt && (
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#bbb", ml: "auto" }}>
                      {new Date(d.createdAt).toLocaleDateString()} {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#333", lineHeight: 1.7, mb: 2 }}>{d.message}</Typography>
                {d.replied ? (
                  <Box sx={{ p: 2, borderRadius: "12px", background: "#f8fdf8", border: "1px solid #d4edda" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.5 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#2e7d32" }} />
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#2e7d32" }}>Admin Reply Sent</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#2e7d32" }}>{d.reply}</Typography>
                  </Box>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Write your reply…"
                      value={replyText[d._id] || ""}
                      onChange={(e) => setReplyText({ ...replyText, [d._id]: e.target.value })}
                      sx={{
                        mb: 1.5,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          "& fieldset": { borderColor: "#e8e8e8" },
                          "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => sendReply(d._id)}
                      sx={{
                        background: "#1a1a2e",
                        borderRadius: "12px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        py: 1,
                        px: 3,
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": { background: "#2d2d4e", boxShadow: "0 6px 18px rgba(26,26,46,0.22)" },
                      }}
                    >
                      Send Reply
                    </Button>
                  </>
                )}
              </Box>
            ))
          )}
        </DialogContent>
      </Dialog>

      {/* ── AIMS MODAL ── */}
      {renderListModal({ open: openAims, onClose: () => setOpenAims(false), title: "Aims of My Life", icon: <TrackChangesIcon sx={{ color: "#fff", fontSize: 18 }} />, items: aims, newVal: newAim, setNewVal: setNewAim, onAdd: addAim, onToggle: toggleAim, onDelete: deleteAim, placeholder: "Add your aim in life…" })}

      {/* ── TASKS MODAL ── */}
      {renderListModal({ open: openTasks, onClose: () => setOpenTasks(false), title: "Today's Tasks", icon: <AssignmentIcon sx={{ color: "#fff", fontSize: 18 }} />, items: tasks, newVal: newTask, setNewVal: setNewTask, onAdd: addTask, onToggle: toggleTask, onDelete: deleteTask, placeholder: "Add your today's task…" })}

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} sx={{ fontFamily: "'DM Sans', sans-serif", borderRadius: "12px" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminDashboard;
