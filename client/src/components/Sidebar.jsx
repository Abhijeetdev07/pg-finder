import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../features/auth/slice.js';
import { AiOutlineClose, AiOutlineHeart, AiOutlineCalendar } from 'react-icons/ai';

export default function Sidebar({ open, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : '?';

  return (
    <>
      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Panel */}
      <aside
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-[320px] bg-white z-50 border-l shadow-xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        <div className="p-4 flex items-center gap-3 border-b">
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white grid place-items-center font-semibold">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate">
              {user?.name || 'User'}
            </div>
            <div className="text-sm text-gray-600 truncate">{user?.email || ''}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="ml-auto p-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        <nav className="p-3 grid gap-2">
          <Link to="/favorites" className="px-3 py-2 rounded hover:bg-gray-50 inline-flex items-center gap-2" onClick={onClose}>
            <AiOutlineHeart className="text-gray-700" />
            <span>My Favorites</span>
          </Link>
          <Link to="/bookingSummary" className="px-3 py-2 rounded hover:bg-gray-50 inline-flex items-center gap-2" onClick={onClose}>
            <AiOutlineCalendar className="text-gray-700" />
            <span>My Bookings</span>
          </Link>
        </nav>

        <div className="mt-auto p-3 flex justify-end">
          <button
            onClick={() => { dispatch(logout()); onClose(); }}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm w-max mb-4 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}


