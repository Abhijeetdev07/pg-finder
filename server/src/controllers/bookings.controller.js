import { Booking } from '../models/Booking.js';

export async function createBooking(req, res, next) {
	try {
		const { listingId, startDate, durationMonths, visitRequested } = req.body;
		const booking = await Booking.create({
			listingId,
			studentId: req.user.id,
			startDate: startDate ? new Date(startDate) : undefined,
			durationMonths: durationMonths ? Number(durationMonths) : undefined,
			visitRequested: Boolean(visitRequested),
		});
		return res.status(201).json({ booking });
	} catch (err) {
		return next(err);
	}
}

export async function getMyBookings(req, res, next) {
	try {
		const items = await Booking.find({ studentId: req.user.id }).sort({ createdAt: -1 });
		return res.json({ items });
	} catch (err) {
		return next(err);
	}
}

export async function getOwnerBookings(req, res, next) {
	try {
		// For simplicity, populate listing and filter by owner at query time
		const items = await Booking.find().populate('listingId');
		const filtered = items.filter((b) => b.listingId?.ownerId?.toString() === req.user.id);
		return res.json({ items: filtered });
	} catch (err) {
		return next(err);
	}
}

export async function updateBookingStatus(req, res, next) {
	try {
		const { status } = req.body; // pending | confirmed | cancelled | visited
		const booking = await Booking.findByIdAndUpdate(
			req.params.id,
			{ status },
			{ new: true }
		);
		if (!booking) return res.status(404).json({ message: 'Booking not found' });
		return res.json({ booking });
	} catch (err) {
		return next(err);
	}
}


