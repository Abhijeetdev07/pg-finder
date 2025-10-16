import { Router } from "express";
import { requireAuth, requireOwner } from "../middleware/auth.js";
import { uploadImages } from "../controllers/upload.controller.js";
import { configureCloudinary, createUploadMiddleware } from "../config/cloudinary.js";

const router = Router();

router.post(
  "/images",
  requireAuth,
  requireOwner,
  (req, res, next) => {
    const ok = configureCloudinary();
    if (!ok) return res.status(500).json({ message: "Cloudinary not configured" });
    const upload = createUploadMiddleware("pg-hub");
    upload.array("images", 6)(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  uploadImages
);

export default router;


