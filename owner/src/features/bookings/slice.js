import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

export const fetchOwnerBookings = createAsyncThunk('bookings/fetchOwner', async (_p, thunkApi) => {
  try {
    const { data } = await api.get('/api/owner/bookings');
    return data.data || [];
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load bookings');
  }
});

export const updateBookingStatus = createAsyncThunk('bookings/updateStatus', async ({ id, status }, thunkApi) => {
  try {
    const { data } = await api.patch(`/api/owner/bookings/${id}`, { status });
    return data.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to update booking');
  }
});

const slice = createSlice({
  name: 'bookings',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerBookings.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchOwnerBookings.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
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

