import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../features/profile/slice.js';
import { setUser } from '../features/authOwner/slice.js';
import { showToast } from '../features/ui/slice.js';
import { AiOutlineEdit } from 'react-icons/ai';
import { useEffect, useState } from 'react';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((s) => s.profile);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => { dispatch(fetchProfile()); }, []);
  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' });
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await dispatch(updateProfile(form));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(setUser(form));
        dispatch(showToast({ type: 'success', message: 'Profile saved successfully' }));
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-xl font-semibold mb-3">Profile</h1>
          {status==='loading' && <div className="border rounded bg-white p-3 text-sm">Loading…</div>}
          {error && <div className="border rounded bg-white p-3 text-sm text-red-600">{error}</div>}
          {user && (
            !editing ? (
              <div className="grid gap-3 bg-white border rounded p-4 max-w-lg relative">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="text-base">{user.name || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-base">{user.email || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="text-base">{user.phone || '-'}</div>
                </div>
                <button
                  type="button"
                  onClick={()=>{ setEditing(true); setForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' }); }}
                  className="absolute right-3 bottom-3 p-2 border rounded hover:bg-gray-50"
                  aria-label="Edit profile"
                  title="Edit"
                >
                  <AiOutlineEdit />
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-3 bg-white border rounded p-4 max-w-lg">
                <label className="grid gap-1">
                  <span className="text-sm">Name</span>
                  <input className="border rounded px-3 h-10" value={form.name} onChange={(e)=>setForm((f)=>({ ...f, name: e.target.value }))} />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm">Email</span>
                  <input 
                    type="email"
                    className="border rounded px-3 h-10" 
                    value={form.email} 
                    onChange={(e)=>setForm((f)=>({ ...f, email: e.target.value }))} 
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm">Phone</span>
                  <input
                    className="border rounded px-3 h-10"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form.phone}
                    onChange={(e)=>{
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      setForm((f)=>({ ...f, phone: onlyDigits }))
                    }}
                  />
                </label>
                <div className="flex items-center gap-2">
                  <button type="submit" disabled={saving} className="px-3 py-2 border rounded bg-gray-900 text-white w-max disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
                  <button type="button" onClick={()=>{ setEditing(false); setForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' }); }} className="px-3 py-2 border rounded w-max">Cancel</button>
                </div>
              </form>
            )
          )}
        </main>
      </div>
    </div>
  );
}

