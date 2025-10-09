import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { logout } from '../features/auth/authSlice.js'
import { FiChevronDown, FiUser, FiHeart, FiCalendar, FiMessageSquare, FiLogOut } from 'react-icons/fi'

export default function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useSelector((s) => s.auth.user)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Check if we're on an auth page
    const isAuthPage = location.pathname === '/auth'

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close dropdown when navigating away
    useEffect(() => {
        setDropdownOpen(false)
    }, [location.pathname])

    async function onLogout() {
        try {
            const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
            await fetch(`${base}/api/auth/logout`, { method: 'POST', credentials: 'include' })
        } catch {}
        dispatch(logout())
        navigate('/auth')
    }

    const handleDropdownItemClick = (path) => {
        navigate(path)
        setDropdownOpen(false)
    }

    // Don't render navbar on auth page or for non-logged-in users
    if (isAuthPage || !user) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
            <div className="w-full px-4 flex items-center justify-between min-h-14 py-2">
                {/* Logo */}
                <Link to="/" className="font-semibold text-lg text-black hover:text-gray-700 flex-shrink-0 mr-4">
                    PG Finder
                </Link>
                
                {/* Search Form */}
                <form
                    onSubmit={(e) => { 
                        e.preventDefault(); 
                        const q = new FormData(e.currentTarget).get('q')?.toString().trim(); 
                        const url = new URL(window.location.href); 
                        if (q) { 
                            url.searchParams.set('q', q) 
                        } else { 
                            url.searchParams.delete('q') 
                        } 
                        window.location.assign(url.toString()) 
                    }}
                    className="flex items-center gap-2 flex-1 max-w-2xl"
                >
                    <input 
                        name="q" 
                        type="text" 
                        placeholder="Search PGs..." 
                        className="border rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <button 
                        type="submit" 
                        className="px-3 py-2 rounded bg-black text-white text-sm whitespace-nowrap hover:bg-gray-800 transition-colors flex-shrink-0"
                    >
                        Search
                    </button>
                </form>
                
                {/* User Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm text-gray-700 hidden md:block max-w-20 truncate">
                                {user.name}
                            </span>
                            <FiChevronDown className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} size={16} />
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                
                                {user.role === 'student' && (
                                    <>
                                        <button
                                            onClick={() => handleDropdownItemClick('/favorites')}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <FiHeart size={16} className="flex-shrink-0" />
                                            <span className="truncate">My Favorites</span>
                                        </button>
                                        <button
                                            onClick={() => handleDropdownItemClick('/me/bookings')}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <FiCalendar size={16} className="flex-shrink-0" />
                                            <span className="truncate">My Bookings</span>
                                        </button>
                                        <button
                                            onClick={() => handleDropdownItemClick('/me/inquiries')}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <FiMessageSquare size={16} className="flex-shrink-0" />
                                            <span className="truncate">My Inquiries</span>
                                        </button>
                                    </>
                                )}
                                
                                {user.role === 'owner' && (
                                    <>
                                        <button
                                            onClick={() => handleDropdownItemClick('/owner')}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <FiUser size={16} className="flex-shrink-0" />
                                            <span className="truncate">Owner Dashboard</span>
                                        </button>
                                        <button
                                            onClick={() => handleDropdownItemClick('/owner/listings')}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <FiCalendar size={16} className="flex-shrink-0" />
                                            <span className="truncate">My Listings</span>
                                        </button>
                                    </>
                                )}
                                
                                <div className="border-t my-1"></div>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <FiLogOut size={16} className="flex-shrink-0" />
                                    <span className="truncate">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}


