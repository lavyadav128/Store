// ─────────────────────────────────────────────────────────────
// IMPORTS — bring in all the tools/libraries this file needs
// ─────────────────────────────────────────────────────────────

// React is the main library used to build the UI (buttons, inputs, etc.)
// "* as React" means we get everything React offers in one object
import * as React from "react";

// axios is a library used to send requests to a backend server (like fetching data)
import axios from "axios";

// http-status gives us named codes like httpStatus.OK (200) and httpStatus.CREATED (201)
// instead of remembering raw numbers
import httpStatus from "http-status";

// useNavigate is a hook from React Router — it lets us redirect the user to another page
import { useNavigate } from "react-router-dom";

// "server" is the base URL of our backend API (e.g. "http://localhost:5000")
// imported from a local config file called environment
import server from "../environment";

// useGoogleLogin gives us a ready-made function to trigger Google's login popup
import { useGoogleLogin } from "@react-oauth/google";

// MUI (Material UI) component — resets/normalises default browser CSS styles
import CssBaseline from "@mui/material/CssBaseline";

// createTheme lets us define a custom look (fonts, colors, etc.)
// ThemeProvider wraps the whole app in that custom theme
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Snackbar is a small popup notification at the bottom of the screen
import { Snackbar } from "@mui/material";

// Icons from Material UI — used as small visuals next to input labels
import SchoolIcon from "@mui/icons-material/School";   // graduation cap icon
import EmailIcon from "@mui/icons-material/Email";     // envelope icon
import LockIcon from "@mui/icons-material/Lock";       // padlock icon
import PersonIcon from "@mui/icons-material/Person";   // person/user icon

// ─────────────────────────────────────────────────────────────
// THEME — define the global font for the whole page
// ─────────────────────────────────────────────────────────────

// createTheme creates a MUI theme object
// we override the default font to 'DM Sans' (a clean modern font)
// with 'Segoe UI' and sans-serif as backups in case DM Sans fails to load
const defaultTheme = createTheme({
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
});

// ─────────────────────────────────────────────────────────────
// AXIOS CLIENT — pre-configured HTTP request tool
// ─────────────────────────────────────────────────────────────

// Create a custom axios instance that always sends requests to our "server" base URL
// So instead of typing the full URL every time, we just write "/api/login" etc.
const client = axios.create({ baseURL: server });

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT — the Authentication page
// ─────────────────────────────────────────────────────────────

// "export default" means this is the main thing exported from this file
// "function Authentication()" defines our React component (a reusable UI block)
export default function Authentication() {

  // useNavigate() gives us a "navigate" function
  // we call navigate("/dashboard") to send the user to a different page
  const navigate = useNavigate();

  // ── STATE VARIABLES ──────────────────────────────────────
  // React.useState() creates a variable that, when changed, re-renders the UI
  // [value, setValue] = the current value + the function to update it

  const [username, setUsername] = React.useState("");   // stores what the user types in the email box
  const [password, setPassword] = React.useState("");   // stores the password input
  const [name, setName] = React.useState("");           // stores the full name (only used during sign-up)
  const [error, setError] = React.useState("");         // stores an error message to show on screen
  const [message, setMessage] = React.useState("");     // stores a success message (e.g. "Registered!")
  const [formState, setFormState] = React.useState(0);  // 0 = showing Login form, 1 = showing Register form
  const [open, setOpen] = React.useState(false);        // controls whether the Snackbar popup is visible
  const [loading, setLoading] = React.useState(false);  // true while an API request is in progress (shows spinner text)

  // ── EFFECT: Attach auth token to every request ───────────
  // React.useEffect runs code AFTER the component first appears on screen
  // The empty [] means it only runs once (on mount), not every re-render
  React.useEffect(() => {
    // interceptors.request.use() intercepts every outgoing axios request
    // and lets us modify it before it's sent
    const interceptor = client.interceptors.request.use((config) => {
      // Read the JWT token saved in browser storage (set after login)
      const token = localStorage.getItem("token");
      // If a token exists, attach it to the request headers
      // This tells the backend "I am a logged-in user"
      if (token) config.headers.Authorization = `Bearer ${token}`;
      // Return the modified config so the request can proceed
      return config;
    });
    // Cleanup function: when the component unmounts (removed from screen),
    // remove this interceptor so it doesn't keep running in the background
    return () => client.interceptors.request.eject(interceptor);
  }, []); // [] = run only once when the component first mounts

  // ── HELPER: Redirect after login/register ────────────────
  // Takes the logged-in username and decides which page to go to
  const redirectUser = (username) => {
    // If the user is the admin, send them to the admin dashboard
    if (username === "adminbrand@gmail.com") navigate("/admin-dashboard");
    // Everyone else goes to the regular dashboard
    else navigate("/dashboard");
  };

  // ── VALIDATION: Check form inputs before sending to server ──
  const validate = () => {
    // If we're on the Register form (formState === 1), check that the name is long enough
    if (formState === 1 && name.trim().length < 3) {
      // .trim() removes spaces from both ends of the string
      setError("Full name must be at least 3 characters.");
      return false; // stop here — inputs are invalid
    }

    // Regular expression to check if the email looks valid (contains @ and a dot)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // .test() returns true if the email matches the pattern, false otherwise
    if (!emailRegex.test(username.trim())) {
      setError("Please enter a valid email address (e.g. user@example.com).");
      return false; // stop — email is invalid
    }

    // Regular expression to enforce password rules:
    // (?=.*[A-Z])   = must have at least 1 uppercase letter
    // (?=.*\d)      = must have at least 1 digit
    // (?=.*[!@#$%^&*]) = must have at least 1 special character
    // [A-Za-z\d!@#$%^&*]{8,} = must be at least 8 characters long
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be 8+ characters with at least 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*).");
      return false; // stop — password doesn't meet the rules
    }

    return true; // all checks passed — inputs are valid
  };

  // ── API CALL: Register a new user ────────────────────────
  // async = this function uses "await" to wait for the server response
  const handleRegister = async (name, username, password) => {
    try {
      // Send a POST request to /api/register with name, username, and password in the body
      const res = await client.post("/api/register", { name, username, password });

      // If the server responds with 201 Created (success):
      if (res.status === httpStatus.CREATED) {
        // Destructure the token and username from the server's response data
        const { token, username: registeredUsername } = res.data;
        // Save the token in localStorage so it persists across page refreshes
        localStorage.setItem("token", token);
        // Save the username in localStorage as well
        localStorage.setItem("username", registeredUsername);
        // Send the user to their correct dashboard
        redirectUser(registeredUsername);
        // Return the success message from the server (e.g. "Account created!")
        return res.data.message;
      }
    } catch (err) {
      // If something goes wrong (e.g. server error, duplicate email), re-throw the error
      // so the calling function (handleAuth) can catch and display it
      throw err;
    }
  };

  // ── API CALL: Log in an existing user ────────────────────
  const handleLogin = async (username, password) => {
    try {
      // Send a POST request to /api/login with email and password
      const res = await client.post("/api/login", { username, password });

      // If the server responds with 200 OK (login successful):
      if (res.status === httpStatus.OK) {
        // Pull the token and username out of the response
        const { token, username: loggedInUsername } = res.data;
        // Save token in browser storage for future authenticated requests
        localStorage.setItem("token", token);
        // Save username in browser storage
        localStorage.setItem("username", loggedInUsername);
        // Redirect to the correct page
        redirectUser(loggedInUsername);
      }
    } catch (err) {
      // Re-throw the error so handleAuth can catch and show it
      throw err;
    }
  };

  // ── GOOGLE LOGIN HANDLER ──────────────────────────────────
  // useGoogleLogin returns a function we call to trigger the Google popup
  const handleGoogleAuth = useGoogleLogin({
    // onSuccess runs if the user successfully picks a Google account
    onSuccess: async (tokenResponse) => {
      setLoading(true); // show loading state while we talk to our server
      try {
        // Send the Google access token to our backend so it can verify the user
        const res = await client.post("/api/auth/google", { access_token: tokenResponse.access_token });
        // Extract our own JWT token and username from the backend response
        const { token, username: googleUsername } = res.data;
        // Save them in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("username", googleUsername);
        // Redirect the user
        redirectUser(googleUsername);
      } catch (err) {
        // Show an error if our backend couldn't handle the Google token
        // If the server sent an error message, use that; otherwise use a fallback
        setError(err?.response?.data?.message || "Google sign-in failed. Please try again.");
      } finally {
        setLoading(false); // always stop the loading spinner, success or fail
      }
    },
    // onError runs if the Google popup was closed or failed
    onError: () => setError("Google sign-in was cancelled or failed."),
  });

  // ── MAIN AUTH HANDLER: runs when the Login/Register button is clicked ──
  const handleAuth = async () => {
    setLoading(true); // start loading spinner

    // First validate the inputs; if they fail, stop here
    if (!validate()) {
      setLoading(false); // turn off spinner since we're not making a request
      return;
    }

    try {
      if (formState === 0) {
        // formState 0 = Login form — call the login function
        await handleLogin(username, password);
      } else {
        // formState 1 = Register form — call the register function
        const result = await handleRegister(name, username, password);
        setMessage(result);     // store the success message from the server
        setOpen(true);          // show the Snackbar popup with that message
        setFormState(0);        // switch back to the Login form
        setError("");           // clear any old errors
        // Clear all the input fields
        setName("");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      // If either login or register throws an error, display it on screen
      // Use the server's error message if available, otherwise a generic fallback
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // always stop the loading spinner when done
    }
  };

  // ── KEYBOARD SHORTCUT: Press Enter to submit ─────────────
  // This function is attached to every input field
  const handleKeyDown = (e) => {
    // e.key is the key that was pressed
    // If it's "Enter", trigger the same function as clicking the button
    if (e.key === "Enter") handleAuth();
  };

  // ─────────────────────────────────────────────────────────────
  // JSX RETURN — everything below is the actual UI (HTML-like syntax)
  // ─────────────────────────────────────────────────────────────
  return (
    // React.Fragment shorthand (<> </>) — wraps multiple elements without adding a real DOM node
    <>
      {/* Load two Google Fonts via a <link> tag injected into the page */}
      {/* DM Sans = the body/UI font | Playfair Display = the decorative heading font */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* ThemeProvider wraps everything so MUI components use our custom font */}
      <ThemeProvider theme={defaultTheme}>

        {/* CssBaseline resets browser default styles (margins, paddings, etc.) */}
        <CssBaseline />

        {/* <style> block — raw CSS written directly in JSX using a template string */}
        <style>{`
          /* Make all elements use border-box sizing — padding is included in width/height */
          * { box-sizing: border-box; }

          /* Keyframe animation: elements fade in while sliding up slightly */
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }  /* start: invisible, shifted down 16px */
            to   { opacity: 1; transform: translateY(0); }     /* end: fully visible, normal position */
          }

          /* The card itself fades up when the page loads */
          .auth-card { animation: fadeUp 0.45s cubic-bezier(0.34,1.2,0.64,1) both; }

          /* Each input field row fades up one after another */
          .field-row { animation: fadeUp 0.35s ease both; }
          /* animation-delay staggers each row so they appear one by one */
          .field-row:nth-child(1) { animation-delay: 0.05s; }
          .field-row:nth-child(2) { animation-delay: 0.10s; }
          .field-row:nth-child(3) { animation-delay: 0.15s; }

          /* Styling for all text input fields */
          .auth-input {
            width: 100%;                        /* stretch to full width of container */
            border: none;                       /* remove all borders */
            border-bottom: 2px solid #e8e8e8;  /* add only a bottom underline border */
            background: transparent;            /* no background color */
            padding: 9px 0 7px 0;              /* spacing above and below the text */
            font-size: 13px;
            color: #1a1a2e;                    /* dark navy text */
            outline: none;                      /* remove the blue focus ring browsers add */
            font-family: 'DM Sans', sans-serif;
            font-weight: 500;
            transition: border-color 0.2s;      /* smoothly animate the border color on focus */
          }
          /* When the input is focused (clicked into), the bottom border turns dark */
          .auth-input:focus { border-bottom-color: #1a1a2e; }
          /* Style the placeholder text (the grey hint text inside inputs) */
          .auth-input::placeholder { color: #c0c0c8; font-weight: 400; }

          /* Shared styles for the Sign In / Sign Up toggle buttons */
          .toggle-btn {
            flex: 1;                        /* each button takes equal space */
            border: none;
            border-radius: 8px;
            padding: 8px 0;
            font-size: 13px;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;                /* show hand cursor on hover */
            transition: all 0.2s ease;     /* smooth color/style changes */
            font-weight: 600;
          }
          /* The ACTIVE (currently selected) toggle — dark background, white text */
          .toggle-active  { background: #1a1a2e; color: #fff; }
          /* The INACTIVE toggle — transparent background, grey text */
          .toggle-inactive { background: transparent; color: #aaa; }
          /* Hover effect for the inactive toggle */
          .toggle-inactive:hover { background: #f0f0f5; color: #1a1a2e; }

          /* The main submit button (Login / Register) */
          .submit-btn {
            width: 100%;
            background: #1a1a2e;           /* dark navy background */
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
            box-shadow: 0 5px 16px rgba(26,26,46,0.18);  /* subtle drop shadow */
            margin-top: 12px;
          }
          /* Hover: darken background, lift button up, deepen shadow */
          .submit-btn:hover:not(:disabled) {
            background: #2d2d5e;
            transform: translateY(-2px);   /* moves button up by 2px to feel "raised" */
            box-shadow: 0 8px 24px rgba(26,26,46,0.25);
          }
          /* Click: push button back down to baseline */
          .submit-btn:active:not(:disabled) { transform: translateY(0); }
          /* Disabled state: slightly transparent, no pointer */
          .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

          /* The "Sign in with Google" button */
          .google-btn {
            width: 100%;
            display: flex;
            align-items: center;           /* vertically center the Google icon and text */
            justify-content: center;
            gap: 9px;                      /* space between icon and text */
            background: #fff;
            border: 1.5px solid #e8e8e8;  /* light grey border */
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
          /* Hover: darken border, deepen shadow, slight lift */
          .google-btn:hover:not(:disabled) {
            border-color: #1a1a2e;
            box-shadow: 0 4px 14px rgba(26,26,46,0.1);
            transform: translateY(-1px);
          }
          /* Disabled: fade out, no pointer */
          .google-btn:disabled { opacity: 0.7; cursor: not-allowed; }

          /* ═══════════════════════════════
             DESKTOP layout (screens wider than 600px)
          ═══════════════════════════════ */
          .auth-layout {
            display: flex;
            flex-direction: row;           /* left panel and right panel side by side */
            width: 100%;
            max-width: 740px;             /* card never gets wider than 740px */
          }

          /* Left dark panel — shows the logo, title, and tagline */
          .auth-left-panel {
            width: 260px;
            flex-shrink: 0;              /* prevent this panel from shrinking */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 44px 32px;
            position: relative;          /* needed for positioning the decorative circles */
            overflow: hidden;            /* clip the circles so they don't spill out */
            background: linear-gradient(160deg, #1a1a2e 0%, #0f4c75 60%, #1b262c 100%);
            /* a gradient from dark navy → ocean blue → near-black */
          }

          /* Right white panel — holds the form */
          .auth-right-panel {
            flex: 1;                     /* take up all remaining space */
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 28px 36px;
          }

          /* The icon box (rounded square containing the school icon) */
          .left-avatar {
            width: 88px; height: 88px;
            border-radius: 24px;
            background: rgba(255,255,255,0.12);   /* semi-transparent white */
            border: 1.5px solid rgba(255,255,255,0.18);
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            position: relative; z-index: 1;       /* sit above the decorative circles */
          }

          /* ═══════════════════════════════
             MOBILE layout (screens 600px or narrower)
          ═══════════════════════════════ */
          @media (max-width: 600px) {

            /* Stack panels vertically on small screens */
            .auth-layout {
              flex-direction: column !important;
              max-width: 90% !important;   /* card takes 90% of the phone screen width */
              border-radius: 20px !important;
            }

            /* Turn the left panel into a compact horizontal strip at the top */
            .auth-left-panel {
              width: 100% !important;
              flex-direction: row !important;      /* icon + text side by side */
              align-items: center !important;
              justify-content: flex-start !important;
              padding: 14px 18px 14px !important;
              gap: 12px;
            }

            /* Make the icon box much smaller on mobile */
            .left-avatar {
              width: 40px !important;
              height: 40px !important;
              min-width: 40px !important;
              border-radius: 12px !important;
              margin-bottom: 0 !important;
            }
            /* Make the icon inside it smaller too */
            .left-avatar svg { font-size: 22px !important; }

            /* Text next to the icon on mobile — left-aligned */
            .left-panel-text {
              text-align: left !important;
              flex: 1;
            }
            /* Title font size reduced on mobile */
            .left-title {
              font-size: 15px !important;
              margin-bottom: 2px !important;
              font-family: 'Playfair Display', serif;
              font-weight: 800;
              color: #fff;
              line-height: 1.2;
            }
            /* Subtitle font size reduced on mobile */
            .left-subtitle {
              font-size: 10.5px !important;
              line-height: 1.4 !important;
              color: rgba(255,255,255,0.65);
            }

            /* Hide the "EduPortal" badge on mobile — not enough space */
            .portal-badge { display: none !important; }

            /* Reduce padding in the form panel on mobile */
            .auth-right-panel {
              padding: 16px 18px 20px !important;
            }

            /* Smaller main heading on mobile */
            .form-heading {
              font-size: 20px !important;
              margin-bottom: 2px !important;
            }
            /* Smaller sub-heading on mobile */
            .form-subheading {
              font-size: 11.5px !important;
              margin-bottom: 14px !important;
            }

            /* Slightly smaller toggle buttons and padding on mobile */
            .toggle-btn { font-size: 12px !important; padding: 7px 0 !important; }
            .toggle-row-wrap { margin-bottom: 14px !important; }

            /* Slightly smaller Google button on mobile */
            .google-btn { font-size: 12px !important; padding: 9px 0 !important; }

            /* Smaller input text on mobile */
            .auth-input { font-size: 12px !important; padding: 7px 0 5px !important; }

            /* Smaller input labels on mobile */
            .field-label-text { font-size: 9.5px !important; letter-spacing: 1.2px !important; }
            /* Less space between input rows on mobile */
            .field-row { margin-bottom: 10px !important; }

            /* Smaller submit button on mobile */
            .submit-btn { padding: 12px 0 !important; font-size: 13px !important; border-radius: 11px !important; margin-top: 10px !important; }

            /* Smaller "switch mode" hint text on mobile */
            .switch-hint { font-size: 11px !important; margin-top: 14px !important; }

            /* Smaller error box on mobile */
            .error-box { font-size: 12px !important; padding: 8px 12px !important; margin-top: 10px !important; }
          }
        `}</style>

        {/* ─────────────────────────────────────────────────────
            PAGE WRAPPER — centres the card on the screen
        ───────────────────────────────────────────────────── */}
        <div style={{
          minHeight: '100vh',          /* take at least the full screen height */
          display: 'flex',
          alignItems: 'center',        /* vertically centre the card */
          justifyContent: 'center',    /* horizontally centre the card */
          background: '#f7f7f9',       /* very light grey page background */
          padding: '20px 14px',        /* breathing room on small screens */
        }}>

          {/* ─────────────────────────────────────────────────
              THE CARD — white rounded container holding both panels
          ───────────────────────────────────────────────────── */}
          {/* "auth-card" triggers the fadeUp animation | "auth-layout" controls the flex layout */}
          <div className="auth-card auth-layout" style={{
            background: '#ffffff',
            borderRadius: '22px',
            border: '1.5px solid #f0f0f5',       /* very subtle border */
            boxShadow: '0 8px 40px rgba(26,26,46,0.08)',  /* soft drop shadow */
            overflow: 'hidden',                    /* clips the decorative circles inside */
          }}>

            {/* ─────────────────────────────────────────────
                LEFT PANEL — dark branding area
            ───────────────────────────────────────────────── */}
            {/* "position: relative" lets us position the decorative circles inside */}
            <div className="auth-left-panel" style={{ position: 'relative' }}>

              {/* Decorative circle — large, top-right corner, very faint */}
              <div style={{
                position: 'absolute', width: '180px', height: '180px',
                borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                top: '-50px', right: '-50px',  /* partially hidden outside the panel */
              }} />

              {/* Decorative circle — smaller, bottom-left, even fainter */}
              <div style={{
                position: 'absolute', width: '100px', height: '100px',
                borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
                bottom: '-25px', left: '-25px',
              }} />

              {/* Icon box — school graduation cap icon inside a rounded square */}
              {/* zIndex: 1 keeps it above the decorative circles */}
              <div className="left-avatar" style={{ position: 'relative', zIndex: 1 }}>
                {/* SchoolIcon from MUI — a graduation cap icon, white, 42px */}
                <SchoolIcon style={{ fontSize: '42px', color: '#ffffff' }} />
              </div>

              {/* Text block — title and subtitle below (or beside on mobile) the icon */}
              <div className="left-panel-text" style={{
                textAlign: 'center', position: 'relative', zIndex: 1,
              }}>
                {/* Main title — changes based on whether user is on login or register */}
                <div className="left-title" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800, fontSize: '22px',
                  color: '#ffffff', lineHeight: 1.25,
                  marginBottom: '8px', letterSpacing: '-0.3px',
                }}>
                  {/* Ternary: if formState is 0 show "Student Portal", else show "Join Us Today" */}
                  {formState === 0 ? 'Student Portal' : 'Join Us Today'}
                </div>

                {/* Subtitle — also changes between login and register */}
                <div className="left-subtitle" style={{
                  fontSize: '12.5px', color: 'rgba(255,255,255,0.65)',  /* 65% white = slightly transparent */
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400, lineHeight: 1.55,
                }}>
                  {formState === 0
                    ? 'Welcome back! Sign in to continue your learning journey.'
                    : 'Join thousands of students already learning with us.'}
                </div>
              </div>

              {/* EduPortal badge — a tiny label at the bottom of the left panel */}
              {/* Hidden on mobile via CSS */}
              <div className="portal-badge" style={{
                position: 'absolute', bottom: 18, zIndex: 1,
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                {/* Small teal dot — a visual accent */}
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%', background: '#4ecdc4',
                }} />
                {/* "EDUPORAL" text in uppercase tiny letters */}
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '9px', fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '1.8px', textTransform: 'uppercase',
                }}>EduPortal</span>
              </div>
            </div>

            {/* ─────────────────────────────────────────────
                RIGHT PANEL — the form itself
            ───────────────────────────────────────────────── */}
            <div className="auth-right-panel">

              {/* Form heading — "Student's Login" or "Student's Register" */}
              <div className="form-heading" style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800, fontSize: '23px',
                color: '#1a1a2e', marginBottom: '3px', letterSpacing: '-0.4px',
              }}>
                {formState === 0 ? "Student's Login" : "Student's Register"}
              </div>

              {/* Sub-heading — a short instruction line below the main heading */}
              <div className="form-subheading" style={{
                fontSize: '12.5px', color: '#aaa',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: '16px', fontWeight: 400,
              }}>
                {formState === 0
                  ? 'Please enter your credentials to continue.'
                  : 'Create your account to get started.'}
              </div>

              {/* ── TOGGLE (Sign In / Sign Up) ── */}
              {/* A pill-shaped container holding two toggle buttons */}
              <div className="toggle-row-wrap" style={{
                display: 'flex',
                background: '#f4f4f8',   /* light grey pill background */
                borderRadius: '11px',
                padding: '3px',          /* small padding around the buttons */
                marginBottom: '16px',
                gap: '3px',              /* tiny space between the two buttons */
              }}>
                {/* Sign In button — gets "toggle-active" class when formState is 0 */}
                <button
                  className={`toggle-btn ${formState === 0 ? 'toggle-active' : 'toggle-inactive'}`}
                  onClick={() => { setFormState(0); setError(''); }}>  {/* switch to login, clear errors */}
                  Sign In
                </button>

                {/* Sign Up button — gets "toggle-active" class when formState is 1 */}
                <button
                  className={`toggle-btn ${formState === 1 ? 'toggle-active' : 'toggle-inactive'}`}
                  onClick={() => { setFormState(1); setError(''); }}>  {/* switch to register, clear errors */}
                  Sign Up
                </button>
              </div>

              {/* ── GOOGLE BUTTON ── */}
              {/* Calls handleGoogleAuth() which opens the Google login popup */}
              {/* "disabled={loading}" greys it out while a request is in progress */}
              <button className="google-btn" onClick={() => handleGoogleAuth()} disabled={loading}>
                {/* Google's official coloured "G" logo */}
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  width="16" height="16" alt="Google"
                />
                {/* Label changes based on whether we're on login or register */}
                {formState === 0 ? 'Sign in with Google' : 'Sign up with Google'}
              </button>

              {/* ── OR DIVIDER ── */}
              {/* A horizontal line with "OR" in the middle, separating Google from manual login */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
              }}>
                <div style={{ flex: 1, height: '1px', background: '#f0f0f5' }} />  {/* left line */}
                <span style={{
                  fontSize: '10px', color: '#ccc',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#f0f0f5' }} />  {/* right line */}
              </div>

              {/* ── FULL NAME FIELD (only shown when registering) ── */}
              {/* The {formState === 1 && (...)} pattern means: only render if formState is 1 */}
              {formState === 1 && (
                <div className="field-row" style={{ marginBottom: '10px' }}>
                  {/* Label row: icon + text label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                    <PersonIcon style={{ fontSize: '13px', color: '#1a1a2e' }} />
                    <span className="field-label-text" style={{
                      fontSize: '10px', fontWeight: 700, color: '#1a1a2e',
                      letterSpacing: '1.3px', textTransform: 'uppercase',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>Full Name</span>
                  </div>
                  {/* Text input — updates "name" state on every keystroke */}
                  <input
                    className="auth-input"
                    type="text"
                    value={name}                              /* controlled input — value always matches state */
                    onChange={(e) => setName(e.target.value)} /* update state when user types */
                    onKeyDown={handleKeyDown}                 /* submit form on Enter */
                    placeholder="Your full name (min. 3 characters)"
                  />
                </div>
              )}

              {/* ── EMAIL / USERNAME FIELD ── */}
              <div className="field-row" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                  <EmailIcon style={{ fontSize: '13px', color: '#1a1a2e' }} />
                  <span className="field-label-text" style={{
                    fontSize: '10px', fontWeight: 700, color: '#1a1a2e',
                    letterSpacing: '1.3px', textTransform: 'uppercase',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Username</span>
                </div>
                {/* Text input for email address */}
                <input
                  className="auth-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. user@example.com"
                />
              </div>

              {/* ── PASSWORD FIELD ── */}
              <div className="field-row" style={{ marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                  <LockIcon style={{ fontSize: '13px', color: '#1a1a2e' }} />
                  <span className="field-label-text" style={{
                    fontSize: '10px', fontWeight: 700, color: '#1a1a2e',
                    letterSpacing: '1.3px', textTransform: 'uppercase',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Password</span>
                </div>
                {/* type="password" hides the characters as dots */}
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                />
              </div>

              {/* ── ERROR BOX ── */}
              {/* Only renders if there is an error message (truthy value in "error" state) */}
              {error && (
                <div className="error-box" style={{
                  marginTop: '10px',
                  padding: '9px 12px',
                  background: '#fff5f5',          /* very light red background */
                  border: '1px solid #ffe0e0',    /* light red border */
                  borderLeft: '3px solid #1a1a2e', /* thick dark left accent line */
                  borderRadius: '0 8px 8px 0',    /* rounded on right side only */
                  fontSize: '12px',
                  color: '#1a1a2e',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}>
                  {error}  {/* display the error message text */}
                </div>
              )}

              {/* ── SUBMIT BUTTON ── */}
              {/* disabled={loading} prevents double-clicking while request is pending */}
              <button className="submit-btn" onClick={handleAuth} disabled={loading}>
                {/* Show different text depending on whether we're loading or which form is shown */}
                {loading
                  ? (formState === 0 ? 'Signing in…' : 'Registering…')   /* loading states */
                  : (formState === 0 ? 'Login' : 'Register')}            
              </button>

              {/* ── SWITCH MODE HINT ── */}
              {/* "Don't have an account? Sign Up" / "Already have an account? Sign In" */}
              <p className="switch-hint" style={{
                marginTop: '16px', textAlign: 'center',
                fontSize: '12px', color: '#bbb',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {/* Hint text changes based on current form */}
                {formState === 0 ? "Don't have an account? " : 'Already have an account? '}

                {/* Clickable text — switches between login and register modes */}
                <span
                  onClick={() => { setFormState(formState === 0 ? 1 : 0); setError(''); }}
                  style={{
                    color: '#1a1a2e', fontWeight: 700, cursor: 'pointer',
                    textDecoration: 'underline', textUnderlineOffset: '2px',
                  }}
                >
                  {/* Label also flips based on the current form */}
                  {formState === 0 ? 'Sign Up' : 'Sign In'}
                </span>
              </p>
            </div>  {/* end auth-right-panel */}
          </div>  {/* end auth-card */}
        </div>  {/* end page wrapper */}

        {/* ── SNACKBAR (pop-up notification) ── */}
        {/* Shows a brief message at the bottom of the screen after successful registration */}
        <Snackbar
          open={open}                          /* controlled by "open" state */
          autoHideDuration={4000}             /* automatically disappears after 4 seconds */
          onClose={() => setOpen(false)}      /* also close it if user dismisses manually */
          message={message}                   /* the success message from the server */
        />
      </ThemeProvider>
    </>
  );
}