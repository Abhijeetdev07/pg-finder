import { Inquiry } from '../models/Inquiry.js';
import { Listing } from '../models/Listing.js';

export async function createInquiry(req, res, next) {
	try {
		const { listingId, message, contactVia } = req.body;
		const listing = await Listing.findById(listingId).select('ownerId');
		if (!listing) return res.status(404).json({ message: 'Listing not found' });
		const inquiry = await Inquiry.create({ listingId, studentId: req.user.id, ownerId: listing.ownerId, message, contactVia });
		return res.status(201).json({ inquiry });
	} catch (err) {
		return next(err);
	}
}

export async function getOwnerInquiries(req, res, next) {
	try {
		const items = await Inquiry.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
		return res.json({ items });
	} catch (err) {
		return next(err);
	}
}

export async function updateInquiryStatus(req, res, next) {
	try {
		const { status } = req.body; // open | responded
		const inquiry = await Inquiry.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.id }, { status }, { new: true });
		if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
		return res.json({ inquiry });
	} catch (err) {
		return next(err);
	}
}


