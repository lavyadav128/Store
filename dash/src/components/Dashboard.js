


import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box, Typography, IconButton, createTheme, ThemeProvider,
  CssBaseline, Fade, useMediaQuery, useTheme,
  Snackbar, Alert, Button, Drawer,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AdminFileUpload from "./AdminFileUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
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
import DashboardIcon from "@mui/icons-material/Dashboard";
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
import LogoutIcon from "@mui/icons-material/Logout";

const COURSE_ROUTES = ["/dsac", "/cou", "/pre", "/rev", "/col"];

const VIEW_HOME          = "home";
const VIEW_MYBATCHES     = "mybatches";
const VIEW_NOTIFICATIONS = "notifications";
const VIEW_DOUBTS        = "doubts";
const VIEW_PAYMENTS      = "payments";
const VIEW_ADMIN         = "admin";
const VIEW_FILES = "files";

const SECTIONS = [
  { icon: SchoolIcon,        title: "My Batches",    desc: "Track your enrolled classes by Class ID.", view: VIEW_MYBATCHES,     accent: "#1a1a2e", tag: "Study" },
  { icon: NotificationsIcon, title: "Notifications", desc: "Important messages from your instructor.", view: VIEW_NOTIFICATIONS, accent: "#0f4c75", tag: "Updates" },
  { icon: HelpOutlineIcon,   title: "Doubt / Issue", desc: "Raise and track your academic doubts.",    view: VIEW_DOUBTS,        accent: "#1b262c", tag: "Support" },
  { icon: PaymentIcon,       title: "Payments",      desc: "Manage subscriptions and billing.",        view: VIEW_PAYMENTS,      accent: "#2d132c", tag: "Finance" },
];

const SOCIAL = [
  { Icon: LinkedInIcon,  color: "#0077b5", href: "https://www.linkedin.com/in/lav-yadav-90476981?utm_source=share_via&utm_content=profile&utm_medium=member_android", label: "LinkedIn" },
  { Icon: WhatsAppIcon,  color: "#25D366", href: "https://whatsapp.com/channel/0029VbBV3BB5kg732Ch60Q1R", label: "WhatsApp" },
  { Icon: InstagramIcon, color: "#E4405F", href: "https://www.instagram.com/crackhub.in?igsh=MW56d2poODJ0ZWtwdA==", label: "Instagram" },
  { Icon: TelegramIcon,  color: "#0088cc", href: "https://t.me/+PiG4n-LCEw0yMDg1", label: "Telegram" },
];

const QUICK_COURSES = [
  { label: "ProEdge",  sublabel: "Premium Batches",  route: "/pre",  icon: AutoAwesomeIcon,    emoji: "⚡", iconBg: "linear-gradient(135deg, #2c2c2c 0%, #555555 100%)", dot: "#333" },
  { label: "Batches",  sublabel: "All Courses",       route: "/cou",  icon: LayersIcon,         emoji: "📚", iconBg: "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)", dot: "#1a1a1a" },
  { label: "DevAlgo",  sublabel: "DSA & Algorithms",  route: "/dsac", icon: CodeIcon,           emoji: "💻", iconBg: "linear-gradient(135deg, #3a3a3a 0%, #707070 100%)", dot: "#3a3a3a" },
  { label: "CDS",      sublabel: "Revision Batch",    route: "/rev",  icon: MilitaryTechIcon,   emoji: "🎯", iconBg: "linear-gradient(135deg, #111111 0%, #444444 100%)", dot: "#111" },
  { label: "College",  sublabel: "University Prep",   route: "/col",  icon: AccountBalanceIcon, emoji: "🏛️", iconBg: "linear-gradient(135deg, #222222 0%, #606060 100%)", dot: "#222" },
];

const ADMIN_NAV = [
  { icon: DashboardIcon,     title: "Admin Dashboard", view: VIEW_ADMIN },
  { icon: UploadFileIcon,    title: "File Manager",    view: VIEW_FILES },  // ← add this
  { icon: SchoolIcon,        title: "My Batches",      view: VIEW_MYBATCHES },
  { icon: NotificationsIcon, title: "Notifications",   view: VIEW_NOTIFICATIONS },
  { icon: HelpOutlineIcon,   title: "Doubts",          view: VIEW_DOUBTS },
  { icon: PaymentIcon,       title: "Payments",        view: VIEW_PAYMENTS },
];

const SIDEBAR_W = 248;

/* ─────────────────────────────────────────────────────────────────────
   SEARCH BAR
───────────────────────────────────────────────────────────────────── */
const CourseSearchBar = ({ onNavigate, displayName, onOpenDrawer }) => {
  const [searchQuery,   setSearchQuery]   = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef  = useRef(null);

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
    <Box sx={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 3, mb: 4, flexWrap: { xs: "wrap", sm: "nowrap" },
    }}>
      {/*
        ── GREETING ROW ──
        Mobile:  flex row-reverse → greeting text on LEFT, menu button on RIGHT
        Desktop: normal block layout
      */}
      <Box sx={{
        display: { xs: "flex", sm: "block" },
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexDirection: { xs: "row-reverse", sm: "row" }, // ← KEY CHANGE: swaps sides on mobile
        width: { xs: "100%", sm: "auto" },
        flexShrink: 0,
      }}>
        {/* Mobile-only menu button — now on the RIGHT (row-reverse pushes it right) */}
        <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", pt: 0.5, flexShrink: 0 }}>
          <IconButton
            onClick={() => onOpenDrawer()}
            sx={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)",
              color: "#fff",
              width: 38, height: 38,
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(26,26,46,0.3)",
              flexShrink: 0,
              "&:active": { transform: "scale(0.92)" },
            }}
          >
            <MenuIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Box>

        {/* Greeting text — now on the LEFT on mobile (row-reverse puts this first visually) */}
        <Box sx={{ textAlign: { xs: "left", sm: "left" } }}> {/* ← changed xs from "right" to "left" */}
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
      </Box>

      <Box ref={searchRef} sx={{ position: "relative", width: { xs: "100%", sm: 280, md: 620 }, flexShrink: 0 }}>
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1.2,
          px: 2, height: 50, borderRadius: "16px",
          border: searchFocused ? "2px solid #444" : "2px solid #cfcfcf",
          background: searchFocused ? "#fff" : "#f5f5f7",
          boxShadow: searchFocused ? "0 8px 28px rgba(0,0,0,0.11)" : "0 2px 6px rgba(0,0,0,0.04)",
          transition: "border 0.2s, box-shadow 0.2s, background 0.2s",
        }}>
          <SearchIcon sx={{ fontSize: 19, color: searchFocused ? "#1a1a2e" : "#c0c0c0", transition: "color 0.2s", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search courses…"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500, color: "#1a1a2e", minWidth: 0,
            }}
          />
          {searchQuery ? (
            <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
              sx={{ width: 24, height: 24, borderRadius: "7px", background: "#e0e0e0", flexShrink: 0, "&:hover": { background: "#cecece" } }}>
              <CloseIcon sx={{ fontSize: 13, color: "#555" }} />
            </IconButton>
          ) : (
            <Box sx={{ px: 0.9, py: 0.2, borderRadius: "6px", background: "#e8e8e8", flexShrink: 0 }}>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 700, color: "#aaa", letterSpacing: "0.4px" }}>⌘ K</Typography>
            </Box>
          )}
        </Box>

        {showDropdown && (
          <Box sx={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
            background: "#fff", borderRadius: "14px", border: "1.5px solid #e8e8e8",
            boxShadow: "0 16px 48px rgba(0,0,0,0.13)", overflow: "hidden", zIndex: 1300,
          }}>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(({ label, sublabel, route, icon: Icon, iconBg }) => (
                <Box key={route} onMouseDown={(e) => { e.preventDefault(); handleSelect(route); }}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.8, px: 2.2, py: 1.4, cursor: "pointer",
                    transition: "background 0.13s",
                    "&:hover": { background: "#f7f7f9" },
                    "&:not(:last-child)": { borderBottom: "1px solid #f4f4f4" },
                  }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: "10px", background: iconBg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(0,0,0,0.14)" }}>
                    <Icon sx={{ fontSize: 16, color: "#fff" }} />
                  </Box>
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Typography>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "#aaa" }}>{sublabel}</Typography>
                  </Box>
                  <ArrowBackIosNewIcon sx={{ fontSize: 9, color: "#ccc", transform: "rotate(180deg)", flexShrink: 0 }} />
                </Box>
              ))
            ) : (
              <Box sx={{ px: 2.5, py: 2, textAlign: "center" }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#bbb", fontWeight: 500 }}>No courses found for "{searchQuery}"</Typography>
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
  const navigate  = useNavigate();
  const location  = useLocation();
  const muiTheme  = useTheme();
  const isMobile  = useMediaQuery(muiTheme.breakpoints.down("md"));

  // ── FIX: persist admin state in localStorage so deep navigation never loses it ──
  // Only set when actually on admin-dashboard; clear it when on normal dashboard
  if (location.pathname === "/admin-dashboard") {
    localStorage.setItem("isAdmin", "true");
  } else if (location.pathname === "/dashboard") {
    localStorage.removeItem("isAdmin");
  }
  const isAdminRoute = localStorage.getItem("isAdmin") === "true";

  const [activeView,   setActiveView]   = useState(isAdminRoute ? VIEW_ADMIN : VIEW_HOME);
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
        const name = res.data?.fullName || res.data?.name || res.data?.username || localStorage.getItem("username") || "Student";
        setUserName(name);
        localStorage.setItem("username", name);
      } catch {
        setUserName(localStorage.getItem("username") || "Student");
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

  useEffect(() => {
    if (isAdminRoute) {
      window.history.pushState(null, "", window.location.href);
      const blockBack = () => { window.history.pushState(null, "", window.location.href); };
      window.addEventListener("popstate", blockBack);
      return () => window.removeEventListener("popstate", blockBack);
    }
  }, [isAdminRoute]);

  const displayName = userName.includes("@")
    ? userName.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : userName;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const goView  = (view)  => { setActiveView(view); setMobileDrawer(false); };
  const goRoute = useCallback((route) => { navigate(route); setMobileDrawer(false); }, [navigate]);

  const goBackToDashboard = () => {
    // ── FIX: use localStorage flag instead of fragile ref ──
    if (localStorage.getItem("isAdmin") === "true") {
      navigate("/admin-dashboard");
      setActiveView(VIEW_ADMIN);
    } else {
      navigate("/dashboard");
      setActiveView(VIEW_HOME);
    }
  };

  /* ─────────── COMPLETE LOGOUT HANDLER ─────────── */
  const handleLogout = () => {
    localStorage.clear();       // wipe ALL localStorage (token, username, everything)
    sessionStorage.clear();     // wipe session storage too
    setMobileDrawer(false);
    window.location.replace("/"); // hard full-page redirect, clears all React state, no back history
  };

  /* ─────────── ADMIN SIDEBAR (DESKTOP) ─────────── */
  const AdminSidebarContent = () => (
    <Box sx={{
      width: SIDEBAR_W, height: "100%",
      display: "flex", flexDirection: "column",
      background: "#fff",
      borderRight: "1.5px solid #f0f0f5",
      py: 0, overflow: "hidden",
    }}>
      <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: "1px solid #f0f0f5" }}>
        <Typography sx={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800,
          fontSize: 18, color: "#1a1a2e", letterSpacing: "-0.5px",
        }}>EduPortal</Typography>
        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
          color: "#aaa", letterSpacing: "1.4px", textTransform: "uppercase", mt: 0.3,
        }}>Admin Panel</Typography>
      </Box>

      <Box sx={{ px: 3, mt: 2, mb: 1 }}>
        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
          color: "#c0c0cc", letterSpacing: "1.6px", textTransform: "uppercase",
        }}>My Courses</Typography>
      </Box>
      <Box sx={{ px: 1.5, pb: 1 }}>
        {QUICK_COURSES.map(({ label, sublabel, route, icon: Icon, iconBg }) => (
          <Box key={route} onClick={() => goRoute(route)}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: 1.5, py: 1.2, borderRadius: "14px", cursor: "pointer", mb: 0.5,
              transition: "all 0.18s ease",
              "&:hover": { background: "#f7f7fb", transform: "translateX(4px)" },
            }}>
            <Box sx={{
              width: 34, height: 34, borderRadius: "11px", background: iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
            }}>
              <Icon sx={{ fontSize: 16, color: "#fff" }} />
            </Box>
            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "#aaa" }}>{sublabel}</Typography>
            </Box>
            <ArrowBackIosNewIcon sx={{ fontSize: 9, color: "#ccc", transform: "rotate(180deg)", flexShrink: 0 }} />
          </Box>
        ))}
      </Box>

      <Box sx={{ mx: 2, my: 1, height: "1px", background: "#f0f0f5" }} />

      <Box sx={{ px: 3, mb: 1 }}>
        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
          color: "#c0c0cc", letterSpacing: "1.6px", textTransform: "uppercase",
        }}>Management</Typography>
      </Box>
      <Box sx={{ px: 1.5, flex: 1, overflowY: "auto", pb: 2 }}>
        {ADMIN_NAV.map(({ icon: Icon, title, view }) => {
          const isActive = activeView === view;
          return (
            <Box key={view} onClick={() => goView(view)}
              sx={{
                display: "flex", alignItems: "center", gap: 1.5,
                px: 1.5, py: 1.2, borderRadius: "14px", cursor: "pointer", mb: 0.5,
                background: isActive ? "#1a1a2e" : "transparent",
                transition: "all 0.18s ease",
                "&:hover": { background: isActive ? "#1a1a2e" : "#f7f7fb", transform: isActive ? "none" : "translateX(4px)" },
              }}>
              <Box sx={{
                width: 34, height: 34, borderRadius: "11px",
                background: isActive ? "rgba(255,255,255,0.15)" : "#f0f0f5",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon sx={{ fontSize: 16, color: isActive ? "#fff" : "#555" }} />
              </Box>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                fontWeight: 700, color: isActive ? "#fff" : "#1a1a2e",
              }}>{title}</Typography>
              {isActive && (
                <Box sx={{ ml: "auto", width: 6, height: 6, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  /* ─────────── REGULAR SIDEBAR (DESKTOP) ─────────── */
  const SidebarContent = () => (
    <Box sx={{
      width: SIDEBAR_W, height: "100%",
      display: "flex", flexDirection: "column",
      background: "#fff", borderRight: "1.5px solid #f0f0f5",
      py: 0, overflow: "hidden", position: "relative",
    }}>
      <Box sx={{ px: 3, mb: 1.5, pt: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800, color: "#c0c0cc", letterSpacing: "1.6px", textTransform: "uppercase" }}>My Courses</Typography>
        <Box sx={{ flex: 1, height: "1px", background: "#f0f0f5" }} />
      </Box>

      <Box sx={{ px: 1.5, flex: 1, overflowY: "auto", pb: 1 }}>
        {QUICK_COURSES.map(({ label, sublabel, route, icon: Icon, iconBg }) => (
          <Box key={route} onClick={() => goRoute(route)}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: 1.5, py: 1.2, borderRadius: "14px", cursor: "pointer", mb: 0.5,
              transition: "all 0.18s ease",
              "&:hover": { background: "#f7f7fb", transform: "translateX(4px)", "& .course-icon-box": { transform: "scale(1.08)" } },
            }}>
            <Box className="course-icon-box" sx={{
              width: 38, height: 38, borderRadius: "11px", background: iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", transition: "transform 0.18s ease",
            }}>
              <Icon sx={{ fontSize: 19, color: "#fff" }} />
            </Box>
            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#aaa", fontWeight: 400 }}>{sublabel}</Typography>
            </Box>
            <ArrowBackIosNewIcon sx={{ fontSize: 10, color: "#ccc", transform: "rotate(180deg)", flexShrink: 0 }} />
          </Box>
        ))}
      </Box>

      <Box sx={{ mx: 2, my: 1.5, height: "1px", background: "#f0f0f5" }} />

      <Box sx={{ px: 2.5, pb: 12 }}>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800, color: "#c0c0cc", letterSpacing: "1.4px", textTransform: "uppercase", mb: 1.5 }}>Connect With Us</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {SOCIAL.map(({ Icon, color, href, label }) => (
            <Box key={href} component="a" href={href} target="_blank" rel="noopener" aria-label={label}
              sx={{
                width: 36, height: 36, borderRadius: "11px", border: "1.5px solid #f0f0f5", color,
                display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa",
                transition: "all 0.2s ease",
                "&:hover": { background: color, color: "#fff", border: `1.5px solid ${color}`, transform: "translateY(-3px)", boxShadow: `0 6px 16px ${color}40` },
              }}>
              <Icon sx={{ fontSize: 17 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  /* ─────────── HOME VIEW ─────────── */
  const HomeView = () => (
    <Fade in timeout={600}>
      <Box>
        <CourseSearchBar onNavigate={goRoute} displayName={displayName} onOpenDrawer={() => setMobileDrawer(true)} />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 2, sm: 2 } }}>
          {SECTIONS.map(({ icon: Icon, title, desc, view, accent, tag }, i) => (
            <Box key={title}
              className="card-hover mobile-section-card"
              onClick={() => goView(view)}
              style={{ animationDelay: `${i * 0.07}s` }}
              sx={{
                background: "#fff",
                border: { xs: "none", sm: "1px solid #f0f0f0" },
                borderRadius: { xs: "20px", sm: "20px" },
                p: { xs: "24px 20px", sm: 3 },
                minHeight: { xs: 110, sm: "auto" },
                cursor: "pointer",
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                alignItems: { xs: "center", sm: "flex-start" },
                gap: { xs: 2.5, sm: 2 },
                boxShadow: { xs: "0 4px 20px rgba(0,0,0,0.07)", sm: "0 2px 8px rgba(0,0,0,0.04)" },
                position: "relative", overflow: "hidden",
              }}>

              {/* Tag badge */}
              <Box sx={{
                position: "absolute", top: { xs: 16, sm: 18 }, right: { xs: 16, sm: 18 },
                px: 1.2, py: 0.3, borderRadius: "8px",
                background: { xs: `${accent}12`, sm: "#f4f4f6" },
                fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                color: { xs: accent, sm: "#aaa" },
                letterSpacing: "0.8px", textTransform: "uppercase",
              }}>{tag}</Box>

              {/* Icon box */}
              <Box sx={{
                width: { xs: 54, sm: 46 }, height: { xs: 54, sm: 46 },
                minWidth: { xs: 54, sm: 46 },
                borderRadius: { xs: "18px", sm: "14px" },
                background: { xs: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, sm: accent },
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: { xs: `0 8px 22px ${accent}45`, sm: "none" },
                flexShrink: 0,
              }}>
                <Icon sx={{ color: "#fff", fontSize: { xs: 26, sm: 22 } }} />
              </Box>

              {/* Text */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 700,
                  fontSize: { xs: 17, sm: 17 }, color: "#1a1a2e",
                  mb: { xs: 0.5, sm: 0.5 }, letterSpacing: "-0.3px",
                }}>{title}</Typography>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: { xs: 13, sm: 13 }, color: "#aaa", lineHeight: 1.6,
                  display: { xs: "-webkit-box", sm: "block" },
                  WebkitLineClamp: { xs: 2, sm: "unset" },
                  WebkitBoxOrient: "vertical",
                  overflow: { xs: "hidden", sm: "visible" },
                }}>{desc}</Typography>
              </Box>

              {/* Mobile: Arrow indicator */}
              <Box sx={{
                display: { xs: "flex", sm: "none" },
                alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: "12px",
                background: `${accent}12`,
                flexShrink: 0,
              }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 12, color: accent, transform: "rotate(180deg)" }} />
              </Box>

              {/* Desktop: Open arrow text */}
              <Box sx={{
                display: { xs: "none", sm: "inline-flex" },
                alignItems: "center", fontSize: 12,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                color: accent, letterSpacing: "0.3px",
              }}>Open →</Box>
            </Box>
          ))}
        </Box>

        {/* Quick Access Courses — DESKTOP ONLY */}
        <Box sx={{ mt: { xs: 0, sm: 4 }, display: { xs: "none", sm: "block" } }}>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 11, color: "#c0c0c8", letterSpacing: "1.5px",
            textTransform: "uppercase", mb: 2,
          }}>Quick Access — Courses</Typography>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {QUICK_COURSES.map(({ label, route, icon: Icon, iconBg }) => (
              <Box key={label} onClick={() => goRoute(route)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1, pl: 1, pr: 2.5, py: 0.8,
                  borderRadius: "30px", border: "1px solid #e8e8e8", background: "#fff", cursor: "pointer",
                  transition: "all 0.18s ease",
                  "&:hover": { background: "#1a1a2e", color: "#fff", border: "1px solid #1a1a2e" },
                }}>
                <Box sx={{ width: 24, height: 24, borderRadius: "8px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon sx={{ fontSize: 13, color: "#fff" }} />
                </Box>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "inherit" }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* MOBILE ONLY: Social Connect strip — centered at bottom */}
        <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", alignItems: "center", mt: 4, mb: 2, px: 3 }}>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 800,
            color: "#c0c0cc", letterSpacing: "1.4px", textTransform: "uppercase", mb: 1.5,
            textAlign: "center",
          }}>Connect With Us</Typography>
          <Box sx={{ display: "flex", gap: 1.4 }}>
            {SOCIAL.map(({ Icon, color, href, label }) => (
              <Box key={href} component="a" href={href} target="_blank" rel="noopener" aria-label={label}
                sx={{
                  width: 46, height: 46, borderRadius: "14px",
                  border: `1.5px solid ${color}22`,
                  color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${color}0a`,
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  "&:active": { background: color, color: "#fff", transform: "scale(0.95)" },
                }}>
                <Icon sx={{ fontSize: 20 }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  );

  /* ─────────── SUB-VIEW BACK HEADER ─────────── */
  const SubViewHeader = ({ title }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
      <IconButton onClick={() => goView(isAdminRoute ? VIEW_ADMIN : VIEW_HOME)}
        sx={{ background: "#f7f7f9", border: "1px solid #ebebeb", width: 36, height: 36, borderRadius: "10px", "&:hover": { background: "#ebebeb" } }}>
        <ArrowBackIosNewIcon sx={{ fontSize: 14, color: "#1a1a2e" }} />
      </IconButton>
      <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: "#1a1a2e", letterSpacing: "-0.5px" }}>{title}</Typography>
    </Box>
  );

  /* ─────────── MOBILE DRAWER SIDEBAR ─────────── */
  const MobileDrawerContent = () => (
    <Box sx={{
      width: 290, height: "100%",
      display: "flex", flexDirection: "column",
      background: "#fafafa",
      overflow: "hidden",
    }}>
      {/* Hero header */}
      <Box sx={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
        px: 3, py: 3.5,
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
          backgroundSize: "300% 300%",
          animation: "drawerShimmer 4s linear infinite",
        }} />

        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
          <Box>
            <Box sx={{
              width: 52, height: 52, borderRadius: "16px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              mb: 1.5,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              animation: "mobileAvatarPulse 3s ease-in-out infinite",
            }}>
              {displayName ? displayName.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() : "U"}
            </Box>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif", fontWeight: 700,
              fontSize: 17, color: "#fff", lineHeight: 1.2,
            }}>{displayName || "Student"}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#2ecc71", boxShadow: "0 0 6px #2ecc71" }} />
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "rgba(255,255,255,0.5)" }}>
                Online · EduPortal Member
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)",
              mt: 0.4, letterSpacing: "0.3px",
            }}>{timeGreeting} ✦</Typography>
          </Box>

          <IconButton onClick={() => setMobileDrawer(false)}
            sx={{
              background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)",
              width: 30, height: 30, borderRadius: "9px",
              border: "1px solid rgba(255,255,255,0.12)",
              "&:hover": { background: "rgba(255,255,255,0.18)", color: "#fff" },
            }}>
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ height: 2, background: "linear-gradient(90deg, #1a1a2e, #4a4a8e44, #1a1a2e)", opacity: 0.2 }} />

      <Box sx={{ flex: 1, overflowY: "auto", pb: 3, "&::-webkit-scrollbar": { display: "none" } }}>
        <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 800,
            color: "#bbbbc8", letterSpacing: "2px", textTransform: "uppercase",
          }}>My Courses</Typography>
        </Box>
        <Box sx={{ px: 1.5 }}>
          {QUICK_COURSES.map(({ label, sublabel, route, icon: Icon, iconBg }, i) => (
            <Box key={route} onClick={() => goRoute(route)}
              className="drawer-item-in"
              style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              sx={{
                display: "flex", alignItems: "center", gap: 1.5,
                px: 1.5, py: 1.3, borderRadius: "14px", cursor: "pointer", mb: 0.4,
                background: "#fff",
                border: "1.5px solid #f0f0f4",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                "&:active": { transform: "scale(0.97)", background: "#f7f7fb" },
              }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: "11px", background: iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.16)",
              }}>
                <Icon sx={{ fontSize: 17, color: "#fff" }} />
              </Box>
              <Box sx={{ overflow: "hidden", flex: 1 }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "#bbb" }}>{sublabel}</Typography>
              </Box>
              <ArrowBackIosNewIcon sx={{ fontSize: 9, color: "#ddd", transform: "rotate(180deg)", flexShrink: 0 }} />
            </Box>
          ))}
        </Box>

        <Box sx={{ mx: 2, my: 2, height: "1px", background: "#f0f0f4" }} />
        <Box sx={{ px: 3, mb: 1 }}>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 800,
            color: "#bbbbc8", letterSpacing: "2px", textTransform: "uppercase",
          }}>{isAdminRoute ? "Management" : "Account"}</Typography>
        </Box>
        <Box sx={{ px: 1.5 }}>
          {(isAdminRoute ? ADMIN_NAV : SECTIONS.map(s => ({ icon: s.icon, title: s.title, view: s.view }))).map(({ icon: Icon, title, view }, i) => {
            const isActive = activeView === view;
            return (
              <Box key={view} onClick={() => goView(view)}
                className="drawer-item-in"
                style={{ animationDelay: `${0.25 + i * 0.04}s` }}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 1.5, py: 1.3, borderRadius: "14px", cursor: "pointer", mb: 0.4,
                  background: isActive ? "linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)" : "#fff",
                  border: isActive ? "none" : "1.5px solid #f0f0f4",
                  boxShadow: isActive ? "0 6px 20px rgba(26,26,46,0.25)" : "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  "&:active": { transform: "scale(0.97)" },
                }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: "11px",
                  background: isActive ? "rgba(255,255,255,0.15)" : "#f5f5f8",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon sx={{ fontSize: 17, color: isActive ? "#fff" : "#555" }} />
                </Box>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                  fontWeight: 700, color: isActive ? "#fff" : "#1a1a2e", flex: 1,
                }}>{title}</Typography>
                {isActive && <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.7)", flexShrink: 0 }} />}
              </Box>
            );
          })}

          {/* ── LOGOUT BUTTON — mobile drawer only ── */}
          {(
            <Box
              onClick={handleLogout}
              className="drawer-item-in"
              style={{ animationDelay: "0.45s" }}
              sx={{
                display: "flex", alignItems: "center", gap: 1.5,
                px: 1.5, py: 1.3, borderRadius: "14px", cursor: "pointer", mt: 0.8,
                background: "#fff5f5",
                border: "1.5px solid #fde8e8",
                boxShadow: "0 2px 8px rgba(220,50,50,0.06)",
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                "&:active": { transform: "scale(0.97)", background: "#ffe0e0" },
              }}
            >
              <Box sx={{
                width: 36, height: 36, borderRadius: "11px",
                background: "#fff0f0",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <LogoutIcon sx={{ fontSize: 17, color: "#e05050" }} />
              </Box>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                fontWeight: 700, color: "#e05050", flex: 1,
              }}>Logout</Typography>
            </Box>
          )}
        </Box>

        {!isAdminRoute && (
          <>
            <Box sx={{ mx: 2, my: 2, height: "1px", background: "#f0f0f4" }} />
            <Box sx={{ px: 3, mb: 1.2 }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 800,
                color: "#bbbbc8", letterSpacing: "2px", textTransform: "uppercase",
              }}>Connect</Typography>
            </Box>
            <Box sx={{ px: 2, display: "flex", gap: 1 }}>
              {SOCIAL.map(({ Icon, color, href, label }) => (
                <Box key={href} component="a" href={href} target="_blank" rel="noopener" aria-label={label}
                  sx={{
                    flex: 1, height: 40, borderRadius: "12px",
                    border: `1.5px solid ${color}22`,
                    color, display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${color}0a`,
                    "&:active": { background: color, color: "#fff" },
                    transition: "all 0.2s ease",
                  }}>
                  <Icon sx={{ fontSize: 18 }} />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ px: 3, py: 2, borderTop: "1px solid #f0f0f4", background: "#fafafa" }}>
        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: "#ccc",
          textAlign: "center", letterSpacing: "1px", textTransform: "uppercase",
        }}>EduPortal · Learning Platform</Typography>
      </Box>
    </Box>
  );

  /* ─────────── RENDER ─────────── */
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

        @keyframes drawerShimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes mobileAvatarPulse {
          0%, 100% { box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
          50%       { box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 0 0 6px rgba(255,255,255,0.05); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .mobile-section-card {
          animation: fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        .drawer-item-in {
          opacity: 0;
          animation: fadeSlideIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .mobile-course-chip {
          -webkit-tap-highlight-color: transparent;
        }
        .mobile-menu-btn:active {
          transform: scale(0.92) !important;
        }
        .MuiBackdrop-root {
          backdrop-filter: blur(5px) !important;
          -webkit-backdrop-filter: blur(5px) !important;
          background: rgba(10,10,20,0.4) !important;
        }
      `}</style>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Box sx={{ display: "flex", height: "100vh", background: "#fafafa", overflow: "hidden" }}>

          {/* ── SIDEBAR ── */}
          {!isCourseRoute && (
            <>
              {!isMobile ? (
                <Box sx={{ width: SIDEBAR_W, flexShrink: 0, height: "100vh" }}>
                  {isAdminRoute ? <AdminSidebarContent /> : <SidebarContent />}
                </Box>
              ) : (
                <Drawer
                  anchor="right"
                  open={mobileDrawer}
                  onClose={() => setMobileDrawer(false)}
                  PaperProps={{
                    sx: {
                      width: 290, border: "none",
                      borderRadius: "20px 0 0 20px",
                      boxShadow: "-8px 0 60px rgba(0,0,0,0.18)",
                      overflow: "hidden",
                    },
                  }}
                >
                  <MobileDrawerContent />
                </Drawer>
              )}
            </>
          )}

          {/* ── MAIN CONTENT ── */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* ── ADMIN MOBILE TOPBAR — sticky bar above scrollable content, mobile + admin only ── */}
            {isAdminRoute && isMobile && !isCourseRoute && (
              <Box sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                px: 2, py: 1.5,
                background: "#fff",
                borderBottom: "1.5px solid #f0f0f5",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                flexShrink: 0,
                zIndex: 100,
              }}>
                {/* spacer to keep title centered */}
                <Box sx={{ width: 38 }} />

                <Typography sx={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 800,
                  fontSize: 18, color: "#1a1a2e", letterSpacing: "-0.5px",
                }}>Admin Panel</Typography>

                <IconButton
                  onClick={() => setMobileDrawer(true)}
                  sx={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)",
                    color: "#fff",
                    width: 38, height: 38,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(26,26,46,0.3)",
                    "&:active": { transform: "scale(0.92)" },
                  }}
                >
                  <MenuIcon sx={{ fontSize: 19 }} />
                </IconButton>
              </Box>
            )}

            {/* Scrollable content */}
            <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 3 } }}>

              {/* ── BACK BUTTON inside content area when on a course route ── */}
              {isCourseRoute && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    onClick={goBackToDashboard}
                    startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "13px !important" }} />}
                    sx={{
                      color: "#1a1a2e", textTransform: "none",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                      borderRadius: "10px", px: 2, py: 0.8,
                      border: "1px solid #ebebeb", background: "#fff",
                      "&:hover": { background: "#f7f7f9" },
                    }}
                  >
                    Back
                  </Button>
                </Box>
              )}

              <Routes>
                <Route path="/auth"            element={<Authentication />} />
                <Route path="/admin-dashboard" element={<></>} />
                <Route path="/dsac"            element={<Dsaclass />} />
                <Route path="/cou"             element={<Courses />} />
                <Route path="/pre"             element={<PreBatch />} />
                <Route path="/rev"             element={<RevBatch />} />
                <Route path="/col"             element={<ColBatch />} />
              </Routes>

              {/* Admin views */}
              {isAdminRoute && !isCourseRoute && (
                <>
                  
                  {activeView === VIEW_ADMIN && (
                    <Fade in timeout={400}><Box><AdminDashboard /></Box></Fade>
                  )}
                  {activeView === VIEW_FILES && (
                    <Fade in timeout={400}><Box><AdminFileUpload /></Box></Fade>
                  )}
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

              {/* Normal user views */}
              {!isCourseRoute && !isAdminRoute && (
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

        <Snackbar open={showPopup} autoHideDuration={4000} onClose={() => setShowPopup(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert severity="info" onClose={() => setShowPopup(false)} sx={{ fontFamily: "'DM Sans', sans-serif" }}>
            🔔 {popupMessage || "New Notification Received!"}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </>
  );
};

export default Dashboard;

