import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
// FiltersBar removed per request
import Card from '../components/Card'
import Pagination from '../components/Pagination'
import { fetchListings } from '../features/listings/listingsSlice'

function paramsToObject(searchParams) {
    const obj = {}
    for (const [k, v] of searchParams.entries()) obj[k] = v
    return obj
}

export default function Search() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [sp, setSp] = useSearchParams()
    const { items, pagination, status } = useSelector((s) => s.listings)

    const filters = useMemo(() => paramsToObject(sp), [sp])

    useEffect(() => {
        dispatch(fetchListings(filters))
    }, [dispatch, filters])

    // Filters and sorting removed

    function onPageChange(page) {
        setSp({ ...filters, page: String(page) })
    }

    return (
        <section className="p-4 space-y-4">
            <div>
                <div>
                    {status === 'loading' && <p className="text-sm text-gray-500">Loading...</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((l) => (
                            <Card
                                key={l._id}
                                title={l.name}
                                subtitle={l.collegeName}
                                image={l.photos?.[0]?.url}
                                price={l.pricePerMonth}
                                rating={l.avgRating}
                                reviewsCount={l.numReviews}
                                id={l._id}
                                onClick={() => navigate(`/pg/${l._id}`)}
                            />
                        ))}
                    </div>
                    <div className="pt-2">
                        <Pagination page={pagination.page} pageSize={pagination.pageSize} total={pagination.total} onPageChange={onPageChange} />
                    </div>
                </div>
            </div>
        </section>
    )
}