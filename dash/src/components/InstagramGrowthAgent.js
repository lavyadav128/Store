import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, Divider, FormControl, InputLabel, MenuItem,
  Paper, Select, Snackbar, Switch, TextField, Typography,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import server from "../environment";

const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` });
const card = { borderRadius: "20px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", p: { xs: 2, sm: 3 }, background: "#fff" };
const title = { fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#1a1a2e" };
const field = { "& .MuiOutlinedInput-root": { borderRadius: "13px", fontFamily: "'DM Sans', sans-serif" }, "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif" } };

export default function InstagramGrowthAgent() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [topic, setTopic] = useState("");
  const [draftType, setDraftType] = useState("post");
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });
  const notify = (text, severity = "success") => setSnack({ open: true, text, severity });

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${server}/api/instagram-agent/overview`, { headers: authHeaders() });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load Instagram agent.");
      setData(payload); setConfig(payload.config);
    } catch (error) { notify(error.message, "error"); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const request = async (path, method = "POST", body) => {
    const response = await fetch(`${server}/api/instagram-agent${path}`, { method, headers: authHeaders(), body: body === undefined ? undefined : JSON.stringify(body) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Request failed.");
    return payload;
  };
  const saveConfig = async () => { try { setSaving(true); const updated = await request("/config", "PUT", config); setConfig(updated); notify("Instagram agent settings saved."); await load(); } catch (error) { notify(error.message, "error"); } finally { setSaving(false); } };
  const setRunning = async (running) => { try { setSaving(true); await request(running ? "/start" : "/stop"); notify(running ? "Agent started. It will draft daily content and publish only ready items with media." : "Agent stopped. Scheduled drafting and publishing are disabled."); await load(); } catch (error) { notify(error.message, "error"); } finally { setSaving(false); } };
  const generate = async () => { try { setSaving(true); await request("/content/generate", "POST", { topic, type: draftType }); setTopic(""); notify("AI content draft created. Add a public media URL before publishing."); await load(); } catch (error) { notify(error.message, "error"); } finally { setSaving(false); } };
  const generateMedia = async (content) => { try { setSaving(true); await request(`/content/${content._id}/generate-media`); notify("AI media generated and uploaded to Cloudinary."); await load(); } catch (error) { notify(error.message, "error"); } finally { setSaving(false); } };
  const updateContent = async (content, updates) => { try { await request(`/content/${content._id}`, "PATCH", updates); await load(); } catch (error) { notify(error.message, "error"); } };
  const publish = async (content) => { try { setSaving(true); await request(`/content/${content._id}/publish`); notify("Content published to Instagram."); await load(); } catch (error) { notify(error.message, "error"); } finally { setSaving(false); } };
  const reviewPromotion = async (item, status) => { try { await request(`/promotions/${item._id}`, "PATCH", { status }); notify(`Promotion request ${status}.`); await load(); } catch (error) { notify(error.message, "error"); } };

  if (!data || !config) return <Box sx={{ p: 4, fontFamily: "'DM Sans', sans-serif" }}>Loading Instagram Growth Agent…</Box>;
  const { account, content, promotions, activities, apiConfigured } = data;
  const set = (key, value) => setConfig((previous) => ({ ...previous, [key]: value }));

  return <Box sx={{ maxWidth: 1200, mx: "auto", pb: 4 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, flexWrap: "wrap", mb: 3 }}>
      <Box>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 800, color: "#999", letterSpacing: "1.5px" }}>OFFICIAL META API · ADMIN ONLY</Typography>
        <Typography sx={{ ...title, fontSize: { xs: 26, sm: 32 }, mt: 0.4 }}>Instagram Growth Agent</Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", mt: 0.6 }}>Plans valuable content, measures results, and publishes only through your connected professional account.</Typography>
      </Box>
      <Button onClick={load} startIcon={<RefreshIcon />} sx={{ borderRadius: "12px", textTransform: "none", color: "#1a1a2e", fontWeight: 700 }}>Refresh live data</Button>
    </Box>

    {!apiConfigured && <Alert severity="warning" sx={{ mb: 3, borderRadius: "14px" }}>Instagram is not connected yet. Add the required Meta credentials to the backend environment; the agent cannot start or publish until then.</Alert>}

    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
      {[['Followers', account.followers ?? '—'], ['Reach', account.reach ?? '—'], ['Engaged', account.engagement ?? '—'], ['Published media', account.mediaCount ?? '—']].map(([label, value]) => <Paper key={label} sx={card}><Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#999", textTransform: "uppercase", fontWeight: 800 }}>{label}</Typography><Typography sx={{ ...title, fontSize: 26, mt: 0.3 }}>{Number.isFinite(value) ? Number(value).toLocaleString() : value}</Typography></Paper>)}
    </Box>

    <Paper sx={{ ...card, mb: 3, border: config.running ? "1px solid #1a1a2e" : "1px solid #f0f0f0" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}><Box sx={{ width: 38, height: 38, borderRadius: "12px", display: "grid", placeItems: "center", background: "#1a1a2e" }}><InstagramIcon sx={{ color: "#fff" }} /></Box><Box><Typography sx={{ ...title, fontSize: 18 }}>Account Strategy & Controls</Typography><Chip size="small" label={config.running ? "Running" : "Stopped"} sx={{ mt: .4, fontWeight: 700, bgcolor: config.running ? "#1a1a2e" : "#f1f1f3", color: config.running ? "#fff" : "#555" }} /></Box></Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField label="Niche *" value={config.niche} onChange={(e) => set("niche", e.target.value)} placeholder="e.g. JEE preparation and study skills" sx={field} fullWidth />
        <TextField label="Target audience" value={config.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} placeholder="e.g. Class 11–12 JEE aspirants" sx={field} fullWidth />
        <TextField label="Brand voice" value={config.brandVoice} onChange={(e) => set("brandVoice", e.target.value)} sx={field} fullWidth />
        <FormControl fullWidth sx={field}><InputLabel>Content mode</InputLabel><Select label="Content mode" value={config.contentMode} onChange={(e) => set("contentMode", e.target.value)}><MenuItem value="post">Posts</MenuItem><MenuItem value="reel">Reels</MenuItem><MenuItem value="both">Posts & Reels</MenuItem></Select></FormControl>
        <TextField label="Daily drafts (1–3)" type="number" value={config.postsPerDay} onChange={(e) => set("postsPerDay", e.target.value)} inputProps={{ min: 1, max: 3 }} sx={field} fullWidth />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}><Switch checked={config.autoReplyComments} onChange={(e) => set("autoReplyComments", e.target.checked)} /><Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Reply to permitted comments</Typography><Switch checked={config.autoReplyMessages} onChange={(e) => set("autoReplyMessages", e.target.checked)} /><Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Reply to permitted DMs</Typography></Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1.2, mt: 2.5, flexWrap: "wrap" }}><Button variant="outlined" onClick={saveConfig} disabled={saving} sx={{ borderRadius: "12px", textTransform: "none", color: "#1a1a2e", borderColor: "#1a1a2e", fontWeight: 700 }}>Save strategy</Button><Button variant="contained" startIcon={config.running ? <StopIcon /> : <PlayArrowIcon />} disabled={saving} onClick={() => setRunning(!config.running)} sx={{ borderRadius: "12px", textTransform: "none", bgcolor: config.running ? "#8a2d2d" : "#1a1a2e", fontWeight: 700 }}>{config.running ? "Stop agent" : "Start agent"}</Button></Box>
    </Paper>

    <Paper sx={{ ...card, mb: 3 }}><Typography sx={{ ...title, fontSize: 18, mb: 1 }}>AI Content Studio</Typography><Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", fontSize: 13, mb: 2 }}>The agent generates the caption and media, uploads the asset to Cloudinary, then queues it for official Meta publishing. A public media URL can still be supplied manually if needed.</Typography><Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}><TextField label="Optional topic" value={topic} onChange={(e) => setTopic(e.target.value)} sx={{ ...field, flex: 1, minWidth: 220 }} /><FormControl sx={{ ...field, minWidth: 130 }}><InputLabel>Format</InputLabel><Select label="Format" value={draftType} onChange={(e) => setDraftType(e.target.value)}><MenuItem value="post">Post</MenuItem><MenuItem value="reel">Reel</MenuItem></Select></FormControl><Button variant="contained" startIcon={<AutoAwesomeIcon />} onClick={generate} disabled={saving} sx={{ borderRadius: "12px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}>Create & upload</Button></Box></Paper>

    <Paper sx={{ ...card, mb: 3 }}><Typography sx={{ ...title, fontSize: 18, mb: 2 }}>Content Queue</Typography>{content.length === 0 ? <Typography sx={{ color: "#888" }}>No drafts yet. Set a niche and create your first draft.</Typography> : content.map((item) => <Box key={item._id} sx={{ borderTop: "1px solid #f0f0f0", pt: 2, mt: 2 }}><Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}><Box><Chip label={`${item.type} · ${item.status}`} size="small" sx={{ fontWeight: 700, mr: 1 }} /><Typography component="span" sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{item.topic}</Typography></Box><Typography sx={{ fontSize: 12, color: "#888" }}>{item.error || item.mediaGenerationError || ""}</Typography></Box><Typography sx={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", fontSize: 13, mt: 1 }}>{item.caption}</Typography><Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", fontSize: 12, mt: 1 }}>{item.creativeBrief}</Typography>{item.reelScript && <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 12, mt: 1 }}>Reel: {item.reelScript}</Typography>}<Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}><TextField label="Public media URL" defaultValue={item.assetUrl} onBlur={(e) => e.target.value !== item.assetUrl && updateContent(item, { assetUrl: e.target.value, assetSource: "admin", status: e.target.value ? "ready" : "draft" })} sx={{ ...field, flex: 1, minWidth: 210 }} size="small" /><Button onClick={() => generateMedia(item)} disabled={saving || item.mediaGenerationStatus === "generating" || item.status === "published"} sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}>Generate media</Button><Button onClick={() => publish(item)} disabled={saving || !item.assetUrl || !config.running || item.status === "published"} sx={{ borderRadius: "10px", textTransform: "none", bgcolor: "#1a1a2e", color: "#fff", fontWeight: 700, "&:hover": { bgcolor: "#2d2d4e" } }}>Publish</Button></Box></Box>)}</Paper>

    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
      <Paper sx={card}><Typography sx={{ ...title, fontSize: 18, mb: 1 }}>Brand & Promotion Approval</Typography><Typography sx={{ fontSize: 12, color: "#777", mb: 1.5 }}>The agent never accepts promotional offers or makes commitments. Every detected request stays pending until you decide.</Typography>{promotions.length === 0 ? <Typography sx={{ color: "#888", fontSize: 13 }}>No promotion requests.</Typography> : promotions.map((item) => <Box key={item._id} sx={{ borderTop: "1px solid #eee", py: 1.4 }}><Typography sx={{ fontSize: 13, fontWeight: 700 }}>{item.senderName || item.senderId} <Chip label={item.status} size="small" sx={{ ml: .8 }} /></Typography><Typography sx={{ fontSize: 12, color: "#666", mt: .5 }}>{item.message}</Typography>{item.status === "pending" && <Box sx={{ mt: 1 }}><Button onClick={() => reviewPromotion(item, "approved")} size="small">Approve review</Button><Button onClick={() => reviewPromotion(item, "declined")} size="small" color="inherit">Decline</Button></Box>}</Box>)}</Paper>
      <Paper sx={card}><Typography sx={{ ...title, fontSize: 18, mb: 1 }}>Agent Audit Feed</Typography>{activities.length === 0 ? <Typography sx={{ color: "#888", fontSize: 13 }}>No agent activity yet.</Typography> : activities.slice(0, 8).map((item) => <Box key={item._id} sx={{ borderTop: "1px solid #eee", py: 1.15 }}><Typography sx={{ fontSize: 13, fontWeight: 700 }}>{item.message}</Typography><Typography sx={{ fontSize: 11, color: "#999", mt: .3 }}>{new Date(item.createdAt).toLocaleString()}</Typography></Box>)}</Paper>
    </Box>
    <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack((value) => ({ ...value, open: false }))}><Alert severity={snack.severity} sx={{ borderRadius: "12px" }}>{snack.text}</Alert></Snackbar>
  </Box>;
}
