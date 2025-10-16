import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';
import { showToast } from '../ui/slice.js';

export const fetchOwnerListings = createAsyncThunk('listings/fetchOwner', async (filters = {}, thunkApi) => {
  try {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.page) params.append('page', String(filters.page));
    const { data } = await api.get(`/api/pgs?${params.toString()}`);
    let items = data.data || [];
    if (filters.ownerId) {
      items = items.filter((it) => {
        const v = it.ownerId;
        return v === filters.ownerId || (v && v._id === filters.ownerId) || (typeof v === 'object' && String(v) === filters.ownerId);
      });
    }
    return { items, meta: data.meta };
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load listings');
  }
});

export const getPgById = createAsyncThunk('listings/getById', async (id, thunkApi) => {
  try {
    const { data } = await api.get(`/api/pgs/${id}`);
    return data.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load listing');
  }
});

export const createPg = createAsyncThunk('listings/create', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/api/pgs', payload);
    thunkApi.dispatch(showToast({ type: 'success', message: 'Listing created successfully' }));
    return data.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to create listing');
  }
});

export const updatePg = createAsyncThunk('listings/update', async ({ id, updates }, thunkApi) => {
  try {
    const { data } = await api.put(`/api/pgs/${id}`, updates);
    // dispatch toast after success
    thunkApi.dispatch(showToast({ type: 'success', message: 'Listing updated successfully' }));
    return data.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to update listing');
  }
});

export const deletePg = createAsyncThunk('listings/delete', async (id, thunkApi) => {
  try {
    await api.delete(`/api/pgs/${id}`);
    return id;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to delete listing');
  }
});

const slice = createSlice({
  name: 'listings',
  initialState: { items: [], current: null, status: 'idle', error: null, meta: { total: 0, page: 1, limit: 12 } },
  reducers: {
    setListings(state, action) { state.items = action.payload; },
    clearCurrent(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerListings.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchOwnerListings.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload.items; state.meta = action.payload.meta || state.meta; })
      .addCase(fetchOwnerListings.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(getPgById.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(getPgById.fulfilled, (state, action) => { state.status = 'succeeded'; state.current = action.payload; })
      .addCase(getPgById.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(createPg.fulfilled, (state, action) => { state.items = [action.payload, ...state.items]; })
      .addCase(updatePg.fulfilled, (state, action) => {
        state.current = action.payload;
        state.items = state.items.map((it) => it._id === action.payload._id ? action.payload : it);
      })
      .addCase(deletePg.fulfilled, (state, action) => {
        state.items = state.items.filter((it) => it._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
      });
  },
});

export const { setListings, clearCurrent } = slice.actions;
export default slice.reducer;

