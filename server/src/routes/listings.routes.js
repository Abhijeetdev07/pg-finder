import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { configureCloudinary } from '../config/cloudinary.js';
import { listListings, getListing, createListing, updateListing, deleteListing, toggleFavorite, getFavorites, getNearby } from '../controllers/listings.controller.js';
import { verifyAccessToken, requireRole } from '../middlewares/auth.js';
import Joi from 'joi';
import { validate } from '../middlewares/validate.js';

const router = Router();
const cloudinary = configureCloudinary();
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'pg-listings',
		resource_type: 'image',
		allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
		transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
	},
});
const upload = multer({ storage });

const listSchema = Joi.object({
	query: Joi.object({
		q: Joi.string().allow(''),
		college: Joi.string().allow(''),
		minPrice: Joi.number().min(0),
		maxPrice: Joi.number().min(0),
		gender: Joi.string().valid('male', 'female', 'unisex'),
		wifi: Joi.string().valid('true', 'false').optional(),
		food: Joi.string().valid('true', 'false').optional(),
		ac: Joi.string().valid('true', 'false').optional(),
		laundry: Joi.string().valid('true', 'false').optional(),
		attachedBathroom: Joi.string().valid('true', 'false').optional(),
		parking: Joi.string().valid('true', 'false').optional(),
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(50).default(12),
		sort: Joi.string().valid('priceAsc','priceDesc','ratingDesc','newest','relevance').optional(),
	}),
});

router.get('/', validate(listSchema), listListings);
router.get('/nearby', getNearby);
router.get('/favorites', verifyAccessToken, getFavorites);
router.get('/:id', getListing);

router.post('/', verifyAccessToken, requireRole('owner'), upload.array('photos', 8), createListing);
router.patch('/:id', verifyAccessToken, requireRole('owner'), upload.array('photos', 8), updateListing);
router.delete('/:id', verifyAccessToken, requireRole('owner'), deleteListing);
router.post('/:id/favorite', verifyAccessToken, toggleFavorite);

export default router;


