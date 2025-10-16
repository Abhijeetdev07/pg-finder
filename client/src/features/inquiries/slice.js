import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

export const createInquiry = createAsyncThunk('inquiries/create', async ({ pgId, message }, thunkApi) => {
  try {
    const { data } = await api.post('/api/inquiries', { pgId, message });
    return data.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to send inquiry');
  }
});

const slice = createSlice({
  name: 'inquiries',
  initialState: { status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInquiry.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createInquiry.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default slice.reducer;


