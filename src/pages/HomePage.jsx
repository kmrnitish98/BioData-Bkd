import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Sparkles, Heart } from 'lucide-react';
import { getPublicBiodatas } from '../firebase/firestore';
import BiodataCard from '../components/biodata/BiodataCard';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [biodatas, setBiodatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublicBiodatas();
        setBiodatas(data);
      } catch {
        setBiodatas([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = biodatas.filter((b) => {
    const name = b.personalInfo?.fullName?.toLowerCase() || '';
    const city = b.personalInfo?.city?.toLowerCase() || '';
    const q = search.toLowerCase();
    return name.includes(q) || city.includes(q);
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0000] via-[#1a0000] to-[#0d0000]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 30% 40%, rgba(184,134,11,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(139,0,0,0.4) 0%, transparent 50%)',
          }}
        />
        {/* Diagonal pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(184,134,11,0.3) 40px,
              rgba(184,134,11,0.3) 41px
            )`,
          }}
        />

        {/* Top gold line */}
        <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-700/40 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/60 border border-yellow-700/30 text-yellow-400 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Premium Indian Wedding Biodata
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Find Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              Perfect Match
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create beautiful, shareable marriage biodatas with our premium Indian wedding theme.
            Share with family and find your ideal life partner.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {currentUser ? (
              <Link to="/create">
                <Button variant="gold" size="lg">
                  <PlusCircle className="w-5 h-5" />
                  Create Your Biodata
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="gold" size="lg">
                    <Heart className="w-5 h-5" />
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0000] to-transparent" />
      </section>

      {/* Public Profiles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl md:text-5xl font-light text-white mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Explore <span className="text-yellow-400">Profiles</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-700/60" />
              <span className="text-yellow-700 text-lg">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-700/60" />
            </div>
            <p className="text-gray-500 max-w-xl mx-auto">
              Browse verified biodata profiles shared by families seeking auspicious alliances.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-700/60" />
            <input
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-red-950/30 border border-yellow-900/30 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-700/50 transition-colors"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-yellow-700/30 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Heart className="w-16 h-16 text-red-900/50 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No public profiles found</p>
            <p className="text-gray-700 text-sm">
              {search ? 'Try a different search term.' : 'Be the first to create a biodata!'}
            </p>
            {!search && currentUser && (
              <Link to="/create" className="mt-6 inline-block">
                <Button variant="gold" size="md">
                  <PlusCircle className="w-4 h-4" />
                  Create First Biodata
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((biodata, i) => (
              <BiodataCard key={biodata.id} biodata={biodata} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      {!currentUser && (
        <section className="mx-4 sm:mx-8 mb-20 rounded-3xl overflow-hidden">
          <div className="relative px-8 py-16 text-center bg-gradient-to-br from-red-950 via-[#1a0000] to-red-950 border border-yellow-800/20">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(184,134,11,0.4) 0%, transparent 70%)' }} />
            <div className="relative">
              <p className="text-yellow-500 text-sm tracking-widest uppercase mb-3 font-medium">✦ Start Your Journey ✦</p>
              <h2 className="text-3xl md:text-4xl font-light text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Create Your Premium Biodata Today
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Sign up free and build a beautiful, shareable biodata in minutes.
              </p>
              <Link to="/signup">
                <Button variant="gold" size="lg">
                  <Sparkles className="w-5 h-5" />
                  Create Free Biodata
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-red-900/30 py-10 text-center glass">
        <p className="text-yellow-700/60" style={{ fontFamily: 'Playfair Display, serif' }}>
          ✦ BioData ✦
        </p>
        <p className="text-gray-700 text-sm mt-1">
          © {new Date().getFullYear()} BioData. Crafted with love for auspicious alliances.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
