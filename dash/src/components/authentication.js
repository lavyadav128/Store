import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

const defaultTheme = createTheme({
  typography: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },
});

export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(name, username, password);
        setMessage(result);
        setOpen(true);
        setFormState(0);
        setError('');
        setName('');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAuth();
  };

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
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .auth-card {
            animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) both;
          }
          .field-row { animation: fadeUp 0.4s ease both; }
          .field-row:nth-child(1) { animation-delay: 0.05s; }
          .field-row:nth-child(2) { animation-delay: 0.10s; }
          .field-row:nth-child(3) { animation-delay: 0.15s; }
          .auth-input {
            width: 100%;
            border: none;
            border-bottom: 2px solid #e8e8e8;
            background: transparent;
            padding: 11px 0 9px 0;
            font-size: 14px;
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
            border-radius: 10px;
            padding: 10px 0;
            font-size: 14px;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 600;
          }
          .toggle-active {
            background: #1a1a2e;
            color: #fff;
          }
          .toggle-inactive {
            background: transparent;
            color: #aaa;
          }
          .toggle-inactive:hover { background: #f0f0f5; color: #1a1a2e; }
          .submit-btn {
            width: 100%;
            background: #1a1a2e;
            color: #fff;
            border: none;
            border-radius: 14px;
            padding: 15px 0;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            font-family: 'DM Sans', sans-serif;
            letter-spacing: 0.3px;
            transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
            box-shadow: 0 6px 20px rgba(26,26,46,0.18);
            margin-top: 24px;
          }
          .submit-btn:hover:not(:disabled) {
            background: #2d2d5e;
            transform: translateY(-2px);
            box-shadow: 0 10px 28px rgba(26,26,46,0.25);
          }
          .submit-btn:active:not(:disabled) { transform: translateY(0); }
          .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
          .sidebar-pill {
            display: flex; align-items: center; gap: 8px;
            padding: 7px 14px 7px 7px;
            border-radius: 30px;
            border: 1px solid #ebebeb;
            background: #fff;
            font-family: 'DM Sans', sans-serif;
            font-size: 13px; font-weight: 600;
            color: #1a1a2e; cursor: pointer;
            transition: all 0.18s ease;
          }
          .sidebar-pill:hover { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }
          @media (max-width: 600px) {
            .auth-layout { flex-direction: column !important; max-width: 100% !important; border-radius: 20px !important; }
            .auth-left-panel { width: 100% !important; padding: 28px 28px 24px !important; flex-direction: row !important; align-items: center !important; gap: 16px !important; }
            .auth-right-panel { padding: 28px 24px 32px !important; }
            .left-panel-text { text-align: left !important; }
            .left-avatar { width: 56px !important; height: 56px !important; min-width: 56px; border-radius: 16px !important; }
            .left-avatar svg { font-size: 28px !important; }
            .left-title { font-size: 18px !important; margin-bottom: 4px !important; }
            .left-subtitle { font-size: 12px !important; }
          }
        `}</style>

        {/* PAGE */}
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f7f9',
          padding: '20px 16px',
        }}>

          {/* CARD */}
          <div className="auth-card auth-layout" style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #f0f0f5',
            boxShadow: '0 8px 48px rgba(26,26,46,0.08)',
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            maxWidth: '740px',
            overflow: 'hidden',
          }}>

            {/* ── LEFT PANEL ── */}
            <div className="auth-left-panel" style={{
              background: 'linear-gradient(160deg, #1a1a2e 0%, #0f4c75 60%, #1b262c 100%)',
              width: '260px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '44px 32px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* decorative circles — same visual style as dashboard cards */}
              <div style={{
                position: 'absolute', width: '200px', height: '200px',
                borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
                top: '-60px', right: '-60px',
              }} />
              <div style={{
                position: 'absolute', width: '120px', height: '120px',
                borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
                bottom: '-30px', left: '-30px',
              }} />

              {/* Avatar — matches sidebar icon boxes */}
              <div className="left-avatar" style={{
                width: '88px', height: '88px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                position: 'relative', zIndex: 1,
              }}>
                <SchoolIcon style={{ fontSize: '42px', color: '#ffffff' }} />
              </div>

              <div className="left-panel-text" style={{
                textAlign: 'center', position: 'relative', zIndex: 1,
              }}>
                <div className="left-title" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800, fontSize: '22px',
                  color: '#ffffff', lineHeight: 1.25,
                  marginBottom: '10px', letterSpacing: '-0.3px',
                }}>
                  {formState === 0 ? 'Student Portal' : 'Join Us Today'}
                </div>
                <div className="left-subtitle" style={{
                  fontSize: '13px', color: 'rgba(255,255,255,0.65)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400, lineHeight: 1.6,
                }}>
                  {formState === 0
                    ? 'Welcome back! Sign in to continue your learning journey.'
                    : 'Join thousands of students already learning with us.'}
                </div>
              </div>

              {/* Portal name badge — matches "EduPortal" header style */}
              <div style={{
                position: 'absolute', bottom: 20, zIndex: 1,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#4ecdc4',
                }} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '10px', fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '1.8px', textTransform: 'uppercase',
                }}>EduPortal</span>
              </div>
            </div>

            {/* ── RIGHT FORM PANEL ── */}
            <div className="auth-right-panel" style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '44px 40px',
            }}>
              {/* Heading */}
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800, fontSize: '24px',
                color: '#1a1a2e', marginBottom: '4px', letterSpacing: '-0.4px',
              }}>
                {formState === 0 ? "Student's Login" : "Student's Register"}
              </div>
              <div style={{
                fontSize: '13px', color: '#aaa',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: '28px', fontWeight: 400,
              }}>
                {formState === 0
                  ? 'Please enter your credentials to continue.'
                  : 'Create your account to get started.'}
              </div>

              {/* Toggle — same pill style as dashboard quick access */}
              <div style={{
                display: 'flex',
                background: '#f4f4f8',
                borderRadius: '13px',
                padding: '4px',
                marginBottom: '28px',
                gap: '4px',
              }}>
                <button className={`toggle-btn ${formState === 0 ? 'toggle-active' : 'toggle-inactive'}`}
                  onClick={() => { setFormState(0); setError(''); }}>Sign In</button>
                <button className={`toggle-btn ${formState === 1 ? 'toggle-active' : 'toggle-inactive'}`}
                  onClick={() => { setFormState(1); setError(''); }}>Sign Up</button>
              </div>

              {/* Full Name */}
              {formState === 1 && (
                <div className="field-row" style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginBottom: '4px',
                  }}>
                    <PersonIcon style={{ fontSize: '15px', color: '#1a1a2e' }} />
                    <span style={{
                      fontSize: '11px', fontWeight: 700, color: '#1a1a2e',
                      letterSpacing: '1.4px', textTransform: 'uppercase',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>Full Name</span>
                  </div>
                  <input
                    className="auth-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your full name"
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              )}

              {/* Email */}
              <div className="field-row" style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px',
                }}>
                  <EmailIcon style={{ fontSize: '15px', color: '#1a1a2e' }} />
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: '#1a1a2e',
                    letterSpacing: '1.4px', textTransform: 'uppercase',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Username</span>
                </div>
                <input
                  className="auth-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="field-row" style={{ marginBottom: '6px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px',
                }}>
                  <LockIcon style={{ fontSize: '15px', color: '#1a1a2e' }} />
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: '#1a1a2e',
                    letterSpacing: '1.4px', textTransform: 'uppercase',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Password</span>
                </div>
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your password"
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  background: '#fff5f5',
                  border: '1px solid #ffe0e0',
                  borderLeft: '3px solid #1a1a2e',
                  borderRadius: '0 10px 10px 0',
                  fontSize: '13px',
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

              {/* Switch mode helper */}
              <p style={{
                marginTop: '18px', textAlign: 'center',
                fontSize: '12.5px', color: '#bbb',
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