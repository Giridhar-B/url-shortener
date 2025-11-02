import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    // Support both 'Authorization' and 'authorization'
    const authHeader = req.headers.authorization || req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Auth Middleware Error:", err.message);
    }
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
