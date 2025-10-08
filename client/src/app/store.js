import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import listingsReducer from '../features/listings/listingsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';
import inquiriesReducer from '../features/inquiries/inquiriesSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import filtersReducer from '../features/filters/filtersSlice';

// Add your slice reducers here as you create them, e.g.:
// import authReducer from '../features/auth/authSlice';
// import listingsReducer from '../features/listings/listingsSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		listings: listingsReducer,
		favorites: favoritesReducer,
		bookings: bookingsReducer,
		inquiries: inquiriesReducer,
		reviews: reviewsReducer,
		filters: filtersReducer,
	},
});

// Optional: Type-safe hooks are skipped since we use plain JS.
// In components, wrap your app with <Provider store={store}> in main.jsx.

export default store;


