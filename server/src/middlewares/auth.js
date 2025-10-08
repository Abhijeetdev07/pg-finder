import jwt from 'jsonwebtoken';

export function verifyAccessToken(req, res, next) {
	try {
		const authHeader = req.headers.authorization || '';
		const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
		if (!token) return res.status(401).json({ message: 'Unauthorized' });
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		req.user = { id: decoded.id, role: decoded.role };
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

export function requireRole(...roles) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		return next();
	};
}


