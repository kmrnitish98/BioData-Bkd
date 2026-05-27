import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Compass } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const NotFoundPage = () => {
  useSEO('/404');

  const suggestions = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Explore Profiles', to: '/explore', icon: Compass },
    { label: 'Create Biodata', to: '/create', icon: Search },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#150000] to-[#0d0000] -z-10" />
      <div
        className="fixed inset-0 -z-10 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 40% 60%, rgba(212,160,23,0.15) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(139,0,0,0.3) 0%, transparent 55%)',
        }}
      />
      {/* Subtle texture */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23d4a017'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-lg w-full"
      >
        {/* Number */}
        <div className="relative mb-6">
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-yellow-900/10 rounded-full blur-3xl" />
          </div>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
            className="relative text-[9rem] font-light leading-none"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              background: 'linear-gradient(135deg, #d4a017 0%, #f0c040 50%, #b8860b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}
          >
            404
          </motion.p>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-3xl font-light text-white mb-3"
          style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.05em' }}
        >
          Page Not Found
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-gray-500 text-sm mb-2 max-w-sm mx-auto leading-relaxed"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-yellow-700/50 text-xs mb-10 italic"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem' }}
        >
          &ldquo;Every journey needs the right path.&rdquo;
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex items-center gap-3 mb-8 max-w-xs mx-auto"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-900/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-700/60" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-900/50" />
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
        >
          {suggestions.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-yellow-900/30 bg-yellow-900/5 text-yellow-600/80 hover:bg-yellow-900/15 hover:text-yellow-400 hover:border-yellow-700/50 transition-all text-sm"
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </Link>
          ))}
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
