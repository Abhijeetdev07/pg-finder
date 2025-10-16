import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchInquiries, updateInquiryStatus } from '../features/inquiries/slice.js';

export default function Inquiries() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.inquiries);

  useEffect(() => {
    dispatch(fetchInquiries());
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-xl font-semibold mb-3">Inquiries</h1>
          {status==='loading' && <div className="border rounded bg-white p-3 text-sm">Loading…</div>}
          {error && <div className="border rounded bg-white p-3 text-sm text-red-600">{error}</div>}
          {(!items || items.length===0) && status!=='loading' && (
            <div className="border rounded bg-white p-3 text-sm text-gray-600">No inquiries yet.</div>
          )}
          {items && items.length>0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm bg-white border rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2">PG</th>
                    <th className="text-left px-3 py-2">User</th>
                    <th className="text-left px-3 py-2">Message</th>
                    <th className="text-left px-3 py-2">Created</th>
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((iq)=> (
                    <tr key={iq._id} className="border-t">
                      <td className="px-3 py-2">{iq.pgId?.title || iq.pgId}</td>
                      <td className="px-3 py-2">{iq.userId?.email || iq.userId}</td>
                      <td className="px-3 py-2 max-w-[400px] truncate" title={iq.message}>{iq.message}</td>
                      <td className="px-3 py-2">{iq.createdAt ? new Date(iq.createdAt).toLocaleString() : '-'}</td>
                      <td className="px-3 py-2">{iq.status}</td>
                      <td className="px-3 py-2 space-x-2">
                        {iq.status === 'open' ? (
                          <button onClick={()=>dispatch(updateInquiryStatus({ id: iq._id, status: 'closed' }))} className="px-2 py-1 border rounded">Close</button>
                        ) : (
                          <button onClick={()=>dispatch(updateInquiryStatus({ id: iq._id, status: 'open' }))} className="px-2 py-1 border rounded">Reopen</button>
                        )}
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

