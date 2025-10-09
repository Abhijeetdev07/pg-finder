import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FiX, FiUpload } from 'react-icons/fi'

export default function ImageUploader({ onFiles, clearSignal }) {
    const inputRef = useRef(null)
    const [selected, setSelected] = useState([])

    function onPick() { inputRef.current?.click() }

    function processFiles(files) {
        let list = Array.from(files || [])
        if (list.length > 8) {
            toast.error('You can select up to 8 images')
            list = list.slice(0, 8)
        }
        const MAX_BYTES = 2 * 1024 * 1024 // 2MB
        const filtered = []
        let rejected = 0
        list.forEach((f) => {
            if (f.size <= MAX_BYTES) filtered.push(f)
            else rejected++
        })
        if (rejected > 0) toast.error(`Removed ${rejected} file(s) over 2MB`)
        setSelected(filtered)
        onFiles?.(filtered)
    }

    function onChange(e) { processFiles(e.target.files) }

    function onDrop(e) {
        e.preventDefault()
        e.stopPropagation()
        processFiles(e.dataTransfer?.files)
    }

    function onDragOver(e) { e.preventDefault() }

    function removeAt(index) {
        const next = selected.filter((_, i) => i !== index)
        setSelected(next)
        onFiles?.(next)
        if (next.length === 0 && inputRef.current) inputRef.current.value = ''
    }

    // Clear selection when parent signals a reset
    useEffect(() => {
        if (clearSignal !== undefined) {
            setSelected([])
            if (inputRef.current) inputRef.current.value = ''
        }
    }, [clearSignal])

    return (
        <div className="space-y-2">
            <div
                role="button"
                tabIndex={0}
                onClick={onPick}
                onKeyDown={(e) => { if (e.key === 'Enter') onPick() }}
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="rounded border border-dashed px-3 py-2 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20"
            >
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                        <FiUpload />
                        Click or drag images (max 8, 2MB each)
                    </p>
                    <span className="px-3 py-1 border rounded text-sm">Choose</span>
                </div>
                {selected.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selected.map((f, idx) => (
                            <span key={idx} className="text-xs inline-flex items-center gap-2 px-2 py-1 border rounded bg-gray-50">
                                <span className="max-w-[180px] truncate" title={f.name}>{f.name}</span>
                                <button
                                    type="button"
                                    aria-label="Remove image"
                                    onClick={() => removeAt(idx)}
                                    className="text-gray-600 hover:text-black"
                                >
                                    <FiX />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onChange} />
        </div>
    )
}


