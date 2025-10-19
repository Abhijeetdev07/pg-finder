import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

const TOKEN_KEY = 'owner_token';

export const register = createAsyncThunk('authOwner/register', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/api/auth/register', { ...payload, role: 'owner' });
    if (data?.user?.role !== 'owner') {
      return thunkApi.rejectWithValue('Owner account required');
    }
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('authOwner/login', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/api/auth/login', payload);
    if (data?.user?.role !== 'owner') {
      return thunkApi.rejectWithValue('Owner account required');
    }
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Login failed');
  }
});

export const getMe = createAsyncThunk('authOwner/getMe', async (_p, thunkApi) => {
  const { data } = await api.get('/api/auth/me');
  const user = data.user;
  if (!user || user.role !== 'owner') {
    const { showToast } = await import('../ui/slice.js');
    thunkApi.dispatch(showToast({ type: 'error', message: 'Owner account required' }));
    return thunkApi.rejectWithValue('Owner account required');
  }
  return user;
});

const initialState = { user: null, token: null, status: 'idle', error: null };

const slice = createSlice({
  name: 'authOwner',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      if (state.token) localStorage.setItem(TOKEN_KEY, state.token);
    },
    setUser(state, action) {
      state.user = { ...(state.user || {}), ...(action.payload || {}) };
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(TOKEN_KEY, state.token);
      })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(TOKEN_KEY, state.token);
      })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(getMe.fulfilled, (state, action) => { state.user = action.payload; state.status = 'succeeded'; })
      .addCase(getMe.rejected, (state, action) => {
        // Clear token if role mismatch or error
        state.user = null;
        state.token = null;
        state.status = 'failed';
        state.error = action.payload;
        localStorage.removeItem(TOKEN_KEY);
      })
  }
});

export const { setToken, setUser, logout } = slice.actions;
export const getStoredOwnerToken = () => localStorage.getItem(TOKEN_KEY);
export default slice.reducer;

