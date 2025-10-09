import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FacilityChips from '../components/FacilityChips'
import ImageUploader from '../components/ImageUploader'
import { api } from '../utils/api.js'
import toast from 'react-hot-toast'
import { FiX } from 'react-icons/fi'

export default function EditListing() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', description: '', address: '', collegeName: '', pricePerMonth: '', gender: 'unisex', availableBeds: '', totalBeds: '', facilities: {}, photos: [] })
    const [files, setFiles] = useState([])
    const [clearKey, setClearKey] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [deletedPhotos, setDeletedPhotos] = useState([])

    function update(k, v) { setForm((f) => ({ ...f, [k]: v })) }

    function removeExistingPhoto(index) {
        const photo = form.photos[index]
        setDeletedPhotos(prev => [...prev, photo.publicId])
        update('photos', form.photos.filter((_, i) => i !== index))
    }

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
        // Enforce max 8 photos total: existing - deleted + newly selected
        const existingCount = (form.photos?.length || 0)
        const deletedCount = (deletedPhotos?.length || 0)
        const newCount = (files?.length || 0)
        const finalCount = existingCount - deletedCount + newCount
        if (finalCount > 8) {
            toast.error(`You can keep at most 8 photos. Remove ${finalCount - 8} photo(s).`)
            return
        }
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
        if (deletedPhotos.length > 0) {
            fd.append('deletedPhotos', JSON.stringify(deletedPhotos))
        }
        try {
            setSubmitting(true)
            const { data } = await api.patch(`/api/listings/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            toast.success('Changes saved')
            // stay on this page; refresh local state from server and clear selections
            const l = data.listing
            update('photos', l.photos || [])
            setFiles([])
            setDeletedPhotos([])
            setClearKey((k) => k + 1)
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
                
                {/* Existing Photos */}
                {form.photos.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Photos</label>
                        <div className="flex flex-wrap gap-3 items-start">
                            {form.photos.map((photo, index) => (
                                <div key={index} className="relative group w-20 h-20">
                                    <img 
                                        src={photo.url} 
                                        alt={`Photo ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded border"
                                        loading="lazy"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingPhoto(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove photo"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <ImageUploader onFiles={setFiles} clearSignal={clearKey} />
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">{submitting ? 'Saving...' : 'Save Changes'}</button>
            </form>
        </section>
    )
}


