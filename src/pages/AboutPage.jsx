import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Shield,
  Star,
  Users,
  Award,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

/* ─── Animation Variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.15 },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.1 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 },
  }),
};

/* ─── Data ────────────────────────────────────────────────────────── */
const values = [
  {
    icon: Shield,
    title: "Trust",
    description:
      "Every profile on BioData is manually reviewed. We verify authenticity at every step so families can connect with complete confidence and peace of mind.",
    gradient: "linear-gradient(135deg, #1a1000 0%, #2a1a00 100%)",
    accent: "#d4a017",
  },
  {
    icon: Heart,
    title: "Privacy",
    description:
      "Your personal information belongs to you. We employ bank-grade encryption and granular privacy controls, ensuring your data is shared only on your terms.",
    gradient: "linear-gradient(135deg, #1a0d00 0%, #2a1500 100%)",
    accent: "#f0c040",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "From our hand-crafted templates to our dedicated support team, we obsess over every detail so your biodata reflects the very best version of you.",
    gradient: "linear-gradient(135deg, #120d00 0%, #221800 100%)",
    accent: "#d4a017",
  },
];

const stats = [
  { label: "Families Served", value: "10K+", icon: Users },
  { label: "Average Rating", value: "4.9", icon: Star },
  { label: "Verified Profiles", value: "100%", icon: Shield },
  { label: "Premium Templates", value: "50+", icon: Sparkles },
];

/* ─── Component ───────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div
      style={{
        background: "#0f0a00",
        minHeight: "100vh",
        color: "#f5ead0",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          paddingTop: "6rem",
          paddingBottom: "5rem",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Radial glow background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,160,23,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Gold grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(212,160,23,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        {/* Back link */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{
            position: "absolute",
            top: "7rem",
            left: "2rem",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#a89060",
              textDecoration: "none",
              fontSize: "0.875rem",
              letterSpacing: "0.05em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0c040")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a89060")}
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </motion.div>

        {/* Decorative top ornament */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #d4a017)",
            }}
          />
          <Sparkles size={18} color="#d4a017" />
          <div
            style={{
              width: "60px",
              height: "1px",
              background:
                "linear-gradient(90deg, #d4a017, transparent)",
            }}
          />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            fontWeight: 600,
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #f0c040 20%, #d4a017 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: "0 auto 1.25rem",
            maxWidth: "800px",
          }}
        >
          About Us
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "#a89060",
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.7,
            letterSpacing: "0.02em",
          }}
        >
          Crafting legacies, one biodata at a time — where tradition meets
          timeless elegance.
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(212,160,23,0.5))",
            }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#d4a017",
              boxShadow: "0 0 12px #d4a017",
            }}
          />
          <div
            style={{
              width: "80px",
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(212,160,23,0.5), transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* ── Our Story Section ─────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
          position: "relative",
        }}
      >
        {/* Side accent line */}
        <div
          style={{
            position: "absolute",
            left: "1.5rem",
            top: "5rem",
            bottom: "5rem",
            width: "2px",
            background:
              "linear-gradient(180deg, transparent, #d4a017 30%, #d4a017 70%, transparent)",
            borderRadius: "2px",
          }}
        />

        <div style={{ paddingLeft: "3rem" }}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: "100px",
              padding: "0.35rem 1rem",
              marginBottom: "1.5rem",
            }}
          >
            <Heart size={14} color="#d4a017" />
            <span
              style={{
                color: "#d4a017",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Our Story
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 600,
              color: "#f5ead0",
              marginBottom: "2rem",
              lineHeight: 1.2,
            }}
          >
            Born from a Vision of{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f0c040, #d4a017)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Dignified Unions
            </span>
          </motion.h2>

          {[
            "BioData was founded with a singular purpose: to restore dignity, artistry, and authenticity to the Indian matrimonial journey. In a landscape crowded with generic forms and impersonal databases, we envisioned something profoundly different — a platform where every biodata tells a story as unique as the individual behind it.",
            "Rooted in the rich traditions of Indian matchmaking, yet designed for the modern family, BioData bridges generations. We understand that a matrimonial biodata is not merely a document — it is a family's first impression, a portrait of values, aspirations, and heritage presented to another family with trust and hope.",
            "Since our founding, we have had the honour of serving over ten thousand families across India and the Indian diaspora worldwide. Our platform combines the warmth of tradition with the precision of modern design, offering handcrafted templates inspired by regional aesthetics, from the intricate motifs of Rajasthan to the classical elegance of South India.",
          ].map((para, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={i + 2}
              style={{
                color: "#a89060",
                fontSize: "1.05rem",
                lineHeight: 1.85,
                marginBottom: "1.4rem",
                letterSpacing: "0.01em",
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────── */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        style={{
          position: "relative",
          margin: "2rem 0",
          padding: "3rem 1.5rem",
          background:
            "linear-gradient(135deg, rgba(212,160,23,0.08) 0%, rgba(240,192,64,0.04) 50%, rgba(212,160,23,0.08) 100%)",
          borderTop: "1px solid rgba(212,160,23,0.2)",
          borderBottom: "1px solid rgba(212,160,23,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Radial highlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 100% at 50% 50%, rgba(212,160,23,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              style={{ padding: "0.5rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "rgba(212,160,23,0.12)",
                    border: "1px solid rgba(212,160,23,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <stat.icon size={20} color="#d4a017" />
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #f0c040, #d4a017)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  color: "#a89060",
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Values Section ────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "5rem 1.5rem",
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: "100px",
              padding: "0.35rem 1rem",
              marginBottom: "1.25rem",
            }}
          >
            <Star size={14} color="#d4a017" />
            <span
              style={{
                color: "#d4a017",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Our Values
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 600,
              color: "#f5ead0",
              margin: "0 auto",
              maxWidth: "600px",
              lineHeight: 1.2,
            }}
          >
            Principles That{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f0c040, #d4a017)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Guide Every Step
            </span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              style={{
                background: val.gradient,
                border: `1px solid rgba(212,160,23,0.2)`,
                borderRadius: "20px",
                padding: "2.25rem",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
              }}
            >
              {/* Corner accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "80px",
                  height: "80px",
                  background: `radial-gradient(circle at top right, rgba(212,160,23,0.15) 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: "rgba(212,160,23,0.1)",
                  border: `1px solid rgba(212,160,23,0.3)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  boxShadow: `0 0 20px rgba(212,160,23,0.1)`,
                }}
              >
                <val.icon size={24} color={val.accent} />
              </div>

              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  color: "#f5ead0",
                  marginBottom: "0.85rem",
                  letterSpacing: "0.02em",
                }}
              >
                {val.title}
              </h3>

              <p
                style={{
                  color: "#a89060",
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  letterSpacing: "0.01em",
                }}
              >
                {val.description}
              </p>

              {/* Bottom gold line */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "2rem",
                  right: "2rem",
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${val.accent}60, transparent)`,
                  borderRadius: "2px",
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission Statement ─────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(212,160,23,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212,160,23,0.06) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(212,160,23,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Decorative quote mark */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "8rem",
              lineHeight: 0.6,
              color: "rgba(212,160,23,0.15)",
              marginBottom: "1rem",
              userSelect: "none",
            }}
          >
            "
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: "100px",
              padding: "0.35rem 1rem",
              marginBottom: "1.75rem",
            }}
          >
            <Sparkles size={14} color="#d4a017" />
            <span
              style={{
                color: "#d4a017",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Our Mission
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
              fontWeight: 600,
              color: "#f5ead0",
              lineHeight: 1.4,
              marginBottom: "2rem",
            }}
          >
            To empower every Indian family with the tools to present themselves
            with{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f0c040, #d4a017)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              grace, pride, and confidence
            </span>{" "}
            in their matrimonial journey.
          </h2>

          <p
            style={{
              color: "#a89060",
              fontSize: "1rem",
              lineHeight: 1.8,
              letterSpacing: "0.01em",
              marginBottom: "2.5rem",
            }}
          >
            We believe every union begins with a story — and every story
            deserves to be told beautifully. BioData is our commitment to
            making that possible for every family, regardless of region,
            language, or tradition.
          </p>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(212,160,23,0.4))",
              }}
            />
            <Heart size={18} color="#d4a017" fill="#d4a017" />
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(212,160,23,0.4), transparent)",
              }}
            />
          </div>

          {/* CTA Back Link */}
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background:
                "linear-gradient(135deg, #d4a017 0%, #f0c040 100%)",
              color: "#0f0a00",
              textDecoration: "none",
              padding: "0.85rem 2.25rem",
              borderRadius: "100px",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              boxShadow:
                "0 4px 24px rgba(212,160,23,0.35), 0 0 0 1px rgba(212,160,23,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(212,160,23,0.5), 0 0 0 1px rgba(212,160,23,0.4)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(212,160,23,0.35), 0 0 0 1px rgba(212,160,23,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <ChevronLeft size={16} />
            Return to Home
          </Link>
        </motion.div>
      </section>

      {/* ── Footer Strip ──────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(212,160,23,0.15)",
          padding: "1.75rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "rgba(168,144,96,0.5)",
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
          }}
        >
          © {new Date().getFullYear()} BioData — India's Premium Matrimony
          Biodata Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
