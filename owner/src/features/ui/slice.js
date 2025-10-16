import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: { toast: null },
  reducers: {
    showToast(state, action) {
      state.toast = action.payload; // { type, message }
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const { showToast, clearToast } = slice.actions;
export default slice.reducer;

