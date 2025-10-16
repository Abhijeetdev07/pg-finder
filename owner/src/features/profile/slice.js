import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

export const fetchProfile = createAsyncThunk('profile/fetch', async (_p, thunkApi) => {
  try {
    const { data } = await api.get('/api/auth/me');
    return data.user;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load profile');
  }
});

export const updateProfile = createAsyncThunk('profile/update', async (updates, thunkApi) => {
  try {
    const { data } = await api.put('/api/users/me', updates);
    return data.data; // updated user
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to update profile');
  }
});

const slice = createSlice({
  name: 'profile',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
      .addCase(fetchProfile.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export default slice.reducer;

