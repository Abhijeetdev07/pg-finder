import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { api } from '../utils/api.js'
import toast from 'react-hot-toast'

export default function Book() {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)
    const [startDate, setStartDate] = useState('')
    const [durationMonths, setDurationMonths] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function onSubmit(e) {
        e.preventDefault()
        if (!user) return navigate('/auth')
        try {
            setSubmitting(true)
            await api.post('/api/bookings', { listingId: id, startDate, durationMonths })
            toast.success('Booking created')
            navigate('/me/bookings')
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to create booking')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="p-4 space-y-3">
            <h1 className="text-2xl font-semibold">Book PG</h1>
            <form onSubmit={onSubmit} className="space-y-3 max-w-md">
                <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="border rounded px-3 py-2 w-full" />
                <input value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} type="number" placeholder="Duration (months)" className="border rounded px-3 py-2 w-full" />
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit'}</button>
            </form>
        </section>
    );
}


