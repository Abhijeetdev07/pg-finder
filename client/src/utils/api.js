import axios from 'axios';
// Note: import action creators lazily where used to avoid circular deps
// Force refresh to resolve HMR caching issues

let getAuthState = null;
export function setAuthGetter(fn) {
	getAuthState = fn;
}

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = getAuthState?.()?.accessToken;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
	return config;
});

let isRefreshing = false;
let queued = [];

function queueRequest(cb) { queued.push(cb); }
function flushQueue(token) { queued.forEach((cb) => cb(token)); queued = []; }

api.interceptors.response.use(
	(res) => res,
    async (error) => {
        const original = error.config;
        // Do not try to refresh if the failing call is the refresh endpoint itself
        const isRefreshCall = typeof original?.url === 'string' && original.url.includes('/api/auth/refresh');
        if (error.response?.status === 401 && !original._retry && !isRefreshCall) {
			original._retry = true;
			try {
				if (!isRefreshing) {
					isRefreshing = true;
					const { data } = await api.post('/api/auth/refresh');
					const current = getAuthState?.() || {};
					// Lazy import to avoid circular deps during module init
                    const { store } = await import('../app/store.js');
                    const { setCredentials } = await import('../features/auth/authSlice.js');
                    store.dispatch(setCredentials({ user: current.user, accessToken: data.accessToken }));
					isRefreshing = false;
					flushQueue(data.accessToken);
				}
				return new Promise((resolve) => {
					queueRequest((token) => {
						original.headers.Authorization = `Bearer ${token}`;
						resolve(api(original));
					});
				});
            } catch (refreshError) {
				isRefreshing = false;
                // Clear auth state and redirect to login on refresh failure
                const { store } = await import('../app/store.js');
                const { logout } = await import('../features/auth/authSlice.js');
                store.dispatch(logout());
                
                // Only redirect if not already on auth page
                if (!window.location.pathname.includes('/auth')) {
                    window.location.href = '/auth';
                }
                
				return Promise.reject(error);
			}
		}
        return Promise.reject(error);
	}
);
