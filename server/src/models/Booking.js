import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
	{
		listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
		studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'visited'], default: 'pending', index: true },
		startDate: { type: Date },
		durationMonths: { type: Number },
		visitRequested: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);


