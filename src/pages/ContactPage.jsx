import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  ChevronLeft,
  User,
} from "lucide-react";

/* ─── Framer‑motion helpers ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

/* ─── Contact info cards data ────────────────────────────────── */
const contactCards = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
    color: "#25D366",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@biodata.in",
    href: "mailto:support@biodata.in",
    color: "#f0c040",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon – Sat  9 AM – 6 PM IST",
    href: null,
    color: "#d4a017",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Mumbai, Maharashtra, India",
    href: "https://maps.google.com/?q=Mumbai,Maharashtra,India",
    color: "#e07070",
  },
];

/* ─── FAQ items ──────────────────────────────────────────────── */
const faqs = [
  { q: "How do I create my biodata?", path: "/faq#create" },
  { q: "Can I customise the template design?", path: "/faq#design" },
  { q: "How do I share my biodata PDF?", path: "/faq#share" },
  { q: "Is my personal data secure?", path: "/faq#security" },
];

/* ─── Subject options ────────────────────────────────────────── */
const subjects = [
  "General Inquiry",
  "Technical Support",
  "Billing",
  "Report Issue",
  "Partnership",
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
      e.phone = "Enter a valid phone number.";
    if (!form.subject) e.subject = "Please select a subject.";
    if (!form.message.trim()) e.message = "Message cannot be empty.";
    else if (form.message.trim().length < 20)
      e.message = "Message must be at least 20 characters.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    /* Simulate network request */
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0a00",
        color: "#f5ead0",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

        /* Gold grid overlay */
        .contact-grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(212,160,23,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,160,23,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Radial glow blobs */
        .blob-1 {
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,160,23,0.12) 0%, transparent 70%);
          top: -150px; left: -150px;
          pointer-events: none; z-index: 0;
          animation: blobPulse 8s ease-in-out infinite;
        }
        .blob-2 {
          position: fixed;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,192,64,0.08) 0%, transparent 70%);
          bottom: -100px; right: -100px;
          pointer-events: none; z-index: 0;
          animation: blobPulse 10s ease-in-out infinite reverse;
        }
        @keyframes blobPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* Gold ornamental divider */
        .gold-divider {
          width: 80px; height: 2px;
          background: linear-gradient(90deg, transparent, #d4a017, transparent);
          margin: 0 auto 1.5rem;
        }

        /* Contact card */
        .contact-card {
          background: rgba(212,160,23,0.05);
          border: 1px solid rgba(212,160,23,0.18);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.35s ease;
          text-decoration: none;
          color: inherit;
        }
        .contact-card:hover {
          background: rgba(212,160,23,0.12);
          border-color: rgba(240,192,64,0.5);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(212,160,23,0.15);
        }

        /* Form glass card */
        .form-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212,160,23,0.2);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(240,192,64,0.1);
        }

        /* Input fields */
        .field-group { position: relative; margin-bottom: 1.5rem; }
        .field-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a89060;
          margin-bottom: 0.5rem;
        }
        .field-input {
          width: 100%;
          background: rgba(212,160,23,0.04);
          border: 1px solid rgba(212,160,23,0.2);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          color: #f5ead0;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: rgba(168,144,96,0.5); }
        .field-input:focus {
          border-color: #d4a017;
          background: rgba(212,160,23,0.08);
          box-shadow: 0 0 0 3px rgba(212,160,23,0.12);
        }
        .field-input.error { border-color: #e07070; }
        .field-input.error:focus { box-shadow: 0 0 0 3px rgba(224,112,112,0.15); }
        .field-error {
          font-size: 0.78rem;
          color: #e07070;
          margin-top: 0.35rem;
          display: block;
        }
        select.field-input option { background: #1a1200; color: #f5ead0; }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #d4a017 0%, #f0c040 50%, #d4a017 100%);
          background-size: 200% 100%;
          color: #0f0a00;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 8px 30px rgba(212,160,23,0.4);
          transform: translateY(-2px);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        /* Map placeholder */
        .map-placeholder {
          border-radius: 20px;
          border: 1px solid rgba(212,160,23,0.2);
          overflow: hidden;
          position: relative;
          height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background:
            radial-gradient(ellipse at 60% 40%, rgba(212,160,23,0.08) 0%, transparent 60%),
            linear-gradient(160deg, rgba(15,10,0,1) 0%, rgba(26,18,0,1) 100%);
        }
        .map-grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,160,23,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,160,23,0.07) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .map-pin-ring {
          width: 80px; height: 80px;
          border-radius: 50%;
          border: 2px solid rgba(212,160,23,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: pingRing 2s ease-in-out infinite;
        }
        @keyframes pingRing {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.4); }
          50% { box-shadow: 0 0 0 20px rgba(212,160,23,0); }
        }

        /* FAQ pill */
        .faq-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1.1rem;
          background: rgba(212,160,23,0.06);
          border: 1px solid rgba(212,160,23,0.18);
          border-radius: 50px;
          color: #a89060;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .faq-pill:hover {
          background: rgba(212,160,23,0.14);
          border-color: #d4a017;
          color: #f0c040;
          transform: translateY(-2px);
        }

        /* Spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(15,10,0,0.3);
          border-top-color: #0f0a00;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Icon circle */
        .icon-circle {
          width: 48px; height: 48px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          background: rgba(212,160,23,0.1);
          border: 1px solid rgba(212,160,23,0.2);
        }

        /* Success card */
        .success-card {
          text-align: center;
          padding: 3rem 2rem;
        }
        .success-icon-wrap {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(76,175,80,0.1);
          border: 2px solid rgba(76,175,80,0.35);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
        }

        @media (max-width: 768px) {
          .contact-layout { flex-direction: column !important; }
          .form-glass { padding: 1.5rem !important; }
        }
      `}</style>

      {/* Background decorations */}
      <div className="contact-grid-overlay" />
      <div className="blob-1" />
      <div className="blob-2" />

      {/* ── MAIN CONTENT ── */}
      <div style={{ position: "relative", zIndex: 1, paddingTop: "6rem" /* pt-24 */ }}>

        {/* ── Back Link ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 0" }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#a89060",
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0c040")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a89060")}
            >
              <ChevronLeft size={16} />
              Back to Home
            </Link>
          </motion.div>
        </div>

        {/* ── Page Header ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          style={{ textAlign: "center", padding: "3rem 1.5rem 3.5rem" }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(212,160,23,0.08)",
              border: "1px solid rgba(212,160,23,0.25)",
              borderRadius: 50,
              padding: "0.4rem 1.1rem",
              marginBottom: "1.5rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#d4a017",
            }}
          >
            <MessageCircle size={13} />
            Get in Touch
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#f5ead0",
              margin: "0 0 0.6rem",
              lineHeight: 1.15,
            }}
          >
            Contact{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #d4a017, #f0c040)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Us
            </span>
          </h1>

          <div className="gold-divider" />

          <p
            style={{
              color: "#a89060",
              fontSize: "1.05rem",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            We're here to help you craft the perfect biodata. Reach out to us
            through any of the channels below or send us a message directly.
          </p>
        </motion.div>

        {/* ── Two-Column Layout ── */}
        <div
          className="contact-layout"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem 5rem",
            display: "flex",
            gap: "3rem",
            alignItems: "flex-start",
          }}
        >
          {/* ━━━━━━━━━━━ LEFT COLUMN ━━━━━━━━━━━ */}
          <div style={{ flex: "0 0 360px", maxWidth: 360 }}>

            {/* Contact cards */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              style={{ marginBottom: "2.5rem" }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#f0c040",
                  marginBottom: "1.2rem",
                }}
              >
                Reach Us Directly
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {contactCards.map(({ icon: Icon, label, value, href, color }, i) => {
                  const content = (
                    <>
                      <div
                        className="icon-circle"
                        style={{ background: `${color}18`, borderColor: `${color}30` }}
                      >
                        <Icon size={20} color={color} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#a89060",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {label}
                        </div>
                        <div style={{ fontSize: "0.94rem", color: "#f5ead0", fontWeight: 500 }}>
                          {value}
                        </div>
                      </div>
                    </>
                  );

                  return (
                    <motion.div
                      key={label}
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      custom={0.25 + i * 0.1}
                    >
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-card"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="contact-card">{content}</div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.6}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "#f0c040",
                  marginBottom: "1rem",
                }}
              >
                Our Location
              </h2>
              <div className="map-placeholder">
                <div className="map-grid-lines" />
                <div className="map-pin-ring">
                  <MapPin size={32} color="#d4a017" fill="rgba(212,160,23,0.2)" />
                </div>
                <div style={{ position: "relative", textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: "#f5ead0",
                    }}
                  >
                    Mumbai, Maharashtra
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#a89060", marginTop: "0.2rem" }}>
                    India
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=Mumbai,Maharashtra,India"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 1.2rem",
                    background: "rgba(212,160,23,0.1)",
                    border: "1px solid rgba(212,160,23,0.3)",
                    borderRadius: 30,
                    color: "#d4a017",
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(212,160,23,0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(212,160,23,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <MapPin size={13} />
                  Open in Maps
                </a>
              </div>
            </motion.div>
          </div>

          {/* ━━━━━━━━━━━ RIGHT COLUMN ━━━━━━━━━━━ */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            style={{ flex: 1 }}
          >
            <div className="form-glass">

              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ── SUCCESS STATE ── */
                  <motion.div
                    key="success"
                    className="success-card"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="success-icon-wrap">
                      <CheckCircle size={38} color="#4CAF50" />
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: "#f5ead0",
                        marginBottom: "0.8rem",
                      }}
                    >
                      Message Sent!
                    </h3>
                    <p style={{ color: "#a89060", fontSize: "0.97rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                      Thank you for reaching out. Our team will get back to you
                      within <strong style={{ color: "#f0c040" }}>24 – 48 hours</strong> on
                      the business days. We look forward to assisting you.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                      }}
                      className="submit-btn"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  /* ── FORM STATE ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    noValidate
                  >
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.9rem",
                        fontWeight: 700,
                        color: "#f5ead0",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Send a Message
                    </h2>
                    <p style={{ color: "#a89060", fontSize: "0.88rem", marginBottom: "2rem" }}>
                      Fill in the form below and we'll respond promptly.
                    </p>

                    {/* Row: Name + Email */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                      {/* Full Name */}
                      <div className="field-group">
                        <label className="field-label" htmlFor="name">
                          <User size={11} style={{ display: "inline", marginRight: 4 }} />
                          Full Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Rahul Sharma"
                          value={form.name}
                          onChange={handleChange}
                          className={`field-input${errors.name ? " error" : ""}`}
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                      </div>

                      {/* Email */}
                      <div className="field-group">
                        <label className="field-label" htmlFor="email">
                          <Mail size={11} style={{ display: "inline", marginRight: 4 }} />
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="rahul@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={`field-input${errors.email ? " error" : ""}`}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                      </div>
                    </div>

                    {/* Row: Phone + Subject */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                      {/* Phone */}
                      <div className="field-group">
                        <label className="field-label" htmlFor="phone">
                          <Phone size={11} style={{ display: "inline", marginRight: 4 }} />
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={handleChange}
                          className={`field-input${errors.phone ? " error" : ""}`}
                        />
                        {errors.phone && <span className="field-error">{errors.phone}</span>}
                      </div>

                      {/* Subject */}
                      <div className="field-group">
                        <label className="field-label" htmlFor="subject">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className={`field-input${errors.subject ? " error" : ""}`}
                        >
                          <option value="" disabled>
                            Select a subject…
                          </option>
                          {subjects.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {errors.subject && <span className="field-error">{errors.subject}</span>}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="field-group">
                      <label className="field-label" htmlFor="message">
                        <MessageCircle size={11} style={{ display: "inline", marginRight: 4 }} />
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        placeholder="Write your message here…"
                        value={form.message}
                        onChange={handleChange}
                        className={`field-input${errors.message ? " error" : ""}`}
                        style={{ resize: "vertical", minHeight: 120 }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        {errors.message ? (
                          <span className="field-error">{errors.message}</span>
                        ) : (
                          <span />
                        )}
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: form.message.length >= 20 ? "#a89060" : "#e07070",
                            marginTop: "0.3rem",
                          }}
                        >
                          {form.message.length} / min 20
                        </span>
                      </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="spinner" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>

                    <p
                      style={{
                        textAlign: "center",
                        color: "#a89060",
                        fontSize: "0.78rem",
                        marginTop: "1rem",
                      }}
                    >
                      We typically respond within 24 – 48 business hours.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── FAQ Quick Links ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem 6rem",
          }}
        >
          {/* Divider */}
          <div
            style={{
              borderTop: "1px solid rgba(212,160,23,0.15)",
              paddingTop: "3rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.6rem",
                fontWeight: 600,
                color: "#f5ead0",
                marginBottom: "0.6rem",
              }}
            >
              Frequently Asked Questions
            </div>
            <p style={{ color: "#a89060", fontSize: "0.9rem", marginBottom: "1.8rem" }}>
              Find quick answers before reaching out to us.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              {faqs.map(({ q, path }) => (
                <Link key={q} to={path} className="faq-pill">
                  <ChevronLeft
                    size={13}
                    style={{ transform: "rotate(180deg)" }}
                  />
                  {q}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
