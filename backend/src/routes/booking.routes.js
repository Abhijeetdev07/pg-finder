import { Router } from "express";
import { createBooking, userListBookings, ownerListBookings, ownerUpdateBooking } from "../controllers/booking.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createBooking);
router.get("/", requireAuth, userListBookings);
router.get("/owner", requireAuth, requireOwner, ownerListBookings);
router.patch("/owner/:id", requireAuth, requireOwner, ownerUpdateBooking);

export default router;


