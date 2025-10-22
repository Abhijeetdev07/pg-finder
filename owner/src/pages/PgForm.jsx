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
    <div className="h-screen bg-gray-50 pt-[52px] overflow-y-hidden">
      <OwnerNavbar />
      <div className="mx-auto max-w-7xl flex h-full">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-52px)] max-[764px]:ml-0">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{isEdit ? 'Edit PG' : 'Add New PG'}</h1>
              <p className="text-sm text-gray-600 mt-1">{isEdit ? 'Update your PG property details' : 'Fill in the details to add a new PG property'}</p>
            </div>

            <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm">
              {/* Basic Information Section */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-1.5 block">Property Title *</span>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      placeholder="e.g., Cozy PG near University"
                      value={form.title} 
                      onChange={(e)=>onChange('title', e.target.value)} 
                      required 
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-1.5 block">Description *</span>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-y" 
                      placeholder="Describe your PG property, facilities, and nearby amenities..."
                      value={form.description} 
                      onChange={(e)=>onChange('description', e.target.value)} 
                      required 
                    />
                  </label>
                </div>
              </div>

              {/* Photos Section */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Photos</h2>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1.5 block">Upload Images</span>
                  <Uploader value={form.photos} onChange={(urls)=>onChange('photos', urls)} />
                </label>
              </div>

              {/* Pricing & Amenities Section */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Amenities</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1.5 block">Monthly Rent (₹) *</span>
                      <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="e.g., 8000"
                        value={form.rent} 
                        onChange={(e)=>onChange('rent', e.target.value)} 
                        required 
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1.5 block">Security Deposit (₹)</span>
                      <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="e.g., 10000"
                        value={form.deposit} 
                        onChange={(e)=>onChange('deposit', e.target.value)} 
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-1.5 block">Facilities</span>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g., WiFi, AC, Laundry, Parking (comma separated)"
                      value={amenitiesText}
                      onChange={(e)=>{
                        const val = e.target.value;
                        setAmenitiesText(val);
                        const list = val.split(',').map(s=>s.trim()).filter(Boolean);
                        onChange('amenities', list);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Separate multiple facilities with commas</p>
                  </label>
                </div>
              </div>
              {/* Location & Details Section */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Location & Details</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-1.5 block">Full Address *</span>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      placeholder="e.g., 123 Main Street, Sector 5"
                      value={form.address} 
                      onChange={(e)=>onChange('address', e.target.value)} 
                      required 
                    />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1.5 block">City *</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="e.g., Mumbai"
                        value={form.city} 
                        onChange={(e)=>onChange('city', e.target.value)} 
                        required 
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1.5 block">Nearby College</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="e.g., IIT Mumbai"
                        value={form.college} 
                        onChange={(e)=>onChange('college', e.target.value)} 
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1.5 block">Gender Preference</span>
                      <select 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white" 
                        value={form.gender} 
                        onChange={(e)=>onChange('gender', e.target.value)}
                      >
                        <option value="co-ed">Co-ed</option>
                        <option value="male">Male Only</option>
                        <option value="female">Female Only</option>
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-1.5 block">Rooms Available</span>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      placeholder="e.g., 5"
                      value={form.roomsAvailable} 
                      onChange={(e)=>onChange('roomsAvailable', e.target.value)} 
                    />
                  </label>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button 
                    type="button" 
                    onClick={()=>navigate('/listings')} 
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || status==='loading'} 
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : (
                      isEdit ? 'Update PG' : 'Create PG'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

