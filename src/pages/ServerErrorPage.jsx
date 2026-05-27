import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

/**
 * ServerErrorPage — standalone 500 page.
 * Also used as the ErrorBoundary fallback (via props).
 *
 * Props (all optional — used when rendered as ErrorBoundary fallback):
 *   error     — the caught Error object
 *   onReset   — callback to retry
 */
const ServerErrorPage = ({ error, onReset }) => {
  const isEmbedded = Boolean(onReset); // rendered inside ErrorBoundary

  return (
    <div className={`flex flex-col items-center justify-center text-center px-6 ${isEmbedded ? 'min-h-[60vh]' : 'min-h-screen'}`}>
      {!isEmbedded && (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#150000] to-[#0d0000] -z-10" />
          <div
            className="fixed inset-0 -z-10 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 60% 40%, rgba(139,0,0,0.35) 0%, transparent 55%)',
            }}
          />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-red-900/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#1f0000] to-[#0d0000] border border-red-800/40 flex items-center justify-center shadow-[0_0_50px_rgba(139,0,0,0.25)]">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Code */}
        <p
          className="text-7xl font-light mb-2"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            background: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          500
        </p>

        {/* Title */}
        <h1
          className="text-2xl font-light text-white mb-3"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Something Went Wrong
        </h1>
        <p className="text-gray-500 text-sm mb-2 leading-relaxed max-w-sm mx-auto">
          An unexpected error occurred on our end. Our team has been notified.
        </p>
        <p
          className="text-red-800/50 text-xs mb-8 italic"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem' }}
        >
          &ldquo;Every disruption is followed by restoration.&rdquo;
        </p>

        {/* Dev error detail */}
        {import.meta.env.DEV && error?.message && (
          <pre className="text-left text-xs text-red-400/70 bg-red-950/30 border border-red-900/30 rounded-xl p-4 mb-6 max-h-28 overflow-auto whitespace-pre-wrap break-all">
            {error.message}
          </pre>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8 max-w-xs mx-auto">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-900/40" />
          <div className="w-2 h-2 rounded-full bg-red-800/60" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-900/40" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onReset ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-semibold text-sm hover:from-yellow-600 hover:to-yellow-400 transition-all shadow-[0_4px_20px_rgba(212,160,23,0.25)]"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-semibold text-sm hover:from-yellow-600 hover:to-yellow-400 transition-all shadow-[0_4px_20px_rgba(212,160,23,0.25)]"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </motion.button>
          )}
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-red-800/40 text-red-300 font-medium text-sm hover:bg-red-900/20 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerErrorPage;
