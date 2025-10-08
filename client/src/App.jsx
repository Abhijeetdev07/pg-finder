
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PGDetail from './pages/PGDetail'
import Favorites from './pages/Favorites'
import Book from './pages/Book'
import RequestVisit from './pages/RequestVisit'
import Auth from './pages/Auth'
import OwnerDashboard from './pages/OwnerDashboard'
import MyBookings from './pages/MyBookings'
import MyInquiries from './pages/MyInquiries'
import OwnerListings from './pages/OwnerListings'
import AddListing from './pages/AddListing'
import EditListing from './pages/EditListing'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh flex flex-col">
        <Navbar />
        <main className="container flex-1 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pg/:id" element={<PGDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route element={<ProtectedRoute />}> 
              <Route path="/book/:id" element={<Book />} />
              <Route path="/request-visit/:id" element={<RequestVisit />} />
              <Route path="/me/bookings" element={<MyBookings />} />
              <Route path="/me/inquiries" element={<MyInquiries />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["owner"]} />}> 
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/listings" element={<OwnerListings />} />
              <Route path="/owner/listings/new" element={<AddListing />} />
              <Route path="/owner/listings/:id/edit" element={<EditListing />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  )
}


export default App
