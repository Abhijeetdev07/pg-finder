import OwnerNavbar from '../components/OwnerNavbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { createPg, getPgById, updatePg } from '../features/listings/slice.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Uploader from '../components/Uploader.jsx';

const empty = { title:'', description:'', photos:[], rent:'', deposit:'', amenities:[], gender:'co-ed', address:'', city:'', college:'', roomsAvailable:'' };

export default function PgForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, status } = useSelector((s) => s.listings);
  const [form, setForm] = useState(empty);
  const [amenitiesText, setAmenitiesText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) dispatch(getPgById(id));
  }, [id]);

  useEffect(() => {
    if (isEdit && current && current._id === id) {
      const next = {
        title: current.title || '',
        description: current.description || '',
        photos: current.photos || [],
        rent: current.rent ?? '',
        deposit: current.deposit ?? '',
        amenities: current.amenities || [],
        gender: current.gender || 'co-ed',
        address: current.address || '',
        city: current.city || '',
        college: current.college || '',
        roomsAvailable: current.roomsAvailable ?? '',
      };
      setForm(next);
      setAmenitiesText((next.amenities || []).join(','));
    }
  }, [current, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...form,
        rent: Number(form.rent) || 0,
        deposit: Number(form.deposit) || 0,
        roomsAvailable: Number(form.roomsAvailable) || 0,
      };
      
      if (isEdit) {
        const res = await dispatch(updatePg({ id, updates: payload }));
        if (res.meta.requestStatus === 'fulfilled') navigate('/listings');
      } else {
        const res = await dispatch(createPg(payload));
        if (res.meta.requestStatus === 'fulfilled') navigate('/listings');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="h-screen bg-gray-50 pt-[52px]">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-xl font-semibold mb-3">{isEdit ? 'Edit PG' : 'Add PG'}</h1>
          <form onSubmit={onSubmit} className="grid gap-3 bg-white border rounded p-4 max-w-3xl overflow-y-auto max-h-[82vh] border custom-scroll">
            <label className="grid gap-1">
              <span className="text-sm">Title</span>
              <input className="border rounded px-3 h-10" value={form.title} onChange={(e)=>onChange('title', e.target.value)} required />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Description</span>
              <textarea className="border rounded p-2" value={form.description} onChange={(e)=>onChange('description', e.target.value)} required />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Photos</span>
              <Uploader value={form.photos} onChange={(urls)=>onChange('photos', urls)} />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-sm">Rent</span>
                <input type="number" className="border rounded px-3 h-10" value={form.rent} onChange={(e)=>onChange('rent', e.target.value)} required />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">Deposit</span>
                <input type="number" className="border rounded px-3 h-10" value={form.deposit} onChange={(e)=>onChange('deposit', e.target.value)} />
              </label>
            </div>
            <label className="grid gap-1">
              <span className="text-sm">Facilities (comma separated)</span>
              <input
                className="border rounded px-3 h-10"
                value={amenitiesText}
                onChange={(e)=>{
                  const val = e.target.value;
                  setAmenitiesText(val);
                  const list = val.split(',').map(s=>s.trim()).filter(Boolean);
                  onChange('amenities', list);
                }}
              />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="grid gap-1">
                <span className="text-sm">Gender</span>
                <select className="border rounded px-3 h-10" value={form.gender} onChange={(e)=>onChange('gender', e.target.value)}>
                  <option value="co-ed">Co-ed</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm">City</span>
                <input className="border rounded px-3 h-10" value={form.city} onChange={(e)=>onChange('city', e.target.value)} required />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">College</span>
                <input className="border rounded px-3 h-10" value={form.college} onChange={(e)=>onChange('college', e.target.value)} />
              </label>
            </div>
            <label className="grid gap-1">
              <span className="text-sm">Address</span>
              <input className="border rounded px-3 h-10" value={form.address} onChange={(e)=>onChange('address', e.target.value)} required />
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm">Rooms Available</span>
              <input type="number" className="border rounded px-3 h-10" value={form.roomsAvailable} onChange={(e)=>onChange('roomsAvailable', e.target.value)} />
            </label>
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isSubmitting || status==='loading'} 
                className="px-3 py-2 border rounded bg-gray-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update' : 'Create')}
              </button>
              <button 
                type="button" 
                onClick={()=>navigate('/listings')} 
                disabled={isSubmitting}
                className="px-3 py-2 border rounded disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

