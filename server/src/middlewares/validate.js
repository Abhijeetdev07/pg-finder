export function validate(schema) {
	return (req, res, next) => {
		const payload = { body: req.body, query: req.query, params: req.params };
		const { error, value } = schema.validate(payload, { abortEarly: false, allowUnknown: true, stripUnknown: true });
		if (error) {
			return res.status(400).json({
				message: 'Validation failed',
				errors: error.details.map((d) => ({ path: d.path, message: d.message })),
			});
		}
		// assign parsed values back (avoid setting req.query directly on Express 5)
		if (value.body) req.body = value.body;
		if (value.params) req.params = value.params;
		if (value.query) {
			for (const k of Object.keys(value.query)) {
				req.query[k] = value.query[k];
			}
		}
		return next();
	};
}


