export default function RatingStars({ value = 0, outOf = 5 }) {
	const full = Math.floor(value);
	const hasHalf = value - full >= 0.5;
	const empty = outOf - full - (hasHalf ? 1 : 0);
	return (
		<div className="inline-flex items-center gap-0.5 text-yellow-500">
			{Array.from({ length: full }).map((_, i) => (
				<span key={`f-${i}`}>★</span>
			))}
			{hasHalf && <span>☆</span>}
			{Array.from({ length: empty }).map((_, i) => (
				<span key={`e-${i}`} className="text-gray-300">★</span>
			))}
		</div>
	);
}


