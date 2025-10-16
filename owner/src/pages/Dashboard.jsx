import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-xl font-semibold mb-3">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border rounded p-3 bg-white">Total Listings</div>
            <div className="border rounded p-3 bg-white">Total Inquiries</div>
            <div className="border rounded p-3 bg-white">Total Bookings</div>
          </div>
        </main>
      </div>
    </div>
  );
}

