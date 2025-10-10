import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function OwnerRoute({ redirectTo = '/auth' }) {
	const user = useSelector((s) => s.auth.user);
	if (!user) return <Navigate to={redirectTo} replace />;
	if (user.role !== 'owner') return <Navigate to="/" replace />;
	return <Outlet />;
}


