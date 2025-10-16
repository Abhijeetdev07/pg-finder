import Joi from "joi";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/Review.js";
import { Pg } from "../models/Pg.js";

const reviewSchema = Joi.object({
  pgId: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(""),
});

export const createReview = asyncHandler(async (req, res) => {
  const { value, error } = reviewSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const review = await Review.create({ ...value, userId: req.user.id });

  // Recompute and update rating average and count on the PG document
  const pgObjectId = new mongoose.Types.ObjectId(value.pgId);
  const stats = await Review.aggregate([
    { $match: { pgId: pgObjectId } },
    { $group: { _id: "$pgId", avg: { $avg: "$rating" }, count: { $count: {} } } },
  ]);
  const avg = stats[0]?.avg || 0;
  const count = stats[0]?.count || 0;
  await Pg.findByIdAndUpdate(value.pgId, { ratingAvg: avg, ratingCount: count });

  res.status(201).json({ data: review });
});

export const listReviewsForPg = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ pgId: req.params.id }).sort("-createdAt");
  res.status(200).json({ data: reviews });
});


