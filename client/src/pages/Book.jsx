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
    const [visitRequested, setVisitRequested] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    async function onSubmit(e) {
        e.preventDefault()
        if (!user) return navigate('/auth')
        
        // Enhanced validation
        const errors = []
        
        if (!visitRequested && (!startDate || !durationMonths)) {
            errors.push('Please provide start date and duration for booking, or check "Request visit only"')
        }
        
        if (startDate) {
            const startDateObj = new Date(startDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (startDateObj < today) {
                errors.push('Start date cannot be in the past')
            }
        }
        
        if (durationMonths) {
            const duration = Number(durationMonths)
            if (!Number.isFinite(duration) || duration <= 0) {
                errors.push('Duration must be a positive number')
            } else if (duration > 24) {
                errors.push('Duration cannot exceed 24 months')
            }
        }
        
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error))
            return
        }
        
        try {
            setSubmitting(true)
            const payload = { 
                listingId: id, 
                startDate: visitRequested ? undefined : startDate, 
                durationMonths: visitRequested ? undefined : durationMonths,
                visitRequested: visitRequested
            }
            await api.post('/api/bookings', payload)
            toast.success('Booking created')
            navigate('/me/bookings')
        } catch (err) {
            const response = err?.response?.data
            if (response?.errors && Array.isArray(response.errors)) {
                response.errors.forEach(error => toast.error(error))
            } else {
                toast.error(response?.message || 'Failed to create booking')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="p-4 space-y-3">
            <h1 className="text-2xl font-semibold">Book PG</h1>
            <form onSubmit={onSubmit} className="space-y-3 max-w-md">
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            checked={visitRequested} 
                            onChange={(e) => setVisitRequested(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm">Request visit only (no booking)</span>
                    </label>
                </div>
                
                <div className={`space-y-3 ${visitRequested ? 'opacity-50' : ''}`}>
                    <input 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        type="date" 
                        className="border rounded px-3 py-2 w-full" 
                        disabled={visitRequested}
                        required={!visitRequested}
                    />
                    <input 
                        value={durationMonths} 
                        onChange={(e) => setDurationMonths(e.target.value)} 
                        type="number" 
                        placeholder="Duration (months)" 
                        className="border rounded px-3 py-2 w-full" 
                        disabled={visitRequested}
                        required={!visitRequested}
                    />
                </div>
                
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
                    {submitting ? 'Submitting...' : visitRequested ? 'Request Visit' : 'Book PG'}
                </button>
            </form>
        </section>
    );
}


