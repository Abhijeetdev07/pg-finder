export default function Modal({ isOpen, title, children, onClose, actions }) {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-50 grid place-items-center">
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />
			<div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button type="button" onClick={onClose} className="px-2 py-1 border rounded">×</button>
				</div>
				<div className="mb-3">{children}</div>
				{actions && <div className="flex justify-end gap-2">{actions}</div>}
			</div>
		</div>
	);
}


