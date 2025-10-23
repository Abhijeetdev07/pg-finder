import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../lib/axios.js';
import { createInquiry } from '../features/inquiries/slice.js';
import { createBooking, fetchUserBookings } from '../features/bookings/slice.js';
import { addFavorite, removeFavorite } from '../features/favorites/slice.js';
import { showToast } from '../features/ui/slice.js';
import { AiOutlineHeart, AiFillHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BiSolidGrid } from "react-icons/bi";
import HeartBorderSpinner from '../components/Heartload.jsx';
import ReviewSection from '../components/ReviewSection.jsx';

export default function PgDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [bookingDates, setBookingDates] = useState({ from: '', to: '' });
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);
  const favorites = useSelector((s) => s.favorites.items);
  const bookings = useSelector((s) => s.bookings.items);
  const inquiryStatus = useSelector((s) => s.inquiries.status);
  const bookingStatus = useSelector((s) => s.bookings.status);
  
  // Check if user has a pending booking for this PG
  const hasPendingBooking = bookings.some(booking => 
    booking.pgId === id && booking.status === 'requested'
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [pgRes, bookingsRes] = await Promise.all([
          api.get(`/api/pgs/${id}`),
          api.get(`/api/bookings/pg/${id}`)
        ]);
        if (!mounted) return;
        setPg(pgRes.data.data);
        setExistingBookings(bookingsRes.data.data || []);
        setError(null);
        await dispatch(fetchUserBookings());
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [id]);

  // Map removed (no location fields)

  // Get today's date in YYYY-MM-DD format
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Check if a date is disabled (past date or conflicts with existing bookings)
  const isDateDisabled = (date) => {
    const today = getToday();
    if (date < today) return true;

    // Check for conflicts with existing bookings
    const selectedDate = new Date(date);
    return existingBookings.some(booking => {
      const fromDate = new Date(booking.dates.from);
      const toDate = new Date(booking.dates.to);
      return selectedDate >= fromDate && selectedDate <= toDate;
    });
  };

  // Check if date range conflicts with existing bookings
  const hasDateConflict = (fromDate, toDate) => {
    if (!fromDate || !toDate) return false;
    
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    return existingBookings.some(booking => {
      const bookingFrom = new Date(booking.dates.from);
      const bookingTo = new Date(booking.dates.to);
      
      // Check for overlap
      return (from <= bookingTo && to >= bookingFrom);
    });
  };

  const requireAuth = () => {
    if (!token) {
      navigate('/login', { replace: true, state: { from: { pathname: `/pg/${id}` } } });
      return false;
    }
    return true;
  };

  const onToggleFavorite = async () => {
    if (!requireAuth()) return;
    const isFav = favorites.some((f) => f._id === id);
    if (isFavLoading) return;
    try {
      setIsFavLoading(true);
      if (isFav) {
        await dispatch(removeFavorite(id));
      } else {
        await dispatch(addFavorite(id));
      }
    } finally {
      setIsFavLoading(false);
    }
  };

  const onSendInquiry = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    const res = await dispatch(createInquiry({ pgId: id, message: inquiryMsg }));
    if (res.meta.requestStatus === 'fulfilled') alert('Inquiry sent');
    setInquiryMsg('');
  };

  const onBook = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!bookingDates.from || !bookingDates.to || bookingDates.from > bookingDates.to) {
      dispatch(showToast({ type: 'error', message: 'Please select a valid date range' }));
      return;
    }
    
    // Check for date conflicts
    if (hasDateConflict(bookingDates.from, bookingDates.to)) {
      dispatch(showToast({ type: 'error', message: 'Selected dates are already booked by another user' }));
      return;
    }
    
    const res = await dispatch(createBooking({ pgId: id, dates: bookingDates }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: 'Booking requested successfully!' }));
      navigate('/booking/summary');
    } else if (res.meta.requestStatus === 'rejected') {
      // Error message is already handled by the axios interceptor and shown via toast
      // The error message from backend will be displayed
    }
    setBookingDates({ from: '', to: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-2 max-w-[1200px] mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        {/* Photos skeleton */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-[50%_50%] gap-3 rounded overflow-hidden">
          <div className="h-[420px] bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[206px] bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="mt-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-80"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
          
          {/* Guest favourite skeleton */}
          <div className="border rounded-2xl p-3 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
              </div>
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <div className="min-w-[120px]">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>
          
          {/* Facilities skeleton */}
          <div className="max-w-2xl">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
              ))}
            </div>
          </div>
          
          {/* Description skeleton */}
          <div className="border rounded p-3 max-w-2xl">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
          
          {/* Forms skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse w-96 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            
            <div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!pg) return <div className="p-4">Not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-[70px] pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{pg.title}</h1>
          <button
            onClick={onToggleFavorite}
            className="h-10 w-10 bg-white rounded-full border-2 border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-60 transition-all flex-shrink-0"
            aria-label="Toggle favorite"
            title={favorites.some((f)=> f._id === id) ? 'Remove from favorites' : 'Add to favorites'}
            disabled={isFavLoading}
          >
            {isFavLoading ? (
              <HeartBorderSpinner size={20} color="#ef4444" strokeWidth={2} className="align-middle" />
            ) : favorites.some((f)=> f._id === id) ? (
              <AiFillHeart className="text-red-500" size={22} />
            ) : (
              <AiOutlineHeart size={22} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Photo Gallery - Original Structure */}
        {Array.isArray(pg.photos) && pg.photos.length > 0 && (
          pg.photos.length >= 5 ? (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-[50%_50%] gap-3 rounded overflow-hidden relative mb-6">
              <div>
                <img src={pg.photos[0]} alt={pg.title} className="w-full h-[420px] object-cover rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {pg.photos.slice(1,5).map((url, idx) => (
                  <img key={`${url}-${idx}`} src={url} alt={`${pg.title} ${idx+2}`} className="w-full h-[206px] object-cover rounded" />
                ))}
              </div>
              <button onClick={()=>setShowAllPhotos(true)}
                className="absolute bottom-3 right-3 inline-flex items-center gap-2 px-3 py-1 border rounded-full bg-black/90 hover:bg-black/100 text-sm shadow text-white cursor-pointer transition-all duration-300 ease-in-out">
                <BiSolidGrid/> <span>Show all photos</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mt-3 flex-wrap mb-6">
              {pg.photos.map((url) => (
                <img key={url} src={url} alt={pg.title} className="w-52 h-40 object-cover rounded" />
              ))}
            </div>
          )
        )}

        {/* Photo Gallery Modal */}
        {showAllPhotos && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={()=>setShowAllPhotos(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-[1200px] w-full max-h-[90vh] overflow-auto" onClick={(e)=>e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900">All Photos ({pg.photos.length})</h3>
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  onClick={()=>setShowAllPhotos(false)}
                >
                  Close
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pg.photos.map((url, idx) => (
                  <img 
                    key={`${url}-${idx}`} 
                    src={url} 
                    alt={`${pg.title} ${idx+1}`} 
                    className="w-full h-64 object-cover rounded-lg" 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Property Details and Pricing Card - Row layout for tablet (600px-1024px) */}
        <div className="lg:hidden mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pricing Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">₹{pg.rent?.toLocaleString()}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600">Security Deposit: ₹{pg.deposit?.toLocaleString()}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= Math.round(pg.ratingAvg ?? 0) ? (
                            <AiFillStar className="text-yellow-400" size={18} />
                          ) : (
                            <AiOutlineStar className="text-gray-300" size={18} />
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold text-gray-700">{(pg.ratingAvg ?? 0).toFixed(1)}</span>
                    <span className="text-gray-500">({pg.ratingCount ?? 0})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{pg.address}, {pg.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender Preference</p>
                    <p className="text-gray-900 capitalize">{pg.gender}</p>
                  </div>
                </div>
                {pg.roomsAvailable && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rooms Available</p>
                      <p className="text-gray-900">{pg.roomsAvailable} rooms</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Property Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details - Desktop only (hidden on mobile/tablet since shown above) */}
            <div className="hidden lg:block bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{pg.address}, {pg.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender Preference</p>
                    <p className="text-gray-900 capitalize">{pg.gender}</p>
                  </div>
                </div>
                {pg.roomsAvailable && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rooms Available</p>
                      <p className="text-gray-900">{pg.roomsAvailable} rooms</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Facilities */}
            {Array.isArray(pg.amenities) && pg.amenities.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Facilities & Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {pg.amenities.map((a, idx) => (
                    <span 
                      key={`${a}-${idx}`} 
                      className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Phase 7: Description */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About this place</h3>
              <p className="text-gray-700 leading-relaxed">{pg.description}</p>
            </div>
          </div>

          {/* Sidebar - Pricing Card (Desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">₹{pg.rent?.toLocaleString()}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600">Security Deposit: ₹{pg.deposit?.toLocaleString()}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= Math.round(pg.ratingAvg ?? 0) ? (
                            <AiFillStar className="text-yellow-400" size={18} />
                          ) : (
                            <AiOutlineStar className="text-gray-300" size={18} />
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold text-gray-700">{(pg.ratingAvg ?? 0).toFixed(1)}</span>
                    <span className="text-gray-500">({pg.ratingCount ?? 0})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry and Booking Forms - Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Inquiry Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Send Inquiry</h3>
            <form onSubmit={onSendInquiry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-y" 
                  placeholder="Ask about availability, facilities, or any other questions..."
                  value={inquiryMsg} 
                  onChange={(e)=>setInquiryMsg(e.target.value)} 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={inquiryStatus === 'loading'}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {inquiryStatus === 'loading' && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {inquiryStatus === 'loading' ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </div>

          {/* Booking Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Book this Property</h3>
            
            {existingBookings.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Some dates may be unavailable due to existing bookings.
                  </p>
                </div>
              </div>
            )}
            
            {hasPendingBooking ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-yellow-800 mb-1">Booking Request Pending</p>
                    <p className="text-sm text-yellow-700">
                      You already have a pending booking request for this PG. 
                      Please wait for the owner to respond.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={onBook} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"  
                      type="date" 
                      value={bookingDates.from} 
                      onChange={(e) => setBookingDates({ ...bookingDates, from: e.target.value })} 
                      min={getToday()}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      type="date" 
                      value={bookingDates.to} 
                      onChange={(e) => setBookingDates({ ...bookingDates, to: e.target.value })} 
                      min={bookingDates.from || getToday()}
                      required 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={bookingStatus === 'loading'}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {bookingStatus === 'loading' && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {bookingStatus === 'loading' ? 'Requesting...' : 'Request Booking'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection pgId={id} />
      </div>
    </div>
  );
}


