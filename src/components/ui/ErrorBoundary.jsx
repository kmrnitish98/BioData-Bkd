import { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import logger from '../../lib/logger';

/**
 * ErrorBoundary — catches unhandled render errors in the subtree.
 *
 * Usage (app-level):
 *   <ErrorBoundary><App /></ErrorBoundary>
 *
 * Usage (route-level):
 *   <ErrorBoundary level="route"><ProfilePage /></ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Routes to Sentry automatically when VITE_SENTRY_DSN is set
    logger.error('[ErrorBoundary] Unhandled render error', {
      context: 'ErrorBoundary',
      data: error,
    });
    // Log component stack separately (not an Error instance — use warn)
    if (import.meta.env.DEV) {
      logger.warn('Component stack:', {
        context: 'ErrorBoundary',
        data: errorInfo?.componentStack,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { level = 'app', fallback } = this.props;

    // Custom fallback UI provided by consumer
    if (fallback) return fallback(this.state.error, this.handleReset);

    return <ErrorFallback level={level} error={this.state.error} onReset={this.handleReset} />;
  }
}

/* ── Fallback UI ─────────────────────────────────────────────────────────── */
const ErrorFallback = ({ level, error, onReset }) => (
  <div className={`flex flex-col items-center justify-center text-center px-6 ${level === 'app' ? 'min-h-screen' : 'min-h-[50vh]'}`}>
    {/* BG (only for app-level) */}
    {level === 'app' && (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#150000] to-[#0d0000] -z-10" />
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
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#1f0000] to-[#0d0000] border border-red-800/40 flex items-center justify-center shadow-[0_0_40px_rgba(139,0,0,0.3)]">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
      </div>

      {/* Code */}
      <p
        className="text-6xl font-light text-red-800/70 mb-2"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
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
        An unexpected error occurred. Our team has been notified.
      </p>

      {/* Dev-only error detail */}
      {import.meta.env.DEV && error?.message && (
        <pre className="text-left text-xs text-red-400/70 bg-red-950/30 border border-red-900/30 rounded-xl p-4 mb-6 max-h-32 overflow-auto whitespace-pre-wrap break-all mt-4">
          {error.message}
        </pre>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 my-6 max-w-xs mx-auto">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-900/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-700/60" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-900/40" />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-semibold text-sm hover:from-yellow-600 hover:to-yellow-400 transition-all shadow-[0_4px_20px_rgba(212,160,23,0.3)]"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
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

export default ErrorBoundary;
