import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/slice.js';
import pgsReducer from '../features/pgs/slice.js';
import favoritesReducer from '../features/favorites/slice.js';
import bookingsReducer from '../features/bookings/slice.js';
import reviewsReducer from '../features/reviews/slice.js';
import uiReducer from '../features/ui/slice.js';
import inquiriesReducer from '../features/inquiries/slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pgs: pgsReducer,
    favorites: favoritesReducer,
    bookings: bookingsReducer,
    reviews: reviewsReducer,
    ui: uiReducer,
    inquiries: inquiriesReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;


