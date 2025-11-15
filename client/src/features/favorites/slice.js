import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

export const listFavorites = createAsyncThunk('favorites/list', async (_p, thunkApi) => {
  try {
    const { data } = await api.get('/api/users/favorites');
    return data.data || [];
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to load favorites');
  }
});  

export const addFavorite = createAsyncThunk('favorites/add', async (pgId, thunkApi) => {
  try {
    await api.post(`/api/users/favorites/${pgId}`);
    return pgId;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to add');
  }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (pgId, thunkApi) => {
  try {
    await api.delete(`/api/users/favorites/${pgId}`);
    return pgId;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Failed to remove');
  }
});

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const slice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.items = action.payload;
    },
    clearFavorites(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(listFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(listFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        // Optimistic merge if not already included
        const id = action.payload;
        if (!state.items.some((pg) => pg._id === id)) {
          state.items = state.items.concat({ _id: id });
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((pg) => pg._id !== id);
      });
  },
});

export const { setFavorites, clearFavorites } = slice.actions;
export default slice.reducer;


