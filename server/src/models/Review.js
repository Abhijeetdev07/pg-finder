import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
	{
		listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
		studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		rating: { type: Number, min: 1, max: 5, required: true },
		comment: { type: String, trim: true },
	},
	{ timestamps: true }
);

reviewSchema.index({ listingId: 1, studentId: 1 }, { unique: true });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);


