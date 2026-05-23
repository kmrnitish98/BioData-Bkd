import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  Shield,
  ChevronLeft,
  Star,
  ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "",
    tagline: "Perfect to get started",
    icon: <Zap size={22} />,
    color: "#a89060",
    highlight: false,
    cta: "Get Started Free",
    ctaTo: "/register",
    features: [
      { label: "1 Biodata Profile", included: true },
      { label: "Basic Templates (5+)", included: true },
      { label: "PDF Download", included: true },
      { label: "Premium Templates", included: false },
      { label: "WhatsApp Share", included: false },
      { label: "QR Code Generation", included: false },
      { label: "Priority Support", included: false },
      { label: "Profile Analytics", included: false },
      { label: "Featured Profile", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹299",
    period: "/month",
    tagline: "Best for active seekers",
    icon: <Star size={22} />,
    color: "#d4a017",
    highlight: true,
    badge: "Most Popular",
    cta: "Start Standard",
    ctaTo: "/register?plan=standard",
    features: [
      { label: "5 Biodata Profiles", included: true },
      { label: "Basic Templates (5+)", included: true },
      { label: "PDF Download", included: true },
      { label: "Premium Templates (20+)", included: true },
      { label: "WhatsApp Share", included: true },
      { label: "QR Code Generation", included: true },
      { label: "Priority Support", included: false },
      { label: "Profile Analytics", included: false },
      { label: "Featured Profile", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹599",
    period: "/month",
    tagline: "For the serious matrimonial journey",
    icon: <Crown size={22} />,
    color: "#f0c040",
    highlight: false,
    cta: "Go Premium",
    ctaTo: "/register?plan=premium",
    features: [
      { label: "Unlimited Biodata Profiles", included: true },
      { label: "Basic Templates (5+)", included: true },
      { label: "PDF Download", included: true },
      { label: "All Templates (50+)", included: true },
      { label: "WhatsApp Share", included: true },
      { label: "QR Code Generation", included: true },
      { label: "Priority Support", included: true },
      { label: "Profile Analytics", included: true },
      { label: "Featured Profile", included: true },
    ],
  },
];

const comparisonRows = [
  { feature: "Biodata Profiles", free: "1", standard: "5", premium: "Unlimited" },
  { feature: "Templates Access", free: "Basic (5+)", standard: "Premium (20+)", premium: "All (50+)" },
  { feature: "PDF Download", free: true, standard: true, premium: true },
  { feature: "WhatsApp Share", free: false, standard: true, premium: true },
  { feature: "QR Code", free: false, standard: true, premium: true },
  { feature: "Priority Support", free: false, standard: false, premium: true },
  { feature: "Profile Analytics", free: false, standard: false, premium: true },
  { feature: "Featured Profile", free: false, standard: false, premium: true },
  { feature: "Custom Branding", free: false, standard: false, premium: true },
];

const faqs = [
  {
    q: "Can I upgrade or downgrade my plan anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated accordingly.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "We offer a 7-day free trial for both Standard and Premium plans. No credit card required to start the trial.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, Net Banking, Credit/Debit Cards (Visa, Mastercard, RuPay), and popular wallets like Paytm and PhonePe.",
  },
  {
    q: "Will my data be safe if I downgrade to Free?",
    a: "Absolutely. Your biodata profiles and data are always safe. If you exceed the Free plan limit, older profiles become read-only but are never deleted.",
  },
  {
    q: "Do paid plans auto-renew?",
    a: "Yes, plans auto-renew monthly. You can cancel anytime from your account settings, and you'll retain access until the billing period ends.",
  },
  {
    q: "Is GST included in the pricing?",
    a: "Displayed prices are exclusive of GST. Applicable GST (18%) will be added at checkout as per Indian tax regulations.",
  },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function FeatureItem({ label, included }) {
  return (
    <li className="feature-item">
      <span className={`feature-icon ${included ? "included" : "excluded"}`}>
        {included ? <Check size={14} strokeWidth={2.5} /> : <X size={14} strokeWidth={2.5} />}
      </span>
      <span className={`feature-label ${!included ? "muted" : ""}`}>{label}</span>
    </li>
  );
}

function PricingCard({ plan, index }) {
  return (
    <motion.div
      className={`pricing-card ${plan.highlight ? "highlighted" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      whileHover={{ y: plan.highlight ? -6 : -4 }}
    >
      {plan.highlight && (
        <div className="popular-badge">
          <Sparkles size={12} />
          <span>{plan.badge}</span>
          <Sparkles size={12} />
        </div>
      )}

      <div className="card-header">
        <div className="plan-icon" style={{ color: plan.color }}>
          {plan.icon}
        </div>
        <h3 className="plan-name" style={{ color: plan.color }}>
          {plan.name}
        </h3>
        <p className="plan-tagline">{plan.tagline}</p>
        <div className="plan-price">
          <span className="price-amount" style={{ color: plan.highlight ? "#f0c040" : "#f5ead0" }}>
            {plan.price}
          </span>
          {plan.period && (
            <span className="price-period">{plan.period}</span>
          )}
        </div>
      </div>

      <ul className="features-list">
        {plan.features.map((f) => (
          <FeatureItem key={f.label} label={f.label} included={f.included} />
        ))}
      </ul>

      <Link to={plan.ctaTo} className={`plan-cta ${plan.highlight ? "cta-gold" : "cta-outline"}`}>
        {plan.cta}
      </Link>
    </motion.div>
  );
}

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="faq-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <button
        className="faq-question"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{faq.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="faq-chevron"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

        /* ── Reset & base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pricing-page {
          min-height: 100vh;
          background-color: #0f0a00;
          color: #f5ead0;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Background pattern ── */
        .bg-pattern {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,160,23,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 90%, rgba(212,160,23,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 20% 60%, rgba(212,160,23,0.05) 0%, transparent 50%);
        }
        .bg-pattern::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 59px,
            rgba(212,160,23,0.04) 59px, rgba(212,160,23,0.04) 60px
          ),
          repeating-linear-gradient(
            90deg, transparent, transparent 59px,
            rgba(212,160,23,0.04) 59px, rgba(212,160,23,0.04) 60px
          );
        }

        /* ── Wrapper ── */
        .pricing-content {
          position: relative;
          z-index: 1;
          padding-top: 6rem; /* pt-24 */
          padding-bottom: 5rem;
        }

        /* ── Back link ── */
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #a89060;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          margin: 0 auto 2.5rem;
          padding: 0 1.5rem;
          max-width: 1100px;
          display: flex;
        }
        .back-link:hover { color: #d4a017; }

        /* ── Hero section ── */
        .pricing-hero {
          text-align: center;
          padding: 0 1.5rem 3.5rem;
          max-width: 680px;
          margin: 0 auto;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212,160,23,0.1);
          border: 1px solid rgba(212,160,23,0.25);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #d4a017;
          margin-bottom: 1.25rem;
        }
        .pricing-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 5vw, 3.8rem);
          font-weight: 700;
          line-height: 1.1;
          color: #f5ead0;
          margin-bottom: 1rem;
        }
        .pricing-title span {
          background: linear-gradient(135deg, #d4a017 0%, #f0c040 50%, #d4a017 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pricing-subtitle {
          font-size: 1.05rem;
          color: #a89060;
          line-height: 1.65;
          font-weight: 300;
        }

        /* ── Cards grid ── */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1060px;
          margin: 0 auto 5rem;
          padding: 0 1.5rem;
          align-items: stretch;
        }

        /* ── Pricing card ── */
        .pricing-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,160,23,0.15);
          border-radius: 20px;
          padding: 2.2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          transition: border-color 0.3s, box-shadow 0.3s;
          cursor: default;
        }
        .pricing-card:hover {
          border-color: rgba(212,160,23,0.35);
          box-shadow: 0 8px 40px rgba(212,160,23,0.08);
        }
        .pricing-card.highlighted {
          background: rgba(212,160,23,0.06);
          border: 2px solid transparent;
          background-clip: padding-box;
          box-shadow:
            0 0 0 2px #d4a017,
            0 0 40px rgba(212,160,23,0.18),
            0 20px 60px rgba(212,160,23,0.12);
        }
        .pricing-card.highlighted::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          background: linear-gradient(135deg, #d4a017, #f0c040, #d4a017);
          z-index: -1;
        }

        /* ── Popular badge ── */
        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(90deg, #d4a017, #f0c040, #d4a017);
          color: #0f0a00;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(212,160,23,0.45);
        }

        /* ── Card header ── */
        .card-header { display: flex; flex-direction: column; gap: 0.4rem; }
        .plan-icon {
          width: 42px; height: 42px;
          background: rgba(212,160,23,0.1);
          border: 1px solid rgba(212,160,23,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.3rem;
        }
        .plan-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1;
        }
        .plan-tagline { font-size: 0.82rem; color: #a89060; font-weight: 300; margin-top: 2px; }
        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-top: 0.75rem;
          border-top: 1px solid rgba(212,160,23,0.1);
          padding-top: 0.85rem;
        }
        .price-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem;
          font-weight: 700;
          line-height: 1;
        }
        .price-period { font-size: 0.85rem; color: #a89060; font-weight: 400; }

        /* ── Features list ── */
        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          flex: 1;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 400;
        }
        .feature-icon {
          width: 20px; height: 20px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .feature-icon.included {
          background: rgba(34,197,94,0.15);
          color: #4ade80;
        }
        .feature-icon.excluded {
          background: rgba(255,255,255,0.05);
          color: rgba(168,144,96,0.4);
        }
        .feature-label { color: #f5ead0; }
        .feature-label.muted { color: rgba(168,144,96,0.5); }

        /* ── CTA buttons ── */
        .plan-cta {
          display: block;
          text-align: center;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: all 0.25s ease;
          margin-top: auto;
        }
        .cta-gold {
          background: linear-gradient(135deg, #d4a017, #f0c040);
          color: #0f0a00;
          box-shadow: 0 4px 20px rgba(212,160,23,0.35);
        }
        .cta-gold:hover {
          box-shadow: 0 6px 30px rgba(212,160,23,0.55);
          transform: translateY(-1px);
        }
        .cta-outline {
          border: 1.5px solid rgba(212,160,23,0.35);
          color: #d4a017;
          background: rgba(212,160,23,0.04);
        }
        .cta-outline:hover {
          border-color: #d4a017;
          background: rgba(212,160,23,0.1);
        }

        /* ── Section title ── */
        .section-label {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .section-label h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          color: #f5ead0;
          margin-bottom: 0.4rem;
        }
        .section-label p {
          font-size: 0.9rem;
          color: #a89060;
          font-weight: 300;
        }

        /* ── Comparison table ── */
        .comparison-section {
          max-width: 1000px;
          margin: 0 auto 5rem;
          padding: 0 1.5rem;
        }
        .comparison-table-wrap {
          overflow-x: auto;
          border-radius: 16px;
          border: 1px solid rgba(212,160,23,0.15);
          background: rgba(255,255,255,0.02);
        }
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .comparison-table thead tr {
          background: rgba(212,160,23,0.08);
          border-bottom: 1px solid rgba(212,160,23,0.2);
        }
        .comparison-table th {
          padding: 1rem 1.4rem;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #d4a017;
          white-space: nowrap;
        }
        .comparison-table th:first-child { text-align: left; color: #f5ead0; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
        .comparison-table td {
          padding: 0.9rem 1.4rem;
          text-align: center;
          border-bottom: 1px solid rgba(212,160,23,0.07);
          color: #f5ead0;
        }
        .comparison-table td:first-child { text-align: left; color: #a89060; font-weight: 400; }
        .comparison-table tr:last-child td { border-bottom: none; }
        .comparison-table tbody tr:hover { background: rgba(212,160,23,0.04); }
        .tick { color: #4ade80; display: flex; align-items: center; justify-content: center; }
        .cross { color: rgba(168,144,96,0.35); display: flex; align-items: center; justify-content: center; }
        .col-highlighted { color: #f0c040 !important; font-weight: 600; }

        /* ── Trust strip ── */
        .trust-strip {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 2rem;
          margin: 0 auto 5rem;
          padding: 1.75rem 2rem;
          max-width: 800px;
          background: rgba(212,160,23,0.04);
          border: 1px solid rgba(212,160,23,0.12);
          border-radius: 16px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #a89060;
          font-weight: 400;
        }
        .trust-item svg { color: #d4a017; }

        /* ── FAQ ── */
        .faq-section {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .faq-item {
          border-bottom: 1px solid rgba(212,160,23,0.12);
          overflow: hidden;
        }
        .faq-item:first-of-type { border-top: 1px solid rgba(212,160,23,0.12); }
        .faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 1.2rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          color: #f5ead0;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s;
        }
        .faq-question:hover { color: #d4a017; }
        .faq-chevron { color: #a89060; flex-shrink: 0; }
        .faq-answer {
          overflow: hidden;
        }
        .faq-answer p {
          padding-bottom: 1.2rem;
          font-size: 0.88rem;
          color: #a89060;
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── Bottom CTA ── */
        .bottom-cta {
          text-align: center;
          margin-top: 5rem;
          padding: 3.5rem 1.5rem;
          background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(212,160,23,0.09) 0%, transparent 70%);
          border-top: 1px solid rgba(212,160,23,0.1);
        }
        .bottom-cta h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 700;
          color: #f5ead0;
          margin-bottom: 0.75rem;
        }
        .bottom-cta p {
          font-size: 0.9rem;
          color: #a89060;
          margin-bottom: 2rem;
          font-weight: 300;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        .bottom-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #d4a017, #f0c040);
          color: #0f0a00;
          padding: 0.9rem 2.2rem;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: none;
          box-shadow: 0 6px 30px rgba(212,160,23,0.35);
          transition: all 0.25s ease;
        }
        .bottom-cta-btn:hover {
          box-shadow: 0 8px 40px rgba(212,160,23,0.55);
          transform: translateY(-2px);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .cards-grid { grid-template-columns: 1fr; max-width: 420px; }
          .trust-strip { gap: 1.2rem; }
          .comparison-table th, .comparison-table td { padding: 0.75rem 0.9rem; font-size: 0.8rem; }
        }
      `}</style>

      <div className="pricing-page">
        <div className="bg-pattern" aria-hidden="true" />

        <div className="pricing-content">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 2rem" }}
          >
            <Link to="/" className="back-link">
              <ChevronLeft size={16} />
              Back to Home
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div
            className="pricing-hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="hero-eyebrow">
              <Crown size={12} />
              Premium Plans
            </div>
            <h1 className="pricing-title">
              Choose Your <span>Sacred Journey</span>
            </h1>
            <p className="pricing-subtitle">
              Craft the perfect biodata that represents your heritage, values, and aspirations.
              From free to premium — find the plan that honors your story.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="cards-grid">
            {plans.map((plan, i) => (
              <PricingCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>

          {/* Trust strip */}
          <motion.div
            className="trust-strip"
            style={{ margin: "0 auto 5rem" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="trust-item"><Shield size={15} /> Secure Payments</div>
            <div className="trust-item"><Zap size={15} /> Instant Activation</div>
            <div className="trust-item"><Star size={15} /> 7-Day Free Trial</div>
            <div className="trust-item"><Check size={15} /> Cancel Anytime</div>
            <div className="trust-item"><Crown size={15} /> 50,000+ Happy Families</div>
          </motion.div>

          {/* Comparison table */}
          <motion.div
            className="comparison-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="section-label">
              <h2>Compare All Features</h2>
              <p>A detailed breakdown of everything included in each plan</p>
            </div>
            <div className="comparison-table-wrap">
              <table className="comparison-table" aria-label="Plan comparison table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Free</th>
                    <th style={{ color: "#f0c040" }}>Standard</th>
                    <th>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature}>
                      <td>{row.feature}</td>
                      {[row.free, row.standard, row.premium].map((val, idx) => (
                        <td key={idx} className={idx === 1 ? "col-highlighted" : ""}>
                          {typeof val === "boolean" ? (
                            val ? (
                              <div className="tick"><Check size={15} strokeWidth={2.5} /></div>
                            ) : (
                              <div className="cross"><X size={15} /></div>
                            )
                          ) : (
                            val
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            className="faq-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="section-label">
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about billing and plans</p>
            </div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="bottom-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Begin Your Journey Today</h2>
            <p>
              Join thousands of families who found their perfect match with a beautifully crafted biodata.
            </p>
            <Link to="/register" className="bottom-cta-btn">
              <Sparkles size={16} />
              Start for Free — No Credit Card
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
