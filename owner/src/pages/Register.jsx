import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/authOwner/slice.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector((s) => s.authOwner.status);
  const error = useSelector((s) => s.authOwner.error);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '',
    _showPwd: false,
    _showPwd2: false,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      return;
    }

    const res = await dispatch(register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password
    }));
    
    if (res.meta.requestStatus === 'fulfilled') {
      const to = location.state?.from?.pathname || '/dashboard';
      navigate(to, { replace: true });
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] grid place-items-center p-4">
      <div className="w-full max-w-md bg-white sm:border sm:rounded-xl sm:shadow-md sm:p-8 p-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Owner Registration</h1>
          <p className="text-gray-600 mt-2">Create your owner account to manage PGs</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input 
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              type="text" 
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              required 
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input 
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              required 
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input 
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              type="tel" 
              value={form.phone} 
              onChange={(e) => setForm({...form, phone: e.target.value})} 
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input 
                className="w-full h-10 pr-10 pl-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                type={form._showPwd ? 'text' : 'password'} 
                value={form.password} 
                onChange={(e) => setForm({...form, password: e.target.value})} 
                required 
                placeholder="********"
                minLength={6}
              />
              <button
                type="button"
                aria-label={form._showPwd ? 'Hide password' : 'Show password'}
                onClick={() => setForm((f) => ({ ...f, _showPwd: !f._showPwd }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
              >
                {form._showPwd ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input 
                className={`w-full h-10 pr-10 pl-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  form.confirmPassword && form.password !== form.confirmPassword 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                }`}
                type={form._showPwd2 ? 'text' : 'password'} 
                value={form.confirmPassword} 
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})} 
                required 
                placeholder="********"
                minLength={6}
              />
              <button
                type="button"
                aria-label={form._showPwd2 ? 'Hide confirm password' : 'Show confirm password'}
                onClick={() => setForm((f) => ({ ...f, _showPwd2: !f._showPwd2 }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
              >
                {form._showPwd2 ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === 'loading' || (form.confirmPassword && form.password !== form.confirmPassword)} 
            className="w-full h-10 rounded-md bg-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            {status === 'loading' ? 'Creating Account...' : 'Create Owner Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
