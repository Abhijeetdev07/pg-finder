import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    pgId: { type: mongoose.Schema.Types.ObjectId, ref: "Pg", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dates: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "cancelled"],
      default: "requested",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);


