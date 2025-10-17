import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listFavorites, removeFavorite } from '../features/favorites/slice.js';
import { AiFillHeart, AiOutlineHeart, AiFillStar, AiOutlineStar, AiOutlineDelete } from 'react-icons/ai';
import { showToast } from '../features/ui/slice.js';

export default function Favorites() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.favorites);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    dispatch(listFavorites());
  }, []);

  const handleRemoveFavorite = async (pgId, pgTitle) => {
    if (window.confirm(`Are you sure you want to remove "${pgTitle}" from your favorites?`)) {
      setRemovingId(pgId);
      try {
        await dispatch(removeFavorite(pgId));
        dispatch(showToast({ type: 'success', message: 'Removed from favorites' }));
      } catch (error) {
        dispatch(showToast({ type: 'error', message: 'Failed to remove from favorites' }));
      } finally {
        setRemovingId(null);
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<AiFillStar key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<AiOutlineStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => dispatch(listFavorites())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">MY Favorites</h1>
          </div>
          <p className="text-gray-600">
            {items.length === 0 
              ? "No favorites yet" 
              : `${items.length} ${items.length === 1 ? 'favorite' : 'favorites'} saved`
            }
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 text-8xl mb-6">💔</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring PGs and add them to your favorites to see them here. 
              Click the heart icon on any PG card to save it.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <AiOutlineHeart />
              Explore PGs
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((pg) => {
              const cover = Array.isArray(pg.photos) && pg.photos.length > 0 ? pg.photos[0] : null;
              
              return (
                <div key={pg._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                  {/* Image */}
                  <div className="relative">
                    <Link to={`/pg/${pg._id}`} className="block">
                      {cover ? (
                        <img 
                          src={cover} 
                          alt={pg.title} 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" 
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </Link>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFavorite(pg._id, pg.title)}
                      disabled={removingId === pg._id}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors z-10 group/btn"
                      title="Remove from favorites"
                    >
                      {removingId === pg._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <AiOutlineDelete className="text-red-500 text-lg group-hover/btn:text-red-600" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Link to={`/pg/${pg._id}`} className="block group/link">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover/link:text-blue-600 transition-colors line-clamp-2">
                        {pg.title}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {pg.city}{pg.college ? ` • ${pg.college}` : ''}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">₹{pg.rent}</span>
                      {pg.ratingAvg > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1">
                            {renderStars(pg.ratingAvg)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {pg.ratingAvg.toFixed(1)} ({pg.ratingCount})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Amenities Preview */}
                    {pg.amenities && pg.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pg.amenities.slice(0, 3).map((amenity, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {pg.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{pg.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <Link 
                      to={`/pg/${pg._id}`}
                      className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


