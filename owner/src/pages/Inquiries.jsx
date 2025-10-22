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
    <div className="h-screen bg-gray-50 pt-[52px]">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4 max-[764px]:ml-0">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Inquiries</h1>
            <p className="text-sm text-gray-600 mt-1">View and respond to tenant inquiries</p>
          </div>
          {isLoading && <div className="p-3 text-sm">Loading…</div>}
          {error && <div className="border rounded bg-white p-3 text-sm text-red-600">{error}</div>}
          {(!items || items.length===0) && status!=='loading' && (
            <div className="border rounded bg-white p-3 text-sm text-gray-600">No inquiries yet.</div>
          )}
          {items && items.length>0 && (
            <div className="overflow-y-auto max-h-[82vh]">
              <table className="min-w-full text-sm bg-white border rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2">PG</th>
                    <th className="text-left px-3 py-2 max-[1000px]:hidden">User</th>
                    <th className="text-left px-3 py-2 max-[800px]:hidden">Message</th>
                    <th className="text-left px-3 py-2 max-[600px]:hidden">Created</th>
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((iq)=> (
                    <tr key={iq._id} className="border-t">
                      <td className="px-3 py-2">{iq.pgId?.title || iq.pgId}</td>
                      <td className="px-3 py-2 max-[1000px]:hidden">{iq.userId?.email || iq.userId}</td>
                      <td className="px-3 py-2 max-[800px]:hidden max-w-[400px] truncate" title={iq.message}>{iq.message}</td>
                      <td className="px-3 py-2 max-[600px]:hidden">{iq.createdAt ? new Date(iq.createdAt).toLocaleString() : '-'}</td>
                      <td className="px-3 py-2">
                        <span className={
                          iq.status === 'open' ? 'px-2 py-0.5 rounded text-green-800 bg-green-50 border border-green-200'
                          : 'px-2 py-0.5 rounded text-gray-700 bg-gray-50 border border-gray-200'
                        }>
                          {iq.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {iq.status === 'open' ? (
                            <button 
                              onClick={()=>dispatch(updateInquiryStatus({ id: iq._id, status: 'closed' }))} 
                              className="px-1 sm:px-2 py-1 border rounded flex items-center gap-1 text-xs sm:text-sm"
                            >
                              <FaTimes className="max-[400px]:block hidden" size={12} />
                              <span className="max-[400px]:hidden">Close</span>
                            </button>
                          ) : (
                            <button 
                              onClick={()=>dispatch(updateInquiryStatus({ id: iq._id, status: 'open' }))} 
                              className="px-1 sm:px-2 py-1 border rounded flex items-center gap-1 text-xs sm:text-sm"
                            >
                              <FaCheck className="max-[400px]:block hidden" size={12} />
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
          )}
        </main>
      </div>
    </div>
  );
}

