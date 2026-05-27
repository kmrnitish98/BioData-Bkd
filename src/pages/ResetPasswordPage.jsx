import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { newPasswordRules, confirmPasswordRules, getPasswordStrength } from '../utils/validation';
import { getErrorMessage } from '../utils/apiError';
import { apiResetPassword } from '../api/client';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import logo from '/logo-2.webp';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');
  const [done, setDone] = useState(false);
  const [pwValue, setPwValue] = useState('');

  const strength = getPasswordStrength(pwValue);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch password field for strength indicator
  useEffect(() => {
    const sub = watch((v) => setPwValue(v.password || ''));
    return () => sub.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    if (!token) {
      setApiError('Reset token is missing. Please request a new link.');
      return;
    }
    setApiError('');
    try {
      await apiResetPassword(token, data.password);
      setDone(true);
      toast.success('Password reset successfully! Please sign in with your new password.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setApiError(getErrorMessage(err));
    }
  };

  /* ── No token in URL ── */
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#1a0000] to-[#0d0000] -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-card rounded-3xl p-10 border border-yellow-900/20 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-950/60 border border-red-700/40 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Invalid Link
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary" size="md" className="w-full">Request New Link</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

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
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-yellow-900/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-800 to-red-950 border border-yellow-700/30 mb-4">
              <img src={logo} alt="" />
            </div>
            <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Reset Password
            </h1>
            <p className="text-gray-500 text-sm mt-1">Create a strong new password</p>
            <div className="flex justify-center mt-3">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-yellow-700/60 to-transparent" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              /* ── Success ── */
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-emerald-900/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-700/40 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <p className="text-white font-medium mb-2">Password reset successfully!</p>
                <p className="text-gray-500 text-sm mb-6">Redirecting you to sign in…</p>
                <Link to="/login">
                  <Button variant="gold" size="md" className="w-full">Go to Sign In</Button>
                </Link>
              </motion.div>
            ) : (
              /* ── Form ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-700/40 text-red-300 text-sm mb-5"
                  >
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {apiError}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* New password */}
                  <div>
                    <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900/60" />
                      <input
                        {...register('password', newPasswordRules)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-700/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {pwValue && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((seg) => (
                            <div
                              key={seg}
                              className="h-1 flex-1 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: strength.score >= seg ? strength.color : 'rgba(255,255,255,0.08)',
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: strength.color || '#6b7280' }}>
                          {strength.label}
                        </p>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900/60" />
                      <input
                        {...register('confirmPassword', confirmPasswordRules(getValues))}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-700/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
                    <ShieldCheck className="w-4 h-4" />
                    Reset Password
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
