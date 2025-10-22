import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from '../features/ui/slice.js';
import { AiOutlineClose } from 'react-icons/ai';

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((s) => s.ui.toast);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!toast) {
      setIsVisible(false);
      return;
    }
    
    // Slide in
    setIsVisible(true);
    
    // Start slide out before clearing
    const slideOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);
    
    // Clear toast after slide out animation
    const clearTimer = setTimeout(() => {
      dispatch(clearToast());
    }, 2500);
    
    return () => {
      clearTimeout(slideOutTimer);
      clearTimeout(clearTimer);
    };
  }, [toast, dispatch]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(clearToast());
    }, 300);
  };

  if (!toast) return null;
  
  const isError = toast.type === 'error';
  
  return (
    <div 
      className={`fixed left-1/2 transform -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow-lg sm:max-w-md font-medium transition-all duration-300 ease-in-out flex items-center justify-between gap-3 ${
        isVisible ? 'top-4 opacity-100' : '-top-20 opacity-0'
      } ${
        isError ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'
      }`}
    >
      <span>{toast.message}</span>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <AiOutlineClose size={16} />
      </button>
    </div>
  );
}


