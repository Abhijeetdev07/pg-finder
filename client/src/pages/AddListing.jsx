import { useState } from 'react'
import FacilityChips from '../components/FacilityChips'
import ImageUploader from '../components/ImageUploader'
import { api } from '../utils/api.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AddListing() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', description: '', address: '', collegeName: '', pricePerMonth: '', gender: 'unisex', availableBeds: '', totalBeds: '', facilities: {} })
    const [files, setFiles] = useState([])
    const [clearKey, setClearKey] = useState(0)
    const [submitting, setSubmitting] = useState(false)

    function update(k, v) { setForm((f) => ({ ...f, [k]: v })) }

    async function onSubmit(e) {
        e.preventDefault()
        
        // Enhanced client-side validation
        const errors = []
        
        if (!form.name?.trim()) errors.push('Name is required')
        if (!form.address?.trim()) errors.push('Address is required')
        if (!form.pricePerMonth) errors.push('Price per month is required')
        if (!form.gender) errors.push('Gender is required')
        if (!form.facilities || Object.keys(form.facilities).length === 0) errors.push('At least one facility must be selected')
        
        if (form.name && form.name.length > 100) errors.push('Name must be 100 characters or less')
        if (form.address && form.address.length > 200) errors.push('Address must be 200 characters or less')
        
        const price = Number(form.pricePerMonth)
        if (form.pricePerMonth && (!Number.isFinite(price) || price <= 0)) {
            errors.push('Price must be a positive number')
        }
        
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error))
            return
        }

        const fd = new FormData()
        fd.append('name', form.name.trim())
        fd.append('address', form.address.trim())
        if (form.description) fd.append('description', form.description.trim())
        if (form.collegeName) fd.append('collegeName', form.collegeName.trim())
        fd.append('pricePerMonth', String(price))
        fd.append('gender', form.gender)
        fd.append('availableBeds', String(form.availableBeds || ''))
        fd.append('totalBeds', String(form.totalBeds || ''))
        fd.append('facilities', JSON.stringify(form.facilities || {}))
        // Add location coordinates (required by server validation)
        fd.append('location', JSON.stringify({ type: 'Point', coordinates: [0, 0] })) // Placeholder coordinates
        files.forEach((f) => fd.append('photos', f))
        
        try {
            setSubmitting(true)
            const { data } = await api.post('/api/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            toast.success('Listing created')
            // Clear selection after successful upload
            setFiles([])
            setClearKey((k) => k + 1)
            navigate('/owner/listings')
        } catch (err) {
            const response = err?.response?.data
            if (response?.errors && Array.isArray(response.errors)) {
                response.errors.forEach(error => toast.error(error))
            } else {
                const msg = response?.message || 'Failed to create listing'
                toast.error(msg)
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="p-4 space-y-3 max-w-2xl">
            <h1 className="text-2xl font-semibold">Add Listing</h1>
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
                {/* location removed */}
                <FacilityChips value={form.facilities} onChange={(v) => update('facilities', v)} />
                <ImageUploader onFiles={setFiles} clearSignal={clearKey} />
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">{submitting ? 'Creating...' : 'Create'}</button>
            </form>
        </section>
    )
}


