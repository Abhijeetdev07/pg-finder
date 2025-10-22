import { Router } from "express";
import { createReview, listReviewsForPg, checkUserReview, deleteReviews } from "../controllers/review.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createReview);
router.get("/pg/:id", listReviewsForPg);
router.get("/check/:pgId", requireAuth, checkUserReview);
router.delete("/bulk", requireAuth, requireOwner, deleteReviews);

export default router;


