import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { LogOut, LayoutDashboard, PlusCircle, Home, Menu, X, Heart } from 'lucide-react';
import { logOut } from '../../firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const navLinks = currentUser
    ? [
        { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/dashboard', label: 'My Biodatas', icon: <LayoutDashboard className="w-4 h-4" /> },
        { to: '/create', label: 'Create New', icon: <PlusCircle className="w-4 h-4" /> },
      ]
    : [{ to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> }];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-red-800 to-red-600 border border-yellow-700/30">
                <Heart className="w-5 h-5 text-yellow-400 fill-yellow-400/30" />
              </div>
              <span className="text-xl font-bold tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span className="text-yellow-400">Bio</span>
                <span className="text-white">Data</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-900/30">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-600 to-red-700 flex items-center justify-center text-white text-xs font-bold">
                      {(currentUser.displayName || currentUser.email)?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 max-w-[120px] truncate">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button variant="gold" size="sm" onClick={() => navigate('/signup')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass border-b border-yellow-900/20 p-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-300 hover:text-yellow-400 hover:bg-red-950/40 transition-all"
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              <div className="border-t border-red-900/30 pt-3 flex flex-col gap-2">
                {currentUser ? (
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-center">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => { navigate('/login'); setMobileOpen(false); }} className="w-full justify-center">
                      Sign In
                    </Button>
                    <Button variant="gold" size="sm" onClick={() => { navigate('/signup'); setMobileOpen(false); }} className="w-full justify-center">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
