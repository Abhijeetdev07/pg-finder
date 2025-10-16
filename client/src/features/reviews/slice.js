import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

export const fetchReviews = createAsyncThunk('reviews/fetch', async (pgId, thunkApi) => {
  try {
    const { data } = await api.get(`/api/pgs/${pgId}/reviews`);
    return data.data || [];
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load reviews');
  }
});

export const createReview = createAsyncThunk('reviews/create', async ({ pgId, rating, comment }, thunkApi) => {
  try {
    const { data } = await api.post('/api/reviews', { pgId, rating, comment });
    return data.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to create review');
  }
});

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const slice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReviews(state, action) {
      state.items = action.payload;
    },
    clearReviews(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        // Prepend newest review
        state.items = [action.payload, ...state.items];
      });
  },
});

export const { setReviews, clearReviews } = slice.actions;
export default slice.reducer;


