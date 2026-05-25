import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { ChevronDown, Share2, Printer, Download, Check, ShieldCheck } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Button from '../ui/Button';
import { optimizeImage } from '../../utils/image';

/* ─── Floating Golden Particles ──────────────────── */
const GoldenParticles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3.5 + 1.5,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 7,
      dx: (Math.random() - 0.5) * 70,
      dy: -(Math.random() * 140 + 40),
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 print:hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Photo Count Indicator ───────────────────────── */
const PhotoCounter = ({ current, total }) => {
  if (total <= 1) return null;
  return (
    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider"
      style={{
        background: 'rgba(8,0,0,0.65)',
        border: '1px solid rgba(212,160,23,0.35)',
        color: 'rgba(212,160,23,0.9)',
        backdropFilter: 'blur(8px)',
        fontFamily: 'Inter, sans-serif',
      }}>
      {current + 1} / {total}
    </div>
  );
};

/* ─── Decorative Gold Frame Corners ───────────────── */
const FrameCorners = () => (
  <>
    {/* TL */}
    <div className="absolute top-2 left-2 z-10 pointer-events-none"
      style={{ width:22, height:22, borderTop:'1.5px solid rgba(212,160,23,0.6)', borderLeft:'1.5px solid rgba(212,160,23,0.6)', borderRadius:'4px 0 0 0' }}/>
    {/* TR */}
    <div className="absolute top-2 right-2 z-10 pointer-events-none"
      style={{ width:22, height:22, borderTop:'1.5px solid rgba(212,160,23,0.6)', borderRight:'1.5px solid rgba(212,160,23,0.6)', borderRadius:'0 4px 0 0' }}/>
    {/* BL */}
    <div className="absolute bottom-2 left-2 z-10 pointer-events-none"
      style={{ width:22, height:22, borderBottom:'1.5px solid rgba(212,160,23,0.6)', borderLeft:'1.5px solid rgba(212,160,23,0.6)', borderRadius:'0 0 0 4px' }}/>
    {/* BR */}
    <div className="absolute bottom-2 right-2 z-10 pointer-events-none"
      style={{ width:22, height:22, borderBottom:'1.5px solid rgba(212,160,23,0.6)', borderRight:'1.5px solid rgba(212,160,23,0.6)', borderRadius:'0 0 4px 0' }}/>
  </>
);

/* ─── HeroBanner Component ─────────────────────────── */
const HeroBanner = ({ name, tagline, photoURL, photos = [], onShare, onPrint, onDownload, pdfLoading, copied }) => {
  const initials = name
    ? name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '✦';

  const rawImages = photos.length > 0 ? photos : photoURL ? [photoURL] : [];
  const images = rawImages.map(img => optimizeImage(img, 800));
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className="relative w-full min-h-[100svh] print:h-auto print:min-h-[100vh] bg-[#080000] overflow-hidden flex items-center py-20 lg:py-0"
      style={{ maxWidth: '100vw' }}
    >
      {/* ── Layer 1: Background gradient ─────────────── */}
      <div className="absolute inset-0 z-0 print:hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(60,6,6,0.4) 0%, #080000 100%)' }}/>
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(212,160,23,0.5) 0px, transparent 1px, transparent 12px)',
          }}/>
      </div>

      {/* ── Layer 2: Ambient blobs ────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-5 print:hidden">
        <div className="absolute top-1/4 left-1/4 w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(180,30,30,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)' }}/>
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)' }}/>
      </div>

      {/* ── Layer 3: Golden Particles ─────────────────── */}
      <GoldenParticles />

      {/* ── Main Content ──────────────────────────────── */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16 xl:gap-20">

        {/* ── Left: Text + Actions ──────────────────── */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-4 lg:mt-0">

          {/* Verified badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 sm:mb-7"
            style={{
              background: 'rgba(6,20,10,0.55)',
              border: '1px solid rgba(52,211,153,0.25)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-emerald-300/90 font-medium tracking-wider uppercase">
              Verified Profile
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-responsive-hero font-light tracking-[0.14em] sm:tracking-[0.18em] text-white uppercase mb-3 sm:mb-4"
            style={{ fontFamily: 'Cinzel, Playfair Display, serif', wordBreak: 'break-word' }}
          >
            {name || 'Your Name'}
          </motion.h1>

          {/* Ornamental divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="flex items-center gap-3 mb-5 sm:mb-7 w-full max-w-xs justify-center lg:justify-start"
          >
            <div className="flex-1 lg:flex-none lg:w-14 h-px bg-gradient-to-r from-transparent to-yellow-700/55" />
            <span className="text-yellow-600 text-base animate-sparkle" style={{ fontSize: '18px' }}>❧</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-700/55" />
          </motion.div>

          {/* Tagline */}
          {tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-responsive-subhero text-yellow-100/65 font-light tracking-wide max-w-xl italic mb-8 lg:mb-10 px-2 lg:px-0"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {`"${tagline}"`}
            </motion.p>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 w-full print:hidden"
          >
            <Button
              id="btn-share-profile"
              onClick={onShare}
              variant="ghost"
              className="glass-premium flex-1 sm:flex-none sm:min-w-[110px] text-sm"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button
              id="btn-print-profile"
              onClick={onPrint}
              variant="ghost"
              className="glass-premium flex-1 sm:flex-none sm:min-w-[110px] text-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button
              id="btn-download-pdf"
              onClick={onDownload}
              variant="gold"
              loading={pdfLoading}
              className="shadow-gold-glow w-full sm:w-auto sm:min-w-[155px] text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </motion.div>

          {/* Premium note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-4 text-[10px] text-yellow-700/35 tracking-wider print:hidden lg:block hidden"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ✦ High-quality A4 PDF · Print-perfect · Mobile-friendly
          </motion.p>
        </div>

        {/* ── Right: Swiper Gallery ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 max-w-[260px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[420px] mx-auto lg:mx-0 relative z-30"
        >
          {/* Decorative depth borders */}
          <div className="absolute -inset-3 sm:-inset-5 border border-yellow-700/15 rounded-[2.2rem] transform -rotate-2 pointer-events-none hidden sm:block" />
          <div className="absolute -inset-1.5 sm:-inset-2.5 border border-red-900/20 rounded-[2rem] transform rotate-1.5 pointer-events-none hidden sm:block" />

          {/* Main frame */}
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden p-1.5 sm:p-2 group"
            style={{
              background: 'linear-gradient(135deg, rgba(20,4,4,0.85), rgba(12,1,1,0.75))',
              border: '1px solid rgba(184,134,11,0.18)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(184,134,11,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <FrameCorners />

            {images.length > 0 ? (
              <>
                <Swiper
                  modules={[EffectFade, Autoplay, Pagination]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                  className="w-full h-full rounded-[1.5rem] overflow-hidden bg-[#040000]"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i} className="overflow-hidden">
                      <motion.div
                        className="w-full h-full relative"
                        animate={{ scale: activeIndex === i ? 1.06 : 1 }}
                        transition={{ duration: 7, ease: 'linear' }}
                      >
                        <img
                          src={img}
                          alt={`${name ? name.split(' ')[0] : 'Profile'} photo ${i + 1}`}
                          className="w-full h-full object-cover object-center"
                          loading={i === 0 ? 'eager' : 'lazy'}
                        />
                        {/* Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080000]/90 via-transparent to-black/15 pointer-events-none" />
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <PhotoCounter current={activeIndex} total={images.length} />
              </>
            ) : (
              /* No photo placeholder */
              <div className="w-full h-full rounded-[1.5rem] flex items-center justify-center relative overflow-hidden"
                style={{ background: 'radial-gradient(circle at center, #3c0808 0%, #080000 100%)' }}>
                <div className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: 'radial-gradient(circle at center, rgba(184,134,11,0.5) 0%, transparent 70%)' }}/>
                <span className="relative text-7xl sm:text-8xl font-bold drop-shadow-2xl select-none"
                  style={{ fontFamily: 'Cinzel, serif', color: 'rgba(212,160,23,0.75)' }}>
                  {initials}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-40 bg-gradient-to-t from-[#080000] to-transparent z-20 pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-4 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 print:hidden pointer-events-none"
      >
        <span className="text-[9px] text-yellow-600/50 uppercase tracking-[0.35em] font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-yellow-600/35" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroBanner;
