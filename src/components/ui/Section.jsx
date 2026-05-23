import { motion } from 'framer-motion';

const Section = ({ icon, title, children, className = '', accent = 'gold', delay = 0 }) => {
  const accentClasses = {
    gold: 'from-yellow-600 via-yellow-400 to-yellow-600',
    red: 'from-red-700 via-red-500 to-red-700',
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-8 sm:mb-10 ${className}`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-red-950/80 to-red-900/40 border border-yellow-700/30 text-yellow-500 shadow-gold/20"
          >
            {icon}
          </motion.div>
        )}
        <div className="min-w-0">
          <h2
            className="text-responsive-section font-semibold text-white tracking-wide truncate"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            {title}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`h-0.5 w-12 sm:w-16 bg-gradient-to-r ${accentClasses[accent]} mt-1 rounded-full origin-left`}
          />
        </div>
      </div>
      {children}
    </motion.section>
  );
};

export default Section;
