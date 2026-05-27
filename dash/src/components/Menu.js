import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [userName, setUserName]         = useState("");
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [scrolled, setScrolled]         = useState(false);

  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
    setDrawerOpen(false);
  };

  const menuItems = [
    { to: "/", label: "Logout", idx: 6, isLogout: true },
  ];

  /* display name — strip email domain if needed */
  const displayName = userName.includes("@")
    ? userName.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : userName;

  const initials = displayName
    ? displayName.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  /* subtle greeting based on hour */
  const hour = new Date().getHours();
  const timeLabel = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; }

        /* subtle shimmer on logo box */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .logo-box {
          background: #1a1a2e;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .logo-box:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(0,0,0,0.22);
        }

        /* avatar pulse ring on hover */
        .avatar-ring {
          transition: box-shadow 0.2s ease;
        }
        .avatar-ring:hover {
          box-shadow: 0 0 0 3px #1a1a2e, 0 0 0 5px rgba(26,26,46,0.12);
        }

        /* logout button */
        .logout-btn {
          transition: all 0.2s ease !important;
        }
        .logout-btn:hover {
          background: #1a1a2e !important;
          color: #fff !important;
          border-color: #1a1a2e !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.16) !important;
        }

        /* ═══════════════════════════════════════════════
           MOBILE-ONLY ENHANCEMENTS
        ═══════════════════════════════════════════════ */

        /* Hamburger button glow pulse */
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26,26,46,0.15); }
          50%       { box-shadow: 0 0 0 6px rgba(26,26,46,0.06); }
        }
        .mobile-hamburger {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .mobile-hamburger:active {
          transform: scale(0.92) !important;
          animation: none !important;
        }

        /* Drawer slide-in backdrop blur */
        .MuiBackdrop-root {
          backdrop-filter: blur(4px) !important;
          -webkit-backdrop-filter: blur(4px) !important;
          background: rgba(10,10,20,0.35) !important;
        }

        /* Mobile avatar card shimmer */
        @keyframes cardShimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        .mobile-avatar-card {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          position: relative;
          overflow: hidden;
        }
        .mobile-avatar-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
          background-size: 300% 300%;
          animation: cardShimmer 4s linear infinite;
        }

        /* Mobile drawer inner glow ring on avatar */
        @keyframes avatarPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.12), 0 8px 24px rgba(0,0,0,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.4); }
        }
        .mobile-drawer-avatar {
          animation: avatarPulse 3s ease-in-out infinite;
        }

        /* Online dot bounce */
        @keyframes onlineBounce {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.3); }
        }
        .online-dot-bounce {
          animation: onlineBounce 2.5s ease-in-out infinite;
        }

        /* Drawer nav item hover */
        .drawer-nav-item {
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important;
        }
        .drawer-nav-item:active {
          transform: scale(0.97) !important;
        }

        /* Mobile logout button in drawer - ripple feel */
        .mobile-logout-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease !important;
        }
        .mobile-logout-btn:active {
          transform: scale(0.97) !important;
        }
        .mobile-logout-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .mobile-logout-btn:active::after {
          opacity: 1;
        }

        /* Drawer section label */
        .drawer-section-label {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 9px !important;
          font-weight: 800 !important;
          letter-spacing: 2px !important;
          text-transform: uppercase !important;
          color: #bbbbc8 !important;
        }

        /* Staggered fade-in for drawer items */
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .drawer-item-animate {
          opacity: 0;
          animation: fadeSlideIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .drawer-item-animate:nth-child(1) { animation-delay: 0.08s; }
        .drawer-item-animate:nth-child(2) { animation-delay: 0.14s; }
        .drawer-item-animate:nth-child(3) { animation-delay: 0.20s; }
        .drawer-item-animate:nth-child(4) { animation-delay: 0.26s; }

        /* Mobile top navbar avatar pill active press */
        .mobile-avatar-pill:active {
          transform: scale(0.95);
          transition: transform 0.1s ease;
        }
      `}</style>

      <Box
        sx={{
          background: "#fff",
          borderBottom: scrolled ? "1px solid #ececec" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.07)" : "none",
          px: { xs: 2.5, sm: 5 },
          height: { xs: 60, sm: 66 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 200,
          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >

        {/* ══════════════ LEFT — Logo ══════════════ */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Logo mark */}
          <Box
            className="logo-box"
            sx={{
              width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 },
              borderRadius: "11px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              cursor: "default",
            }}
          >
            <img
              src="logo.png"
              alt="Logo"
              style={{ width: "100%", height: "100%", borderRadius: "11px", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML +=
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M12 3L1 9l4 2.18V15l7 4 7-4V11.18L23 9zm0 12.74L7 13v-3.31l5 2.72 5-2.72V13z"/></svg>';
              }}
            />
          </Box>

          {/* Brand name */}
          <Box>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: { xs: 16, sm: 18 },
              color: "#1a1a2e",
              letterSpacing: "-0.5px",
              lineHeight: 1,
              display: { xs: "none", sm: "block" },
            }}>
              EduPortal
            </Typography>
            {/* Tagline under brand — desktop only */}
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 10,
              color: "#c0c0cc",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              display: { xs: "none", sm: "block" },
              mt: 0.2,
            }}>
              Learning Platform
            </Typography>
          </Box>

          {/* Vertical divider — desktop */}
          <Box sx={{
            display: { xs: "none", sm: "block" },
            width: "1px", height: 28,
            background: "#ececec",
            mx: 0.5,
          }} />

          {/* Time-based greeting — desktop */}
          <Typography sx={{
            display: { xs: "none", sm: "block" },
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: 12.5,
            color: "#bbb",
            letterSpacing: "0.2px",
          }}>
            {timeLabel} ✦
          </Typography>

          {/* Brand name — MOBILE only (inside left group) */}
          <Typography sx={{
            display: { xs: "block", sm: "none" },
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: 17,
            color: "#1a1a2e",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}>
            EduPortal
          </Typography>
        </Box>

        {/* ══════════════ RIGHT — User chip + Logout (DESKTOP UNCHANGED) ══════════════ */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

            {/* User info chip */}
            {userName && (
              <Box sx={{
                display: "flex", alignItems: "center", gap: 1.2,
                px: 1.5, py: 0.7,
                borderRadius: "40px",
                border: "1.5px solid #ececec",
                background: "#fafafa",
                transition: "border-color 0.2s, box-shadow 0.2s",
                "&:hover": {
                  borderColor: "#d0d0d0",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                },
              }}>
                {/* Avatar */}
                <Box
                  className="avatar-ring"
                  sx={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#1a1a2e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                    letterSpacing: "0.5px",
                    cursor: "default",
                  }}
                >
                  {initials}
                </Box>

                {/* Name + sub-label */}
                <Box>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1a1a2e",
                    lineHeight: 1.1,
                    whiteSpace: "nowrap",
                  }}>
                    {displayName}
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    color: "#bbb",
                    lineHeight: 1,
                    mt: 0.2,
                  }}>
                    Student
                  </Typography>
                </Box>

                {/* Online dot */}
                <Box sx={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#2ecc71",
                  flexShrink: 0,
                  boxShadow: "0 0 0 2px #fff, 0 0 0 3.5px #d4f5e2",
                }} />
              </Box>
            )}

            {/* Logout button */}
            {menuItems.filter(m => m.isLogout).map(({ to, idx }) => (
              <Button
                key={idx}
                className="logout-btn"
                component={Link}
                to={to}
                onClick={() => handleMenuClick(idx)}
                startIcon={<LogoutIcon sx={{ fontSize: "13px !important" }} />}
                sx={{
                  background: "#f5f5f7",
                  color: "#444",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "none",
                  borderRadius: "40px",
                  px: 2.2,
                  py: 0.85,
                  border: "1.5px solid #e4e4e4",
                  letterSpacing: "0.1px",
                }}
              >
                Logout
              </Button>
            ))}
          </Box>
        )}

        {/* ══════════════ MOBILE — Beautiful redesigned right side ══════════════ */}
        {isMobile && (
          <>
            {/* Avatar pill — refined mobile version */}
            {userName && (
              <Box
                className="mobile-avatar-pill"
                sx={{
                  display: "flex", alignItems: "center", gap: 0.8,
                  px: 1, py: 0.5,
                  borderRadius: "30px",
                  border: "1.5px solid #e8e8f0",
                  background: "linear-gradient(135deg, #fafafa 0%, #f5f5f8 100%)",
                  mr: 1,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                }}
              >
                {/* Avatar circle with gradient */}
                <Box sx={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  flexShrink: 0,
                  boxShadow: "0 3px 8px rgba(26,26,46,0.35)",
                }}>
                  {initials}
                </Box>
                {/* Online dot */}
                <Box
                  className="online-dot-bounce"
                  sx={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#2ecc71",
                    flexShrink: 0,
                    boxShadow: "0 0 0 2px #fff, 0 0 4px #2ecc71",
                  }}
                />
              </Box>
            )}

            {/* Hamburger — polished mobile button */}
            <IconButton
              className="mobile-hamburger"
              onClick={() => setDrawerOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)",
                color: "#fff",
                width: 40, height: 40,
                borderRadius: "13px",
                boxShadow: "0 4px 14px rgba(26,26,46,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2d2d5e 0%, #1a1a2e 100%)",
                  boxShadow: "0 6px 20px rgba(26,26,46,0.45)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* ═══════════════════════════════════════
                MOBILE DRAWER — Luxury redesign
            ═══════════════════════════════════════ */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: 300,
                  background: "#fafafa",
                  border: "none",
                  boxShadow: "-8px 0 60px rgba(0,0,0,0.18)",
                  borderRadius: "20px 0 0 20px",
                  overflow: "hidden",
                },
              }}
            >

              {/* ── Hero card at top ── */}
              <Box
                className="mobile-avatar-card"
                sx={{
                  px: 3, py: 3.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* Large glowing avatar */}
                  <Box
                    className="mobile-drawer-avatar"
                    sx={{
                      width: 52, height: 52, borderRadius: "18px",
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(10px)",
                      border: "1.5px solid rgba(255,255,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, fontWeight: 800, color: "#fff",
                      fontFamily: "'DM Sans', sans-serif",
                      flexShrink: 0,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {initials}
                  </Box>

                  <Box>
                    <Typography sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "#fff",
                      lineHeight: 1.2,
                    }}>
                      {displayName || "Student"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.5 }}>
                      <Box
                        className="online-dot-bounce"
                        sx={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "#2ecc71",
                          boxShadow: "0 0 6px #2ecc71",
                        }}
                      />
                      <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.6)",
                        letterSpacing: "0.3px",
                      }}>
                        Online · EduPortal Member
                      </Typography>
                    </Box>
                    {/* Greeting under name */}
                    <Typography sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10.5,
                      color: "rgba(255,255,255,0.4)",
                      mt: 0.4,
                      letterSpacing: "0.5px",
                    }}>
                      {timeLabel} ✦
                    </Typography>
                  </Box>
                </Box>

                {/* Close button */}
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    width: 32, height: 32,
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    alignSelf: "flex-start",
                    "&:hover": {
                      background: "rgba(255,255,255,0.18)",
                      color: "#fff",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>

              {/* ── Decorative wave divider ── */}
              <Box sx={{
                height: 3,
                background: "linear-gradient(90deg, #1a1a2e 0%, #4a4a8e 50%, #1a1a2e 100%)",
                opacity: 0.15,
              }} />

              {/* ── Section label ── */}
              <Box sx={{ px: 3, pt: 3, pb: 1.5 }}>
                <Typography className="drawer-section-label">
                  Account Settings
                </Typography>
              </Box>

              {/* ── Nav items ── */}
              <List sx={{ px: 2, pt: 0 }}>
                {menuItems.map(({ to, label, idx, isLogout }) => (
                  <ListItem
                    key={idx}
                    disablePadding
                    component={Link}
                    to={to}
                    onClick={() => handleMenuClick(idx)}
                    className="drawer-item-animate"
                    sx={{ textDecoration: "none", mb: 1, display: "block" }}
                  >
                    {isLogout ? (
                      <Button
                        fullWidth
                        className="mobile-logout-btn"
                        startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)",
                          color: "#fff",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          textTransform: "none",
                          borderRadius: "16px",
                          py: 1.6,
                          border: "none",
                          boxShadow: "0 6px 20px rgba(26,26,46,0.3)",
                          letterSpacing: "0.3px",
                          "&:hover": {
                            background: "linear-gradient(135deg, #2d2d5e 0%, #1a1a2e 100%)",
                            boxShadow: "0 8px 28px rgba(26,26,46,0.45)",
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.25s ease",
                        }}
                      >
                        Logout
                      </Button>
                    ) : (
                      <Box
                        className="drawer-nav-item"
                        sx={{
                          px: 2, py: 1.4, borderRadius: "14px",
                          background: selectedMenu === idx
                            ? "linear-gradient(135deg, #1a1a2e10 0%, #2d2d5e0a 100%)"
                            : "#fff",
                          border: selectedMenu === idx ? "1.5px solid #1a1a2e20" : "1.5px solid #f0f0f4",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                          "&:hover": {
                            background: "#f7f7fb",
                            border: "1.5px solid #e0e0ec",
                            transform: "translateX(-2px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Typography sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14.5,
                          fontWeight: selectedMenu === idx ? 700 : 500,
                          color: selectedMenu === idx ? "#1a1a2e" : "#777",
                        }}>
                          {label}
                        </Typography>
                      </Box>
                    )}
                  </ListItem>
                ))}
              </List>

              {/* ── Footer inside drawer ── */}
              <Box sx={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                px: 3, py: 2.5,
                borderTop: "1px solid #f0f0f4",
                background: "#fafafa",
              }}>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  color: "#ccc",
                  textAlign: "center",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}>
                  EduPortal · Learning Platform
                </Typography>
              </Box>

            </Drawer>
          </>
        )}
      </Box>
    </>
  );
};

export default Menu;