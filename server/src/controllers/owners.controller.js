import { Listing } from '../models/Listing.js';
import { Inquiry } from '../models/Inquiry.js';
import { Booking } from '../models/Booking.js';

export async function getDashboardSummary(req, res, next) {
	try {
		const ownerId = req.user.id;
		const [listingsCount, inquiriesCount, bookings] = await Promise.all([
			Listing.countDocuments({ ownerId }),
			Inquiry.countDocuments({ ownerId }),
			Booking.find().populate('listingId'),
		]);
		const bookingsCount = bookings.filter((b) => b.listingId?.ownerId?.toString() === ownerId).length;
		return res.json({ listingsCount, inquiriesCount, bookingsCount });
	} catch (err) {
		return next(err);
	}
}


