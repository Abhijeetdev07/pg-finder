import axios from 'axios';
import { store } from '../app/store.js';
import { logout } from '../features/auth/slice.js';
import { showToast } from '../features/ui/slice.js';

const resolvedBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
if (!import.meta.env.VITE_API_URL) {
  // eslint-disable-next-line no-console
  console.warn('[API] VITE_API_URL not set; defaulting to', resolvedBaseUrl);
}

const api = axios.create({
  baseURL: resolvedBaseUrl,
  withCredentials: false,
});

// Attach Authorization header if token present
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401: clear auth state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || 'Request failed';
    if (status === 401) {
      store.dispatch(logout());
    } else if (status >= 400) {
      store.dispatch(showToast({ type: 'error', message }));
    }
    return Promise.reject(error);
  }
);

export default api;


