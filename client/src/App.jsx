import AppRouter from './router/index.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'
import { BrowserRouter } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
      <Footer />
      <Toast />
    </BrowserRouter>
  )
}
