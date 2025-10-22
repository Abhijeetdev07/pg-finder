import { NavLink } from 'react-router-dom';
import { 
  AiOutlineHome, 
  AiOutlineMessage, 
  AiOutlineCalendar, 
  AiOutlineBarChart, 
  AiOutlineUser,
  AiOutlineStar
} from 'react-icons/ai';

export default function Sidebar() {
  const link = 'flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out';
  const active = 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md hover:from-blue-600 hover:to-blue-700';
  return (
    <aside className="w-48 max-[764px]:w-16 border-r border-gray-200 p-3">
      <nav className="grid gap-2 text-sm">
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
        <NavLink to="/ratings" className={({isActive})=>`${link} ${isActive?active:''}`}>
          <AiOutlineStar size={18} />
          <span className="max-[764px]:hidden">Ratings</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive})=>`${link} ${isActive?active:''}`}>
          <AiOutlineUser size={18} />
          <span className="max-[764px]:hidden">Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}


