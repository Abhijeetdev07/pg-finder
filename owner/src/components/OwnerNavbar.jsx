import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authOwner/slice.js';
import { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';

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
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="w-full max-w-[1270px] mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-semi-bold">Dashboard</Link>
        <div className="relative">
          <button onClick={()=>setOpen((v)=>!v)} className="w-9 h-9 grid place-items-center rounded-full border bg-white">
            <AiOutlineUser />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <Link onClick={()=>setOpen(false)} to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50">Profile</Link>
              <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


