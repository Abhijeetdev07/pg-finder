import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../lib/axios.js';
import { createInquiry } from '../features/inquiries/slice.js';
import { createBooking, fetchUserBookings } from '../features/bookings/slice.js';
import { addFavorite, removeFavorite } from '../features/favorites/slice.js';
import { showToast } from '../features/ui/slice.js';
import { AiOutlineHeart, AiFillHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai';
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
  const favorites = useSelector((s) => s.favorites.items);
  const bookings = useSelector((s) => s.bookings.items);
  
  // Check if user has a pending booking for this PG
  const hasPendingBooking = bookings.some(booking => 
    booking.pgId === id && booking.status === 'requested'
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const pgRes = await api.get(`/api/pgs/${id}`);
        if (!mounted) return;
        setPg(pgRes.data.data);
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
    if (isFav) {
      await dispatch(removeFavorite(id));
    } else {
      await dispatch(addFavorite(id));
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!pg) return <div className="p-4">Not found</div>;

  return (
    <div className="min-h-screen p-2 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold truncate">{pg.title}</h1>
        <button
          onClick={onToggleFavorite}
          className="p-2 bg-white rounded-full border shadow mr-5"
          aria-label="Toggle favorite"
          title={favorites.some((f)=> f._id === id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorites.some((f)=> f._id === id) ? <AiFillHeart className="text-red-600" /> : <AiOutlineHeart />}
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
              Show all photos
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

        {/* Guest favourite badge */}
        <div className="mt-3 mb-5 border rounded-2xl p-3 bg-white flex items-center gap-4 max-w-xl">
          <div className="flex-1">
            <div className="font-semibold leading-tight">Guest favourite</div>
            <p className="text-sm text-gray-600">One of the most loved homes on PG-Hub, according to guests</p>
          </div>
          <div className="hidden sm:block h-8 w-px bg-gray-200" />
          <div className="text-right min-w-[120px]">
            <div className="text-xl font-bold">{(pg.ratingAvg ?? 0).toFixed(1)}</div>
            <div className="flex items-center justify-end gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.round(pg.ratingAvg ?? 0);
                return filled ? (
                  <AiFillStar key={i} className="text-yellow-400 text-sm" />
                ) : (
                  <AiOutlineStar key={i} className="text-gray-300 text-sm" />
                );
              })}
              <span className="text-xs text-gray-500 ml-1">{pg.ratingCount ?? 0} Reviews</span>
            </div>
          </div>
        </div>
        <div className="max-w-2xl">
          <span className="mr-2 font-semibold">Amenities:</span>
          <span className="inline-flex flex-wrap gap-2 align-middle">
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
          <textarea className="border rounded p-2" placeholder="Your message" value={inquiryMsg} onChange={(e)=>setInquiryMsg(e.target.value)} required />
          <button type="submit" className="px-3 py-1 border rounded hover:bg-gray-50 w-max">Send</button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Book</h3>
        {hasPendingBooking ? (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              <strong>Booking Request Pending:</strong> You already have a pending booking request for this PG. 
              Please wait for the owner to respond before making another request.
            </p>
          </div>
        ) : (
          <form onSubmit={onBook} className="mt-2 flex gap-2 items-center">
            <input className="border rounded p-2" type="date" value={bookingDates.from} onChange={(e)=>setBookingDates({...bookingDates, from: e.target.value})} required />
            <input className="border rounded p-2" type="date" value={bookingDates.to} onChange={(e)=>setBookingDates({...bookingDates, to: e.target.value})} required />
            <button type="submit" className="px-3 py-1 border rounded hover:bg-gray-50">Request Booking</button>
          </form>
        )}
      </div>

      <ReviewSection pgId={id} />
    </div>
  );
}


