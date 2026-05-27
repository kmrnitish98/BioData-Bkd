import { createContext, useContext, useCallback, useState, useRef } from 'react';

const ToastContext = createContext(null);

let _id = 0;
const nextId = () => ++_id;

/**
 * ToastProvider — wrap your app once at the root.
 * Provides the useToast() hook to every descendant.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = nextId();
    setToasts((prev) => {
      // Keep at most 5 toasts stacked
      const next = [...prev.slice(-4), { id, type, message, duration }];
      return next;
    });
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const toast = {
    success: (msg, dur)  => addToast('success', msg, dur),
    error:   (msg, dur)  => addToast('error',   msg, dur),
    info:    (msg, dur)  => addToast('info',     msg, dur),
    warning: (msg, dur)  => addToast('warning',  msg, dur),
    dismiss,
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

/** Hook — use inside any component to fire toasts */
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx.toast;
};

/** Internal hook used by ToastContainer */
export const useToasts = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToasts must be used within <ToastProvider>');
  return { toasts: ctx.toasts, dismiss: ctx.dismiss };
};
