import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { api } from '../utils/api.js'
import toast from 'react-hot-toast'

export default function RequestVisit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)
    const [message, setMessage] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function onSubmit(e) {
        e.preventDefault()
        if (!user) return navigate('/auth')
        try {
            setSubmitting(true)
            await api.post('/api/inquiries', { listingId: id, message, contactVia: 'form' })
            toast.success('Visit request sent')
            navigate('/me/inquiries')
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to send request')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="p-4 space-y-3">
            <h1 className="text-2xl font-semibold">Request a Visit</h1>
            <form onSubmit={onSubmit} className="space-y-3 max-w-md">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="border rounded px-3 py-2 w-full" rows={4} />
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">{submitting ? 'Sending...' : 'Send Request'}</button>
            </form>
        </section>
    );
}


