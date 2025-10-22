import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import { fetchRatings, deleteReviews } from '../features/ratings/slice.js';
import { showToast } from '../features/ui/slice.js';
import { AiOutlineStar, AiFillStar, AiOutlineDelete } from 'react-icons/ai';
import { BiFilterAlt } from 'react-icons/bi';
import { MdVerified } from 'react-icons/md';
import { HiOutlineDotsVertical } from 'react-icons/hi';

export default function Ratings() {
  const dispatch = useDispatch();
  const { overview, reviews, status, error } = useSelector((s) => s.ratings);
  const [filter, setFilter] = useState('all'); // all, 5star, 4star, etc.
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest, highest, lowest
  const [deleteMode, setDeleteMode] = useState(false); // Toggle delete mode
  const [selectedReviews, setSelectedReviews] = useState([]); // Selected review IDs
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, isLoading: false }); // Delete confirmation modal

  useEffect(() => {
    dispatch(fetchRatings());
  }, [dispatch]);

  // Empty fallback data - page will display real reviews from backend API
  const mockData = {
    overview: {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    },
    reviews: []
  };

  // Toggle delete mode
  const handleToggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedReviews([]); // Clear selections when toggling
  };

  // Handle checkbox selection
  const handleSelectReview = (reviewId) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedReviews.length === filteredAndSortedReviews.length) {
      // Deselect all
      setSelectedReviews([]);
    } else {
      // Select all
      setSelectedReviews(filteredAndSortedReviews.map(review => review.id));
    }
  };

  // Handle delete selected reviews - open modal
  const handleDeleteSelected = () => {
    if (selectedReviews.length === 0) return;
    setDeleteModal({ isOpen: true, isLoading: false });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await dispatch(deleteReviews(selectedReviews));
      
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(showToast({ 
          type: 'success', 
          message: `Successfully deleted ${selectedReviews.length} review(s)` 
        }));
        // Reset state after successful delete
        setSelectedReviews([]);
        setDeleteMode(false);
        setDeleteModal({ isOpen: false, isLoading: false });
        // Refresh ratings to get updated stats
        dispatch(fetchRatings());
      } else {
        dispatch(showToast({ 
          type: 'error', 
          message: result.payload || 'Failed to delete reviews' 
        }));
        setDeleteModal({ isOpen: false, isLoading: false });
      }
    } catch (err) {
      dispatch(showToast({ 
        type: 'error', 
        message: 'An error occurred while deleting reviews' 
      }));
      setDeleteModal({ isOpen: false, isLoading: false });
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, isLoading: false });
  };

  const renderStars = (rating, size = 18) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <AiFillStar key={star} className="text-yellow-500" size={size} />
          ) : (
            <AiOutlineStar key={star} className="text-gray-300" size={size} />
          )
        ))}
      </div>
    );
  };

  // Use Redux data if available, otherwise use mock data
  const displayData = useMemo(() => {
    const hasData = reviews.length > 0;
    return {
      overview: hasData ? overview : mockData.overview,
      reviews: hasData ? reviews : mockData.reviews
    };
  }, [overview, reviews, mockData]);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...displayData.reviews];

    // Apply filter
    if (filter !== 'all') {
      const filterRating = parseInt(filter);
      result = result.filter(r => r.rating === filterRating);
    }

    // Apply sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    return result;
  }, [displayData.reviews, filter, sortBy]);

  const getRatingPercentage = (count) => {
    const total = displayData.overview.totalReviews;
    return total > 0 ? ((count / total) * 100).toFixed(0) : 0;
  };

  if (status === 'loading') {
    return (
      <div className="h-screen bg-gray-50 pt-[52px] overflow-y-hidden">
        <OwnerNavbar />
        <div className="mx-auto max-w-7xl flex h-full">
          <Sidebar />
          <main className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-52px)] max-[764px]:ml-0">
            <div className="max-w-7xl mx-auto">
              {/* Header Skeleton */}
              <div className="mb-6">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Overview Cards Skeleton */}
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-[450px]:gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`bg-white border border-gray-200 rounded-xl p-4 max-[500px]:p-3 max-[450px]:p-2 shadow-sm ${i === 3 ? 'col-span-2 md:col-span-1' : ''}`}>
                      <div className="h-4 w-24 max-[450px]:w-20 bg-gray-200 rounded animate-pulse mb-3 max-[500px]:mb-2 max-[450px]:mb-1"></div>
                      <div className="h-10 max-[500px]:h-8 max-[450px]:h-7 w-20 max-[450px]:w-16 bg-gray-200 rounded animate-pulse mb-2 max-[500px]:mb-1"></div>
                      <div className="h-3 w-32 max-[450px]:w-24 bg-gray-200 rounded animate-pulse max-[450px]:hidden"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters Skeleton */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Reviews List Skeleton */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 pt-[52px] overflow-y-hidden">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex h-full">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-52px)] max-[764px]:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Ratings & Reviews</h1>
              <p className="text-sm text-gray-600 mt-1">Track and manage reviews for all your PGs</p>
            </div>

            {/* Overview Cards */}
            <div className="mb-6">
              {/* All 3 Cards in One Row - Responsive */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-[450px]:gap-2">
                {/* Average Rating Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 max-[500px]:p-3 max-[450px]:p-2 shadow-sm flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-3 max-[500px]:mb-2 max-[450px]:mb-1">
                    <h3 className="text-sm max-[450px]:text-xs font-semibold text-gray-600">Average Rating</h3>
                  </div>
                  <div className="flex items-center max-[450px]:items-start gap-3 max-[500px]:gap-2 max-[450px]:gap-1 max-[450px]:flex-wrap">
                    <span className="text-3xl max-[500px]:text-2xl max-[450px]:text-xl font-bold text-gray-800">
                      {displayData.overview.averageRating}
                    </span>
                    <div className="mb-1 max-[500px]:mb-0 max-[450px]:mb-0">
                      <span className="hidden max-[450px]:inline">{renderStars(Math.round(displayData.overview.averageRating), 14)}</span>
                      <span className="max-[450px]:hidden">{renderStars(Math.round(displayData.overview.averageRating))}</span>
                    </div>
                  </div>
                  <p className="text-sm max-[500px]:text-xs max-[450px]:hidden text-gray-500 mt-2 max-[500px]:mt-1">
                    Based on {displayData.overview.totalReviews} reviews
                  </p>
                </div>

                {/* Total Reviews Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 max-[500px]:p-3 max-[450px]:p-2 shadow-sm flex flex-col justify-center">
                  <h3 className="text-sm max-[450px]:text-xs font-semibold text-gray-600 mb-3 max-[500px]:mb-2 max-[450px]:mb-1">Total Reviews</h3>
                  <span className="text-3xl max-[500px]:text-2xl max-[450px]:text-xl font-bold text-blue-600">
                    {displayData.overview.totalReviews}
                  </span>
                  <p className="text-sm max-[500px]:text-xs max-[450px]:hidden text-gray-500 mt-2 max-[500px]:mt-1">Across all properties</p>
                </div>

                {/* Rating Distribution Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 max-[500px]:p-3 max-[450px]:p-2 shadow-sm col-span-2 md:col-span-1">
                  <h3 className="text-sm max-[450px]:text-xs font-semibold text-gray-600 mb-4 max-[450px]:mb-2">Rating Distribution</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 w-8">{star} ★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${getRatingPercentage(displayData.overview.ratingDistribution[star])}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">
                          {displayData.overview.ratingDistribution[star]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters & Sort */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <BiFilterAlt size={20} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Filter by:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>
                  
                  {/* 3-dot menu button */}
                  <button
                    onClick={handleToggleDeleteMode}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Delete reviews"
                  >
                    <HiOutlineDotsVertical size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Delete mode actions */}
              {deleteMode && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedReviews.length === filteredAndSortedReviews.length && filteredAndSortedReviews.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Select All</span>
                    </label>
                    <span className="text-sm text-gray-600">
                      {selectedReviews.length > 0 
                        ? `${selectedReviews.length} of ${filteredAndSortedReviews.length} selected` 
                        : 'Select reviews to delete'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleDeleteMode}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      disabled={selectedReviews.length === 0 || deleteModal.isLoading}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {deleteModal.isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <AiOutlineDelete size={16} />
                          Delete Selected
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredAndSortedReviews.map((review) => (
                <div
                  key={review.id}
                  className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${
                    deleteMode && selectedReviews.includes(review.id) 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Checkbox in delete mode */}
                    {deleteMode && (
                      <div className="flex items-start pt-1">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => handleSelectReview(review.id)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-800">{review.pgName}</h3>
                            {review.verified && (
                              <MdVerified className="text-green-500" size={18} title="Verified Review" />
                            )}
                          </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{review.tenantName}</span>
                        <span>•</span>
                        <span>{new Date(review.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-sm font-semibold text-gray-700">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed break-all">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredAndSortedReviews.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <AiOutlineStar size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Reviews from tenants will appear here</p>
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
        title="Delete Reviews"
        description={`Are you sure you want to delete ${selectedReviews.length} review(s)? This action cannot be undone.`}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}
