import { motion } from 'framer-motion';

const Loader = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0000]/90 backdrop-blur-md">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="w-14 h-14 rounded-full border-4 border-yellow-700/30 border-t-yellow-500 mb-6"
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-yellow-400/80 text-sm tracking-widest uppercase"
    >
      {message}
    </motion.p>
  </div>
);

export default Loader;
