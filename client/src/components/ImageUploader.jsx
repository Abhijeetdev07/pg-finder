import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FiX } from 'react-icons/fi'

export default function ImageUploader({ onFiles }) {
    const inputRef = useRef(null)
    const [selected, setSelected] = useState([])
    function onPick() { inputRef.current?.click() }
    function onChange(e) {
        let files = Array.from(e.target.files || [])
        if (files.length > 5) {
            toast.error('You can select up to 5 images')
            files = files.slice(0, 5)
        }
        setSelected(files)
        onFiles?.(files)
    }

    function removeAt(index) {
        const next = selected.filter((_, i) => i !== index)
        setSelected(next)
        onFiles?.(next)
        // also reset the native input if nothing remains, to allow re-select of same file names
        if (next.length === 0 && inputRef.current) inputRef.current.value = ''
    }
    return (
        <div className="border rounded p-3">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Upload images</p>
                <button type="button" onClick={onPick} className="px-3 py-1 border rounded text-sm">Choose</button>
            </div>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onChange} />
            {selected.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selected.map((f, idx) => (
                        <span key={idx} className="text-xs inline-flex items-center gap-2 px-2 py-1 border rounded bg-gray-50">
                            <span className="max-w-[180px] truncate" title={f.name}>{f.name}</span>
                            <button type="button" aria-label="Remove image" onClick={() => removeAt(idx)} className="text-gray-600 hover:text-black">
                                <FiX />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}


