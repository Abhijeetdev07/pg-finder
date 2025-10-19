import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

export const fetchInquiries = createAsyncThunk('inquiries/fetch', async (_p, thunkApi) => {
  try {
    const { data } = await api.get('/api/owner/inquiries');
    return data.data || [];
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load inquiries');
  }
});

export const updateInquiryStatus = createAsyncThunk('inquiries/updateStatus', async ({ id, status }, thunkApi) => {
  try {
    const { data } = await api.patch(`/api/inquiries/owner/${id}`, { status });
    return data.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to update inquiry');
  }
});

const slice = createSlice({
  name: 'inquiries',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchInquiries.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchInquiries.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        // Preserve populated refs (pgId, userId) which backend update doesn't return populated
        state.items = state.items.map((it) => {
          if (it._id !== updated._id) return it;
          return {
            ...it,
            ...updated,
            pgId: it.pgId || updated.pgId,
            userId: it.userId || updated.userId,
          };
        });
      });
  },
});

export default slice.reducer;

