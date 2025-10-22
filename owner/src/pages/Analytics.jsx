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
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function Analytics() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((s) => s.analytics);

  useEffect(() => {
    // Avoid duplicate fetches in StrictMode by only fetching from idle state
    if (status === 'idle') {
      dispatch(fetchAnalytics());
    }
  }, [status, dispatch]);

  const isLoading = status === 'loading' && !data;

  // Chart colors
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Prepare data for charts
  const bookingStatusData = data ? [
    { name: 'Approved', value: data.approvedBookings, color: '#10b981' },
    { name: 'Pending', value: data.totalBookings - data.approvedBookings, color: '#f59e0b' },
  ] : [];

  const overviewData = data ? [
    { name: 'Listings', value: data.totalListings, color: '#3b82f6' },
    { name: 'Inquiries', value: data.totalInquiries, color: '#8b5cf6' },
    { name: 'Bookings', value: data.totalBookings, color: '#10b981' },
    { name: 'Reviews', value: data.ratingCount, color: '#f59e0b' },
  ] : [];

  const performanceData = data ? [
    { category: 'Listings', count: data.totalListings },
    { category: 'Inquiries', count: data.totalInquiries },
    { category: 'Bookings', count: data.totalBookings },
    { category: 'Approved', count: data.approvedBookings },
  ] : [];

  return (
    <div className="bg-gray-50 pt-[52px] min-h-screen overflow-x-hidden">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 p-4 max-[764px]:ml-0 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-52px)] w-full">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Overview of your PG business performance</p>
              </div>
              <button 
              onClick={() => dispatch(fetchAnalytics())} 
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RiRefreshLine className="text-gray-600" size={20} />
            </button>
            </div>
          </div>
          {isLoading && (
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
            <div className="space-y-6 w-full">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Listings */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-blue-600 font-medium">Total Listings</div>
                      <div className="text-2xl sm:text-3xl font-bold text-blue-800 mt-1">{data.totalListings}</div>
                    </div>
                    <AiOutlineHome className="text-blue-400" size={32} />
                  </div>
                </div>

                {/* Total Inquiries */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-purple-600 font-medium">Total Inquiries</div>
                      <div className="text-2xl sm:text-3xl font-bold text-purple-800 mt-1">{data.totalInquiries}</div>
                    </div>
                    <AiOutlineMessage className="text-purple-400" size={32} />
                  </div>
                </div>

                {/* Total Bookings */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-green-600 font-medium">Total Bookings</div>
                      <div className="text-2xl sm:text-3xl font-bold text-green-800 mt-1">{data.totalBookings}</div>
                    </div>
                    <AiOutlineCalendar className="text-green-400" size={32} />
                  </div>
                </div>

                {/* Avg Rating */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-yellow-600 font-medium">Avg Rating</div>
                      <div className="text-2xl sm:text-3xl font-bold text-yellow-800 mt-1">{(data.avgRating||0).toFixed(1)}</div>
                    </div>
                    <AiOutlineStar className="text-yellow-400" size={32} />
                  </div>
                </div>
              </div>

              {/* Revenue and Approved Bookings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-emerald-600 font-medium">Approved Bookings</div>
                      <div className="text-3xl font-bold text-emerald-800 mt-1">{data.approvedBookings}</div>
                      <div className="text-xs text-emerald-600 mt-1">out of {data.totalBookings} total</div>
                    </div>
                    <AiOutlineCheckCircle className="text-emerald-400" size={40} />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-orange-600 font-medium">Revenue Approx</div>
                      <div className="text-3xl font-bold text-orange-800 mt-1">₹{data.revenueApprox.toLocaleString()}</div>
                      <div className="text-xs text-orange-600 mt-1">from approved bookings</div>
                    </div>
                    <AiOutlineDollarCircle className="text-orange-400" size={40} />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Overview Pie Chart */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg lg:col-span-1">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Overview</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={overviewData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {overviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Custom Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {overviewData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-700">{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-6 shadow-lg lg:col-span-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Performance Overview</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={performanceData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="category" 
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#3b82f6" 
                        radius={[8, 8, 0, 0]}
                        name="Count"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

