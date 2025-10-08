import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

// Example async thunks (wire to API later)
export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
	try {
		const { data } = await api.post('/api/auth/register', payload);
		return data; // { user, accessToken }
	} catch (err) {
		return rejectWithValue(err?.response?.data || { message: 'Register failed' });
	}
});

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
	try {
		const { data } = await api.post('/api/auth/login', payload);
		return data; // { user, accessToken }
	} catch (err) {
		return rejectWithValue(err?.response?.data || { message: 'Login failed' });
	}
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
	try {
		await api.post('/api/auth/logout');
		return true;
	} catch (err) {
		return rejectWithValue(err?.response?.data || { message: 'Logout failed' });
	}
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.get('/api/auth/me');
		return data; // { user }
	} catch (err) {
		return rejectWithValue(err?.response?.data || { message: 'Fetch me failed' });
	}
});

export const refresh = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
	try {
		const { data } = await api.post('/api/auth/refresh');
		return data; // { accessToken }
	} catch (err) {
		return rejectWithValue(err?.response?.data || { message: 'Refresh failed' });
	}
});

const initialState = {
    user: null,
    accessToken: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    initialized: false, // becomes true after we complete bootstrap (fetchMe or failed)
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials(state, action) {
			state.user = action.payload.user || null;
			state.accessToken = action.payload.accessToken || null;
		},
		logout(state) {
			state.user = null;
			state.accessToken = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
			})
			.addCase(register.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || action.error;
			})
			.addCase(login.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
			})
			.addCase(login.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || action.error;
			})
			.addCase(logoutThunk.fulfilled, (state) => {
				state.user = null;
				state.accessToken = null;
			})
			.addCase(fetchMe.fulfilled, (state, action) => {
				state.user = action.payload.user;
                state.status = 'succeeded';
                state.initialized = true;
			})
            .addCase(fetchMe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error;
                state.initialized = true;
            })
			.addCase(refresh.fulfilled, (state, action) => {
				state.accessToken = action.payload.accessToken;
                state.status = 'succeeded';
            })
            .addCase(refresh.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(refresh.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error;
                state.initialized = true; // no refresh -> allow login screen
            });
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;


