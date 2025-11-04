import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "register", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("todo", TodoSchema);