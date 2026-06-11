import * as React from "react";
import axios from "axios";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";
import server from "../environment";
import { useGoogleLogin } from "@react-oauth/google";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Snackbar } from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";

const defaultTheme = createTheme({
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
});

const client = axios.create({ baseURL: server });

export default function Authentication() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const interceptor = client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => client.interceptors.request.eject(interceptor);
  }, []);

  const redirectUser = (username) => {
    if (username === "adminbrand@gmail.com") navigate("/admin-dashboard");
    else navigate("/dashboard");
  };

  const validate = () => {
    if (formState === 1 && name.trim().length < 3) {
      setError("Full name must be at least 3 characters.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username.trim())) {
      setError("Please enter a valid email address (e.g. user@example.com).");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be 8+ characters with at least 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*).");
      return false;
    }
    return true;
  };

  const handleRegister = async (name, username, password) => {
    try {
      const res = await client.post("/api/register", { name, username, password });
      if (res.status === httpStatus.CREATED) {
        const { token, username: registeredUsername } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", registeredUsername);
        redirectUser(registeredUsername);
        return res.data.message;
      }
    } catch (err) { throw err; }
  };

  const handleLogin = async (username, password) => {
    try {
      const res = await client.post("/api/login", { username, password });
      if (res.status === httpStatus.OK) {
        const { token, username: loggedInUsername } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", loggedInUsername);
        redirectUser(loggedInUsername);
      }
    } catch (err) { throw err; }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await client.post("/api/auth/google", { access_token: tokenResponse.access_token });
        const { token, username: googleUsername } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", googleUsername);
        redirectUser(googleUsername);
      } catch (err) {
        setError(err?.response?.data?.message || "Google sign-in failed. Please try again.");
      } finally { setLoading(false); }
    },
    onError: () => setError("Google sign-in was cancelled or failed."),
  });

  const handleAuth = async () => {
    setLoading(true);
    if (!validate()) { setLoading(false); return; }
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(name, username, password);
        setMessage(result);
        setOpen(true);
        setFormState(0);
        setError("");
        setName("");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleAuth(); };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap"
        rel="stylesheet"
      />
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />

        <style>{`
          * { box-sizing: border-box; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .auth-card { animation: fadeUp 0.45s cubic-bezier(0.34,1.2,0.64,1) both; }
          .field-row { animation: fadeUp 0.35s ease both; }
          .field-row:nth-child(1) { animation-delay: 0.05s; }
          .field-row:nth-child(2) { animation-delay: 0.10s; }
          .field-row:nth-child(3) { animation-delay: 0.15s; }

          .auth-input {
            width: 100%;
            border: none;
            border-bottom: 2px solid #e8e8e8;
            background: transparent;
            padding: 9px 0 7px 0;
            font-size: 13px;
            color: #1a1a2e;
            outline: none;
            font-family: 'DM Sans', sans-serif;
            font-weight: 500;
            transition: border-color 0.2s;
          }
          .auth-input:focus { border-bottom-color: #1a1a2e; }
          .auth-input::placeholder { color: #c0c0c8; font-weight: 400; }

          .toggle-btn {
            flex: 1;
            border: none;
            border-radius: 8px;
            padding: 8px 0;
            font-size: 13px;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 600;
          }
          .toggle-active  { background: #1a1a2e; color: #fff; }
          .toggle-inactive { background: transparent; color: #aaa; }
          .toggle-inactive:hover { background: #f0f0f5; color: #1a1a2e; }

          .submit-btn {
            width: 100%;
            background: #1a1a2e;
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 13px 0;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            font-family: 'DM Sans', sans-serif;
            letter-spacing: 0.3px;
            transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
            box-shadow: 0 5px 16px rgba(26,26,46,0.18);
            margin-top: 12px;
          }
          .submit-btn:hover:not(:disabled) {
            background: #2d2d5e;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(26,26,46,0.25);
          }
          .submit-btn:active:not(:disabled) { transform: translateY(0); }
          .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

          .google-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            background: #fff;
            border: 1.5px solid #e8e8e8;
            border-radius: 11px;
            padding: 10px 0;
            font-size: 13px;
            font-weight: 600;
            font-family: 'DM Sans', sans-serif;
            color: #1a1a2e;
            cursor: pointer;
            margin-bottom: 10px;
            transition: border-color 0.2s, box-shadow 0.2s, transform 0.12s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          .google-btn:hover:not(:disabled) {
            border-color: #1a1a2e;
            box-shadow: 0 4px 14px rgba(26,26,46,0.1);
            transform: translateY(-1px);
          }
          .google-btn:disabled { opacity: 0.7; cursor: not-allowed; }

          /* ═══════════════════════════════
             DESKTOP layout (≥ 601px)
          ═══════════════════════════════ */
          .auth-layout {
            display: flex;
            flex-direction: row;
            width: 100%;
            max-width: 740px;
          }
          .auth-left-panel {
            width: 260px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 44px 32px;
            position: relative;
            overflow: hidden;
            background: linear-gradient(160deg, #1a1a2e 0%, #0f4c75 60%, #1b262c 100%);
          }
          .auth-right-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 28px 36px;
          }
          .left-avatar {
            width: 88px; height: 88px;
            border-radius: 24px;
            background: rgba(255,255,255,0.12);
            border: 1.5px solid rgba(255,255,255,0.18);
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            position: relative; z-index: 1;
          }

          /* ═══════════════════════════════
             MOBILE layout (≤ 600px)
          ═══════════════════════════════ */
          @media (max-width: 600px) {
            .auth-layout {
              flex-direction: column !important;
              max-width: 100% !important;
              border-radius: 20px !important;
            }

            /* ── Compact banner strip on mobile ── */
            .auth-left-panel {
              width: 100% !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: flex-start !important;
              padding: 14px 18px 14px !important;
              gap: 12px;
            }

            .left-avatar {
              width: 40px !important;
              height: 40px !important;
              min-width: 40px !important;
              border-radius: 12px !important;
              margin-bottom: 0 !important;
            }
            .left-avatar svg { font-size: 22px !important; }

            .left-panel-text {
              text-align: left !important;
              flex: 1;
            }
            .left-title {
              font-size: 15px !important;
              margin-bottom: 2px !important;
              font-family: 'Playfair Display', serif;
              font-weight: 800;
              color: #fff;
              line-height: 1.2;
            }
            .left-subtitle {
              font-size: 10.5px !important;
              line-height: 1.4 !important;
              color: rgba(255,255,255,0.65);
            }

            /* Portal badge: hide on mobile to save space */
            .portal-badge { display: none !important; }

            /* Decorative circles stay, just hidden behind overflow:hidden */

            /* ── Tighter form panel ── */
            .auth-right-panel {
              padding: 16px 18px 20px !important;
            }

            .form-heading {
              font-size: 20px !important;
              margin-bottom: 2px !important;
            }
            .form-subheading {
              font-size: 11.5px !important;
              margin-bottom: 14px !important;
            }

            .toggle-btn { font-size: 12px !important; padding: 7px 0 !important; }
            .toggle-row-wrap { margin-bottom: 14px !important; }

            .google-btn { font-size: 12px !important; padding: 9px 0 !important; }

            .auth-input { font-size: 12px !important; padding: 7px 0 5px !important; }

            .field-label-text { font-size: 9.5px !important; letter-spacing: 1.2px !important; }
            .field-row { margin-bottom: 10px !important; }

            .submit-btn { padding: 12px 0 !important; font-size: 13px !important; border-radius: 11px !important; margin-top: 10px !important; }

            .switch-hint { font-size: 11px !important; margin-top: 14px !important; }

            .error-box { font-size: 12px !important; padding: 8px 12px !important; margin-top: 10px !important; }
          }
        `}</style>

        {/* PAGE */}
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f7f9',
          padding: '20px 14px',
        }}>

          {/* CARD */}
          <div className="auth-card auth-layout" style={{
            background: '#ffffff',
            borderRadius: '22px',
            border: '1.5px solid #f0f0f5',
            boxShadow: '0 8px 40px rgba(26,26,46,0.08)',
            overflow: 'hidden',
          }}>

            {/* ── LEFT / TOP PANEL ── */}
            <div className="auth-left-panel" style={{ position: 'relative' }}>
              {/* decorative circles */}
              <div style={{
                position: 'absolute', width: '180px', height: '180px',
                borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                top: '-50px', right: '-50px',
              }} />
              <div style={{
                position: 'absolute', width: '100px', height: '100px',
                borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
                bottom: '-25px', left: '-25px',
              }} />

              {/* Avatar */}
              <div className="left-avatar" style={{ position: 'relative', zIndex: 1 }}>
                <SchoolIcon style={{ fontSize: '42px', color: '#ffffff' }} />
              </div>

              <div className="left-panel-text" style={{
                textAlign: 'center', position: 'relative', zIndex: 1,
              }}>
                <div className="left-title" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800, fontSize: '22px',
                  color: '#ffffff', lineHeight: 1.25,
                  marginBottom: '8px', letterSpacing: '-0.3px',
                }}>
                  {formState === 0 ? 'Student Portal' : 'Join Us Today'}
                </div>
                <div className="left-subtitle" style={{
                  fontSize: '12.5px', color: 'rgba(255,255,255,0.65)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400, lineHeight: 1.55,
                }}>
                  {formState === 0
                    ? 'Welcome back! Sign in to continue your learning journey.'
                    : 'Join thousands of students already learning with us.'}
                </div>
              </div>

              {/* Portal badge */}
              <div className="portal-badge" style={{
                position: 'absolute', bottom: 18, zIndex: 1,
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%', background: '#4ecdc4',
                }} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '9px', fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '1.8px', textTransform: 'uppercase',
                }}>EduPortal</span>
              </div>
            </div>

            {/* ── RIGHT / BOTTOM FORM PANEL ── */}
            <div className="auth-right-panel">

              {/* Heading */}
              <div className="form-heading" style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800, fontSize: '23px',
                color: '#1a1a2e', marginBottom: '3px', letterSpacing: '-0.4px',
              }}>
                {formState === 0 ? "Student's Login" : "Student's Register"}
              </div>
              <div className="form-subheading" style={{
                fontSize: '12.5px', color: '#aaa',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: '16px', fontWeight: 400,
              }}>
                {formState === 0
                  ? 'Please enter your credentials to continue.'
                  : 'Create your account to get started.'}
              </div>

              {/* Toggle */}
              <div className="toggle-row-wrap" style={{
                display: 'flex',
                background: '#f4f4f8',
                borderRadius: '11px',
                padding: '3px',
                marginBottom: '16px',
                gap: '3px',
              }}>
                <button
                  className={`toggle-btn ${formState === 0 ? 'toggle-active' : 'toggle-inactive'}`}
                  onClick={() => { setFormState(0); setError(''); }}>Sign In</button>
                <button
                  className={`toggle-btn ${formState === 1 ? 'toggle-active' : 'toggle-inactive'}`}
                  onClick={() => { setFormState(1); setError(''); }}>Sign Up</button>
              </div>

              {/* Google */}
              <button className="google-btn" onClick={() => handleGoogleAuth()} disabled={loading}>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  width="16" height="16" alt="Google"
                />
                {formState === 0 ? 'Sign in with Google' : 'Sign up with Google'}
              </button>

              {/* OR divider */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
              }}>
                <div style={{ flex: 1, height: '1px', background: '#f0f0f5' }} />
                <span style={{
                  fontSize: '10px', color: '#ccc',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#f0f0f5' }} />
              </div>

              {/* Full Name */}
              {formState === 1 && (
                <div className="field-row" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                    <PersonIcon style={{ fontSize: '13px', color: '#1a1a2e' }} />
                    <span className="field-label-text" style={{
                      fontSize: '10px', fontWeight: 700, color: '#1a1a2e',
                      letterSpacing: '1.3px', textTransform: 'uppercase',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>Full Name</span>
                  </div>
                  <input
                    className="auth-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your full name (min. 3 characters)"
                  />
                </div>
              )}

              {/* Email */}
              <div className="field-row" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                  <EmailIcon style={{ fontSize: '13px', color: '#1a1a2e' }} />
                  <span className="field-label-text" style={{
                    fontSize: '10px', fontWeight: 700, color: '#1a1a2e',
                    letterSpacing: '1.3px', textTransform: 'uppercase',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Username</span>
                </div>
                <input
                  className="auth-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. user@example.com"
                />
              </div>

              {/* Password */}
              <div className="field-row" style={{ marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                  <LockIcon style={{ fontSize: '13px', color: '#1a1a2e' }} />
                  <span className="field-label-text" style={{
                    fontSize: '10px', fontWeight: 700, color: '#1a1a2e',
                    letterSpacing: '1.3px', textTransform: 'uppercase',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Password</span>
                </div>
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="error-box" style={{
                  marginTop: '10px',
                  padding: '9px 12px',
                  background: '#fff5f5',
                  border: '1px solid #ffe0e0',
                  borderLeft: '3px solid #1a1a2e',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '12px',
                  color: '#1a1a2e',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button className="submit-btn" onClick={handleAuth} disabled={loading}>
                {loading
                  ? (formState === 0 ? 'Signing in…' : 'Registering…')
                  : (formState === 0 ? 'Login' : 'Register')}
              </button>

              {/* Switch mode */}
              <p className="switch-hint" style={{
                marginTop: '16px', textAlign: 'center',
                fontSize: '12px', color: '#bbb',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {formState === 0 ? "Don't have an account? " : 'Already have an account? '}
                <span
                  onClick={() => { setFormState(formState === 0 ? 1 : 0); setError(''); }}
                  style={{
                    color: '#1a1a2e', fontWeight: 700, cursor: 'pointer',
                    textDecoration: 'underline', textUnderlineOffset: '2px',
                  }}
                >
                  {formState === 0 ? 'Sign Up' : 'Sign In'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
          message={message}
        />
      </ThemeProvider>
    </>
  );
}