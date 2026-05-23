import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CountUp from 'react-countup';
import {
  PlusCircle, Search, Sparkles, Heart, CheckCircle, Shield,
  Smartphone, FileText, Download, Star, ChevronDown,
  Users, ArrowRight, Mail, Share2, QrCode, Lock, ChevronRight, Check,
  Quote, MessageCircle, MapPin, Upload, X
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

import { apiGetPublicBiodatas } from '../api/client';
import BiodataCard from '../components/biodata/BiodataCard';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

// Constants
const BACKGROUND_VIDEOS = [
  "https://www.pexels.com/download/video/34565055/",
  "https://www.pexels.com/download/video/16352543/",
  "https://www.pexels.com/download/video/14299460/",
  "https://www.pexels.com/download/video/29766220/"
];

const HERO_MEDIA = [
  { type: 'image', src: "https://images.unsplash.com/photo-1733759414886-6b3a5423ceb3?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1600685912448-8bc35c141e18?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1645856049928-d544f6b80ce2?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1754782915842-aa4fca6c203a?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1760080903792-874870c70902?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1740418762511-b3927603599a?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1754782915524-714d8534a5df?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1703044412297-166a93480d1f?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1703044412383-fa6b9884e802?w=500&auto=format&fit=crop&q=60&fm=webp" },
  { type: 'image', src: "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?w=500&auto=format&fit=crop&q=60&fm=webp" }
];

const HomePage = () => {
  const { currentUser } = useAuth();
  const [biodatas, setBiodatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [activeBg, setActiveBg] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [galleryLimit, setGalleryLimit] = useState(8);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });

    const interval = setInterval(() => {
      setActiveBg((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
    }

    return name.includes(q) || city.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#0f0a00] text-[#f5ead0] overflow-hidden font-['DM_Sans',sans-serif] selection:bg-[#d4a017]/30 selection:text-[#f0c040]">

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center pt-8 pb-[56px] lg:pb-[96px] lg:pt-16 overflow-hidden">
        {/* Animated Accordion Video Background */}
        <div className="absolute inset-0 z-0 flex w-full h-full overflow-hidden opacity-90">
          {BACKGROUND_VIDEOS.map((src, i) => (
            <div
              key={i}
              className={`relative h-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-default overflow-hidden border-r border-[#d4a017]/10 last:border-r-0 ${activeBg === i ? 'flex-[2] md:flex-[3]' : 'flex-1'} hover:flex-[2.5]`}
              onMouseEnter={() => setActiveBg(i)}
            >
              <video
                src={src}
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a00]/90 via-[#0f0a00]/40 to-[#0f0a00]/80" />
            </div>
          ))}
        </div>

        {/* Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#d4a017] rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                opacity: Math.random() * 0.5 + 0.3
              }}
              animate={{
                y: [null, Math.random() * -200],
                opacity: [null, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1f1500]/80 border border-[#d4a017]/40 text-[#f0c040] text-sm mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,160,23,0.2)]"
              >
                <Sparkles className="w-4 h-4" />
                <span className="tracking-wide uppercase font-medium text-xs">Premium Wedding Biodata</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.1]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Find Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#b8860b] font-medium drop-shadow-sm">
                  Perfect Match
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-[#a89060] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
              >
                Create beautiful, shareable Indian wedding biodatas with a premium modern experience for families and life partners.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <Link to={currentUser ? "/create" : "/signup"}>
                  <Button variant="gold" size="xl" className="w-full sm:w-auto text-lg shadow-[0_0_30px_rgba(212,160,23,0.3)] hover:shadow-[0_0_40px_rgba(212,160,23,0.5)] transition-shadow">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create My BioData
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg border-[#d4a017]/50 hover:bg-[#1f1500] text-[#f0c040]">
                    Explore Profiles
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex items-center justify-center lg:justify-start gap-8 border-t border-[#d4a017]/20 pt-6"
              >
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white"><CountUp end={10} duration={3} />K+</span>
                  <span className="text-xs text-[#a89060] uppercase tracking-wider">Families Trusted</span>
                </div>
                <div className="w-px h-10 bg-[#d4a017]/20" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[#f0c040] text-2xl font-bold">
                    <CountUp end={4} duration={3} />.<CountUp end={9} duration={3} /> <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-xs text-[#a89060] uppercase tracking-wider">User Rating</span>
                </div>
                <div className="w-px h-10 bg-[#d4a017]/20" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white flex items-center gap-1">
                    <Shield className="w-5 h-5 text-amber-500" /> <CountUp end={100} duration={3} />%
                  </span>
                  <span className="text-xs text-[#a89060] uppercase tracking-wider">Verified</span>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Cinematic Cards */}
            <div className="relative hidden lg:block h-[550px] w-full" data-aos="fade-left" data-aos-delay="400">
              <div className="absolute inset-0 flex items-center justify-center">
                <Swiper
                  effect={'cards'}
                  grabCursor={true}
                  modules={[EffectCards, Autoplay]}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  className="w-[320px] h-[480px]"
                >
                  {HERO_MEDIA.map((media, idx) => (
                    <SwiperSlide key={idx} className="rounded-2xl overflow-hidden border border-[#d4a017]/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                      <div className="relative w-full h-full group">
                        <img
                          src={media.src}
                          alt="Wedding"
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a00]/90 via-[#0f0a00]/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-xs text-white/80 uppercase tracking-wider">Premium Match</span>
                          </div>
                          <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#d4a017]"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-10 bg-[#1a1000]/80 backdrop-blur-xl border border-[#d4a017]/30 p-4 rounded-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-[#f5ead0] font-medium text-sm">Verified Profile</p>
                  <p className="text-xs text-[#a89060]">Just matched!</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 -right-10 bg-[#1a1000]/80 backdrop-blur-xl border border-[#d4a017]/30 p-4 rounded-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="w-12 h-12 rounded-full bg-[#d4a017]/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#d4a017] fill-current" />
                </div>
                <div>
                  <p className="text-[#f5ead0] font-medium text-sm">Perfect Match</p>
                  <p className="text-xs text-[#a89060]">99% Compatibility</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#a89060] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-[#d4a017]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ================= SECTION 1: WHY CHOOSE US ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Diagonal gold silk stripes + deep maroon base */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #120500 0%, #1e0b00 50%, #120500 100%)' }} />
        <div className="absolute inset-0 z-0 opacity-[0.06]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px)',
        }} />
        <div className="absolute inset-0 z-0 opacity-[0.06]" style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, #8b0000 0px, #8b0000 1px, transparent 1px, transparent 60px)',
        }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 z-0" style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 z-0" style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">Why Choose Us</h2>
            <h3 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Experience <span className="text-[#f0c040] italic">Premium</span> Matrimony
            </h3>
            <div className="mt-6 flex justify-center items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4a017]/50" />
              <Heart className="w-4 h-4 text-[#d4a017]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4a017]/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Verified Profiles", desc: "Every profile undergoes strict manual verification for your safety and peace of mind." },
              { icon: Sparkles, title: "Easy Biodata Creation", desc: "Intuitive builder makes creating your royal biodata a breeze within minutes." },
              { icon: Lock, title: "Secure Sharing", desc: "Control who sees your biodata with advanced privacy settings and secure links." },
              { icon: Smartphone, title: "Mobile Friendly", desc: "Beautifully responsive design that looks perfect on any device, anywhere." },
              { icon: FileText, title: "Premium Templates", desc: "Choose from our exclusive collection of royal Indian design themes." },
              { icon: Download, title: "Fast PDF Download", desc: "Generate high-quality PDF biodatas instantly with a single click." }
            ].map((feature, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="group relative p-8 rounded-3xl bg-[#1f1500] border-t-2 border-[#d4a017] border-x border-b border-[#d4a017]/20 hover:border-[#f0c040]/80 transition-all duration-300 hover:bg-[#2a1e08] hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_40px_rgba(212,160,23,0.15)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                  <feature.icon className="w-12 h-12 text-[#d4a017] mb-6 group-hover:scale-110 group-hover:text-[#f0c040] transition-all drop-shadow-md" />
                  <h4 className="text-xl font-medium text-[#f5ead0] mb-3">{feature.title}</h4>
                  <p className="text-[#a89060] leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: HOW IT WORKS ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Dot-grid constellation + dark navy-charcoal */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(160deg, #060206 0%, #0a0510 50%, #080308 100%)' }} />
        <div className="absolute inset-0 z-0 opacity-[0.35]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(212,160,23,0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute inset-0 z-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, rgba(139,0,0,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: '16px 16px',
        }} />
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.12)_0%,transparent_65%)]" />
        <div className="absolute top-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">Simple Process</h2>
            <h3 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              How It <span className="text-[#f0c040] italic">Works</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Animated Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-[#d4a017]/20 to-transparent z-0 overflow-hidden">
              <motion.div
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#f0c040] to-transparent"
                animate={{ x: ['-100%', '300%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {[
              { icon: Users, title: "1. Create Profile", desc: "Sign up and enter your basic details securely." },
              { icon: Heart, title: "2. Add Details", desc: "Fill in family, education, and lifestyle information." },
              { icon: Sparkles, title: "3. Choose Theme", desc: "Select from our premium royal templates." },
              { icon: Share2, title: "4. Share & Connect", desc: "Download PDF or share your unique profile link." }
            ].map((step, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 150} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#1f1500] border-2 border-[#d4a017]/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,160,23,0.2)] backdrop-blur-md relative group hover:border-[#f0c040] transition-colors">
                  <step.icon className="w-10 h-10 text-[#d4a017] group-hover:scale-110 transition-transform" />
                  <div className="absolute -inset-4 text-6xl text-[#d4a017]/20 font-bold -z-10 flex items-center justify-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {idx + 1}
                  </div>
                </div>
                <h4 className="text-xl font-medium text-[#f5ead0] mb-2">{step.title}</h4>
                <p className="text-[#a89060] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EXPLORE PROFILES ================= */}
      <section id="explore" className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Indian textile / honeycomb weave pattern */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(180deg, #0e0500 0%, #1a0900 40%, #120600 100%)' }} />
        <div className="absolute inset-0 z-0 opacity-[0.055]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34zm0-18L8 36V20L28 8l20 12v16z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }} />
        <div className="absolute top-0 left-1/2 w-[700px] h-[400px] -translate-x-1/2 -translate-y-1/2 opacity-10 z-0" style={{ background: 'radial-gradient(ellipse, #d4a017 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-8 z-0" style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)', transform: 'translate(-30%,30%)' }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] opacity-8 z-0" style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)', transform: 'translate(30%,30%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">Discover</h2>
            <h3 className="text-4xl md:text-5xl font-light text-white mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Explore <span className="text-[#f0c040] italic">Profiles</span>
            </h3>

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
              <Heart className="w-16 h-16 text-[#d4a017]/50 mx-auto mb-4" />
              <p className="text-[#a89060] mb-6 text-lg">No profiles found matching your search.</p>
              {!search && (
                <Link to="/create">
                  <Button variant="gold" size="lg">Create the First Profile</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-5 pb-8 snap-x no-scrollbar px-4 -mx-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
              {filtered.slice(0, 8).map((biodata, idx) => (
                <div
                  key={biodata._id}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="min-w-[220px] lg:min-w-0 snap-center"
                >
                  <BiodataCard biodata={biodata} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= SECTION 4: SUCCESS STORIES ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Starburst radial lines + deep forest-black */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #020202 0%, #0d0800 50%, #040204 100%)' }} />
        <div className="absolute inset-0 z-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cline x1='50' y1='50' x2='50' y2='0' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='100' y2='0' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='100' y2='50' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='100' y2='100' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='50' y2='100' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='0' y2='100' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='0' y2='50' stroke='%23d4a017' stroke-width='0.5'/%3E%3Cline x1='50' y1='50' x2='0' y2='0' stroke='%23d4a017' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 z-0" style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 60%)' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-8 z-0" style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 60%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">Testimonials</h2>
            <h3 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Success <span className="text-[#f0c040] italic">Stories</span>
            </h3>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            className="pb-16"
          >
            {[
              { name: "Rahul & Priya", loc: "Mumbai", text: "Found my perfect match within weeks. The biodata format was elegant and truly appreciated by both families." },
              { name: "Amit & Sneha", loc: "Delhi", text: "The premium templates made a huge difference. Very professional and easy to share securely on WhatsApp." },
              { name: "Vikram & Anjali", loc: "Bangalore", text: "Beautiful UI and seamless experience. We love how our biodata turned out. Highly recommended platform!" },
              { name: "Karan & Riya", loc: "Pune", text: "Secure, private, and exceptionally well-designed. The best matrimony biodata maker out there by far." }
            ].map((review, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-[#2a1e08] border border-[#d4a017]/30 hover:border-[#f0c040]/60 transition-colors p-8 rounded-3xl h-full flex flex-col shadow-lg relative group overflow-hidden">
                  <Quote className="absolute top-6 right-6 w-16 h-16 text-[#d4a017]/10 group-hover:scale-110 group-hover:text-[#d4a017]/20 transition-all" />
                  <div className="flex text-[#f0c040] mb-6 relative z-10">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current drop-shadow-sm" />)}
                  </div>
                  <p className="text-[#f5ead0] italic mb-8 flex-grow text-lg relative z-10">"{review.text}"</p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-[#1a1000] border-2 border-[#d4a017] flex items-center justify-center font-bold text-[#f0c040] text-xl shadow-md">
                      {review.name[0]}
                    </div>
                    <div>
                      <h5 className="text-white font-medium text-lg">{review.name}</h5>
                      <p className="text-sm text-[#a89060]">{review.loc}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ================= SECTION 5: GALLERY SECTION ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">

        {/* ── Rich Background ── */}
        <div className="absolute inset-0 z-0">
          {/* Deep layered gradient */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(160deg, #0d0500 0%, #1a0800 30%, #0f0300 60%, #1f0e00 100%)'
          }} />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(rgba(212,160,23,0.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(212,160,23,0.8) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
          {/* Radial glow orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 70%)', transform: 'translate(-50%,-50%)' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)', transform: 'translate(50%,50%)' }} />
          <div className="absolute top-1/2 right-0 w-[300px] h-[600px] rounded-full opacity-6"
            style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 70%)' }} />
          {/* Top & bottom gold line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* ── Section Header ── */}
          <div className="text-center mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, #d4a017)' }} />
              <span className="text-xs font-semibold tracking-[4px] uppercase" style={{ color: '#d4a017' }}>Inspiration</span>
              <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, #d4a017)' }} />
            </div>
            <h3 className="text-4xl md:text-6xl font-light text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Wedding <span className="italic font-medium" style={{ color: '#f0c040' }}>Gallery</span>
            </h3>
            <p className="text-sm text-[#a89060] max-w-md mx-auto leading-relaxed">
              Curated moments of love, tradition & celebration from real Indian weddings
            </p>
            {/* Category pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['All', 'Ceremony', 'Portraits', 'Mehendi', 'Reception'].map((cat, i) => (
                <button key={cat} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${i === 0
                  ? 'border-[#d4a017] text-[#1a0800] shadow-[0_0_12px_rgba(212,160,23,0.4)]'
                  : 'border-[#d4a017]/30 text-[#a89060] hover:border-[#d4a017]/70 hover:text-[#f0c040]'}`}
                  style={i === 0 ? { background: 'linear-gradient(135deg, #d4a017, #f0c040)' } : { background: 'rgba(212,160,23,0.05)' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── Pinterest Masonry Grid ── */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4" style={{ columnFill: 'balance' }}>
            {[
              { ...HERO_MEDIA[0], tag: 'Ceremony', likes: 284, photographer: 'Ravi Studios' },
              { ...HERO_MEDIA[1], tag: 'Portraits', likes: 431, photographer: 'Akash Lens' },
              { ...HERO_MEDIA[2], tag: 'Reception', likes: 197, photographer: 'Mehta Clicks' },
              { ...HERO_MEDIA[3], tag: 'Mehendi', likes: 312, photographer: 'Golden Hour' },
              { ...HERO_MEDIA[4], tag: 'Ceremony', likes: 528, photographer: 'Ravi Studios' },
              { ...HERO_MEDIA[5], tag: 'Portraits', likes: 164, photographer: 'Akash Lens' },
              { ...HERO_MEDIA[6], tag: 'Reception', likes: 391, photographer: 'Mehta Clicks' },
              { ...HERO_MEDIA[7], tag: 'Mehendi', likes: 247, photographer: 'Golden Hour' },
              { ...HERO_MEDIA[8], tag: 'Ceremony', likes: 183, photographer: 'Ravi Studios' },
              { ...HERO_MEDIA[9], tag: 'Portraits', likes: 462, photographer: 'Akash Lens' },
            ].slice(0, galleryLimit).map((item, idx) => (
              <motion.div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 60}
                className="relative overflow-hidden rounded-2xl group break-inside-avoid mb-4 cursor-pointer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={`Wedding ${item.tag}`}
                  loading="lazy"
                  className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-[1.06]"
                />

                {/* Always-visible tag badge (top-left) */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                    style={{
                      background: 'rgba(212,160,23,0.85)',
                      color: '#1a0800',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}>
                    {item.tag}
                  </span>
                </div>

                {/* Save / Pin button (top-right) — Pinterest style */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #d4a017, #f0c040)',
                      color: '#1a0800',
                      boxShadow: '0 4px 12px rgba(212,160,23,0.5)'
                    }}>
                    <Heart className="w-3 h-3 fill-current" />
                    Save
                  </button>
                </div>

                {/* Bottom overlay — fades in on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400"
                  style={{ background: 'linear-gradient(to top, rgba(10,4,0,0.92) 0%, rgba(10,4,0,0.4) 40%, transparent 70%)' }}>
                </div>

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13px' }}>
                        Beautiful Moments
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#a89060' }}>
                        📷 {item.photographer}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: '#f0c040' }}>
                      <Heart className="w-3 h-3 fill-current" />
                      <span className="font-semibold">{item.likes}</span>
                    </div>
                  </div>
                </div>

                {/* Subtle gold border on hover */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-[#d4a017]/50 transition-colors duration-400" />
              </motion.div>
            ))}
          </div>

          {/* ── Load More ── */}
          {/* ── Bottom Action Bar */}
          <div className="mt-14 flex flex-col items-center gap-4" data-aos="fade-up">
            <p className="text-xs text-[#a89060] tracking-widest uppercase">
              Showing {Math.min(galleryLimit, HERO_MEDIA.length)} of {HERO_MEDIA.length} photos
            </p>
            {/* Progress bar */}
            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(212,160,23,0.2)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(Math.min(galleryLimit, HERO_MEDIA.length) / HERO_MEDIA.length) * 100}%`, background: 'linear-gradient(90deg, #d4a017, #f0c040)' }} />
            </div>

            {/* Two primary action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              {/* Upload button */}
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowGalleryUpload(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #d4a017, #f0c040)',
                  color: '#1a0800',
                  boxShadow: '0 4px 20px rgba(212,160,23,0.35)',
                }}>
                <Upload className="w-4 h-4" />
                Upload Your Photo
              </motion.button>

              {/* View full gallery page */}
              <Link to="/gallery">
                <motion.div
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border transition-all cursor-pointer"
                  style={{
                    borderColor: 'rgba(212,160,23,0.5)',
                    background: 'rgba(212,160,23,0.06)',
                    color: '#f0c040',
                  }}>
                  <Sparkles className="w-4 h-4" />
                  View Full Gallery
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* ── Inline Upload Modal (homepage) */}
          <AnimatePresence>
            {showGalleryUpload && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                onClick={(e) => e.target === e.currentTarget && setShowGalleryUpload(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="w-full max-w-lg rounded-3xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #1a0a00, #2a1200)',
                    border: '1px solid rgba(212,160,23,0.4)',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
                    maxHeight: '90vh', overflowY: 'auto'
                  }}
                >
                  <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(212,160,23,0.2)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)' }}>
                        <Upload className="w-4 h-4 text-[#1a0800]" />
                      </div>
                      <h2 className="text-white font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        Upload Wedding Photos
                      </h2>
                    </div>
                    <button onClick={() => setShowGalleryUpload(false)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                      style={{ color: '#a89060' }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <div
                      className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
                      style={{ borderColor: 'rgba(212,160,23,0.4)', background: 'rgba(212,160,23,0.03)' }}
                      onClick={() => document.getElementById('home-gallery-input')?.click()}
                    >
                      <input id="home-gallery-input" type="file" multiple accept="image/*" className="hidden"
                        onChange={() => { setShowGalleryUpload(false); window.location.href = '/gallery'; }} />
                      <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: '#d4a017' }} />
                      <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        Click to select photos
                      </p>
                      <p className="text-xs" style={{ color: '#a89060' }}>You'll be taken to the full gallery to manage your uploads</p>
                    </div>
                    <Link to="/gallery" onClick={() => setShowGalleryUpload(false)}>
                      <button className="w-full mt-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#1a0800' }}>
                        <Sparkles className="w-4 h-4" />
                        Go to Full Gallery & Upload
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ================= SECTION 6: APP FEATURES ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Diagonal mesh / crosshatch + warm amber-tinted darkness */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(115deg, #110600 0%, #1c0d00 40%, #0e0500 100%)' }} />
        <div className="absolute inset-0 z-0 opacity-[0.07]" style={{
          backgroundImage: 'linear-gradient(rgba(212,160,23,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.7) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(139,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,0,0.8) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '15px 15px',
        }} />
        <div className="absolute right-0 top-0 w-[600px] h-[600px] opacity-10 z-0" style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 60%)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] opacity-8 z-0" style={{ background: 'radial-gradient(circle, #8b3a00 0%, transparent 60%)', transform: 'translate(-20%,20%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <h2 className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">Premium Features</h2>
              <h3 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Everything You Need for a <span className="text-[#f0c040] italic">Perfect Profile</span>
              </h3>
              <p className="text-[#a89060] mb-10 leading-relaxed text-lg font-light">
                Our platform is designed with modern Indian families in mind, offering a seamless blend of tradition and technology.
              </p>

              <div className="space-y-5">
                {[
                  { icon: Download, title: "Export to High-Quality PDF" },
                  { icon: Share2, title: "One-Click WhatsApp Sharing" },
                  { icon: QrCode, title: "Custom QR Code for Quick Access" },
                  { icon: Lock, title: "Advanced Privacy Controls" },
                  { icon: FileText, title: "Multiple Royal Templates" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group text-[15px]">
                    <div className="w-8 h-8 rounded-full bg-[#1f1500] border border-[#d4a017]/50 flex items-center justify-center group-hover:bg-[#2a1e08] group-hover:border-[#f0c040] transition-colors shadow-sm">
                      <Check className="w-4 h-4 text-[#d4a017]" />
                    </div>
                    <span className="text-[#f5ead0] group-hover:text-white transition-colors">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d4a017]/10 to-[#f0c040]/10 rounded-full blur-3xl opacity-60" />
              <div className="relative bg-[#0f0a00] border border-[#d4a017]/30 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mx-auto w-full max-w-sm overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1000] border-b border-[#d4a017]/20 rounded-b-3xl z-20" />

                {/* Scrolling content inside mockup */}
                <div className="bg-[#1f1500] rounded-[2rem] h-[600px] relative border border-[#d4a017]/20 shadow-inner overflow-y-auto no-scrollbar">
                  <div className="h-56 bg-gradient-to-b from-[#2a1e08] to-transparent relative">
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                      <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"><ChevronDown className="w-5 h-5 text-[#f5ead0] rotate-90" /></div>
                      <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"><Share2 className="w-4 h-4 text-[#f5ead0]" /></div>
                    </div>
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-[#1f1500] bg-gray-800 overflow-hidden shadow-lg">
                      <img src={HERO_MEDIA[1].src} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="mt-20 px-6 pb-20 text-center">
                    <h4 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Priya Sharma, 26</h4>
                    <p className="text-[#d4a017] text-sm mb-8 font-medium tracking-wide">Software Engineer • Mumbai</p>

                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-[#2a1e08] rounded-xl border border-[#d4a017]/20 p-4 text-left">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#f0c040] shadow-[0_0_5px_rgba(240,192,64,0.8)]" />
                            <div className="h-2 w-24 bg-[#a89060]/50 rounded-full" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-[#1a1000] rounded-full" />
                            <div className="h-2 w-4/5 bg-[#1a1000] rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sticky bottom-0 p-4 bg-gradient-to-t from-[#1f1500] via-[#1f1500] to-transparent">
                    <div className="flex gap-3 mt-4">
                      <div className="flex-1 h-12 bg-gradient-to-r from-[#d4a017] to-[#f0c040] rounded-xl flex items-center justify-center text-[#0f0a00] font-bold shadow-lg hover:shadow-[0_0_15px_rgba(212,160,23,0.4)] transition-shadow cursor-pointer">
                        Connect
                      </div>
                      <div className="w-12 h-12 bg-[#0f0a00] border border-[#d4a017]/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#2a1e08] transition-colors">
                        <Download className="w-5 h-5 text-[#f0c040]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: FAQ SECTION ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Vintage paper texture — concentric arcs + aged sepia */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(180deg, #080308 0%, #0c0508 50%, #080206 100%)' }} />
        <div className="absolute inset-0 z-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ccircle cx='100' cy='100' r='30' fill='none' stroke='%23d4a017' stroke-width='0.6'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='%23d4a017' stroke-width='0.4'/%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='%23d4a017' stroke-width='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] opacity-8 z-0" style={{ background: 'radial-gradient(circle, #4a1500 0%, transparent 70%)', transform: 'translate(-40%,-40%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-8 z-0" style={{ background: 'radial-gradient(circle, #4a1500 0%, transparent 70%)', transform: 'translate(40%,40%)' }} />
        <div className="absolute inset-0 z-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-sm font-medium text-[#d4a017] tracking-widest uppercase mb-3">Got Questions?</h2>
            <h3 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Frequently Asked <span className="text-[#f0c040] italic">Questions</span>
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { q: "How do I create a biodata?", a: "Simply sign up, fill in your personal, family, and educational details in our easy-to-use form, select a premium template, and your biodata is ready instantly!" },
              { q: "Is the platform free to use?", a: "Yes, you can create and share your basic biodata for free. We also offer premium templates for users looking for an extra touch of luxury." },
              { q: "Can I download my biodata as a PDF?", a: "Absolutely! Once created, you can download your biodata in high-resolution PDF format with a single click, perfect for sharing on WhatsApp or printing." },
              { q: "Is my profile secure and private?", a: "Your privacy is our top priority. You can choose to keep your profile public for wider reach or private, sharing it only via a secure link with specific families." },
              { q: "Can I edit my biodata later?", a: "Yes, you can log in to your dashboard anytime to update your details, change photos, or switch templates. Changes reflect immediately." },
              { q: "Do you offer customer support?", a: "Yes, our dedicated support team is available via WhatsApp and email to assist you with any queries during your matchmaking journey." },
              { q: "Can I add multiple photos?", a: "Yes, premium users can add a gallery of up to 5 photos to showcase their personality effectively." },
              { q: "Are the templates mobile-responsive?", a: "Every template is designed to look stunning on both desktop and mobile devices." },
              { q: "Can I track who viewed my profile?", a: "We provide basic analytics for premium users to see how many times their profile has been viewed and downloaded." }
            ].map((faq, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 50}
                className={`bg-[#1f1500] border-l-4 border-[#d4a017] rounded-r-xl rounded-bl-xl border-y border-r border-[#d4a017]/20 cursor-pointer transition-all duration-300 ${activeFaq === idx ? 'shadow-md shadow-[#d4a017]/10' : 'hover:bg-[#2a1e08]'}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between p-5 font-medium text-[#f5ead0] text-[15px]">
                  {faq.q}
                  <span className={`transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-[#f0c040]' : 'text-[#a89060]'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-5 pt-0 text-[#a89060] leading-relaxed text-[15px]">
                    <div className="w-full h-px bg-[#d4a017]/10 mb-4" />
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: FINAL CTA ================= */}
      <section className="py-[56px] lg:py-[96px] relative overflow-hidden">
        {/* BG: Aurora / colour-shift gradient mesh */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #0d0500 0%, #1a0800 25%, #0a0010 50%, #1a0800 75%, #0d0500 100%)' }} />
        <div className="absolute inset-0 z-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(212,160,23,0.3) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 z-0 opacity-15" style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(139,0,0,0.4) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 z-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(180,100,0,0.3) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(60deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 50px)',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px z-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.5), transparent)' }} />

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center bg-[#1f1500]/60 backdrop-blur-xl border border-[#d4a017]/30 rounded-[3rem] py-20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]" data-aos="zoom-in">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-[#d4a017] to-[#f0c040] rounded-full blur-2xl opacity-30" />
          <Sparkles className="w-12 h-12 text-[#f0c040] mx-auto mb-6 relative z-10" />

          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Start Creating Your <br />
            <span className="text-[#f0c040] italic font-medium">Premium Biodata</span> Today
          </h2>
          <p className="text-xl text-[#a89060] mb-10 max-w-2xl mx-auto font-light">
            Join thousands of families who found their perfect match using our beautiful, modern matrimony platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={currentUser ? "/create" : "/signup"}>
              <Button variant="gold" size="xl" className="w-full sm:w-auto text-lg shadow-[0_0_30px_rgba(212,160,23,0.3)] hover:shadow-[0_0_40px_rgba(212,160,23,0.5)] transition-all scale-105 hover:scale-110">
                Create Now
              </Button>
            </Link>
            <a href="#explore">
              <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg border-[#d4a017]/50 text-[#f0c040] hover:bg-[#2a1e08]">
                Explore Templates
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0f0a00] pt-20 pb-10 border-t border-[#d4a017]/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6 group cursor-pointer">
                <Heart className="w-8 h-8 text-[#d4a017] fill-current group-hover:text-[#f0c040] transition-colors" />
                <span className="text-3xl font-bold text-white tracking-wider group-hover:text-[#f5ead0] transition-colors" style={{ fontFamily: 'Cormorant Garamond, serif' }}>BioData</span>
              </div>
              <p className="text-[#a89060] text-sm leading-relaxed mb-6 font-light">
                Premium Indian wedding biodata maker. Elegant designs for auspicious alliances and beautiful beginnings.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#1f1500] border border-[#d4a017]/30 flex items-center justify-center text-[#d4a017] hover:bg-[#d4a017] hover:text-[#0f0a00] transition-all hover:scale-110"><Mail className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1f1500] border border-[#d4a017]/30 flex items-center justify-center text-[#d4a017] hover:bg-[#d4a017] hover:text-[#0f0a00] transition-all hover:scale-110"><Share2 className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1f1500] border border-[#d4a017]/30 flex items-center justify-center text-[#d4a017] hover:bg-[#d4a017] hover:text-[#0f0a00] transition-all hover:scale-110"><Heart className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Home</Link></li>
                <li><Link to="/about" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> About Us</Link></li>
                <li><Link to="/explore" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Explore Profiles</Link></li>
                <li><Link to="/pricing" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Premium Plans</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Terms of Service</Link></li>
                <li><Link to="/refund" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Refund Policy</Link></li>
                <li><Link to="/contact" className="text-[#a89060] hover:text-[#f0c040] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Stay Updated</h4>
              <p className="text-[#a89060] text-sm mb-4 font-light">Subscribe to our newsletter for tips on finding the perfect match.</p>
              <div className="flex shadow-lg rounded-lg overflow-hidden border border-[#d4a017]/30 focus-within:border-[#f0c040] transition-colors">
                <input type="email" placeholder="Email address" className="bg-[#1a1000] text-[#f5ead0] px-4 py-3 w-full focus:outline-none placeholder-[#a89060]/50" />
                <button className="bg-gradient-to-r from-[#d4a017] to-[#f0c040] text-[#0f0a00] px-5 py-3 font-bold hover:opacity-90 transition-opacity flex items-center justify-center">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#d4a017]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#a89060] text-sm">
              © {new Date().getFullYear()} BioData. Crafted with love for auspicious alliances.
            </p>
            <div className="flex gap-2">
              <span className="w-8 h-8 rounded bg-[#1f1500] border border-[#d4a017]/20 flex items-center justify-center hover:bg-[#2a1e08] transition-colors cursor-pointer"><Shield className="w-4 h-4 text-[#d4a017]" /></span>
              <span className="w-8 h-8 rounded bg-[#1f1500] border border-[#d4a017]/20 flex items-center justify-center hover:bg-[#2a1e08] transition-colors cursor-pointer"><Lock className="w-4 h-4 text-[#d4a017]" /></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
