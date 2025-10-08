import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const fetchListings = createAsyncThunk('listings/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/api/listings', { params });
        return data; // { items, total, page, pageSize }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to fetch listings' });
    }
});

export const fetchNearby = createAsyncThunk('listings/fetchNearby', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/api/listings/nearby', { params });
        return data; // { items, total, page, pageSize }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to fetch nearby' });
    }
});

export const fetchListingById = createAsyncThunk('listings/fetchById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/api/listings/${id}`);
        return data; // { listing }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to fetch listing' });
    }
});

export const createListing = createAsyncThunk('listings/create', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/api/listings', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return data; // { listing }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to create listing' });
    }
});

export const updateListing = createAsyncThunk('listings/update', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.patch(`/api/listings/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return data; // { listing }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to update listing' });
    }
});

export const deleteListing = createAsyncThunk('listings/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/api/listings/${id}`);
        return { id };
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to delete listing' });
    }
});

const initialState = {
    items: [],
    pagination: { total: 0, page: 1, pageSize: 12 },
    filters: { q: '', college: '', gender: 'unisex', wifi: false, food: false, ac: false, page: 1, limit: 12, sort: 'newest' },
    current: null,
    status: 'idle',
    error: null,
};

const listingsSlice = createSlice({
	name: 'listings',
	initialState,
	reducers: {},
    extraReducers: (builder) => {
		builder
			.addCase(fetchListings.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchListings.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items = action.payload.items;
				state.pagination = { total: action.payload.total, page: action.payload.page, pageSize: action.payload.pageSize };
			})
			.addCase(fetchListings.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || action.error;
            })
            .addCase(fetchNearby.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchNearby.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.pagination = { total: action.payload.total, page: action.payload.page, pageSize: action.payload.pageSize };
            })
            .addCase(fetchNearby.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error;
            })
			.addCase(fetchListingById.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchListingById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.current = action.payload.listing;
			})
			.addCase(fetchListingById.rejected, (state, action) => {
				state.status = 'failed';
                state.error = action.payload || action.error;
            })
            .addCase(createListing.fulfilled, (state, action) => {
                if (action.payload.listing) state.items.unshift(action.payload.listing);
            })
            .addCase(updateListing.fulfilled, (state, action) => {
                const updated = action.payload.listing;
                if (!updated) return;
                const idx = state.items.findIndex((i) => i._id === updated._id);
                if (idx >= 0) state.items[idx] = updated;
                if (state.current && state.current._id === updated._id) state.current = updated;
            })
            .addCase(deleteListing.fulfilled, (state, action) => {
                const id = action.payload.id;
                state.items = state.items.filter((i) => i._id !== id);
                if (state.current && state.current._id === id) state.current = null;
            });
	},
});

export default listingsSlice.reducer;


