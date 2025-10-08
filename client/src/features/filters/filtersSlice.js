import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	q: '',
	college: '',
	geo: null, // { lat, lng }
	priceRange: [0, 20000],
	facilities: { wifi: false, food: false, ac: false, laundry: false, attachedBathroom: false, parking: false },
	gender: 'unisex',
	sort: 'newest',
};

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setQuery(state, action) { state.q = action.payload || ''; },
		setCollege(state, action) { state.college = action.payload || ''; },
		setGeo(state, action) { state.geo = action.payload || null; },
		setPriceRange(state, action) { state.priceRange = action.payload || initialState.priceRange; },
		setFacilities(state, action) { state.facilities = { ...state.facilities, ...(action.payload || {}) }; },
		setGender(state, action) { state.gender = action.payload || 'unisex'; },
		setSort(state, action) { state.sort = action.payload || 'newest'; },
		resetFilters() { return initialState; },
	},
});

export const { setQuery, setCollege, setGeo, setPriceRange, setFacilities, setGender, setSort, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;


