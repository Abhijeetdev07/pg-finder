import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPgs } from '../features/pgs/slice.js';
import PGCard from '../components/PGCard.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import { addFavorite, removeFavorite } from '../features/favorites/slice.js';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();
  const { filters, results, meta, status, error } = useSelector((s) => s.pgs);
  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();
  const favorites = useSelector((s) => s.favorites.items);
  // Get skeleton count from localStorage or use default
  const getSkeletonCount = () => {
    const storedCount = localStorage.getItem('pgCount');
    return storedCount ? parseInt(storedCount, 10) : 6;
  };
  
  const [skeletonCount, setSkeletonCount] = useState(getSkeletonCount());

  useEffect(() => {
    dispatch(fetchPgs());
  }, []);

  // Re-fetch when search filter changes
  useEffect(() => {
    if (filters.search !== undefined) {
      dispatch(fetchPgs());
    }
  }, [filters.search, dispatch]);

  // Update skeleton count and store in localStorage when results change
  useEffect(() => {
    if (results.length > 0) {
      //console.log('Updating skeleton count to:', results.length);
      setSkeletonCount(results.length);
      localStorage.setItem('pgCount', results.length.toString());
    }
  }, [results.length]);

  // Debug logging
  //console.log('Current state - status:', status, 'results.length:', results.length, 'skeletonCount:', skeletonCount);

  return (
    <main className="min-h-screen p-4 flex flex-col bg-gray-200 pt-[70px]">
      <div className="w-full max-w-[1300px] mx-auto">
        <h1 className="text-xl font-semibold">Find Paying Guests</h1>

        {status === 'loading' ? (
          <div className="flex flex-wrap gap-4 mt-4">
            {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <p className="text-red-600 mt-4">{error}</p>
        ) : results.length === 0 ? (
          <div className="text-center py-8 mt-4">
            <p className="text-gray-500 text-lg">No PGs found</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 mt-4">
            {results.map((pg)=> {
              const fav = favorites.some((f)=> f._id === pg._id);
              return (
                <PGCard
                  key={pg._id}
                  pg={pg}
                  isFavorite={fav}
                  onToggleFavorite={(p)=> {
                    if (!token) {
                      navigate('/login');
                      return Promise.resolve();
                    }
                    return dispatch(fav ? removeFavorite(p._id) : addFavorite(p._id));
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </main>
  );
}




