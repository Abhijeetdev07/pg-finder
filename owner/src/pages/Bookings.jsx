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
    <div className="h-screen bg-gray-50 pt-[52px] overflow-y-hidden">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex h-full">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-52px)] max-[764px]:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Bookings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage tenant bookings and approvals</p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="h-12 w-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {(!items || items.length===0) && status!=='loading' && (
              <div className="bg-white border border-gray-200 rounded-xl p-12 shadow-sm text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings yet</h3>
                  <p className="text-sm text-gray-600">Booking requests will appear here when tenants make reservations</p>
                </div>
              </div>
            )}

            {/* Bookings Table */}
            {items && items.length>0 && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scroll">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">PG</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[1000px]:hidden">User</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[700px]:hidden">From</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[700px]:hidden">To</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((b)=> (
                        <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{b.pgId?.title || b.pgId}</div>
                            <div className="text-xs text-gray-500 mt-0.5 min-[1001px]:hidden">{b.userId?.name || b.userId?.email || b.userId}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-[1000px]:hidden">{b.userId?.name || b.userId?.email || b.userId}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs max-[700px]:hidden">
                            {b.dates?.from ? new Date(b.dates.from).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs max-[700px]:hidden">
                            {b.dates?.to ? new Date(b.dates.to).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={
                              b.status === 'approved' ? 'px-2 py-1 rounded-lg text-xs font-medium text-green-700 bg-green-50 border border-green-200'
                              : b.status === 'rejected' ? 'px-2 py-1 rounded-lg text-xs font-medium text-red-700 bg-red-50 border border-red-200'
                              : b.status === 'cancelled' ? 'px-2 py-1 rounded-lg text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200'
                              : 'px-2 py-1 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200'
                            }>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {b.status === 'requested' && (
                                <>
                                  <button 
                                    onClick={()=>dispatch(updateBookingStatus({ id: b._id, status: 'approved' }))} 
                                    className="px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 text-xs sm:text-sm flex items-center gap-1.5 transition-colors font-medium"
                                    title="Approve booking"
                                  >
                                    <FaCheck size={14} />
                                    <span className="max-[400px]:hidden">Approve</span>
                                  </button>
                                  <button 
                                    onClick={()=>dispatch(updateBookingStatus({ id: b._id, status: 'rejected' }))} 
                                    className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs sm:text-sm flex items-center gap-1.5 transition-colors font-medium"
                                    title="Reject booking"
                                  >
                                    <FaTimes size={14} />
                                    <span className="max-[400px]:hidden">Reject</span>
                                  </button>
                                </>
                              )}
                              {b.status === 'approved' && (
                                <span className="text-xs text-gray-500">Approved</span>
                              )}
                              {b.status === 'rejected' && (
                                <span className="text-xs text-gray-500">Rejected</span>
                              )}
                              {b.status === 'cancelled' && (
                                <span className="text-xs text-gray-500">Cancelled</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

