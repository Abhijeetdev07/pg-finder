import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { refresh, fetchMe } from '../features/auth/authSlice.js';

export default function ProtectedRoute({ redirectTo = '/auth', allowedRoles }) {
    const dispatch = useDispatch();
    const { user, initialized, status } = useSelector((s) => s.auth);
    const [attempting, setAttempting] = useState(false);
    const triedRef = useRef(false);
    // All hooks must be declared before any conditional returns
    // If not logged in, attempt a last-chance silent refresh once before redirecting
    useEffect(() => {
        async function attempt() {
            if (!user && initialized && !triedRef.current) {
                triedRef.current = true;
                setAttempting(true);
                try {
                    await dispatch(refresh()).unwrap();
                    await dispatch(fetchMe()).unwrap();
                } catch {
                    // ignore
                } finally {
                    setAttempting(false);
                }
            }
        }
        attempt();
    }, [user, initialized, dispatch]);

    // Wait for auth bootstrap to finish to avoid redirect flicker on refresh
    if (!initialized && (status === 'loading' || status === 'idle')) {
        return <div className="p-4 text-sm text-gray-600">Loading...</div>;
    }
    // If we have no user yet but haven't started the last-chance refresh, hold here
    if (!user && initialized && !triedRef.current) {
        return <div className="p-4 text-sm text-gray-600">Signing you in…</div>;
    }
    if (!user) {
        if (attempting) {
            return <div className="p-4 text-sm text-gray-600">Signing you in…</div>;
        }
        return <Navigate to={redirectTo} replace />;
    }
    // Logged in but role not allowed -> send to home
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return <Outlet />;
}


