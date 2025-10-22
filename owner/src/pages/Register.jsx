import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/authOwner/slice.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from 'react-icons/ai';

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
    <main className="min-h-screen grid place-items-center">
      <div className="w-full max-w-[480px] bg-white border rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Owner Registration</h1>
        <p className="text-gray-500 mb-5 text-center">Create account to manage PGs</p>
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
              id="phone"
              className="peer w-full h-12 px-3 pt-5 pb-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" 
              type="tel" 
              value={form.phone} 
              onChange={(e) => setForm({...form, phone: e.target.value})} 
              placeholder=""
            />
            <label 
              htmlFor="phone"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Phone Number (Optional)
            </label>
          </div>

          <div className="relative">
            <input 
              id="password"
              className="peer w-full h-12 px-3 pt-5 pb-1 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors" 
              type={form._showPwd ? 'text' : 'password'} 
              value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})} 
              required 
              minLength={6}
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
              onClick={() => setForm((f) => ({ ...f, _showPwd: !f._showPwd }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {form._showPwd ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input 
              id="confirmPassword"
              className={`peer w-full h-12 px-3 pt-5 pb-1 pr-10 border-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              type={form._showPwd2 ? 'text' : 'password'} 
              value={form.confirmPassword} 
              onChange={(e) => setForm({...form, confirmPassword: e.target.value})} 
              required 
              minLength={6}
              placeholder=""
            />
            <label 
              htmlFor="confirmPassword"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, _showPwd2: !f._showPwd2 }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {form._showPwd2 ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
          <button type="submit" disabled={status==='loading' || (form.confirmPassword && form.password !== form.confirmPassword)} className="w-full h-10 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            {status==='loading' ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                Creating…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>
        <p className="mt-3 text-center text-sm">Already have an account? <Link to="/login" className="underline">Login</Link></p>
      </div>
    </main>
  );
}
