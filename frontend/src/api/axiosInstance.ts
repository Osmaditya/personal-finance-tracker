import axios from 'axios';
import { store } from '../store/store';
import { logoutSuccess, updateTokens } from '../store/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Get token from Redux state instead of localStorage directly to be consistent with state
    const token = store.getState().auth.accessToken || localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = store.getState().auth.refreshToken || localStorage.getItem('refresh');

      if (refresh) {
        try {
          // Use a new axios instance to avoid infinite loops if refresh also fails with 401
          const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/token/refresh/', {
            refresh,
          });

          const { access, refresh: newRefresh } = response.data;

          // Dispatch to redux to update tokens and localStorage
          store.dispatch(updateTokens({ access, refresh: newRefresh }));

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log out
          store.dispatch(logoutSuccess());
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available
        store.dispatch(logoutSuccess());
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
