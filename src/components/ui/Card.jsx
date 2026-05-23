import { motion } from 'framer-motion';

const Card = ({ children, className = '', delay = 0, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? {
        y: -4,
        transition: { duration: 0.4, ease: 'easeOut' }
      } : {}}
      className={`glass-premium rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 transition-luxury ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
