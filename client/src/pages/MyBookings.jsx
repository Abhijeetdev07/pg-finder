import { useEffect, useState } from 'react'
import api from '../utils/api.js'

export default function MyBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadBookings() {
            try {
                setLoading(true)
                const { data } = await api.get('/api/bookings/me')
                setBookings(data.items || [])
            } catch (err) {
                console.error('Error loading bookings:', err)
            } finally {
                setLoading(false)
            }
        }
        loadBookings()
    }, [])

    if (loading) {
        return (
            <section className="p-4">
                <h1 className="text-2xl font-semibold">My Bookings</h1>
                <p className="text-gray-600">Loading your bookings...</p>
            </section>
        )
    }

    return (
        <section className="p-4 space-y-4">
            <h1 className="text-2xl font-semibold">My Bookings</h1>
            {bookings.length > 0 ? (
                <div className="space-y-3">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="border rounded p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{booking.listingId?.name || 'Unknown Listing'}</h3>
                                    <p className="text-gray-600">{booking.listingId?.address || 'Address not available'}</p>
                                    <p className="text-sm text-gray-600">₹ {Number(booking.listingId?.pricePerMonth || 0).toLocaleString()}/month</p>
                                    
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            booking.status === 'visited' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                        
                                        {booking.startDate && (
                                            <span className="text-sm text-gray-600">
                                                Start: {new Date(booking.startDate).toLocaleDateString()}
                                            </span>
                                        )}
                                        
                                        {booking.durationMonths && (
                                            <span className="text-sm text-gray-600">
                                                Duration: {booking.durationMonths} months
                                            </span>
                                        )}
                                    </div>
                                    
                                    {booking.visitRequested && (
                                        <p className="text-sm text-blue-600 mt-1">Visit requested</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-600 text-lg">No bookings found</p>
                    <p className="text-gray-500">Start exploring PGs to make your first booking!</p>
                </div>
            )}
        </section>
    )
}


