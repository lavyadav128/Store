import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CampaignIcon from "@mui/icons-material/Campaign";
import ScheduleIcon from "@mui/icons-material/Schedule";
import server from "../../shared/environment";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const whiteCard = {
  borderRadius: "16px",
  border: "1px solid #e4e4e7",
  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  p: { xs: 2.5, sm: 3.5 },
  bgcolor: "#ffffff",
  color: "#09090b",
};

const titleStyle = {
  fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 800,
  color: "#09090b",
  letterSpacing: "-0.5px",
};

const field = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: "'DM Sans', sans-serif",
    bgcolor: "#fafafa",
    "& fieldset": { borderColor: "#e4e4e7" },
    "&:hover fieldset": { borderColor: "#a1a1aa" },
    "&.Mui-focused fieldset": { borderColor: "#09090b" },
  },
  "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", color: "#71717a" },
};

const NATURE_REALMS = [
  { id: "morning", title: "🌅 Nature's Morning", realm: "🌅 Nature's Morning" },
  { id: "sunset", title: "🌄 Sunset of the Day", realm: "🌄 Sunset of the Day" },
  { id: "wildlife", title: "🦌 Wildlife Moments", realm: "🦌 Wildlife Moments" },
  { id: "forest", title: "🌲 Hidden Forests", realm: "🌲 Hidden Forests" },
  { id: "ocean", title: "🌊 Ocean Diaries", realm: "🌊 Ocean Diaries" },
  { id: "rain", title: "🌧️ Rainy Nature", realm: "🌧️ Rainy Nature" },
  { id: "night", title: "🌌 Nature at Night", realm: "🌌 Nature at Night" },
  { id: "tiny", title: "🦋 Tiny Wonders", realm: "🦋 Tiny Wonders" },
  { id: "mountains", title: "🏔️ Mountain Stories", realm: "🏔️ Mountain Stories" },
  { id: "seasons", title: "🍂 Earth Through the Seasons", realm: "🍂 Earth Through the Seasons" },
  { id: "world_wildlife", title: "🐘 Wildlife Around the World", realm: "🐘 Wildlife Around the World" },
  { id: "one_planet", title: "🌍 One Planet, Many Worlds", realm: "🌍 One Planet, Many Worlds" },
];

export default function InstagramGrowthAgent() {
  const [data, setData] = useState({
    account: { connected: true, username: "", followers: null, reach: null, mediaCount: null },
    content: [],
    promotions: [],
    activities: [],
    accountError: "",
  });
  const [config, setConfig] = useState({
    running: false,
    dailyPostTime: "12:00",
    niche: "Nature, Wildlife & Earth Cinematography",
    autoReplyComments: true,
    autoReplyMessages: true,
  });
  const [growthAnalysis, setGrowthAnalysis] = useState({
    growthStatus: "🌱 Growth Active",
    growthBadgeColor: "#22c55e",
    growthSummary: "Autonomous daily 1-reel scheduler is ready. Upload videos to the queue to begin publishing.",
    topCategory: "🌅 Nature's Morning",
    recommendation: "Maintain a steady daily 12:00 PM (12 Noon IST) posting schedule for optimal Instagram Reels distribution.",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });

  const notify = (text, severity = "success") => setSnack({ open: true, text, severity });

  const [liveFollowers, setLiveFollowers] = useState(null);
  const [hasFollowerIncremented, setHasFollowerIncremented] = useState(false);
  const [lastFollowerCheck, setLastFollowerCheck] = useState(null);

  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [exchangingToken, setExchangingToken] = useState(false);
  const [longLivedResult, setLongLivedResult] = useState(null);

  const [uploadFiles, setUploadFiles] = useState([]);
  const [globalRealm, setGlobalRealm] = useState("🌅 Nature's Morning");
  const [globalAspectRatio, setGlobalAspectRatio] = useState("9:16");
  const [uploadingReel, setUploadingReel] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const fileInputRef = useRef(null);

  const [cinemaModalOpen, setCinemaModalOpen] = useState(false);
  const [cinemaItem, setCinemaItem] = useState(null);

  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [collabNote, setCollabNote] = useState("");
  const [reviewingCollab, setReviewingCollab] = useState(false);

  const fetchLiveFollowers = useCallback(async () => {
    try {
      const res = await fetch(`${server}/api/instagram-agent/live-followers`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.followers !== null && payload.followers !== undefined) {
          setLiveFollowers((prev) => {
            if (prev !== null && payload.followers > prev) {
              setHasFollowerIncremented(true);
              setTimeout(() => setHasFollowerIncremented(false), 8000);
            }
            return payload.followers;
          });
          setLastFollowerCheck(new Date().toLocaleTimeString());
        }
      }
    } catch (_) {}
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${server}/api/instagram-agent/overview`, {
        headers: authHeaders(),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load Instagram agent.");
      setData(payload);
      if (payload.config) setConfig(payload.config);

      if (payload.account?.followers !== null && payload.account?.followers !== undefined) {
        setLiveFollowers(payload.account.followers);
        setLastFollowerCheck(new Date().toLocaleTimeString());
      }

      try {
        const gRes = await fetch(`${server}/api/instagram-agent/analytics/growth`, {
          headers: authHeaders(),
        });
        if (gRes.ok) {
          const gData = await gRes.json();
          setGrowthAnalysis(gData);
        }
      } catch (_) {}
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    fetchLiveFollowers();
    const timer = setInterval(() => {
      fetchLiveFollowers();
    }, 8000);
    return () => clearInterval(timer);
  }, [load, fetchLiveFollowers]);

  const request = async (path, method = "POST", body) => {
    const response = await fetch(`${server}/api/instagram-agent${path}`, {
      method,
      headers: authHeaders(),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Request failed.");
    return payload;
  };

  const handleMultipleVideoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newEntries = files.map((file, idx) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      return {
        id: `${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        previewUrl: URL.createObjectURL(file),
        realm: globalRealm,
        aspectRatio: globalAspectRatio,
        topic: cleanName,
        caption: "",
      };
    });

    setUploadFiles((prev) => [...prev, ...newEntries]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    notify(`Added ${files.length} video(s) to upload staging.`);
  };

  const handleRemoveStagedFile = (id) => {
    setUploadFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleClearAllStaged = () => {
    uploadFiles.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setUploadFiles([]);
  };

  const updateStagedItem = (id, fieldName, value) => {
    setUploadFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [fieldName]: value } : item))
    );
  };

  const handleUploadAllToQueue = async (publishFirstImmediately = false) => {
    if (!uploadFiles.length) {
      notify("Please select one or more video files to queue.", "warning");
      return;
    }

    setUploadingReel(true);
    let successCount = 0;
    let firstUploadedId = null;
    const uploadedIds = [];
    const uploadErrors = [];

    // Fetch signed direct Cloudinary upload credentials to bypass cloud hosting/Render upload timeouts
    let sigData = null;
    try {
      const sigRes = await fetch(`${server}/api/instagram-agent/cloudinary/signature`, {
        headers: authHeaders(),
      });
      if (sigRes.ok) {
        sigData = await sigRes.json();
      }
    } catch (_) {}

    for (let i = 0; i < uploadFiles.length; i++) {
      const item = uploadFiles[i];
      setUploadProgressText(`Uploading video ${i + 1} of ${uploadFiles.length}: "${item.topic}" (${item.aspectRatio || globalAspectRatio})...`);

      try {
        let directVideoUrl = "";

        // Fast Direct Edge Upload to Cloudinary if signature available (10x faster, zero timeout on Render)
        if (sigData?.cloudName && sigData?.signature && item.file) {
          try {
            const cFormData = new FormData();
            cFormData.append("file", item.file);
            cFormData.append("api_key", sigData.apiKey);
            cFormData.append("timestamp", sigData.timestamp);
            cFormData.append("signature", sigData.signature);
            cFormData.append("folder", sigData.folder || "instagram-agent/admin-reels");

            const cUploadRes = await fetch(
              `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`,
              {
                method: "POST",
                body: cFormData,
              }
            );

            if (cUploadRes.ok) {
              const cUploadJson = await cUploadRes.json();
              if (cUploadJson.secure_url) {
                directVideoUrl = cUploadJson.secure_url;
              }
            }
          } catch (cErr) {
            console.warn(`[Cloudinary Direct Upload fallback for ${item.topic}]:`, cErr.message);
          }
        }

        let res;
        const token = localStorage.getItem("token") || "";
        if (directVideoUrl) {
          res = await fetch(`${server}/api/instagram-agent/content/upload-reel`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              videoUrl: directVideoUrl,
              category: item.realm || globalRealm,
              topic: item.topic,
              caption: item.caption,
              aspectRatio: item.aspectRatio || globalAspectRatio,
            }),
          });
        } else {
          const formData = new FormData();
          formData.append("video", item.file);
          formData.append("category", item.realm || globalRealm);
          formData.append("topic", item.topic);
          formData.append("caption", item.caption);
          formData.append("aspectRatio", item.aspectRatio || globalAspectRatio);

          res = await fetch(`${server}/api/instagram-agent/content/upload-reel`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          });
        }

        const rawText = await res.text();
        let parsed;
        try {
          parsed = JSON.parse(rawText);
        } catch (_) {
          throw new Error(res.statusText || `Server error during upload of video ${i + 1}`);
        }

        if (!res.ok) throw new Error(parsed.error || `Failed to upload video ${i + 1}`);

        if (i === 0 && parsed?._id) firstUploadedId = parsed._id;
        uploadedIds.push(item.id);
        successCount++;
      } catch (err) {
        console.error(`[Upload Failed for "${item.topic}"]:`, err.message);
        uploadErrors.push(`"${item.topic}": ${err.message}`);
      }
    }

    try {
      if (publishFirstImmediately && firstUploadedId) {
        setUploadProgressText("Publishing 1st reel immediately to Instagram...");
        await request(`/content/${firstUploadedId}/publish`, "POST");
        notify(`🎉 1st Reel published to Instagram & ${successCount - 1} reels queued for upcoming days!`, "success");
      } else if (successCount > 0) {
        if (uploadErrors.length === 0) {
          notify(`✅ Successfully queued all ${successCount} daily video reel(s)! (Strict 1 post per day schedule).`, "success");
        } else {
          notify(`⚠️ Queued ${successCount} video(s). ${uploadErrors.length} video(s) failed (retained in staging).`, "warning");
        }
      } else if (uploadErrors.length > 0) {
        notify(`Upload failed: ${uploadErrors[0]}`, "error");
      }

      // Remove successfully uploaded items from staging list
      setUploadFiles((prev) => prev.filter((f) => !uploadedIds.includes(f.id)));
      await load();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setUploadingReel(false);
      setUploadProgressText("");
    }
  };

  const publishNow = async (contentId) => {
    setSaving(true);
    try {
      const published = await request(`/content/${contentId}/publish`, "POST");
      notify(`Published Reel to Instagram: "${published.topic}". Cloudinary asset cleaned up.`, "success");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async (contentId) => {
    setSaving(true);
    try {
      await request(`/content/${contentId}`, "DELETE");
      notify("Removed reel from queue.", "info");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReviewCollab = async (status) => {
    if (!selectedCollab) return;
    setReviewingCollab(true);
    try {
      await fetch(`${server}/api/instagram-agent/promotions/${selectedCollab._id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status, adminNote: collabNote }),
      });
      notify(`Brand inquiry marked as ${status.toUpperCase()}!`, "success");
      setCollabModalOpen(false);
      setSelectedCollab(null);
      setCollabNote("");
      await load();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setReviewingCollab(false);
    }
  };

  const setConfigField = (key, val) => setConfig((prev) => ({ ...prev, [key]: val }));

  const saveConfig = async () => {
    setSaving(true);
    try {
      await request("/config", "POST", config);
      notify("Instagram Growth Agent settings saved successfully.");
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleAgent = async () => {
    setSaving(true);
    try {
      if (config.running) {
        await request("/stop", "POST");
        notify("Instagram Daily Scheduler paused.");
      } else {
        await request("/start", "POST");
        notify("Instagram 12-Series Daily Runner started! (Strict 1 post/day at 12:00 PM Noon IST).");
      }
      await load();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExchangeLongLivedToken = async () => {
    setTokenModalOpen(true);
    setExchangingToken(true);
    setLongLivedResult(null);
    try {
      const res = await request("/token/long-lived", "POST");
      setLongLivedResult(res);
      notify("60-Day Meta token generated successfully!", "success");
      await load();
    } catch (err) {
      setLongLivedResult({ error: err.message });
      notify(err.message, "error");
    } finally {
      setExchangingToken(false);
    }
  };

  const openCinemaModal = (item) => {
    setCinemaItem(item);
    setCinemaModalOpen(true);
  };

  const closeCinemaModal = () => {
    setCinemaModalOpen(false);
    setCinemaItem(null);
  };

  const { account, accountError, content = [], promotions = [], activities = [] } = data || {};
  
  const queuedItems = (content || []).filter((c) => c.status !== "published" && c.assetUrl);
  const publishedItems = (content || []).filter((c) => c.status === "published");
  const currentFollowersDisplay = liveFollowers ?? account?.followers;

  return (
    <Box sx={{ maxWidth: "1280px", margin: "0 auto", p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase", letterSpacing: "1px" }}>
            Instagram Nature Studio · Daily 1-Post Queue Engine
          </Typography>
          <Typography sx={{ ...titleStyle, fontSize: { xs: 24, sm: 30 }, mt: 0.3 }}>
            Instagram Nature Studio & Growth Agent
          </Typography>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mt: 0.5 }}>
            Automated 12-Series Nature Reels · Strict 1 Reel/Day · Cloudinary Auto-Cleanup · Brand Collabs & Community Auto-Replies
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon fontSize="small" />}
            onClick={load}
            sx={{ borderRadius: "8px", textTransform: "none", color: "#09090b", borderColor: "#d4d4d8", fontWeight: 700, bgcolor: "#ffffff" }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<VpnKeyIcon fontSize="small" />}
            onClick={handleExchangeLongLivedToken}
            sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#09090b", color: "#ffffff", fontWeight: 700 }}
          >
            60-Day Token
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                  animation: "pulse 1.8s infinite",
                  "@keyframes pulse": { "0%": { opacity: 0.4 }, "50%": { opacity: 1 }, "100%": { opacity: 0.4 } },
                }}
              />
              <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
                Live Followers
              </Typography>
            </Box>
            <PeopleAltOutlinedIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 30,
              fontWeight: 900,
              color: hasFollowerIncremented ? "#22c55e" : "#09090b",
              transition: "color 0.4s ease",
            }}
          >
            {currentFollowersDisplay !== null && currentFollowersDisplay !== undefined
              ? Number(currentFollowersDisplay).toLocaleString()
              : (loading ? "..." : "0")}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>
            {account?.username ? `@${account.username}` : "@quietframes.ai"} {lastFollowerCheck ? `· ${lastFollowerCheck}` : ""}
          </Typography>
        </Paper>

        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Growth Status
            </Typography>
            <TrendingUpIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 800, color: growthAnalysis?.growthBadgeColor || "#09090b", mt: 0.5 }}>
            {growthAnalysis?.growthStatus || "🌱 Growth Active"}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 1 }}>
            {growthAnalysis?.reach ? `${Number(growthAnalysis.reach).toLocaleString()} unique reach` : "Daily growth tracking active"}
          </Typography>
        </Paper>

        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Upcoming Queue
            </Typography>
            <ScheduleIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 30, fontWeight: 900, color: "#09090b" }}>
            {queuedItems.length}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>
            Daily Reels lined up in queue
          </Typography>
        </Paper>

        <Paper sx={{ ...whiteCard, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Daily Runner
            </Typography>
            <LoopIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 800, color: config.running ? "#16a34a" : "#71717a", mt: 0.5 }}>
            {config.running ? "Active (1/Day)" : "Paused"}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 1 }}>
            Posts exactly 1 reel daily at {config.dailyPostTime || "12:00"} (12:00 PM Noon IST)
          </Typography>
        </Paper>
      </Box>

      {growthAnalysis && (
        <Paper sx={{ ...whiteCard, mb: 3, bgcolor: "#09090b", color: "#ffffff", borderColor: "#27272a" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesomeIcon sx={{ color: "#22c55e", fontSize: 20 }} />
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16, color: "#ffffff" }}>
                AI Channel Growth Advisor · Performance Intel
              </Typography>
            </Box>
            <Chip
              label={growthAnalysis.growthStatus}
              size="small"
              sx={{ bgcolor: "#27272a", color: "#ffffff", fontWeight: 700, fontSize: 11 }}
            />
          </Box>
          <Typography sx={{ fontSize: 13.5, color: "#e4e4e7", lineHeight: 1.6, mb: 1.5 }}>
            {growthAnalysis.growthSummary}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", pt: 1, borderTop: "1px solid #27272a" }}>
            <Typography sx={{ fontSize: 12, color: "#a1a1aa" }}>
              ⭐ Top Audience Realm: <strong style={{ color: "#ffffff" }}>{growthAnalysis.topCategory}</strong>
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#a1a1aa" }}>
              💡 Growth Tip: <span style={{ color: "#d4d4d8" }}>{growthAnalysis.recommendation}</span>
            </Typography>
          </Box>
        </Paper>
      )}

      {accountError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: "12px", border: "1px solid #e4e4e7" }}>
          {accountError}
        </Alert>
      )}

      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CloudUploadIcon sx={{ color: "#09090b", fontSize: 22 }} />
            <Typography sx={{ ...titleStyle, fontSize: 18 }}>
              Multi-Video Queue Uploader · 12-Series Nature Reels
            </Typography>
          </Box>
          <Chip label="Strict 1 Post / Day" size="small" sx={{ bgcolor: "#f4f4f5", color: "#09090b", fontWeight: 700, fontSize: 11 }} />
        </Box>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mb: 2.5 }}>
          Upload multiple videos at once. The agent will queue them sequentially (Day 1, Day 2, Day 3...), automatically generating viral captions, tags, and soundscapes. The agent posts <strong>strictly ONE Reel per day</strong> and cleans up Cloudinary storage automatically after publishing.
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr 1fr" }, gap: 2, mb: 2 }}>
          <FormControl sx={field} fullWidth>
            <InputLabel>Default 12-Series Realm ⭐</InputLabel>
            <Select
              label="Default 12-Series Realm ⭐"
              value={globalRealm}
              onChange={(e) => setGlobalRealm(e.target.value)}
            >
              {NATURE_REALMS.map((r) => (
                <MenuItem key={r.id} value={r.realm}>
                  {r.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Aspect Ratio Format Selector */}
          <FormControl sx={field} fullWidth>
            <InputLabel>Reel Format / Aspect Ratio 📐</InputLabel>
            <Select
              label="Reel Format / Aspect Ratio 📐"
              value={globalAspectRatio}
              onChange={(e) => setGlobalAspectRatio(e.target.value)}
            >
              <MenuItem value="9:16">📱 9:16 Vertical Reel (Instagram Standard)</MenuItem>
              <MenuItem value="16:9">🖥️ 16:9 Landscape / Widescreen</MenuItem>
            </Select>
          </FormControl>

          {/* Multiple File Dropzone Button */}
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<CloudUploadIcon />}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 13,
              borderColor: "#09090b",
              color: "#09090b",
              bgcolor: "#fafafa",
              "&:hover": { bgcolor: "#f4f4f5", borderColor: "#09090b" },
              minHeight: 52,
            }}
          >
            {uploadFiles.length > 0 ? "📁 Add More Videos" : "Select Videos (.mp4, .mov)"}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleMultipleVideoSelect}
            accept="video/*"
            multiple
            style={{ display: "none" }}
          />
        </Box>

        {uploadFiles.length > 0 && (
          <Box sx={{ mb: 2.5, p: 2, bgcolor: "#fafafa", borderRadius: "12px", border: "1px solid #e4e4e7" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#09090b" }}>
                Staged Videos for Daily Queue ({uploadFiles.length} videos staged)
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<CloudUploadIcon fontSize="small" />}
                  sx={{ color: "#09090b", textTransform: "none", fontSize: 11, fontWeight: 700 }}
                >
                  + Add More Videos
                </Button>
                <Button size="small" onClick={handleClearAllStaged} sx={{ color: "#ef4444", textTransform: "none", fontSize: 11, fontWeight: 700 }}>
                  Clear All
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {uploadFiles.map((item, idx) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "60px 1.4fr 1fr 110px auto" },
                    gap: 1.5,
                    alignItems: "center",
                    p: 1.2,
                    bgcolor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e4e4e7",
                  }}
                >
                  <Chip label={`Day +${idx + 1}`} size="small" sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 10 }} />
                  <TextField
                    size="small"
                    label="Reel Topic"
                    value={item.topic}
                    onChange={(e) => updateStagedItem(item.id, "topic", e.target.value)}
                    sx={field}
                    fullWidth
                  />
                  <FormControl size="small" sx={field} fullWidth>
                    <Select
                      value={item.realm}
                      onChange={(e) => updateStagedItem(item.id, "realm", e.target.value)}
                    >
                      {NATURE_REALMS.map((r) => (
                        <MenuItem key={r.id} value={r.realm}>
                          {r.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={field} fullWidth>
                    <Select
                      value={item.aspectRatio || "9:16"}
                      onChange={(e) => updateStagedItem(item.id, "aspectRatio", e.target.value)}
                    >
                      <MenuItem value="9:16">📱 9:16</MenuItem>
                      <MenuItem value="16:9">🖥️ 16:9</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton size="small" onClick={() => handleRemoveStagedFile(item.id)} sx={{ color: "#71717a", "&:hover": { color: "#ef4444" } }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <Button
            variant="contained"
            onClick={() => handleUploadAllToQueue(false)}
            disabled={uploadingReel || !uploadFiles.length}
            startIcon={uploadingReel ? <CircularProgress size={16} sx={{ color: "#ffffff" }} /> : <CloudUploadIcon fontSize="small" />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: "#09090b",
              color: "#ffffff",
              fontWeight: 700,
              px: 3,
              py: 1.2,
              "&:hover": { bgcolor: "#27272a" },
            }}
          >
            {uploadingReel ? (uploadProgressText || "Uploading...") : `📤 Upload ${uploadFiles.length || ""} Videos to Daily Queue`}
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleUploadAllToQueue(true)}
            disabled={uploadingReel || !uploadFiles.length}
            startIcon={<AutoAwesomeIcon fontSize="small" />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              borderColor: "#09090b",
              color: "#09090b",
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              "&:hover": { bgcolor: "#f4f4f5" },
            }}
          >
            🚀 Upload All & Publish 1st Reel Immediately
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography sx={{ ...titleStyle, fontSize: 18 }}>Active Daily Reels Queue</Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13 }}>
              Strict 1 Reel per calendar day. Upon publishing, the video is automatically purged from Cloudinary storage to keep costs zero.
            </Typography>
          </Box>
          <Chip label={`${queuedItems.length} Reels in Queue`} size="small" sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 11 }} />
        </Box>

        {queuedItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4, bgcolor: "#fafafa", borderRadius: "12px", border: "1px dashed #d4d4d8" }}>
            <ScheduleIcon sx={{ fontSize: 36, color: "#a1a1aa", mb: 1 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#09090b" }}>No reels in the upcoming daily queue</Typography>
            <Typography sx={{ color: "#71717a", fontSize: 12, mt: 0.5 }}>
              Use the Multi-Video Queue Uploader above to add daily reels for upcoming dates.
            </Typography>
          </Box>
        ) : (
          queuedItems.map((item, idx) => {
            const scheduledDateStr = item.scheduledFor ? new Date(item.scheduledFor).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : `Day +${idx + 1}`;
            const isVerticalReel = item.aspectRatio === "9:16" || !item.aspectRatio;

            return (
              <Box
                key={item._id}
                sx={{
                  borderTop: "1px solid #f4f4f5",
                  pt: 2.5,
                  mt: 2.5,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: isVerticalReel ? "200px 1fr" : "280px 1fr" },
                  gap: 2.5,
                  alignItems: "start",
                }}
              >
                <Box
                  onClick={() => openCinemaModal(item)}
                  sx={{
                    width: "100%",
                    maxWidth: isVerticalReel ? 180 : "100%",
                    aspectRatio: isVerticalReel ? "9 / 16" : "16 / 9",
                    maxHeight: isVerticalReel ? 260 : 180,
                    borderRadius: "10px",
                    overflow: "hidden",
                    bgcolor: "#000000",
                    position: "relative",
                    cursor: "pointer",
                    border: "1px solid #27272a",
                    margin: "0 auto",
                  }}
                >
                  <video
                    src={item.assetUrl}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    playsInline
                    preload="metadata"
                  />
                  <Box sx={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Chip label={`🗓️ ${scheduledDateStr}`} size="small" sx={{ bgcolor: "rgba(0,0,0,0.8)", color: "#ffffff", fontWeight: 700, fontSize: 9.5 }} />
                    <Chip label={isVerticalReel ? "📱 9:16" : "🖥️ 16:9"} size="small" sx={{ bgcolor: "rgba(0,0,0,0.8)", color: "#ffffff", fontWeight: 700, fontSize: 9.5 }} />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, flexWrap: "wrap", gap: 1 }}>
                      <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
                        <Chip label={item.themeCategory || "🌅 Nature's Morning"} size="small" sx={{ bgcolor: "#f4f4f5", color: "#09090b", fontWeight: 700, fontSize: 11 }} />
                        <Chip label={isVerticalReel ? "📱 9:16 Vertical Reel" : "🖥️ 16:9 Landscape"} size="small" sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 10 }} />
                      </Box>
                      <Typography sx={{ fontSize: 11, color: "#71717a" }}>
                        Scheduled for: {config.dailyPostTime || "12:00"} (12:00 PM Noon IST) · {scheduledDateStr}
                      </Typography>
                    </Box>
                    <Typography sx={{ ...titleStyle, fontSize: 16, mt: 0.5 }}>{item.topic}</Typography>
                    <Typography sx={{ fontSize: 12.5, color: "#52525b", mt: 0.8, whiteSpace: "pre-wrap", maxHeight: 70, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.caption}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.8 }}>
                      {(item.hashtags || []).slice(0, 8).join(" ")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => publishNow(item._id)}
                      disabled={saving}
                      startIcon={<AutoAwesomeIcon fontSize="small" />}
                      sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 11 }}
                    >
                      🚀 Publish Now (Instant)
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openCinemaModal(item)}
                      startIcon={<VisibilityIcon fontSize="small" />}
                      sx={{ borderRadius: "8px", textTransform: "none", color: "#09090b", borderColor: "#d4d4d8", fontWeight: 700, fontSize: 11 }}
                    >
                      Preview
                    </Button>
                    <IconButton size="small" onClick={() => deleteContent(item._id)} sx={{ color: "#71717a", "&:hover": { color: "#ef4444" } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Paper>

      {/* ── BRAND COLLABORATIONS & SPONSORSHIP INQUIRIES PANEL ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CampaignIcon sx={{ color: "#09090b", fontSize: 22 }} />
            <Typography sx={{ ...titleStyle, fontSize: 18 }}>
              Brand Collaborations & Sponsorship Inquiries
            </Typography>
          </Box>
          <Chip label={`${promotions.length} Inquiries Detected`} size="small" sx={{ bgcolor: "#f4f4f5", color: "#09090b", fontWeight: 700, fontSize: 11 }} />
        </Box>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13, mb: 2 }}>
          Incoming messages and comments containing sponsorship, partnership, or collab keywords are intercepted here for admin approval.
        </Typography>

        {promotions.length === 0 ? (
          <Typography sx={{ color: "#71717a", fontSize: 13 }}>No brand collaboration requests yet.</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {promotions.map((p) => (
              <Box
                key={p._id}
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  bgcolor: "#fafafa",
                  border: "1px solid #e4e4e7",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                <Box sx={{ maxWidth: { xs: "100%", md: "70%" } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Chip
                      label={p.source === "instagram_dm" ? "📩 Instagram DM" : "💬 Comment"}
                      size="small"
                      sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 10 }}
                    />
                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#09090b" }}>
                      From: {p.senderName || `@${p.senderId}`}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#71717a" }}>
                      · {new Date(p.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: "#3f3f46", fontStyle: "italic" }}>
                    "{p.message}"
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={p.status?.toUpperCase() || "PENDING"}
                    size="small"
                    sx={{
                      bgcolor: p.status === "approved" ? "#22c55e" : p.status === "declined" ? "#ef4444" : "#e4e4e7",
                      color: p.status === "pending" ? "#09090b" : "#ffffff",
                      fontWeight: 800,
                      fontSize: 10,
                    }}
                  />
                  {p.status === "pending" && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => { setSelectedCollab(p); setCollabModalOpen(true); }}
                      sx={{ borderRadius: "8px", textTransform: "none", fontSize: 11, fontWeight: 700, color: "#09090b", borderColor: "#d4d4d8" }}
                    >
                      Review
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* ── AUTOMATION SETTINGS & COMMUNITY AUTO-REPLIES ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Typography sx={{ ...titleStyle, fontSize: 18, mb: 2 }}>Daily Automation & Auto-Replies</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
          <TextField
            label="Daily Post Time (IST) ⏰"
            value={config.dailyPostTime || "12:00"}
            onChange={(e) => setConfigField("dailyPostTime", e.target.value)}
            placeholder="12:00"
            helperText="Strict daily posting time (Only 1 reel per day at 12:00 PM Noon)"
            sx={field}
            fullWidth
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(config.autoReplyComments)}
                  onChange={(e) => setConfigField("autoReplyComments", e.target.checked)}
                  color="default"
                />
              }
              label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>💬 Auto-Reply to Post Comments</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(config.autoReplyMessages)}
                  onChange={(e) => setConfigField("autoReplyMessages", e.target.checked)}
                  color="default"
                />
              }
              label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>📩 Auto-Reply to Direct Messages (DMs)</Typography>}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.2, mt: 2.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={saveConfig}
            disabled={saving}
            sx={{ borderRadius: "8px", textTransform: "none", borderColor: "#d4d4d8", color: "#09090b", fontWeight: 700 }}
          >
            Save Settings
          </Button>
          <Button
            variant="contained"
            onClick={toggleAgent}
            disabled={saving}
            startIcon={config.running ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: config.running ? "#ef4444" : "#09090b",
              color: "#ffffff",
              fontWeight: 700,
              "&:hover": { bgcolor: config.running ? "#dc2626" : "#27272a" },
            }}
          >
            {config.running ? "Pause Daily Scheduler" : "Start Daily 1-Reel Runner"}
          </Button>
        </Box>
      </Paper>

      {/* ── RECENT AGENT ACTIVITY LOG ── */}
      <Paper sx={whiteCard}>
        <Typography sx={{ ...titleStyle, fontSize: 18, mb: 2 }}>Agent Audit Trail & Activity Feed</Typography>
        {activities.length === 0 ? (
          <Typography sx={{ color: "#71717a", fontSize: 13 }}>No recent activity logged.</Typography>
        ) : (
          activities.slice(0, 8).map((act) => (
            <Box key={act._id} sx={{ py: 1.2, borderBottom: "1px solid #f4f4f5" }}>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#09090b" }}>
                {act.message || act.description}
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#a1a1aa" }}>
                {new Date(act.createdAt).toLocaleString()} · {act.type || act.action}
              </Typography>
            </Box>
          ))
        )}
      </Paper>

      {/* ── VIDEO LIGHTBOX MODAL ── */}
      <Dialog
        open={cinemaModalOpen}
        onClose={closeCinemaModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", bgcolor: "#09090b", color: "#ffffff" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a" }}>
          <Typography sx={{ fontWeight: 800, fontSize: 16 }}>{cinemaItem?.topic || "Reel Preview"}</Typography>
          <IconButton onClick={closeCinemaModal} sx={{ color: "#a1a1aa" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          {cinemaItem?.assetUrl && (
            <Box
              sx={{
                width: "100%",
                maxWidth: cinemaItem?.aspectRatio === "16:9" ? "100%" : "340px",
                maxHeight: cinemaItem?.aspectRatio === "16:9" ? 420 : 540,
                aspectRatio: cinemaItem?.aspectRatio === "16:9" ? "16 / 9" : "9 / 16",
                borderRadius: "12px",
                overflow: "hidden",
                bgcolor: "#000000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
                border: "1px solid #27272a",
              }}
            >
              <video
                src={cinemaItem.assetUrl}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                controls
                autoPlay
                loop
                playsInline
              />
            </Box>
          )}
          <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label={cinemaItem?.aspectRatio === "16:9" ? "🖥️ 16:9 Landscape" : "📱 9:16 Vertical Reel"}
              size="small"
              sx={{ bgcolor: "#27272a", color: "#ffffff", fontWeight: 700, fontSize: 10 }}
            />
            <Chip
              label={cinemaItem?.themeCategory || "Nature Series"}
              size="small"
              sx={{ bgcolor: "#27272a", color: "#ffffff", fontWeight: 700, fontSize: 10 }}
            />
          </Box>
          <Typography sx={{ mt: 1.5, fontSize: 13, color: "#d4d4d8", whiteSpace: "pre-wrap" }}>
            {cinemaItem?.caption}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #27272a" }}>
          <Button onClick={closeCinemaModal} sx={{ color: "#a1a1aa", textTransform: "none" }}>Close</Button>
          {cinemaItem && (
            <Button
              variant="contained"
              onClick={() => { publishNow(cinemaItem._id); closeCinemaModal(); }}
              sx={{ bgcolor: "#ffffff", color: "#09090b", fontWeight: 700, textTransform: "none" }}
            >
              Publish to Instagram Now
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ── BRAND COLLAB REVIEW DIALOG ── */}
      <Dialog
        open={collabModalOpen}
        onClose={() => setCollabModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", border: "1px solid #e4e4e7" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 16 }}>Review Brand Collaboration</DialogTitle>
        <DialogContent dividers>
          {selectedCollab && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ fontSize: 13, color: "#71717a" }}>
                Sender: <strong>{selectedCollab.senderName || `@${selectedCollab.senderId}`}</strong> ({selectedCollab.source})
              </Typography>
              <Box sx={{ p: 1.5, bgcolor: "#fafafa", borderRadius: "8px", border: "1px solid #e4e4e7" }}>
                <Typography sx={{ fontSize: 13, color: "#09090b", fontStyle: "italic" }}>
                  "{selectedCollab.message}"
                </Typography>
              </Box>
              <TextField
                label="Admin Review Note (Optional)"
                value={collabNote}
                onChange={(e) => setCollabNote(e.target.value)}
                placeholder="e.g. Approved for $500 sponsorship reel"
                fullWidth
                multiline
                rows={2}
                sx={field}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setCollabModalOpen(false)} sx={{ textTransform: "none", color: "#71717a" }}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleReviewCollab("declined")}
            disabled={reviewingCollab}
            sx={{ textTransform: "none", color: "#ef4444", borderColor: "#ef4444", fontWeight: 700 }}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            onClick={() => handleReviewCollab("approved")}
            disabled={reviewingCollab}
            sx={{ textTransform: "none", bgcolor: "#09090b", color: "#ffffff", fontWeight: 700 }}
          >
            Approve Collab
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── 60-DAY META TOKEN MODAL ── */}
      <Dialog
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", border: "1px solid #e4e4e7" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 16 }}>Meta Long-Lived Access Token</DialogTitle>
        <DialogContent dividers>
          {exchangingToken ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#09090b" }} />
              <Typography sx={{ mt: 2, fontSize: 13, color: "#71717a" }}>Exchanging token with Meta Graph API...</Typography>
            </Box>
          ) : longLivedResult?.error ? (
            <Alert severity="error" sx={{ borderRadius: "8px" }}>{longLivedResult.error}</Alert>
          ) : longLivedResult?.longLivedToken ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2, borderRadius: "8px" }}>
                Token generated! Valid for ~{longLivedResult.expiresInDays} days.
              </Alert>
              <TextField
                label="Long-Lived Token"
                value={longLivedResult.longLivedToken}
                fullWidth
                multiline
                rows={4}
                sx={field}
                InputProps={{ readOnly: true }}
              />
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTokenModalOpen(false)} sx={{ textTransform: "none", color: "#09090b" }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ borderRadius: "8px", bgcolor: "#09090b", color: "#ffffff" }}>
          {snack.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
