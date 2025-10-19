import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authOwner/slice.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector((s) => s.authOwner.status);
  const error = useSelector((s) => s.authOwner.error);
  const [form, setForm] = useState({ email: '', password: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === 'fulfilled') {
      const to = location.state?.from?.pathname || '/dashboard';
      navigate(to, { replace: true });
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] grid place-items-center p-4">
      <div className="w-full max-w-[420px] bg-white border rounded-xl shadow-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Owner Login</h1>
          <p className="text-gray-600 mt-2">Sign in to your owner account</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
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
              Password
            </label>
            <div className="relative">
              <input 
                className="w-full h-10 pr-10 pl-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                type={form._showPwd ? 'text' : 'password'} 
                value={form.password} 
                onChange={(e) => setForm({...form, password: e.target.value})} 
                required 
                placeholder="Enter your password"
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
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={status === 'loading'} 
            className="w-full h-10 rounded-md bg-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

