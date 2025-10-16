export default function Filters({ filters, onChange, onApply, disabled }) {
  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', alignItems: 'end' }}>
      <div>
        <label>City</label>
        <input value={filters.city} onChange={(e)=>onChange({ city: e.target.value })} placeholder="City" />
      </div>
      <div>
        <label>College</label>
        <input value={filters.college} onChange={(e)=>onChange({ college: e.target.value })} placeholder="College" />
      </div>
      <div>
        <label>Min Price</label>
        <input type="number" value={filters.minPrice} onChange={(e)=>onChange({ minPrice: e.target.value })} placeholder="Min" />
      </div>
      <div>
        <label>Max Price</label>
        <input type="number" value={filters.maxPrice} onChange={(e)=>onChange({ maxPrice: e.target.value })} placeholder="Max" />
      </div>
      <div>
        <label>Gender</label>
        <select value={filters.gender} onChange={(e)=>onChange({ gender: e.target.value })}>
          <option value="any">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label>Search</label>
        <input value={filters.q} onChange={(e)=>onChange({ q: e.target.value })} placeholder="Search text" />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <button onClick={onApply} disabled={disabled}>Apply</button>
      </div>
    </div>
  );
}


