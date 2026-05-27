import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, AlertTriangle, RefreshCw, SlidersHorizontal, Users } from 'lucide-react';

import { apiGetPublicBiodatas } from '../api/client';
import BiodataCard from '../components/biodata/BiodataCard';
import Button from '../components/ui/Button';
import TrustBar from '../components/ui/TrustBar';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useSEO } from '../hooks/useSEO';

const fadeUpVariant = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const FILTERS = ['All', 'With Photo', 'Religion', 'Location'];

const ExplorePage = () => {
  useSEO('/explore');
  const [biodatas, setBiodatas]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [error, setError]         = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const searchRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const result = await apiGetPublicBiodatas();
        setBiodatas(Array.isArray(result) ? result : (result.data || []));
      } catch (err) {
        setError('Could not connect. Please check your connection and try again.');
        setBiodatas([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const retry = () => {
    setError(null);
    setLoading(true);
    apiGetPublicBiodatas()
      .then(result => setBiodatas(Array.isArray(result) ? result : (result.data || [])))
      .catch(() => setError('Still unable to connect. Please try again.'))
      .finally(() => setLoading(false));
  };

  const filtered = biodatas.filter((b) => {
    const name = b.personalInfo?.fullName?.toLowerCase() || '';
    const city = b.personalInfo?.city?.toLowerCase() || '';
    const q    = search.toLowerCase();
    if (activeFilter === 'With Photo' && !b.photoURL) return false;
    if (activeFilter === 'Religion'   && !b.personalInfo?.religion) return false;
    if (activeFilter === 'Location'   && !city) return false;
    return name.includes(q) || city.includes(q);
  });

  return (
    <div className="min-h-screen pt-24 pb-20 page-enter" style={{ background: 'linear-gradient(180deg,#0e0500 0%,#120600 60%,#0d0400 100%)' }}>

      {/* ── Ambient BG ─────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34zm0-18L8 36V20L28 8l20 12v16z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] -translate-y-1/2 opacity-[0.09] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #d4a017 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ──────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-yellow-600/80 mb-4">
            <span className="w-5 h-px bg-yellow-700/60" />
            Discover Rishta
            <span className="w-5 h-px bg-yellow-700/60" />
          </p>

          <h1
            className="text-4xl sm:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Explore Marriage{' '}
            <span className="italic text-gradient-gold">Biodata Profiles</span>
          </h1>

          <p className="text-sm text-yellow-700/60 max-w-lg mx-auto mb-2 leading-relaxed">
            Bihar, UP, Jharkhand ke verified matrimonial profiles browse kare — free mein.
          </p>

          {/* Live count badge */}
          {!loading && !error && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="badge-live inline-flex items-center text-xs text-emerald-400/80 mt-1"
            >
              <span className="font-semibold text-emerald-300">{biodatas.length}</span>
              &nbsp;profiles available right now
            </motion.p>
          )}
        </motion.div>

        {/* ── Trust bar ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <TrustBar />
          <div className="sep-gold mt-6" />
        </motion.div>

        {/* ── Search + Filters ─────────────────────────────────── */}
        <motion.div
          className="max-w-2xl mx-auto mb-10"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          {/* Search box */}
          <div role="search" aria-label="Search marriage profiles" className="relative group mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-800/30 to-red-900/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <div
              className="relative flex items-center rounded-2xl px-4 py-1 transition-all duration-300"
              style={{
                background: 'rgba(20,8,0,0.8)',
                border: '1px solid rgba(212,160,23,0.25)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Search className="w-5 h-5 text-yellow-700/60 flex-shrink-0 mr-3" />
              <input
                ref={searchRef}
                id="explore-search"
                type="search"
                placeholder="Search by name or city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search profiles by name or city"
                className="flex-1 bg-transparent border-none text-white py-3.5 focus:outline-none placeholder-yellow-900/50 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-gray-600 hover:text-gray-400 transition-colors text-lg leading-none ml-2"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
              <SlidersHorizontal className="w-4 h-4 text-yellow-800/50 ml-2 flex-shrink-0" />
            </div>
          </div>

          {/* Filter chips — role=group + aria-label narrates the control set */}
          <div
            role="group"
            aria-label="Filter profiles"
            className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`
                  px-5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
                  border transition-all duration-200 flex-shrink-0
                  ${activeFilter === filter
                    ? 'bg-[#d4a017] border-[#d4a017] text-[#0f0a00] shadow-[0_0_14px_rgba(212,160,23,0.4)]'
                    : 'bg-transparent border-yellow-800/30 text-yellow-700/70 hover:border-yellow-700/60 hover:text-yellow-500'
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Content ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* Loading skeleton */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          )}

          {/* Error state */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto glass-card rounded-3xl p-8 border border-red-900/30 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-950/60 border border-red-800/40 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-white font-medium mb-2 text-sm">Connection Failed</p>
              <p className="text-gray-500 text-xs mb-6 leading-relaxed">{error}</p>
              <Button variant="outline" size="sm" onClick={retry}>
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Empty / no results */}
          {!loading && !error && filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={Heart}
                title={search ? 'No Profiles Found' : 'Be the First!'}
                description={
                  search
                    ? `No profiles match "${search}". Try a different name or city.`
                    : 'No public profiles yet. Create a beautiful biodata and help others find their perfect match.'
                }
                action={
                  !search
                    ? { label: 'Create the First Profile', to: '/create', variant: 'gold' }
                    : { label: 'Clear Search', onClick: () => setSearch(''), variant: 'ghost' }
                }
              />
            </motion.div>
          )}

          {/* Profile grid */}
          {!loading && !error && filtered.length > 0 && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Result count — aria-live announces filter changes to screen readers */}
              <div className="flex items-center justify-between mb-5">
                <p
                  className="text-xs text-gray-600 flex items-center gap-1.5"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Users className="w-3.5 h-3.5 text-yellow-800/60" aria-hidden="true" />
                  Showing <span className="text-yellow-600 font-medium">{filtered.length}</span> of {biodatas.length} profiles
                  {search && <span> matching <span className="text-yellow-500">&quot;{search}&quot;</span></span>}
                </p>
                {activeFilter !== 'All' && (
                  <button
                    onClick={() => setActiveFilter('All')}
                    aria-label="Clear active filter"
                    className="text-xs text-yellow-700/60 hover:text-yellow-500 transition-colors"
                  >
                    Clear filter ×
                  </button>
                )}
              </div>

              <div
                role="feed"
                aria-label="Marriage biodata profiles"
                aria-busy={loading}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
              >
                {filtered.map((biodata, idx) => (
                  <motion.div
                    key={biodata._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.32), duration: 0.45 }}
                  >
                    <BiodataCard biodata={biodata} />
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA — conversion nudge */}
              {!loading && filtered.length >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-16 text-center glass-card rounded-3xl border border-yellow-900/15 py-10 px-6"
                >
                  <p className="text-yellow-700/50 text-xs uppercase tracking-widest mb-3">Your Profile</p>
                  <h2 className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Don&apos;t see your match?
                  </h2>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                    Create your own biodata and let the right person find you. Free, beautiful, print-ready.
                  </p>
                  <Link to="/create">
                    <Button variant="gold" size="md">Create Your Biodata Free</Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExplorePage;
