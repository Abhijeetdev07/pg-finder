import { useRef, useState } from 'react';
import api from '../lib/axios.js';

export default function Uploader({ value = [], onChange, max = 8 }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [overLimit, setOverLimit] = useState(false);
  const inputRef = useRef(null);

  const onFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const current = Array.isArray(value) ? value.length : 0;
    const remaining = Math.max(0, max - current);
    if (selected.length > remaining) {
      setError(`You can upload up to ${max} images. ${remaining} slot(s) remaining.`);
      setOverLimit(true);
    } else {
      setError('');
      setOverLimit(false);
    }
    setFiles(selected.slice(0, remaining));
  };

  const onUpload = async () => {
    if (!files.length) return;
    const current = Array.isArray(value) ? value.length : 0;
    if (current + files.length > max) {
      setError(`You can upload up to ${max} images. ${Math.max(0, max - current)} slot(s) remaining.`);
      setOverLimit(true);
      return;
    }
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    setUploading(true);
    try {
      const { data } = await api.post('/api/upload/images', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const urls = data.data || [];
      onChange?.([...(value || []), ...urls]);
      setFiles([]);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx) => {
    const next = (value || []).filter((_, i) => i !== idx);
    onChange?.(next);
  };

  const removeSelectedAt = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setError('');
    setOverLimit(false);
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2 border rounded p-2 cursor-pointer" onClick={()=>inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFileSelect} />
      </div>
      <button type="button" onClick={onUpload} disabled={uploading || !files.length || overLimit} className="px-3 py-1 border rounded bg-gray-900 text-white disabled:opacity-50 w-max">
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
      <div className="text-xs text-gray-600">{Array.isArray(value)? value.length : 0}/{max} uploaded</div>
      {error && <div className="text-xs text-red-700">{error}</div>}
      {files.length > 0 && (
        <div className="grid gap-1">
          <div className="text-xs text-gray-600">Selected (not uploaded):</div>
          <div className="flex flex-wrap gap-1">
            {files.map((f, idx) => (
              <div key={`${f.name}-${idx}`} className="relative">
                <img src={URL.createObjectURL(f)} alt="selected" className="w-[20px] h-[20px] object-cover rounded border" />
                <button type="button" onClick={()=>removeSelectedAt(idx)} className="absolute -top-1 -right-1 bg-white border rounded-full w-3 h-3 leading-3 text-[10px]">×</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((url, idx) => (
            <div key={`${url}-${idx}`} className="relative">
              <img src={url} alt="uploaded" className="w-[20px] h-[20px] object-cover rounded border" />
              <button type="button" onClick={()=>removeAt(idx)} className="absolute -top-1 -right-1 bg-white border rounded-full w-3 h-3 leading-3 text-[10px]">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


