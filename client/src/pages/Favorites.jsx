import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/Card'
import { fetchFavorites, toggleFavorite } from '../features/favorites/favoritesSlice'

export default function Favorites() {
    const dispatch = useDispatch()
    const { items, status } = useSelector((s) => s.favorites)

    useEffect(() => {
        if (status === 'idle') dispatch(fetchFavorites())
    }, [dispatch, status])

    return (
        <section className="p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Your Favorites</h1>
            {status === 'loading' && <p className="text-sm text-gray-500">Loading...</p>}
            {items.length === 0 && status !== 'loading' && (
                <p className="text-gray-600">No favorites yet.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((l) => (
                    <Card
                        key={l._id}
                        id={l._id}
                        title={l.name}
                        subtitle={l.collegeName}
                        image={l.photos?.[0]?.url}
                        price={l.pricePerMonth}
                        rating={l.avgRating}
                        reviewsCount={l.numReviews}
                        onClick={() => window.location.assign(`/pg/${l._id}`)}
                    />
                ))}
            </div>
        </section>
    )
}


