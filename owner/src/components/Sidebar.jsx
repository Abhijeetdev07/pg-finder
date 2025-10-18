import { NavLink } from 'react-router-dom';
import { 
  AiOutlineHome, 
  AiOutlineMessage, 
  AiOutlineCalendar, 
  AiOutlineBarChart, 
  AiOutlineUser 
} from 'react-icons/ai';

export default function Sidebar() {
  const link = 'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100';
  const active = 'bg-gray-100 font-medium';
  return (
    <aside className="w-56 max-[764px]:w-16 border-r border-black h-screen p-3">
      <nav className="grid gap-1 text-sm">
        <NavLink to="/analytics" className={({isActive})=>`${link} ${isActive?active:''}`}>
          <AiOutlineBarChart size={18} />
          <span className="max-[764px]:hidden">Analytics</span>
        </NavLink>
        <NavLink to="/listings" className={({isActive})=>`${link} ${isActive?active:''}`}>
          <AiOutlineHome size={18} />
          <span className="max-[764px]:hidden">Listings</span>
        </NavLink>
        <NavLink to="/inquiries" className={({isActive})=>`${link} ${isActive?active:''}`}>
          <AiOutlineMessage size={18} />
          <span className="max-[764px]:hidden">Inquiries</span>
        </NavLink>
        <NavLink to="/bookings" className={({isActive})=>`${link} ${isActive?active:''}`}>
          <AiOutlineCalendar size={18} />
          <span className="max-[764px]:hidden">Bookings</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive})=>`${link} ${isActive?active:''}`}>
          <AiOutlineUser size={18} />
          <span className="max-[764px]:hidden">Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}


