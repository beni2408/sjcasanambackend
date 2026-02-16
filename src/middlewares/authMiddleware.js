import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // ✅ Get token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Not authorized. No token provided",
      });
    }

    // ✅ Format: "Bearer TOKEN"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Invalid token format",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach admin info to request
    req.admin = decoded;

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    return res.status(401).json({
      message: "Not authorized. Token failed",
    });
  }
};
