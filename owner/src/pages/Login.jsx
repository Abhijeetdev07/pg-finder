import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from 'react-icons/ai';
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
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login({ email: form.email, password: form.password }));
    if (res.meta.requestStatus === 'fulfilled') {
      const to = location.state?.from?.pathname || '/dashboard';
      navigate(to, { replace: true });
    }
  };

  return (
    <main className="min-h-screen grid place-items-center">
      <div className="w-full max-w-[420px] bg-white border rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Owner Login</h1>
        <p className="text-gray-500 mb-5 text-center">Sign in to manage your PGs</p>
        <form onSubmit={onSubmit} className="space-y-6">
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
              type={showPwd ? 'text' : 'password'} 
              value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})} 
              required 
              placeholder=""
            />
            <label 
              htmlFor="password"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPwd ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
          <button type="submit" disabled={status==='loading'} className="w-full h-10 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            {status==='loading' ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                Signing in…
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="mt-3 text-center text-sm">New here? <Link to="/register" className="underline">Create an account</Link></p>
      </div>
    </main>
  );
}

