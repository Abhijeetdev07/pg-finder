import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai';

export default function PGCard({ pg, isFavorite, onToggleFavorite }) {
  const cover = Array.isArray(pg.photos) && pg.photos.length > 0 ? pg.photos[0] : null;
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<AiFillStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<AiFillStar key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<AiOutlineStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <div className="border rounded-lg overflow-hidden w-[280px] relative group">
      <Link to={`/pg/${pg._id}`} className="block">
        {cover ? (
          <img src={cover} alt={pg.title} className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105" />
        ) : (
          <div className="w-full h-40 bg-gray-100" />
        )}
      </Link>
      
      {/* Favorite Icon - Top Right */}
      <button 
        onClick={() => onToggleFavorite(pg)} 
        aria-label="toggle favorite" 
        title="Toggle favorite" 
        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors z-10"
      >
        {isFavorite ? (
          <AiFillHeart className="text-red-500 text-lg" />
        ) : (
          <AiOutlineHeart className="text-red-500 text-lg" />
        )}
      </button>
      
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h3 className="m-0 text-base font-medium">
            <Link to={`/pg/${pg._id}`} className="hover:underline">{pg.title}</Link>
          </h3>
        </div>
        <p className="my-1 text-sm text-gray-700">{pg.city}{pg.college ? ` • ${pg.college}` : ''}</p>
        <p className="my-1 font-semibold">₹{pg.rent}</p>
        
        {/* Rating Section */}
        {pg.ratingAvg > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-1">
              {renderStars(pg.ratingAvg)}
            </div>
            <span className="text-sm text-gray-600">
              {pg.ratingAvg.toFixed(1)} ({pg.ratingCount})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


