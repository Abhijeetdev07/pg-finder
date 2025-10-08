import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'
import { Link } from 'react-router-dom'

export default function OwnerDashboard() {
    const [kpis, setKpis] = useState({ listingsCount: 0, inquiriesCount: 0, bookingsCount: 0 })
    const [tab, setTab] = useState('listings')

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get('/api/owners/dashboard/summary')
                setKpis(data)
            } catch {}
        }
        load()
    }, [])

    return (
        <section className="p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded p-4"><p className="text-gray-600">Listings</p><p className="text-2xl font-semibold">{kpis.listingsCount}</p></div>
                <div className="border rounded p-4"><p className="text-gray-600">Inquiries</p><p className="text-2xl font-semibold">{kpis.inquiriesCount}</p></div>
                <div className="border rounded p-4"><p className="text-gray-600">Bookings</p><p className="text-2xl font-semibold">{kpis.bookingsCount}</p></div>
            </div>

            <div className="border-b flex gap-4">
                {['listings','add','bookings','inquiries'].map((t) => (
                    <button key={t} className={`px-3 py-2 ${tab === t ? 'border-b-2 border-black' : ''}`} onClick={() => setTab(t)}>{t}</button>
                ))}
            </div>

            <div>
                {tab === 'listings' && (
                    <div className="space-y-3">
                        <p className="text-gray-600">
                            Manage your listings (
                            <Link to="/owner/listings" className="underline">Go to /owner/listings</Link>
                            ).
                        </p>
                        {Array.isArray(kpis.listings) && kpis.listings.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {kpis.listings.slice(0, 6).map((l) => (
                                    <div key={l._id} className="border rounded p-3">
                                        <img src={l.photos?.[0]?.url} alt="" className="w-full h-40 object-cover rounded" />
                                        <h3 className="mt-2 font-semibold">{l.name}</h3>
                                        <p className="text-sm text-gray-600">₹ {Number(l.pricePerMonth).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {tab === 'add' && (
                    <p className="text-gray-600">
                        Create a listing (
                        <Link to="/owner/listings/new" className="underline">link to /owner/listings/new</Link>
                        ).
                    </p>
                )}
                {tab === 'bookings' && (
                    <p className="text-gray-600">
                        View bookings (
                        <Link to="/owner" className="underline">link to /owner</Link>
                        ).
                    </p>
                )}
                {tab === 'inquiries' && (
                    <p className="text-gray-600">
                        View inquiries (
                        <Link to="/owner" className="underline">link to /owner</Link>
                        ).
                    </p>
                )}
            </div>
        </section>
    )
}


