import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, selectAuth } from '../features/auth/slice.js';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(selectAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/', { replace: true });
    }
  };

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-[480px] bg-white border rounded-xl shadow-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-600 mt-2">Join PG-Hub today</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <input 
              id="name"
              className="peer w-full h-12 px-3 pt-5 pb-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" 
              type="text" 
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              required 
              placeholder=""
            />
            <label 
              htmlFor="name"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Full Name
            </label>
          </div>

          <div className="relative">
            <input 
              id="email"
              className="peer w-full h-12 px-3 pt-5 pb-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              required 
              placeholder=""
            />
            <label 
              htmlFor="email"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Email Address
            </label>
          </div>

          <div className="relative">
            <input 
              id="password"
              className="peer w-full h-12 px-3 pt-5 pb-1 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" 
              type={showPassword ? 'text' : 'password'} 
              value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})} 
              required 
              placeholder=""
              minLength={6}
            />
            <label 
              htmlFor="password"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === 'loading'} 
            className="w-full h-10 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
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


