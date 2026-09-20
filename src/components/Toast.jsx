import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toast, clearToast } = useAuth();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      clearToast();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="toast-container">
      <div className={`toast ${isSuccess ? 'success' : 'error'}`}>
        {isSuccess ? (
          <CheckCircle2 size={20} color="var(--status-emerald)" />
        ) : (
          <AlertCircle size={20} color="var(--status-error)" />
        )}
        <div className="toast-content">
          <div className="toast-title">{isSuccess ? 'Success' : 'Notice'}</div>
          <div className="toast-message">{toast.message}</div>
        </div>
        <button className="toast-close" onClick={clearToast} aria-label="Close notification">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
