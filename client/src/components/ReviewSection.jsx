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
                <AiFillStar className="text-yellow-400" size={24} />
              ) : (
                <AiOutlineStar className="text-gray-300" size={24} />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
      </div>
      
      {isCheckingReview ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600">Checking review status...</p>
        </div>
      ) : hasReviewed ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800 mb-1">Already Reviewed</p>
              <p className="text-sm text-yellow-700">
                You have already submitted a review for this property. Thank you for your feedback!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onAddReview} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating
            </label>
            <div className="flex items-center gap-3">
              {renderStars(reviewForm.rating, true)}
              <span className="text-sm text-gray-600 font-medium">
                {reviewForm.rating} {reviewForm.rating === 1 ? 'star' : 'stars'}
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Your Review
              </label>
              <span className={`text-xs font-medium ${
                reviewForm.comment.length > 200 
                  ? 'text-red-600' 
                  : reviewForm.comment.length > 180 
                  ? 'text-orange-600' 
                  : 'text-gray-500'
              }`}>
                {reviewForm.comment.length}/200
              </span>
            </div>
            <textarea
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                reviewForm.comment.length > 200 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Share your experience with this property... What did you like? What could be improved?"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              rows={4}
              maxLength={200}
              required
            />
            {reviewForm.comment.length > 180 && reviewForm.comment.length <= 200 && (
              <p className="text-xs text-orange-600 mt-1">You're approaching the character limit</p>
            )}
            {reviewForm.comment.length > 200 && (
              <p className="text-xs text-red-600 mt-1">Character limit exceeded</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={reviewStatus === 'loading' || reviewForm.comment.length > 200}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {reviewStatus === 'loading' && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {reviewStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
}
