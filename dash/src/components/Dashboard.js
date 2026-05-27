import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box, Typography, IconButton, createTheme, ThemeProvider,
  CssBaseline, Fade, useMediaQuery, useTheme,
  Snackbar, Alert, Button, Drawer,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LayersIcon from "@mui/icons-material/Layers";
import CodeIcon from "@mui/icons-material/Code";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import axios from "axios";

import Dsaclass from "./Algorithms/dsaclass";
import Courses from "./Batches/Courses";
import PreBatch from "./Batches/PreBatch";
import RevBatch from "./Revision/RevBatch";
import ColBatch from "./College/ColBatch";
import Authentication from "./authentication";
import MyBatchesPage from "./MyBatchesPage";
import server from "../environment";
import NotificationPage from "./notification";
import DoubtPage from "./doubt";
import PaymentsPage from "./payment";
import AdminDashboard from "./AdminDashboard";

const COURSE_ROUTES = ["/dsac", "/cou", "/pre", "/rev", "/col"];

const VIEW_HOME          = "home";
const VIEW_MYBATCHES     = "mybatches";
const VIEW_NOTIFICATIONS = "notifications";
const VIEW_DOUBTS        = "doubts";
const VIEW_PAYMENTS      = "payments";

const SECTIONS = [
  { icon: SchoolIcon,        title: "My Batches",    desc: "Track your enrolled classes by Class ID.", view: VIEW_MYBATCHES,     accent: "#1a1a2e", tag: "Study" },
  { icon: NotificationsIcon, title: "Notifications", desc: "Important messages from your instructor.", view: VIEW_NOTIFICATIONS, accent: "#0f4c75", tag: "Updates" },
  { icon: HelpOutlineIcon,   title: "Doubt / Issue", desc: "Raise and track your academic doubts.",    view: VIEW_DOUBTS,        accent: "#1b262c", tag: "Support" },
  { icon: PaymentIcon,       title: "Payments",      desc: "Manage subscriptions and billing.",        view: VIEW_PAYMENTS,      accent: "#2d132c", tag: "Finance" },
];

const SOCIAL = [
  { Icon: LinkedInIcon,  color: "#0077b5", href: "https://whatsapp.com/channel/0029VbBV3BB5kg732Ch60Q1R", label: "LinkedIn" },
  { Icon: WhatsAppIcon,  color: "#25D366", href: "https://whatsapp.com/channel/0029VbBV3BB5kg732Ch60Q1R", label: "WhatsApp" },
  { Icon: InstagramIcon, color: "#E4405F", href: "https://www.instagram.com/crrack_it?igsh=MWI5d2FodmJocjFvbw==", label: "Instagram" },
  { Icon: TelegramIcon,  color: "#0088cc", href: "https://t.me/+PiG4n-LCEw0yMDg1", label: "Telegram" },
];

const QUICK_COURSES = [
  {
    label: "ProEdge",
    sublabel: "Premium Batches",
    route: "/pre",
    icon: AutoAwesomeIcon,
    emoji: "⚡",
    iconBg: "linear-gradient(135deg, #2c2c2c 0%, #555555 100%)",
    dot: "#333",
  },
  {
    label: "Batches",
    sublabel: "All Courses",
    route: "/cou",
    icon: LayersIcon,
    emoji: "📚",
    iconBg: "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)",
    dot: "#1a1a1a",
  },
  {
    label: "DevAlgo",
    sublabel: "DSA & Algorithms",
    route: "/dsac",
    icon: CodeIcon,
    emoji: "💻",
    iconBg: "linear-gradient(135deg, #3a3a3a 0%, #707070 100%)",
    dot: "#3a3a3a",
  },
  {
    label: "CDS",
    sublabel: "Revision Batch",
    route: "/rev",
    icon: MilitaryTechIcon,
    emoji: "🎯",
    iconBg: "linear-gradient(135deg, #111111 0%, #444444 100%)",
    dot: "#111",
  },
  {
    label: "College",
    sublabel: "University Prep",
    route: "/col",
    icon: AccountBalanceIcon,
    emoji: "🏛️",
    iconBg: "linear-gradient(135deg, #222222 0%, #606060 100%)",
    dot: "#222",
  },
];

const SIDEBAR_W = 248;

/* ─────────────────────────────────────────────────────────────────────
   SEARCH BAR — extracted as a true top-level component so it NEVER
   re-mounts when Dashboard state changes. This is the fix for the
   cursor-loss bug: HomeView was defined inside Dashboard and recreated
   on every render, which unmounted+remounted the <input> each keystroke.
───────────────────────────────────────────────────────────────────── */
const CourseSearchBar = ({ onNavigate, displayName }) => {
  const [searchQuery,   setSearchQuery]   = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef  = useRef(null);
  const inputRef   = useRef(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCourses = searchQuery.trim()
    ? QUICK_COURSES.filter(
        (c) =>
          c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.sublabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const showDropdown = searchFocused && searchQuery.trim().length > 0;

  const handleSelect = useCallback((route) => {
    onNavigate(route);
    setSearchQuery("");
    setSearchFocused(false);
  }, [onNavigate]);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setSearchFocused(false);
    inputRef.current?.blur();
  }, []);

  return (
    /* Wrapper: greeting left + search right, aligned to center */
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 3,
      mb: 4,
      flexWrap: { xs: "wrap", sm: "nowrap" },
    }}>

      {/* ── LEFT: Greeting ── */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography sx={{
          fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontStyle: "italic",
          fontSize: { xs: 11, sm: 13 }, color: "#aaa",
          letterSpacing: "2px", textTransform: "uppercase", mb: 0.5,
        }}>Good day</Typography>
        <Typography sx={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800,
          fontSize: { xs: 26, sm: 34 }, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-1px",
        }}>{displayName} 👋</Typography>
        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#aaa", mt: 0.8, fontWeight: 400,
        }}>Here's what's available for you today.</Typography>
      </Box>

      {/* ── RIGHT: Search bar ── */}
      <Box
        ref={searchRef}
        sx={{
          position: "relative",
          width: { xs: "100%", sm: 280, md: 620 },
          flexShrink: 0,
        }}
      >
        {/* Input row */}
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1.2,
            px: 2, height: 50,
            borderRadius: "16px",
            border: searchFocused ? "2px solid #1a1a2e" : "2px solid #e4e4e4",
            background: searchFocused ? "#fff" : "#f5f5f7",
            boxShadow: searchFocused
              ? "0 8px 28px rgba(0,0,0,0.11)"
              : "0 2px 6px rgba(0,0,0,0.04)",
            transition: "border 0.2s, box-shadow 0.2s, background 0.2s",
          }}
        >
          <SearchIcon sx={{
            fontSize: 19,
            color: searchFocused ? "#1a1a2e" : "#c0c0c0",
            transition: "color 0.2s",
            flexShrink: 0,
          }} />

          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search courses…"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5,
              fontWeight: 500,
              color: "#1a1a2e",
              minWidth: 0,
            }}
          />

          {searchQuery ? (
            <IconButton
              size="small"
              onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
              sx={{
                width: 24, height: 24, borderRadius: "7px",
                background: "#e0e0e0", flexShrink: 0,
                "&:hover": { background: "#cecece" },
              }}
            >
              <CloseIcon sx={{ fontSize: 13, color: "#555" }} />
            </IconButton>
          ) : (
            <Box sx={{
              px: 0.9, py: 0.2, borderRadius: "6px",
              background: "#e8e8e8", flexShrink: 0,
            }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 9.5,
                fontWeight: 700, color: "#aaa", letterSpacing: "0.4px",
              }}>⌘ K</Typography>
            </Box>
          )}
        </Box>

        {/* Dropdown */}
        {showDropdown && (
          <Box sx={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
            background: "#fff",
            borderRadius: "14px",
            border: "1.5px solid #e8e8e8",
            boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
            overflow: "hidden",
            zIndex: 1300,
          }}>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(({ label, sublabel, route, icon: Icon, iconBg }) => (
                <Box
                  key={route}
                  /* use onMouseDown + preventDefault so blur fires AFTER click */
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(route); }}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.8,
                    px: 2.2, py: 1.4, cursor: "pointer",
                    transition: "background 0.13s",
                    "&:hover": { background: "#f7f7f9" },
                    "&:not(:last-child)": { borderBottom: "1px solid #f4f4f4" },
                  }}
                >
                  <Box sx={{
                    width: 34, height: 34, borderRadius: "10px",
                    background: iconBg, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.14)",
                  }}>
                    <Icon sx={{ fontSize: 16, color: "#fff" }} />
                  </Box>
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Typography sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700, fontSize: 13, color: "#1a1a2e",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{label}</Typography>
                    <Typography sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10.5, color: "#aaa",
                    }}>{sublabel}</Typography>
                  </Box>
                  <ArrowBackIosNewIcon sx={{ fontSize: 9, color: "#ccc", transform: "rotate(180deg)", flexShrink: 0 }} />
                </Box>
              ))
            ) : (
              <Box sx={{ px: 2.5, py: 2, textAlign: "center" }}>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12.5, color: "#bbb", fontWeight: 500,
                }}>No courses found for "{searchQuery}"</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

/* ── main Dashboard ── */
const Dashboard = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const muiTheme   = useTheme();
  const isMobile   = useMediaQuery(muiTheme.breakpoints.down("md"));

  const [activeView,   setActiveView]   = useState(VIEW_HOME);
  const [purchases,    setPurchases]    = useState([]);
  const [showPopup,    setShowPopup]    = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [userName,     setUserName]     = useState("Student");

  const isCourseRoute = COURSE_ROUTES.some((r) => location.pathname.startsWith(r));

  const theme = createTheme({
    palette: { mode: "light" },
    typography: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${server}/api/user/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const name =
          res.data?.fullName ||
          res.data?.name ||
          res.data?.username ||
          localStorage.getItem("username") ||
          "Student";
        setUserName(name);
        localStorage.setItem("username", name);
      } catch {
        const stored = localStorage.getItem("username") || "Student";
        setUserName(stored);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(`${server}/api/user-purchases`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!Array.isArray(res.data)) return;
        const mapped = res.data.map((item) => {
          const title = item.title?.trim();
          let route = "/cou";
          if (title === "Revision")             route = "/rev";
          else if (title === "DsaAlgo")         route = "/dsac";
          else if (title === "premium Batches") route = "/pre";
          else if (title === "CDS")             route = "/cds";
          return { title, route, price: item.price, expiryDate: item.expiryDate, classId: item.classId };
        });
        setPurchases(mapped);
      } catch (err) { console.error("Error fetching purchases", err); }
    };
    fetchPurchases();
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "newNotification") {
        try {
          const data = JSON.parse(e.newValue);
          if (data?.message) { setPopupMessage(data.message); setShowPopup(true); }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const displayName = userName.includes("@")
    ? userName.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : userName;

  const initials = displayName
    .split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const goView  = (view)  => { setActiveView(view); setMobileDrawer(false); };
  const goRoute = useCallback((route) => { navigate(route); setMobileDrawer(false); }, [navigate]);
  const goBackToDashboard = () => { navigate("/dashboard"); setActiveView(VIEW_HOME); };

  /* ─────────────────────────────── SIDEBAR ─────────────────────────── */
  const SidebarContent = () => (
    <Box sx={{
      width: SIDEBAR_W, height: "100%",
      display: "flex", flexDirection: "column",
      background: "#fff",
      borderRight: "1.5px solid #f0f0f5",
      py: 0, overflow: "hidden",
      position: "relative",
    }}>

      <Box sx={{ px: 3, mb: 1.5, pt: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
          color: "#c0c0cc", letterSpacing: "1.6px", textTransform: "uppercase",
        }}>My Courses</Typography>
        <Box sx={{ flex: 1, height: "1px", background: "#f0f0f5" }} />
      </Box>

      <Box sx={{ px: 1.5, flex: 1, overflowY: "auto", pb: 1 }}>
        {QUICK_COURSES.map(({ label, sublabel, route, icon: Icon, iconBg }) => (
          <Box
            key={route}
            onClick={() => goRoute(route)}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: 1.5, py: 1.2, borderRadius: "14px",
              cursor: "pointer", mb: 0.5,
              transition: "all 0.18s ease",
              "&:hover": {
                background: "#f7f7fb",
                transform: "translateX(4px)",
                "& .course-icon-box": { transform: "scale(1.08)" },
              },
            }}
          >
            <Box
              className="course-icon-box"
              sx={{
                width: 38, height: 38, borderRadius: "11px",
                background: iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                transition: "transform 0.18s ease",
              }}
            >
              <Icon sx={{ fontSize: 19, color: "#fff" }} />
            </Box>
            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                fontWeight: 700, color: "#1a1a2e",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{label}</Typography>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                color: "#aaa", fontWeight: 400,
              }}>{sublabel}</Typography>
            </Box>
            <ArrowBackIosNewIcon sx={{ fontSize: 10, color: "#ccc", transform: "rotate(180deg)", flexShrink: 0 }} />
          </Box>
        ))}
      </Box>

      <Box sx={{ mx: 2, my: 1.5, height: "1px", background: "#f0f0f5" }} />

      <Box sx={{ px: 2.5, pb: 12 }}>
        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
          color: "#c0c0cc", letterSpacing: "1.4px", textTransform: "uppercase", mb: 1.5,
        }}>Connect With Us</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {SOCIAL.map(({ Icon, color, href, label }) => (
            <Box
              key={href} component="a" href={href}
              target="_blank" rel="noopener" aria-label={label}
              sx={{
                width: 36, height: 36, borderRadius: "11px",
                border: "1.5px solid #f0f0f5", color,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#fafafa",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: color, color: "#fff",
                  border: `1.5px solid ${color}`,
                  transform: "translateY(-3px)",
                  boxShadow: `0 6px 16px ${color}40`,
                },
              }}
            >
              <Icon sx={{ fontSize: 17 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  /* ─────────────────────── HOME VIEW ──────────────────────────────── */
  /* NOTE: HomeView stays inside Dashboard but NO longer contains the
     search bar or the greeting — those live in CourseSearchBar above.
     This means state changes from typing do NOT touch HomeView at all. */
  const HomeView = () => (
    <Fade in timeout={600}>
      <Box>
        {/* Search bar + greeting — stable top-level component, never re-mounts */}
        <CourseSearchBar onNavigate={goRoute} displayName={displayName} />

        {/* Section cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          {SECTIONS.map(({ icon: Icon, title, desc, view, accent, tag }) => (
            <Box
              key={title}
              className="card-hover"
              onClick={() => goView(view)}
              sx={{
                background: "#fff", border: "1px solid #f0f0f0",
                borderRadius: "20px", p: 3, cursor: "pointer",
                display: "flex", flexDirection: "column", gap: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                position: "relative", overflow: "hidden",
              }}
            >
              <Box sx={{
                position: "absolute", top: 18, right: 18,
                px: 1.2, py: 0.3, borderRadius: "8px", background: "#f4f4f6",
                fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                color: "#aaa", letterSpacing: "0.8px", textTransform: "uppercase",
              }}>{tag}</Box>

              <Box sx={{
                width: 46, height: 46, borderRadius: "14px", background: accent,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon sx={{ color: "#fff", fontSize: 22 }} />
              </Box>

              <Box>
                <Typography sx={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 700,
                  fontSize: 17, color: "#1a1a2e", mb: 0.5, letterSpacing: "-0.3px",
                }}>{title}</Typography>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#aaa", lineHeight: 1.6,
                }}>{desc}</Typography>
              </Box>

              <Box sx={{
                display: "inline-flex", alignItems: "center",
                fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, color: accent, letterSpacing: "0.3px",
              }}>Open →</Box>
            </Box>
          ))}
        </Box>

        {/* Quick access course pills */}
        <Box sx={{ mt: 4 }}>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11,
            color: "#c0c0c8", letterSpacing: "1.5px", textTransform: "uppercase", mb: 2,
          }}>Quick Access — Courses</Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {QUICK_COURSES.map(({ label, route, icon: Icon, iconBg }) => (
              <Box
                key={label}
                onClick={() => goRoute(route)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1,
                  pl: 1, pr: 2.5, py: 0.8,
                  borderRadius: "30px",
                  border: "1px solid #e8e8e8", background: "#fff",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  "&:hover": { background: "#1a1a2e", color: "#fff", border: "1px solid #1a1a2e" },
                }}
              >
                <Box sx={{
                  width: 24, height: 24, borderRadius: "8px",
                  background: iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon sx={{ fontSize: 13, color: "#fff" }} />
                </Box>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, fontSize: 13, color: "inherit",
                }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  );

  /* ─────────────────── SUB-VIEW BACK HEADER ───────────────────────── */
  const SubViewHeader = ({ title }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
      <IconButton
        onClick={() => goView(VIEW_HOME)}
        sx={{
          background: "#f7f7f9", border: "1px solid #ebebeb",
          width: 36, height: 36, borderRadius: "10px",
          "&:hover": { background: "#ebebeb" },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 14, color: "#1a1a2e" }} />
      </IconButton>
      <Typography sx={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700, fontSize: 22, color: "#1a1a2e", letterSpacing: "-0.5px",
      }}>{title}</Typography>
    </Box>
  );

  /* ─────────────────────────── RENDER ─────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        .card-hover { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease !important; }
        .card-hover:hover { transform: translateY(-5px) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.09) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
        input::placeholder { color: #bbb; font-weight: 400; }
      `}</style>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Box sx={{ display: "flex", height: "100vh", background: "#fafafa", overflow: "hidden" }}>

          {!isCourseRoute && (
            <>
              {!isMobile ? (
                <Box sx={{ width: SIDEBAR_W, flexShrink: 0, height: "100vh" }}>
                  <SidebarContent />
                </Box>
              ) : (
                <Drawer
                  anchor="left" open={mobileDrawer}
                  onClose={() => setMobileDrawer(false)}
                  PaperProps={{ sx: { width: SIDEBAR_W, border: "none" } }}
                >
                  <SidebarContent />
                </Drawer>
              )}
            </>
          )}

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {!isCourseRoute && isMobile && (
              <Box sx={{
                height: 52, background: "#fff", borderBottom: "1px solid #f0f0f0",
                display: "flex", alignItems: "center", px: 2, flexShrink: 0,
              }}>
                <IconButton onClick={() => setMobileDrawer(true)} sx={{ color: "#333" }}>
                  <MenuIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <Typography sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700, fontSize: 16, color: "#1a1a2e", ml: 1,
                }}>EduPortal</Typography>
              </Box>
            )}

            {isCourseRoute && (
              <Box sx={{
                height: 56, background: "#fff", borderBottom: "1px solid #f0f0f0",
                display: "flex", alignItems: "center", px: 3, flexShrink: 0,
              }}>
                <Button
                  onClick={goBackToDashboard}
                  startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "13px !important" }} />}
                  sx={{
                    color: "#1a1a2e", textTransform: "none",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                    borderRadius: "10px", px: 2, py: 0.8,
                    border: "1px solid #ebebeb",
                    "&:hover": { background: "#f7f7f9" },
                  }}
                >Back to Dashboard</Button>
              </Box>
            )}

            <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 3 } }}>

              <Routes>
                <Route path="/auth"            element={<Authentication />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/dsac"            element={<Dsaclass />} />
                <Route path="/cou"             element={<Courses />} />
                <Route path="/pre"             element={<PreBatch />} />
                <Route path="/rev"             element={<RevBatch />} />
                <Route path="/col"             element={<ColBatch />} />
              </Routes>

              {!isCourseRoute && (
                <>
                  {activeView === VIEW_HOME && <HomeView />}
                  {activeView === VIEW_MYBATCHES && (
                    <Fade in timeout={400}><Box><SubViewHeader title="My Batches" /><MyBatchesPage /></Box></Fade>
                  )}
                  {activeView === VIEW_NOTIFICATIONS && (
                    <Fade in timeout={400}><Box><SubViewHeader title="Notifications" /><NotificationPage /></Box></Fade>
                  )}
                  {activeView === VIEW_DOUBTS && (
                    <Fade in timeout={400}><Box><SubViewHeader title="Doubt / Issue" /><DoubtPage /></Box></Fade>
                  )}
                  {activeView === VIEW_PAYMENTS && (
                    <Fade in timeout={400}><Box><SubViewHeader title="Payments" /><PaymentsPage /></Box></Fade>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>

        <Snackbar
          open={showPopup} autoHideDuration={4000}
          onClose={() => setShowPopup(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity="info" onClose={() => setShowPopup(false)}
            sx={{ fontFamily: "'DM Sans', sans-serif" }}>
            🔔 {popupMessage || "New Notification Received!"}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </>
  );
};

export default Dashboard;