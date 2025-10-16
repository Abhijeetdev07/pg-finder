import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listFavorites, removeFavorite } from '../features/favorites/slice.js';

export default function Favorites() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.favorites);

  useEffect(() => {
    dispatch(listFavorites());
  }, []);

  return (
    <div>
      <h1>Your favorites</h1>
      {status==='loading' && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        {items.length === 0 && <p>No favorites yet.</p>}
        {items.map((pg) => (
          <div key={pg._id}>
            <h3>{pg.title || pg._id}</h3>
            <button onClick={() => dispatch(removeFavorite(pg._id))}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}


