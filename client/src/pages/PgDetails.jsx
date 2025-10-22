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
    <div className="min-h-screen p-2 max-w-[1200px] mx-auto pt-[70px]">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold truncate">{pg.title}</h1>
        <button
          onClick={onToggleFavorite}
          className="h-8 w-8 bg-white rounded-full border shadow mr-5 flex items-center justify-center disabled:opacity-60"
          aria-label="Toggle favorite"
          title={favorites.some((f)=> f._id === id) ? 'Remove from favorites' : 'Add to favorites'}
          disabled={isFavLoading}
        >
          {isFavLoading ? (
            <HeartBorderSpinner size={16} color="#ef4444" strokeWidth={2} className="align-middle" />
          ) : favorites.some((f)=> f._id === id) ? (
            <AiFillHeart className="text-red-600" />
          ) : (
            <AiOutlineHeart />
          )}
        </button>
      </div>

      {Array.isArray(pg.photos) && pg.photos.length > 0 && (
        pg.photos.length >= 5 ? (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-[50%_50%] gap-3 rounded overflow-hidden relative">
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
          <div className="flex gap-2 mt-3 flex-wrap">
            {pg.photos.map((url) => (
              <img key={url} src={url} alt={pg.title} className="w-52 h-40 object-cover rounded" />
            ))}
          </div>
        )
      )}

      {showAllPhotos && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={()=>setShowAllPhotos(false)}>
          <div className="bg-white rounded shadow max-w-[1200px] w-full max-h-[90vh] overflow-auto p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">All photos</h3>
              <button className="px-3 py-1 border rounded hover:bg-gray-50"onClick={()=>setShowAllPhotos(false)}>Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pg.photos.map((url, idx) => (
                <img key={`${url}-${idx}`} src={url} alt={`${pg.title} ${idx+1}`} className="w-full h-64 object-cover rounded" />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 space-y-1">
        <p className="mt-5 mb-2 text-lg"><span className="font-semibold">Address:</span> {pg.address}, {pg.city} {pg.college ? `• ${pg.college}` : ''}</p>
        <p className="font-medium">Rent: ₹{pg.rent} <span className="font-normal">/ Deposit: ₹{pg.deposit}</span></p>

      <div className="mt-3 mb-5 border rounded-2xl p-3 bg-white flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 max-w-xl w-full">
          <div className="flex-1 text-left">
          <div className="font-semibold leading-tight text-base sm:text-lg"> Guest favourite</div>
          <p className="text-sm text-gray-600">One of the most loved homes on PG-Hub, according to guests</p>
      </div>
      {/* Divider - hidden on small screens */}
      <div className="hidden sm:block h-8 w-px bg-gray-200" />
        <div className="text-left sm:text-right min-w-[120px]">
          <div className="text-lg sm:text-xl font-bold"> {(pg.ratingAvg ?? 0).toFixed(1)}</div>
           <div className="flex items-center sm:justify-end justify-start gap-1 flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => {
               const filled = i < Math.round(pg.ratingAvg ?? 0);
               return filled ? (
                <AiFillStar key={i} className="text-yellow-400 text-sm" />
              ) : (
               <AiOutlineStar key={i} className="text-gray-300 text-sm" />
             );
             })}
          <span className="text-xs text-gray-500 ml-1 whitespace-nowrap">{pg.ratingCount ?? 0} Reviews</span>
         </div>
        </div>
      </div>

        <div className="max-w-2xl">
          <span className="mr-2 font-semibold">Facilities:</span>
          <span className="inline-flex flex-wrap gap-2 align-middle mt-2">
            {Array.isArray(pg.amenities) && pg.amenities.length > 0 ? (
              pg.amenities.map((a, idx) => (
                <span key={`${a}-${idx}`} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {a}
                </span>
              ))
            ) : null}
          </span>
        </div>
        <p className="mt-5"><span className="font-semibold">Gender:</span> {pg.gender}</p>
      </div>
      <div className="mt-3 border rounded p-3 max-w-2xl">
        <div className="font-semibold mb-1">Description:</div>
        <p className="text-gray-700">{pg.description}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Send Inquiry</h3>
        <form onSubmit={onSendInquiry} className="mt-2 grid gap-2 max-w-xl">
          <textarea className="border rounded p-2 max-w-[400px]" placeholder="Your message" value={inquiryMsg} onChange={(e)=>setInquiryMsg(e.target.value)} required />
          <button 
            type="submit" 
            disabled={inquiryStatus === 'loading'}
            className="px-3 py-1 border rounded hover:bg-black bg-black/90 w-max text-white transition-all ease-in-out duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {inquiryStatus === 'loading' && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {inquiryStatus === 'loading' ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Book</h3>
        {existingBookings.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="text-blue-800">
              <strong>Note:</strong> Some dates may be unavailable due to existing bookings. 
              Please select dates that don't conflict with already booked periods.
            </p>
          </div>
        )}
        {hasPendingBooking ? (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              <strong>Booking Request Pending:</strong> You already have a pending booking request for this PG. 
              Please wait for the owner to respond before making another request.
            </p>
          </div>
        ) : (
          // <form onSubmit={onBook} className="mt-2 flex gap-2 items-center">
          //   <input className="border rounded p-2" type="date" value={bookingDates.from} onChange={(e)=>setBookingDates({...bookingDates, from: e.target.value})} required />
          //   <input className="border rounded p-2" type="date" value={bookingDates.to} onChange={(e)=>setBookingDates({...bookingDates, to: e.target.value})} required />
          //   <button type="submit" className="px-3 py-1 border rounded hover:bg-gray-50">Request Booking</button>
          // </form>
          <form onSubmit={onBook} className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-start w-full max-w-md">
             <input 
               className="border rounded p-2 text-sm sm:text-base w-full sm:w-auto cursor-pointer"  
               type="date" 
               value={bookingDates.from} 
               onChange={(e) => setBookingDates({ ...bookingDates, from: e.target.value })} 
               min={getToday()}
               required 
             />
             <input 
               className="border rounded p-2 text-sm sm:text-base w-full sm:w-auto cursor-pointer" 
               type="date" 
               value={bookingDates.to} 
               onChange={(e) => setBookingDates({ ...bookingDates, to: e.target.value })} 
               min={bookingDates.from || getToday()}
               required 
             />
             <button 
               type="submit" 
               disabled={bookingStatus === 'loading'}
               className="px-4 py-2 border rounded bg-black/90 hover:bg-black text-sm sm:text-base text-white cursor-pointer whitespace-nowrap text-left transition-all ease-in-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {bookingStatus === 'loading' && (
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               )}
               {bookingStatus === 'loading' ? 'Requesting...' : 'Request Booking'}
             </button>
          </form>



        )}
      </div>

      <ReviewSection pgId={id} />
    </div>
  );
}


