import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LogOut, LayoutDashboard, PlusCircle,
  Home, Menu, X, Compass,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import logo from "../../assets/aguaa-logo-r.webp";

const Navbar = () => {
  const { currentUser, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0); // 0-100

  /* ── Scroll tracking ──────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollDepth(max > 0 ? Math.round((y / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close mobile menu on resize to md ───────────────────── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  /* ── NavLink active style helper ─────────────────────────── */
  const linkCls = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium transition-all duration-200 relative group
     ${isActive
       ? "text-yellow-400"
       : "text-gray-400 hover:text-yellow-300"
     }`;

  /* ── Active indicator dot ─────────────────────────────────── */
  const ActiveDot = ({ isActive }) =>
    isActive ? (
      <span className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-500 shadow-[0_0_6px_2px_rgba(234,179,8,0.6)]" />
    ) : null;

  /* ── Nav links list ───────────────────────────────────────── */
  const navLinks = currentUser
    ? [
        { to: "/",          label: "Home",        icon: <Home className="w-4 h-4" />          },
        { to: "/explore",   label: "Explore",     icon: <Compass className="w-4 h-4" />       },
        { to: "/dashboard", label: "My Biodatas", icon: <LayoutDashboard className="w-4 h-4" />},
        { to: "/create",    label: "Create New",  icon: <PlusCircle className="w-4 h-4" />    },
      ]
    : [
        { to: "/",        label: "Home",    icon: <Home className="w-4 h-4" />    },
        { to: "/explore", label: "Explore", icon: <Compass className="w-4 h-4" /> },
      ];

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-yellow-900/30"
            : "border-b border-transparent"
        }`}
        style={{
          background: scrolled
            ? `rgba(10,2,0,${Math.min(0.96, 0.72 + scrollDepth * 0.004)})`
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        {/* Scroll progress bar — decorative, hidden from screen readers */}
        <div
          role="presentation"
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-yellow-800 via-yellow-500 to-yellow-800 origin-left transition-[width] duration-100 ease-linear"
          style={{ width: `${scrollDepth}%`, opacity: scrolled ? 1 : 0 }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <img
                src={logo}
                alt="AGUAA"
                className="h-14 sm:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkCls}>
                  {({ isActive }) => (
                    <>
                      {/* Nav icon — decorative; label is the accessible name */}
                      <span aria-hidden="true">{link.icon}</span>
                      <span>{link.label}</span>
                      <ActiveDot isActive={isActive} />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Desktop auth area */}
            <div className="hidden md:flex items-center gap-3">
              {loading && !currentUser ? (
                <div className="w-28 h-8 rounded-lg bg-yellow-900/20 animate-pulse" />
              ) : currentUser ? (
                <div className="flex items-center gap-3">
                  {/* User avatar chip */}
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-red-950/50 border border-yellow-900/20 hover:border-yellow-800/40 transition-colors">
                    {/* Avatar circle with gradient ring */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-[1.5px] rounded-full bg-gradient-to-br from-yellow-600 to-red-700 opacity-80" />
                      <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-yellow-700 to-red-800 flex items-center justify-center text-white text-xs font-bold">
                        {(currentUser.name || currentUser.email)?.[0]?.toUpperCase()}
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 max-w-[110px] truncate leading-none">
                      {currentUser.name || currentUser.email}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                  <Button variant="gold" size="sm" onClick={() => navigate("/signup")}>
                    Get Started Free
                  </Button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
            style={{
              background: 'rgba(8,1,0,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(184,134,11,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                     ${isActive
                       ? "bg-yellow-900/20 text-yellow-400 border border-yellow-800/30"
                       : "text-gray-300 hover:text-yellow-300 hover:bg-white/[0.04]"
                     }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}

              {/* Auth actions */}
              <div className="mt-2 pt-3 border-t border-red-900/20 flex flex-col gap-2">
                {loading && !currentUser ? (
                  <div className="w-full h-10 rounded-xl bg-yellow-900/20 animate-pulse" />
                ) : currentUser ? (
                  <>
                    {/* User info row */}
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-950/40 border border-yellow-900/15 mb-1">
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-[1.5px] rounded-full bg-gradient-to-br from-yellow-600 to-red-700 opacity-70" />
                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-yellow-700 to-red-800 flex items-center justify-center text-white text-sm font-bold">
                          {(currentUser.name || currentUser.email)?.[0]?.toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{currentUser.name || 'User'}</p>
                        <p className="text-gray-500 text-xs truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-center">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => { navigate("/login"); setMobileOpen(false); }} className="w-full justify-center">
                      Sign In
                    </Button>
                    <Button variant="gold" size="sm" onClick={() => { navigate("/signup"); setMobileOpen(false); }} className="w-full justify-center">
                      Get Started Free
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
