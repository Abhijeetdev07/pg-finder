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
    <div className={`fixed right-4 bottom-4 px-3 py-2 rounded-lg shadow ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
      {toast.message}
    </div>
  );
}


