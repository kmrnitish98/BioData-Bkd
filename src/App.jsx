import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const CreateBiodataPage = lazy(() => import('./pages/CreateBiodataPage'));
const EditBiodataPage = lazy(() => import('./pages/EditBiodataPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));

// Inline Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0000]">
    <div className="w-12 h-12 border-4 border-[#d4a017] border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-[#d4a017] font-medium tracking-widest text-sm uppercase">Loading...</p>
  </div>
);

// Inline 404 page — no extra file needed for a simple fallback
const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
    <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#150000] to-[#0d0000] -z-10" />
    <p className="text-yellow-700 text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>404</p>
    <h1 className="text-2xl text-white font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
      Page Not Found
    </h1>
    <p className="text-gray-400 text-sm mb-6">The page you are looking for doesn't exist.</p>
    <a href="/" className="text-yellow-400 hover:text-yellow-300 text-sm underline underline-offset-4 transition-colors">
      Go back home
    </a>
  </div>
);

const queryClient = new QueryClient();

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
      <LanguageProvider>
        <BrowserRouter>
          <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateBiodataPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditBiodataPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            {/* Catch-all: renders for any unknown URL */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </LanguageProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
