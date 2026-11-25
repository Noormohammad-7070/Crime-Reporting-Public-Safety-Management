import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ct_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadToken = !!localStorage.getItem('ct_token');
      localStorage.removeItem('ct_token');
      localStorage.removeItem('ct_user');
      // avoid hard redirect loops on login/register pages
      if (hadToken && !window.location.pathname.includes('/login')) {
        // let UI handle; optional redirect
      }
    }
    return Promise.reject(err);
  }
);

export const fileUrl = (p) => {
  if (!p) return '';
  if (p.startsWith('http')) return p;
  const base = import.meta.env.VITE_UPLOAD_BASE || 'http://localhost:5000';
  return `${base}${p}`;
};

export default api;
