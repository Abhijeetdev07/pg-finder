import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';

// Placeholder page components (replace with real ones later)
import Home from '../pages/Home.jsx';
// Search page removed; search is now on Home
import PgDetails from '../pages/PgDetails.jsx';
import Favorites from '../pages/Favorites.jsx';
const Booking = () => <div>Booking</div>;
const Inquiry = () => <div>Inquiry</div>;
import BookingSummary from '../pages/BookingSummary.jsx';

export default function AppRouter() {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/pg/:id" element={<PgDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/summary"
          element={
            <ProtectedRoute>
              <BookingSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookingSummary"
          element={
            <ProtectedRoute>
              <BookingSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inquiry/:id"
          element={
            <ProtectedRoute>
              <Inquiry />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}


