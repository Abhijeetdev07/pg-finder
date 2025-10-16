import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async () => {
  const { data } = await api.get('/api/owner/analytics');
  return data.data;
});

const slice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => { state.status = 'succeeded'; state.data = action.payload; })
      .addCase(fetchAnalytics.rejected, (state, action) => { state.status = 'failed'; state.error = action.error?.message || 'Failed to load analytics'; });
  }
});

export default slice.reducer;

