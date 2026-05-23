import { motion } from 'framer-motion';

const IconText = ({ icon, label, value, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 0.4 }}
    className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-white/[0.03] transition-luxury group ${className}`}
  >
    <div className="p-2.5 sm:p-3 rounded-full bg-gradient-to-br from-red-950/80 to-red-900/30 text-yellow-500 border border-yellow-700/20 flex-shrink-0 group-hover:border-yellow-600/40 group-hover:shadow-gold/10 transition-all duration-500">
      <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
        {icon}
      </span>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] sm:text-xs text-yellow-600/80 mb-0.5 sm:mb-1 uppercase tracking-[0.15em] sm:tracking-widest font-medium">{label}</p>
      <p className="text-base sm:text-lg font-medium text-white/90 leading-snug break-words">{value || '—'}</p>
    </div>
  </motion.div>
);

export default IconText;
