import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMyInquiries } from '../features/inquiries/inquiriesSlice'
import { FiMessageSquare, FiCalendar, FiMapPin } from 'react-icons/fi'

export default function MyInquiries() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { myInquiries, status, error } = useSelector((s) => s.inquiries)

    useEffect(() => {
        dispatch(fetchMyInquiries())
    }, [dispatch])

    if (status === 'loading') {
        return (
            <section className="p-4">
                <h1 className="text-2xl font-semibold mb-4">My Inquiries</h1>
                <p className="text-gray-600">Loading your inquiries...</p>
            </section>
        )
    }

    if (status === 'failed') {
        return (
            <section className="p-4">
                <h1 className="text-2xl font-semibold mb-4">My Inquiries</h1>
                <p className="text-red-600">Failed to load inquiries: {error?.message || 'Unknown error'}</p>
            </section>
        )
    }

    return (
        <section className="p-4">
            <h1 className="text-2xl font-semibold mb-4">My Inquiries</h1>
            
            {myInquiries.length === 0 ? (
                <div className="text-center py-8">
                    <FiMessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 text-lg">No inquiries sent yet</p>
                    <p className="text-gray-500">Start exploring PGs and send visit requests to see them here!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myInquiries.map((inquiry) => (
                        <div key={inquiry._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg">{inquiry.listingId?.name || 'Unknown PG'}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            inquiry.status === 'responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {inquiry.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <FiMapPin size={14} />
                                            <span>{inquiry.listingId?.address || 'Address not available'}</span>
                                        </div>
                                        {inquiry.listingId?.pricePerMonth && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">₹</span>
                                                <span>{Number(inquiry.listingId.pricePerMonth).toLocaleString()}/month</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded p-3 mb-3">
                                        <p className="text-sm text-gray-700">{inquiry.message}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <FiCalendar size={12} />
                                        <span>Sent on {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                
                                {inquiry.listingId?.photos?.[0]?.url && (
                                    <div className="w-20 h-20 flex-shrink-0">
                                        <img 
                                            src={inquiry.listingId.photos[0].url} 
                                            alt={inquiry.listingId.name}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-3 pt-3 border-t">
                                <button
                                    onClick={() => navigate(`/pg/${inquiry.listingId?._id}`)}
                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                    View PG Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}


