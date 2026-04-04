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
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={`mb-10 ${className}`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="p-2.5 rounded-xl bg-red-950/80 border border-yellow-700/30 text-yellow-500">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
            {title}
          </h2>
          <div className={`h-0.5 w-16 bg-gradient-to-r ${accentClasses[accent]} mt-1 rounded-full`} />
        </div>
      </div>
      {children}
    </motion.section>
  );
};

export default Section;
