import api from './axiosInstance';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  logout: async (refreshToken: string) => {
    const response = await api.post('/auth/logout/', { refresh: refreshToken });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile/', data);
    return response.data;
  },
  changePassword: async (data: any) => {
    const response = await api.post('/auth/change-password/', data);
    return response.data;
  },
  requestPasswordReset: async (email: string) => {
    const response = await api.post('/auth/password-reset/', { email });
    return response.data;
  },
  confirmPasswordReset: async (data: any) => {
    const response = await api.post('/auth/password-reset-confirm/', data);
    return response.data;
  }
};
