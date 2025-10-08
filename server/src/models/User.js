import mongoose from 'mongoose';

const favoriteRef = { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' };

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		passwordHash: { type: String, required: true },
		phone: { type: String, trim: true },
		role: { type: String, enum: ['student', 'owner'], default: 'student', index: true },
		favorites: [favoriteRef],
	},
	{ timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);


