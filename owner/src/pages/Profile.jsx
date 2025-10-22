import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { CiLock } from "react-icons/ci";
import { fetchProfile, updateProfile } from '../features/profile/slice.js';
import { setUser } from '../features/authOwner/slice.js';
import { showToast } from '../features/ui/slice.js';
import { AiOutlineEdit, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useEffect, useState } from 'react';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((s) => s.profile);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProfile());
    }
  }, [status, dispatch]);
  
  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' });
  }, [user]);

  const isLoading = status === 'loading' && !user;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Only send name and phone, exclude email since it's not editable
      const updateData = { name: form.name, phone: form.phone };
      const res = await dispatch(updateProfile(updateData));
      if (res.meta.requestStatus === 'fulfilled') {
        // Update the auth user state with new profile data
        dispatch(setUser(res.payload.user || { ...form, ...updateData }));
        // Refresh profile data to get updated info
        dispatch(fetchProfile());
        dispatch(showToast({ type: 'success', message: 'Profile saved successfully' }));
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="h-screen bg-gray-50 pt-[52px]">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Profile</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your account information</p>
          </div>
          {isLoading && <div className="p-4 text-sm text-gray-600">Loading…</div>}
          {error && <div className="border border-red-200 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}
          {user && (
            !editing ? (
              <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 max-w-2xl">
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</span>
                    <div className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-900">
                      {user.name || '-'}
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</span>
                    <div className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-900">
                      {user.email || '-'}
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</span>
                    <div className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-900">
                      {user.phone || '-'}
                    </div>
                  </label>
                </div>
                <div className="flex items-center gap-3 mt-8">
                  <button
                    type="button"
                    onClick={()=>{ setEditing(true); setForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' }); }}
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm hover:shadow-md"
                  >
                    <AiOutlineEdit size={18} className="inline mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl shadow-md p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                <div className="space-y-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</span>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      value={form.name} 
                      onChange={(e)=>setForm((f)=>({ ...f, name: e.target.value }))} 
                      placeholder="Enter your name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</span>
                    <input 
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-100 cursor-not-allowed" 
                      value={form.email} 
                      readOnly
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"> <span className='inline-block'><CiLock /></span>Email cannot be changed</p>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</span>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={form.phone}
                      onChange={(e)=>{
                        const onlyDigits = e.target.value.replace(/\D/g, '');
                        setForm((f)=>({ ...f, phone: onlyDigits }))
                      }}
                      placeholder="Enter your phone number"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3 mt-8">
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <AiOutlineLoading3Quarters className="animate-spin" size={18} />
                        Saving…
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={()=>{ setEditing(false); setForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' }); }} 
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )
          )}
        </main>
      </div>
    </div>
  );
}



