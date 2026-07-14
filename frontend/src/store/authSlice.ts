import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  username: string;
  email: string;
  date_joined?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: localStorage.getItem('access'),
  refreshToken: localStorage.getItem('refresh'),
};

if (initialState.accessToken) {
  try {
    const decoded: any = jwtDecode(initialState.accessToken);
    if (decoded.exp * 1000 > Date.now()) {
      initialState.isAuthenticated = true;
      initialState.user = { id: decoded.user_id, username: '', email: '' }; // Will be populated by profile fetch
    } else {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      initialState.accessToken = null;
      initialState.refreshToken = null;
    }
  } catch (e) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    initialState.accessToken = null;
    initialState.refreshToken = null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ access: string; refresh: string }>) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      localStorage.setItem('access', action.payload.access);
      localStorage.setItem('refresh', action.payload.refresh);
      const decoded: any = jwtDecode(action.payload.access);
      state.user = { id: decoded.user_id, username: '', email: '' };
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    },
    updateTokens: (state, action: PayloadAction<{ access: string; refresh: string }>) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      localStorage.setItem('access', action.payload.access);
      localStorage.setItem('refresh', action.payload.refresh);
    },
    setUserProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logoutSuccess, updateTokens, setUserProfile } = authSlice.actions;
export default authSlice.reducer;
