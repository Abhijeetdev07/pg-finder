import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import Gallery from '../components/Gallery'
import RatingStars from '../components/RatingStars'
import { fetchListingById } from '../features/listings/listingsSlice'
import { api } from '../utils/api.js'
import toast from 'react-hot-toast'
import { FiX } from 'react-icons/fi'
import { FaEdit } from "react-icons/fa";

export default function PGDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { current: listing, status } = useSelector((s) => s.listings)
    const [selectedRating, setSelectedRating] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [showReviewForm, setShowReviewForm] = useState(false)

    useEffect(() => {
        if (id) dispatch(fetchListingById(id))
    }, [dispatch, id])

    if (status === 'loading' || !listing) {
        return (
            <section className="p-4">
                <p className="text-sm text-gray-500">Loading...</p>
            </section>
        )
    }

    const images = (listing.photos || []).map((p) => p.url)

    return (
        <section className="px-4 py-6">
            <div className="max-w-[1200px] mx-auto space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-semibold">{listing.name}</h1>
                </div>
                <div className="text-right">
                    <p className="text-xl font-semibold">₹ {Number(listing.pricePerMonth).toLocaleString()}</p>
                    <div className="mt-2 flex gap-2 justify-end">
                        <button onClick={() => navigate(`/book/${listing._id}`)} className="px-3 py-2 rounded bg-black text-white text-sm">Book</button>
                        <button onClick={() => navigate(`/request-visit/${listing._id}`)} className="px-3 py-2 rounded border text-sm">Request Visit</button>
                    </div>
                </div>
            </div>

            <Gallery images={images} />

            <div className="space-y-1">
                <p className="text-gray-600">{listing.address}</p>
                {listing.collegeName && (
                    <p className="text-gray-600">{listing.collegeName}</p>
                )}
                <div className="mt-1 flex items-center">
                    <RatingStars value={listing.avgRating || 0} />
                    <span className="ml-2 text-sm text-gray-600">{Number(listing.avgRating || 0).toFixed(1)} • {listing.numReviews || 0} reviews</span>
                </div>
                <div className="mt-2">
                    <button 
                        onClick={() => setShowReviewForm(true)}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                    >
                        <FaEdit />
                    </button>
                </div>
            </div>

            {/* Review Form Section - moved above description */}
            {showReviewForm && (
                <div className="max-w-[500px]">
                    <div className="border rounded p-3 relative">
                        <button 
                            onClick={() => setShowReviewForm(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1"
                            title="Close review form"
                        >
                            <FiX size={18} />
                        </button>
                        <h4 className="font-medium mb-2">Write a Review</h4>
                        <form onSubmit={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (submitting) return // Prevent double submission
                            
                            const formData = new FormData(e.currentTarget)
                            const comment = formData.get('comment')?.toString().trim()
                            if (!selectedRating || !comment) {
                                toast.error('Please select a rating and write a comment')
                                return
                            }
                            
                            setSubmitting(true)
                            let didSucceed = false
                            try {
                                const response = await api.post('/api/reviews', { listingId: id, rating: selectedRating, comment })
                                if (response?.status === 201 || response?.data?.review) {
                                    didSucceed = true
                                    toast.success('Review submitted successfully', { id: 'review-submit' })
                                    e.currentTarget.reset()
                                    setSelectedRating(0)
                                    setShowReviewForm(false) // Hide the form after successful submission
                                    // Refresh listing to show updated rating
                                    dispatch(fetchListingById(id))
                                }
                            } catch (err) {
                                console.error('Review submission error:', err)
                                if (!didSucceed) {
                                    // Check for duplicate review error (409 status or E11000)
                                    if (err?.response?.status === 409 || 
                                        err?.response?.data?.message?.includes('E11000') || 
                                        err?.response?.data?.message?.includes('duplicate key') ||
                                        err?.response?.data?.message?.includes('already submitted a review')) {
                                        toast.error('You have already submitted a review for this listing', { id: 'review-submit' })
                                    } else {
                                        toast.error(err?.response?.data?.message || 'Failed to submit review', { id: 'review-submit' })
                                    }
                                }
                            } finally {
                                setSubmitting(false)
                            }
                        }}>
                            <div className="mb-2">
                                <label className="block text-sm text-gray-600 mb-1">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setSelectedRating(star)}
                                            className={`text-2xl transition-colors ${star <= selectedRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm text-gray-600 mb-1">Comment</label>
                                <textarea name="comment" placeholder="Share your experience..." className="border rounded px-2 py-1 text-sm w-full" rows={3} required></textarea>
                            </div>
                            <button disabled={submitting} type="submit" className="px-3 py-1 bg-black text-white text-sm rounded disabled:opacity-60 disabled:cursor-not-allowed">
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {listing.description && (
                <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{listing.description}</p>
                </div>
            )}

            <div>
                <h3 className="font-semibold mb-2">Facilities</h3>
                <div className="flex flex-wrap gap-2 text-sm">
                    {Object.entries(listing.facilities || {}).filter(([, v]) => v).map(([k]) => (
                        <span key={k} className="px-3 py-1 rounded-full border">{k}</span>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <div className="flex items-center gap-2">
                    {listing.ownerPhone && (
                        <a className="px-3 py-2 rounded border text-sm" href={`https://wa.me/${listing.ownerPhone}`}>WhatsApp</a>
                    )}
                </div>
            </div>
            </div>
        </section>
    )
}


