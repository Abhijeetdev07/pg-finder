import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FacilityChips from '../components/FacilityChips'
import ImageUploader from '../components/ImageUploader'
import { api } from '../utils/api.js'
import toast from 'react-hot-toast'

export default function EditListing() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', description: '', address: '', collegeName: '', pricePerMonth: '', gender: 'unisex', availableBeds: '', totalBeds: '', facilities: {}, photos: [] })
    const [files, setFiles] = useState([])
    const [submitting, setSubmitting] = useState(false)

    function update(k, v) { setForm((f) => ({ ...f, [k]: v })) }

    useEffect(() => {
        async function load() {
            const { data } = await api.get(`/api/listings/${id}`)
            const l = data.listing
            update('name', l.name)
            update('address', l.address)
            update('description', l.description || '')
            update('collegeName', l.collegeName)
            update('pricePerMonth', l.pricePerMonth)
            update('gender', l.gender)
            update('availableBeds', l.availableBeds)
            update('totalBeds', l.totalBeds)
            // location removed
            update('facilities', l.facilities || {})
            update('photos', l.photos || [])
        }
        load()
    }, [id])

    async function onSubmit(e) {
        e.preventDefault()
        const fd = new FormData()
        fd.append('name', form.name)
        fd.append('address', form.address)
        if (form.description) fd.append('description', form.description)
        fd.append('collegeName', form.collegeName)
        fd.append('pricePerMonth', String(form.pricePerMonth || ''))
        fd.append('gender', form.gender)
        fd.append('availableBeds', String(form.availableBeds || ''))
        fd.append('totalBeds', String(form.totalBeds || ''))
        // do not send location
        fd.append('facilities', JSON.stringify(form.facilities || {}))
        files.forEach((f) => fd.append('photos', f))
        try {
            setSubmitting(true)
            await api.patch(`/api/listings/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            toast.success('Changes saved')
            navigate('/owner/listings')
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to save changes')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="p-4 space-y-3 max-w-2xl">
            <h1 className="text-2xl font-semibold">Edit Listing</h1>
            <form onSubmit={onSubmit} className="grid gap-3">
                <input value={form.name} onChange={(e) => update('name', e.target.value)} type="text" placeholder="Name" className="border rounded px-3 py-2" />
                <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Description" className="border rounded px-3 py-2" rows={4} />
                <input value={form.address} onChange={(e) => update('address', e.target.value)} type="text" placeholder="Address" className="border rounded px-3 py-2" />
                <input value={form.collegeName} onChange={(e) => update('collegeName', e.target.value)} type="text" placeholder="College Name" className="border rounded px-3 py-2" />
                <div className="grid grid-cols-2 gap-3">
                    <input value={form.pricePerMonth} onChange={(e) => update('pricePerMonth', e.target.value)} type="number" placeholder="Price per month" className="border rounded px-3 py-2" />
                    <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="border rounded px-3 py-2">
                        <option value="unisex">Unisex</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input value={form.availableBeds} onChange={(e) => update('availableBeds', e.target.value)} type="number" placeholder="Available beds" className="border rounded px-3 py-2" />
                    <input value={form.totalBeds} onChange={(e) => update('totalBeds', e.target.value)} type="number" placeholder="Total beds" className="border rounded px-3 py-2" />
                </div>
                {/* location inputs removed */}
                <FacilityChips value={form.facilities} onChange={(v) => update('facilities', v)} />
                <ImageUploader onFiles={setFiles} />
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">{submitting ? 'Saving...' : 'Save Changes'}</button>
            </form>
        </section>
    )
}


