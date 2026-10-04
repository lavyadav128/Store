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
  Slider,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CampaignIcon from "@mui/icons-material/Campaign";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import HeadsetIcon from "@mui/icons-material/Headset";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LoopIcon from "@mui/icons-material/Loop";
import SecurityIcon from "@mui/icons-material/Security";
import server from "../../shared/environment";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const whiteCard = {
  borderRadius: "16px",
  border: "1px solid #e4e4e7",
  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  p: { xs: 2, sm: 3.5 },
  bgcolor: "#ffffff",
  color: "#09090b",
  boxSizing: "border-box",
  overflow: "hidden",
  maxWidth: "100%",
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
  {
    id: "morning",
    title: "🌅 Nature's Morning",
    realm: "🌅 Nature's Morning",
    defaultTopic: "Golden Morning Valley Sunrise",
    defaultCaption: "🌅 Nature's Morning: The Sacred Silence of Dawn.\n\nThere is a quiet magic in the first light of day. Take a slow, deep breath. Inhale clarity, exhale tension.\n\n📌 Save this post for your daily peace.\n💬 What is your favorite time to wake up in nature? Drop a '🌅' below! 👇",
    defaultHashtags: "#naturesmorning #sunrisephotography #mountainsunrise #earthfocus #peacefulnature #8knature #cinematicnature",
  },
  {
    id: "sunset",
    title: "🌄 Sunset of the Day",
    realm: "🌄 Sunset of the Day",
    defaultTopic: "Crimson Coastal Sunset Waves",
    defaultCaption: "🌄 Sunset of the Day: Where Fire Meets Ocean.\n\nAs the sun dips below the horizon, let go of everything that no longer serves you.\n\n✨ Rest, breathe, and reset.\n📌 Save this for your evening serenity! 👇",
    defaultHashtags: "#sunsetlovers #sunsetoftheday #goldenhoursea #cinematicsunset #earthfocus #peacefulnature #sunsetreel",
  },
  {
    id: "wildlife",
    title: "🦌 Wildlife Moments",
    realm: "🦌 Wildlife Moments",
    defaultTopic: "Wild Stag in Autumn Mist",
    defaultCaption: "🦌 Wildlife Moments: Grace in the Wild.\n\nWitnessing pure majesty undisturbed in nature. A reminder of the silent strength within all living things.\n\n📌 Double tap if you love wildlife! 🦌✨",
    defaultHashtags: "#wildlifemoments #wildlifephotography #naturelovers #earthfocus #forestanimals #cinematicwildlife",
  },
  {
    id: "forest",
    title: "🌲 Hidden Forests",
    realm: "🌲 Hidden Forests",
    defaultTopic: "Ancient Redwood Canopy Light Rays",
    defaultCaption: "🌲 Hidden Forests: Sanctuary of Ancient Giants.\n\nStep into the quiet mossy depths where sunlight pierces the canopy like emerald beams.\n\n🌿 Take a deep breath of fresh pine air.\n📌 Save this reel for daily calming vibes.",
    defaultHashtags: "#hiddenforests #redwoods #forestbathing #earthfocus #peacefulnature #cinematicforest #naturevibes",
  },
  {
    id: "ocean",
    title: "🌊 Ocean Diaries",
    realm: "🌊 Ocean Diaries",
    defaultTopic: "Turquoise Shoreline & Coral Depths",
    defaultCaption: "🌊 Ocean Diaries: The Endless Blue Rhythm.\n\nThe rhythmic crash of crystal waves against golden sand resets the mind. Listen closely to the tide.\n\n🌊 Drop a '💙' if you need an ocean escape! 👇",
    defaultHashtags: "#oceandiaries #oceanlovers #beachvibes #turquoiseocean #peacefulnature #earthfocus #cinematicwaves",
  }
];

const FRONTEND_VERIFIED_KOHLI_QUOTES = [
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130658.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130658.jpg",
    title: "Start Unknown Finish Unforgettable - Virat Kohli Wallpaper",
    quote: "START UNKNOWN FINISH UNFORGETTABLE.",
    topic: "Finish Unforgettable",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130646.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130646.jpg",
    title: "Self-Belief and Hard Work Will Always Deliver Success - Virat Kohli",
    quote: "SELF-BELIEF AND HARD WORK WILL ALWAYS DELIVER SUCCESS.",
    topic: "Unstoppable Self-Belief",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130648.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130648.jpg",
    title: "Whatever You Want To Do, Do With Full Passion - Virat Kohli",
    quote: "WHATEVER YOU WANT TO DO, DO WITH FULL PASSION AND WORK REALLY HARD TOWARDS IT. DON'T LOOK ANYWHERE ELSE.",
    topic: "Pure Focus & Passion",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130651.png",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130651.png",
    title: "If You Want To Be Strong, Learn To Fight Alone - Virat Kohli",
    quote: "IF YOU WANT TO BE STRONG, LEARN TO FIGHT ALONE.",
    topic: "Lone Warrior Mentality",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130653.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130653.jpg",
    title: "Never Give Up - Hard Work and Sunshine - Virat Kohli",
    quote: "NEVER GIVE UP. TODAY IS HARD, TOMORROW WILL BE WORSE, BUT THE DAY AFTER TOMORROW WILL BE SUNSHINE.",
    topic: "Resilience Through Darkness",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130656.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130656.jpg",
    title: "If You Are True To Yourself, You Will Be Successful - Virat Kohli",
    quote: "THERE WILL BE A FEW DISTRACTIONS, BUT IF YOU ARE TRUE TO YOURSELF, YOU WILL BE SUCCESSFUL FOR SURE.",
    topic: "Fearless Authenticity",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130660.png",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130660.png",
    title: "Preparation Over Doubt - King Kohli Motivation",
    quote: "CONFIDENCE IS SOMETHING THAT YOU DEVELOP FROM YOUR PREPARATION. IF YOU PREPARE HARD, YOU DON'T FEAR ANYTHING.",
    topic: "Preparation Over Doubt",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130661.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130661.jpg",
    title: "In The Mind of a Chaser - Match Winner Virat Kohli",
    quote: "IN THE MIND OF A CHASER, THERE IS NO PLACE FOR DOUBT. EVERY BALL IS AN OPPORTUNITY TO WRITE HISTORY.",
    topic: "The Chase Master Mindset",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130664.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130664.jpg",
    title: "Daily Relentless Grind - Virat Kohli Gym & Cricket Motivation",
    quote: "WHEN YOU ARE PASSIONATE ABOUT WHAT YOU DO, YOU DON'T NEED MOTIVATION. YOU JUST NEED TO SHOW UP EVERY SINGLE DAY.",
    topic: "Daily Relentless Grind",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130670.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130670.jpg",
    title: "Raw Confidence & Aura - King Kohli Attitude",
    quote: "I LIKE TO BE MYSELF, AND I DON'T PRETEND. I AM WHAT I AM.",
    topic: "Raw Confidence & Aura",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130679.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130679.jpg",
    title: "Match Winning Conviction - Virat Kohli India Victory",
    quote: "I ALWAYS BELIEVED THAT IF I STAY ON THE CREASE TILL THE END, INDIA WILL WIN.",
    topic: "Match Winning Conviction",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  },
  {
    imageUrl: "https://wallpapercave.com/wp/wp9130691.jpg",
    thumbnailUrl: "https://wallpapercave.com/wp/wp9130691.jpg",
    title: "The Bat is a Weapon - Virat Kohli Century Roar",
    quote: "THE BAT IS NOT A TOY, IT'S A WEAPON. IT GAVE ME EVERYTHING IN MY LIFE.",
    topic: "Warrior Mentality",
    sourceUrl: "https://wallpapercave.com/virat-kohli-quotes-wallpapers",
  }
];

const FRONTEND_DEFAULT_SONGS = [];

const matchSongToQuote = (quoteText, topicText, songsList) => {
  const activeSongs = (songsList || []).filter((s) => s.active !== false);
  if (!activeSongs || activeSongs.length === 0) return null;
  if (activeSongs.length === 1) return activeSongs[0];

  const text = `${quoteText || ""} ${topicText || ""}`.toLowerCase();

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % activeSongs.length;
  return activeSongs[index];
};

export default function InstagramGrowthAgent() {
  const [activeTab, setActiveTab] = useState("virat_kohli"); // "virat_kohli" | "nature_reels"
  const [data, setData] = useState({
    account: { connected: true, username: "quietframes.ai", followers: 4, reach: null, mediaCount: 25 },
    content: [],
    promotions: [],
    activities: [],
    accountError: "",
  });
  const [config, setConfig] = useState({
    autoReplyComments: true,
    autoReplyMessages: true,
    searchTopic: "Virat Kohli quotes images",
    listedSongs: [],
  });
  const [growthAnalysis, setGrowthAnalysis] = useState({
    growthStatus: "👑 Virat Kohli Inspiration Mode",
    growthBadgeColor: "#eab308",
    growthSummary: "Google Image search and Listed Song engine active. 1-Click ready for direct Instagram publishing.",
    topCategory: "👑 King Kohli Motivation",
    recommendation: "Pair high-impact Virat Kohli quotes with your custom listed songs for maximum reel virality.",
  });
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });
  const notify = (text, severity = "success") => setSnack({ open: true, text, severity });

  const [liveFollowers, setLiveFollowers] = useState(null);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [exchangingToken, setExchangingToken] = useState(false);
  const [longLivedResult, setLongLivedResult] = useState(null);

  // ── VIRAT KOHLI AGENT STATES ──
  const [searchQuery, setSearchQuery] = useState("Virat Kohli quotes images");
  const [searchingGoogle, setSearchingGoogle] = useState(false);
  const [googleResults, setGoogleResults] = useState(FRONTEND_VERIFIED_KOHLI_QUOTES);
  const [defaultQuotes, setDefaultQuotes] = useState([]);
  const [selectedKohliImage, setSelectedKohliImage] = useState(FRONTEND_VERIFIED_KOHLI_QUOTES[0]);
  const [selectedQuoteText, setSelectedQuoteText] = useState(FRONTEND_VERIFIED_KOHLI_QUOTES[0].quote);
  const [selectedTopicText, setSelectedTopicText] = useState(FRONTEND_VERIFIED_KOHLI_QUOTES[0].topic);
  const [selectedSongId, setSelectedSongId] = useState("");
  const [customKohliCaption, setCustomKohliCaption] = useState("");
  const [customKohliHashtags, setCustomKohliHashtags] = useState(
    "#ViratKohli #KingKohli #ViratKohliQuotes #CricketInspiration #RCB #IndianCricketTeam #MotivationalQuotes #NeverGiveUp #ChampionMindset #ReelsInstagram"
  );
  const [publishingKohliPost, setPublishingKohliPost] = useState(false);
  const [autoRunningAgent, setAutoRunningAgent] = useState(false);
  const [autoRunProgressText, setAutoRunProgressText] = useState("");

  // ── LISTED SONGS STATES ──
  const [listedSongs, setListedSongs] = useState([]);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongGenre, setNewSongGenre] = useState("Motivational Hype");
  const [newSongAudioUrl, setNewSongAudioUrl] = useState("");
  const [addingSong, setAddingSong] = useState(false);
  const audioFileInputRef = useRef(null);
  const [uploadingAudioFile, setUploadingAudioFile] = useState(false);

  // ── IN-APP AUDIO PLAYER STATES ──
  const audioRef = useRef(null);
  const [playingSongId, setPlayingSongId] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0.85);
  const [audioMuted, setAudioMuted] = useState(false);

  const togglePlaySong = (song) => {
    if (!song) return;
    if (!audioRef.current) return;

    const targetUrl = song.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    if (playingSongId === song._id && isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (playingSongId !== song._id) {
        audioRef.current.src = targetUrl;
        audioRef.current.load();
      }
      audioRef.current.volume = audioMuted ? 0 : audioVolume;
      audioRef.current
        .play()
        .then(() => {
          setPlayingSongId(song._id);
          setIsPlayingAudio(true);
        })
        .catch((err) => {
          console.warn("Audio playback notice:", err.message);
        });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime || 0);
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setAudioProgress(0);
  };

  const handleSeek = (_, val) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setAudioProgress(val);
    }
  };

  const handleVolumeChange = (_, val) => {
    if (audioRef.current) {
      audioRef.current.volume = val;
      setAudioVolume(val);
      if (val > 0) setAudioMuted(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const activePlayingSong = listedSongs.find(
    (s) => String(s._id) === String(playingSongId)
  );

  // ── NATURE REELS PUBLISHER STATES ──
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [realm, setRealm] = useState("🌅 Nature's Morning");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [topic, setTopic] = useState("Golden Morning Valley Sunrise");
  const [caption, setCaption] = useState(NATURE_REALMS[0].defaultCaption);
  const [hashtags, setHashtags] = useState(NATURE_REALMS[0].defaultHashtags);
  const [publishing, setPublishing] = useState(false);
  const [publishProgressText, setPublishProgressText] = useState("");
  const fileInputRef = useRef(null);

  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [collabNote, setCollabNote] = useState("");
  const [reviewingCollab, setReviewingCollab] = useState(false);

  // Autonomous Agent Running & Telemetry State
  const [statusSummary, setStatusSummary] = useState(null);
  const [togglingAgent, setTogglingAgent] = useState(false);
  const [savingPostTime, setSavingPostTime] = useState(false);

  const fetchStatusSummary = useCallback(async () => {
    try {
      const res = await fetch(`${server}/api/instagram-agent/status-summary`, { headers: authHeaders() });
      if (res.ok) {
        const payload = await res.json();
        if (payload.success) {
          setStatusSummary(payload);
          if (payload.running !== undefined) {
            setConfig((prev) => ({ ...prev, running: payload.running, dailyPostTime: payload.dailyPostTime }));
          }
        }
      }
    } catch (_) {}
  }, []);

  const handleStartAgent = async () => {
    setTogglingAgent(true);
    try {
      const res = await fetch(`${server}/api/instagram-agent/start`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        notify("🟢 Autonomous Agent STARTED! It will now automatically post 1 unique 9:16 Reel every day at your scheduled time with your looped songs.", "success");
        load();
        fetchStatusSummary();
      } else {
        notify(data.error || "Failed to start agent.", "error");
      }
    } catch (err) {
      notify(`Failed to start agent: ${err.message}`, "error");
    } finally {
      setTogglingAgent(false);
    }
  };

  const handleStopAgent = async () => {
    setTogglingAgent(true);
    try {
      const res = await fetch(`${server}/api/instagram-agent/stop`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        notify("⏹ Autonomous Agent STOPPED. Automated daily posting is paused.", "info");
        load();
        fetchStatusSummary();
      } else {
        notify(data.error || "Failed to stop agent.", "error");
      }
    } catch (err) {
      notify(`Failed to stop agent: ${err.message}`, "error");
    } finally {
      setTogglingAgent(false);
    }
  };

  const handleSavePostTime = async (newTime) => {
    setSavingPostTime(true);
    try {
      const res = await fetch(`${server}/api/instagram-agent/config`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ dailyPostTime: newTime }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        notify(`⏱️ Daily post time updated to ${newTime} IST!`, "success");
        load();
        fetchStatusSummary();
      }
    } catch (err) {
      notify(`Failed to update time: ${err.message}`, "error");
    } finally {
      setSavingPostTime(false);
    }
  };

  const fetchLiveFollowers = useCallback(async () => {
    try {
      const res = await fetch(`${server}/api/instagram-agent/live-followers`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.followers !== null && payload.followers !== undefined) {
          setLiveFollowers(payload.followers);
        }
      }
    } catch (_) {}
  }, []);

  const loadListedSongs = useCallback(async () => {
    try {
      const res = await fetch(`${server}/api/instagram-agent/listed-songs`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.songs && Array.isArray(data.songs)) {
          setListedSongs(data.songs);
          if (data.songs.length > 0 && !selectedSongId) {
            setSelectedSongId(data.songs[0]._id);
          }
          return;
        }
      }
      setListedSongs([]);
    } catch (_) {
      setListedSongs([]);
    }
  }, [selectedSongId]);

  const load = useCallback(async () => {
    try {
      const [overviewRes, growthRes] = await Promise.all([
        fetch(`${server}/api/instagram-agent/overview`, { headers: authHeaders() }),
        fetch(`${server}/api/instagram-agent/growth-intel`, { headers: authHeaders() }),
      ]);

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setData((prev) => ({
          ...prev,
          ...overviewData,
          account: overviewData.account || prev.account,
          content: overviewData.content || [],
          promotions: overviewData.promotions || [],
          activities: overviewData.activities || [],
        }));
        if (overviewData.config) {
          setConfig((prev) => ({ ...prev, ...overviewData.config }));
          if (overviewData.config.listedSongs && Array.isArray(overviewData.config.listedSongs)) {
            setListedSongs(overviewData.config.listedSongs);
          }
        }
        if (overviewData.account?.followers !== undefined) {
          setLiveFollowers(overviewData.account.followers);
        }
      }

      if (growthRes.ok) {
        const growthData = await growthRes.json();
        setGrowthAnalysis(growthData);
      }
    } catch (err) {
      console.warn("[Instagram Agent Overview Warning]:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    fetchLiveFollowers();
    loadListedSongs();
    fetchStatusSummary();
    handleSearchGoogle("Virat Kohli quotes images");
    const timer = setInterval(() => {
      fetchLiveFollowers();
      fetchStatusSummary();
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // ── GOOGLE SEARCH HANDLER ──
  const handleSearchGoogle = async (queryToSearch) => {
    const q = queryToSearch || searchQuery || "Virat Kohli quotes images";
    setSearchingGoogle(true);
    try {
      const res = await fetch(`${server}/api/instagram-agent/search-google-quotes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ query: q, limit: 12 }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.results && data.results.length > 0) {
          setGoogleResults(data.results);
          if (data.defaultQuotes) setDefaultQuotes(data.defaultQuotes);
          if (!selectedKohliImage || !data.results.some((r) => r.imageUrl === selectedKohliImage.imageUrl)) {
            handleSelectImageForPost(data.results[0]);
          }
          notify(`Loaded ${data.results.length} Google images & quotes for "${q}"`);
          return;
        }
      }
      setGoogleResults(FRONTEND_VERIFIED_KOHLI_QUOTES);
    } catch (err) {
      console.warn("[Google search notice]: Using verified quote wallpapers", err.message);
      setGoogleResults(FRONTEND_VERIFIED_KOHLI_QUOTES);
    } finally {
      setSearchingGoogle(false);
    }
  };

  const handleSelectImageForPost = (item) => {
    setSelectedKohliImage(item);
    const qText = item.quote || "Self-belief and hard work will always earn you success.";
    const tText = item.topic || "King Kohli Mindset";
    setSelectedQuoteText(qText);
    setSelectedTopicText(tText);
    const hashtagsStr = "#ViratKohli #KingKohli #ViratKohliQuotes #CricketInspiration #RCB #IndianCricketTeam #MotivationalQuotes #NeverGiveUp #ChampionMindset #ReelsInstagram";
    setCustomKohliHashtags(hashtagsStr);

    // Auto-match song based on quote vibe!
    const available = listedSongs.length > 0 ? listedSongs : [];
    const matched = matchSongToQuote(qText, tText, available);
    if (matched) {
      setSelectedSongId(matched._id);
    }
  };

  // ── 1-CLICK AUTONOMOUS AGENT EXECUTION ──
  const handleAutoRunAgent = async () => {
    setAutoRunningAgent(true);
    setAutoRunProgressText("1. Browsing Google for fresh Virat Kohli quote images...");

    try {
      setTimeout(() => {
        setAutoRunProgressText("2. Generating 9:16 Video Reel & attaching looped song...");
      }, 1500);

      setTimeout(() => {
        setAutoRunProgressText("3. Uploading to CDN & publishing Reel to Instagram @quietframes.ai...");
      }, 3500);

      const res = await fetch(`${server}/api/instagram-agent/auto-run-virat-kohli`, {
        method: "POST",
        headers: authHeaders(),
      });
      const result = await res.json();

      if (result.success) {
        notify(result.message || "Published 9:16 Video Reel to Instagram successfully! 👑🚀", "success");
        load();
      } else {
        notify(result.error || "Agent execution encountered an issue.", "error");
      }
    } catch (err) {
      notify(`Error running agent: ${err.message}`, "error");
    } finally {
      setAutoRunningAgent(false);
      setAutoRunProgressText("");
    }
  };

  // ── PUBLISH SELECTED KOHLI POST ──
  const handlePublishSelectedKohliPost = async () => {
    if (!selectedKohliImage?.imageUrl) {
      notify("Please select an image from Google search results first.", "error");
      return;
    }

    setPublishingKohliPost(true);
    try {
      const chosenSong = listedSongs.find((s) => String(s._id) === String(selectedSongId)) || listedSongs[0] || null;
      const res = await fetch(`${server}/api/instagram-agent/create-virat-kohli-post`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          imageUrl: selectedKohliImage.imageUrl,
          quote: selectedQuoteText,
          topic: selectedTopicText,
          song: chosenSong,
          customCaption: customKohliCaption,
          customHashtags: customKohliHashtags.split(/\s+/).filter(Boolean),
          publishImmediately: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        notify("🎉 9:16 Reel published directly to Instagram!", "success");
        load();
      } else {
        notify(data.error || "Failed to publish reel to Instagram.", "error");
      }
    } catch (err) {
      notify(`Failed to publish: ${err.message}`, "error");
    } finally {
      setPublishingKohliPost(false);
    }
  };

  // ── LISTED SONGS ACTIONS ──
  const handleAudioFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAudioFile(true);
    const token = localStorage.getItem("token");
    const rawTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();

    try {
      // 1. Try Backend Upload Endpoint first
      const formData = new FormData();
      formData.append("audioFile", file);
      formData.append("title", rawTitle);
      formData.append("artist", "My Device Audio");
      formData.append("genre", "Custom Audio");

      let backendSucceeded = false;

      try {
        const res = await fetch(`${server}/api/instagram-agent/upload-song`, {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (res.ok && data.success && data.songs) {
            setListedSongs(data.songs);
            if (data.song?._id) setSelectedSongId(data.song._id);
            notify(data.message || `Uploaded "${rawTitle}" successfully from your device! 🎵`);
            backendSucceeded = true;
            return;
          } else if (data.error) {
            throw new Error(data.error);
          }
        }
      } catch (backendErr) {
        console.warn("[Backend audio upload notice, attempting Cloudinary direct fallback]:", backendErr.message);
      }

      if (backendSucceeded) return;

      // 2. Direct Cloudinary Signed Upload Fallback (Works 100% reliably regardless of server proxying)
      const sigRes = await fetch(`${server}/api/instagram-agent/cloudinary/signature`);
      if (sigRes.ok) {
        const sigData = await sigRes.json();
        const cldForm = new FormData();
        cldForm.append("file", file);
        cldForm.append("api_key", sigData.apiKey);
        cldForm.append("timestamp", sigData.timestamp);
        cldForm.append("signature", sigData.signature);
        cldForm.append("folder", sigData.folder || "instagram-agent/user-songs");

        const cldUploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`, {
          method: "POST",
          body: cldForm,
        });

        if (cldUploadRes.ok) {
          const cldJson = await cldUploadRes.json();
          if (cldJson.secure_url) {
            // Save to listed songs
            const saveRes = await fetch(`${server}/api/instagram-agent/listed-songs`, {
              method: "POST",
              headers: authHeaders(),
              body: JSON.stringify({
                title: rawTitle,
                artist: "My Device Audio",
                genre: "Custom Audio",
                audioUrl: cldJson.secure_url,
              }),
            });
            if (saveRes.ok) {
              const saveData = await saveRes.json();
              if (saveData.songs) {
                setListedSongs(saveData.songs);
                notify(`Uploaded "${rawTitle}" successfully from your device! 🎵`);
                return;
              }
            }
          }
        }
      }

      throw new Error("Unable to upload audio file. Please check file format and backend connection.");
    } catch (err) {
      notify(`Upload failed: ${err.message}`, "error");
    } finally {
      setUploadingAudioFile(false);
      if (audioFileInputRef.current) audioFileInputRef.current.value = "";
    }
  };

  const handleClearAllSongs = async () => {
    if (!window.confirm("Are you sure you want to clear ALL songs from the list?")) return;
    try {
      const res = await fetch(`${server}/api/instagram-agent/listed-songs/all/clear`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setListedSongs([]);
        setSelectedSongId("");
        if (audioRef.current) audioRef.current.pause();
        setIsPlayingAudio(false);
        setPlayingSongId(null);
        notify("All songs removed! The list is completely clean.");
      }
    } catch (err) {
      notify("Failed to clear songs.", "error");
    }
  };

  const handleAddSong = async () => {
    if (!newSongTitle.trim()) {
      notify("Please enter a song title.", "error");
      return;
    }
    setAddingSong(true);
    try {
      const res = await fetch(`${server}/api/instagram-agent/listed-songs`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: newSongTitle.trim(),
          artist: newSongArtist.trim() || "Trending Artist",
          genre: newSongGenre.trim() || "Motivational Hype",
          audioUrl: newSongAudioUrl.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setListedSongs(data.songs);
        setNewSongTitle("");
        setNewSongArtist("");
        setNewSongGenre("Motivational Hype");
        setNewSongAudioUrl("");
        notify(data.message || "Song added to your loop list!");
      } else {
        notify(data.error || "Failed to add song.", "error");
      }
    } catch (err) {
      notify("Error adding song.", "error");
    } finally {
      setAddingSong(false);
    }
  };

  const handleDeleteSong = async (id) => {
    try {
      const res = await fetch(`${server}/api/instagram-agent/listed-songs/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setListedSongs(data.songs);
        notify("Song removed from list.");
      }
    } catch (_) {}
  };

  const handleToggleSong = async (id) => {
    try {
      const res = await fetch(`${server}/api/instagram-agent/listed-songs/${id}/toggle`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setListedSongs(data.songs);
      }
    } catch (_) {}
  };

  // ── META LONG LIVED TOKEN ──
  const handleExchangeToken = async () => {
    setExchangingToken(true);
    setTokenModalOpen(true);
    setLongLivedResult(null);
    try {
      const res = await fetch(`${server}/api/instagram-agent/exchange-token`, {
        method: "POST",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to exchange token");
      setLongLivedResult(json);
      notify("60-day token generated successfully!");
    } catch (err) {
      setLongLivedResult({ error: err.message });
    } finally {
      setExchangingToken(false);
    }
  };

  const account = data.account || {};
  const publishedItems = (data.content || []).filter((c) => c.status === "published");
  const promotions = data.promotions || [];

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3, md: 4 }, maxWidth: 1300, mx: "auto", fontFamily: "'DM Sans', sans-serif", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
      {/* ── HEADER BAR ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, mb: 3, gap: 2 }}>
        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: { xs: 38, sm: 44 },
                height: { xs: 38, sm: 44 },
                borderRadius: "12px",
                bgcolor: "#09090b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#eab308",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ ...titleStyle, fontSize: { xs: 18, sm: 24 }, wordBreak: "break-word" }}>
                Instagram Growth & Automation Agent
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: { xs: 12, sm: 13 }, color: "#71717a", wordBreak: "break-word" }}>
                Connected to <strong>@{account.username || "quietframes.ai"}</strong> · Google Quote Scraper & Song Publisher
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="outlined"
            onClick={load}
            startIcon={<RefreshIcon />}
            sx={{ borderRadius: "10px", textTransform: "none", color: "#09090b", borderColor: "#e4e4e7", flex: { xs: 1, sm: "none" } }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={handleExchangeToken}
            startIcon={<VpnKeyIcon />}
            sx={{ borderRadius: "10px", textTransform: "none", color: "#09090b", borderColor: "#e4e4e7", flex: { xs: 1, sm: "none" } }}
          >
            60-Day Meta Token
          </Button>
        </Box>
      </Box>

      {/* ── TOP STATS BAR WITH LIVE PULSE ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
        <Paper sx={{ ...whiteCard, p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Live Followers
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#22c55e",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": { "0%": { opacity: 0.4 }, "50%": { opacity: 1 }, "100%": { opacity: 0.4 } },
              }}
            />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: { xs: 24, sm: 28 }, fontWeight: 800, color: "#09090b", mt: 0.5 }}>
            {liveFollowers !== null ? liveFollowers.toLocaleString() : (account.followers !== null ? account.followers : "—")}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>
            Live count from @{account.username || "quietframes.ai"}
          </Typography>
        </Paper>

        <Paper sx={{ ...whiteCard, p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Published Posts & Reels
            </Typography>
            <TrendingUpIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: { xs: 24, sm: 28 }, fontWeight: 800, color: "#09090b", mt: 0.5 }}>
            {publishedItems.length || account.mediaCount || 0}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>
            Live on Instagram Feed
          </Typography>
        </Paper>

        <Paper sx={{ ...whiteCard, p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#71717a", textTransform: "uppercase" }}>
              Listed Motivational Songs
            </Typography>
            <MusicNoteIcon sx={{ color: "#71717a", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: { xs: 24, sm: 28 }, fontWeight: 800, color: "#09090b", mt: 0.5 }}>
            {listedSongs.length}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#71717a", mt: 0.5 }}>
            Active audio track soundscapes
          </Typography>
        </Paper>
      </Box>

      {/* ── AUTONOMOUS DAILY POSTING MASTER CONTROLLER CARD ── */}
      <Paper
        sx={{
          ...whiteCard,
          p: { xs: 2, sm: 3 },
          mb: 3.5,
          background: config.running
            ? "linear-gradient(135deg, #09090b 0%, #18181b 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
          color: config.running ? "#ffffff" : "#09090b",
          border: config.running ? "1px solid #27272a" : "1px solid #e4e4e7",
          boxShadow: config.running ? "0 10px 30px rgba(0,0,0,0.25)" : "0 2px 10px rgba(0,0,0,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                bgcolor: config.running ? "#22c55e" : "#eab308",
                boxShadow: config.running ? "0 0 12px #22c55e" : "0 0 8px #eab308",
                animation: config.running ? "pulseGlow 2s infinite" : "none",
                mt: 0.5,
                flexShrink: 0,
                "@keyframes pulseGlow": {
                  "0%": { boxShadow: "0 0 4px #22c55e" },
                  "50%": { boxShadow: "0 0 16px #22c55e, 0 0 24px rgba(34,197,94,0.4)" },
                  "100%": { boxShadow: "0 0 4px #22c55e" },
                },
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: { xs: 16, sm: 18 }, fontWeight: 800, wordBreak: "break-word" }}>
                {config.running ? "🟢 Autonomous Agent is ACTIVE & POSTING DAILY" : "⏸️ Autonomous Agent is PAUSED"}
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: { xs: 12, sm: 13 }, color: config.running ? "#a1a1aa" : "#71717a", wordBreak: "break-word" }}>
                {config.running
                  ? `Posting 1 unique 9:16 Reel daily at ${config.dailyPostTime || "12:00"} IST with sequential song looping.`
                  : "Click 'Start Autonomous Agent' to enable automatic daily posting with your uploaded songs until stopped."}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", width: { xs: "100%", sm: "auto" } }}>
            {config.running ? (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                disabled={togglingAgent}
                onClick={handleStopAgent}
                startIcon={togglingAgent ? <CircularProgress size={16} color="inherit" /> : <PauseIcon />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: { xs: 13, sm: 14 },
                  px: { xs: 2, sm: 3 },
                  py: 1.2,
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  borderColor: "#ef4444",
                  color: "#ef4444",
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)", borderColor: "#dc2626" },
                }}
              >
                {togglingAgent ? "Stopping..." : "⏹ Stop Autonomous Agent"}
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                disabled={togglingAgent}
                onClick={handleStartAgent}
                startIcon={togglingAgent ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon sx={{ color: "#22c55e" }} />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: { xs: 13, sm: 14 },
                  px: { xs: 2, sm: 3.5 },
                  py: 1.2,
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: "#09090b",
                  color: "#ffffff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                  "&:hover": { bgcolor: "#27272a" },
                }}
              >
                {togglingAgent ? "Starting Agent..." : "▶ START AUTONOMOUS AGENT (Post Daily)"}
              </Button>
            )}
          </Box>
        </Box>

        {/* 4 Telemetry Metrics Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 1.5, pt: 1 }}>
          <Box
            sx={{
              p: 1.8,
              borderRadius: "10px",
              bgcolor: config.running ? "rgba(255,255,255,0.06)" : "#f4f4f5",
              border: config.running ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e4e4e7",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: config.running ? "#eab308" : "#71717a", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: config.running ? "#d4d4d8" : "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Daily Post Schedule
              </Typography>
            </Box>
            <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
              <Select
                value={config.dailyPostTime || "12:00"}
                onChange={(e) => handleSavePostTime(e.target.value)}
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  height: 32,
                  bgcolor: config.running ? "#18181b" : "#ffffff",
                  color: config.running ? "#ffffff" : "#09090b",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: config.running ? "#3f3f46" : "#e4e4e7",
                  },
                }}
              >
                <MenuItem value="06:00">06:00 AM IST (Morning Kickoff)</MenuItem>
                <MenuItem value="09:00">09:00 AM IST (Breakfast Prime)</MenuItem>
                <MenuItem value="12:00">12:00 PM IST (Noon Peak - Default)</MenuItem>
                <MenuItem value="15:00">03:00 PM IST (Afternoon Buzz)</MenuItem>
                <MenuItem value="18:00">06:00 PM IST (Evening Hype)</MenuItem>
                <MenuItem value="21:00">09:00 PM IST (Night Viral Peak)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              p: 1.8,
              borderRadius: "10px",
              bgcolor: config.running ? "rgba(255,255,255,0.06)" : "#f4f4f5",
              border: config.running ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e4e4e7",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <LoopIcon sx={{ fontSize: 16, color: config.running ? "#38bdf8" : "#71717a", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: config.running ? "#d4d4d8" : "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Song Looping Status
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: config.running ? "#ffffff" : "#09090b", mt: 0.5, wordBreak: "break-word" }}>
              {listedSongs.length === 0
                ? "No uploaded songs (Ambient Soundscape)"
                : listedSongs.length === 1
                ? `1 Song Loop: "${listedSongs[0]?.title || 'Uploaded Song'}"`
                : `${listedSongs.length} Songs Loop Active · Next: "${statusSummary?.currentSong?.title || listedSongs[0]?.title}"`}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.8,
              borderRadius: "10px",
              bgcolor: config.running ? "rgba(255,255,255,0.06)" : "#f4f4f5",
              border: config.running ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e4e4e7",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <SecurityIcon sx={{ fontSize: 16, color: config.running ? "#22c55e" : "#71717a", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: config.running ? "#d4d4d8" : "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Zero Repeat Engine
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: config.running ? "#ffffff" : "#09090b", mt: 0.5, wordBreak: "break-word" }}>
              100% Lifetime Unique Guarantee
            </Typography>
            <Typography sx={{ fontSize: 11, color: config.running ? "#a1a1aa" : "#71717a", wordBreak: "break-word" }}>
              Lifetime MongoDB fingerprint check
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.8,
              borderRadius: "10px",
              bgcolor: config.running ? "rgba(255,255,255,0.06)" : "#f4f4f5",
              border: config.running ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e4e4e7",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: config.running ? "#22c55e" : "#71717a", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: config.running ? "#d4d4d8" : "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Autonomous Activity
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: config.running ? "#ffffff" : "#09090b", mt: 0.5, wordBreak: "break-word" }}>
              {statusSummary?.publishedToday ? "✅ Today's Reel Published" : "⏳ Scheduled for Today"}
            </Typography>
            <Typography sx={{ fontSize: 11, color: config.running ? "#a1a1aa" : "#71717a", wordBreak: "break-word" }}>
              {config.running ? "Runs automatically every day" : "Agent is currently stopped"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ── MODE SELECTOR TABS ── */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mb: 3, borderBottom: "1px solid #e4e4e7", pb: 1.5 }}>
        <Button
          variant={activeTab === "virat_kohli" ? "contained" : "outlined"}
          onClick={() => setActiveTab("virat_kohli")}
          startIcon={<EmojiEventsIcon sx={{ color: activeTab === "virat_kohli" ? "#eab308" : "inherit" }} />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            fontSize: 14,
            px: 3,
            py: 1,
            width: { xs: "100%", sm: "auto" },
            bgcolor: activeTab === "virat_kohli" ? "#09090b" : "transparent",
            color: activeTab === "virat_kohli" ? "#ffffff" : "#09090b",
            borderColor: "#e4e4e7",
            "&:hover": { bgcolor: activeTab === "virat_kohli" ? "#27272a" : "#f4f4f5" },
          }}
        >
          👑 Virat Kohli Quote & Song Agent
        </Button>

        <Button
          variant={activeTab === "nature_reels" ? "contained" : "outlined"}
          onClick={() => setActiveTab("nature_reels")}
          startIcon={<CloudUploadIcon />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            fontSize: 14,
            px: 3,
            py: 1,
            width: { xs: "100%", sm: "auto" },
            bgcolor: activeTab === "nature_reels" ? "#09090b" : "transparent",
            color: activeTab === "nature_reels" ? "#ffffff" : "#09090b",
            borderColor: "#e4e4e7",
            "&:hover": { bgcolor: activeTab === "nature_reels" ? "#27272a" : "#f4f4f5" },
          }}
        >
          🌲 Direct Nature Reel Publisher
        </Button>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: 👑 VIRAT KOHLI GOOGLE IMAGE & SONG AGENT ── */}
      {/* ════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "virat_kohli" && (
        <>
          {/* 1. ⚡ 1-CLICK AUTONOMOUS RUN AGENT CARD */}
          <Paper
            sx={{
              ...whiteCard,
              mb: 3,
              background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
              color: "#ffffff",
              border: "1px solid #27272a",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 1.5, flexWrap: "wrap", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: "rgba(234, 179, 8, 0.15)",
                    border: "1px solid rgba(234, 179, 8, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#eab308",
                    flexShrink: 0,
                    mt: 0.3,
                  }}
                >
                  <StarIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: { xs: 16, sm: 18 }, color: "#ffffff", wordBreak: "break-word" }}>
                    Autonomous Virat Kohli 9:16 Reel Agent
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: "#a1a1aa", wordBreak: "break-word" }}>
                    1-Click engine: Browses Google Images, downloads high-res quote image, attaches your looped song, generates 9:16 vertical video reel, and publishes to Instagram with 100% accuracy.
                  </Typography>
                </Box>
              </Box>

              <Chip
                label="⚡ 9:16 Video Reel Automation"
                size="small"
                sx={{ bgcolor: "#27272a", color: "#eab308", fontWeight: 800, fontSize: 11 }}
              />
            </Box>

            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #27272a", display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <Box sx={{ display: "flex", gap: 1, flexDirection: "column", minWidth: 0 }}>
                <Typography sx={{ fontSize: 12.5, color: "#d4d4d8", wordBreak: "break-word" }}>
                  🔍 Search Target: <strong style={{ color: "#eab308" }}>"{searchQuery}"</strong>
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#d4d4d8" }}>
                  🎵 Active Looped Songs: <strong style={{ color: "#22c55e" }}>{listedSongs.filter((s) => s.active !== false).length} songs</strong>
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#a1a1aa", wordBreak: "break-word" }}>
                  🔁 Looping: {listedSongs.length === 0 ? "No songs (uses soundscape)" : listedSongs.length === 1 ? "1 Song (Repeats on every reel)" : `Cycles 1-by-1 across all ${listedSongs.length} songs`}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleAutoRunAgent}
                disabled={autoRunningAgent}
                startIcon={autoRunningAgent ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon sx={{ color: "#09090b" }} />}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: { xs: 13.5, sm: 14.5 },
                  px: { xs: 2, sm: 3.5 },
                  py: 1.2,
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: "#eab308",
                  color: "#09090b",
                  boxShadow: "0 4px 14px rgba(234, 179, 8, 0.4)",
                  "&:hover": { bgcolor: "#facc15" },
                }}
              >
                {autoRunningAgent ? (autoRunProgressText || "Agent Running...") : "⚡ Run Autonomous Agent & Publish 9:16 Reel"}
              </Button>
            </Box>
          </Paper>

          {/* 2. 🔍 GOOGLE BROWSER IMAGE & QUOTE EXPLORER */}
          <Paper sx={{ ...whiteCard, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SearchIcon sx={{ color: "#09090b", fontSize: 24, flexShrink: 0 }} />
                <Typography sx={{ ...titleStyle, fontSize: { xs: 17, sm: 19 } }}>
                  Google Browser Image & Quote Explorer
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: "#71717a" }}>
                Live image scraper with verified HD fallback
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Virat Kohli quotes images, Virat Kohli motivation, King Kohli wallpaper..."
                sx={field}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchGoogle(searchQuery);
                }}
              />
              <Button
                variant="contained"
                onClick={() => handleSearchGoogle(searchQuery)}
                disabled={searchingGoogle}
                startIcon={searchingGoogle ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: 13.5,
                  bgcolor: "#09090b",
                  color: "#ffffff",
                  px: 3,
                  py: { xs: 1.2, sm: "auto" },
                  width: { xs: "100%", sm: "auto" },
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: "#27272a" },
                }}
              >
                {searchingGoogle ? "Searching..." : "Search Google"}
              </Button>
            </Box>

            {/* Quick Suggestion Chips */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
              <Typography sx={{ fontSize: 11, color: "#71717a", alignSelf: "center", mr: 0.5 }}>Quick Searches:</Typography>
              {[
                "Virat Kohli quotes images",
                "Virat Kohli aggressive motivation wallpaper",
                "Virat Kohli MCG 82 celebration",
                "King Kohli attitude quotes",
                "Virat Kohli fitness and discipline",
              ].map((q) => (
                <Chip
                  key={q}
                  label={q}
                  size="small"
                  onClick={() => {
                    setSearchQuery(q);
                    handleSearchGoogle(q);
                  }}
                  sx={{
                    bgcolor: searchQuery === q ? "#09090b" : "#f4f4f5",
                    color: searchQuery === q ? "#ffffff" : "#3f3f46",
                    fontWeight: 600,
                    fontSize: 11,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#e4e4e7" },
                  }}
                />
              ))}
            </Box>

            {/* Search Results Grid */}
            {googleResults.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fafafa", borderRadius: "12px", border: "1px dashed #e4e4e7" }}>
                <Typography sx={{ color: "#71717a", fontSize: 14 }}>
                  No images found. Type a query above and click <strong>Search Google</strong>.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
                {googleResults.map((item, idx) => {
                  const isSelected = selectedKohliImage?.imageUrl === item.imageUrl;
                  return (
                    <Box
                      key={idx}
                      onClick={() => handleSelectImageForPost(item)}
                      sx={{
                        borderRadius: "12px",
                        border: isSelected ? "2.5px solid #09090b" : "1px solid #e4e4e7",
                        bgcolor: "#ffffff",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: isSelected ? "0 4px 14px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
                        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" },
                      }}
                    >
                      <Box sx={{ height: 170, bgcolor: "#09090b", overflow: "hidden", position: "relative" }}>
                        <img
                          src={item.thumbnailUrl || item.imageUrl}
                          alt={item.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800";
                          }}
                        />
                        {isSelected && (
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: "14px !important", color: "#ffffff !important" }} />}
                            label="Selected"
                            size="small"
                            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "#09090b", color: "#ffffff", fontWeight: 800, fontSize: 10 }}
                          />
                        )}
                      </Box>
                      <Box sx={{ p: 1.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 12.5, color: "#09090b", mb: 0.5, noWrap: true }}>
                          {item.topic || "King Kohli Quote"}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: "#52525b", fontStyle: "italic", height: 34, overflow: "hidden" }}>
                          "{item.quote}"
                        </Typography>
                        <Button
                          fullWidth
                          size="small"
                          variant={isSelected ? "contained" : "outlined"}
                          sx={{
                            mt: 1.5,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 11,
                            bgcolor: isSelected ? "#09090b" : "transparent",
                            color: isSelected ? "#ffffff" : "#09090b",
                            borderColor: "#d4d4d8",
                          }}
                        >
                          {isSelected ? "✓ Active Selection" : "👑 Select for Reel"}
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>

          {/* 3. 📝 INTERACTIVE POST CUSTOMIZER & INSTAGRAM PUBLISHER */}
          {selectedKohliImage && (
            <Paper sx={{ ...whiteCard, mb: 3, border: "2px solid #09090b" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CloudUploadIcon sx={{ color: "#09090b", fontSize: 24, flexShrink: 0 }} />
                  <Typography sx={{ ...titleStyle, fontSize: { xs: 17, sm: 19 } }}>
                    Post Studio · Instagram 9:16 Video Reel
                  </Typography>
                </Box>
                <Chip label="9:16 Vertical Reel Mode" size="small" sx={{ bgcolor: "#22c55e", color: "#ffffff", fontWeight: 800, fontSize: 11 }} />
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" }, gap: 3 }}>
                {/* Image Preview */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: 280, sm: 380 },
                      borderRadius: "12px",
                      bgcolor: "#09090b",
                      overflow: "hidden",
                      border: "1px solid #e4e4e7",
                      position: "relative",
                    }}
                  >
                    <img
                      src={selectedKohliImage.imageUrl}
                      alt={selectedKohliImage.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: { xs: 1.5, sm: 2 },
                        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                        color: "#ffffff",
                      }}
                    >
                      <Typography sx={{ fontSize: { xs: 11, sm: 12 }, fontWeight: 700, color: "#eab308", textTransform: "uppercase" }}>
                        {selectedTopicText}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: 12.5, sm: 14 }, fontWeight: 700, fontStyle: "italic", mt: 0.5, wordBreak: "break-word" }}>
                        "{selectedQuoteText}"
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Form Controls */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8, flexWrap: "wrap", gap: 1 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#09090b" }}>
                        🎵 Attached Audio Track (Looped Songs)
                      </Typography>
                      {selectedSongId && (
                        <Button
                          size="small"
                          onClick={() => {
                            const found = listedSongs.find((s) => String(s._id) === String(selectedSongId));
                            if (found) togglePlaySong(found);
                          }}
                          startIcon={
                            isPlayingAudio && playingSongId === selectedSongId ? (
                              <PauseIcon sx={{ color: "#eab308" }} />
                            ) : (
                              <PlayArrowIcon />
                            )
                          }
                          sx={{
                            textTransform: "none",
                            fontSize: 11.5,
                            fontWeight: 700,
                            borderRadius: "8px",
                            color: isPlayingAudio && playingSongId === selectedSongId ? "#eab308" : "#09090b",
                            bgcolor: isPlayingAudio && playingSongId === selectedSongId ? "#09090b" : "#f4f4f5",
                            px: 1.5,
                            py: 0.4,
                            "&:hover": { bgcolor: "#27272a", color: "#ffffff" },
                          }}
                        >
                          {isPlayingAudio && playingSongId === selectedSongId ? "Pause Track" : "🎧 Listen to Track"}
                        </Button>
                      )}
                    </Box>
                    {listedSongs.length === 0 ? (
                      <Alert severity="info" sx={{ borderRadius: "10px", fontSize: 12 }}>
                        No manual songs added yet. Add a song below to enable custom audio looping for your reels!
                      </Alert>
                    ) : (
                      <FormControl sx={field} fullWidth size="small">
                        <Select
                          value={selectedSongId || (listedSongs[0]?._id || "")}
                          onChange={(e) => setSelectedSongId(e.target.value)}
                        >
                          {listedSongs.map((s) => (
                            <MenuItem key={s._id} value={s._id}>
                              🎵 {s.title} · {s.artist} ({s.genre})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>

                  <TextField
                    size="small"
                    label="Quote Topic / Hook"
                    value={selectedTopicText}
                    onChange={(e) => setSelectedTopicText(e.target.value)}
                    sx={field}
                    fullWidth
                  />

                  <TextField
                    label="Virat Kohli Quote Text"
                    value={selectedQuoteText}
                    onChange={(e) => setSelectedQuoteText(e.target.value)}
                    multiline
                    rows={2}
                    sx={field}
                    fullWidth
                  />

                  <TextField
                    size="small"
                    label="Viral Hashtags"
                    value={customKohliHashtags}
                    onChange={(e) => setCustomKohliHashtags(e.target.value)}
                    sx={field}
                    fullWidth
                  />

                  <Button
                    variant="contained"
                    onClick={handlePublishSelectedKohliPost}
                    disabled={publishingKohliPost}
                    startIcon={publishingKohliPost ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      mt: 1,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: { xs: 14.5, sm: 16 },
                      minHeight: 52,
                      width: "100%",
                      bgcolor: "#09090b",
                      color: "#ffffff",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                      "&:hover": { bgcolor: "#27272a" },
                    }}
                  >
                    {publishingKohliPost ? "Generating Reel & Publishing to Instagram..." : "🚀 Publish 9:16 Reel to Instagram"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {/* 4. 🎵 LISTED SONGS MANAGER */}
          <Paper sx={{ ...whiteCard, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MusicNoteIcon sx={{ color: "#09090b", fontSize: 24, flexShrink: 0 }} />
                <Typography sx={{ ...titleStyle, fontSize: { xs: 17, sm: 19 } }}>
                  Listed Songs & Audio Soundscapes ({listedSongs.length})
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                <Chip
                  label="🔁 1 Song = Every Reel · 2+ Songs = 1-by-1 Sequential Loop"
                  size="small"
                  sx={{ bgcolor: "#f4f4f5", color: "#09090b", fontWeight: 700, fontSize: 11 }}
                />
                {listedSongs.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleClearAllSongs}
                    startIcon={<DeleteOutlineIcon />}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      color: "#ef4444",
                      borderColor: "#fca5a5",
                      fontWeight: 700,
                      fontSize: 11.5,
                      "&:hover": { bgcolor: "#fef2f2", borderColor: "#ef4444" },
                    }}
                  >
                    Clear All Songs
                  </Button>
                )}
              </Box>
            </Box>

            <Typography sx={{ fontSize: 12.5, color: "#71717a", mb: 2.5, wordBreak: "break-word" }}>
              Upload audio files (<strong>.mp3, .wav, .m4a, .aac, .ogg</strong>) directly from your PC or mobile phone. When 1 song is added, the agent uses it for every 9:16 reel. When 2 or more songs are uploaded, the agent loops through them sequentially <strong>1-by-1</strong> for each daily post/reel. Click play to listen to any track directly!
            </Typography>

            {/* Device Audio Upload Bar */}
            <input
              type="file"
              ref={audioFileInputRef}
              accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.wma"
              onChange={handleAudioFileSelected}
              style={{ display: "none" }}
            />

            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 3,
                bgcolor: "#fcfcfc",
                borderRadius: "14px",
                border: "2px dashed #d4d4d8",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    bgcolor: "#09090b",
                    color: "#eab308",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: 13.5, sm: 14.5 }, color: "#09090b", wordBreak: "break-word" }}>
                    Upload Song File from PC / Mobile
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#71717a", wordBreak: "break-word" }}>
                    Supported formats: MP3, WAV, M4A, AAC, OGG, FLAC (Max 50MB)
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={() => audioFileInputRef.current?.click()}
                disabled={uploadingAudioFile}
                startIcon={uploadingAudioFile ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: 13.5,
                  bgcolor: "#09090b",
                  color: "#ffffff",
                  px: 3,
                  py: 1.2,
                  width: { xs: "100%", sm: "auto" },
                  whiteSpace: "normal",
                  "&:hover": { bgcolor: "#27272a" },
                }}
              >
                {uploadingAudioFile ? "Uploading to CDN..." : "📁 Choose Audio File (.mp3, .wav, .m4a)"}
              </Button>
            </Box>

            {/* Manual Metadata Add Bar */}
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#71717a", textTransform: "uppercase", mb: 1 }}>
              Or Add Custom Audio Track with URL / Metadata:
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "1.2fr 1fr 1fr 1.2fr auto" }, gap: 1.5, mb: 3, p: 2, bgcolor: "#fafafa", borderRadius: "12px", border: "1px solid #e4e4e7" }}>
              <TextField
                size="small"
                label="Song Title *"
                value={newSongTitle}
                onChange={(e) => setNewSongTitle(e.target.value)}
                placeholder="e.g. Winning Speech, Chak De India..."
                sx={field}
              />
              <TextField
                size="small"
                label="Artist Name"
                value={newSongArtist}
                onChange={(e) => setNewSongArtist(e.target.value)}
                placeholder="e.g. Karan Aujla, Sukhwinder Singh..."
                sx={field}
              />
              <TextField
                size="small"
                label="Genre / Vibe"
                value={newSongGenre}
                onChange={(e) => setNewSongGenre(e.target.value)}
                placeholder="e.g. Punjabi Hype, Aggression..."
                sx={field}
              />
              <TextField
                size="small"
                label="MP3 / Audio URL (Optional)"
                value={newSongAudioUrl}
                onChange={(e) => setNewSongAudioUrl(e.target.value)}
                placeholder="https://.../song.mp3"
                sx={field}
              />
              <Button
                variant="contained"
                onClick={handleAddSong}
                disabled={addingSong || !newSongTitle.trim()}
                startIcon={<AddIcon />}
                sx={{
                  gridColumn: { xs: "1 / -1", md: "auto" },
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: 13,
                  bgcolor: "#09090b",
                  color: "#ffffff",
                  px: 2.5,
                  py: { xs: 1.2, md: "auto" },
                  "&:hover": { bgcolor: "#27272a" },
                }}
              >
                Add Song
              </Button>
            </Box>

            {/* Song List Cards or Empty State */}
            {listedSongs.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fafafa", borderRadius: "12px", border: "1px dashed #e4e4e7" }}>
                <MusicNoteIcon sx={{ fontSize: 36, color: "#a1a1aa", mb: 1 }} />
                <Typography sx={{ fontWeight: 800, fontSize: 15, color: "#09090b", mb: 0.5 }}>
                  No songs uploaded yet
                </Typography>
                <Typography sx={{ color: "#71717a", fontSize: 13, maxWidth: 500, mx: "auto" }}>
                  Upload your favorite audio files (.mp3, .wav, .m4a) above. The agent will loop them sequentially (1-by-1) when generating 9:16 video reels!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
                {listedSongs.map((song) => {
                  const isCurrentPlaying = isPlayingAudio && playingSongId === song._id;
                  return (
                    <Box
                      key={song._id}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        bgcolor: isCurrentPlaying ? "#09090b" : (song.active !== false ? "#ffffff" : "#f4f4f5"),
                        color: isCurrentPlaying ? "#ffffff" : "#09090b",
                        border: isCurrentPlaying ? "2px solid #eab308" : "1px solid #e4e4e7",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1.5,
                        transition: "all 0.2s ease",
                        boxShadow: isCurrentPlaying ? "0 4px 14px rgba(0,0,0,0.2)" : "none",
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1, overflow: "hidden" }}>
                        <IconButton
                          size="medium"
                          onClick={() => togglePlaySong(song)}
                          sx={{
                            bgcolor: isCurrentPlaying ? "#eab308" : "#f4f4f5",
                            color: isCurrentPlaying ? "#09090b" : "#09090b",
                            "&:hover": { bgcolor: isCurrentPlaying ? "#facc15" : "#e4e4e7" },
                            flexShrink: 0,
                          }}
                        >
                          {isCurrentPlaying ? <PauseIcon sx={{ fontSize: 20 }} /> : <PlayArrowIcon sx={{ fontSize: 20 }} />}
                        </IconButton>

                        <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: 13.5,
                                color: isCurrentPlaying ? "#ffffff" : (song.active !== false ? "#09090b" : "#71717a"),
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {song.title}
                            </Typography>
                            {isCurrentPlaying && (
                              <GraphicEqIcon sx={{ fontSize: 16, color: "#eab308", flexShrink: 0 }} />
                            )}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 11.5,
                              color: isCurrentPlaying ? "#d4d4d8" : "#71717a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {song.artist} · <span style={{ color: isCurrentPlaying ? "#eab308" : "#a1a1aa" }}>{song.genre}</span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                        <Switch
                          size="small"
                          checked={song.active !== false}
                          onChange={() => handleToggleSong(song._id)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: isCurrentPlaying ? "#eab308" : "#09090b",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: isCurrentPlaying ? "#eab308" : "#09090b",
                            },
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSong(song._id)}
                          sx={{ color: isCurrentPlaying ? "#f87171" : "#ef4444" }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: 🌲 DIRECT NATURE REEL PUBLISHER ── */}
      {/* ════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "nature_reels" && (
        <Paper sx={{ ...whiteCard, mb: 3, border: "2px solid #09090b" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CloudUploadIcon sx={{ color: "#09090b", fontSize: 24, flexShrink: 0 }} />
              <Typography sx={{ ...titleStyle, fontSize: { xs: 17, sm: 20 } }}>
                Direct Instagram Reel Publisher
              </Typography>
            </Box>
            <Chip label="Instant Publishing" size="small" sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 800, fontSize: 11 }} />
          </Box>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#71717a", fontSize: 13.5, mb: 3, wordBreak: "break-word" }}>
            Upload your video, pick your 12-Series Nature Realm & Aspect Ratio, and click <strong>Publish to Instagram</strong>.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            {/* Left Column: Media Selection */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    flex: 1,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: 13.5,
                    bgcolor: "#09090b",
                    color: "#ffffff",
                    "&:hover": { bgcolor: "#27272a" },
                    minHeight: 48,
                  }}
                >
                  {selectedFile ? "📁 Change Video File" : "📁 Choose Video File (.mp4, .mov)"}
                </Button>
                {selectedFile && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedFile(null);
                      setVideoPreviewUrl("");
                    }}
                    sx={{ borderRadius: "10px", textTransform: "none", color: "#ef4444", borderColor: "#fca5a5" }}
                  >
                    Clear
                  </Button>
                )}
              </Box>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setVideoPreviewUrl(URL.createObjectURL(file));
                    setTopic(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
                  }
                }}
                accept="video/*"
                style={{ display: "none" }}
              />

              <TextField
                size="small"
                label="Public Video URL (Optional)"
                value={videoUrlInput}
                onChange={(e) => {
                  setVideoUrlInput(e.target.value);
                  if (e.target.value) {
                    setSelectedFile(null);
                    setVideoPreviewUrl(e.target.value);
                  }
                }}
                placeholder="https://..."
                sx={field}
                fullWidth
              />

              <Box
                sx={{
                  width: "100%",
                  height: aspectRatio === "16:9" ? { xs: 180, sm: 220 } : { xs: 260, sm: 340 },
                  borderRadius: "12px",
                  bgcolor: "#09090b",
                  border: "1px solid #e4e4e7",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {videoPreviewUrl ? (
                  <video
                    src={videoPreviewUrl}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    controls
                    playsInline
                  />
                ) : (
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <CloudUploadIcon sx={{ color: "#52525b", fontSize: 42, mb: 1 }} />
                    <Typography sx={{ color: "#a1a1aa", fontSize: 13, fontWeight: 600 }}>
                      Video Preview Will Appear Here
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Right Column: Settings */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr" }, gap: 1.5 }}>
                <FormControl sx={field} fullWidth size="small">
                  <InputLabel>Nature Realm ⭐</InputLabel>
                  <Select
                    label="Nature Realm ⭐"
                    value={realm}
                    onChange={(e) => {
                      setRealm(e.target.value);
                      const target = NATURE_REALMS.find((r) => r.realm === e.target.value) || NATURE_REALMS[0];
                      setTopic(target.defaultTopic);
                      setCaption(target.defaultCaption);
                      setHashtags(target.defaultHashtags);
                    }}
                  >
                    {NATURE_REALMS.map((r) => (
                      <MenuItem key={r.id} value={r.realm}>
                        {r.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={field} fullWidth size="small">
                  <InputLabel>Aspect Ratio 📐</InputLabel>
                  <Select
                    label="Aspect Ratio 📐"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                  >
                    <MenuItem value="9:16">📱 9:16 Vertical Reel</MenuItem>
                    <MenuItem value="16:9">🖥️ 16:9 Landscape</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                size="small"
                label="Reel Topic / Title"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                sx={field}
                fullWidth
              />

              <TextField
                label="Instagram Reel Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                multiline
                rows={4}
                sx={field}
                fullWidth
              />

              <TextField
                size="small"
                label="Viral Hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                sx={field}
                fullWidth
              />

              <Button
                variant="contained"
                disabled={publishing || (!selectedFile && !videoUrlInput.trim())}
                startIcon={publishing ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  mt: 1,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: { xs: 14.5, sm: 16 },
                  minHeight: 54,
                  bgcolor: "#09090b",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#27272a" },
                }}
              >
                {publishing ? (publishProgressText || "Publishing to Instagram...") : "🚀 Publish Directly to Instagram Reels"}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* ── PUBLISHED POSTS & REELS HISTORY ── */}
      <Paper sx={{ ...whiteCard, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Typography sx={{ ...titleStyle, fontSize: { xs: 16, sm: 18 } }}>
            Live Published Posts & Reels ({publishedItems.length})
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#71717a" }}>
            Live on @{account.username || "quietframes.ai"}
          </Typography>
        </Box>

        {publishedItems.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fafafa", borderRadius: "12px", border: "1px dashed #e4e4e7" }}>
            <Typography sx={{ color: "#71717a", fontSize: 14 }}>
              No posts published yet. Use the <strong>👑 Virat Kohli Quote Agent</strong> above to publish your first post!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
            {publishedItems.map((item) => (
              <Box
                key={item._id}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  bgcolor: "#fafafa",
                  border: "1px solid #e4e4e7",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 0.5 }}>
                    <Chip
                      label={item.themeCategory || item.speaker || "Virat Kohli"}
                      size="small"
                      sx={{ bgcolor: "#09090b", color: "#ffffff", fontWeight: 700, fontSize: 10 }}
                    />
                    <Chip
                      label={item.type === "reel" ? "📱 Reel" : "📸 Post"}
                      size="small"
                      sx={{ bgcolor: "#e4e4e7", color: "#09090b", fontWeight: 700, fontSize: 10 }}
                    />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#09090b", mb: 0.5, wordBreak: "break-word" }}>
                    {item.topic}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#71717a", maxHeight: 50, overflow: "hidden", textOverflow: "ellipsis", wordBreak: "break-word" }}>
                    {item.caption}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                  <Typography sx={{ fontSize: 11, color: "#a1a1aa" }}>
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Live on IG"}
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: "14px !important", color: "#22c55e !important" }} />}
                    label="Live on Feed"
                    size="small"
                    sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontSize: 10 }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

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

      {/* ── HIDDEN AUDIO ELEMENT & FIXED FLOATING NOW PLAYING BAR ── */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {activePlayingSong && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: { xs: 12, sm: 24 },
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: "calc(100% - 24px)", sm: 580, md: 680 },
            maxWidth: "100%",
            boxSizing: "border-box",
            zIndex: 1300,
            borderRadius: "16px",
            bgcolor: "#09090b",
            color: "#ffffff",
            p: { xs: 1.5, sm: 2 },
            border: "1px solid #27272a",
            boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1, overflow: "hidden" }}>
              <IconButton
                onClick={() => togglePlaySong(activePlayingSong)}
                sx={{
                  bgcolor: "#eab308",
                  color: "#09090b",
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  "&:hover": { bgcolor: "#facc15" },
                }}
              >
                {isPlayingAudio ? <PauseIcon sx={{ fontSize: 20 }} /> : <PlayArrowIcon sx={{ fontSize: 20 }} />}
              </IconButton>
              <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 12.5, sm: 13.5 }, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  🎵 {activePlayingSong.title}
                </Typography>
                <Typography sx={{ fontSize: { xs: 10.5, sm: 11.5 }, color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {activePlayingSong.artist} · <span style={{ color: "#eab308" }}>{activePlayingSong.genre}</span>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <Typography sx={{ fontSize: { xs: 10.5, sm: 11.5 }, color: "#d4d4d8", fontFamily: "monospace" }}>
                {formatTime(audioProgress)} / {formatTime(audioDuration)}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlayingAudio(false);
                  setPlayingSongId(null);
                }}
                sx={{ color: "#a1a1aa", "&:hover": { color: "#ffffff" } }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            <Slider
              size="small"
              value={audioProgress}
              max={audioDuration || 100}
              onChange={handleSeek}
              sx={{
                color: "#eab308",
                height: 4,
                flex: 1,
                "& .MuiSlider-thumb": { width: 10, height: 10 },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: { xs: 70, sm: 120 } }}>
              <IconButton
                size="small"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !audioMuted;
                    setAudioMuted(!audioMuted);
                  }
                }}
                sx={{ color: "#a1a1aa", p: 0.5 }}
              >
                {audioMuted || audioVolume === 0 ? <VolumeOffIcon sx={{ fontSize: 16 }} /> : <VolumeUpIcon sx={{ fontSize: 16 }} />}
              </IconButton>
              <Slider
                size="small"
                value={audioMuted ? 0 : audioVolume}
                min={0}
                max={1}
                step={0.05}
                onChange={handleVolumeChange}
                sx={{
                  color: "#ffffff",
                  height: 3,
                  "& .MuiSlider-thumb": { width: 8, height: 8 },
                }}
              />
            </Box>
          </Box>
        </Paper>
      )}

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
