import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Heart, AlertCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { apiLogin, apiGoogleLogin } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import logo from "/logo-2.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      const { user } = await apiLogin(data.email, data.password);
      login(user);
      navigate("/dashboard");
    } catch (err) {
      setAuthError(err.message || "Sign in failed. Please try again.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAuthError("");
      setSocialLoading(true);
      try {
        const { user } = await apiGoogleLogin(tokenResponse.credential || tokenResponse.access_token);
        login(user);
        navigate("/dashboard");
      } catch (err) {
        setAuthError(err.message || "Google login failed.");
      } finally {
        setSocialLoading(false);
      }
    },
    onError: () => setAuthError("Google login failed.")
  });



  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#1a0000] to-[#0d0000] -z-10" />
      <div
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(184,134,11,0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(139,0,0,0.4) 0%, transparent 50%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-yellow-900/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-800 to-red-950 border border-yellow-700/30 mb-4">
              <img src={logo} alt="" />
            </div>
            <h1
              className="text-3xl font-light text-white"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your BioData account
            </p>
            <div className="flex justify-center mt-3">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-yellow-700/60 to-transparent" />
            </div>
          </div>

          {/* Error */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-700/40 text-red-300 text-sm mb-5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {authError}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900/60" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-700/50 transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900/60" />
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-700/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
              disabled={socialLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Social Logins */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-red-900/40"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0d0000] text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleGoogleLogin()}
                disabled={socialLoading || isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950/20 border border-red-900/40 text-white hover:bg-red-950/40 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium"
            >
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
