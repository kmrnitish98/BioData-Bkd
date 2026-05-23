import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateBiodataPage from './pages/CreateBiodataPage';
import EditBiodataPage from './pages/EditBiodataPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import RefundPage from './pages/RefundPage';
import ContactPage from './pages/ContactPage';
import ExplorePage from './pages/ExplorePage';

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

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Navbar />
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
    </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
