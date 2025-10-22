import Joi from "joi";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Inquiry } from "../models/Inquiry.js";

const inquirySchema = Joi.object({
  pgId: Joi.string().hex().length(24).required(),
  message: Joi.string().min(5).required(),
});

export const createInquiry = asyncHandler(async (req, res) => {
  const { value, error } = inquirySchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const inquiry = await Inquiry.create({ ...value, userId: req.user.id });
  res.status(201).json({ data: inquiry });
});

export const ownerListInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find()
    .populate({ path: "pgId", match: { ownerId: req.user.id } })
    .populate('userId', 'name email');
  res.status(200).json({ data: inquiries.filter((i) => i.pgId) });
});

export const ownerUpdateInquiry = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Status required" });
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
  res.status(200).json({ data: inquiry });
});


