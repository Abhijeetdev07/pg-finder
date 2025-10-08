import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/Card'
import FiltersBar from '../components/FiltersBar'
import { fetchListings } from '../features/listings/listingsSlice'

export default function Home() {
    const dispatch = useDispatch()
    const { items, status } = useSelector((s) => s.listings)
    const initialFilters = (() => {
        const sp = new URLSearchParams(window.location.search)
        const q = sp.get('q') || ''
        return { q, sort: 'newest', limit: 12 }
    })()
    const [filters, setFilters] = useState(initialFilters)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [drawerVisible, setDrawerVisible] = useState(false)

    const query = useMemo(() => ({ ...filters }), [filters])
    useEffect(() => {
        dispatch(fetchListings(query))
    }, [dispatch, query])

    // Form removed

    function quickFilter(partial) {
        const params = new URLSearchParams({ sort: 'newest', limit: '12' })
        Object.entries(partial).forEach(([k, v]) => params.set(k, String(v)))
        navigate(`/search?${params.toString()}`)
    }

    return (
        <section className="p-4 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Find PGs near your College</h1>
                <p className="text-gray-600 mt-1">Search by college, apply filters, and book online.</p>
            </div>

            {/* Search form removed; use Navbar search */}

            <div className="flex gap-4">
                {/* Launch sidebar drawer (all screen sizes) */}
                <button
                    type="button"
                    onClick={() => { setDrawerVisible(true); setTimeout(() => setSidebarOpen(true), 0) }}
                    className="px-3 py-2 border rounded text-sm h-fit"
                >
                    ☰ Filters
                </button>
                {drawerVisible && (
                    <div className="fixed inset-0 z-[60]">
                        <div
                            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => { setSidebarOpen(false); setTimeout(() => setDrawerVisible(false), 300) }}
                        ></div>
                        <div
                            className={`absolute left-0 top-0 h-full w-72 bg-white shadow transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        >
                            <div className="p-2 border-b flex items-center justify-between">
                                <span className="text-sm font-medium">Filters</span>
                                <button
                                    type="button"
                                    onClick={() => { setSidebarOpen(false); setTimeout(() => setDrawerVisible(false), 300) }}
                                    className="px-2 py-1 text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-3">
                                <FiltersBar value={filters} onChange={setFilters} onClear={() => setFilters({ sort: 'newest', limit: 12 })} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex-1">
                    {/* Sort moved into sidebar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((l) => (
                            <Card
                                key={l._id}
                                title={l.name}
                                subtitle={l.collegeName}
                                image={l.photos?.[0]?.url}
                                price={l.pricePerMonth}
                                onClick={() => window.location.assign(`/pg/${l._id}`)}
                            />
                        ))}
                    </div>
                    {status === 'loading' && <span className="text-sm text-gray-500">Loading...</span>}
                </div>
            </div>

            {/* Featured section merged into main grid above */}
        </section>
    )
}


