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
        </Box>

        {/* ══════════════ RIGHT — User chip + Logout ══════════════ */}
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

        {/* ══════════════ MOBILE hamburger ══════════════ */}
        {isMobile && (
          <>
            {/* Avatar pill — mobile left of hamburger */}
            {userName && (
              <Box sx={{
                display: "flex", alignItems: "center", gap: 1,
                px: 1.2, py: 0.6,
                borderRadius: "40px",
                border: "1.5px solid #ececec",
                background: "#fafafa",
                mr: 1,
              }}>
                <Box sx={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "#1a1a2e",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  flexShrink: 0,
                }}>
                  {initials}
                </Box>
                <Box sx={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#2ecc71",
                  flexShrink: 0,
                }} />
              </Box>
            )}

            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                background: "#f5f5f7",
                color: "#1a1a2e",
                width: 38, height: 38,
                border: "1.5px solid #e4e4e4",
                borderRadius: "11px",
                "&:hover": { background: "#1a1a2e", color: "#fff", border: "1.5px solid #1a1a2e" },
                transition: "all 0.2s ease",
              }}
            >
              <MenuIcon sx={{ fontSize: 19 }} />
            </IconButton>

            {/* ── Mobile Drawer ── */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: 270,
                  background: "#fff",
                  border: "none",
                  boxShadow: "-6px 0 40px rgba(0,0,0,0.10)",
                },
              }}
            >
              {/* Drawer header */}
              <Box sx={{
                px: 3, py: 3,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid #f2f2f2",
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {/* Large avatar */}
                  <Box sx={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "#1a1a2e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                  }}>
                    {initials}
                  </Box>
                  <Box>
                    <Typography sx={{
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                      fontSize: 14.5, color: "#1a1a2e", lineHeight: 1.2,
                    }}>
                      {displayName || "Student"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.3 }}>
                      <Box sx={{
                        width: 6, height: 6, borderRadius: "50%", background: "#2ecc71",
                      }} />
                      <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "#bbb",
                      }}>
                        Online · EduPortal Member
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    background: "#f5f5f7", color: "#aaa",
                    width: 30, height: 30, border: "1px solid #ececec",
                    "&:hover": { background: "#ececec" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>

              {/* Divider label */}
              <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
                <Typography sx={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, fontWeight: 800,
                  color: "#c8c8d0", letterSpacing: "1.5px", textTransform: "uppercase",
                }}>
                  Account
                </Typography>
              </Box>

              {/* Nav items */}
              <List sx={{ px: 1.5, pt: 0 }}>
                {menuItems.map(({ to, label, idx, isLogout }) => (
                  <ListItem
                    key={idx}
                    disablePadding
                    component={Link}
                    to={to}
                    onClick={() => handleMenuClick(idx)}
                    sx={{ textDecoration: "none", mb: 0.5, display: "block" }}
                  >
                    {isLogout ? (
                      <Box sx={{ px: 1, pt: 1 }}>
                        <Button
                          fullWidth
                          startIcon={<LogoutIcon sx={{ fontSize: 15 }} />}
                          sx={{
                            background: "#f5f5f7",
                            color: "#444",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 700,
                            fontSize: 13.5,
                            textTransform: "none",
                            borderRadius: "14px",
                            py: 1.3,
                            border: "1.5px solid #e4e4e4",
                            "&:hover": {
                              background: "#1a1a2e", color: "#fff",
                              border: "1.5px solid #1a1a2e",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          Logout
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{
                        px: 2, py: 1.2, borderRadius: "12px",
                        background: selectedMenu === idx ? "#f4f4f6" : "transparent",
                        "&:hover": { background: "#f7f7f9" },
                        transition: "background 0.15s",
                      }}>
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
            </Drawer>
          </>
        )}
      </Box>
    </>
  );
};

export default Menu;