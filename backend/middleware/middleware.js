import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const auth = req.headers["authorization"] || "";
    const parts = auth.split(" ");
    const token = parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "Server misconfigured" });
    const payload = jwt.verify(token, secret);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};