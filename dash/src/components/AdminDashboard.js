
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Snackbar,
//   Alert,
//   Autocomplete,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Fade,
//   Checkbox,
//   IconButton,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import ForumIcon from "@mui/icons-material/Forum";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import TrackChangesIcon from "@mui/icons-material/TrackChanges";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import server from "../environment";
// import { useLocation } from "react-router-dom";


// const AdminDashboard = () => {
//   const [message,      setMessage]      = useState("");
//   const [username,     setUsername]     = useState(null);
//   const [users,        setUsers]        = useState([]);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [sending,      setSending]      = useState(false);

//   const [doubts,     setDoubts]     = useState([]);
//   const [replyText,  setReplyText]  = useState({});
//   const [openDoubts, setOpenDoubts] = useState(false);

//   // ── Aims state ──
//   const [openAims,  setOpenAims]  = useState(false);
//   const [aims, setAims] = useState(() => {
//     try {
//       const stored = localStorage.getItem("admin_aims");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) return parsed;
//       }
//     } catch {}
//     return [];
//   });
//   const [newAim, setNewAim] = useState("");

//   // ── Today's Tasks state ──
//   const [openTasks,  setOpenTasks]  = useState(false);
//   const [tasks, setTasks] = useState(() => {
//     try {
//       const stored = localStorage.getItem("admin_tasks");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) return parsed;
//       }
//     } catch {}
//     return [];
//   });
//   const [newTask, setNewTask] = useState("");


//   const location = useLocation();

//   /* ── persist aims ── */
//   useEffect(() => {
//     if (aims.length > 0 || localStorage.getItem("admin_aims")) {
//       localStorage.setItem("admin_aims", JSON.stringify(aims));
//     }
//   }, [aims]);

//   /* ── persist tasks ── */
//   useEffect(() => {
//     if (tasks.length > 0 || localStorage.getItem("admin_tasks")) {
//       localStorage.setItem("admin_tasks", JSON.stringify(tasks));
//     }
//   }, [tasks]);

//   /* ── fetch users ── */
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(`${server}/api/admin/users`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setUsers(res.data.users || []);
//       } catch (err) { console.error("Failed to fetch users", err); }
//     };
//     fetchUsers();
//   }, []);

//   /* ── fetch doubts ── */
//   const fetchDoubts = async () => {
//     try {
//       const res = await axios.get(`${server}/api/admin/doubts`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setDoubts(res.data || []);
//     } catch (err) { console.error("Failed to fetch doubts", err); }
//   };

//   useEffect(() => { fetchDoubts(); }, []);

//   /* ── send message ── */
//   const sendMessage = async () => {
//     if (!message.trim()) return;
//     setSending(true);
//     try {
//       await axios.post(
//         `${server}/api/admin/send-message`,
//         { text: message, toUsername: username || null },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setSnackbarOpen(true);
//       setMessage("");
//       setUsername(null);
//     } catch { alert("Failed to send message"); }
//     finally { setSending(false); }
//   };

//   /* ── reply to doubt ── */
//   const sendReply = async (id) => {
//     if (!replyText[id]) return;
//     try {
//       await axios.post(
//         `${server}/api/admin/reply-doubt/${id}`,
//         { reply: replyText[id] },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setReplyText((prev) => ({ ...prev, [id]: "" }));
//       fetchDoubts();
//     } catch { alert("Failed to send reply"); }
//   };

//   /* ── add aim ── */
//   const addAim = () => {
//     if (!newAim.trim()) return;
//     setAims((prev) => [...prev, { id: Date.now(), text: newAim.trim(), completed: false }]);
//     setNewAim("");
//   };

//   /* ── toggle aim ── */
//   const toggleAim = (id) => {
//     setAims((prev) => prev.map((a) => a.id === id ? { ...a, completed: !a.completed } : a));
//   };

//   /* ── delete aim ── */
//   const deleteAim = (id) => {
//     setAims((prev) => prev.filter((a) => a.id !== id));
//   };

//   /* ── add task ── */
//   const addTask = () => {
//     if (!newTask.trim()) return;
//     setTasks((prev) => [...prev, { id: Date.now(), text: newTask.trim(), completed: false }]);
//     setNewTask("");
//   };

//   /* ── toggle task ── */
//   const toggleTask = (id) => {
//     setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
//   };

//   /* ── delete task ── */
//   const deleteTask = (id) => {
//     setTasks((prev) => prev.filter((t) => t.id !== id));
//   };

//   const unrepliedCount = doubts.filter((d) => !d.replied).length;

//   /* ── shared styles for aim/task items ── */
//   const itemBoxStyle = (completed) => ({
//     display: "flex", alignItems: "center", gap: 1.5,
//     p: 1.8, mb: 1.5,
//     background: completed ? "#f9fdf9" : "#fff",
//     border: `1px solid ${completed ? "#d4edda" : "#f0f0f0"}`,
//     borderRadius: "14px",
//     transition: "all 0.2s ease",
//   });

//   /* ── shared modal content renderer ── */
//   const renderListModal = ({ open, onClose, title, icon, items, newVal, setNewVal, onAdd, onToggle, onDelete, placeholder }) => (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm" fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: "20px",
//           fontFamily: "'DM Sans', sans-serif",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.15)",
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         fontFamily: "'Playfair Display', serif", fontWeight: 800,
//         fontSize: 20, color: "#1a1a2e", pb: 1, borderBottom: "1px solid #f0f0f0",
//         display: "flex", alignItems: "center", gap: 1.5,
//       }}>
//         <Box sx={{
//           width: 36, height: 36, borderRadius: "11px",
//           background: "#1a1a2e",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           flexShrink: 0,
//         }}>
//           {icon}
//         </Box>
//         {title}
//         <Box component="span" sx={{
//           ml: 1, px: 1.2, py: 0.3, borderRadius: "8px",
//           background: "#f4f4f6",
//           fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#aaa",
//           verticalAlign: "middle",
//         }}>
//           {items.length} total
//         </Box>
//       </DialogTitle>

//       <DialogContent dividers sx={{ p: 3 }}>
//         {/* Add input row */}
//         <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
//           <TextField
//             fullWidth
//             placeholder={placeholder}
//             value={newVal}
//             onChange={(e) => setNewVal(e.target.value)}
//             onKeyDown={(e) => { if (e.key === "Enter") onAdd(); }}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "14px",
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: 14,
//                 "& fieldset": { borderColor: "#e8e8e8" },
//                 "&:hover fieldset": { borderColor: "#c0c0c0" },
//                 "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
//               },
//             }}
//           />
//           <Button
//             variant="contained"
//             onClick={onAdd}
//             sx={{
//               background: "#1a1a2e", borderRadius: "14px",
//               fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
//               fontSize: 14, px: 2.5, textTransform: "none",
//               boxShadow: "none", whiteSpace: "nowrap", minWidth: "auto",
//               "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
//               transition: "all 0.2s ease",
//             }}
//           >
//             <AddIcon sx={{ fontSize: 20 }} /> Add
//           </Button>
//         </Box>

//         {/* Items list */}
//         {items.length === 0 ? (
//           <Box sx={{ textAlign: "center", py: 5 }}>
//             <CheckCircleOutlineIcon sx={{ fontSize: 44, color: "#e0e0e0", mb: 1 }} />
//             <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#ccc" }}>
//               Nothing added yet
//             </Typography>
//           </Box>
//         ) : (
//           items.map((item) => (
//             <Box key={item.id} sx={itemBoxStyle(item.completed)}>
//               <Checkbox
//                 checked={item.completed}
//                 onChange={() => onToggle(item.id)}
//                 sx={{
//                   color: "#ddd", p: 0.5,
//                   "&.Mui-checked": { color: "#2e7d32" },
//                 }}
//               />
//               <Typography sx={{
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: 14, color: item.completed ? "#aaa" : "#333",
//                 flex: 1, lineHeight: 1.6,
//                 textDecoration: item.completed ? "line-through" : "none",
//                 transition: "all 0.2s ease",
//               }}>
//                 {item.text}
//               </Typography>
//               {item.completed && (
//                 <Box sx={{
//                   px: 1.4, py: 0.3, borderRadius: "8px",
//                   background: "#e8f5e9",
//                   display: "flex", alignItems: "center", gap: 0.6,
//                 }}>
//                   <CheckCircleOutlineIcon sx={{ fontSize: 13, color: "#2e7d32" }} />
//                   <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#2e7d32" }}>
//                     Completed
//                   </Typography>
//                 </Box>
//               )}
//               <IconButton
//                 onClick={() => onDelete(item.id)}
//                 size="small"
//                 sx={{
//                   color: "#ccc",
//                   borderRadius: "8px",
//                   p: 0.6,
//                   "&:hover": {
//                     color: "#e53935",
//                     background: "#fff0f0",
//                   },
//                   transition: "all 0.18s ease",
//                 }}
//               >
//                 <DeleteOutlineIcon sx={{ fontSize: 18 }} />
//               </IconButton>
//             </Box>
//           ))
//         )}
//       </DialogContent>
//     </Dialog>
//   );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
//         * { box-sizing: border-box; }
//         .admin-card { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease !important; }
//         .admin-card:hover { transform: translateY(-4px) !important; box-shadow: 0 18px 48px rgba(0,0,0,0.10) !important; }

//         @keyframes shimmer {
//           0%   { background-position: -400px 0; }
//           100% { background-position:  400px 0; }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.5; }
//         }
//       `}</style>

//       <Fade in timeout={500}>
//         <Box>
//           {/* ── Page header ── */}
//           <Box sx={{ mb: 4 }}>
//             <Typography sx={{
//               fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontStyle: "normal",
//               fontSize: 11, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5,
//             }}>Admin Panel</Typography>
//             <Typography sx={{
//               fontFamily: "'Playfair Display', serif", fontWeight: 800,
//               fontSize: { xs: 26, sm: 32 }, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-1px",
//             }}>Dashboard</Typography>
//             <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#aaa", mt: 0.8 }}>
//               Manage messages and respond to user doubts.
//             </Typography>
//           </Box>
          

//           {/* ── Two columns ── */}
//           <Box sx={{
//             display: "flex", gap: 3,
//             flexDirection: { xs: "column", md: "row" },
//             alignItems: "stretch",
//           }}>

//             {/* ── SEND MESSAGE CARD ── */}
//             <Box className="admin-card" sx={{
//               flex: 1,
//               background: "#fff",
//               border: "1px solid #f0f0f0",
//               borderRadius: "20px",
//               p: { xs: 3, sm: 4 },
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               display: "flex", flexDirection: "column", gap: 0,
//             }}>
//               {/* Card header */}
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
//                 <Box sx={{
//                   width: 42, height: 42, borderRadius: "13px",
//                   background: "#1a1a2e",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <SendIcon sx={{ color: "#fff", fontSize: 19 }} />
//                 </Box>
//                 <Box>
//                   <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
//                     Send Message
//                   </Typography>
//                   <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>
//                     Broadcast or target a user
//                   </Typography>
//                 </Box>
//                 <Box sx={{ ml: "auto", px: 1.4, py: 0.4, borderRadius: "8px", background: "#f4f4f6" }}>
//                   <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.8px", textTransform: "uppercase" }}>
//                     Broadcast
//                   </Typography>
//                 </Box>
//               </Box>

//               <TextField
//                 fullWidth multiline rows={4}
//                 label="Message"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 sx={{
//                   mb: 2,
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: "14px",
//                     fontFamily: "'DM Sans', sans-serif",
//                     fontSize: 14,
//                     "& fieldset": { borderColor: "#e8e8e8" },
//                     "&:hover fieldset": { borderColor: "#c0c0c0" },
//                     "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
//                   },
//                   "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", fontSize: 14 },
//                   "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" },
//                 }}
//               />

//               <Autocomplete
//                 options={users.map((u) => u.username)}
//                 value={username}
//                 onChange={(e, val) => setUsername(val)}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Username (optional)"
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: "14px",
//                         fontFamily: "'DM Sans', sans-serif",
//                         fontSize: 14,
//                         "& fieldset": { borderColor: "#e8e8e8" },
//                         "&:hover fieldset": { borderColor: "#c0c0c0" },
//                         "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
//                       },
//                       "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", fontSize: 14 },
//                       "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" },
//                     }}
//                   />
//                 )}
//                 sx={{ mb: 3 }}
//               />

//               <Button
//                 variant="contained" fullWidth
//                 onClick={sendMessage} disabled={sending}
//                 sx={{
//                   background: "#1a1a2e", borderRadius: "14px",
//                   fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
//                   fontSize: 14, py: 1.5, textTransform: "none",
//                   boxShadow: "none",
//                   "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
//                   "&:disabled": { background: "#ccc" },
//                   transition: "all 0.2s ease",
//                 }}
//               >
//                 {sending ? "Sending…" : "Send Message"}
//               </Button>
//             </Box>

//             {/* ── USER DOUBTS CARD ── */}
//             <Box className="admin-card" sx={{
//               flex: 1,
//               background: "#fff",
//               border: "1px solid #f0f0f0",
//               borderRadius: "20px",
//               p: { xs: 3, sm: 4 },
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               display: "flex", flexDirection: "column",
//               justifyContent: "center", alignItems: "center",
//               gap: 2, textAlign: "center",
//             }}>
//               <Box sx={{
//                 width: 64, height: 64, borderRadius: "20px",
//                 background: "#f4f4f6",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 mb: 1,
//               }}>
//                 <ForumIcon sx={{ fontSize: 30, color: "#1a1a2e" }} />
//               </Box>

//               <Box>
//                 <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#1a1a2e", letterSpacing: "-0.4px", mb: 0.5 }}>
//                   User Doubts
//                 </Typography>
//                 <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
//                   View and respond to questions raised by students.
//                 </Typography>
//               </Box>

//               {unrepliedCount > 0 && (
//                 <Box sx={{
//                   px: 2, py: 0.6, borderRadius: "30px",
//                   background: "#1a1a2e",
//                   display: "inline-flex", alignItems: "center", gap: 0.8,
//                 }}>
//                   <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: "pulse 1.4s infinite" }} />
//                   <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff" }}>
//                     {unrepliedCount} pending {unrepliedCount === 1 ? "reply" : "replies"}
//                   </Typography>
//                 </Box>
//               )}

//               <Button
//                 variant="contained"
//                 onClick={() => setOpenDoubts(true)}
//                 sx={{
//                   background: "#1a1a2e", borderRadius: "14px",
//                   fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
//                   fontSize: 14, py: 1.4, px: 5, textTransform: "none",
//                   boxShadow: "none", mt: 1,
//                   "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
//                   transition: "all 0.2s ease",
//                 }}
//               >
//                 View Messages
//               </Button>
//             </Box>
//           </Box>

//           {/* ── STATS STRIP ── */}
//           <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
//             {[
//               { label: "Total Users",     value: users.length,          tag: "Registered" },
//               { label: "Total Doubts",    value: doubts.length,         tag: "Received" },
//               { label: "Pending Replies", value: unrepliedCount,        tag: "Action needed" },
//               { label: "Replied",         value: doubts.length - unrepliedCount, tag: "Resolved" },
//             ].map(({ label, value, tag }) => (
//               <Box key={label} className="admin-card" sx={{
//                 flex: "1 1 140px",
//                 background: "#fff", border: "1px solid #f0f0f0",
//                 borderRadius: "16px", p: 2.5,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               }}>
//                 <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#ccc", letterSpacing: "1.2px", textTransform: "uppercase", mb: 0.5 }}>{tag}</Typography>
//                 <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 28, color: "#1a1a2e", lineHeight: 1 }}>{value}</Typography>
//                 <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa", mt: 0.5 }}>{label}</Typography>
//               </Box>
//             ))}
//           </Box>

//           {/* ── AIMS & TASKS BUTTONS ── */}
//           <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>

//             {/* Aims of My Life button */}
//             <Box className="admin-card" sx={{
//               flex: "1 1 200px",
//               background: "#fff", border: "1px solid #f0f0f0",
//               borderRadius: "20px", p: { xs: 2.5, sm: 3 },
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               display: "flex", alignItems: "center", gap: 2,
//             }}>
//               <Box sx={{
//                 width: 48, height: 48, borderRadius: "14px",
//                 background: "#f4f4f6", flexShrink: 0,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>
//                 <TrackChangesIcon sx={{ fontSize: 24, color: "#1a1a2e" }} />
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
//                   Aims of My Life
//                 </Typography>
//                 <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>
//                   {aims.filter(a => a.completed).length}/{aims.length} completed
//                 </Typography>
//               </Box>
//               <Button
//                 variant="contained"
//                 onClick={() => setOpenAims(true)}
//                 sx={{
//                   background: "#1a1a2e", borderRadius: "12px",
//                   fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
//                   fontSize: 13, py: 1.1, px: 2.5, textTransform: "none",
//                   boxShadow: "none", whiteSpace: "nowrap",
//                   "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
//                   transition: "all 0.2s ease",
//                 }}
//               >
//                 Open
//               </Button>
//             </Box>

//             {/* Today's Tasks button */}
//             <Box className="admin-card" sx={{
//               flex: "1 1 200px",
//               background: "#fff", border: "1px solid #f0f0f0",
//               borderRadius: "20px", p: { xs: 2.5, sm: 3 },
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               display: "flex", alignItems: "center", gap: 2,
//             }}>
//               <Box sx={{
//                 width: 48, height: 48, borderRadius: "14px",
//                 background: "#f4f4f6", flexShrink: 0,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>
//                 <AssignmentIcon sx={{ fontSize: 24, color: "#1a1a2e" }} />
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#1a1a2e", letterSpacing: "-0.3px" }}>
//                   Today's Tasks
//                 </Typography>
//                 <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>
//                   {tasks.filter(t => t.completed).length}/{tasks.length} completed
//                 </Typography>
//               </Box>
//               <Button
//                 variant="contained"
//                 onClick={() => setOpenTasks(true)}
//                 sx={{
//                   background: "#1a1a2e", borderRadius: "12px",
//                   fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
//                   fontSize: 13, py: 1.1, px: 2.5, textTransform: "none",
//                   boxShadow: "none", whiteSpace: "nowrap",
//                   "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
//                   transition: "all 0.2s ease",
//                 }}
//               >
//                 Open
//               </Button>
//             </Box>

//           </Box>
//         </Box>
//       </Fade>

//       {/* ── DOUBTS MODAL ── */}
//       <Dialog
//         open={openDoubts}
//         onClose={() => setOpenDoubts(false)}
//         maxWidth="md" fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: "20px",
//             fontFamily: "'DM Sans', sans-serif",
//             boxShadow: "0 32px 80px rgba(0,0,0,0.15)",
//           }
//         }}
//       >
//         <DialogTitle sx={{
//           fontFamily: "'Playfair Display', serif", fontWeight: 800,
//           fontSize: 20, color: "#1a1a2e", pb: 1, borderBottom: "1px solid #f0f0f0",
//         }}>
//           User Doubts
//           {unrepliedCount > 0 && (
//             <Box component="span" sx={{
//               ml: 1.5, px: 1.2, py: 0.3, borderRadius: "8px",
//               background: "#1a1a2e",
//               fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#fff",
//               verticalAlign: "middle",
//             }}>
//               {unrepliedCount} pending
//             </Box>
//           )}
//         </DialogTitle>

//         <DialogContent dividers sx={{ p: 3 }}>
//           {doubts.length === 0 ? (
//             <Box sx={{ textAlign: "center", py: 6 }}>
//               <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "#e0e0e0", mb: 1 }} />
//               <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#ccc" }}>No doubts yet</Typography>
//             </Box>
//           ) : (
//             doubts.map((d) => (
//               <Box key={d._id} sx={{
//                 mb: 2.5, p: 3,
//                 background: "#fff", border: "1px solid #f0f0f0",
//                 borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
//               }}>
//                 <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, flexWrap: "wrap" }}>
//                   <Box sx={{ px: 1.4, py: 0.3, borderRadius: "8px", background: "#f4f4f6" }}>
//                     <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#555" }}>
//                       {d.username}
//                     </Typography>
//                   </Box>
//                   <Box sx={{ px: 1.4, py: 0.3, borderRadius: "8px", background: "#f9f9f9" }}>
//                     <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#aaa" }}>
//                       {d.subject}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#333", lineHeight: 1.7, mb: 2 }}>
//                   {d.message}
//                 </Typography>

//                 {d.replied ? (
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#2e7d32" }} />
//                     <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#2e7d32" }}>
//                       Replied
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <>
//                     <TextField
//                       fullWidth multiline rows={2}
//                       placeholder="Write your reply…"
//                       value={replyText[d._id] || ""}
//                       onChange={(e) => setReplyText({ ...replyText, [d._id]: e.target.value })}
//                       sx={{
//                         mb: 1.5,
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: "12px",
//                           fontFamily: "'DM Sans', sans-serif",
//                           fontSize: 13,
//                           "& fieldset": { borderColor: "#e8e8e8" },
//                           "&:hover fieldset": { borderColor: "#c0c0c0" },
//                           "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
//                         },
//                       }}
//                     />
//                     <Button
//                       variant="contained"
//                       onClick={() => sendReply(d._id)}
//                       sx={{
//                         background: "#1a1a2e", borderRadius: "12px",
//                         fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
//                         fontSize: 13, py: 1, px: 3, textTransform: "none",
//                         boxShadow: "none",
//                         "&:hover": { background: "#2d2d4e", boxShadow: "0 6px 18px rgba(26,26,46,0.22)" },
//                         transition: "all 0.2s ease",
//                       }}
//                     >
//                       Send Reply
//                     </Button>
//                   </>
//                 )}
//               </Box>
//             ))
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* ── AIMS MODAL ── */}
//       {renderListModal({
//         open: openAims,
//         onClose: () => setOpenAims(false),
//         title: "Aims of My Life",
//         icon: <TrackChangesIcon sx={{ color: "#fff", fontSize: 18 }} />,
//         items: aims,
//         newVal: newAim,
//         setNewVal: setNewAim,
//         onAdd: addAim,
//         onToggle: toggleAim,
//         onDelete: deleteAim,
//         placeholder: "Add your aim in life…",
//       })}

//       {/* ── TASKS MODAL ── */}
//       {renderListModal({
//         open: openTasks,
//         onClose: () => setOpenTasks(false),
//         title: "Today's Tasks",
//         icon: <AssignmentIcon sx={{ color: "#fff", fontSize: 18 }} />,
//         items: tasks,
//         newVal: newTask,
//         setNewVal: setNewTask,
//         onAdd: addTask,
//         onToggle: toggleTask,
//         onDelete: deleteTask,
//         placeholder: "Add your today's task…",
//       })}

//       <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
//         <Alert severity="success" sx={{ fontFamily: "'DM Sans', sans-serif", borderRadius: "12px" }}>
//           Message sent successfully!
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default AdminDashboard;



import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Snackbar, Alert,
  Autocomplete, Dialog, DialogTitle, DialogContent, Fade,
  Checkbox, IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ForumIcon from "@mui/icons-material/Forum";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import server from "../environment";
import { useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const [message,      setMessage]      = useState("");
  const [username,     setUsername]     = useState(null);
  const [users,        setUsers]        = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sending,      setSending]      = useState(false);

  const [doubts,     setDoubts]     = useState([]);
  const [replyText,  setReplyText]  = useState({});
  const [openDoubts, setOpenDoubts] = useState(false);

  // ── Aims state ──
  const [openAims, setOpenAims] = useState(false);
  const [aims,     setAims]     = useState([]);
  const [newAim,   setNewAim]   = useState("");

  // ── Tasks state ──
  const [openTasks, setOpenTasks] = useState(false);
  const [tasks,     setTasks]     = useState([]);
  const [newTask,   setNewTask]   = useState("");

  const location = useLocation();

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // ── fetch aims & tasks from MongoDB on mount ──
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await axios.get(`${server}/api/admin/list`, authHeader());
        setAims(res.data.aims   || []);
        setTasks(res.data.tasks || []);
      } catch (err) { console.error("Failed to fetch list", err); }
    };
    fetchList();
  }, []);

  /* ── fetch users ── */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${server}/api/admin/users`, authHeader());
        setUsers(res.data.users || []);
      } catch (err) { console.error("Failed to fetch users", err); }
    };
    fetchUsers();
  }, []);

  /* ── fetch doubts ── */
  const fetchDoubts = async () => {
    try {
      const res = await axios.get(`${server}/api/admin/doubts`, authHeader());
      setDoubts(res.data || []);
    } catch (err) { console.error("Failed to fetch doubts", err); }
  };
  useEffect(() => { fetchDoubts(); }, []);

  /* ── send message ── */
  const sendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await axios.post(
        `${server}/api/admin/send-message`,
        { text: message, toUsername: username || null },
        authHeader()
      );
      setSnackbarOpen(true);
      setMessage("");
      setUsername(null);
    } catch { alert("Failed to send message"); }
    finally { setSending(false); }
  };

  /* ── reply to doubt ── */
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
    } catch { alert("Failed to send reply"); }
  };

  /* ── AIMS CRUD ── */
  const addAim = async () => {
    if (!newAim.trim()) return;
    try {
      const res = await axios.post(`${server}/api/admin/list/aims`, { text: newAim.trim() }, authHeader());
      setAims(res.data);
      setNewAim("");
    } catch { alert("Failed to add aim"); }
  };

  const toggleAim = async (id) => {
    try {
      const res = await axios.patch(`${server}/api/admin/list/aims/${id}/toggle`, {}, authHeader());
      setAims(res.data);
    } catch { alert("Failed to update aim"); }
  };

  const deleteAim = async (id) => {
    try {
      const res = await axios.delete(`${server}/api/admin/list/aims/${id}`, authHeader());
      setAims(res.data);
    } catch { alert("Failed to delete aim"); }
  };

  /* ── TASKS CRUD ── */
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${server}/api/admin/list/tasks`, { text: newTask.trim() }, authHeader());
      setTasks(res.data);
      setNewTask("");
    } catch { alert("Failed to add task"); }
  };

  const toggleTask = async (id) => {
    try {
      const res = await axios.patch(`${server}/api/admin/list/tasks/${id}/toggle`, {}, authHeader());
      setTasks(res.data);
    } catch { alert("Failed to update task"); }
  };

  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`${server}/api/admin/list/tasks/${id}`, authHeader());
      setTasks(res.data);
    } catch { alert("Failed to delete task"); }
  };

  const unrepliedCount = doubts.filter((d) => !d.replied).length;

  /* ── shared styles ── */
  const itemBoxStyle = (completed) => ({
    display: "flex", alignItems: "center", gap: 1.5,
    p: 1.8, mb: 1.5,
    background: completed ? "#f9fdf9" : "#fff",
    border: `1px solid ${completed ? "#d4edda" : "#f0f0f0"}`,
    borderRadius: "14px",
    transition: "all 0.2s ease",
  });

  /* ── shared modal renderer ── */
  const renderListModal = ({ open, onClose, title, icon, items, newVal, setNewVal, onAdd, onToggle, onDelete, placeholder }) => (
    <Dialog
      open={open} onClose={onClose}
      maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "20px", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 32px 80px rgba(0,0,0,0.15)" } }}
    >
      <DialogTitle sx={{
        fontFamily: "'Playfair Display', serif", fontWeight: 800,
        fontSize: 20, color: "#1a1a2e", pb: 1, borderBottom: "1px solid #f0f0f0",
        display: "flex", alignItems: "center", gap: 1.5,
      }}>
        <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </Box>
        {title}
        <Box component="span" sx={{ ml: 1, px: 1.2, py: 0.3, borderRadius: "8px", background: "#f4f4f6", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#aaa", verticalAlign: "middle" }}>
          {items.length} total
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
          <TextField
            fullWidth placeholder={placeholder} value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onAdd(); }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                "& fieldset": { borderColor: "#e8e8e8" },
                "&:hover fieldset": { borderColor: "#c0c0c0" },
                "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
              },
            }}
          />
          <Button variant="contained" onClick={onAdd} sx={{ background: "#1a1a2e", borderRadius: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, px: 2.5, textTransform: "none", boxShadow: "none", whiteSpace: "nowrap", minWidth: "auto", "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" }, transition: "all 0.2s ease" }}>
            <AddIcon sx={{ fontSize: 20 }} /> Add
          </Button>
        </Box>

        {items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 44, color: "#e0e0e0", mb: 1 }} />
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#ccc" }}>Nothing added yet</Typography>
          </Box>
        ) : (
          items.map((item) => (
            <Box key={item._id} sx={itemBoxStyle(item.completed)}>
              <Checkbox
                checked={item.completed}
                onChange={() => onToggle(item._id)}
                sx={{ color: "#ddd", p: 0.5, "&.Mui-checked": { color: "#2e7d32" } }}
              />
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: item.completed ? "#aaa" : "#333", flex: 1, lineHeight: 1.6, textDecoration: item.completed ? "line-through" : "none", transition: "all 0.2s ease" }}>
                {item.text}
              </Typography>
              {item.completed && (
                <Box sx={{ px: 1.4, py: 0.3, borderRadius: "8px", background: "#e8f5e9", display: "flex", alignItems: "center", gap: 0.6 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 13, color: "#2e7d32" }} />
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#2e7d32" }}>Completed</Typography>
                </Box>
              )}
              <IconButton onClick={() => onDelete(item._id)} size="small" sx={{ color: "#ccc", borderRadius: "8px", p: 0.6, "&:hover": { color: "#e53935", background: "#fff0f0" }, transition: "all 0.18s ease" }}>
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .admin-card { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease !important; }
        .admin-card:hover { transform: translateY(-4px) !important; box-shadow: 0 18px 48px rgba(0,0,0,0.10) !important; }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <Fade in timeout={500}>
        <Box>
          {/* ── Page header ── */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontStyle: "normal", fontSize: 11, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5 }}>Admin Panel</Typography>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 26, sm: 32 }, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-1px" }}>Dashboard</Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#aaa", mt: 0.8 }}>Manage messages and respond to user doubts.</Typography>
          </Box>

          {/* ── Two columns ── */}
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" }, alignItems: "stretch" }}>

            {/* ── SEND MESSAGE CARD ── */}
            <Box className="admin-card" sx={{ flex: 1, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 3, sm: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: "13px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SendIcon sx={{ color: "#fff", fontSize: 19 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: "-0.3px" }}>Send Message</Typography>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>Broadcast or target a user</Typography>
                </Box>
                <Box sx={{ ml: "auto", px: 1.4, py: 0.4, borderRadius: "8px", background: "#f4f4f6" }}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.8px", textTransform: "uppercase" }}>Broadcast</Typography>
                </Box>
              </Box>

              <TextField fullWidth multiline rows={4} label="Message" value={message} onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, "& fieldset": { borderColor: "#e8e8e8" }, "&:hover fieldset": { borderColor: "#c0c0c0" }, "&.Mui-focused fieldset": { borderColor: "#1a1a2e" } }, "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", fontSize: 14 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" } }}
              />

              <Autocomplete
                options={users.map((u) => u.username)} value={username} onChange={(e, val) => setUsername(val)}
                renderInput={(params) => (
                  <TextField {...params} label="Select Username (optional)"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, "& fieldset": { borderColor: "#e8e8e8" }, "&:hover fieldset": { borderColor: "#c0c0c0" }, "&.Mui-focused fieldset": { borderColor: "#1a1a2e" } }, "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", fontSize: 14 }, "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" } }}
                  />
                )}
                sx={{ mb: 3 }}
              />

              <Button variant="contained" fullWidth onClick={sendMessage} disabled={sending}
                sx={{ background: "#1a1a2e", borderRadius: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, py: 1.5, textTransform: "none", boxShadow: "none", "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" }, "&:disabled": { background: "#ccc" }, transition: "all 0.2s ease" }}>
                {sending ? "Sending…" : "Send Message"}
              </Button>
            </Box>

            {/* ── USER DOUBTS CARD ── */}
            <Box className="admin-card" sx={{ flex: 1, background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 3, sm: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, textAlign: "center" }}>
              <Box sx={{ width: 64, height: 64, borderRadius: "20px", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                <ForumIcon sx={{ fontSize: 30, color: "#1a1a2e" }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#1a1a2e", letterSpacing: "-0.4px", mb: 0.5 }}>User Doubts</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>View and respond to questions raised by students.</Typography>
              </Box>
              {unrepliedCount > 0 && (
                <Box sx={{ px: 2, py: 0.6, borderRadius: "30px", background: "#1a1a2e", display: "inline-flex", alignItems: "center", gap: 0.8 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: "pulse 1.4s infinite" }} />
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff" }}>{unrepliedCount} pending {unrepliedCount === 1 ? "reply" : "replies"}</Typography>
                </Box>
              )}
              <Button variant="contained" onClick={() => setOpenDoubts(true)}
                sx={{ background: "#1a1a2e", borderRadius: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, py: 1.4, px: 5, textTransform: "none", boxShadow: "none", mt: 1, "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" }, transition: "all 0.2s ease" }}>
                View Messages
              </Button>
            </Box>
          </Box>

          {/* ── STATS STRIP ── */}
          <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
            {[
              { label: "Total Users",     value: users.length,                   tag: "Registered" },
              { label: "Total Doubts",    value: doubts.length,                  tag: "Received" },
              { label: "Pending Replies", value: unrepliedCount,                 tag: "Action needed" },
              { label: "Replied",         value: doubts.length - unrepliedCount, tag: "Resolved" },
            ].map(({ label, value, tag }) => (
              <Box key={label} className="admin-card" sx={{ flex: "1 1 140px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", p: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#ccc", letterSpacing: "1.2px", textTransform: "uppercase", mb: 0.5 }}>{tag}</Typography>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 28, color: "#1a1a2e", lineHeight: 1 }}>{value}</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa", mt: 0.5 }}>{label}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── AIMS & TASKS BUTTONS ── */}
          <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
            <Box className="admin-card" sx={{ flex: "1 1 200px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 2.5, sm: 3 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: "14px", background: "#f4f4f6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrackChangesIcon sx={{ fontSize: 24, color: "#1a1a2e" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#1a1a2e", letterSpacing: "-0.3px" }}>Aims of My Life</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>{aims.filter(a => a.completed).length}/{aims.length} completed</Typography>
              </Box>
              <Button variant="contained" onClick={() => setOpenAims(true)}
                sx={{ background: "#1a1a2e", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, py: 1.1, px: 2.5, textTransform: "none", boxShadow: "none", whiteSpace: "nowrap", "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" }, transition: "all 0.2s ease" }}>
                Open
              </Button>
            </Box>

            <Box className="admin-card" sx={{ flex: "1 1 200px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 2.5, sm: 3 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: "14px", background: "#f4f4f6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AssignmentIcon sx={{ fontSize: 24, color: "#1a1a2e" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#1a1a2e", letterSpacing: "-0.3px" }}>Today's Tasks</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>{tasks.filter(t => t.completed).length}/{tasks.length} completed</Typography>
              </Box>
              <Button variant="contained" onClick={() => setOpenTasks(true)}
                sx={{ background: "#1a1a2e", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, py: 1.1, px: 2.5, textTransform: "none", boxShadow: "none", whiteSpace: "nowrap", "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" }, transition: "all 0.2s ease" }}>
                Open
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* ── DOUBTS MODAL ── */}
      <Dialog open={openDoubts} onClose={() => setOpenDoubts(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "20px", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 32px 80px rgba(0,0,0,0.15)" } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, color: "#1a1a2e", pb: 1, borderBottom: "1px solid #f0f0f0" }}>
          User Doubts
          {unrepliedCount > 0 && (
            <Box component="span" sx={{ ml: 1.5, px: 1.2, py: 0.3, borderRadius: "8px", background: "#1a1a2e", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#fff", verticalAlign: "middle" }}>
              {unrepliedCount} pending
            </Box>
          )}
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
                <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, flexWrap: "wrap" }}>
                  <Box sx={{ px: 1.4, py: 0.3, borderRadius: "8px", background: "#f4f4f6" }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#555" }}>{d.username}</Typography>
                  </Box>
                  <Box sx={{ px: 1.4, py: 0.3, borderRadius: "8px", background: "#f9f9f9" }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#aaa" }}>{d.subject}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#333", lineHeight: 1.7, mb: 2 }}>{d.message}</Typography>
                {d.replied ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#2e7d32" }} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#2e7d32" }}>Replied</Typography>
                  </Box>
                ) : (
                  <>
                    <TextField fullWidth multiline rows={2} placeholder="Write your reply…" value={replyText[d._id] || ""} onChange={(e) => setReplyText({ ...replyText, [d._id]: e.target.value })}
                      sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, "& fieldset": { borderColor: "#e8e8e8" }, "&:hover fieldset": { borderColor: "#c0c0c0" }, "&.Mui-focused fieldset": { borderColor: "#1a1a2e" } } }}
                    />
                    <Button variant="contained" onClick={() => sendReply(d._id)}
                      sx={{ background: "#1a1a2e", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, py: 1, px: 3, textTransform: "none", boxShadow: "none", "&:hover": { background: "#2d2d4e", boxShadow: "0 6px 18px rgba(26,26,46,0.22)" }, transition: "all 0.2s ease" }}>
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
        <Alert severity="success" sx={{ fontFamily: "'DM Sans', sans-serif", borderRadius: "12px" }}>Message sent successfully!</Alert>
      </Snackbar>
    </>
  );
};

export default AdminDashboard;