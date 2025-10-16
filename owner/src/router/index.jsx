import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Listings from '../pages/Listings.jsx';
import PgForm from '../pages/PgForm.jsx';
import Inquiries from '../pages/Inquiries.jsx';
import Bookings from '../pages/Bookings.jsx';
import Analytics from '../pages/Analytics.jsx';
import Profile from '../pages/Profile.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
      <Route path="/listings/new" element={<ProtectedRoute><PgForm /></ProtectedRoute>} />
      <Route path="/listings/:id/edit" element={<ProtectedRoute><PgForm /></ProtectedRoute>} />
      <Route path="/inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

