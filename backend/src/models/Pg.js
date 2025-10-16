import mongoose from "mongoose";

const pgSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    photos: [{ type: String }],
    rent: { type: Number, required: true, index: true },
    deposit: { type: Number, default: 0 },
    amenities: [{ type: String, index: true }],
    gender: { type: String, enum: ["male", "female", "any"], default: "any", index: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    college: { type: String, index: true },
    roomsAvailable: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pgSchema.index({ title: "text", description: "text", city: "text", college: "text" });

export const Pg = mongoose.model("Pg", pgSchema);


