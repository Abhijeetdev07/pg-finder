import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api.js'

export default function OwnerListings() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [status, setStatus] = useState('idle')

    useEffect(() => {
        async function load() {
            try {
                setStatus('loading')
                const { data } = await api.get('/api/owners/dashboard/summary')
                setItems(Array.isArray(data.listings) ? data.listings : [])
                setStatus('succeeded')
            } catch {
                setStatus('failed')
            }
        }
        load()
    }, [])

    return (
        <section className="p-4 space-y-4">
            <h1 className="text-2xl font-semibold">My Listings</h1>
            <p className="text-gray-600">Manage your PG listings here.</p>
            {status === 'loading' && <p className="text-sm text-gray-500">Loading...</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((l) => (
                    <button key={l._id} type="button" onClick={() => navigate(`/owner/listings/${l._id}/edit`)} className="text-left border rounded p-3 hover:shadow">
                        <img src={l.photos?.[0]?.url} alt="" className="w-full h-40 object-cover rounded" />
                        <h3 className="mt-2 font-semibold">{l.name}</h3>
                        <p className="text-sm text-gray-600">₹ {Number(l.pricePerMonth).toLocaleString()}</p>
                        <p className="mt-1 text-xs text-gray-500">Click to edit</p>
                    </button>
                ))}
            </div>
            {status === 'succeeded' && items.length === 0 && (
                <p className="text-sm text-gray-500">No listings yet. Create your first listing from Owner Dashboard.</p>
            )}
        </section>
    );
}