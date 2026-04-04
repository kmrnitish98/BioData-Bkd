import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, GraduationCap, ExternalLink, Heart } from 'lucide-react';

const BiodataCard = ({ biodata }) => {
  const {
    id,
    personalInfo = {},
    educationInfo = {},
    photoURL,
  } = biodata;

  const name = personalInfo.fullName || 'Anonymous';
  const city = personalInfo.city || '';
  const dob = personalInfo.dob || '';
  const education = educationInfo.highestQualification || '';

  const initials = name
    .split(' ')
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
      whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(180, 0, 0, 0.3)' }}
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
    >
      {/* Photo Banner */}
      <div className="relative h-48 bg-gradient-to-br from-red-950 via-red-900 to-[#1a0000] overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #b8860b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b0000 0%, transparent 50%)' }}
        />
        {/* Photo or initials */}
        <div className="absolute inset-0 flex items-center justify-center">
          {photoURL ? (
            <img
              src={photoURL}
              alt={name}
              className="w-28 h-28 rounded-full object-cover border-4 border-yellow-600/40 shadow-xl"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-800 to-red-950 border-4 border-yellow-600/30 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-yellow-400" style={{ fontFamily: 'Playfair Display, serif' }}>
                {initials}
              </span>
            </div>
          )}
        </div>
        {/* Gradient fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#140000] to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name */}
        <h3
          className="text-xl font-bold text-white text-center mb-1 tracking-wide"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {name}
        </h3>

        {/* Gold divider */}
        <div className="flex justify-center mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        </div>

        {/* Info pills */}
        <div className="space-y-2 mb-4">
          {city && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
              <span className="truncate">{city}</span>
            </div>
          )}
          {dob && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
              <span>{dob}</span>
            </div>
          )}
          {education && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <GraduationCap className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
              <span className="truncate">{education}</span>
            </div>
          )}
        </div>

        {/* View Button */}
        <Link
          to={`/profile/${id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-red-900/60 to-red-800/60 border border-yellow-700/20 text-yellow-400 text-sm font-medium hover:border-yellow-600/40 hover:bg-red-800/60 transition-all group"
        >
          <Heart className="w-4 h-4 fill-yellow-400/20" />
          View Biodata
          <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
        </Link>
      </div>
    </motion.div>
  );
};

export default BiodataCard;
