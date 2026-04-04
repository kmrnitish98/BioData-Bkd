import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Printer, Download, Check, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getBiodataById } from '../firebase/firestore';
import HeroBanner from '../components/biodata/HeroBanner';
import PersonalInfoCard from '../components/biodata/PersonalInfoCard';
import EducationCard from '../components/biodata/EducationCard';
import FamilyCard from '../components/biodata/FamilyCard';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const { id } = useParams();
  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBiodataById(id);
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

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    if (!profileRef.current) return;
    setPdfLoading(true);
    try {
      const canvas = await html2canvas(profileRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0000',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        while (position < pdfHeight) {
          pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight);
          position += pageHeight;
          if (position < pdfHeight) pdf.addPage();
        }
      }
      const name = biodata?.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Biodata';
      pdf.save(`${name}_Biodata.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <Loader message="Loading Biodata..." />;

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center">
        <Heart className="w-16 h-16 text-red-900/40 mx-auto mb-4" />
        <h1 className="text-3xl text-white font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Biodata Not Found
        </h1>
        <p className="text-gray-600 mb-6">This profile may have been removed or marked private.</p>
        <Link to="/">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const { personalInfo = {}, educationInfo = {}, familyInfo = {}, preferences = {}, photoURL } = biodata;

  return (
    <div className="min-h-screen">
      {/* Fixed Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 print:hidden"
      >
        <div className="flex items-center gap-2 glass border border-yellow-900/30 rounded-full px-4 py-2.5 shadow-2xl">
          <Link to="/">
            <Button variant="ghost" size="sm" className="rounded-full !px-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="h-4 w-px bg-red-900/40" />

          <Button variant="ghost" size="sm" onClick={handleCopyLink} className="rounded-full !px-3 gap-1.5">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            <span className="text-xs">{copied ? 'Copied!' : 'Share'}</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={handlePrint} className="rounded-full !px-3 gap-1.5">
            <Printer className="w-4 h-4" />
            <span className="text-xs">Print</span>
          </Button>

          <Button variant="gold" size="sm" onClick={handleDownloadPDF} loading={pdfLoading} className="rounded-full !px-4 gap-1.5">
            <Download className="w-4 h-4" />
            <span className="text-xs">PDF</span>
          </Button>
        </div>
      </motion.div>

      {/* Printable / PDF Content */}
      <div ref={profileRef}>
        {/* Hero Banner */}
        <div className="pt-16">
          <HeroBanner
            name={personalInfo.fullName}
            tagline={preferences.bio || 'Seeking a loving and caring life partner.'}
            photoURL={photoURL}
          />
        </div>

        {/* Cards */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <PersonalInfoCard data={personalInfo} />
          <EducationCard data={educationInfo} />
          <FamilyCard data={familyInfo} />

          {/* Preferences Card */}
          {(preferences.partnerExpectations || preferences.hobbies || preferences.preferredLocation) && (
            <Card delay={0.4}>
              <Section icon={<Heart className="w-5 h-5" />} title="Preferences" accent="gold">
                <div className="space-y-4">
                  {preferences.partnerExpectations && (
                    <div>
                      <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-1">Partner Expectations</p>
                      <p className="text-gray-300 leading-relaxed">{preferences.partnerExpectations}</p>
                    </div>
                  )}
                  {preferences.hobbies && (
                    <div>
                      <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-1">Hobbies & Interests</p>
                      <p className="text-gray-300">{preferences.hobbies}</p>
                    </div>
                  )}
                  {preferences.preferredLocation && (
                    <div>
                      <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-1">Preferred Location</p>
                      <p className="text-gray-300">{preferences.preferredLocation}</p>
                    </div>
                  )}
                </div>
              </Section>
            </Card>
          )}

          {/* Contact Card */}
          {preferences.contactName && (
            <Card delay={0.5}>
              <Section icon={<MessageCircle className="w-5 h-5" />} title="Contact Information" accent="red">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-1">Contact Person</p>
                    <p className="text-white font-semibold">{preferences.contactName}</p>
                  </div>
                  {preferences.contactPhone && (
                    <div>
                      <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-1">Phone</p>
                      <a href={`tel:${preferences.contactPhone}`} className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
                        {preferences.contactPhone}
                      </a>
                    </div>
                  )}
                  {preferences.contactEmail && (
                    <div>
                      <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-1">Email</p>
                      <a href={`mailto:${preferences.contactEmail}`} className="text-yellow-400 hover:text-yellow-300 transition-colors">
                        {preferences.contactEmail}
                      </a>
                    </div>
                  )}
                </div>
              </Section>
            </Card>
          )}

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center py-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-700/40" />
              <span className="text-yellow-700 text-xl">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-700/40" />
            </div>
            <p className="text-gray-500 italic text-sm leading-relaxed max-w-md mx-auto">
              "Looking for an auspicious alliance built on mutual respect, love, and shared values."
            </p>
          </motion.div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-red-900/30 py-8 text-center glass print:hidden">
        <p className="text-yellow-700/50 text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>✦ BioData ✦</p>
        <p className="text-gray-700 text-xs mt-1">© {new Date().getFullYear()} BioData. Designed with elegance.</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
