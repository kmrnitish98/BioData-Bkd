import { Users, User, Home, MapPin } from 'lucide-react';
import Card from '../ui/Card';
import Section from '../ui/Section';

const FamilyMember = ({ label, name, role }) => (
  <div className="flex flex-col gap-0.5 py-3 border-b border-red-900/20 last:border-0">
    <span className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium">{label}</span>
    <span className="text-white font-semibold text-base">{name}</span>
    {role && <span className="text-gray-400 text-sm">{role}</span>}
  </div>
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
      <Section icon={<Users className="w-5 h-5" />} title="Family Background" accent="gold">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
          {/* Left Column */}
          <div>
            {fatherName && (
              <FamilyMember label="Father's Name" name={fatherName} role={fatherOccupation} />
            )}
            {motherName && (
              <FamilyMember label="Mother's Name" name={motherName} role={motherOccupation} />
            )}
            {siblingList.map((sib, i) => (
              <FamilyMember
                key={i}
                label={`Sibling ${siblingList.length > 1 ? i + 1 : ''}`}
                name={sib.name}
                role={sib.role}
              />
            ))}
          </div>

          {/* Right Column */}
          <div>
            {nativePlace && (
              <div className="flex items-start gap-3 py-3 border-b border-red-900/20">
                <MapPin className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-0.5">Native Place</p>
                  <p className="text-white font-medium">{nativePlace}</p>
                </div>
              </div>
            )}
            {familyType && (
              <div className="flex items-start gap-3 py-3 border-b border-red-900/20">
                <Home className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-0.5">Family Type</p>
                  <p className="text-white font-medium">{familyType}</p>
                </div>
              </div>
            )}
            {familyStatus && (
              <div className="flex items-start gap-3 py-3">
                <User className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-medium mb-0.5">Family Status</p>
                  <p className="text-white font-medium">{familyStatus}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </Card>
  );
};

export default FamilyCard;
