import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const link = 'block px-3 py-2 rounded hover:bg-gray-100';
  const active = 'bg-gray-100 font-medium';
  return (
    <aside className="w-56 border-r p-3 hidden md:block">
      <nav className="grid gap-1 text-sm">
        <NavLink to="/listings" className={({isActive})=>`${link} ${isActive?active:''}`}>Listings</NavLink>
        <NavLink to="/inquiries" className={({isActive})=>`${link} ${isActive?active:''}`}>Inquiries</NavLink>
        <NavLink to="/bookings" className={({isActive})=>`${link} ${isActive?active:''}`}>Bookings</NavLink>
        <NavLink to="/analytics" className={({isActive})=>`${link} ${isActive?active:''}`}>Analytics</NavLink>
        <NavLink to="/profile" className={({isActive})=>`${link} ${isActive?active:''}`}>Profile</NavLink>
      </nav>
    </aside>
  );
}


