import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "owner"], default: "user" },
    avatar: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pg" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);


