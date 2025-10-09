import { FiFilter, FiX } from 'react-icons/fi'

export default function FiltersBar({ value, onChange, onClear }) {
    const v = value || {};

    function handleChange(partial) {
        onChange?.({ ...v, ...partial });
    }

    return (
        <aside className="w-full md:w-64 md:sticky md:top-4 self-start border rounded p-3 space-y-3">
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <FiFilter />
                    Filters
                </span>
            </div>
            <div className="space-y-2">
                <label className="block text-xs text-gray-600">Sort</label>
                <select
                    value={v.sort || 'newest'}
                    onChange={(e) => handleChange({ sort: e.target.value })}
                    className="border rounded px-3 py-2 text-sm w-full"
                >
                    <option value="newest">Newest</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="ratingDesc">Top Rated</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="block text-xs text-gray-600">Gender</label>
                <select
                    value={v.gender || 'unisex'}
                    onChange={(e) => handleChange({ gender: e.target.value })}
                    className="border rounded px-3 py-2 text-sm w-full"
                >
                    <option value="unisex">Unisex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="block text-xs text-gray-600">Facilities</label>
                <label className="text-sm flex items-center gap-2">
                    <input type="checkbox" checked={v.facilities?.wifi || false} onChange={(e) => handleChange({ facilities: { ...v.facilities, wifi: e.target.checked } })} />
                    Wi‑Fi
                </label>
                <label className="text-sm flex items-center gap-2">
                    <input type="checkbox" checked={v.facilities?.food || false} onChange={(e) => handleChange({ facilities: { ...v.facilities, food: e.target.checked } })} />
                    Food
                </label>
                <label className="text-sm flex items-center gap-2">
                    <input type="checkbox" checked={v.facilities?.ac || false} onChange={(e) => handleChange({ facilities: { ...v.facilities, ac: e.target.checked } })} />
                    AC
                </label>
            </div>
            <button type="button" onClick={onClear} className="text-sm px-3 py-2 border rounded w-full inline-flex items-center justify-center gap-2">
                <FiX />
                Clear
            </button>
        </aside>
    );
}


