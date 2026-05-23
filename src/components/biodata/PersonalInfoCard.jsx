import { Heart, Calendar, Ruler, Scale, MapPin, Star, Users } from 'lucide-react';
import Card from '../ui/Card';
import Section from '../ui/Section';
import IconText from '../ui/IconText';

const PersonalInfoCard = ({ data = {} }) => {
  const {
    fullName,
    dob,
    height,
    weight,
    maritalStatus,
    city,
    religion,
    caste,
    gotra,
    zodiac,
    complexion,
    motherTongue,
  } = data;

  return (
    <Card delay={0.1}>
      <Section icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5" />} title="Personal Information" accent="gold">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
          {fullName && <IconText icon={<Users className="w-4 h-4" />} label="Full Name" value={fullName} />}
          {dob && <IconText icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={dob} />}
          {height && <IconText icon={<Ruler className="w-4 h-4" />} label="Height" value={height} />}
          {weight && <IconText icon={<Scale className="w-4 h-4" />} label="Weight" value={weight} />}
          {maritalStatus && <IconText icon={<Heart className="w-4 h-4" />} label="Marital Status" value={maritalStatus} />}
          {city && <IconText icon={<MapPin className="w-4 h-4" />} label="Current City" value={city} />}
          {religion && <IconText icon={<Star className="w-4 h-4" />} label="Religion" value={religion} />}
          {caste && <IconText icon={<Star className="w-4 h-4" />} label="Caste" value={caste} />}
          {gotra && <IconText icon={<Star className="w-4 h-4" />} label="Gotra" value={gotra} />}
          {zodiac && <IconText icon={<Star className="w-4 h-4" />} label="Zodiac Sign" value={zodiac} />}
          {complexion && <IconText icon={<Star className="w-4 h-4" />} label="Complexion" value={complexion} />}
          {motherTongue && <IconText icon={<Star className="w-4 h-4" />} label="Mother Tongue" value={motherTongue} />}
        </div>
      </Section>
    </Card>
  );
};

export default PersonalInfoCard;
