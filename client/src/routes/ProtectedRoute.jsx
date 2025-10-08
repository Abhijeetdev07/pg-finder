import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ redirectTo = '/auth', allowedRoles }) {
    const { user, initialized, status } = useSelector((s) => s.auth);
    // Wait for auth bootstrap to finish to avoid redirect flicker on refresh
    if (!initialized && (status === 'loading' || status === 'idle')) {
        return <div className="p-4 text-sm text-gray-600">Loading...</div>;
    }
    if (!user) return <Navigate to={redirectTo} replace />;
	if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={redirectTo} replace />;
	return <Outlet />;
}


