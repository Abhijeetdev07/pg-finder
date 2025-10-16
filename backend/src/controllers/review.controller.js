import Joi from "joi";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/Review.js";

const reviewSchema = Joi.object({
  pgId: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(""),
});

export const createReview = asyncHandler(async (req, res) => {
  const { value, error } = reviewSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const review = await Review.create({ ...value, userId: req.user.id });
  res.status(201).json({ data: review });
});

export const listReviewsForPg = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ pgId: req.params.id }).sort("-createdAt");
  res.status(200).json({ data: reviews });
});


