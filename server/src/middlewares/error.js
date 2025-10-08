// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	const details = err.details || undefined;
	if (process.env.NODE_ENV !== 'production') {
		// eslint-disable-next-line no-console
		console.error(err);
	}
	return res.status(status).json({ message, details });
}


