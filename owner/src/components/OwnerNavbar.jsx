import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authOwner/slice.js';
import { useState } from 'react';

export default function OwnerNavbar() {
  const user = useSelector((s) => s.authOwner.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
      <Link to="/dashboard" className="text-lg font-semibold">PG-Hub Owner</Link>
      <div className="relative">
        <button onClick={()=>setOpen((v)=>!v)} className="px-3 py-1 border rounded-md text-sm">
          {user?.name ? `Hi, ${user.name}` : 'Account'}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
            <Link onClick={()=>setOpen(false)} to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50">Profile</Link>
            <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}


