import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function BookingSummary() {
  const { lastCreated, status, error } = useSelector((s) => s.bookings);
  if (status === 'loading') return <div>Submitting booking...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!lastCreated) return <div>No booking found. <Link to="/">Go home</Link></div>;
  return (
    <div>
      <h1>Booking Requested</h1>
      <p>Booking ID: {lastCreated._id}</p>
      <p>Status: {lastCreated.status}</p>
      <Link to={`/pg/${lastCreated.pgId}`}>Back to PG</Link>
    </div>
  );
}


