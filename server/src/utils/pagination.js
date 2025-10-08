export function getPagination(query, defaultLimit = 12) {
	const page = Math.max(1, Number(query.page) || 1);
	const limit = Math.min(50, Number(query.limit) || defaultLimit);
	const skip = (page - 1) * limit;
	return { page, limit, skip };
}


