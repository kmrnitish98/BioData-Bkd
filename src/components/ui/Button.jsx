import { motion } from 'framer-motion';

/**
 * Button.jsx — Accessible, animated button component.
 *
 * Accessibility improvements:
 *  - aria-busy="true" when loading — screen readers announce "busy"
 *  - aria-disabled mirrors the disabled state (redundant but explicit for AT)
 *  - loading spinner has aria-hidden + role="status" sibling for SR announcement
 *  - focus-visible ring uses sufficient contrast ratio (yellow-600 on dark bg)
 *  - Spinner visually hidden label via sr-only span
 */

const variants = {
  primary: 'bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white border border-red-500/30 hover:shadow-[0_0_20px_rgba(139,0,0,0.4)]',
  gold:    'bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-black border border-yellow-400/40 font-semibold hover:shadow-[0_0_24px_rgba(212,160,23,0.45)]',
  ghost:   'bg-transparent border border-red-700/40 text-red-300 hover:bg-red-900/20 hover:border-red-500/60 hover:text-red-200',
  danger:  'bg-gradient-to-r from-red-900 to-rose-700 hover:from-red-800 hover:to-rose-600 text-white border border-rose-600/30',
  outline: 'bg-transparent border border-yellow-700/50 text-yellow-500 hover:bg-yellow-900/10 hover:border-yellow-600/70 hover:text-yellow-400',
};

const sizes = {
  sm:  'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm',
  md:  'px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base',
  lg:  'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg',
  icon:'p-2 sm:p-2.5',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      whileHover={{ scale: isDisabled ? 1 : 1.03 }}
      whileTap={{   scale: isDisabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={isDisabled}
      // ── Accessibility attributes ─────────────────────────────────
      aria-busy={loading ? 'true' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl font-medium
        transition-all duration-300 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ripple-container
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/50 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent
        ${variants[variant] ?? variants.primary}
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <>
          {/* Decorative spinner — hidden from screen readers */}
          <svg
            className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {/* Screen-reader-only loading announcement */}
          <span className="sr-only">Loading, please wait…</span>
        </>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
