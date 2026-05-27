import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * EmptyState — reusable empty / no-data state component.
 *
 * Props:
 *   icon       — Lucide icon component (optional)
 *   emoji      — emoji string shown if no icon (optional)
 *   title      — main heading
 *   description — supporting text
 *   action     — { label, to, onClick, variant } (optional CTA button)
 *   secondaryAction — same shape (optional secondary CTA)
 *   className  — extra classes
 */
const VARIANTS = {
  gold:    'bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-semibold hover:from-yellow-600 hover:to-yellow-400 shadow-[0_4px_20px_rgba(212,160,23,0.25)]',
  ghost:   'bg-transparent border border-red-800/40 text-red-300 hover:bg-red-900/20',
  primary: 'bg-gradient-to-r from-red-800 to-red-600 text-white hover:from-red-700 hover:to-red-500 border border-red-500/30',
};

const ActionButton = ({ action }) => {
  const base = `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${VARIANTS[action.variant || 'gold']}`;
  if (action.to) {
    return <Link to={action.to} className={base}>{action.label}</Link>;
  }
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={action.onClick} className={base}>
      {action.label}
    </motion.button>
  );
};

const EmptyState = ({
  icon: Icon,
  emoji,
  title = 'Nothing here yet',
  description,
  action,
  secondaryAction,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`flex flex-col items-center justify-center text-center py-20 px-6 ${className}`}
  >
    {/* Icon / Emoji */}
    <div className="relative w-28 h-28 mx-auto mb-8">
      <div className="absolute inset-0 bg-yellow-900/10 rounded-full blur-2xl animate-pulse" />
      <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#1f0d00] to-[#0d0400] border border-yellow-800/20 flex items-center justify-center shadow-[0_0_40px_rgba(212,160,23,0.08)]">
        {Icon
          ? <Icon className="w-12 h-12 text-yellow-700/70" />
          : <span className="text-4xl">{emoji || '📭'}</span>
        }
      </div>
    </div>

    {/* Text */}
    <h2
      className="text-2xl font-light text-white mb-3"
      style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.04em' }}
    >
      {title}
    </h2>
    {description && (
      <p
        className="text-yellow-700/60 text-sm mb-8 max-w-sm leading-relaxed italic"
        style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}
      >
        {description}
      </p>
    )}

    {/* Actions */}
    {(action || secondaryAction) && (
      <div className="flex flex-col sm:flex-row gap-3">
        {action && <ActionButton action={action} />}
        {secondaryAction && <ActionButton action={{ ...secondaryAction, variant: secondaryAction.variant || 'ghost' }} />}
      </div>
    )}
  </motion.div>
);

export default EmptyState;
