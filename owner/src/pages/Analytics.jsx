import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RiRefreshLine } from "react-icons/ri";
import { fetchAnalytics } from '../features/analytics/slice.js';
import { 
  AiOutlineHome, 
  AiOutlineMessage, 
  AiOutlineCalendar, 
  AiOutlineStar,
  AiOutlineCheckCircle,
  AiOutlineDollarCircle
} from 'react-icons/ai';

export default function Analytics() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((s) => s.analytics);

  useEffect(() => { dispatch(fetchAnalytics()); }, []);
  return (
    <div className="bg-gray-50 pt-[52px] h-screen">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4 max-[764px]:ml-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">Analytics</h1>
          </div>
          {status==='loading' && (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i)=> (
                <div key={i} className={`rounded-xl border bg-white p-4 ${i===5 ? 'col-span-2' : ''}`}>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}
          {error && <div className="border rounded bg-white p-3 text-sm text-red-600">{error}</div>}
          {data && (
            <div className="grid grid-cols-2 gap-4">
              {/* Total Listings */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-blue-600 font-medium">Total Listings</div>
                    <div className="text-xl sm:text-3xl font-bold text-blue-800 mt-1">{data.totalListings}</div>
                  </div>
                </div>
              </div>

              {/* Total Inquiries */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-purple-600 font-medium">Total Inquiries</div>
                    <div className="text-xl sm:text-3xl font-bold text-purple-800 mt-1">{data.totalInquiries}</div>
                  </div>
                </div>
              </div>

              {/* Total Bookings */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-green-600 font-medium">Total Bookings</div>
                    <div className="text-xl sm:text-3xl font-bold text-green-800 mt-1">{data.totalBookings}</div>
                  </div>
                </div>
              </div>

              {/* Avg Rating */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-yellow-600 font-medium">Avg Rating</div>
                    <div className="text-xl sm:text-3xl font-bold text-yellow-800 mt-1">{(data.avgRating||0).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Rating Count */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-indigo-600 font-medium">Rating Count</div>
                    <div className="text-xl sm:text-3xl font-bold text-indigo-800 mt-1">{data.ratingCount}</div>
                  </div>
                </div>
              </div>

              {/* Approved Bookings */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-emerald-600 font-medium">Approved Bookings</div>
                    <div className="text-xl sm:text-3xl font-bold text-emerald-800 mt-1">{data.approvedBookings}</div>
                  </div>
                </div>
              </div>

              {/* Revenue Approx */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-orange-600 font-medium">Revenue Approx</div>
                    <div className="text-xl sm:text-3xl font-bold text-orange-800 mt-1">₹{data.revenueApprox}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

