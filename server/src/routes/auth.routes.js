import { Router } from 'express';
import { register, login, refresh, logout, me, updateMe } from '../controllers/auth.controller.js';
import { verifyAccessToken } from '../middlewares/auth.js';
import Joi from 'joi';
import { validate } from '../middlewares/validate.js';

const router = Router();

const registerSchema = Joi.object({
	body: Joi.object({
		name: Joi.string().min(2).max(100).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(128).required(),
		role: Joi.string().valid('student', 'owner').default('student'),
		phone: Joi.string().allow('', null),
	}),
});

const loginSchema = Joi.object({
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', verifyAccessToken, me);
router.patch('/me', verifyAccessToken, updateMe);

export default router;


