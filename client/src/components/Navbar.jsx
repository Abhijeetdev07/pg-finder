import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout, selectAuth } from '../features/auth/slice.js';
import { AiOutlineHeart, AiOutlineSearch } from 'react-icons/ai';
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
    // Don't auto-close mobile search - let user keep it open for multiple searches
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };
  
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="w-full max-w-[1300px] mx-auto flex items-center gap-3 p-2">
          <Link to="/" className="text-lg font-semibold">PG-Hub</Link>
          
          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center">
            {!isAuthRoute && (
              <form onSubmit={onSearch} className="flex gap-2 w-full max-w-[520px]" role="search" aria-label="Search PGs">
                <input
                  aria-label="Search"
                  placeholder="Search city, college, or location"
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                  className="flex-1 h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button type="submit" className="h-9 px-3 rounded-md border bg-gray-900 text-white hover:bg-gray-800">Search</button>
              </form>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Mobile Search Icon */}
            {!isAuthRoute && (
              <button
                onClick={toggleMobileSearch}
                className="md:hidden p-2 text-gray-700 hover:text-gray-900"
                aria-label="Open search"
              >
                <AiOutlineSearch size={20} />
              </button>
            )}

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
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && !isAuthRoute && (
          <div className="md:hidden border-t bg-white p-3">
            <form onSubmit={onSearch} className="flex gap-2" role="search" aria-label="Search PGs">
              <input
                aria-label="Search"
                placeholder="Search city, college, or location"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                className="flex-1 h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                autoFocus
              />
              <button type="submit" className="h-9 px-3 rounded-md border bg-gray-900 text-white hover:bg-gray-800">Search</button>
            </form>
          </div>
        )}
      </nav>
      
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}


