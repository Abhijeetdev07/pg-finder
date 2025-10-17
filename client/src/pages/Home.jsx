import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPgs, setFilters, setPage } from '../features/pgs/slice.js';
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

  useEffect(() => {
    dispatch(fetchPgs());
  }, [filters.page, filters.sort]);

  return (
    <main className="min-h-screen p-4 flex flex-col">
      <h1 className="text-xl font-semibold">Find Paying Guests</h1>

      {status==='loading' && (
        <div className="flex flex-wrap gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

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
                  return;
                }
                dispatch(fav ? removeFavorite(p._id) : addFavorite(p._id));
              }}
            />
          )
        })}
      </div>

      <div className="mt-auto flex items-center gap-2 justify-end">
        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={filters.page<=1} onClick={()=>dispatch(setPage(filters.page-1))}>Prev</button>
        <span className="text-sm">Page {meta.page}</span>
        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={(meta.page*meta.limit)>=meta.total} onClick={()=>dispatch(setPage(filters.page+1))}>Next</button>
      </div>
    </main>
  );
}


