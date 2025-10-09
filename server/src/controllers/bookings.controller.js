import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';

export async function createBooking(req, res, next) {
	try {
		const { listingId, startDate, durationMonths, visitRequested } = req.body;
		
		// Comprehensive validation
		const errors = [];
		
		// Required fields
		if (!listingId) {
			errors.push('listingId is required');
		}
		
		// Validate listing exists
		if (listingId) {
			const listing = await Listing.findById(listingId);
			if (!listing) {
				errors.push('listing not found');
			}
		}
		
		// Booking validation: startDate+durationMonths OR visitRequested=true
		const hasBookingDetails = startDate && durationMonths;
		const hasVisitRequest = Boolean(visitRequested);
		
		if (!hasBookingDetails && !hasVisitRequest) {
			errors.push('Either provide startDate+durationMonths for booking OR set visitRequested=true for visit request');
		}
		
		// Validate startDate if provided
		if (startDate) {
			const startDateObj = new Date(startDate);
			if (isNaN(startDateObj.getTime())) {
				errors.push('startDate must be a valid date');
			} else {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				if (startDateObj < today) {
					errors.push('startDate cannot be in the past');
				}
			}
		}
		
		// Validate durationMonths if provided
		if (durationMonths) {
			const duration = Number(durationMonths);
			if (!Number.isFinite(duration) || duration <= 0) {
				errors.push('durationMonths must be a positive number');
			} else if (duration > 24) {
				errors.push('durationMonths cannot exceed 24 months');
			}
		}
		
		// Validate visitRequested is boolean
		if (visitRequested !== undefined && typeof visitRequested !== 'boolean') {
			errors.push('visitRequested must be a boolean value');
		}
		
		if (errors.length > 0) {
			return res.status(400).json({ 
				message: 'Validation failed', 
				errors: errors 
			});
		}
		
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


