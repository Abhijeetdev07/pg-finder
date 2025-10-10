import { Inquiry } from '../models/Inquiry.js';
import { Listing } from '../models/Listing.js';

export async function createInquiry(req, res, next) {
	try {
		const { listingId, message, contactVia } = req.body;
        const listing = await Listing.findById(listingId).select('ownerId');
		if (!listing) return res.status(404).json({ message: 'Listing not found' });
        if (String(listing.ownerId) === String(req.user.id)) {
            return res.status(400).json({ message: 'Owners cannot create inquiries or visit requests on their own listing' });
        }
		// Prevent duplicate open inquiries for the same listing by the same student
		const existingOpen = await Inquiry.findOne({ listingId, studentId: req.user.id, status: 'open' }).select('_id');
		if (existingOpen) {
			return res.status(400).json({ message: 'You already have a pending inquiry for this listing. Please wait for a response.' });
		}
		const inquiry = await Inquiry.create({ listingId, studentId: req.user.id, ownerId: listing.ownerId, message, contactVia });
		return res.status(201).json({ inquiry });
	} catch (err) {
		return next(err);
	}
}

export async function getMyInquiries(req, res, next) {
	try {
		const items = await Inquiry.find({ studentId: req.user.id }).populate('listingId', 'name address photos pricePerMonth').sort({ createdAt: -1 });
		return res.json({ items });
	} catch (err) {
		return next(err);
	}
}

export async function getOwnerInquiries(req, res, next) {
	try {
		const items = await Inquiry.find({ ownerId: req.user.id }).populate('studentId', 'name email').populate('listingId', 'name address').sort({ createdAt: -1 });
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


