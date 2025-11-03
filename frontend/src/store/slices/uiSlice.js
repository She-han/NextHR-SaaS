import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  success: null,
  notifications: [],
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
      state.loading = false;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  clearMessages,
  addNotification,
  removeNotification,
  toggleSidebar,
} = uiSlice.actions;

export const selectLoading = (state) => state.ui.loading;
export const selectError = (state) => state.ui.error;
export const selectSuccess = (state) => state.ui.success;
export const selectNotifications = (state) => state.ui.notifications;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;

export default uiSlice.reducer;
