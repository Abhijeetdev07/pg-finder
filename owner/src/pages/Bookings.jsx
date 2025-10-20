import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchOwnerBookings, updateBookingStatus } from '../features/bookings/slice.js';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function Bookings() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.bookings);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOwnerBookings());
    }
  }, [status, dispatch]);

  const isLoading = status === 'loading' && (!items || items.length === 0);
  
  return (
    <div className="h-screen bg-gray-50 pt-[52px]">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-xl font-semibold mb-3">Bookings</h1>
          {isLoading && <div className="p-3 text-sm">loading...</div>}
          {error && <div className="border rounded bg-white p-3 text-sm text-red-600">{error}</div>}
          {(!items || items.length===0) && status!=='loading' && (
            <div className="border rounded bg-white p-3 text-sm text-gray-600">No bookings yet.</div>
          )}
          {items && items.length>0 && (
            <div className="overflow-y-auto max-h-[82vh]">
              <table className="min-w-full text-sm bg-white border rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2">PG</th>
                    <th className="text-left px-3 py-2 max-[1000px]:hidden">User</th>
                    <th className="text-left px-3 py-2 max-[700px]:hidden">From</th>
                    <th className="text-left px-3 py-2 max-[700px]:hidden">To</th>
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b)=> (
                    <tr key={b._id} className="border-t">
                      <td className="px-3 py-2">{b.pgId?.title || b.pgId}</td>
                      <td className="px-3 py-2 max-[1000px]:hidden">{b.userId?.email || b.userId}</td>
                      <td className="px-3 py-2 max-[700px]:hidden">{b.dates?.from ? new Date(b.dates.from).toLocaleDateString() : '-'}</td>
                      <td className="px-3 py-2 max-[700px]:hidden">{b.dates?.to ? new Date(b.dates.to).toLocaleDateString() : '-'}</td>
                      <td className="px-3 py-2">
                        <span className={
                          b.status === 'approved' ? 'px-2 py-0.5 rounded text-green-800 bg-green-50 border border-green-200'
                          : b.status === 'rejected' ? 'px-2 py-0.5 rounded text-red-700 bg-red-50 border border-red-200'
                          : b.status === 'cancelled' ? 'px-2 py-0.5 rounded text-yellow-800 bg-yellow-50 border border-yellow-200'
                          : 'px-2 py-0.5 rounded text-gray-700 bg-gray-50 border border-gray-200'
                        }>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button onClick={()=>dispatch(updateBookingStatus({ id: b._id, status: 'approved' }))} className="px-1 sm:px-2 py-1 rounded border border-green-200 bg-green-50 text-green-800 hover:bg-green-100 text-xs sm:text-sm flex items-center gap-1">
                            <FaCheck className="max-[400px]:block hidden" size={12} />
                            <span className="max-[400px]:hidden">Approve</span>
                          </button>
                          <button onClick={()=>dispatch(updateBookingStatus({ id: b._id, status: 'rejected' }))} className="px-1 sm:px-2 py-1 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs sm:text-sm flex items-center gap-1">
                            <FaTimes className="max-[400px]:block hidden" size={12} />
                            <span className="max-[400px]:hidden">Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

