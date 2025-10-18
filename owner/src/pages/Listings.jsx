import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import { Link } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deletePg, fetchOwnerListings } from '../features/listings/slice.js';

export default function Listings() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.listings);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, pgId: null, pgTitle: '', isLoading: false });

  useEffect(() => {
    dispatch(fetchOwnerListings({ limit: 50 }));
  }, []);

  const handleDeleteClick = (pgId, pgTitle) => {
    setDeleteModal({ isOpen: true, pgId, pgTitle, isLoading: false });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.pgId) {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      try {
        await dispatch(deletePg(deleteModal.pgId));
        setDeleteModal({ isOpen: false, pgId: null, pgTitle: '', isLoading: false });
      } catch (error) {
        setDeleteModal(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, pgId: null, pgTitle: '', isLoading: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4 max-[764px]:ml-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">Your Listings</h1>
            <Link to="/listings/new" className="px-3 py-1 border rounded-md bg-gray-900 text-white hover:bg-gray-800">Add PG</Link>
          </div>
          {status==='loading' && <div className="border rounded bg-white p-3 text-sm">Loading…</div>}
          {error && <div className="border rounded bg-white p-3 text-sm text-red-600">{error}</div>}
          {(!items || items.length===0) && status!=='loading' && (
            <div className="border rounded bg-white p-3 text-sm text-gray-600">No listings yet. Click "Add PG" to create your first listing.</div>
          )}
          {items && items.length>0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm bg-white border rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2">Title</th>
                    <th className="text-left px-3 py-2 max-[900px]:hidden">City</th>
                    <th className="text-left px-3 py-2 max-[700px]:hidden">Rent</th>
                    <th className="text-left px-3 py-2 max-[600px]:hidden">Rooms</th>
                    <th className="text-left px-3 py-2 max-[500px]:hidden">Created</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((pg)=> (
                    <tr key={pg._id} className="border-t">
                      <td className="px-3 py-2">{pg.title}</td>
                      <td className="px-3 py-2 max-[900px]:hidden">{pg.city}</td>
                      <td className="px-3 py-2 max-[700px]:hidden">₹{pg.rent}</td>
                      <td className="px-3 py-2 max-[600px]:hidden">{pg.roomsAvailable ?? '-'}</td>
                      <td className="px-3 py-2 max-[500px]:hidden">{pg.createdAt ? new Date(pg.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 sm:gap-2 justify-center">
                          <Link to={`/listings/${pg._id}/edit`} className="px-1 sm:px-2 py-1 border rounded flex items-center gap-1 text-xs sm:text-sm">
                            <AiOutlineEdit className="max-[400px]:block hidden" size={12} />
                            <span className="max-[400px]:hidden">Edit</span>
                          </Link>
                          <button 
                            onClick={()=>handleDeleteClick(pg._id, pg.title)} 
                            className="px-1 sm:px-2 py-1 border rounded border-red-200 text-red-700 bg-red-50 hover:bg-red-100 flex items-center gap-1 text-xs sm:text-sm"
                          >
                            <AiOutlineDelete className="max-[400px]:block hidden" size={12} />
                            <span className="max-[400px]:hidden">Delete</span>
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
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Listing"
        description="Are you sure you want to delete listing?"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}

