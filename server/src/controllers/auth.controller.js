import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

function signAccessToken(user) {
	const payload = { id: user._id.toString(), role: user.role };
	const secret = process.env.JWT_ACCESS_SECRET;
	if (!secret) throw new Error('JWT_ACCESS_SECRET is not set');
	return jwt.sign(payload, secret, { expiresIn: '15m' });
}

function signRefreshToken(user) {
	const payload = { id: user._id.toString(), role: user.role };
	const secret = process.env.JWT_REFRESH_SECRET;
	if (!secret) throw new Error('JWT_REFRESH_SECRET is not set');
	return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export async function register(req, res, next) {
	try {
		const { name, email, password, role, phone } = req.body;
		const existing = await User.findOne({ email });
		if (existing) return res.status(409).json({ message: 'Email already in use' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash, role: role || 'student', phone });
		const accessToken = signAccessToken(user);
		const refreshToken = signRefreshToken(user);
		res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
		return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
	} catch (err) {
		return next(err);
	}
}

export async function login(req, res, next) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const accessToken = signAccessToken(user);
		const refreshToken = signRefreshToken(user);
		res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
		return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
	} catch (err) {
		return next(err);
	}
}

export async function refresh(req, res, next) {
	try {
		const token = req.cookies?.refreshToken;
		if (!token) return res.status(401).json({ message: 'No refresh token' });
		const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
		const user = await User.findById(decoded.id);
		if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
		const accessToken = signAccessToken(user);
		return res.json({ accessToken });
	} catch (err) {
		return next(err);
	}
}

export async function logout(_req, res) {
	res.clearCookie('refreshToken');
	return res.json({ message: 'Logged out' });
}

export async function me(req, res, next) {
	try {
		const user = await User.findById(req.user.id).select('-passwordHash');
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
}

export async function updateMe(req, res, next) {
	try {
		const { name, phone } = req.body;
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ $set: { name, phone } },
			{ new: true }
		).select('-passwordHash');
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
}

export async function updateRole(req, res, next) {
    try {
        const { role } = req.body;
        if (role !== 'student' && role !== 'owner') {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { role } },
            { new: true }
        ).select('-passwordHash');
        const accessToken = signAccessToken(user);
        return res.json({ user, accessToken });
    } catch (err) {
        return next(err);
    }
}


