import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa'

export default function RatingStars({ value = 0, outOf = 5, size = 16 }) {
    const full = Math.floor(value)
    const hasHalf = value - full >= 0.5
    const empty = outOf - full - (hasHalf ? 1 : 0)
    return (
        <div className="inline-flex items-center gap-0.5 text-yellow-500">
            {Array.from({ length: full }).map((_, i) => (
                <FaStar key={`f-${i}`} size={size} />
            ))}
            {hasHalf && <FaStarHalfAlt size={size} />}
            {Array.from({ length: empty }).map((_, i) => (
                <FaRegStar key={`e-${i}`} size={size} className="text-gray-300" />
            ))}
        </div>
    )
}


