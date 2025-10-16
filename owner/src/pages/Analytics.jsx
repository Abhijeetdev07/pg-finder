import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAnalytics } from '../features/analytics/slice.js';

export default function Analytics() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((s) => s.analytics);

  useEffect(() => { dispatch(fetchAnalytics()); }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">Analytics</h1>
            <button onClick={()=>dispatch(fetchAnalytics())} className="px-3 py-1 border rounded">Refresh</button>
          </div>
          {status==='loading' && <div className="border rounded bg-white p-3 text-sm">Loading…</div>}
          {error && <div className="border rounded bg-white p-3 text-sm text-red-600">{error}</div>}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border rounded p-3 bg-white"><div className="text-sm text-gray-600">Total Listings</div><div className="text-2xl font-semibold">{data.totalListings}</div></div>
              <div className="border rounded p-3 bg-white"><div className="text-sm text-gray-600">Total Inquiries</div><div className="text-2xl font-semibold">{data.totalInquiries}</div></div>
              <div className="border rounded p-3 bg-white"><div className="text-sm text-gray-600">Total Bookings</div><div className="text-2xl font-semibold">{data.totalBookings}</div></div>
              <div className="border rounded p-3 bg-white"><div className="text-sm text-gray-600">Avg Rating</div><div className="text-2xl font-semibold">{(data.avgRating||0).toFixed(2)}</div></div>
              <div className="border rounded p-3 bg-white"><div className="text-sm text-gray-600">Rating Count</div><div className="text-2xl font-semibold">{data.ratingCount}</div></div>
              <div className="border rounded p-3 bg-white"><div className="text-sm text-gray-600">Approved Bookings</div><div className="text-2xl font-semibold">{data.approvedBookings}</div></div>
              <div className="border rounded p-3 bg-white md:col-span-3"><div className="text-sm text-gray-600">Revenue Approx</div><div className="text-2xl font-semibold">₹{data.revenueApprox}</div></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

