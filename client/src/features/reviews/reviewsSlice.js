import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const createReview = createAsyncThunk('reviews/create', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/api/reviews', payload);
        return data; // { review }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to create review' });
    }
});

export const fetchReviews = createAsyncThunk('reviews/fetchByListing', async (listingId, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/api/reviews/listing/${listingId}`);
        return data; // { items }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to fetch reviews' });
    }
});

export const deleteReview = createAsyncThunk('reviews/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/api/reviews/${id}`);
        return { id };
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to delete review' });
    }
});

const initialState = {
    items: [], // listingReviews
    status: 'idle',
    error: null,
};

const reviewsSlice = createSlice({
	name: 'reviews',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createReview.fulfilled, (state, action) => {
				if (action.payload.review) state.items.unshift(action.payload.review);
			})
			.addCase(fetchReviews.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchReviews.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items = action.payload.items;
			})
			.addCase(fetchReviews.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || action.error;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                const id = action.payload.id;
                state.items = state.items.filter((r) => r._id !== id);
			});
	},
});

export default reviewsSlice.reducer;


