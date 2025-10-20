import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout, selectAuth } from '../features/auth/slice.js';
import { AiOutlineHeart } from 'react-icons/ai';
import Sidebar from './Sidebar.jsx';

export default function Navbar() {
  const { user, isInitializing } = useSelector(selectAuth);
  const favorites = useSelector((s) => s.favorites.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : null;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border">
        <div className="w-full max-w-[1300px] mx-auto flex items-center gap-3 p-3">
          <Link to="/" className="text-lg font-semibold">PG-Hub</Link>
          
          <div className="ml-auto flex items-center gap-3">
            {isInitializing ? (
              // Loading skeleton
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : !user ? (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            ) : (
              <>
                <Link to="/favorites" aria-label="Favorites" title="Favorites" className="relative inline-flex items-center text-gray-700 hover:text-gray-900 mx-2">
                  <AiOutlineHeart size={28} />
                  {favorites.length > 0 && (
                    <>
                      <span
                        className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 flex items-center justify-center font-medium ${
                          favorites.length > 10 ? "w-6 -right-3" : "w-4"
                        }`}
                      >
                        {favorites.length > 10 ? '10+' : favorites.length}
                      </span>
                      {/* animated splash/ping behind the badge */}
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500/60 animate-ping" />
                    </>
                  )}
                </Link>
                {initial && (
                  <button
                    aria-label="Open profile sidebar"
                    onClick={() => setSidebarOpen(true)}
                    className="w-8 h-8 rounded-full bg-gray-900 text-white grid place-items-center text-sm font-semibold cursor-pointer"
                  >
                    {initial}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
      
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}


