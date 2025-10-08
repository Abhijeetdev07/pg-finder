import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const createBooking = createAsyncThunk('bookings/create', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/api/bookings', payload);
        return data; // { booking }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to create booking' });
    }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/api/bookings/me');
        return data; // { items }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to fetch my bookings' });
    }
});

export const fetchOwnerBookings = createAsyncThunk('bookings/fetchOwner', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/api/bookings/owner');
        return data; // { items }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to fetch owner bookings' });
    }
});

export const updateBookingStatus = createAsyncThunk('bookings/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await api.patch(`/api/bookings/${id}`, { status });
        return data; // { booking }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to update booking status' });
    }
});

const initialState = {
    items: [], // myBookings when student; can share structure
    ownerItems: [],
    status: 'idle',
    error: null,
};

const bookingsSlice = createSlice({
	name: 'bookings',
	initialState,
	reducers: {},
    extraReducers: (builder) => {
		builder
			.addCase(createBooking.fulfilled, (state, action) => {
				if (action.payload.booking) state.items.unshift(action.payload.booking);
			})
			.addCase(fetchMyBookings.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchMyBookings.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items = action.payload.items;
			})
			.addCase(fetchMyBookings.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || action.error;
            })
            .addCase(fetchOwnerBookings.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ownerItems = action.payload.items;
            })
            .addCase(fetchOwnerBookings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error;
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const updated = action.payload.booking;
                if (!updated) return;
                const i1 = state.items.findIndex((b) => b._id === updated._id);
                if (i1 >= 0) state.items[i1] = updated;
                const i2 = state.ownerItems.findIndex((b) => b._id === updated._id);
                if (i2 >= 0) state.ownerItems[i2] = updated;
            });
	},
});

export default bookingsSlice.reducer;


