import { Link } from 'react-router-dom';

export default function PGCard({ pg, isFavorite, onToggleFavorite }) {
  const cover = Array.isArray(pg.photos) && pg.photos.length > 0 ? pg.photos[0] : null;
  return (
    <div className="border rounded-lg overflow-hidden w-[280px]">
      <Link to={`/pg/${pg._id}`} className="block">
        {cover ? (
          <img src={cover} alt={pg.title} className="w-full h-40 object-cover" />
        ) : (
          <div className="w-full h-40 bg-gray-100" />
        )}
      </Link>
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h3 className="m-0 text-base font-medium">
            <Link to={`/pg/${pg._id}`} className="hover:underline">{pg.title}</Link>
          </h3>
          <button onClick={() => onToggleFavorite(pg)} aria-label="toggle favorite" title="Toggle favorite" className="text-lg">
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
        <p className="my-1 text-sm text-gray-700">{pg.city}{pg.college ? ` • ${pg.college}` : ''}</p>
        <p className="my-1 font-semibold">₹{pg.rent}</p>
      </div>
    </div>
  );
}


