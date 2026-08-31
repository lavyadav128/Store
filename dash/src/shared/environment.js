function resolveApiBase() {
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    // Production HTTPS always routes to cloud backend
    if (protocol === "https:") {
      return "https://storee-6wri.onrender.com";
    }
    // If accessing dashboard from a mobile phone or local network IP (e.g. 192.168.x.x:3001)
    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `http://${hostname}:5000`;
    }
  }
  return process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
}

const server = resolveApiBase();
export default server;