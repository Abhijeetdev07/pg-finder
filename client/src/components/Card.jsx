import RatingStars from './RatingStars'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../features/favorites/favoritesSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function Card({ title, subtitle, image, price, rating, reviewsCount, id, onClick, footer }) {
	const dispatch = useDispatch()
	const favoriteIds = useSelector((s) => s.favorites.ids)
	const isFav = id && favoriteIds.includes(id)

	function onToggleFavorite(e) {
		e.stopPropagation()
		if (id) dispatch(toggleFavorite(id))
		if (id) {
			// removed from fav show the error toast notification
			if (isFav) {
				toast.error('Removed from favorites')
			} else {
				toast.success('Added to favorites')
			}
		}
	}

	return (
		<div className="rounded-md overflow-hidden border hover:shadow-md transition cursor-pointer text-sm" onClick={onClick}>
			{image && (
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
					<img src={image} alt={title} className="w-full h-full object-cover" />
					<button
						onClick={onToggleFavorite}
						title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        aria-pressed={isFav}
                        className={`absolute top-2 right-2 rounded-full p-2 bg-white/95 backdrop-blur border hover:shadow`}
					>
                        {isFav ? (
                            <FaHeart className="text-red-500" />
                        ) : (
                            <FaRegHeart className="text-gray-700" />
                        )}
					</button>
				</div>
			)}
			<div className="p-2.5 space-y-0.5">
				{title && <h3 className="text-sm font-semibold truncate">{title}</h3>}
				{subtitle && <p className="text-xs text-gray-600 truncate">{subtitle}</p>}
				<div className="flex items-center justify-between mt-1">
					{price != null && <p className="text-sm font-medium">₹ {Number(price).toLocaleString()}</p>}
					{typeof rating === 'number' && (
						<div className="inline-flex items-center gap-1 ml-2">
							<RatingStars value={rating} outOf={5} size={12} />
							<span className="text-[11px] text-gray-500">{Number(rating || 0).toFixed(1)}{typeof reviewsCount === 'number' ? ` (${reviewsCount})` : ''}</span>
						</div>
					)}
				</div>
				{footer}
			</div>
		</div>
	);
}


