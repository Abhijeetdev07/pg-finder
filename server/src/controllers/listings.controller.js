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
			return res.status(400).json({ message: 'facilities must be a valid JSON string' });
		}

		// Comprehensive validation
		const errors = [];
		
		// Required fields validation
		if (!body.name || body.name.trim().length === 0) {
			errors.push('name is required');
		}
		if (!body.address || body.address.trim().length === 0) {
			errors.push('address is required');
		}
		if (!body.pricePerMonth) {
			errors.push('pricePerMonth is required');
		}
		if (!body.gender) {
			errors.push('gender is required');
		}
		if (!facilities || typeof facilities !== 'object') {
			errors.push('facilities is required');
		}
		if (!location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
			errors.push('location with coordinates is required');
		}

		// Data type and format validation
		if (body.pricePerMonth) {
			const price = Number(body.pricePerMonth);
			if (!Number.isFinite(price) || price <= 0) {
				errors.push('pricePerMonth must be a positive number');
			}
		}

		if (body.gender && !['male', 'female', 'unisex'].includes(body.gender)) {
			errors.push('gender must be male, female, or unisex');
		}

		// Location validation
		if (location && location.coordinates) {
			const [lng, lat] = location.coordinates;
			if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
				errors.push('location coordinates must be valid numbers');
			}
			if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
				errors.push('location coordinates must be within valid ranges');
			}
		}

		// Facilities validation
		if (facilities && typeof facilities === 'object') {
			const validFacilities = ['wifi', 'food', 'ac', 'laundry', 'attachedBathroom', 'parking'];
			const facilityKeys = Object.keys(facilities);
			const invalidFacilities = facilityKeys.filter(key => !validFacilities.includes(key));
			if (invalidFacilities.length > 0) {
				errors.push(`invalid facilities: ${invalidFacilities.join(', ')}`);
			}
		}

		// Name length validation
		if (body.name && body.name.length > 100) {
			errors.push('name must be 100 characters or less');
		}

		// Address length validation
		if (body.address && body.address.length > 200) {
			errors.push('address must be 200 characters or less');
		}

		if (errors.length > 0) {
			return res.status(400).json({ 
				message: 'Validation failed', 
				errors: errors 
			});
		}

		// Coerce numeric optionals
		const availableBeds = body.availableBeds !== undefined ? Number(body.availableBeds) : 0;
		const totalBeds = body.totalBeds !== undefined ? Number(body.totalBeds) : 0;
		
		const listing = await Listing.create({
			ownerId: req.user.id,
			name: body.name.trim(),
			description: body.description?.trim(),
			address: body.address.trim(),
			collegeName: body.collegeName?.trim(),
			location,
			pricePerMonth: Number(body.pricePerMonth),
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
		
		// Handle photo deletions
		if (updates.deletedPhotos) {
			const deletedPublicIds = JSON.parse(updates.deletedPhotos);
			// Remove photos from database
			updates.$pull = { photos: { publicId: { $in: deletedPublicIds } } };
			// Delete from Cloudinary
			await Promise.all(deletedPublicIds.map(publicId => 
				cloudinary.uploader.destroy(publicId).catch(() => null)
			));
		}
		
		// Handle new photo uploads
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
		// Enforce max 8 photos total. We need current count to validate before pushing new ones
		const current = await Listing.findOne({ _id: req.params.id, ownerId: req.user.id }, { photos: 1 });
		if (!current) return res.status(404).json({ message: 'Listing not found' });
		const removeCount = updates.$pull?.photos?.publicId?.$in?.length || 0;
		const addCount = updates.$push?.photos?.$each?.length || 0;
		const resulting = (current.photos?.length || 0) - removeCount + addCount;
		if (resulting > 8) {
			return res.status(400).json({ message: 'You can have at most 8 photos per listing' });
		}
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


