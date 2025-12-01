import { Link } from 'react-router-dom';
import { AiOutlineHome, AiOutlineMail, AiOutlinePhone, AiOutlineGithub, AiOutlineTwitter, AiOutlineInstagram } from 'react-icons/ai';
import navlogo from '../assets/navlogo.png';

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div> 
            {/* <h3 className="text-white font-bold text-lg mb-4">PG-Hub</h3> */}
            <Link to="/" className="w-[110px] h-[40px] flex items-center justify-center mb-5"><img className='w-full h-full' src={navlogo} alt="navlogo" /></Link>

            <p className="text-sm text-gray-400 leading-relaxed">
              Find your perfect PG accommodation. Connect with verified property owners and discover comfortable living spaces.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <AiOutlineTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <AiOutlineInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <AiOutlineGithub size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <AiOutlineMail className="mt-0.5 flex-shrink-0" size={16} />
                <span>support@pghub.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <AiOutlinePhone className="mt-0.5 flex-shrink-0" size={16} />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <AiOutlineHome className="mt-0.5 flex-shrink-0" size={16} />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} PG-Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


