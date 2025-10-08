import mongoose from 'mongoose';

export async function connectDB() {
	const mongoUri = process.env.MONGODB_URI;
	if (!mongoUri) {
		throw new Error('MONGODB_URI is not set');
	}
	if (mongoose.connection.readyState === 1) return; // already connected

	try {
		await mongoose.connect(mongoUri, {
			// useNewUrlParser and useUnifiedTopology are default in Mongoose 6+
		});
		// eslint-disable-next-line no-console
		console.log('Connected to MongoDB');
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('MongoDB connection error:', err);
		throw err;
	}
}


