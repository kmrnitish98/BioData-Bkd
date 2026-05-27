import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle, Clock } from 'lucide-react';
import { emailRules } from '../utils/validation';
import { getErrorMessage } from '../utils/apiError';
import { apiForgotPassword } from '../api/client';
import Button from '../components/ui/Button';
import logo from '/logo-2.webp';

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [apiError, setApiError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const startCooldown = () => {
    let secs = 60;
    setCooldown(secs);
    const timer = setInterval(() => {
      secs -= 1;
      setCooldown(secs);
      if (secs <= 0) clearInterval(timer);
    }, 1000);
  };

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await apiForgotPassword(data.email);
      setSentEmail(data.email);
      setSent(true);
      startCooldown();
    } catch (err) {
      setApiError(getErrorMessage(err));
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setApiError('');
    try {
      await apiForgotPassword(sentEmail);
      startCooldown();
    } catch (err) {
      setApiError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#1a0000] to-[#0d0000] -z-10" />
      <div
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 50%, rgba(184,134,11,0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(139,0,0,0.4) 0%, transparent 50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back to login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-yellow-700/70 hover:text-yellow-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <div className="glass-card rounded-3xl p-8 md:p-10 border border-yellow-900/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-800 to-red-950 border border-yellow-700/30 mb-4">
              <img src={logo} alt="" />
            </div>
            <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Forgot Password
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {sent ? 'Check your inbox for the reset link' : "We'll send a reset link to your email"}
            </p>
            <div className="flex justify-center mt-3">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-yellow-700/60 to-transparent" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-emerald-900/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-700/40 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <p className="text-white font-medium mb-1">Email sent!</p>
                <p className="text-gray-500 text-sm mb-2">
                  We sent a reset link to
                </p>
                <p className="text-yellow-400 text-sm font-medium mb-6 break-all">{sentEmail}</p>
                <p className="text-gray-600 text-xs mb-6">
                  Didn&apos;t receive it? Check your spam folder, or resend below.
                </p>

                {/* Error */}
                {apiError && (
                  <p className="text-red-400 text-xs mb-4">{apiError}</p>
                )}

                {/* Resend */}
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className="w-full gap-2"
                >
                  {cooldown > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Resend in {cooldown}s
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Resend email
                    </>
                  )}
                </Button>

                <div className="mt-6 pt-6 border-t border-red-900/20">
                  <Link to="/login" className="text-yellow-500 hover:text-yellow-400 text-sm transition-colors">
                    Return to sign in
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* API Error */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-700/40 text-red-300 text-sm mb-5"
                  >
                    {apiError}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900/60" />
                      <input
                        {...register('email', emailRules)}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-700/50 transition-colors"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
                    <Send className="w-4 h-4" />
                    Send Reset Link
                  </Button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                  Remember your password?{' '}
                  <Link to="/login" className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
