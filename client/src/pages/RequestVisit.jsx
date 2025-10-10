import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createInquiry } from '../features/inquiries/inquiriesSlice'
import toast from 'react-hot-toast'

export default function RequestVisit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((s) => s.auth.user)
    const currentListing = useSelector((s) => s.listings.current)
    const myInquiries = useSelector((s) => s.inquiries.myInquiries)
    const [message, setMessage] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const hasOpenInquiryForThisListing = useMemo(() => {
        return Array.isArray(myInquiries) && myInquiries.some(q => String(q.listingId) === String(id) && q.status === 'open')
    }, [myInquiries, id])

    async function onSubmit(e) {
        e.preventDefault()
        if (!user) return navigate('/auth')
        if (currentListing && user.id === currentListing.ownerId) {
            toast.error('You cannot request a visit for your own listing')
            return
        }
        if (!message.trim()) return toast.error('Please enter a message')
        
        try {
            if (hasOpenInquiryForThisListing) {
                toast.error('You already have a pending visit request for this listing')
                return
            }
            setSubmitting(true)
            await dispatch(createInquiry({ listingId: id, message: message.trim(), contactVia: 'form' })).unwrap()
            toast.success('Visit request sent')
            navigate('/me/inquiries')
        } catch (err) {
            toast.error(err?.message || 'Failed to send request')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="p-4 space-y-3">
            <h1 className="text-2xl font-semibold">Request a Visit</h1>
            <form onSubmit={onSubmit} className="space-y-3 max-w-md">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="border rounded px-3 py-2 w-full" rows={4} />
                {hasOpenInquiryForThisListing && (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                        You already have a pending visit request for this listing. Please wait for a response before sending another.
                    </p>
                )}
                <button disabled={submitting || hasOpenInquiryForThisListing} type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">{submitting ? 'Sending...' : (hasOpenInquiryForThisListing ? 'Request Pending' : 'Send Request')}</button>
            </form>
        </section>
    );
}


