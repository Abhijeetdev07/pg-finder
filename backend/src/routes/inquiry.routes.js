import { Router } from "express";
import { createInquiry, ownerListInquiries, ownerUpdateInquiry } from "../controllers/inquiry.controller.js";
import { requireAuth, requireOwner } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createInquiry);
router.get("/owner", requireAuth, requireOwner, ownerListInquiries);
router.patch("/owner/:id", requireAuth, requireOwner, ownerUpdateInquiry);

export default router;


