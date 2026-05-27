import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';

const defaultTheme = createTheme({
  typography: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  palette: {
    primary: {
      main: '#5b5ea6',
    },
    secondary: {
      main: '#4ecdc4',
    },
  },
});

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f4f7fb',
    padding: '24px',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  outerCard: {
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(91, 94, 166, 0.12)',
    display: 'flex',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '780px',
    minHeight: '520px',
  },
  leftPanel: {
    background: 'linear-gradient(160deg, #5b5ea6 0%, #9b59b6 50%, #4ecdc4 100%)',
    width: '280px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    position: 'relative',
    overflow: 'hidden',
  },
  leftPanelCircle1: {
    position: 'absolute',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    top: '-40px',
    right: '-40px',
  },
  leftPanelCircle2: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    bottom: '-20px',
    left: '-30px',
  },
  studentAvatar: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    border: '3px solid rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    zIndex: 1,
  },
  studentIcon: {
    fontSize: '64px',
    color: '#ffffff',
  },
  leftTitle: {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '22px',
    textAlign: 'center',
    lineHeight: 1.3,
    zIndex: 1,
    marginBottom: '8px',
  },
  leftSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
    textAlign: 'center',
    zIndex: 1,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px 44px',
  },
  formTitle: {
    color: '#5b5ea6',
    fontWeight: 700,
    fontSize: '26px',
    marginBottom: '6px',
    fontFamily: "'Poppins', sans-serif",
  },
  formSubtitle: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '28px',
    fontFamily: "'Poppins', sans-serif",
  },
  toggleBar: {
    display: 'flex',
    background: '#f0f0f7',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '28px',
    gap: '4px',
  },
  toggleBtnActive: {
    flex: 1,
    background: '#5b5ea6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 0',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s ease',
  },
  toggleBtnInactive: {
    flex: 1,
    background: 'transparent',
    color: '#888',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 0',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s ease',
  },
  fieldWrapper: {
    position: 'relative',
    marginBottom: '16px',
  },
  fieldLabel: {
    color: '#5b5ea6',
    fontWeight: 600,
    fontSize: '13px',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "'Poppins', sans-serif",
  },
  fieldIcon: {
    fontSize: '17px',
    color: '#5b5ea6',
  },
  fieldInput: {
    width: '100%',
    border: 'none',
    borderBottom: '2px solid #d0d0e8',
    background: 'transparent',
    padding: '10px 0 8px 0',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  loginBtn: {
    width: '100%',
    background: '#4ecdc4',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    padding: '13px 0',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '22px',
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '0.5px',
    transition: 'background 0.2s, transform 0.1s',
    boxShadow: '0 4px 18px rgba(78, 205, 196, 0.35)',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '4px',
    fontFamily: "'Poppins', sans-serif",
  },
};

export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [hoveredBtn, setHoveredBtn] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
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
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAuth();
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <div style={styles.page}>
          <div style={styles.outerCard}>
            {/* Left decorative panel */}
            <div style={styles.leftPanel}>
              <div style={styles.leftPanelCircle1} />
              <div style={styles.leftPanelCircle2} />
              <div style={styles.studentAvatar}>
                <SchoolIcon style={styles.studentIcon} />
              </div>
              <div style={styles.leftTitle}>Student Portal</div>
              <div style={styles.leftSubtitle}>
                {formState === 0
                  ? 'Welcome back! Sign in to continue your learning journey.'
                  : 'Join thousands of students already learning with us.'}
              </div>
            </div>

            {/* Right form panel */}
            <div style={styles.rightPanel}>
              <div style={styles.formTitle}>
                {formState === 0 ? "Student's Login Form" : "Student's Register Form"}
              </div>
              <div style={styles.formSubtitle}>
                {formState === 0
                  ? 'Please enter your credentials to continue.'
                  : 'Create your account to get started.'}
              </div>

              {/* Toggle */}
              <div style={styles.toggleBar}>
                <button
                  style={formState === 0 ? styles.toggleBtnActive : styles.toggleBtnInactive}
                  onClick={() => { setFormState(0); setError(''); }}
                >
                  Sign In
                </button>
                <button
                  style={formState === 1 ? styles.toggleBtnActive : styles.toggleBtnInactive}
                  onClick={() => { setFormState(1); setError(''); }}
                >
                  Sign Up
                </button>
              </div>

              {/* Full Name (Sign Up only) */}
              {formState === 1 && (
                <div style={styles.fieldWrapper}>
                  <div style={styles.fieldLabel}>
                    <PersonIcon style={styles.fieldIcon} />
                    Full Name:
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your full name"
                    style={styles.fieldInput}
                    onFocus={(e) => (e.target.style.borderBottomColor = '#5b5ea6')}
                    onBlur={(e) => (e.target.style.borderBottomColor = '#d0d0e8')}
                  />
                </div>
              )}

              {/* Email / Username */}
              <div style={styles.fieldWrapper}>
                <div style={styles.fieldLabel}>
                  <EmailIcon style={styles.fieldIcon} />
                  Email Id:
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your email"
                  style={styles.fieldInput}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#5b5ea6')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#d0d0e8')}
                />
              </div>

              {/* Password */}
              <div style={styles.fieldWrapper}>
                <div style={styles.fieldLabel}>
                  <LockIcon style={styles.fieldIcon} />
                  Password:
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your password"
                  style={styles.fieldInput}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#5b5ea6')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#d0d0e8')}
                />
              </div>

              {/* Error */}
              {error && <div style={styles.errorText}>{error}</div>}

              {/* Submit Button */}
              <button
                style={{
                  ...styles.loginBtn,
                  ...(hoveredBtn
                    ? { background: '#38b2aa', transform: 'translateY(-1px)' }
                    : {}),
                }}
                onClick={handleAuth}
                onMouseEnter={() => setHoveredBtn(true)}
                onMouseLeave={() => setHoveredBtn(false)}
              >
                {formState === 0 ? 'Login' : 'Register'}
              </button>
            </div>
          </div>
        </div>

        {/* Success Snackbar */}
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