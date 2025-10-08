import { Router } from 'express';
import { createReview, getListingReviews, deleteReview } from '../controllers/reviews.controller.js';
import { verifyAccessToken, requireRole } from '../middlewares/auth.js';
import Joi from 'joi';
import { validate } from '../middlewares/validate.js';

const router = Router();

const createSchema = Joi.object({
	body: Joi.object({
		listingId: Joi.string().required(),
		rating: Joi.number().integer().min(1).max(5).required(),
		comment: Joi.string().allow('').max(1000),
	}),
});

router.get('/listing/:listingId', getListingReviews);
router.post('/', verifyAccessToken, requireRole('student', 'owner'), validate(createSchema), createReview);
router.delete('/:id', verifyAccessToken, requireRole('student', 'admin'), deleteReview);

export default router;


