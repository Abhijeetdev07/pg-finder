import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listFavorites, removeFavorite } from '../features/favorites/slice.js';
import PGCard from '../components/PGCard.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';

export default function Favorites() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.favorites);

  useEffect(() => {
    dispatch(listFavorites());
  }, []);

  if (status === 'loading') {
    return (
      <main className="h-screen p-4 pt-[70px]">
        <div className="w-full max-w-[1300px] mx-auto">
          <h1 className="text-xl font-semibold">My Favorites</h1>
          <div className="flex flex-wrap gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-4 pt-[70px]">
        <div className="w-full max-w-[1300px] mx-auto">
          <h1 className="text-xl font-semibold">My Favorites</h1>
          <p className="text-red-600 mt-4">{error}</p>
          <button className="mt-2 px-3 py-1 border rounded" onClick={() => dispatch(listFavorites())}>Try again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pt-[70px]">
      <div className="w-full max-w-[1300px] mx-auto">
        <h1 className="text-xl font-semibold">My Favorites</h1>

        {items.length === 0 && (
          <div className="mt-6 min-h-[40vh] flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 mb-3">No favorites yet</p>
            <Link to="/" className="inline-block px-3 py-2 border rounded">Explore PGs</Link>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-4">
          {items.map((pg) => (
            <PGCard
              key={pg._id}
              pg={pg}
              isFavorite={true}
              onToggleFavorite={() => dispatch(removeFavorite(pg._id))}
            />
          ))}
        </div>
      </div>
    </main>
  );
}


