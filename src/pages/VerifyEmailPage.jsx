import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, RefreshCw, Clock } from 'lucide-react';
import { apiVerifyEmail, apiResendVerification } from '../api/client';
import { getErrorMessage } from '../utils/apiError';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import logo from '/logo-2.webp';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const toast = useToast();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error' | 'no-token'
  const [errorMsg, setErrorMsg] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    let secs = 60;
    setCooldown(secs);
    const t = setInterval(() => {
      secs -= 1;
      setCooldown(secs);
      if (secs <= 0) clearInterval(t);
    }, 1000);
  };

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }
    apiVerifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setErrorMsg(getErrorMessage(err, 'Verification failed. The link may have expired.'));
      });
  }, [token]);

  const handleResend = async () => {
    if (!resendEmail) {
      toast.error('Please enter your email address.');
      return;
    }
    setResending(true);
    try {
      await apiResendVerification(resendEmail);
      toast.success('Verification email sent! Please check your inbox.');
      startCooldown();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const states = {
    loading: {
      icon: null,
      spinner: true,
      title: 'Verifying your email…',
      desc: 'Please wait while we verify your email address.',
      color: 'text-yellow-400',
    },
    success: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-700/40',
      glow: 'bg-emerald-900/20',
      title: 'Email Verified!',
      desc: 'Your email has been verified successfully. You can now access all features.',
    },
    error: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-950/60',
      border: 'border-red-700/40',
      glow: 'bg-red-900/20',
      title: 'Verification Failed',
      desc: errorMsg || 'This verification link may have expired.',
    },
    'no-token': {
      icon: Mail,
      color: 'text-yellow-500',
      bg: 'bg-yellow-950/40',
      border: 'border-yellow-700/30',
      glow: 'bg-yellow-900/10',
      title: 'Check Your Email',
      desc: 'We sent a verification link to your email. Click it to verify your account.',
    },
  };

  const s = states[status];
  const Icon = s.icon;

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
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
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-yellow-900/20 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-800 to-red-950 border border-yellow-700/30 mb-6">
            <img src={logo} alt="" />
          </div>

          {/* Status icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            {s.glow && <div className={`absolute inset-0 ${s.glow} rounded-full blur-xl animate-pulse`} />}
            <div className={`relative w-20 h-20 rounded-full border flex items-center justify-center ${s.bg || 'bg-[#1a0900]/60'} ${s.border || 'border-yellow-700/30'}`}>
              {s.spinner ? (
                <div className="w-9 h-9 border-4 border-yellow-900/40 border-t-yellow-500 rounded-full animate-spin" />
              ) : (
                Icon && <Icon className={`w-10 h-10 ${s.color}`} />
              )}
            </div>
          </div>

          <h1 className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            {s.title}
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{s.desc}</p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-900/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-700/50" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-900/30" />
          </div>

          {/* Actions */}
          {status === 'success' && (
            <div className="space-y-3">
              <Link to="/dashboard">
                <Button variant="gold" size="md" className="w-full">Go to Dashboard</Button>
              </Link>
              <Link to="/" className="block text-yellow-600/60 hover:text-yellow-500 text-sm transition-colors">
                Back to Home
              </Link>
            </div>
          )}

          {(status === 'error' || status === 'no-token') && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 text-left mb-1">Enter your email to receive a new link:</p>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900/60" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-700/50 transition-colors text-sm"
                />
              </div>
              <Button
                variant="primary"
                size="md"
                loading={resending}
                disabled={cooldown > 0 || resending}
                onClick={handleResend}
                className="w-full"
              >
                {cooldown > 0 ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Resend in {cooldown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              <Link to="/login" className="block text-yellow-600/60 hover:text-yellow-500 text-sm transition-colors">
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
