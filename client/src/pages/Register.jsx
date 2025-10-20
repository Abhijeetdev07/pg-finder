import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, selectAuth } from '../features/auth/slice.js';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(selectAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/', { replace: true });
    }
  };

  return (
    <main className="min-h-screen grid place-items-center">
      <div className="w-full max-w-[480px] bg-white border rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Create account</h1>
        <p className="text-gray-500 mb-5 text-center">Join PG-Hub</p>
        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Name</span>
            <input aria-label="Name" placeholder="Your name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required className="w-full h-10 px-3 border rounded-md" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Email</span>
            <input aria-label="Email" placeholder="you@example.com" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required className="w-full h-10 px-3 border rounded-md" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Password</span>
            <input aria-label="Password" placeholder="••••••••" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required className="w-full h-10 px-3 border rounded-md" />
          </label>
          {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
          <button type="submit" disabled={status==='loading'} className="h-10 rounded-md bg-indigo-600 text-white font-semibold disabled:opacity-80">{status==='loading' ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="mt-3 text-center text-sm">Already have an account? <Link to="/login" className="underline">Login</Link></p>
      </div>
    </main>
  );
}


