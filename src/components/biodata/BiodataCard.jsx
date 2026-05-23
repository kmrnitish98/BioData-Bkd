import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, ExternalLink, Heart, Sparkles } from 'lucide-react';

// Calculate age from DOB string
const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate)) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age > 0 ? age : null;
};

const BiodataCard = ({ biodata }) => {
  const {
    _id,
    personalInfo = {},
    educationInfo = {},
    photoURL,
  } = biodata;

  const name = personalInfo.fullName || 'Anonymous';
  const city = personalInfo.city || '';
  const state = personalInfo.state || '';
  const dob = personalInfo.dob || '';
  const education = educationInfo.highestQualification || '';
  const religion = personalInfo.religion || '';
  const age = calculateAge(dob);

  const location = [city, state].filter(Boolean).join(', ');

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: 'linear-gradient(145deg, #1a0a00, #2a1200)',
        border: '1px solid rgba(212,160,23,0.35)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── Age Badge ── */}
      {age && (
        <div
          className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #d4a017, #f0c040)',
            color: '#1a0800',
            boxShadow: '0 2px 10px rgba(212,160,23,0.5)',
          }}
        >
          <Sparkles className="w-3 h-3" />
          {age} yrs
        </div>
      )}

      {/* ── Photo Banner with rich background ── */}
      <div className="relative h-44 overflow-hidden">
        {/* Layered decorative background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #5c0a0a 0%, #8b1a1a 40%, #3d0808 100%)',
        }} />

        {/* Mandala / geometric SVG pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          {/* Large circle rings */}
          <circle cx="50%" cy="50%" r="60" fill="none" stroke="#f0c040" strokeWidth="0.8" />
          <circle cx="50%" cy="50%" r="80" fill="none" stroke="#f0c040" strokeWidth="0.5" />
          <circle cx="50%" cy="50%" r="100" fill="none" stroke="#f0c040" strokeWidth="0.3" />
          {/* Petal pattern */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="50%" y1="50%"
              x2={`${50 + 60 * Math.cos((i * 30 * Math.PI) / 180)}%`}
              y2={`${50 + 60 * Math.sin((i * 30 * Math.PI) / 180) * 2.5}%`}
              stroke="#f0c040" strokeWidth="0.4"
            />
          ))}
          {/* Corner ornaments */}
          <circle cx="10%" cy="15%" r="18" fill="none" stroke="#d4a017" strokeWidth="0.6" />
          <circle cx="90%" cy="15%" r="18" fill="none" stroke="#d4a017" strokeWidth="0.6" />
          <circle cx="10%" cy="85%" r="18" fill="none" stroke="#d4a017" strokeWidth="0.6" />
          <circle cx="90%" cy="85%" r="18" fill="none" stroke="#d4a017" strokeWidth="0.6" />
        </svg>

        {/* Radial glow spots */}
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8b0000 0%, transparent 70%)' }} />

        {/* Left-side decorative strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: 'linear-gradient(to bottom, #d4a017, #8b0000, #d4a017)' }} />

        {/* Photo or initials — centred */}
        <div className="absolute inset-0 flex items-center justify-center">
          {photoURL ? (
            <div className="relative">
              {/* Glowing ring around photo */}
              <div className="absolute -inset-1.5 rounded-xl opacity-60 blur-sm"
                style={{ background: 'linear-gradient(135deg, #d4a017, #8b0000)' }} />
              <img
                src={photoURL}
                alt={name}
                className="relative w-24 h-32 rounded-xl object-cover"
                style={{ border: '2px solid rgba(212,160,23,0.7)' }}
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-xl opacity-60 blur-sm"
                style={{ background: 'linear-gradient(135deg, #d4a017, #8b0000)' }} />
              <div
                className="relative w-24 h-32 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #5c0a0a, #2a0505)',
                  border: '2px solid rgba(212,160,23,0.5)',
                }}
              >
                <span className="text-3xl font-bold" style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#f0c040',
                  textShadow: '0 0 20px rgba(240,192,64,0.6)',
                }}>
                  {initials}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12"
          style={{ background: 'linear-gradient(to top, #1a0a00, transparent)' }} />
      </div>

      {/* ── Card Content ── */}
      <div className="px-4 pt-3 pb-4">
        {/* Name */}
        <h3
          className="text-base font-bold text-white text-center tracking-wide truncate"
          style={{ fontFamily: 'Cormorant Garamond, serif', textShadow: '0 0 12px rgba(212,160,23,0.3)' }}
        >
          {name}
        </h3>

        {/* Gold ornament divider */}
        <div className="flex items-center justify-center gap-2 my-2">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(212,160,23,0.6))' }} />
          <Heart className="w-3 h-3 fill-current" style={{ color: '#d4a017' }} />
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(212,160,23,0.6))' }} />
        </div>

        {/* Info rows */}
        <div className="space-y-1.5 mb-3">
          {location && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#d4a017' }} />
              <span className="truncate">{location}</span>
            </div>
          )}
          {age && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: '#d4a017' }} />
              <span>{age} years old</span>
            </div>
          )}
          {education && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <GraduationCap className="w-3 h-3 flex-shrink-0" style={{ color: '#d4a017' }} />
              <span className="truncate">{education}</span>
            </div>
          )}
          {religion && (
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: 'rgba(212,160,23,0.15)',
                  border: '1px solid rgba(212,160,23,0.3)',
                  color: '#f0c040',
                }}>
                {religion}
              </span>
            </div>
          )}
        </div>

        {/* View Button */}
        <Link
          to={`/profile/${_id}`}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold transition-all group-hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(139,0,0,0.6), rgba(90,0,0,0.8))',
            border: '1px solid rgba(212,160,23,0.4)',
            color: '#f0c040',
          }}
        >
          <Heart className="w-3.5 h-3.5 fill-current opacity-70" />
          View Biodata
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </Link>
      </div>
    </motion.div>
  );
};

export default BiodataCard;
