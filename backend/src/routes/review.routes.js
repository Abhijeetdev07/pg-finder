import { Router } from "express";
import { createReview, listReviewsForPg, checkUserReview } from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createReview);
router.get("/pg/:id", listReviewsForPg);
router.get("/check/:pgId", requireAuth, checkUserReview);

export default router;


