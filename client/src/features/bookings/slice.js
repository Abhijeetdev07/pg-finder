import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

export const createBooking = createAsyncThunk('bookings/create', async ({ pgId, dates }, thunkApi) => {
  try {
    const { data } = await api.post('/api/bookings', { pgId, dates });
    return data.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to create booking');
  }
});

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  lastCreated: null,
};

const slice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings(state, action) {
      state.items = action.payload;
    },
    clearBookings(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.lastCreated = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastCreated = action.payload; // booking object
        // Optionally add to items list
        state.items = [action.payload, ...state.items];
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setBookings, clearBookings } = slice.actions;
export default slice.reducer;


