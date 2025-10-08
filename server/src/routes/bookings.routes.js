import { Router } from 'express';
import { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus } from '../controllers/bookings.controller.js';
import { verifyAccessToken, requireRole } from '../middlewares/auth.js';

const router = Router();

router.post('/', verifyAccessToken, requireRole('student'), createBooking);
router.get('/me', verifyAccessToken, requireRole('student'), getMyBookings);
router.get('/owner', verifyAccessToken, requireRole('owner'), getOwnerBookings);
router.patch('/:id', verifyAccessToken, requireRole('owner'), updateBookingStatus);

export default router;


