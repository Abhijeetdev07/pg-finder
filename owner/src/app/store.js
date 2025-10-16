import { configureStore } from '@reduxjs/toolkit';
import authOwnerReducer from '../features/authOwner/slice.js';
import listingsReducer from '../features/listings/slice.js';
import inquiriesReducer from '../features/inquiries/slice.js';
import bookingsReducer from '../features/bookings/slice.js';
import analyticsReducer from '../features/analytics/slice.js';
import profileReducer from '../features/profile/slice.js';
import uiReducer from '../features/ui/slice.js';

export const store = configureStore({
  reducer: {
    authOwner: authOwnerReducer,
    listings: listingsReducer,
    inquiries: inquiriesReducer,
    bookings: bookingsReducer,
    analytics: analyticsReducer,
    profile: profileReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;

