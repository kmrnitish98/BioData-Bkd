import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToasts } from '../../context/ToastContext';

/* ── Per-type visual config ──────────────────────────────────────────────── */
const CONFIG = {
  success: {
    icon: CheckCircle,
    bg:   'bg-[#0d2010]/90',
    border: 'border-emerald-700/50',
    iconColor: 'text-emerald-400',
    bar:  'bg-emerald-500',
    title: 'Success',
  },
  error: {
    icon: XCircle,
    bg:   'bg-[#200000]/90',
    border: 'border-red-700/50',
    iconColor: 'text-red-400',
    bar:  'bg-red-500',
    title: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    bg:   'bg-[#1a1000]/90',
    border: 'border-amber-700/50',
    iconColor: 'text-amber-400',
    bar:  'bg-amber-500',
    title: 'Warning',
  },
  info: {
    icon: Info,
    bg:   'bg-[#001020]/90',
    border: 'border-blue-700/50',
    iconColor: 'text-blue-400',
    bar:  'bg-blue-500',
    title: 'Info',
  },
};

/* ── Single Toast item ───────────────────────────────────────────────────── */
const ToastItem = ({ toast, onDismiss }) => {
  const cfg = CONFIG[toast.type] || CONFIG.info;
  const Icon = cfg.icon;
  const barRef = useRef(null);

  // Animate the progress bar from 100 → 0
  useEffect(() => {
    if (!barRef.current || toast.duration <= 0) return;
    const el = barRef.current;
    el.style.transition = `width ${toast.duration}ms linear`;
    // Small timeout so the initial 100% render completes first
    const raf = requestAnimationFrame(() => { el.style.width = '0%'; });
    return () => cancelAnimationFrame(raf);
  }, [toast.duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{    opacity: 0, x: 80, scale: 0.88, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className={`
        relative flex items-start gap-3 w-[340px] max-w-[calc(100vw-2rem)]
        rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]
        backdrop-blur-xl border overflow-hidden
        ${cfg.bg} ${cfg.border}
      `}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${cfg.iconColor}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
          {cfg.title}
        </p>
        <p className="text-sm text-white leading-snug break-words">{toast.message}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-gray-600 hover:text-white transition-colors mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      {toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            ref={barRef}
            className={`h-full ${cfg.bar}`}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </motion.div>
  );
};

/* ── Container — rendered once at root, portal-like positioning ──────────── */
export const ToastContainer = () => {
  const { toasts, dismiss } = useToasts();

  return (
    <div
      aria-label="Notifications"
      className="fixed top-5 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
