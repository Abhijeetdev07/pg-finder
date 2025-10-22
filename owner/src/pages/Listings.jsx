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
    if (status === 'idle') {
      dispatch(fetchOwnerListings({ limit: 50 }));
    }
  }, [status, dispatch]);

  const isLoading = status === 'loading' && (!items || items.length === 0);

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
    <div className="h-screen bg-gray-50 pt-[52px] overflow-y-hidden">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex h-full">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-52px)] max-[764px]:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Your Listings</h1>
                  <p className="text-sm text-gray-600 mt-1">Manage all your PG properties</p>
                </div>
                <Link 
                  to="/listings/new" 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
                >
                  + Add New PG
                </Link>
              </div>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No listings yet</h3>
                  <p className="text-sm text-gray-600 mb-6">Get started by adding your first PG property</p>
                  <Link 
                    to="/listings/new" 
                    className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                  >
                    + Add Your First PG
                  </Link>
                </div>
              </div>
            )}

            {/* Listings Table */}
            {items && items.length>0 && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scroll">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[900px]:hidden">City</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[700px]:hidden">Rent</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[600px]:hidden">Rooms</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 max-[500px]:hidden">Created</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((pg)=> (
                        <tr key={pg._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{pg.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5 min-[901px]:hidden">{pg.city}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-[900px]:hidden">{pg.city}</td>
                          <td className="px-4 py-3 max-[700px]:hidden">
                            <span className="font-semibold text-gray-800">₹{pg.rent?.toLocaleString()}</span>
                            <span className="text-gray-500 text-xs ml-1">/month</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-[600px]:hidden">{pg.roomsAvailable ?? '-'}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-[500px]:hidden">
                            {pg.createdAt ? new Date(pg.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-center">
                              <Link 
                                to={`/listings/${pg._id}/edit`} 
                                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 transition-colors"
                                title="Edit listing"
                              >
                                <AiOutlineEdit size={16} />
                                <span className="max-[400px]:hidden">Edit</span>
                              </Link>
                              <button 
                                onClick={()=>handleDeleteClick(pg._id, pg.title)} 
                                className="px-3 py-1.5 border border-red-200 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1.5 text-xs sm:text-sm transition-colors"
                                title="Delete listing"
                              >
                                <AiOutlineDelete size={16} />
                                <span className="max-[400px]:hidden">Delete</span>
                              </button>
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

