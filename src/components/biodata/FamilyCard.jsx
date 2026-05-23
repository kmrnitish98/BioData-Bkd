import { motion } from 'framer-motion';
import { Users, User, Home, MapPin } from 'lucide-react';
import Card from '../ui/Card';
import Section from '../ui/Section';

const FamilyMember = ({ label, name, role, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="flex flex-col gap-0.5 py-3 border-b border-red-900/15 last:border-0 group"
  >
    <span className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium">{label}</span>
    <span className="text-white font-semibold text-sm sm:text-base">{name}</span>
    {role && <span className="text-gray-400 text-xs sm:text-sm">{role}</span>}
  </motion.div>
);

const FamilyCard = ({ data = {} }) => {
  const {
    fatherName,
    fatherOccupation,
    motherName,
    motherOccupation,
    siblings,
    nativePlace,
    familyType,
    familyStatus,
  } = data;

  const siblingList = Array.isArray(siblings)
    ? siblings
    : typeof siblings === 'string' && siblings
    ? [{ name: siblings, role: '' }]
    : [];

  return (
    <Card delay={0.3}>
      <Section icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />} title="Family Background" accent="gold">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-0">
          {/* Left Column */}
          <div>
            {fatherName && (
              <FamilyMember label="Father's Name" name={fatherName} role={fatherOccupation} index={0} />
            )}
            {motherName && (
              <FamilyMember label="Mother's Name" name={motherName} role={motherOccupation} index={1} />
            )}
            {siblingList.map((sib, i) => (
              <FamilyMember
                key={i}
                label={`Sibling ${siblingList.length > 1 ? i + 1 : ''}`}
                name={sib.name}
                role={sib.role}
                index={i + 2}
              />
            ))}
          </div>

          {/* Right Column */}
          <div>
            {nativePlace && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-start gap-3 py-3 border-b border-red-900/15"
              >
                <MapPin className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-0.5">Native Place</p>
                  <p className="text-white font-medium text-sm sm:text-base">{nativePlace}</p>
                </div>
              </motion.div>
            )}
            {familyType && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-start gap-3 py-3 border-b border-red-900/15"
              >
                <Home className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-0.5">Family Type</p>
                  <p className="text-white font-medium text-sm sm:text-base">{familyType}</p>
                </div>
              </motion.div>
            )}
            {familyStatus && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-start gap-3 py-3"
              >
                <User className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-yellow-600/70 uppercase tracking-[0.15em] sm:tracking-widest font-medium mb-0.5">Family Status</p>
                  <p className="text-white font-medium text-sm sm:text-base">{familyStatus}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Section>
    </Card>
  );
};

export default FamilyCard;
