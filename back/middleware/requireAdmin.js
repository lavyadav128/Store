const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "adminbrand@gmail.com").trim().toLowerCase();

export default function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const username = String(req.user.username || "").trim().toLowerCase();
  const email = String(req.user.email || "").trim().toLowerCase();
  const role = String(req.user.role || "").trim().toLowerCase();

  const isAdmin =
    role === "admin" ||
    username === ADMIN_USERNAME ||
    email === ADMIN_USERNAME;

  if (!isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin authorization required." });
  }

  next();
}
