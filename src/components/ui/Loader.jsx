import { motion } from 'framer-motion';
import logo from '../../assets/aguaa-logo-r.webp';

/**
 * Loader — premium branded full-screen loader.
 * Used by ProtectedRoute during auth check.
 * Replaces the plain spinner with a logo + orbital ring animation.
 */
const Loader = ({ message = 'Authenticating...' }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0000]/95 backdrop-blur-md">
    {/* Orbital rings */}
    <div className="relative w-24 h-24 mb-8">
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px solid transparent',
          borderTopColor: 'rgba(184,134,11,0.7)',
          borderRightColor: 'rgba(184,134,11,0.2)',
        }}
      />
      {/* Middle ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
        className="absolute inset-3 rounded-full"
        style={{
          border: '1px solid transparent',
          borderTopColor: 'rgba(240,192,64,0.6)',
          borderLeftColor: 'rgba(240,192,64,0.15)',
        }}
      />
      {/* Inner glow */}
      <div
        className="absolute inset-6 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%)',
        }}
      />
      {/* Logo centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.img
          src={logo}
          alt="Aguaa"
          className="w-10 h-10 object-contain"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
      </div>
    </div>

    {/* Message */}
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-yellow-600/70 text-xs tracking-[0.3em] uppercase font-medium"
    >
      {message}
    </motion.p>
  </div>
);

export default Loader;
