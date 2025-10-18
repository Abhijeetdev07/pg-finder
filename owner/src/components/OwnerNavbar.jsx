import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authOwner/slice.js';

export default function OwnerNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="w-full max-w-[1270px] mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/analytics" className="text-lg font-semibold">Dashboard</Link>
        <button 
          onClick={onLogout} 
          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}


