import { Listing } from '../models/Listing.js';
import { Inquiry } from '../models/Inquiry.js';
import { Booking } from '../models/Booking.js';

export async function getDashboardSummary(req, res, next) {
	try {
		const ownerId = req.user.id;
        const [listings, inquiriesCount, bookings] = await Promise.all([
            Listing.find({ ownerId }).sort({ createdAt: -1 }).limit(50),
			Inquiry.countDocuments({ ownerId }),
			Booking.find().populate('listingId'),
		]);
        const bookingsCount = bookings.filter((b) => b.listingId?.ownerId?.toString() === ownerId).length;
        return res.json({ listingsCount: listings.length, listings, inquiriesCount, bookingsCount });
	} catch (err) {
		return next(err);
	}
}


