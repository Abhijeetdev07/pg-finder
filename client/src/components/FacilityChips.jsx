export default function FacilityChips({ value = {}, onChange }) {
	const keys = ['wifi', 'food', 'ac', 'laundry', 'attachedBathroom', 'parking']
	function toggle(k) {
		onChange?.({ ...value, [k]: !value[k] })
	}
	return (
		<div className="flex flex-wrap gap-2">
			{keys.map((k) => (
				<button type="button" key={k} onClick={() => toggle(k)} className={`px-3 py-1 rounded-full border text-sm ${value[k] ? 'bg-black text-white' : ''}`}>
					{k}
				</button>
			))}
		</div>
	)
}


