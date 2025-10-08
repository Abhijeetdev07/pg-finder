import mongoose from 'mongoose';
import { Listing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { cloudinary } from '../config/cloudinary.js';

export async function listListings(req, res, next) {
	try {
		const { q, college, minPrice, maxPrice, gender, page = 1, limit = 12, sort } = req.query;
		const filter = {};
		if (q) filter.$text = { $search: q };
		if (college) filter.collegeName = { $regex: college, $options: 'i' };
		if (gender) filter.gender = gender;
		if (minPrice || maxPrice) filter.pricePerMonth = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
		// facilities from query e.g., wifi=true
		['wifi', 'food', 'ac', 'laundry', 'attachedBathroom', 'parking'].forEach((f) => {
			if (req.query[f] === 'true') filter[`facilities.${f}`] = true;
		});
		const skip = (Number(page) - 1) * Number(limit);

		const sortMap = {
			'priceAsc': { pricePerMonth: 1 },
			'priceDesc': { pricePerMonth: -1 },
			'ratingDesc': { avgRating: -1, numReviews: -1 },
			'newest': { createdAt: -1 },
			'relevance': q ? { score: { $meta: 'textScore' } } : { createdAt: -1 },
		};
		const sortSpec = sortMap[sort] || sortMap[q ? 'relevance' : 'newest'];

		const query = Listing.find(filter).skip(skip).limit(Number(limit));
		if (sortSpec.score) {
			query.sort(sortSpec).select({ score: { $meta: 'textScore' } });
		} else {
			query.sort(sortSpec);
		}

		const [items, total] = await Promise.all([
			query,
			Listing.countDocuments(filter),
		]);
		return res.json({ items, total, page: Number(page), pageSize: Number(limit) });
	} catch (err) {
		return next(err);
	}
}

export async function getListing(req, res, next) {
	try {
		const listing = await Listing.findById(req.params.id);
		if (!listing) return res.status(404).json({ message: 'Listing not found' });
		return res.json({ listing });
	} catch (err) {
		return next(err);
	}
}

export async function createListing(req, res, next) {
	try {
		const body = req.body || {};
		const photos = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));
		// Parse JSON fields from multipart form-data
		let location = undefined;
		let facilities = undefined;
		try {
			location = body.location ? JSON.parse(body.location) : undefined;
			facilities = body.facilities ? JSON.parse(body.facilities) : undefined;
		} catch (_e) {
			return res.status(400).json({ message: 'location and facilities must be valid JSON strings' });
		}
		// Required fields
		if (!body.name || !body.address) {
			return res.status(400).json({ message: 'name and address are required' });
		}
		const price = Number(body.pricePerMonth);
		if (!Number.isFinite(price) || price <= 0) {
			return res.status(400).json({ message: 'pricePerMonth must be a positive number' });
		}
		if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2 ||
			!location.coordinates.every((n) => typeof n === 'number' || !isNaN(Number(n)))) {
			return res.status(400).json({ message: 'location.coordinates must be [lng, lat]' });
		}
		// Coerce numeric optionals
		const availableBeds = body.availableBeds !== undefined ? Number(body.availableBeds) : 0;
		const totalBeds = body.totalBeds !== undefined ? Number(body.totalBeds) : 0;
		const listing = await Listing.create({
			ownerId: req.user.id,
			name: body.name,
			description: body.description,
			address: body.address,
			collegeName: body.collegeName,
			location,
			pricePerMonth: price,
			gender: body.gender,
			facilities,
			photos,
			availableBeds: Number.isFinite(availableBeds) ? availableBeds : 0,
			totalBeds: Number.isFinite(totalBeds) ? totalBeds : 0,
		});
		return res.status(201).json({ listing });
	} catch (err) {
		return next(err);
	}
}

export async function updateListing(req, res, next) {
	try {
		const updates = { ...req.body };
		if (updates.location && typeof updates.location === 'string') updates.location = JSON.parse(updates.location);
		if (updates.facilities && typeof updates.facilities === 'string') updates.facilities = JSON.parse(updates.facilities);
		if (req.files && req.files.length) {
			const photos = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
			updates.$push = { photos: { $each: photos } };
		}
		if (updates.pricePerMonth !== undefined) {
			const price = Number(updates.pricePerMonth);
			if (!Number.isFinite(price) || price <= 0) {
				return res.status(400).json({ message: 'pricePerMonth must be a positive number' });
			}
			updates.pricePerMonth = price;
		}
		['availableBeds','totalBeds'].forEach((k) => {
			if (updates[k] !== undefined) {
				const v = Number(updates[k]);
				updates[k] = Number.isFinite(v) ? v : 0;
			}
		});
		const listing = await Listing.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.id }, updates, { new: true });
		if (!listing) return res.status(404).json({ message: 'Listing not found' });
		return res.json({ listing });
	} catch (err) {
		return next(err);
	}
}

export async function deleteListing(req, res, next) {
	try {
		const listing = await Listing.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
		if (!listing) return res.status(404).json({ message: 'Listing not found' });
		// cleanup photos in Cloudinary
		if (listing.photos?.length) {
			await Promise.all(listing.photos.map((p) => cloudinary.uploader.destroy(p.publicId).catch(() => null)));
		}
		return res.json({ message: 'Deleted' });
	} catch (err) {
		return next(err);
	}
}

export async function toggleFavorite(req, res, next) {
	try {
		const userId = req.user.id;
		const listingId = new mongoose.Types.ObjectId(req.params.id);
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: 'User not found' });
		const exists = user.favorites.some((id) => id.equals(listingId));
		user.favorites = exists ? user.favorites.filter((id) => !id.equals(listingId)) : [...user.favorites, listingId];
		await user.save();
		return res.json({ favorites: user.favorites });
	} catch (err) {
		return next(err);
	}
}

export async function getFavorites(req, res, next) {
	try {
		const user = await User.findById(req.user.id).populate('favorites');
		return res.json({ items: user?.favorites || [] });
	} catch (err) {
		return next(err);
	}
}

export async function getNearby(req, res, next) {
	try {
		const { lat, lng, radiusKm = 5, page = 1, limit = 12 } = req.query;
		if (!lat || !lng) return res.status(400).json({ message: 'lat and lng are required' });
		const meters = Number(radiusKm) * 1000;
		const skip = (Number(page) - 1) * Number(limit);
		const pipeline = [
			{
				$geoNear: {
					near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
					distanceField: 'distanceMeters',
					spherical: true,
					maxDistance: meters,
				},
			},
			{ $sort: { distanceMeters: 1 } },
			{ $skip: skip },
			{ $limit: Number(limit) },
		];
		const countPipeline = [
			{
				$geoNear: {
					near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
					distanceField: 'distanceMeters',
					spherical: true,
					maxDistance: meters,
				},
			},
			{ $count: 'total' },
		];
		const [items, totalAgg] = await Promise.all([
			Listing.aggregate(pipeline),
			Listing.aggregate(countPipeline),
		]);
		const total = totalAgg[0]?.total || 0;
		return res.json({ items, total, page: Number(page), pageSize: Number(limit) });
	} catch (err) {
		return next(err);
	}
}


