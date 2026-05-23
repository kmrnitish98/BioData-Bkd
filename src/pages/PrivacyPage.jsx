import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  ChevronLeft,
  Info,
  Database,
  Share2,
  UserCheck,
  Cookie,
  Globe,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";

const LAST_UPDATED = "May 2025";

const sections = [
  { id: "introduction", label: "Introduction", icon: Info },
  { id: "information-we-collect", label: "Information We Collect", icon: Database },
  { id: "how-we-use", label: "How We Use Your Information", icon: Eye },
  { id: "information-sharing", label: "Information Sharing", icon: Share2 },
  { id: "data-security", label: "Data Security", icon: Lock },
  { id: "your-rights", label: "Your Rights & Choices", icon: UserCheck },
  { id: "cookies", label: "Cookies & Tracking", icon: Cookie },
  { id: "third-party", label: "Third-Party Services", icon: Globe },
  { id: "childrens-privacy", label: "Children's Privacy", icon: Baby },
  { id: "changes", label: "Changes to This Policy", icon: RefreshCw },
  { id: "contact", label: "Contact Us", icon: Mail },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function SectionCard({ id, icon: Icon, title, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      id={id}
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="policy-card"
      style={{
        background: "linear-gradient(135deg, rgba(30,20,5,0.85) 0%, rgba(20,13,2,0.95) 100%)",
        border: "1px solid rgba(212,160,23,0.18)",
        borderLeft: "4px solid #d4a017",
        borderRadius: "14px",
        padding: "2rem 2rem 2rem 2.2rem",
        marginBottom: "2rem",
        boxShadow: "0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(212,160,23,0.07)",
        scrollMarginTop: "100px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.1rem" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: "10px",
            background: "linear-gradient(135deg, rgba(212,160,23,0.18) 0%, rgba(240,192,64,0.10) 100%)",
            border: "1px solid rgba(212,160,23,0.28)",
            flexShrink: 0,
          }}
        >
          <Icon size={20} color="#f0c040" />
        </span>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.55rem",
            fontWeight: 700,
            color: "#f0c040",
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </h2>
      </div>
      <div
        style={{
          color: "#c8b47a",
          fontSize: "0.97rem",
          lineHeight: "1.8",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ paddingLeft: "1.4rem", margin: "0.7rem 0" }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: "0.45rem", color: "#c8b47a" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function SubHeading({ children }) {
  return (
    <h3
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        color: "#d4a017",
        fontSize: "1.08rem",
        fontWeight: 600,
        marginTop: "1.1rem",
        marginBottom: "0.4rem",
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </h3>
  );
}

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0a00",
        paddingTop: "6rem",
        paddingBottom: "5rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(240,192,64,0.05) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "1.8rem" }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#a89060",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0c040")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a89060")}
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, rgba(212,160,23,0.2) 0%, rgba(240,192,64,0.10) 100%)",
              border: "1.5px solid rgba(212,160,23,0.35)",
              marginBottom: "1.3rem",
              boxShadow: "0 0 40px rgba(212,160,23,0.12)",
            }}
          >
            <Shield size={34} color="#f0c040" />
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight: 700,
              color: "#f5ead0",
              margin: "0 0 0.55rem 0",
              lineHeight: 1.15,
              letterSpacing: "0.01em",
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              color: "#a89060",
              fontSize: "1rem",
              margin: 0,
              letterSpacing: "0.03em",
            }}
          >
            Last updated: {LAST_UPDATED}
          </p>
          <div
            style={{
              width: "80px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #d4a017, transparent)",
              margin: "1.2rem auto 0",
              borderRadius: "2px",
            }}
          />
        </motion.div>

        {/* Layout: sidebar + content */}
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            alignItems: "flex-start",
          }}
        >
          {/* Sticky Table of Contents */}
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              flexShrink: 0,
              width: "240px",
              position: "sticky",
              top: "100px",
              display: "none",
              flexDirection: "column",
              gap: "0.15rem",
              background: "rgba(20,13,2,0.75)",
              border: "1px solid rgba(212,160,23,0.15)",
              borderRadius: "14px",
              padding: "1.3rem 1rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              // Shown only on large screens via inline media (handled in className below)
            }}
            className="toc-sidebar"
          >
            <p
              style={{
                color: "#d4a017",
                fontWeight: 700,
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                margin: "0 0 0.8rem 0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <FileText size={13} />
              Contents
            </p>
            {sections.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                    padding: "0.45rem 0.6rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    background: isActive
                      ? "rgba(212,160,23,0.13)"
                      : "transparent",
                    borderLeft: isActive
                      ? "2px solid #d4a017"
                      : "2px solid transparent",
                    color: isActive ? "#f0c040" : "#a89060",
                    fontSize: "0.82rem",
                    fontWeight: isActive ? 600 : 400,
                    transition: "all 0.2s",
                    lineHeight: 1.35,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#d4a017";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#a89060";
                  }}
                >
                  <Icon size={13} style={{ flexShrink: 0, opacity: 0.8 }} />
                  {label}
                </button>
              );
            })}
          </motion.aside>

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <SectionCard id="introduction" icon={Info} title="1. Introduction">
              <p>
                Welcome to <strong style={{ color: "#f0c040" }}>BioData</strong> — India's premier wedding biodata
                platform. We are committed to protecting your personal information and your right to privacy. This
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                platform, website, and related services.
              </p>
              <p style={{ marginTop: "0.8rem" }}>
                Please read this policy carefully. If you disagree with its terms, please discontinue use of our
                platform. By accessing or using BioData, you acknowledge that you have read, understood, and agree to
                be bound by this Privacy Policy.
              </p>
              <p style={{ marginTop: "0.8rem" }}>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will
                alert you about any changes by updating the "Last Updated" date of this policy.
              </p>
            </SectionCard>

            <SectionCard id="information-we-collect" icon={Database} title="2. Information We Collect">
              <SubHeading>Personal Information</SubHeading>
              <p>
                When you register and create a biodata profile, we may collect personally identifiable information
                such as:
              </p>
              <BulletList
                items={[
                  "Full name, date of birth, gender, and religion",
                  "Contact information — email address, phone number, and home address",
                  "Caste, sub-caste, and mother tongue",
                  "Educational qualifications and professional details",
                  "Physical attributes (height, complexion) as optionally provided",
                  "Family details including parents' and siblings' information",
                  "Photographs uploaded to your profile",
                ]}
              />

              <SubHeading>Profile Data</SubHeading>
              <p>
                We collect information you voluntarily provide to build and personalize your biodata profile,
                including:
              </p>
              <BulletList
                items={[
                  "Horoscope and astrological details",
                  "Preferences for a life partner",
                  "Custom fields and descriptions you add to your profile",
                  "Biodata templates chosen and design preferences",
                ]}
              />

              <SubHeading>Usage Data</SubHeading>
              <p>We automatically collect certain information when you visit, use, or navigate the platform:</p>
              <BulletList
                items={[
                  "IP address, browser type, and operating system",
                  "Pages visited, time spent, and navigation patterns",
                  "Device identifiers and session tokens",
                  "Referring URLs and search queries within the platform",
                  "Feature usage and click-stream data",
                ]}
              />
            </SectionCard>

            <SectionCard id="how-we-use" icon={Eye} title="3. How We Use Your Information">
              <p>We use the information we collect in the following ways:</p>
              <BulletList
                items={[
                  "To create and manage your account and biodata profile",
                  "To generate, customize, and deliver your wedding biodata documents",
                  "To facilitate sharing of your biodata with prospective matches and family",
                  "To improve, personalize, and expand our platform and features",
                  "To communicate with you — including account notifications and support responses",
                  "To send promotional emails and updates (with your consent)",
                  "To process payments and manage subscriptions",
                  "To prevent fraudulent activity and ensure platform security",
                  "To analyze usage trends and improve user experience",
                  "To comply with applicable legal obligations",
                ]}
              />
              <p style={{ marginTop: "0.9rem" }}>
                We will never sell your personal information to third parties or use it for purposes inconsistent with
                this policy without your explicit consent.
              </p>
            </SectionCard>

            <SectionCard id="information-sharing" icon={Share2} title="4. Information Sharing and Disclosure">
              <p>
                We understand that your biodata contains sensitive personal information. We treat it with the utmost
                care and share it only in the following limited circumstances:
              </p>
              <SubHeading>With Your Consent</SubHeading>
              <p>
                When you choose to share your biodata using our sharing tools, you control who receives it. We share
                your profile only with parties you explicitly authorize.
              </p>
              <SubHeading>Service Providers</SubHeading>
              <p>
                We may share information with trusted third-party vendors who assist us in operating the platform —
                such as cloud hosting, payment processors, and email service providers. These parties are contractually
                bound to keep your information confidential.
              </p>
              <SubHeading>Legal Requirements</SubHeading>
              <p>
                We may disclose your information if required by law, court order, or government authority, or if we
                believe in good faith that such disclosure is necessary to protect our rights or the safety of others.
              </p>
              <SubHeading>Business Transfers</SubHeading>
              <p>
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part
                of that transaction. We will notify you of any such change and ensure continued protection of your
                data.
              </p>
            </SectionCard>

            <SectionCard id="data-security" icon={Lock} title="5. Data Security">
              <p>
                We implement industry-standard security measures to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction:
              </p>
              <BulletList
                items={[
                  "256-bit SSL/TLS encryption for all data in transit",
                  "AES-256 encryption for sensitive data at rest",
                  "Secure, access-controlled cloud infrastructure",
                  "Regular security audits and penetration testing",
                  "Two-factor authentication for account access",
                  "Role-based access controls for our team members",
                  "Automatic session timeouts and anomaly detection",
                ]}
              />
              <p style={{ marginTop: "0.9rem" }}>
                While we take every precaution to protect your data, no method of electronic transmission or storage
                is 100% secure. We encourage you to use a strong, unique password for your account and to notify us
                immediately at{" "}
                <a href="mailto:security@biodata.in" style={{ color: "#f0c040", textDecoration: "none" }}>
                  security@biodata.in
                </a>{" "}
                if you suspect any unauthorized access.
              </p>
            </SectionCard>

            <SectionCard id="your-rights" icon={UserCheck} title="6. Your Rights and Choices">
              <p>
                As a user of BioData, you have the following rights with respect to your personal information:
              </p>
              <SubHeading>Access & Portability</SubHeading>
              <p>
                You have the right to request a copy of the personal data we hold about you in a portable,
                machine-readable format.
              </p>
              <SubHeading>Correction</SubHeading>
              <p>
                You can update or correct inaccurate information directly from your account dashboard at any time.
              </p>
              <SubHeading>Deletion</SubHeading>
              <p>
                You may request deletion of your account and associated data. We will honor deletion requests subject
                to our legal retention obligations.
              </p>
              <SubHeading>Opt-Out of Marketing</SubHeading>
              <p>
                You can unsubscribe from promotional communications at any time by clicking the unsubscribe link in
                any email or by adjusting your notification preferences in account settings.
              </p>
              <SubHeading>Data Processing Restriction</SubHeading>
              <p>
                Under applicable law (including India's Digital Personal Data Protection Act, 2023), you may have the
                right to restrict certain processing of your data. Please contact us to exercise this right.
              </p>
              <p style={{ marginTop: "0.9rem" }}>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:privacy@biodata.in" style={{ color: "#f0c040", textDecoration: "none" }}>
                  privacy@biodata.in
                </a>
                . We will respond within 30 days.
              </p>
            </SectionCard>

            <SectionCard id="cookies" icon={Cookie} title="7. Cookies and Tracking">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies
                are small data files placed on your device that help us remember your preferences and understand how
                you use our services.
              </p>
              <SubHeading>Types of Cookies We Use</SubHeading>
              <BulletList
                items={[
                  "Essential Cookies — Required for basic platform functionality (login sessions, security tokens)",
                  "Preference Cookies — Remember your settings and personalization choices",
                  "Analytics Cookies — Help us understand usage patterns and improve the platform",
                  "Marketing Cookies — Used to deliver relevant promotions (only with consent)",
                ]}
              />
              <SubHeading>Managing Cookies</SubHeading>
              <p>
                You can control cookie preferences through your browser settings. Disabling essential cookies may
                affect platform functionality. For analytics and marketing cookies, you can opt out via our Cookie
                Consent Manager (accessible from the platform footer).
              </p>
              <p style={{ marginTop: "0.8rem" }}>
                We also use web beacons, pixel tags, and local storage to gather similar information. Our analytics
                provider is Google Analytics, which operates under its own privacy policy.
              </p>
            </SectionCard>

            <SectionCard id="third-party" icon={Globe} title="8. Third-Party Services">
              <p>
                Our platform may contain links to or integrations with third-party websites and services. We are not
                responsible for the privacy practices of these third parties. We encourage you to review their
                respective privacy policies before providing any personal information.
              </p>
              <SubHeading>Third-Party Integrations</SubHeading>
              <BulletList
                items={[
                  "Payment Gateways — Razorpay, Stripe (PCI-DSS compliant payment processing)",
                  "Cloud Storage — AWS S3 for secure file and image storage",
                  "Authentication — Google OAuth for optional social login",
                  "Analytics — Google Analytics for anonymized usage statistics",
                  "Communication — SendGrid for transactional emails",
                  "Support — Freshdesk for customer support ticketing",
                ]}
              />
              <p style={{ marginTop: "0.9rem" }}>
                When you use these third-party services through our platform, you may be subject to their terms of
                service and privacy policies in addition to ours.
              </p>
            </SectionCard>

            <SectionCard id="childrens-privacy" icon={Baby} title="9. Children's Privacy">
              <p>
                BioData is designed for adults seeking matrimonial matches and is strictly intended for users who are
                18 years of age or older. Our platform is not directed at, and we do not knowingly collect personal
                information from, children under the age of 18.
              </p>
              <p style={{ marginTop: "0.8rem" }}>
                If we become aware that we have inadvertently collected personal information from a minor under 18
                without verifiable parental consent, we will take immediate steps to delete such information from our
                records.
              </p>
              <p style={{ marginTop: "0.8rem" }}>
                If you are a parent or guardian and believe your child has provided us with personal information,
                please contact us immediately at{" "}
                <a href="mailto:privacy@biodata.in" style={{ color: "#f0c040", textDecoration: "none" }}>
                  privacy@biodata.in
                </a>{" "}
                so we can take appropriate action.
              </p>
            </SectionCard>

            <SectionCard id="changes" icon={RefreshCw} title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
                legal requirements, or other factors. When we make material changes, we will:
              </p>
              <BulletList
                items={[
                  "Update the 'Last Updated' date at the top of this page",
                  "Display a prominent notice on our platform homepage",
                  "Send an email notification to registered users for significant changes",
                  "Where required by law, seek your explicit consent before applying changes",
                ]}
              />
              <p style={{ marginTop: "0.9rem" }}>
                We encourage you to review this policy periodically to stay informed about how we protect your
                information. Your continued use of BioData following the posting of changes constitutes your
                acceptance of those changes.
              </p>
              <p style={{ marginTop: "0.8rem" }}>
                The most current version of this policy is always available at{" "}
                <Link to="/privacy" style={{ color: "#f0c040", textDecoration: "none" }}>
                  biodata.in/privacy
                </Link>
                .
              </p>
            </SectionCard>

            <SectionCard id="contact" icon={Mail} title="11. Contact Us">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your
                personal data, please do not hesitate to reach out to us:
              </p>
              <div
                style={{
                  marginTop: "1.2rem",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    label: "Privacy Inquiries",
                    value: "privacy@biodata.in",
                    href: "mailto:privacy@biodata.in",
                  },
                  {
                    label: "Security Issues",
                    value: "security@biodata.in",
                    href: "mailto:security@biodata.in",
                  },
                  {
                    label: "General Support",
                    value: "support@biodata.in",
                    href: "mailto:support@biodata.in",
                  },
                  {
                    label: "Registered Address",
                    value: "BioData Pvt. Ltd., New Delhi, India",
                    href: null,
                  },
                ].map(({ label, value, href }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(212,160,23,0.07)",
                      border: "1px solid rgba(212,160,23,0.18)",
                      borderRadius: "10px",
                      padding: "1rem 1.1rem",
                    }}
                  >
                    <p
                      style={{
                        color: "#d4a017",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        margin: "0 0 0.35rem 0",
                      }}
                    >
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        style={{
                          color: "#f0c040",
                          textDecoration: "none",
                          fontSize: "0.92rem",
                          fontWeight: 500,
                        }}
                      >
                        {value}
                      </a>
                    ) : (
                      <p style={{ color: "#c8b47a", fontSize: "0.92rem", margin: 0 }}>{value}</p>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ marginTop: "1.2rem" }}>
                We aim to respond to all privacy-related inquiries within{" "}
                <strong style={{ color: "#f0c040" }}>30 business days</strong>. For urgent security matters, we
                respond within 48 hours.
              </p>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.2rem",
                  borderRadius: "10px",
                  background: "rgba(212,160,23,0.06)",
                  border: "1px solid rgba(212,160,23,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                }}
              >
                <Shield size={22} color="#d4a017" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#a89060" }}>
                  BioData is fully compliant with India's{" "}
                  <strong style={{ color: "#d4a017" }}>
                    Digital Personal Data Protection Act, 2023 (DPDPA)
                  </strong>{" "}
                  and applicable international privacy standards.
                </p>
              </div>
            </SectionCard>
          </main>
        </div>
      </div>

      {/* Inline styles for responsive sidebar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

        @media (min-width: 900px) {
          .toc-sidebar {
            display: flex !important;
          }
        }

        .policy-card p {
          margin: 0 0 0.5rem 0;
        }
        .policy-card p:last-child {
          margin-bottom: 0;
        }

        ::-webkit-scrollbar {
          width: 7px;
        }
        ::-webkit-scrollbar-track {
          background: #0f0a00;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(212,160,23,0.3);
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(212,160,23,0.55);
        }
      `}</style>
    </div>
  );
}
