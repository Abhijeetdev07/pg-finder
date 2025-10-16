import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

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

