// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { AiFillHeart, AiOutlineHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai';
// import HeartBorderSpinner from './Heartload';

// export default function PGCard({ pg, isFavorite, onToggleFavorite }) {
//   const cover = Array.isArray(pg.photos) && pg.photos.length > 0 ? pg.photos[0] : null;
//   const [isFavLoading, setIsFavLoading] = useState(false);
  
//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
    
//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(<AiFillStar key={i} className="text-yellow-400 text-sm" />);
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(<AiFillStar key={i} className="text-yellow-400 text-sm" />);
//       } else {
//         stars.push(<AiOutlineStar key={i} className="text-gray-300 text-sm" />);
//       }
//     }
//     return stars;
//   };

//   return (
//     <div className="border border-gray-300 rounded-3xl overflow-hidden w-[280px] relative group bg-white">
//       <Link to={`/pg/${pg._id}`} className="block">
//         {cover ? (
//           <img src={cover} alt={pg.title} className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105" />
//         ) : (
//           <div className="w-full h-40 bg-gray-100" />
//         )}
//       </Link>
      
//       {/* Favorite Icon - Top Right */}
//       <button 
//         onClick={async () => {
//           if (isFavLoading) return;
//           try {
//             setIsFavLoading(true);
//             await (onToggleFavorite?.(pg) || Promise.resolve());
//           } finally {
//             setIsFavLoading(false);
//           }
//         }} 
//         aria-label="toggle favorite" 
//         title="Toggle favorite" 
//         disabled={isFavLoading}
//         className={`absolute top-2 right-2 h-8 w-8 bg-white/90 rounded-full shadow-md transition-all z-10 flex items-center justify-center leading-none ${isFavLoading ? 'opacity-70' : 'hover:bg-white'}`}
//       >
//         {isFavLoading ? (
//           <HeartBorderSpinner size={18} color="#ef4444" strokeWidth={2} className="align-middle" />
//         ) : isFavorite ? (
//           <AiFillHeart className="text-red-500 text-lg" />
//         ) : (
//           <AiOutlineHeart className="text-red-500 text-lg" />
//         )}
//       </button>
      
//       <div className="p-3">
//         <div className="flex justify-between items-center">
//           <h3 className="m-0 text-base font-medium">
//             <Link to={`/pg/${pg._id}`} className="hover:underline">{pg.title}</Link>
//           </h3>
//         </div>
//         <p className="my-1 text-sm text-gray-700">{pg.city}{pg.college ? ` • ${pg.college}` : ''}</p>
//         <p className="my-1 font-semibold">₹{pg.rent}</p>
        
//         {/* Rating Section */}
//         {pg.ratingAvg > 0 && (
//           <div className="flex items-center gap-1 mt-2">
//             <div className="flex items-center gap-1">
//               {renderStars(pg.ratingAvg)}
//             </div>
//             <span className="text-sm text-gray-600">
//               {pg.ratingAvg.toFixed(1)} ({pg.ratingCount})
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AiFillHeart, AiOutlineHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import HeartBorderSpinner from './Heartload';

export default function PGCard({ pg, isFavorite, onToggleFavorite }) {
  const cover = Array.isArray(pg.photos) && pg.photos.length > 0 ? pg.photos[0] : null;
  const [isFavLoading, setIsFavLoading] = useState(false);
  
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
    <div className="border border-gray-300 rounded-3xl overflow-hidden w-[280px] relative group bg-white transition-transform duration-300 hover:scale-101 hover:shadow-md">
      <Link to={`/pg/${pg._id}`} className="block">
        {cover ? (
          <img
            src={cover}
            alt={pg.title}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100" />
        )}
      </Link>

      {/* Favorite Icon */}
      <button
        onClick={async () => {
          if (isFavLoading) return;
          try {
            setIsFavLoading(true);
            await (onToggleFavorite?.(pg) || Promise.resolve());
          } finally {
            setIsFavLoading(false);
          }
        }}
        aria-label="toggle favorite"
        title="Toggle favorite"
        disabled={isFavLoading}
        className={`absolute top-2 right-2 h-8 w-8 bg-white rounded-full shadow-md transition-all z-10 flex items-center justify-center leading-none ${
          isFavLoading ? 'opacity-100' : 'hover:bg-white'
        }`}
      >
        {isFavLoading ? (
          <HeartBorderSpinner size={18} color="#ef4444" strokeWidth={2} className="align-middle" />
        ) : isFavorite ? (
          <AiFillHeart className="text-red-500 text-lg" />
        ) : (
          <AiOutlineHeart className="text-red-500 text-lg" />
        )}
      </button>

      {/* Card Body */}
      <div className="p-3 flex flex-col justify-between h-[160px]">
        <div>
          <h3 className="text-base font-medium">
            <Link to={`/pg/${pg._id}`} className="hover:underline">
              {pg.title}
            </Link>
          </h3>
          <p className="my-1 text-sm text-gray-700">
            {pg.city}
            {pg.college ? ` • ${pg.college}` : ''}
          </p>
          <p>₹<span className="mx-1 font-semibold">{pg.rent}</span></p>
        </div>
        {/* Rating at bottom-right */}
        {pg.ratingAvg > 0 && (
          <div className="flex items-center justify-end gap-1 mt-2">
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
