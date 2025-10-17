import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from '../features/ui/slice.js';

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((s) => s.ui.toast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(clearToast()), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg max-w-md ${isError ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
      {toast.message}
    </div>
  );
}


