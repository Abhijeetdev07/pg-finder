import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const toggleFavorite = createAsyncThunk('favorites/toggle', async (listingId, { rejectWithValue }) => {
	try {
		const { data } = await api.post(`/api/listings/${listingId}/favorite`);
		return { ids: data.favorites || [] };
	} catch (err) {
		return rejectWithValue(err?.response?.data || { message: 'Failed to toggle favorite' });
	}
});

export const fetchFavorites = createAsyncThunk('favorites/fetch', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.get('/api/listings/favorites');
		return { items: data.items || [] };
	} catch (err) {
		return rejectWithValue(err?.response?.data || { message: 'Failed to fetch favorites' });
	}
});

const initialState = {
	ids: [],
	items: [],
	status: 'idle',
	error: null,
};

const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {},
    extraReducers: (builder) => {
		builder
			.addCase(toggleFavorite.fulfilled, (state, action) => {
				state.ids = action.payload.ids;
			})
			.addCase(fetchFavorites.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchFavorites.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items = action.payload.items;
				state.ids = action.payload.items.map((l) => l._id);
			})
			.addCase(fetchFavorites.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || action.error;
			});
	},
});

export default favoritesSlice.reducer;


