import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isNotificationDrawerOpen: boolean;
  isMobileSidebarOpen: boolean;
}

const initialState: UiState = {
  isNotificationDrawerOpen: false,
  isMobileSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNotificationDrawer: (state) => {
      state.isNotificationDrawerOpen = !state.isNotificationDrawerOpen;
    },
    setNotificationDrawerOpen: (state, action) => {
      state.isNotificationDrawerOpen = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action) => {
      state.isMobileSidebarOpen = action.payload;
    }
  },
});

export const { toggleNotificationDrawer, setNotificationDrawerOpen, toggleMobileSidebar, setMobileSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
