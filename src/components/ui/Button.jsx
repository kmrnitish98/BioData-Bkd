import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white border border-red-500/30 hover:shadow-red',
  gold: 'bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-black border border-yellow-400/40 font-semibold hover:shadow-gold',
  ghost: 'bg-transparent border border-red-700/40 text-red-300 hover:bg-red-900/20 hover:border-red-500/60 hover:text-red-200',
  danger: 'bg-gradient-to-r from-red-900 to-rose-700 hover:from-red-800 hover:to-rose-600 text-white border border-rose-600/30',
};

const sizes = {
  sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm',
  md: 'px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base',
  lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg',
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
  ...props
}) => {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl font-medium
        transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
