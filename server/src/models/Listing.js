import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
	{
		url: { type: String, required: true },
		publicId: { type: String, required: true },
	},
	{ _id: false }
);

const facilitiesSchema = new mongoose.Schema(
	{
		wifi: { type: Boolean, default: false },
		food: { type: Boolean, default: false },
		ac: { type: Boolean, default: false },
		laundry: { type: Boolean, default: false },
		attachedBathroom: { type: Boolean, default: false },
		parking: { type: Boolean, default: false },
	},
	{ _id: false }
);

const listingSchema = new mongoose.Schema(
	{
		ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		name: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		address: { type: String, required: true, trim: true },
		collegeName: { type: String, trim: true, index: true },
		location: {
			type: { type: String, enum: ['Point'], default: 'Point' },
			coordinates: { type: [Number], required: true, index: '2dsphere' }, // [lng, lat]
		},
		pricePerMonth: { type: Number, required: true, index: true },
		gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
		facilities: { type: facilitiesSchema, default: () => ({}) },
		photos: { type: [photoSchema], default: [] },
		availableBeds: { type: Number, default: 0 },
		totalBeds: { type: Number, default: 0 },
		avgRating: { type: Number, default: 0 },
		numReviews: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

listingSchema.index({ name: 'text', description: 'text', address: 'text' });

export const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);


