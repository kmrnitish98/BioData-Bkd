import { lazy, Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Share2, Printer, Download, Check, ArrowLeft, Heart,
  MessageCircle, ShieldCheck, Sparkles, Quote, ChevronUp, AlertCircle,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { apiGetBiodataById } from '../api/client';
import HeroBanner from '../components/biodata/HeroBanner';
import PersonalInfoCard from '../components/biodata/PersonalInfoCard';
import EducationCard from '../components/biodata/EducationCard';
import FamilyCard from '../components/biodata/FamilyCard';
// Lazy-load PDF template — only needed on print, not on initial page load
const BiodataPDFTemplate = lazy(() => import('../components/biodata/BiodataPDFTemplate'));
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { PersonProfileSchema } from '../components/seo/SchemaMarkup';

/* ══════════════════════════════════════════════════════════════
   PREMIUM PDF ENGINE — Production-Ready, Mobile-Friendly
   ══════════════════════════════════════════════════════════════ */

/* ─── Scroll Progress Bar ─────────────────────────── */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] sm:h-[3px] z-[60] origin-left print:hidden"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #8b6010, #d4a017, #ffcc33, #d4a017, #8b6010)',
      }}
    />
  );
};

/* ─── Back to Top ─────────────────────────────────── */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full glass-premium border border-yellow-700/30 text-yellow-500 hover:text-yellow-400 hover:border-yellow-600/50 transition-all duration-300 print:hidden cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─── Section Divider ─────────────────────────────── */
const SectionDivider = ({ icon = '✦', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="flex items-center justify-center gap-3 sm:gap-4 py-2 sm:py-4"
  >
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-700/20 to-transparent" />
    <motion.span
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="text-yellow-700/50 text-xs sm:text-sm"
    >
      {icon}
    </motion.span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-700/20 to-transparent" />
  </motion.div>
);

/* ─── About Me Section ────────────────────────────── */
const AboutSection = ({ bio }) => {
  if (!bio) return null;
  return (
    <Card delay={0.05}>
      <Section icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />} title="About Me" accent="gold">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-sm sm:text-base md:text-lg text-gray-300/90 leading-relaxed sm:leading-loose font-light px-1 sm:px-2"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {bio}
        </motion.p>
      </Section>
    </Card>
  );
};

/* ─── Elegant Quote Section ───────────────────────── */
const QuoteSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    className="text-center py-8 sm:py-12 relative"
  >
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[50vw] max-w-[400px] h-32 rounded-full bg-yellow-700/5 blur-[60px]" />
    </div>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-700/30 mx-auto mb-3 sm:mb-4 rotate-180" />
    </motion.div>
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
      <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-yellow-700/40" />
      <span className="text-yellow-700 text-base sm:text-xl animate-sparkle">✦</span>
      <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-yellow-700/40" />
    </div>
    <p
      className="text-gray-400/80 italic text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-md mx-auto relative px-6"
      style={{ fontFamily: 'Cormorant Garamond, serif' }}
    >
      "Looking for an auspicious alliance built on mutual respect, love, and shared values."
    </p>
  </motion.div>
);

/* ─── Premium Footer ──────────────────────────────── */
const PremiumFooter = () => (
  <footer className="relative border-t border-red-900/20 py-8 sm:py-12 text-center print:hidden overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-[#050000] to-transparent pointer-events-none" />
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
      >
        <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-yellow-700/30" />
        <span className="text-yellow-700/50 text-sm sm:text-base">❧</span>
        <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-yellow-700/30" />
      </motion.div>
      <p
        className="text-yellow-700/40 text-base sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2"
        style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}
      >
        ✦ BioData with Aguaa ✦
      </p>
      <div className="mt-3 flex flex-col items-center justify-center gap-1.5">
        <p className="text-gray-500/80 text-[10px] sm:text-xs tracking-widest uppercase font-medium">
          © {new Date().getFullYear()} Aguaa. Crafted with elegance & love.
        </p>
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold">
          <span className="text-gray-600/60">Designed By</span>
          <span className="text-yellow-700/70">Nitish Kumar</span>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── PDF Loading Overlay ─────────────────────────── */
const PdfLoadingOverlay = ({ visible, stage }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm print:hidden"
      >
        <div className="flex flex-col items-center gap-5">
          {/* Spinning ring */}
          <div className="relative w-16 h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-yellow-700/25 border-t-yellow-500"
            />
            <div className="absolute inset-3 rounded-full border border-yellow-700/15" />
            <div className="absolute inset-0 flex items-center justify-center text-yellow-600/70 text-lg">✦</div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-yellow-500 text-lg font-light tracking-widest"
              style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}>
              Generating PDF
            </p>
            <p className="text-gray-400 text-xs tracking-wider">{stage || 'Preparing your biodata…'}</p>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <motion.div key={i}
                className="w-1.5 h-1.5 rounded-full bg-yellow-600/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Error Toast ─────────────────────────────────── */
const ErrorToast = ({ message, onClose }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl glass-premium border border-red-800/40 shadow-luxury"
      >
        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <p className="text-sm text-gray-200">{message}</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 ml-2">✕</button>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════ */
/* ─── PROFILE PAGE ─────────────────────────────────── */
/* ═══════════════════════════════════════════════════ */

const ProfilePage = () => {
  const { id } = useParams();
  const [biodata, setBiodata]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [copied, setCopied]         = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfStage, setPdfStage]     = useState('');
  const [pdfError, setPdfError]     = useState('');
  const profileRef     = useRef(null);
  const pdfTemplateRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGetBiodataById(id);
        if (!data) setNotFound(true);
        else setBiodata(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Dynamic SEO: update <title> and <canonical> when profile data loads ──
  useEffect(() => {
    if (!biodata) return;
    const name = biodata?.personalInfo?.fullName;
    const city = biodata?.personalInfo?.city || '';
    const age  = biodata?.personalInfo?.age  || '';

    // Unique title per profile
    document.title = name
      ? `${name}'s Marriage Biodata${city ? ` | ${city}` : ''} | Aguaa`
      : 'Marriage Biodata Profile | Aguaa';

    // Unique canonical per profile — critical for preventing duplicate content
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://aguaa.in/profile/${id}`;

    // OG tags for social sharing (WhatsApp, Facebook)
    const setMeta = (attr, name, content) => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    const ogTitle = name
      ? `${name}'s Marriage Biodata${age ? ` (${age} yrs)` : ''}${city ? ` | ${city}` : ''} | Aguaa`
      : 'Marriage Biodata Profile | Aguaa';
    const ogDesc = [
      `View ${name || 'this'}'s verified marriage biodata on Aguaa`,
      age  ? `(${age} years)` : '',
      city ? `from ${city}` : '',
      '— Dil Se Rishta, Vishwas Se Shaadi.',
    ].filter(Boolean).join(' ');
    const ogImg = biodata.photoURL || 'https://aguaa.in/og-banner.png';

    setMeta('property', 'og:title',       ogTitle);
    setMeta('property', 'og:description', ogDesc);
    setMeta('property', 'og:url',         `https://aguaa.in/profile/${id}`);
    setMeta('property', 'og:type',        'profile');
    setMeta('property', 'og:image',       ogImg);
    setMeta('name',     'twitter:title',       ogTitle);
    setMeta('name',     'twitter:description', ogDesc);
    setMeta('name',     'twitter:image',       ogImg);

    // Restore generic title on unmount
    return () => {
      document.title = 'Aguaa — Free Marriage Biodata Maker | Shaadi Biodata | Bihar UP Jharkhand';
    };
  }, [biodata, id]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /* ─── Premium HD Multi-Page PDF Generation ──────── */
  const handleDownloadPDF = useCallback(() => {
    // Native print dialog handles saving as PDF much better, 
    // producing selectable text and perfect vector rendering.
    window.print();
  }, []);

  /* ─── Loading & Not Found States ────────────────── */
  if (loading) return <Loader message="Loading Biodata…" />;

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-red-900/40 mx-auto mb-4" />
          <h1
            className="text-2xl sm:text-3xl text-white font-light mb-2"
            style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}
          >
            Biodata Not Found
          </h1>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            This profile may have been removed or marked private.
          </p>
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const { personalInfo = {}, educationInfo = {}, familyInfo = {}, preferences = {} } = biodata;
  const photoURL = biodata.photoURL || personalInfo.photoURL || null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen noise-overlay relative">

      {/* ── Person Profile JSON-LD Schema ────────────── */}
      <PersonProfileSchema biodata={biodata} />

      {/* ─── Overlays ───────────────────────────────── */}
      <PdfLoadingOverlay visible={pdfLoading} stage={pdfStage} />
      <ErrorToast message={pdfError} onClose={() => setPdfError('')} />

      {/* ─── Hidden PDF Capture Template ────────────── */}
      {/*
        IMPORTANT: This div is hidden off-screen but fully rendered.
        During PDF export, we temporarily make it visible at 794px.
      */}
      <div
        ref={pdfTemplateRef}
        aria-hidden="true"
        style={{
          display: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -9999,
          visibility: 'hidden',
          width: '794px',
          pointerEvents: 'none',
        }}
      >
        <Suspense fallback={null}>
          <BiodataPDFTemplate biodata={biodata} />
        </Suspense>
      </div>

      {/* ─── Scroll Progress ─────────────────────────── */}
      <ScrollProgress />
      <BackToTop />

      {/* ─── Premium Silk Weave Background ──────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 print:hidden overflow-hidden">
        {/* Base Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #120500 0%, #1e0b00 50%, #120500 100%)",
          }}
        />
        {/* Diagonal Gold Stripes */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px)",
          }}
        />
        {/* Diagonal Maroon Stripes (cross-weave) */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, #8b0000 0px, #8b0000 1px, transparent 1px, transparent 60px)",
          }}
        />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,#d4a017_0%,transparent_70%)] opacity-[0.08] translate-x-1/3 -translate-y-1/3 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,#8b0000_0%,transparent_70%)] opacity-[0.06] -translate-x-1/3 translate-y-1/3 rounded-full" />
        
        {/* Soft edge fading lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
      </div>

      {/* ─── Fixed Back Button ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed top-6 left-4 sm:left-6 z-50 print:hidden"
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="glass-premium rounded-full !px-3 shadow-luxury backdrop-blur-md bg-black/20">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-1 text-xs">Back</span>
          </Button>
        </Link>
      </motion.div>

      {/* ─── Main Viewable Content ───────────────────── */}
      <div ref={profileRef} className="relative z-10">

        {/* Hero Banner */}
        <HeroBanner
          name={personalInfo.fullName}
          tagline={preferences.bio || 'Seeking a loving and caring life partner.'}
          photoURL={photoURL}
          photos={
            (biodata?.photos?.length > 0)
              ? biodata.photos.map(p => p?.url || p)
              : photoURL ? [photoURL] : []
          }
          onShare={handleCopyLink}
          onPrint={handlePrint}
          onDownload={handleDownloadPDF}
          pdfLoading={pdfLoading}
          copied={copied}
        />

        {/* Detail Cards */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl 3xl:max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {/* About Me */}
          <motion.div variants={itemVariants}>
            <AboutSection bio={preferences.bio} />
          </motion.div>

          <SectionDivider icon="❧" />

          {/* Personal Information */}
          <motion.div variants={itemVariants}>
            <PersonalInfoCard data={personalInfo} />
          </motion.div>

          <SectionDivider icon="✦" delay={0.1} />

          {/* Education */}
          <motion.div variants={itemVariants}>
            <EducationCard data={educationInfo} />
          </motion.div>

          <SectionDivider icon="❧" delay={0.2} />

          {/* Family */}
          <motion.div variants={itemVariants}>
            <FamilyCard data={familyInfo} />
          </motion.div>

          <SectionDivider icon="✦" delay={0.3} />

          {/* Preferences */}
          {(preferences.partnerExpectations || preferences.hobbies || preferences.preferredLocation) && (
            <motion.div variants={itemVariants}>
              <Card delay={0.4}>
                <Section
                  icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="Preferences"
                  accent="gold"
                >
                  <div className="space-y-4 sm:space-y-5">
                    {preferences.partnerExpectations && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                          Partner Expectations
                        </p>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          {preferences.partnerExpectations}
                        </p>
                      </motion.div>
                    )}
                    {preferences.hobbies && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                          Hobbies & Interests
                        </p>
                        <p className="text-sm sm:text-base text-gray-300">{Array.isArray(preferences.hobbies) ? preferences.hobbies.join(', ') : preferences.hobbies}</p>
                      </motion.div>
                    )}
                    {preferences.preferredLocation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                          Preferred Location
                        </p>
                        <p className="text-sm sm:text-base text-gray-300">{preferences.preferredLocation}</p>
                      </motion.div>
                    )}
                  </div>
                </Section>
              </Card>
            </motion.div>
          )}

          <SectionDivider icon="✦" delay={0.4} />

          {/* Contact */}
          {preferences.contactName && (
            <motion.div variants={itemVariants}>
              <Card delay={0.5}>
                <Section
                  icon={<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="Contact Information"
                  accent="red"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                        Contact Person
                      </p>
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {preferences.contactName}
                      </p>
                    </motion.div>
                    {preferences.contactPhone && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${preferences.contactPhone}`}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-medium text-sm sm:text-base"
                        >
                          {preferences.contactPhone}
                        </a>
                      </motion.div>
                    )}
                    {preferences.contactEmail && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="sm:col-span-2"
                      >
                        <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${preferences.contactEmail}`}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-sm sm:text-base break-all"
                        >
                          {preferences.contactEmail}
                        </a>
                      </motion.div>
                    )}
                  </div>
                </Section>
              </Card>
            </motion.div>
          )}

          {/* Closing Quote */}
          <QuoteSection />
        </motion.main>
      </div>

      {/* ─── Premium Footer ──────────────────────────── */}
      <PremiumFooter />

      {/* ─── Print Portal — targets #print-biodata-root in index.html ── */}
      {typeof document !== 'undefined' && (() => {
        const printRoot = document.getElementById('print-biodata-root');
        return printRoot ? createPortal(
          <Suspense fallback={null}>
            <BiodataPDFTemplate biodata={biodata} />
          </Suspense>,
          printRoot
        ) : null;
      })()}
    </div>
  );
};

export default ProfilePage;
