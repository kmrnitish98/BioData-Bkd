import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Search, Heart } from 'lucide-react';

import { apiGetPublicBiodatas } from '../api/client';
import BiodataCard from '../components/biodata/BiodataCard';
import Button from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';

const ExplorePage = () => {
  useSEO('/explore');
  const [biodatas, setBiodatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
    window.scrollTo(0, 0);

    const load = async () => {
      try {
        const data = await apiGetPublicBiodatas();
        setBiodatas(data);
      } catch (err) {
        console.error('Error fetching biodatas:', err);
        setError('Could not connect to the server. Please check your connection.');
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

    if (activeFilter !== 'All') {
      // Mock filtering for design purposes
      if (activeFilter === 'Religion' && !b.personalInfo?.religion) return false;
      if (activeFilter === 'Location' && !city) return false;
    }

    return name.includes(q) || city.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#0f0a00] text-[#f5ead0] font-['DM_Sans',sans-serif] pt-24 selection:bg-[#d4a017]/30 selection:text-[#f0c040]">
      <section className="py-12 lg:py-20 relative overflow-hidden min-h-screen">
        {/* BG: Indian textile / honeycomb weave pattern */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(180deg, #0e0500 0%, #1a0900 40%, #120600 100%)' }} />
        <div className="absolute inset-0 z-0 opacity-[0.055]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34zm0-18L8 36V20L28 8l20 12v16z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }} />
        <div className="absolute top-0 left-1/2 w-[700px] h-[400px] -translate-x-1/2 -translate-y-1/2 opacity-10 z-0" style={{ background: 'radial-gradient(ellipse, #d4a017 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-8 z-0" style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)', transform: 'translate(-30%,30%)' }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] opacity-8 z-0" style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)', transform: 'translate(30%,30%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">
              Discover Rishta
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Explore Marriage{" "}<span className="text-[#f0c040] italic">Biodata Profiles</span>
            </h1>
            <p className="text-sm text-[#a89060] max-w-xl mx-auto mb-6">
              Bihar, UP, Jharkhand ke verified matrimonial profiles browse kare — free mein.
            </p>

            <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
              <div className="w-full relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4a017] to-[#f0c040] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex items-center bg-[#1f1500] border border-[#d4a017]/50 rounded-full p-2 backdrop-blur-md">
                  <Search className="w-6 h-6 text-[#d4a017] ml-4" />
                  <input
                    type="text"
                    placeholder="Search by name or city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-none text-[#f5ead0] px-4 py-3 focus:outline-none placeholder-[#a89060] text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 max-w-full no-scrollbar">
                {['All', 'Religion', 'Age', 'Location'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-2 rounded-full border text-sm whitespace-nowrap transition-all ${activeFilter === filter
                      ? 'bg-[#d4a017] border-[#d4a017] text-[#0f0a00] font-medium shadow-[0_0_15px_rgba(212,160,23,0.4)]'
                      : 'bg-[#1f1500] border-[#d4a017]/30 text-[#a89060] hover:border-[#d4a017]/70'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#1f1500] border-t-[#d4a017] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-[#1f1500] border border-amber-900/50 rounded-3xl max-w-md mx-auto">
              <p className="text-amber-500 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-[#1f1500] border border-[#d4a017]/20 rounded-3xl">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-[#d4a017]/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute inset-0 border border-[#d4a017]/20 rounded-full flex items-center justify-center bg-gradient-to-b from-[#1a0900]/40 to-transparent">
                  <Heart className="w-10 h-10 text-[#d4a017]/60" />
                </div>
              </div>
              <p className="text-[#a89060] mb-6 text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                No profiles found matching your search.
              </p>
              {!search && (
                <Link to="/create">
                  <Button variant="gold" size="lg">Create the First Profile</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((biodata, idx) => (
                <div
                  key={biodata._id}
                  data-aos="fade-up"
                  data-aos-delay={(idx % 8) * 50}
                >
                  <BiodataCard biodata={biodata} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
