export default function Card({ title, subtitle, image, price, onClick, footer }) {
	return (
		<div className="rounded-lg overflow-hidden border hover:shadow-md transition cursor-pointer" onClick={onClick}>
			{image && (
				<div className="aspect-[4/3] bg-gray-100 overflow-hidden">
					<img src={image} alt={title} className="w-full h-full object-cover" />
				</div>
			)}
			<div className="p-3 space-y-1">
				{title && <h3 className="text-base font-semibold truncate">{title}</h3>}
				{subtitle && <p className="text-sm text-gray-600 truncate">{subtitle}</p>}
				{price != null && <p className="text-sm font-medium">₹ {Number(price).toLocaleString()}</p>}
				{footer}
			</div>
		</div>
	);
}


