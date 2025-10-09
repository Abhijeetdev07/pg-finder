import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'
import { Link } from 'react-router-dom'

export default function OwnerDashboard() {
    const [kpis, setKpis] = useState({ listingsCount: 0, inquiriesCount: 0, bookingsCount: 0 })
    const [bookings, setBookings] = useState([])
    const [inquiries, setInquiries] = useState([])
    const [tab, setTab] = useState('listings')
    const [updatingInquiry, setUpdatingInquiry] = useState(null)
    const [updatingBooking, setUpdatingBooking] = useState(null)

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get('/api/owners/dashboard/summary')
                setKpis(data)
                
                // Load bookings
                const bookingsRes = await api.get('/api/bookings/owner')
                setBookings(bookingsRes.data.items || [])
                
                // Load inquiries
                const inquiriesRes = await api.get('/api/inquiries/owner')
                setInquiries(inquiriesRes.data.items || [])
            } catch (err) {
                console.error('Error loading dashboard data:', err)
            }
        }
        load()
    }, [])

    const updateInquiryStatus = async (inquiryId, newStatus) => {
        try {
            setUpdatingInquiry(inquiryId)
            await api.patch(`/api/inquiries/${inquiryId}`, { status: newStatus })
            
            // Update local state
            setInquiries(prev => prev.map(inquiry => 
                inquiry._id === inquiryId 
                    ? { ...inquiry, status: newStatus }
                    : inquiry
            ))
        } catch (err) {
            console.error('Error updating inquiry status:', err)
            alert('Failed to update inquiry status')
        } finally {
            setUpdatingInquiry(null)
        }
    }

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            setUpdatingBooking(bookingId)
            await api.patch(`/api/bookings/${bookingId}`, { status: newStatus })
            
            // Update local state
            setBookings(prev => prev.map(booking => 
                booking._id === bookingId 
                    ? { ...booking, status: newStatus }
                    : booking
            ))
        } catch (err) {
            console.error('Error updating booking status:', err)
            alert('Failed to update booking status')
        } finally {
            setUpdatingBooking(null)
        }
    }

    return (
        <section className="p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded p-4"><p className="text-gray-600">Listings</p><p className="text-2xl font-semibold">{kpis.listingsCount}</p></div>
                <div className="border rounded p-4"><p className="text-gray-600">Inquiries</p><p className="text-2xl font-semibold">{kpis.inquiriesCount}</p></div>
                <div className="border rounded p-4"><p className="text-gray-600">Bookings</p><p className="text-2xl font-semibold">{kpis.bookingsCount}</p></div>
            </div>

            <div className="border-b flex gap-4">
                {['listings','add','bookings','inquiries'].map((t) => (
                    <button key={t} className={`px-3 py-2 ${tab === t ? 'border-b-2 border-black' : ''}`} onClick={() => setTab(t)}>{t}</button>
                ))}
            </div>

            <div>
                {tab === 'listings' && (
                    <div className="space-y-3">
                        <p className="text-gray-600">
                            Manage your listings (
                            <Link to="/owner/listings" className="underline">Go to /owner/listings</Link>
                            ).
                        </p>
                        {Array.isArray(kpis.listings) && kpis.listings.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {kpis.listings.slice(0, 6).map((l) => (
                                    <div key={l._id} className="border rounded p-3">
                                        <img src={l.photos?.[0]?.url} alt="" className="w-full h-40 object-cover rounded" />
                                        <h3 className="mt-2 font-semibold">{l.name}</h3>
                                        <p className="text-sm text-gray-600">₹ {Number(l.pricePerMonth).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {tab === 'add' && (
                    <p className="text-gray-600">
                        Create a listing (
                        <Link to="/owner/listings/new" className="underline">link to /owner/listings/new</Link>
                        ).
                    </p>
                )}
                {tab === 'bookings' && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Recent Bookings</h3>
                        {bookings.length > 0 ? (
                            <div className="space-y-3">
                                {bookings.slice(0, 5).map((booking) => (
                                    <div key={booking._id} className="border rounded p-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium">{booking.listingId?.name || 'Unknown Listing'}</p>
                                                <p className="text-sm text-gray-600">Student: {booking.studentId?.name || 'Unknown'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-600">Status:</span>
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        booking.status === 'visited' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>{booking.status}</span>
                                                </div>
                                                {booking.startDate && (
                                                    <p className="text-sm text-gray-600">Start: {new Date(booking.startDate).toLocaleDateString()}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-1 ml-4">
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                                            disabled={updatingBooking === booking._id}
                                                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {updatingBooking === booking._id ? '...' : 'Confirm'}
                                                        </button>
                                                        <button
                                                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                                            disabled={updatingBooking === booking._id}
                                                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            {updatingBooking === booking._id ? '...' : 'Cancel'}
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => updateBookingStatus(booking._id, 'visited')}
                                                        disabled={updatingBooking === booking._id}
                                                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        {updatingBooking === booking._id ? '...' : 'Mark Visited'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No bookings yet.</p>
                        )}
                    </div>
                )}
                {tab === 'inquiries' && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Recent Inquiries</h3>
                        {inquiries.length > 0 ? (
                            <div className="space-y-3">
                                {inquiries.slice(0, 5).map((inquiry) => (
                                    <div key={inquiry._id} className="border rounded p-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium">{inquiry.listingId?.name || 'Unknown Listing'}</p>
                                                <p className="text-sm text-gray-600">From: {inquiry.studentId?.name || 'Unknown Student'}</p>
                                                <p className="text-sm text-gray-600 mt-1">{inquiry.message}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm text-gray-600">Status:</span>
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        inquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>{inquiry.status}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                {inquiry.status === 'open' && (
                                                    <button
                                                        onClick={() => updateInquiryStatus(inquiry._id, 'responded')}
                                                        disabled={updatingInquiry === inquiry._id}
                                                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        {updatingInquiry === inquiry._id ? 'Updating...' : 'Mark as Responded'}
                                                    </button>
                                                )}
                                                {inquiry.status === 'responded' && (
                                                    <button
                                                        onClick={() => updateInquiryStatus(inquiry._id, 'open')}
                                                        disabled={updatingInquiry === inquiry._id}
                                                        className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                                                    >
                                                        {updatingInquiry === inquiry._id ? 'Updating...' : 'Mark as Open'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No inquiries yet.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}


