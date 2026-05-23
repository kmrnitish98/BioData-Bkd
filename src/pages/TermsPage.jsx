import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Scale, Shield, ChevronLeft, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "description", title: "Description of Service" },
  { id: "accounts", title: "User Accounts and Registration" },
  { id: "conduct", title: "User Content and Conduct" },
  { id: "guidelines", title: "Biodata Content Guidelines" },
  { id: "privacy", title: "Privacy and Data Protection" },
  { id: "ip", title: "Intellectual Property" },
  { id: "payments", title: "Premium Plans and Payments" },
  { id: "disclaimers", title: "Disclaimers and Limitations" },
  { id: "termination", title: "Termination" },
  { id: "governing", title: "Governing Law" },
  { id: "contact", title: "Contact Information" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: "easeOut" },
  }),
};

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const observerRef = useRef(null);

  useEffect(() => {
    const options = { rootMargin: "-20% 0px -70% 0px" };
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, options);
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        background: "#0f0a00",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        color: "#f5ead0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 40% at 80% 80%, rgba(212,160,23,0.05) 0%, transparent 60%)",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(212,160,23,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, paddingTop: "6rem" /* pt-24 */ }}>
        {/* ── Header ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "2.5rem 1.5rem 0",
          }}
        >
          {/* Back link */}
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#d4a017",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              marginBottom: "2rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0c040")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#d4a017")}
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>

          {/* Title block */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Scale size={22} color="#d4a017" />
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 700,
                color: "#f0c040",
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              Terms of Service
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "0.5rem",
              paddingLeft: "64px",
            }}
          >
            <span style={{ color: "#a89060", fontSize: "0.875rem" }}>
              Last Updated: <strong style={{ color: "#d4a017" }}>May 2025</strong>
            </span>
            <span style={{ color: "rgba(168,144,96,0.4)" }}>•</span>
            <span style={{ color: "#a89060", fontSize: "0.875rem" }}>Effective immediately upon acceptance</span>
          </div>

          {/* Gold divider */}
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, #d4a017 0%, rgba(212,160,23,0.15) 100%)",
              margin: "1.5rem 0 2.5rem",
            }}
          />

          {/* Intro banner */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              background: "rgba(212,160,23,0.06)",
              border: "1px solid rgba(212,160,23,0.2)",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              marginBottom: "3rem",
            }}
          >
            <AlertCircle size={20} color="#d4a017" style={{ marginTop: "2px", flexShrink: 0 }} />
            <p style={{ margin: 0, color: "#c8b884", fontSize: "0.9rem", lineHeight: 1.7 }}>
              Please read these Terms of Service carefully before using the BioData platform. By accessing or using
              our services, you agree to be bound by these terms. If you disagree with any part of these terms,
              please discontinue use of our platform.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Body: TOC + Content ── */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 1.5rem 5rem",
            display: "flex",
            gap: "2.5rem",
            alignItems: "flex-start",
          }}
        >
          {/* Sticky TOC Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              flexShrink: 0,
              width: "240px",
              position: "sticky",
              top: "6.5rem",
              display: "none",
              flexDirection: "column",
              gap: "4px",
            }}
            className="toc-sidebar"
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#d4a017",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                margin: "0 0 0.75rem",
              }}
            >
              Contents
            </p>
            {sections.map(({ id, title }, i) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  background: activeSection === id ? "rgba(212,160,23,0.1)" : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${activeSection === id ? "#d4a017" : "rgba(212,160,23,0.18)"}`,
                  color: activeSection === id ? "#f0c040" : "#a89060",
                  fontSize: "0.8rem",
                  padding: "0.45rem 0.8rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "0 6px 6px 0",
                  transition: "all 0.2s",
                  lineHeight: 1.4,
                  fontWeight: activeSection === id ? 600 : 400,
                }}
              >
                <span style={{ opacity: 0.5, marginRight: "6px", fontSize: "0.72rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {title}
              </button>
            ))}
          </motion.aside>

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <SectionCard
              id="acceptance"
              index={0}
              icon={<Scale size={18} color="#d4a017" />}
              title="1. Acceptance of Terms"
            >
              <p>
                By accessing, browsing, or using the BioData platform (the "Platform"), you acknowledge that you
                have read, understood, and agree to be legally bound by these Terms of Service ("Terms") and our
                Privacy Policy, which is incorporated herein by reference.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you ("User," "you," or "your") and
                BioData Technologies Pvt. Ltd. ("BioData," "we," "us," or "our"), a company incorporated under
                the laws of India. If you are using the Platform on behalf of an organization, you represent and
                warrant that you have the authority to bind that organization to these Terms.
              </p>
              <p>
                We reserve the right to update or modify these Terms at any time without prior notice. Your
                continued use of the Platform following any changes constitutes your acceptance of the revised
                Terms. We encourage you to review these Terms periodically.
              </p>
            </SectionCard>

            <SectionCard
              id="description"
              index={1}
              icon={<FileText size={18} color="#d4a017" />}
              title="2. Description of Service"
            >
              <p>
                BioData is a premium digital platform designed to facilitate the creation, sharing, and discovery
                of matrimonial biodata profiles, with a specific focus on Indian wedding traditions and cultural
                values. Our services include, but are not limited to:
              </p>
              <ul>
                <li>Creation and customization of professional matrimonial biodata documents</li>
                <li>Secure cloud storage and management of biodata profiles</li>
                <li>Family-focused profile sharing tools with privacy controls</li>
                <li>Premium templates inspired by regional Indian aesthetics and traditions</li>
                <li>PDF export and digital distribution features</li>
                <li>Assisted biodata creation services (Premium plans)</li>
                <li>Match discovery and profile browsing features (where applicable)</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of our services at any time.
                We will endeavour to provide reasonable notice of significant changes where possible.
              </p>
            </SectionCard>

            <SectionCard
              id="accounts"
              index={2}
              icon={<Shield size={18} color="#d4a017" />}
              title="3. User Accounts and Registration"
            >
              <p>
                To access certain features of the Platform, you must create an account. You agree to provide
                accurate, current, and complete information during the registration process and to update such
                information as necessary to maintain its accuracy.
              </p>
              <p>You are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring your account is not used by anyone under the age of 18</li>
              </ul>
              <p>
                You may not create more than one account per individual without express written consent from
                BioData. Accounts created using false information, automated methods, or for fraudulent purposes
                will be terminated without notice and may be reported to appropriate authorities.
              </p>
              <p>
                We reserve the right to refuse registration or cancel accounts at our sole discretion,
                particularly where we believe a user has violated these Terms or applicable law.
              </p>
            </SectionCard>

            <SectionCard
              id="conduct"
              index={3}
              icon={<Scale size={18} color="#d4a017" />}
              title="4. User Content and Conduct"
            >
              <p>
                You are solely responsible for all content, data, text, images, and information ("User Content")
                that you upload, post, or otherwise transmit through the Platform. By submitting User Content,
                you grant BioData a non-exclusive, royalty-free, worldwide license to use, store, and display
                your content solely for the purpose of providing and improving our services.
              </p>
              <p>You agree NOT to use the Platform to:</p>
              <ul>
                <li>Post false, misleading, or fraudulent information about yourself or any individual</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, threaten, intimidate, or harm any other user</li>
                <li>Collect or harvest personal data of other users without their consent</li>
                <li>Transmit unsolicited commercial communications (spam)</li>
                <li>Violate any applicable Indian or international laws or regulations</li>
                <li>Upload malware, viruses, or any harmful code</li>
                <li>Engage in discriminatory conduct based on caste, religion, gender, or disability in a manner prohibited by Indian law</li>
                <li>Use the Platform for any commercial matchmaking services without authorization</li>
              </ul>
            </SectionCard>

            <SectionCard
              id="guidelines"
              index={4}
              icon={<FileText size={18} color="#d4a017" />}
              title="5. Biodata Content Guidelines"
            >
              <p>
                Given the sensitive and personal nature of matrimonial biodata, we have established specific
                content guidelines to ensure a respectful, safe, and authentic experience for all users.
              </p>
              <p><strong style={{ color: "#d4a017" }}>Permitted Content:</strong></p>
              <ul>
                <li>Accurate personal information including name, age, education, and profession</li>
                <li>Genuine photographs of the profile subject</li>
                <li>Family background, cultural traditions, and lifestyle preferences</li>
                <li>Contact information for matrimonial inquiries (with appropriate privacy settings)</li>
                <li>Horoscope details, religious preferences, and cultural values</li>
              </ul>
              <p><strong style={{ color: "#d4a017" }}>Prohibited Content:</strong></p>
              <ul>
                <li>Photographs of individuals other than the profile subject without consent</li>
                <li>Fraudulent, exaggerated, or misleading personal information</li>
                <li>Content that violates the Dowry Prohibition Act, 1961, or related legislation</li>
                <li>Obscene, offensive, or sexually explicit content</li>
                <li>Advertisements for commercial services unrelated to matrimony</li>
                <li>Biodata created for minors (persons under 18 years of age)</li>
              </ul>
              <p>
                BioData reserves the right to review, edit, or remove any content that violates these guidelines
                without prior notice. Repeat violations may result in permanent account suspension.
              </p>
            </SectionCard>

            <SectionCard
              id="privacy"
              index={5}
              icon={<Shield size={18} color="#d4a017" />}
              title="6. Privacy and Data Protection"
            >
              <p>
                Your privacy is of paramount importance to us. Our collection, use, and protection of personal
                data is governed by our comprehensive Privacy Policy, which forms an integral part of these Terms.
              </p>
              <p>Key privacy commitments include:</p>
              <ul>
                <li>
                  <strong>Data Minimization:</strong> We collect only the data necessary to provide our services
                </li>
                <li>
                  <strong>Consent-Based Processing:</strong> Personal data is processed with your explicit consent
                </li>
                <li>
                  <strong>Secure Storage:</strong> All data is stored with industry-standard encryption protocols
                </li>
                <li>
                  <strong>No Unauthorized Sharing:</strong> We do not sell your personal data to third parties
                </li>
                <li>
                  <strong>Right to Deletion:</strong> You may request deletion of your data at any time
                </li>
                <li>
                  <strong>DPDP Compliance:</strong> We adhere to the Digital Personal Data Protection Act, 2023
                </li>
              </ul>
              <p>
                By using our Platform, you acknowledge that matrimonial biodata is inherently personal. We
                strongly encourage users to use our privacy controls to manage who can view their information,
                and to share sensitive details only with trusted parties.
              </p>
            </SectionCard>

            <SectionCard
              id="ip"
              index={6}
              icon={<Scale size={18} color="#d4a017" />}
              title="7. Intellectual Property"
            >
              <p>
                The Platform and its original content, features, functionality, design templates, logos,
                trademarks, and underlying technology are and will remain the exclusive property of BioData
                Technologies Pvt. Ltd. and its licensors. Our intellectual property is protected by applicable
                Indian intellectual property laws including the Copyright Act, 1957, and the Trade Marks Act,
                1999.
              </p>
              <p>You acknowledge and agree that:</p>
              <ul>
                <li>
                  BioData's templates, design systems, and platform technology may not be copied, reproduced,
                  or distributed without written authorization
                </li>
                <li>
                  The "BioData" name, logo, and associated marks are registered or pending trademarks and may
                  not be used without prior consent
                </li>
                <li>
                  You retain ownership of the personal content you create, but grant us a license to operate
                  the service as described in Section 4
                </li>
                <li>
                  Any feedback, suggestions, or ideas you provide to us may be used by BioData without
                  obligation or compensation
                </li>
              </ul>
              <p>
                We respect the intellectual property rights of others and expect users to do the same. If you
                believe any content on the Platform infringes your copyright, please contact us with a detailed
                notice.
              </p>
            </SectionCard>

            <SectionCard
              id="payments"
              index={7}
              icon={<FileText size={18} color="#d4a017" />}
              title="8. Premium Plans and Payments"
            >
              <p>
                BioData offers both free and premium subscription plans. Premium features are available upon
                payment of applicable subscription fees as displayed on our Pricing page at the time of purchase.
              </p>
              <p><strong style={{ color: "#d4a017" }}>Billing and Subscriptions:</strong></p>
              <ul>
                <li>All prices are listed in Indian Rupees (INR) and include applicable GST</li>
                <li>Subscriptions are billed on a recurring basis (monthly or annually) as selected</li>
                <li>Automatic renewal occurs unless cancelled at least 24 hours before the renewal date</li>
                <li>
                  Payment methods accepted include UPI, credit/debit cards, net banking, and select wallets
                </li>
              </ul>
              <p><strong style={{ color: "#d4a017" }}>Refund Policy:</strong></p>
              <ul>
                <li>
                  Refund requests may be submitted within 7 days of initial purchase for annual plans, subject
                  to review
                </li>
                <li>Monthly subscriptions are non-refundable once the billing cycle has commenced</li>
                <li>Refunds, if approved, will be credited to the original payment method within 7–10 business days</li>
                <li>
                  Promotional or discounted plans may have separate refund terms specified at the time of purchase
                </li>
              </ul>
              <p>
                We reserve the right to modify pricing with reasonable advance notice. Continued use of premium
                features after a price change constitutes acceptance of the new pricing.
              </p>
            </SectionCard>

            <SectionCard
              id="disclaimers"
              index={8}
              icon={<AlertCircle size={18} color="#d4a017" />}
              title="9. Disclaimers and Limitations"
            >
              <p>
                THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, BIODATA DISCLAIMS
                ALL WARRANTIES.
              </p>
              <p>Specifically, BioData does not warrant that:</p>
              <ul>
                <li>
                  The Platform will be uninterrupted, error-free, or completely secure at all times
                </li>
                <li>
                  The information provided by other users on the Platform is accurate, complete, or truthful
                </li>
                <li>
                  The Platform will meet your specific requirements or expectations
                </li>
                <li>
                  Any matches or introductions facilitated through the Platform will result in marriage or any
                  other desired outcome
                </li>
              </ul>
              <p>
                <strong style={{ color: "#d4a017" }}>Limitation of Liability:</strong> To the maximum extent
                permitted by Indian law, BioData's total liability to you for any claims arising from the use
                of the Platform shall not exceed the amount paid by you to BioData in the 12 months preceding
                the claim. We shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages.
              </p>
              <p>
                BioData is a technology platform and does not conduct background verifications of users. We
                strongly encourage users to exercise due diligence, meet in safe public places, and involve
                family members in the matrimonial process.
              </p>
            </SectionCard>

            <SectionCard
              id="termination"
              index={9}
              icon={<Shield size={18} color="#d4a017" />}
              title="10. Termination"
            >
              <p>
                Either party may terminate the user relationship at any time. You may close your account by
                following the account deletion process in your profile settings. We will process your request
                and delete your data in accordance with our Privacy Policy.
              </p>
              <p>BioData may suspend or terminate your account immediately, without prior notice, if:</p>
              <ul>
                <li>You breach any provision of these Terms</li>
                <li>We are required to do so by applicable law or court order</li>
                <li>We reasonably suspect fraudulent, abusive, or illegal activity on your account</li>
                <li>Your conduct creates legal liability or reputational harm to BioData or other users</li>
                <li>Your account has been inactive for a period exceeding 24 months (with prior notice)</li>
              </ul>
              <p>
                Upon termination, your right to access the Platform ceases immediately. We may retain certain
                information as required by law or for legitimate business purposes, as detailed in our Privacy
                Policy. Provisions of these Terms that by their nature should survive termination shall remain
                in effect.
              </p>
            </SectionCard>

            <SectionCard
              id="governing"
              index={10}
              icon={<Scale size={18} color="#d4a017" />}
              title="11. Governing Law"
            >
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of the
                Republic of India, without regard to its conflict of law principles.
              </p>
              <p>
                <strong style={{ color: "#d4a017" }}>Jurisdiction:</strong> Any disputes arising out of or
                relating to these Terms, the Platform, or our services shall be subject to the exclusive
                jurisdiction of the competent courts located in{" "}
                <strong style={{ color: "#f0c040" }}>New Delhi, India</strong>. By using the Platform, you
                irrevocably consent to the personal jurisdiction of such courts and waive any objections to
                venue or jurisdiction.
              </p>
              <p>Applicable laws and regulations include:</p>
              <ul>
                <li>Information Technology Act, 2000, and its amendments</li>
                <li>Digital Personal Data Protection Act, 2023</li>
                <li>Consumer Protection Act, 2019</li>
                <li>Indian Contract Act, 1872</li>
                <li>The Special Marriage Act, 1954, and related matrimonial legislation</li>
              </ul>
              <p>
                <strong style={{ color: "#d4a017" }}>Dispute Resolution:</strong> Before initiating legal
                proceedings, the parties agree to attempt resolution through good-faith negotiation for a period
                of 30 days. If unresolved, disputes may be referred to arbitration under the Arbitration and
                Conciliation Act, 1996, with the seat of arbitration in New Delhi.
              </p>
            </SectionCard>

            <SectionCard
              id="contact"
              index={11}
              icon={<FileText size={18} color="#d4a017" />}
              title="12. Contact Information"
            >
              <p>
                If you have any questions, concerns, or feedback regarding these Terms of Service, or if you
                wish to report a violation, please contact us through any of the following channels:
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginTop: "1.25rem",
                }}
              >
                {[
                  { label: "Legal Inquiries", value: "legal@biodataapp.in" },
                  { label: "Support", value: "support@biodataapp.in" },
                  { label: "Grievance Officer", value: "grievance@biodataapp.in" },
                  { label: "Phone", value: "+91-11-XXXX-XXXX" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(212,160,23,0.06)",
                      border: "1px solid rgba(212,160,23,0.18)",
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "0.75rem",
                        color: "#a89060",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </p>
                    <p style={{ margin: 0, color: "#f0c040", fontWeight: 600, fontSize: "0.875rem" }}>{value}</p>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.25rem",
                  background: "rgba(212,160,23,0.04)",
                  border: "1px solid rgba(212,160,23,0.12)",
                  borderRadius: "8px",
                }}
              >
                <p style={{ margin: "0 0 4px", color: "#a89060", fontSize: "0.8rem" }}>
                  <strong style={{ color: "#d4a017" }}>Registered Address:</strong>
                </p>
                <p style={{ margin: 0, color: "#c8b884", fontSize: "0.875rem", lineHeight: 1.7 }}>
                  BioData Technologies Pvt. Ltd.<br />
                  [Registered Office Address]<br />
                  New Delhi – 110001, India
                </p>
              </div>
              <p style={{ marginTop: "1.5rem", color: "#a89060", fontSize: "0.85rem" }}>
                We aim to respond to all legal and compliance inquiries within{" "}
                <strong style={{ color: "#d4a017" }}>3 business days</strong>. For urgent matters, please
                mark your communication as "URGENT" in the subject line.
              </p>
            </SectionCard>
          </main>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderTop: "1px solid rgba(212,160,23,0.12)",
            padding: "2rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#a89060", fontSize: "0.8rem", margin: 0 }}>
            © 2025 BioData Technologies Pvt. Ltd. · All rights reserved ·{" "}
            <Link
              to="/privacy"
              style={{ color: "#d4a017", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0c040")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#d4a017")}
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Responsive TOC: show on md+ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap');
        @media (min-width: 768px) {
          .toc-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Section Card Component ── */
function SectionCard({ id, index, icon, title, children }) {
  return (
    <motion.section
      id={id}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: i * 0.04, ease: "easeOut" },
        }),
      }}
      style={{
        background:
          "linear-gradient(135deg, rgba(212,160,23,0.05) 0%, rgba(15,10,0,0.6) 60%)",
        border: "1px solid rgba(212,160,23,0.15)",
        borderLeft: "3px solid #d4a017",
        borderRadius: "12px",
        padding: "1.75rem 2rem",
        marginBottom: "1.5rem",
        backdropFilter: "blur(4px)",
        scrollMarginTop: "7rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "rgba(212,160,23,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.15rem, 2.5vw, 1.45rem)",
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
          color: "#c8b884",
          fontSize: "0.9rem",
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </motion.section>
  );
}
