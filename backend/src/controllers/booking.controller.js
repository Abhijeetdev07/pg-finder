import Joi from "joi";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/Booking.js";

const bookingSchema = Joi.object({
  pgId: Joi.string().hex().length(24).required(),
  dates: Joi.object({ from: Joi.date().required(), to: Joi.date().required() }).required(),
});

export const createBooking = asyncHandler(async (req, res) => {
  const { value, error } = bookingSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const booking = await Booking.create({ ...value, userId: req.user.id });
  res.status(201).json({ data: booking });
});

export const ownerListBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate({ path: "pgId", match: { ownerId: req.user.id } });
  res.status(200).json({ data: bookings.filter((b) => b.pgId) });
});

export const ownerUpdateBooking = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Status required" });
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.status(200).json({ data: booking });
});


