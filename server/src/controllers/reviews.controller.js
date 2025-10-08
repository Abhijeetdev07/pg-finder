import { Review } from '../models/Review.js';
import { Listing } from '../models/Listing.js';

export async function createReview(req, res, next) {
	try {
		const { listingId, rating, comment } = req.body;
		const review = await Review.create({ listingId, studentId: req.user.id, rating: Number(rating), comment });
		await recomputeListingRating(listingId);
		return res.status(201).json({ review });
	} catch (err) {
		return next(err);
	}
}

export async function getListingReviews(req, res, next) {
	try {
		const items = await Review.find({ listingId: req.params.listingId }).sort({ createdAt: -1 });
		return res.json({ items });
	} catch (err) {
		return next(err);
	}
}

export async function deleteReview(req, res, next) {
	try {
		const review = await Review.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });
		if (!review) return res.status(404).json({ message: 'Review not found' });
		await recomputeListingRating(review.listingId);
		return res.json({ message: 'Deleted' });
	} catch (err) {
		return next(err);
	}
}

async function recomputeListingRating(listingId) {
	const stats = await Review.aggregate([
		{ $match: { listingId: typeof listingId === 'string' ? new (await import('mongoose')).default.Types.ObjectId(listingId) : listingId } },
		{ $group: { _id: '$listingId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
	]);
	const { avg = 0, count = 0 } = stats[0] || {};
	await Listing.findByIdAndUpdate(listingId, { avgRating: Math.round(avg * 10) / 10, numReviews: count });
}


