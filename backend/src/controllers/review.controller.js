import Joi from "joi";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/Review.js";
import { Pg } from "../models/Pg.js";

const reviewSchema = Joi.object({
  pgId: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(200).allow(""),
});

export const createReview = asyncHandler(async (req, res) => {
  const { value, error } = reviewSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  // Check if user already reviewed this PG
  const existingReview = await Review.findOne({
    userId: req.user.id,
    pgId: value.pgId
  });

  if (existingReview) {
    return res.status(409).json({ 
      message: "You have already reviewed this PG." 
    });
  }

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

export const checkUserReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({
    userId: req.user.id,
    pgId: req.params.pgId
  });
  res.status(200).json({ hasReviewed: !!review, review: review || null });
});

export const getOwnerRatings = asyncHandler(async (req, res) => {
  // Get all PGs owned by this owner
  const ownerPgs = await Pg.find({ ownerId: req.user.id }).select('_id');
  const pgIds = ownerPgs.map(pg => pg._id);

  // Get all reviews for owner's PGs
  const reviews = await Review.find({ pgId: { $in: pgIds } })
    .populate('pgId', 'title')
    .populate('userId', 'name')
    .sort('-createdAt')
    .lean();

  // Calculate overview statistics
  const totalReviews = reviews.length;
  
  // Calculate rating distribution
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;
  
  reviews.forEach(review => {
    ratingDistribution[review.rating]++;
    totalRating += review.rating;
  });

  const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

  // Format reviews for frontend
  const formattedReviews = reviews.map(review => ({
    id: review._id,
    pgName: review.pgId?.title || 'Unknown PG',
    pgId: review.pgId?._id,
    tenantName: review.userId?.name || 'Anonymous',
    rating: review.rating,
    comment: review.comment || '',
    date: review.createdAt,
    verified: true // You can add logic to determine if verified
  }));

  res.status(200).json({
    overview: {
      averageRating: parseFloat(averageRating),
      totalReviews,
      ratingDistribution
    },
    reviews: formattedReviews
  });
});

export const deleteReviews = asyncHandler(async (req, res) => {
  const { reviewIds } = req.body;

  if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
    return res.status(400).json({ message: "reviewIds array is required" });
  }

  // Get all PGs owned by this owner
  const ownerPgs = await Pg.find({ ownerId: req.user.id }).select('_id');
  const pgIds = ownerPgs.map(pg => pg._id.toString());

  // Find reviews to delete and verify ownership
  const reviewsToDelete = await Review.find({ 
    _id: { $in: reviewIds } 
  }).lean();

  // Verify all reviews belong to owner's PGs
  const unauthorizedReviews = reviewsToDelete.filter(
    review => !pgIds.includes(review.pgId.toString())
  );

  if (unauthorizedReviews.length > 0) {
    return res.status(403).json({ 
      message: "You can only delete reviews for your own PGs" 
    });
  }

  // Delete the reviews
  const deleteResult = await Review.deleteMany({ 
    _id: { $in: reviewIds } 
  });

  // Update rating stats for affected PGs
  const affectedPgIds = [...new Set(reviewsToDelete.map(r => r.pgId))];
  
  for (const pgId of affectedPgIds) {
    const stats = await Review.aggregate([
      { $match: { pgId: pgId } },
      { $group: { _id: "$pgId", avg: { $avg: "$rating" }, count: { $count: {} } } },
    ]);
    const avg = stats[0]?.avg || 0;
    const count = stats[0]?.count || 0;
    await Pg.findByIdAndUpdate(pgId, { ratingAvg: avg, ratingCount: count });
  }

  res.status(200).json({ 
    message: `Successfully deleted ${deleteResult.deletedCount} review(s)`,
    deletedCount: deleteResult.deletedCount
  });
});


