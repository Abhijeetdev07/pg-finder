import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  toast: null,
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    showToast(state, action) {
      state.toast = action.payload; // { type, message }
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const { setTheme, showToast, clearToast } = slice.actions;
export default slice.reducer;


