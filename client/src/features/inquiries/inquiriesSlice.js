import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const createInquiry = createAsyncThunk('inquiries/create', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/api/inquiries', payload);
        return data; // { inquiry }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to create inquiry' });
    }
});

export const fetchOwnerInquiries = createAsyncThunk('inquiries/fetchOwner', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/api/inquiries/owner');
        return data; // { items }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to fetch owner inquiries' });
    }
});

export const updateInquiryStatus = createAsyncThunk('inquiries/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await api.patch(`/api/inquiries/${id}`, { status });
        return data; // { inquiry }
    } catch (err) {
        return rejectWithValue(err?.response?.data || { message: 'Failed to update inquiry status' });
    }
});

const initialState = {
    myInquiries: [],
    ownerInquiries: [],
    status: 'idle',
    error: null,
};

const inquiriesSlice = createSlice({
	name: 'inquiries',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
            .addCase(createInquiry.fulfilled, (state, action) => {
                if (action.payload.inquiry) state.myInquiries.unshift(action.payload.inquiry);
            })
            .addCase(fetchOwnerInquiries.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchOwnerInquiries.fulfilled, (state, action) => {
				state.status = 'succeeded';
                state.ownerInquiries = action.payload.items;
			})
			.addCase(fetchOwnerInquiries.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || action.error;
            })
            .addCase(updateInquiryStatus.fulfilled, (state, action) => {
                const updated = action.payload.inquiry;
                if (!updated) return;
                const i1 = state.ownerInquiries.findIndex((q) => q._id === updated._id);
                if (i1 >= 0) state.ownerInquiries[i1] = updated;
                const i2 = state.myInquiries.findIndex((q) => q._id === updated._id);
                if (i2 >= 0) state.myInquiries[i2] = updated;
            });
	},
});

export default inquiriesSlice.reducer;


