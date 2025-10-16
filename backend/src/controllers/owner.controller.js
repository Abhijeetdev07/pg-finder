import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Pg } from "../models/Pg.js";
import { Inquiry } from "../models/Inquiry.js";
import { Booking } from "../models/Booking.js";
import { Review } from "../models/Review.js";

export const analytics = asyncHandler(async (req, res) => {
  const ownerId = new mongoose.Types.ObjectId(req.user.id);

  const [totalListings, inquiriesAgg, bookingsAgg, reviewsAgg] = await Promise.all([
    Pg.countDocuments({ ownerId }),
    Inquiry.aggregate([
      { $lookup: { from: "pgs", localField: "pgId", foreignField: "_id", as: "pg" } },
      { $unwind: "$pg" },
      { $match: { "pg.ownerId": ownerId } },
      { $count: "count" },
    ]),
    Booking.aggregate([
      { $lookup: { from: "pgs", localField: "pgId", foreignField: "_id", as: "pg" } },
      { $unwind: "$pg" },
      { $match: { "pg.ownerId": ownerId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          revenueApprox: {
            $sum: {
              $cond: [{ $eq: ["$status", "approved"] }, "$pg.rent", 0],
            },
          },
        },
      },
    ]),
    Review.aggregate([
      { $lookup: { from: "pgs", localField: "pgId", foreignField: "_id", as: "pg" } },
      { $unwind: "$pg" },
      { $match: { "pg.ownerId": ownerId } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]),
  ]);

  const totalInquiries = inquiriesAgg[0]?.count || 0;
  const totalBookings = bookingsAgg[0]?.total || 0;
  const approvedBookings = bookingsAgg[0]?.approvedCount || 0;
  const revenueApprox = bookingsAgg[0]?.revenueApprox || 0;
  const avgRating = reviewsAgg[0]?.avg || 0;
  const ratingCount = reviewsAgg[0]?.count || 0;

  res.status(200).json({
    data: {
      totalListings,
      totalInquiries,
      totalBookings,
      avgRating,
      ratingCount,
      approvedBookings,
      revenueApprox,
    },
  });
});


