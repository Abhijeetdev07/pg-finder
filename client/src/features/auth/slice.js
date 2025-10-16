import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios.js';

const TOKEN_KEY = 'pg_hub_token';

export const login = createAsyncThunk('auth/login', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Registration failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_payload, thunkApi) => {
  try {
    const { data } = await api.get('/api/auth/me');
    return data.user;
  } catch (err) {
    return thunkApi.rejectWithValue(err?.response?.data?.message || 'Fetch user failed');
  }
});

const initialState = {
  user: null,
  token: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user || state.user;
      state.token = action.payload.token;
      if (state.token) localStorage.setItem(TOKEN_KEY, state.token);
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
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(TOKEN_KEY, state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(TOKEN_KEY, state.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      })
      .addCase(getMe.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Fetch user failed';
      });
  },
});

export const { setCredentials, logout } = slice.actions;
export const selectAuth = (s) => s.auth;
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export default slice.reducer;


