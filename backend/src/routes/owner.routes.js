import { Router } from "express";
import { analytics } from "../controllers/owner.controller.js";
import { ownerListInquiries, ownerUpdateInquiry } from "../controllers/inquiry.controller.js";
import { ownerListBookings, ownerUpdateBooking } from "../controllers/booking.controller.js";
import { getOwnerRatings } from "../controllers/review.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = Router();

router.get("/analytics", requireAuth, requireOwner, analytics);

// Owner inquiries and bookings under /api/owner/* for consistency with spec
router.get("/inquiries", requireAuth, requireOwner, ownerListInquiries);
router.get("/bookings", requireAuth, requireOwner, ownerListBookings);
router.patch("/bookings/:id", requireAuth, requireOwner, ownerUpdateBooking);

// Owner ratings and reviews
router.get("/ratings", requireAuth, requireOwner, getOwnerRatings);

export default router;


