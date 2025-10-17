import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout, selectAuth } from '../features/auth/slice.js';
import { AiOutlineHeart } from 'react-icons/ai';
import Sidebar from './Sidebar.jsx';
import { setFilters } from '../features/pgs/slice.js';
import { fetchPgs } from '../features/pgs/slice.js';

export default function Navbar() {
  const { user } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const onSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ q: query, page: 1 }));
    dispatch(fetchPgs());
    navigate('/');
  };
  
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : null;

  return (
    <nav className="sticky top-0 z-50 bg-white p-3 border-b">
      <div className="w-full max-w-[1200px] mx-auto flex items-center gap-3">
        <Link to="/" className="text-lg font-semibold">PG-Hub</Link>
        <div className="flex-1 flex justify-center">
        {!isAuthRoute && (
          <form onSubmit={onSearch} className="flex gap-2 w-full max-w-[520px]" role="search" aria-label="Search PGs">
            <input
              aria-label="Search"
              placeholder="Search city, college, or location"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              className="flex-1 h-9 px-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
            <button type="submit" className="h-9 px-3 rounded-md border bg-gray-900 text-white hover:bg-gray-800">Search</button>
          </form>
        )}
        </div>
        <div className="ml-auto flex items-center gap-3">
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <Link to="/favorites" aria-label="Favorites" title="Favorites" className="inline-flex items-center text-gray-700 hover:text-gray-900">
              <AiOutlineHeart size={20} />
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
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </nav>
  );
}


