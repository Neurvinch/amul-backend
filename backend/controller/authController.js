import jwt from "jsonwebtoken";
import Register from "../models/RegisterModel.js";
import { hashPassword, comparePassword } from "../utils/hashing.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export const register = async (req, res) => {
  try {
    const { email, password, name, age, bio } = req.body || {};
    if (!email || !password || !name || typeof age !== "number") {
      return res.status(400).json({ message: "email, password, name, age are required" });
    }
    const existing = await Register.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });
    const hashed = await hashPassword(password);
    const user = await Register.create({ email, password: hashed, name, age, bio });
    return res.status(201).json({ id: user._id, email: user.email, name: user.name, age: user.age, bio: user.bio });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "email and password required" });
    const user = await Register.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
};
