import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authOwner/slice.js';
import { useNavigate, useLocation } from 'react-router-dom';

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
      <div className="w-full max-w-[420px] bg-white border rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Owner Login</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Email</span>
            <input className="w-full h-10 px-3 border rounded-md" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Password</span>
            <input className="w-full h-10 px-3 border rounded-md" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
          </label>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button type="submit" disabled={status==='loading'} className="h-10 rounded-md bg-indigo-600 text-white font-semibold disabled:opacity-80">{status==='loading' ? 'Signing in…' : 'Login'}</button>
        </form>
      </div>
    </main>
  );
}

