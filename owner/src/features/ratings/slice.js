import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

// Fetch all ratings and reviews for owner's PGs
export const fetchRatings = createAsyncThunk('ratings/fetch', async (_p, thunkApi) => {
  try {
    const { data } = await api.get('/api/owner/ratings');
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load ratings');
  }
});

// Fetch ratings for a specific PG
export const fetchPgRatings = createAsyncThunk('ratings/fetchByPg', async (pgId, thunkApi) => {
  try {
    const { data } = await api.get(`/api/ratings/pg/${pgId}`);
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load PG ratings');
  }
});

// Delete multiple reviews
export const deleteReviews = createAsyncThunk('ratings/delete', async (reviewIds, thunkApi) => {
  try {
    const { data } = await api.delete('/api/reviews/bulk', { data: { reviewIds } });
    return { reviewIds, ...data };
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to delete reviews');
  }
});

const slice = createSlice({
  name: 'ratings',
  initialState: {
    overview: {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    },
    reviews: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearRatings: (state) => {
      state.reviews = [];
      state.overview = {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all ratings
      .addCase(fetchRatings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.overview = action.payload.overview || state.overview;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(fetchRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch PG-specific ratings
      .addCase(fetchPgRatings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPgRatings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.overview = action.payload.overview || state.overview;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(fetchPgRatings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete reviews
      .addCase(deleteReviews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove deleted reviews from state
        state.reviews = state.reviews.filter(
          review => !action.payload.reviewIds.includes(review.id)
        );
        // Update total count
        state.overview.totalReviews = state.reviews.length;
      })
      .addCase(deleteReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearRatings } = slice.actions;
export default slice.reducer;
