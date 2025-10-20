import axios from 'axios';

const resolvedBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
if (!import.meta.env.VITE_API_URL) {
  // eslint-disable-next-line no-console
  console.warn('[OWNER API] VITE_API_URL not set; defaulting to', resolvedBaseUrl);
}

const api = axios.create({ baseURL: resolvedBaseUrl, withCredentials: false });

function getToken() {
  try { return localStorage.getItem('owner_token'); } catch { return null; }
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try { localStorage.removeItem('owner_token'); } catch {}
      if (typeof window !== 'undefined') window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export default api;

