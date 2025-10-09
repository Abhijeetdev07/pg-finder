import jwt from 'jsonwebtoken';

export function verifyAccessToken(req, res, next) {
	try {
		const authHeader = req.headers.authorization || '';
		const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
		if (!token) return res.status(401).json({ message: 'Access token required' });
		
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		req.user = { id: decoded.id, role: decoded.role };
		return next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Access token expired' });
		} else if (err.name === 'JsonWebTokenError') {
			return res.status(401).json({ message: 'Invalid access token' });
		}
		return res.status(401).json({ message: 'Authentication failed' });
	}
}

export function requireRole(...roles) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ message: 'Authentication required' });
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ 
				message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}` 
			});
		}
		return next();
	};
}


