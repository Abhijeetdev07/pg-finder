import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { connectToDatabase } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import pgRoutes from "./routes/pg.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// Security & utility middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const ownerOrigin = process.env.OWNER_ORIGIN || "http://localhost:5174";
app.use(
  cors({
    origin: [clientOrigin, ownerOrigin],
    credentials: true,
  })
);

// Rate limiter (basic)
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 600 });
app.use(limiter);

// Health check
app.get("/health", (_req, res) => {
  res.send("I am fine");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);

// 404 and error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const isVercel = Boolean(process.env.VERCEL);

// Start server (local/Render). On Vercel, export app and connect DB without listening.
if (!isVercel) {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to connect to database", err);
      process.exit(1);
    });
} else {
  // Vercel serverless cold start: ensure DB connection is initiated
  connectToDatabase().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("DB connect failed on Vercel", err);
  });
}

export default app;


