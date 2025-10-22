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

  // Check if user already has a pending booking for this PG
  const existingPendingBooking = await Booking.findOne({
    userId: req.user.id,
    pgId: value.pgId,
    status: 'requested'
  });

  if (existingPendingBooking) {
    return res.status(409).json({ 
      message: "You already have a pending booking request for this PG. Please wait for the owner to respond." 
    });
  }

  const booking = await Booking.create({ ...value, userId: req.user.id });
  res.status(201).json({ data: booking });
});

export const ownerListBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate({ path: "pgId", match: { ownerId: req.user.id } });
  res.status(200).json({ data: bookings.filter((b) => b.pgId) });
});

export const userListBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id })
    .populate('pgId', 'title city rent photos')
    .sort({ createdAt: -1 });
  res.status(200).json({ data: bookings });
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

export const getPgBookings = asyncHandler(async (req, res) => {
  const { pgId } = req.params;
  
  // Get all approved bookings for this PG
  const bookings = await Booking.find({ 
    pgId, 
    status: 'approved' 
  }).select('dates status');
  
  res.status(200).json({ data: bookings });
});


