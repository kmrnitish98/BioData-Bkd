import { GraduationCap, Briefcase, Building, BookOpen } from 'lucide-react';
import Card from '../ui/Card';
import Section from '../ui/Section';
import IconText from '../ui/IconText';

const EducationCard = ({ data = {} }) => {
  const {
    highestQualification,
    college,
    passingYear,
    occupation,
    employer,
    annualIncome,
    additionalQualification,
  } = data;

  return (
    <Card delay={0.2}>
      <Section icon={<BookOpen className="w-5 h-5" />} title="Education & Profession" accent="gold">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-yellow-600/80 uppercase tracking-widest mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Academic Background
            </h3>
            <div className="pl-2 border-l border-yellow-900/40 space-y-2">
              {highestQualification && (
                <IconText icon={<GraduationCap className="w-4 h-4" />} label="Qualification" value={highestQualification} />
              )}
              {college && (
                <IconText icon={<Building className="w-4 h-4" />} label="College / University" value={college} />
              )}
              {passingYear && (
                <IconText icon={<BookOpen className="w-4 h-4" />} label="Passing Year" value={passingYear} />
              )}
              {additionalQualification && (
                <IconText icon={<BookOpen className="w-4 h-4" />} label="Additional" value={additionalQualification} />
              )}
            </div>
          </div>

          {/* Profession */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-yellow-600/80 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Professional Details
            </h3>
            <div className="pl-2 border-l border-yellow-900/40 space-y-2">
              {occupation ? (
                <>
                  {occupation && (
                    <IconText icon={<Briefcase className="w-4 h-4" />} label="Occupation" value={occupation} />
                  )}
                  {employer && (
                    <IconText icon={<Building className="w-4 h-4" />} label="Employer" value={employer} />
                  )}
                  {annualIncome && (
                    <IconText icon={<Briefcase className="w-4 h-4" />} label="Annual Income" value={annualIncome} />
                  )}
                </>
              ) : (
                <p className="text-gray-600 text-sm italic pl-4">No profession details added.</p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </Card>
  );
};

export default EducationCard;
