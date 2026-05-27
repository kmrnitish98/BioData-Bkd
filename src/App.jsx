import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ui/Toast';
import MobileCTA from './components/ui/MobileCTA';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { GOOGLE_CLIENT_ID } from './config/env';
import { CACHE } from './constants/limits';

// ── Lazy page imports ──────────────────────────────────────────────────────────
const HomePage            = lazy(() => import('./pages/HomePage'));
const LoginPage           = lazy(() => import('./pages/LoginPage'));
const SignupPage          = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage  = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage   = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage     = lazy(() => import('./pages/VerifyEmailPage'));
const CreateBiodataPage   = lazy(() => import('./pages/CreateBiodataPage'));
const EditBiodataPage     = lazy(() => import('./pages/EditBiodataPage'));
const ProfilePage         = lazy(() => import('./pages/ProfilePage'));
const DashboardPage       = lazy(() => import('./pages/DashboardPage'));
const GalleryPage         = lazy(() => import('./pages/GalleryPage'));
const AboutPage           = lazy(() => import('./pages/AboutPage'));
const PricingPage         = lazy(() => import('./pages/PricingPage'));
const PrivacyPage         = lazy(() => import('./pages/PrivacyPage'));
const TermsPage           = lazy(() => import('./pages/TermsPage'));
const RefundPage          = lazy(() => import('./pages/RefundPage'));
const ContactPage         = lazy(() => import('./pages/ContactPage'));
const ExplorePage         = lazy(() => import('./pages/ExplorePage'));
const NotFoundPage        = lazy(() => import('./pages/NotFoundPage'));
const ServerErrorPage     = lazy(() => import('./pages/ServerErrorPage'));

// ── Page transition loader ────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0000]">
    <div className="w-12 h-12 border-4 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
    <p className="mt-4 text-[#d4a017] font-medium tracking-widest text-sm uppercase">Loading…</p>
  </div>
);

// ── QueryClient ───────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE.PUBLIC_BIODATAS_STALE_MS,
      gcTime:    CACHE.GC_TIME_MS,
      retry: 1,
    },
  },
});

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const googleClientId = GOOGLE_CLIENT_ID;

  return (
    <ErrorBoundary level="app">
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <ToastProvider>
              <LanguageProvider>
              <BrowserRouter>
                <Navbar />
                {/* Toast container — always visible, portal-like fixed position */}
                <ToastContainer />
                {/* Mobile sticky CTA — logged-out users only, md breakpoint hides it */}
                <MobileCTA />

                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary level="route">
                    <Routes>
                      {/* ── Public ── */}
                      <Route path="/"                  element={<HomePage />} />
                      <Route path="/gallery"           element={<GalleryPage />} />
                      <Route path="/about"             element={<AboutPage />} />
                      <Route path="/pricing"           element={<PricingPage />} />
                      <Route path="/privacy"           element={<PrivacyPage />} />
                      <Route path="/terms"             element={<TermsPage />} />
                      <Route path="/refund"            element={<RefundPage />} />
                      <Route path="/contact"           element={<ContactPage />} />
                      <Route path="/explore"           element={<ExplorePage />} />
                      <Route path="/profile/:id"       element={<ProfilePage />} />

                      {/* ── Auth ── */}
                      <Route path="/login"             element={<LoginPage />} />
                      <Route path="/signup"            element={<SignupPage />} />
                      <Route path="/forgot-password"   element={<ForgotPasswordPage />} />
                      <Route path="/reset-password"    element={<ResetPasswordPage />} />
                      <Route path="/verify-email"      element={<VerifyEmailPage />} />

                      {/* ── Protected ── */}
                      <Route path="/create"   element={<ProtectedRoute><CreateBiodataPage /></ProtectedRoute>} />
                      <Route path="/edit/:id" element={<ProtectedRoute><EditBiodataPage /></ProtectedRoute>} />
                      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

                      {/* ── Error pages ── */}
                      <Route path="/500" element={<ServerErrorPage />} />

                      {/* ── Catch-all 404 ── */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </ErrorBoundary>
                </Suspense>
              </BrowserRouter>
              </LanguageProvider>
            </ToastProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
