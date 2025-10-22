import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Listings from '../pages/Listings.jsx';
import PgForm from '../pages/PgForm.jsx';
import Inquiries from '../pages/Inquiries.jsx';
import Bookings from '../pages/Bookings.jsx';
import Analytics from '../pages/Analytics.jsx';
import Ratings from '../pages/Ratings.jsx';
import Profile from '../pages/Profile.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/analytics" replace />} />
      <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
      <Route path="/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
      <Route path="/listings/new" element={<ProtectedRoute><PgForm /></ProtectedRoute>} />
      <Route path="/listings/:id/edit" element={<ProtectedRoute><PgForm /></ProtectedRoute>} />
      <Route path="/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="/ratings" element={<ProtectedRoute><Ratings /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

