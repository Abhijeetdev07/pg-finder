import { Router } from "express";
import { createPg, deletePg, getPg, listPgs, updatePg } from "../controllers/pg.controller.js";
import { listReviewsForPg } from "../controllers/review.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = Router();

router.get("/", listPgs);
router.get("/:id", getPg);
router.get("/:id/reviews", listReviewsForPg);

router.post("/", requireAuth, requireOwner, createPg);
router.put("/:id", requireAuth, requireOwner, updatePg);
router.delete("/:id", requireAuth, requireOwner, deletePg);

export default router;


