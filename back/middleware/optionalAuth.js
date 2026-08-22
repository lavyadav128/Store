import jwt from "jsonwebtoken";

const optionalAuth = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.headers.Authorization?.split(" ")[1] ||
      req.cookies?.token;

    // No token is completely fine.
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    // Invalid/expired token should not crash the chatbot.
    req.user = null;
    next();
  }
};

export default optionalAuth;