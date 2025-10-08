import { Router } from 'express';
import { getDashboardSummary } from '../controllers/owners.controller.js';
import { verifyAccessToken, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/dashboard/summary', verifyAccessToken, requireRole('owner', 'admin'), getDashboardSummary);

export default router;


