import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.js';
import authRoutes from './routes/auth.routes.js';
import listingsRoutes from './routes/listings.routes.js';
import inquiriesRoutes from './routes/inquiries.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import ownersRoutes from './routes/owners.routes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


const app = express();

// Core middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Basic rate limits
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const inquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });

// Health check
app.get('/api/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/inquiries', inquiryLimiter, inquiriesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/owners', ownersRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
	await connectDB();
	app.listen(PORT, () => {
		// eslint-disable-next-line no-console
		console.log(`Server listening on port ${PORT}`);
	});
}

start().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Failed to start server:', err);
	process.exit(1);
});

export default app;


