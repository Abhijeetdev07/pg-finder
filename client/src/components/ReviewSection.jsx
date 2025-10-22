import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createReview } from '../features/reviews/slice.js';
import { showToast } from '../features/ui/slice.js';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import api from '../lib/axios.js';

export default function ReviewSection({ pgId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);
  const reviewStatus = useSelector((s) => s.reviews.status);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isCheckingReview, setIsCheckingReview] = useState(true);

  useEffect(() => {
    if (token) {
      checkExistingReview();
    } else {
      setIsCheckingReview(false);
    }
  }, [token, pgId]);

  const checkExistingReview = async () => {
    try {
      const response = await api.get(`/api/reviews/check/${pgId}`);
      setHasReviewed(response.data.hasReviewed);
    } catch (error) {
      console.error('Error checking existing review:', error);
    } finally {
      setIsCheckingReview(false);
    }
  };

  const requireAuth = () => {
    if (!token) {
      navigate('/login', { replace: true, state: { from: { pathname: `/pg/${pgId}` } } });
      return false;
    }
    return true;
  };

  const onAddReview = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    
    if (!reviewForm.comment.trim()) {
      dispatch(showToast({ type: 'error', message: 'Please enter a comment' }));
      return;
    }

    if (reviewForm.comment.length > 200) {
      dispatch(showToast({ type: 'error', message: 'Comment must be 200 characters or less' }));
      return;
    }

    const res = await dispatch(createReview({ 
      pgId, 
      rating: Number(reviewForm.rating), 
      comment: reviewForm.comment 
    }));
    
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: 'Review added successfully!' }));
      setReviewForm({ rating: 5, comment: '' });
      setHasReviewed(true); // Update state to prevent further submissions
    } else if (res.meta.requestStatus === 'rejected') {
      // Check if it's a duplicate review error
      if (res.payload && res.payload.includes('already reviewed')) {
        setHasReviewed(true);
      }
      // Error message is already handled by the axios interceptor and shown via toast
    }
  };

  const handleStarClick = (rating) => {
    setReviewForm({ ...reviewForm, rating });
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = interactive 
            ? star <= (hoveredStar || reviewForm.rating)
            : star <= rating;
          
          return (
            <span
              key={star}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              onClick={interactive ? () => handleStarClick(star) : undefined}
              onMouseEnter={interactive ? () => handleStarHover(star) : undefined}
              onMouseLeave={interactive ? handleStarLeave : undefined}
            >
              {isFilled ? (
                <AiFillStar className="text-yellow-400 text-lg" />
              ) : (
                <AiOutlineStar className="text-gray-300 text-lg" />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-6 max-w-[400px]">
      <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
      
      {isCheckingReview ? (
        <div className="text-center py-4 text-gray-500">
          <p>Checking review status...</p>
        </div>
      ) : hasReviewed ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>Already Reviewed:</strong> You have already submitted a review for this PG.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <form onSubmit={onAddReview} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(reviewForm.rating, true)}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <span className={`text-xs ${
                  reviewForm.comment.length > 200 
                    ? 'text-red-600 font-semibold' 
                    : reviewForm.comment.length > 180 
                    ? 'text-orange-600' 
                    : 'text-gray-500'
                }`}>
                  {reviewForm.comment.length}/200
                </span>
              </div>
              <textarea
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:border-transparent ${
                  reviewForm.comment.length > 200 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Share your experience with this PG..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={3}
                maxLength={200}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={reviewStatus === 'loading'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {reviewStatus === 'loading' && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {reviewStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
