import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout, selectAuth } from '../features/auth/slice.js';
import { AiOutlineHeart, AiOutlineCalendar } from 'react-icons/ai';
import { setFilters } from '../features/pgs/slice.js';
import { fetchPgs } from '../features/pgs/slice.js';

export default function Navbar() {
  const { user } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

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

  return (
    <nav className="sticky top-0 z-50 bg-white flex items-center gap-3 p-3 border-b">
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
            <Link to="/bookingSummary" aria-label="Bookings Summary" title="Bookings Summary" className="inline-flex items-center text-gray-700 hover:text-gray-900">
              <AiOutlineCalendar size={20} />
            </Link>
            <span className="text-sm text-gray-700">Hi, {user.name}</span>
            <button onClick={onLogout} className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}


