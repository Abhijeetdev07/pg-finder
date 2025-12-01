import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { logout, selectAuth } from '../features/auth/slice.js';
import { setFilters } from '../features/pgs/slice.js';
import { AiOutlineHeart, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import Sidebar from './Sidebar.jsx';
import navlogo from '../assets/navlogo.png';

export default function Navbar() {
  const { user, isInitializing } = useSelector(selectAuth);
  const favorites = useSelector((s) => s.favorites.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : null;

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(setFilters({ search: query.trim() }));
      setShowSearchResults(true);
    } else {
      dispatch(setFilters({ search: '' }));
      setShowSearchResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    dispatch(setFilters({ search: '' }));
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border flex items-center justify-center">
        <div className="w-full max-w-[1300px] flex items-center justify-between gap-3 p-3">
          <Link to="/" className="w-[110px] h-[40px] flex items-center justify-center"><img className='w-full h-full' src={navlogo} alt="navlogo" /></Link>
          
          {/* Search Bar - Hidden on auth pages */}
          {!isAuthRoute && (
            <div className="flex-1 max-w-md" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search PG"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <AiOutlineClose size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className=" flex items-center">
            {isInitializing ? (
              // Loading skeleton
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : !user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="border px-2 py-1 rounded bg-black/90 text-white hover:bg-black/100 ml-5">Register</Link>
              </>
            ) : (
              <>
                <Link to="/favorites" aria-label="Favorites" title="Favorites" className="relative inline-flex items-center text-gray-700 hover:text-gray-900 mr-8">
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


