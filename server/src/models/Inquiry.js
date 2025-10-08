import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
	{
		listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
		studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		message: { type: String, required: true, trim: true },
		contactVia: { type: String, enum: ['form', 'whatsapp'], default: 'form' },
		status: { type: String, enum: ['open', 'responded'], default: 'open', index: true },
	},
	{ timestamps: true }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);


