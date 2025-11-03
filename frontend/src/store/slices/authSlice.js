import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  moduleConfig: JSON.parse(localStorage.getItem('moduleConfig')) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.moduleConfig = action.payload.moduleConfig;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('moduleConfig', JSON.stringify(action.payload.moduleConfig));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.moduleConfig = null;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('moduleConfig');
    },
    updateModuleConfig: (state, action) => {
      state.moduleConfig = action.payload;
      localStorage.setItem('moduleConfig', JSON.stringify(action.payload));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateModuleConfig,
  clearError,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectModuleConfig = (state) => state.auth.moduleConfig;
export const selectUserType = (state) => state.auth.user?.userType;
export const selectUserRoles = (state) => state.auth.user?.roles?.split(',') || [];

// Helper function to check if user has specific role
export const selectHasRole = (roleName) => (state) => {
  const roles = state.auth.user?.roles?.split(',') || [];
  return roles.some(role => role.includes(roleName));
};

export default authSlice.reducer;
