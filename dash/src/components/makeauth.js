export const makeAuthenticatedRequest = async (url, method = 'GET', body = null, timeout = 10000) => {
  const token = localStorage.getItem('token'); // Get JWT token from localStorage for authentication

  if (!token) {
    throw new Error('No authentication token found'); // Throw error if no token exists
  }

  const headers = {
    'Content-Type': 'application/json', // Set content type to JSON
    'Authorization': `Bearer ${token}`, // Attach token as Bearer token for secure requests
  };

  const controller = new AbortController(); // Create AbortController to handle request timeout
  const timeoutId = setTimeout(() => controller.abort(), timeout); // Set timeout to abort request if it exceeds given time

  const config = {
    method, // HTTP method (GET, POST, etc.)
    headers, // Attach headers including Authorization
    signal: controller.signal, // Link AbortController signal to cancel request if needed
  };

  if (body) {
    config.body = JSON.stringify(body); // If body exists, convert it to JSON string and attach to request
  }

  try {
    const response = await fetch(url, config); // Make the API request with given URL and configuration
    clearTimeout(timeoutId); // Clear the timeout once response is received

    const contentType = response.headers.get('content-type'); // Get content type of the response
    if (contentType && contentType.includes('text/html')) {
      const html = await response.text(); // If server returned HTML instead of JSON, read it as text
      throw new Error(`Server returned HTML (likely 404). Status: ${response.status}`); // Throw error if unexpected HTML response
    }

    if (!response.ok) {
      const error = await response.text(); // If response is not OK, read error message
      throw new Error(error || `Request failed with status ${response.status}`); // Throw error with message or status code
    }

    return await response.json(); // If all is good, parse and return JSON response
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.'); // Handle timeout error separately
    }
    throw err; // Rethrow any other errors
  }
};
