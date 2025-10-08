export default function Pagination({ page = 1, pageSize = 12, total = 0, onPageChange }) {
	const numPages = Math.max(1, Math.ceil(total / pageSize));
	if (numPages <= 1) return null;
	const pages = Array.from({ length: numPages }, (_, i) => i + 1).slice(0, 10);
	return (
		<div className="flex flex-wrap gap-2">
			{pages.map((p) => (
				<button
					key={p}
					onClick={() => onPageChange?.(p)}
					className={`px-3 py-1 border rounded ${p === page ? 'bg-black text-white' : ''}`}
				>
					{p}
				</button>
			))}
		</div>
	);
}


