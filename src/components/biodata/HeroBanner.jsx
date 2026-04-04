import { motion } from 'framer-motion';

const HeroBanner = ({ name, tagline, photoURL }) => {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden flex items-end">
      {/* Blurred background */}
      <div className="absolute inset-0">
        {photoURL ? (
          <img
            src={photoURL}
            alt="background"
            className="w-full h-full object-cover scale-110 blur-lg opacity-30"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-950 via-[#2a0000] to-[#0d0000]" />
        )}
        {/* Decorative radial */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 0%, rgba(184, 134, 11, 0.2) 0%, transparent 60%),' +
              'radial-gradient(ellipse at 50% 100%, rgba(139, 0, 0, 0.6) 0%, transparent 50%)',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#0a0000] via-[#0a0000]/60 to-transparent" />
      </div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full pb-16 pt-24">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Profile Photo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6"
          >
            {photoURL ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500 to-red-700 blur-md opacity-40 scale-110" />
                <img
                  src={photoURL}
                  alt={name}
                  className="relative w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-yellow-600/50 shadow-2xl"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-600 to-red-800 blur-md opacity-40 scale-110" />
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-red-900 to-[#1a0000] border-4 border-yellow-600/40 flex items-center justify-center shadow-2xl">
                  <span className="text-5xl font-bold text-yellow-400" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {initials}
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Ornamental lines */}
          <div className="flex items-center gap-3 mb-4 w-full max-w-xs justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-700/60" />
            <span className="text-yellow-600 text-lg">❧</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-700/60" />
          </div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] text-white uppercase mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {name || 'Your Name'}
          </motion.h1>

          {/* Tagline */}
          {tagline && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-yellow-200/70 font-light tracking-wide max-w-xl italic"
            >
              "{tagline}"
            </motion.p>
          )}

          {/* Bottom ornamental */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 h-px w-32 bg-gradient-to-r from-transparent via-yellow-600 to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
