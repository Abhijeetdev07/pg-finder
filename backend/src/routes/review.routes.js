import { Router } from "express";
import { createReview, listReviewsForPg } from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createReview);
router.get("/pg/:id", listReviewsForPg);

export default router;


