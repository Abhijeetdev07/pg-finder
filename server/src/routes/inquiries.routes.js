import { Router } from 'express';
import { createInquiry, getOwnerInquiries, updateInquiryStatus } from '../controllers/inquiries.controller.js';
import { verifyAccessToken, requireRole } from '../middlewares/auth.js';

const router = Router();

router.post('/', verifyAccessToken, requireRole('student'), createInquiry);
router.get('/owner', verifyAccessToken, requireRole('owner'), getOwnerInquiries);
router.patch('/:id', verifyAccessToken, requireRole('owner'), updateInquiryStatus);

export default router;


