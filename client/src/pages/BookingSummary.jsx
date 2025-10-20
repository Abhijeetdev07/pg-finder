import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchUserBookings } from '../features/bookings/slice.js';

export default function BookingSummary() {
  const dispatch = useDispatch();
  const { items: bookings, status, error } = useSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  if (status === 'loading') return (
    <div className="min-h-screen p-4 pt-[70px]">
      <div className="w-full max-w-[1300px] mx-auto">Loading bookings...</div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen p-4 pt-[70px]">
      <div className="w-full max-w-[1300px] mx-auto text-red-600">Error: {error}</div>
    </div>
  );
  if (!bookings || bookings.length === 0) {
    return (
      <div className="min-h-screen p-4 pt-[70px]">
        <div className="w-full max-w-[1300px] mx-auto">
          <h1 className="text-xl font-semibold mb-4">My Bookings</h1>
          <p>No bookings found.</p>
          <Link to="/" className="text-blue-600 hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-[70px]">
      <div className="w-full max-w-[1300px] mx-auto">
        <h1 className="text-xl font-semibold mb-4">My Bookings</h1>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{booking.pgId?.title || 'PG Listing'}</h3>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {booking.pgId?.city && `${booking.pgId.city} • `}
                {booking.pgId?.rent && `₹${booking.pgId.rent}/month`}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Dates:</strong> {new Date(booking.dates.from).toLocaleDateString()} - {new Date(booking.dates.to).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Booked on: {new Date(booking.createdAt).toLocaleDateString()}
              </p>
              {booking.pgId && (
                <Link 
                  to={`/pg/${booking.pgId._id}`} 
                  className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                >
                  View PG Details
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


