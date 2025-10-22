import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchInquiries, updateInquiryStatus } from '../features/inquiries/slice.js';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function Inquiries() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.inquiries);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInquiries());
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Inquiries</h1>
              <p className="text-sm text-gray-600 mt-1">View and respond to tenant inquiries</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No inquiries yet</h3>
                  <p className="text-sm text-gray-600">Tenant inquiries will appear here when they contact you</p>
                </div>
              </div>
            )}

            {/* Inquiries Table */}
            {items && items.length>0 && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scroll">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">PG</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[1000px]:hidden">User</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[800px]:hidden">Message</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[600px]:hidden">Created</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((iq)=> (
                        <tr key={iq._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{iq.pgId?.title || iq.pgId}</div>
                            <div className="text-xs text-gray-500 mt-0.5 min-[1001px]:hidden">{iq.userId?.name || iq.userId?.email || iq.userId}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-[1000px]:hidden">{iq.userId?.name || iq.userId?.email || iq.userId}</td>
                          <td className="px-4 py-3 max-[800px]:hidden max-w-[400px]">
                            <div className="text-gray-700 truncate" title={iq.message}>{iq.message}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-[600px]:hidden">
                            {iq.createdAt ? new Date(iq.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={
                              iq.status === 'open' ? 'px-2 py-1 rounded-lg text-xs font-medium text-green-700 bg-green-50 border border-green-200'
                              : 'px-2 py-1 rounded-lg text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200'
                            }>
                              {iq.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {iq.status === 'open' ? (
                                <button 
                                  onClick={()=>dispatch(updateInquiryStatus({ id: iq._id, status: 'closed' }))} 
                                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 transition-colors"
                                  title="Close inquiry"
                                >
                                  <FaTimes size={14} />
                                  <span className="max-[400px]:hidden">Close</span>
                                </button>
                              ) : (
                                <button 
                                  onClick={()=>dispatch(updateInquiryStatus({ id: iq._id, status: 'open' }))} 
                                  className="px-3 py-1.5 border border-green-200 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-1.5 text-xs sm:text-sm transition-colors font-medium"
                                  title="Reopen inquiry"
                                >
                                  <FaCheck size={14} />
                                  <span className="max-[400px]:hidden">Reopen</span>
                                </button>
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

