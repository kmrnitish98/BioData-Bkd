import { motion } from 'framer-motion';

const Card = ({ children, className = '', delay = 0, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -6, boxShadow: '0 20px 60px rgba(180, 0, 0, 0.25)' } : {}}
      className={`glass-card rounded-3xl p-8 md:p-10 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
