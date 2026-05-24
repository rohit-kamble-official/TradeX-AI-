import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('tradex_theme') || 'dark';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: saved, sidebarOpen: true, selectedView: 'dashboard' },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('tradex_theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme(state, { payload }) {
      state.theme = payload;
      localStorage.setItem('tradex_theme', payload);
      document.documentElement.setAttribute('data-theme', payload);
    },
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setView(state, { payload }) { state.selectedView = payload; },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setView } = uiSlice.actions;
export default uiSlice.reducer;
