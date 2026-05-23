import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

/* ─────────────── design tokens ─────────────── */
const BG = "#0f0a00";
const GOLD = "#d4a017";
const GOLD_LIGHT = "#f0c040";
const TEXT_PRIMARY = "#f5ead0";
const TEXT_MUTED = "#a89060";

/* ─────────────── animation variants ─────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

/* ─────────────── data ─────────────── */
const sections = [
  {
    id: "overview",
    icon: <Sparkles size={22} />,
    title: "1. Overview",
    content: `At BioData, customer satisfaction is at the heart of everything we do. We
      understand that purchasing a premium plan is a significant decision, and we
      want you to feel completely confident. Our refund policy is designed to be
      fair, transparent, and hassle-free. If you are not satisfied with your
      purchase for any reason, please reach out to us and we will do our best to
      make it right.`,
  },
  {
    id: "eligibility",
    icon: <CheckCircle size={22} />,
    title: "2. Eligibility for Refund",
    bullets: [
      "Refund requests must be submitted within 7 days of purchase.",
      "The premium features associated with your plan must be unused or minimally used.",
      "The account must be in good standing with no violations of our Terms of Service.",
      "Only original purchases are eligible; renewals may be subject to different terms.",
      "Refunds are applicable to paid premium plans only — free plans are not eligible.",
    ],
  },
  {
    id: "non-refundable",
    icon: <AlertCircle size={22} />,
    title: "3. Non-Refundable Items",
    bullets: [
      "Biodata templates that have already been downloaded or shared.",
      "Premium plans whose validity period has expired.",
      "Add-on features or one-time purchases (e.g., extra downloads, photo enhancements).",
      "Promotional or discounted purchases obtained via special offer codes.",
      "Subscription fees for the current active billing cycle after 7 days.",
    ],
  },
  {
    id: "how-to-request",
    icon: <RefreshCw size={22} />,
    title: "4. How to Request a Refund",
    content: `To initiate a refund, please contact our support team through one of the
      following channels:`,
    contacts: [
      { label: "WhatsApp", value: "+91 98765 43210" },
      { label: "Email", value: "refunds@biodata.in" },
      { label: "Support Hours", value: "Mon – Sat, 9 AM – 7 PM IST" },
    ],
    note: `Include your registered email address, order ID, and the reason for your
      refund request. Our team will acknowledge your request within 24 hours and
      guide you through the process.`,
  },
  {
    id: "process-timeline",
    icon: <Clock size={22} />,
    title: "5. Refund Process and Timeline",
    content: `Once your refund request is approved:`,
    bullets: [
      "Refunds are processed within 5–7 business days from the date of approval.",
      "The amount will be credited to the original payment method used during purchase.",
      "Bank processing times may add an additional 2–3 business days depending on your bank.",
      "You will receive a confirmation email once the refund has been initiated.",
      "UPI and wallet refunds are typically faster (1–3 business days).",
    ],
  },
  {
    id: "partial-refunds",
    icon: <RefreshCw size={22} />,
    title: "6. Partial Refunds",
    content: `In certain situations, a partial refund may be offered:`,
    bullets: [
      "If some premium features have been used but others remain untouched, we may issue a pro-rated refund.",
      "If you downgrade from a higher plan to a lower plan within 7 days, the difference may be refunded.",
      "Partial refunds are determined on a case-by-case basis at our sole discretion.",
      "Our team will clearly communicate the refund amount before processing.",
    ],
  },
  {
    id: "subscription-cancellation",
    icon: <AlertCircle size={22} />,
    title: "7. Subscription Cancellation",
    content: `You may cancel your subscription at any time through your account settings:`,
    bullets: [
      "Cancellation stops future billing immediately.",
      "Access to premium features continues until the end of the current billing period.",
      "Cancellations do not automatically trigger a refund for the current period.",
      "To request a refund alongside cancellation, please contact our support team.",
      "Annual plan cancellations within 7 days of purchase are eligible for a full refund.",
    ],
  },
  {
    id: "exceptions",
    icon: <Sparkles size={22} />,
    title: "8. Exceptions and Special Cases",
    content: `We recognise that every situation is unique. We will consider exceptions in
      good faith for the following circumstances:`,
    bullets: [
      "Technical failures on our platform that prevented you from using the service.",
      "Duplicate charges or billing errors due to payment gateway issues.",
      "Bereavement or medical emergencies (documentation may be requested).",
      "Any other extraordinary circumstance reviewed and approved by our team.",
    ],
  },
  {
    id: "contact",
    icon: <CheckCircle size={22} />,
    title: "9. Contact Us for Refunds",
    content: `Our dedicated refund support team is here to help. We are committed to
      resolving every concern promptly and professionally. Please do not hesitate
      to reach out — we value your trust in BioData.`,
    contacts: [
      { label: "WhatsApp", value: "+91 98765 43210" },
      { label: "Email", value: "refunds@biodata.in" },
      { label: "Website", value: "www.biodata.in/contact" },
    ],
  },
];

const refundSteps = [
  {
    step: "01",
    title: "Contact Support",
    desc: "Reach out via WhatsApp or email with your order details and reason for the refund request.",
    icon: <RefreshCw size={28} />,
  },
  {
    step: "02",
    title: "Review & Approval",
    desc: "Our team reviews your request within 24–48 hours and communicates the outcome to you.",
    icon: <Clock size={28} />,
  },
  {
    step: "03",
    title: "Refund Credited",
    desc: "Approved refunds are processed within 5–7 business days to your original payment method.",
    icon: <CheckCircle size={28} />,
  },
];

/* ─────────────── sub-components ─────────────── */
function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 24px" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD}55)` }} />
      <Sparkles size={14} color={GOLD} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD}55)` }} />
    </div>
  );
}

function SectionCard({ section, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      style={{
        background: "linear-gradient(135deg, #1a1000cc 60%, #2a1a0088)",
        border: `1px solid ${GOLD}33`,
        borderRadius: 16,
        padding: "32px 36px",
        marginBottom: 28,
        backdropFilter: "blur(8px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle corner ornament */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${GOLD}18, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ color: GOLD_LIGHT }}>{section.icon}</span>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.15rem, 2.5vw, 1.45rem)",
          fontWeight: 700,
          color: GOLD_LIGHT,
          margin: 0,
          letterSpacing: "0.02em",
        }}>
          {section.title}
        </h2>
      </div>

      {section.content && (
        <p style={{
          color: TEXT_PRIMARY,
          lineHeight: 1.8,
          fontSize: "0.97rem",
          marginBottom: section.bullets || section.contacts ? 16 : 0,
        }}>
          {section.content}
        </p>
      )}

      {section.bullets && (
        <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
          {section.bullets.map((b, i) => (
            <li key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              color: TEXT_PRIMARY, fontSize: "0.95rem", lineHeight: 1.75,
              marginBottom: 8,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: GOLD, flexShrink: 0, marginTop: 8,
              }} />
              {b}
            </li>
          ))}
        </ul>
      )}

      {section.contacts && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14,
        }}>
          {section.contacts.map((c, i) => (
            <div key={i} style={{
              background: `${GOLD}18`,
              border: `1px solid ${GOLD}44`,
              borderRadius: 10,
              padding: "8px 18px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ color: GOLD, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em" }}>
                {c.label}:
              </span>
              <span style={{ color: TEXT_PRIMARY, fontSize: "0.9rem" }}>{c.value}</span>
            </div>
          ))}
        </div>
      )}

      {section.note && (
        <p style={{
          color: TEXT_MUTED, lineHeight: 1.75, fontSize: "0.9rem",
          marginTop: 14, fontStyle: "italic",
        }}>
          {section.note}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────── main component ─────────────── */
export default function RefundPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      color: TEXT_PRIMARY,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* ── background radial glow ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 20% 10%, ${GOLD}12 0%, transparent 70%),
          radial-gradient(ellipse 50% 35% at 80% 80%, ${GOLD}0d 0%, transparent 70%)
        `,
      }} />

      {/* ── decorative gold ring top-right ── */}
      <div style={{
        position: "fixed", top: -180, right: -180, width: 480, height: 480,
        borderRadius: "50%", border: `1px solid ${GOLD}1a`,
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", top: -120, right: -120, width: 320, height: 320,
        borderRadius: "50%", border: `1px solid ${GOLD}22`,
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "0 20px 80px",
        paddingTop: "6rem", /* pt-24 for navbar clearance */
        position: "relative", zIndex: 1,
      }}>
        {/* ── back link ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: TEXT_MUTED, textDecoration: "none", fontSize: "0.88rem",
              letterSpacing: "0.03em",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD_LIGHT}
            onMouseLeave={e => e.currentTarget.style.color = TEXT_MUTED}
          >
            <ChevronLeft size={16} /> Back to Home
          </Link>
        </motion.div>

        {/* ── page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          {/* badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${GOLD}18`, border: `1px solid ${GOLD}44`,
            borderRadius: 999, padding: "6px 20px",
            marginBottom: 22,
          }}>
            <RefreshCw size={14} color={GOLD} />
            <span style={{ color: GOLD, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em" }}>
              REFUND POLICY
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: 700,
            color: GOLD_LIGHT,
            margin: "0 0 16px",
            lineHeight: 1.15,
            letterSpacing: "0.01em",
          }}>
            Our Refund Policy
          </h1>

          <p style={{
            color: TEXT_MUTED,
            fontSize: "0.95rem",
            maxWidth: 520,
            margin: "0 auto 10px",
            lineHeight: 1.75,
          }}>
            We believe in complete transparency and fairness. Please read our
            policy carefully to understand your rights and options.
          </p>

          <p style={{ color: `${TEXT_MUTED}99`, fontSize: "0.82rem" }}>
            Last Updated: <span style={{ color: TEXT_MUTED }}>May 2025</span>
          </p>

          <GoldDivider />
        </motion.div>

        {/* ── Our Promise banner ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={{
            background: `linear-gradient(135deg, ${GOLD}22 0%, ${GOLD}0d 100%)`,
            border: `1.5px solid ${GOLD}66`,
            borderRadius: 18,
            padding: "28px 36px",
            marginBottom: 44,
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* glow blob */}
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 180, height: 180,
            background: `radial-gradient(circle, ${GOLD}22, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{
            background: `${GOLD}28`, borderRadius: "50%",
            width: 52, height: 52, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${GOLD}55`,
          }}>
            <Sparkles size={24} color={GOLD_LIGHT} />
          </div>

          <div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.35rem", fontWeight: 700,
              color: GOLD_LIGHT, margin: "0 0 8px",
              letterSpacing: "0.03em",
            }}>
              ✦ Our Promise to You
            </h3>
            <p style={{
              color: TEXT_PRIMARY, fontSize: "0.95rem",
              lineHeight: 1.8, margin: 0,
            }}>
              Your trust is our most valuable asset. If you ever feel our service
              did not meet your expectations, we are here to listen and resolve
              your concern promptly. We commit to processing every genuine refund
              request with honesty, empathy, and speed — no unnecessary delays,
              no complicated procedures.
            </p>
          </div>
        </motion.div>

        {/* ── How to Claim — 3 steps ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          style={{ marginBottom: 52 }}
        >
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.2rem, 3vw, 1.65rem)",
            fontWeight: 700, color: GOLD_LIGHT,
            textAlign: "center", marginBottom: 28,
            letterSpacing: "0.03em",
          }}>
            How to Claim Your Refund
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}>
            {refundSteps.map((s, i) => (
              <motion.div
                key={s.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                style={{
                  background: "linear-gradient(135deg, #1a1000cc, #2a1a0066)",
                  border: `1px solid ${GOLD}33`,
                  borderRadius: 14,
                  padding: "28px 24px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute", top: 10, left: 16,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "3.5rem", fontWeight: 700,
                  color: `${GOLD}14`, lineHeight: 1, pointerEvents: "none",
                }}>
                  {s.step}
                </div>

                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `${GOLD}20`,
                  border: `1.5px solid ${GOLD}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                  color: GOLD_LIGHT,
                }}>
                  {s.icon}
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem", fontWeight: 700,
                  color: GOLD_LIGHT, margin: "0 0 10px",
                }}>
                  {s.title}
                </h3>

                <p style={{
                  color: TEXT_MUTED, fontSize: "0.88rem",
                  lineHeight: 1.7, margin: 0,
                }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Policy sections ── */}
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {sections.map((sec, i) => (
            <SectionCard key={sec.id} section={sec} index={i} />
          ))}
        </motion.div>

        {/* ── bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{
            marginTop: 20,
            textAlign: "center",
            background: `linear-gradient(135deg, ${GOLD}18, ${GOLD}08)`,
            border: `1px solid ${GOLD}44`,
            borderRadius: 18,
            padding: "40px 32px",
          }}
        >
          <Sparkles size={28} color={GOLD} style={{ marginBottom: 14 }} />
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem", fontWeight: 700,
            color: GOLD_LIGHT, margin: "0 0 12px",
          }}>
            Still Have Questions?
          </h3>
          <p style={{
            color: TEXT_MUTED, fontSize: "0.92rem",
            lineHeight: 1.75, maxWidth: 480, margin: "0 auto 24px",
          }}>
            Our support team is always ready to assist you. Reach out to us
            and we will ensure your experience with BioData remains delightful.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:refunds@biodata.in"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                color: "#0f0a00",
                padding: "11px 28px",
                borderRadius: 10,
                fontWeight: 700, fontSize: "0.9rem",
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Email Support
            </a>
            <Link
              to="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent",
                color: GOLD_LIGHT,
                padding: "11px 28px",
                borderRadius: 10,
                fontWeight: 600, fontSize: "0.9rem",
                textDecoration: "none",
                border: `1.5px solid ${GOLD}66`,
                letterSpacing: "0.04em",
                transition: "border-color 0.2s, color 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${GOLD}66`; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        {/* ── footer note ── */}
        <p style={{
          textAlign: "center", color: `${TEXT_MUTED}77`,
          fontSize: "0.8rem", marginTop: 40, lineHeight: 1.7,
        }}>
          This Refund Policy is effective as of May 2025 and supersedes all
          previous versions. BioData reserves the right to update this policy
          at any time. Continued use of the platform constitutes acceptance of
          the revised policy.
        </p>
      </div>
    </div>
  );
}
