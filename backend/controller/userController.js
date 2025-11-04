import Register from "../models/RegisterModel.js";

export const getMe = async (req, res) => {
  try {
    const user = await Register.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, age, bio } = req.body || {};
    const update = {};
    if (name !== undefined) update.name = name;
    if (age !== undefined) update.age = age;
    if (bio !== undefined) update.bio = bio;
    const user = await Register.findByIdAndUpdate(req.userId, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
