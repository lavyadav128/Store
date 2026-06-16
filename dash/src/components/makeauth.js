// ─────────────────────────────────────────────────────────────
// makeAuthenticatedRequest — a reusable helper function
// that sends HTTP requests to the backend WITH the JWT token
// automatically attached, plus timeout protection
// ─────────────────────────────────────────────────────────────

// "export const" means this function is exported so other files can import it
// e.g. import { makeAuthenticatedRequest } from '../makeauth';

// The function takes 4 parameters:
// url     = the full backend URL to call (e.g. "https://api.com/api/login")
// method  = HTTP method — default is 'GET' if not provided
// body    = the data to send in the request body — default is null (no body for GET)
// timeout = how many milliseconds to wait before giving up — default is 10000 (10 seconds)
export const makeAuthenticatedRequest = async (url, method = 'GET', body = null, timeout = 10000) => {

  // ── STEP 1: GET THE TOKEN ──
  // Read the JWT token that was saved in localStorage after the user logged in
  // If the user is not logged in, localStorage.getItem('token') returns null
  const token = localStorage.getItem('token');

  // If no token was found (user not logged in), stop immediately
  // "throw new Error()" creates an error and sends it to whoever called this function
  // The calling code will catch it and show an appropriate message
  if (!token) {
    throw new Error('No authentication token found');
  }

  // ── STEP 2: BUILD THE REQUEST HEADERS ──
  // Headers are extra information attached to every HTTP request
  // Think of them as the envelope labels before the letter (body) inside
  const headers = {
    // Tell the server: "the data I'm sending is in JSON format"
    // Without this, the server won't know how to read the body
    'Content-Type': 'application/json',

    // Attach the JWT token so the backend knows WHO is making this request
    // "Bearer" is the standard HTTP word that means "the person carrying this token"
    // The backend reads this and calls jwt.verify() to confirm the user's identity
    'Authorization': `Bearer ${token}`,
  };

  // ── STEP 3: SET UP TIMEOUT (ABORT CONTROLLER) ──
  // Problem: if the server is down or very slow, fetch() waits forever by default
  // Solution: AbortController lets us cancel (abort) a request after a time limit

  // AbortController is a built-in browser API
  // It creates a "controller" object with a .signal we can attach to a request
  const controller = new AbortController();

  // setTimeout schedules a function to run after "timeout" milliseconds (default 10 seconds)
  // When it fires, it calls controller.abort() which cancels the fetch request
  // We save the ID (timeoutId) so we can cancel the timer if the request finishes in time
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // ── STEP 4: BUILD THE FETCH CONFIG OBJECT ──
  // fetch() takes two arguments: a URL and a config object
  // The config object tells fetch HOW to make the request
  const config = {
    method,    // the HTTP method: GET, POST, PUT, DELETE, PATCH etc.
    headers,   // the headers object we built above (Content-Type + Authorization)

    // signal links the AbortController to this fetch request
    // if controller.abort() is called (from the setTimeout above),
    // the fetch will immediately stop and throw an AbortError
    signal: controller.signal,
  };

  // ── STEP 5: ATTACH BODY (only for POST, PUT, PATCH etc.) ──
  // GET requests don't have a body — only requests that send data do
  // "if (body)" = if body is not null (i.e. something was passed in)
  if (body) {
    // JSON.stringify() converts a JavaScript object into a JSON string
    // e.g. { name: "Riya", age: 20 } → '{"name":"Riya","age":20}'
    // fetch() can only send strings, not objects — so this conversion is required
    config.body = JSON.stringify(body);
  }

  // ── STEP 6: MAKE THE ACTUAL REQUEST ──
  // Everything above was preparation — this line actually sends the request
  try {

    // fetch() sends the HTTP request and waits for a response
    // "await" pauses here until the server responds (or timeout fires)
    // "response" is an object representing the server's raw HTTP response
    const response = await fetch(url, config);

    // ── REQUEST SUCCEEDED (within time limit) ──
    // Cancel the timeout timer — request came back in time, no need to abort
    // Without this, the timer would still fire 10 seconds later and abort nothing
    // but it's good practice to always clean up timers to avoid memory issues
    clearTimeout(timeoutId);

    // ── STEP 7: CHECK IF THE RESPONSE IS HTML INSTEAD OF JSON ──
    // Normally our backend sends JSON back
    // But if the URL is wrong (e.g. a typo, or route doesn't exist on the server),
    // the server or a proxy might return an HTML error page (like a 404 page)
    // If we try to parse HTML as JSON, it will crash with a confusing error
    // So we check the response's content type first

    // response.headers.get('content-type') reads the Content-Type header from the response
    // e.g. "application/json" for JSON, or "text/html" for an HTML page
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('text/html')) {
      // Read the HTML as plain text (we don't actually use it, just for debugging)
      const html = await response.text();
      // Throw a clear, human-readable error instead of a confusing JSON parse crash
      throw new Error(`Server returned HTML (likely 404). Status: ${response.status}`);
    }

    // ── STEP 8: CHECK IF THE RESPONSE STATUS IS AN ERROR ──
    // response.ok is true when the status code is 200–299 (success range)
    // response.ok is false for 400 (bad request), 401 (unauthorized), 404, 500 etc.
    if (!response.ok) {
      // Read the error message text that the backend sent back
      // e.g. our backend sends { message: "User not found" } — we read that here
      const error = await response.text();
      // Throw an error with that message, or a generic fallback with the status code
      throw new Error(error || `Request failed with status ${response.status}`);
    }

    // ── STEP 9: PARSE AND RETURN THE JSON RESPONSE ──
    // If we reach here, everything went well:
    // ✓ we had a token
    // ✓ request didn't time out
    // ✓ server responded with JSON
    // ✓ status code was 200–299

    // response.json() reads the response body and parses it from JSON string into a JS object
    // "await" is needed because reading the body is also an async operation
    // This parsed object is what the calling code receives back
    return await response.json();

  } catch (err) {
    // ── STEP 10: HANDLE ERRORS ──

    // Special case: if the error was caused by controller.abort() (timeout fired),
    // the error's name will be 'AbortError'
    // We give a clearer, friendlier message than the default AbortError text
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    // For any other error (network down, JSON parse fail, errors we threw above),
    // just re-throw it unchanged so the calling code can catch and display it
    throw err;
  }
};