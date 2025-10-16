import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

const initialState = {
  filters: {
    city: '',
    college: '',
    minPrice: '',
    maxPrice: '',
    amenities: [],
    gender: 'any',
    q: '',
    page: 1,
    limit: 12,
    sort: '-createdAt',
  },
  results: [],
  meta: { total: 0, page: 1, limit: 12 },
  status: 'idle',
  error: null,
};

export const fetchPgs = createAsyncThunk('pgs/fetchPgs', async (_payload, thunkApi) => {
  try {
    const { filters } = thunkApi.getState().pgs;
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return;
      if (Array.isArray(value) && value.length === 0) return;
      if (Array.isArray(value)) {
        if (key === 'amenities') params.append(key, value.join(','));
        else value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    });
    const { data } = await api.get(`/api/pgs?${params.toString()}`);
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load');
  }
});

const slice = createSlice({
  name: 'pgs',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPgs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPgs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload.data || [];
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(fetchPgs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load';
      });
  },
});

export const { setFilters, resetFilters, setPage } = slice.actions;
export default slice.reducer;


