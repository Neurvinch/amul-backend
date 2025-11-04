import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    bio: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("register", RegisterSchema);