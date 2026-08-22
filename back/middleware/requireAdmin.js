const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "adminbrand@gmail.com";

export default function requireAdmin(req, res, next) {
  if (req.user?.username !== ADMIN_USERNAME) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
