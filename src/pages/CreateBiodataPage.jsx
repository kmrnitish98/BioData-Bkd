import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Upload, X, Image, Globe, Lock, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBiodata } from '../hooks/useBiodata';
import { useUpload } from '../hooks/useUpload';
import StepIndicator from '../components/ui/StepIndicator';
import Button from '../components/ui/Button';

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
};

const InputField = ({ label, name, register, errors, type = 'text', placeholder, required, options, as }) => {
  const fieldName = name.includes('.') ? name.split('.').pop() : name;
  const error = errors?.[fieldName];

  return (
    <div>
      <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {as === 'select' ? (
        <select
          {...register(name, { required: required ? `${label} is required` : false })}
          className="w-full px-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white focus:outline-none focus:border-yellow-700/50 transition-colors"
        >
          <option value="">Select...</option>
          {options?.map((opt) => (
            <option key={opt} value={opt} className="bg-[#1a0000]">{opt}</option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          {...register(name, { required: required ? `${label} is required` : false })}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-700/50 transition-colors resize-none"
        />
      ) : (
        <input
          {...register(name, { required: required ? `${label} is required` : false })}
          type={type}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-700/50 transition-colors"
        />
      )}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

// ─── Step Components ──────────────────────────────────────────────
const Step1 = ({ register, errors }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    <div className="sm:col-span-2">
      <InputField label="Full Name" name="personalInfo.fullName" register={register} errors={errors.personalInfo} required placeholder="e.g. Priya Kumari" />
    </div>
    <InputField label="Date of Birth" name="personalInfo.dob" type="date" register={register} errors={errors.personalInfo} required />
    <InputField label="Height" name="personalInfo.height" register={register} errors={errors.personalInfo} placeholder="e.g. 5'4&quot;" />
    <InputField label="Weight" name="personalInfo.weight" register={register} errors={errors.personalInfo} placeholder="e.g. 55 kg" />
    <InputField label="Marital Status" name="personalInfo.maritalStatus" as="select" register={register} errors={errors.personalInfo} required
      options={['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']} />
    <InputField label="Current City" name="personalInfo.city" register={register} errors={errors.personalInfo} placeholder="e.g. Patna, Bihar" />
    <InputField label="Religion" name="personalInfo.religion" register={register} errors={errors.personalInfo} placeholder="e.g. Hindu" />
    <InputField label="Caste" name="personalInfo.caste" register={register} errors={errors.personalInfo} placeholder="e.g. Brahmin" />
    <InputField label="Gotra" name="personalInfo.gotra" register={register} errors={errors.personalInfo} placeholder="e.g. Kashi" />
    <InputField label="Zodiac Sign" name="personalInfo.zodiac" register={register} errors={errors.personalInfo} placeholder="e.g. Virgo / Kanya" />
    <InputField label="Complexion" name="personalInfo.complexion" as="select" register={register} errors={errors.personalInfo}
      options={['Fair', 'Wheatish', 'Dusky', 'Dark']} />
    <InputField label="Mother Tongue" name="personalInfo.motherTongue" register={register} errors={errors.personalInfo} placeholder="e.g. Hindi" />
  </div>
);

const Step2 = ({ register, errors }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    <div className="sm:col-span-2">
      <InputField label="Highest Qualification" name="educationInfo.highestQualification" register={register} errors={errors.educationInfo} required placeholder="e.g. B.A Honors (Psychology)" />
    </div>
    <InputField label="College / University" name="educationInfo.college" register={register} errors={errors.educationInfo} placeholder="e.g. Rohtas Mahila College" />
    <InputField label="Passing Year" name="educationInfo.passingYear" register={register} errors={errors.educationInfo} placeholder="e.g. 2025" />
    <div className="sm:col-span-2">
      <InputField label="Additional Qualifications" name="educationInfo.additionalQualification" register={register} errors={errors.educationInfo} placeholder="Certifications, diplomas, etc." />
    </div>
    <div className="sm:col-span-2 border-t border-red-900/30 pt-5">
      <p className="text-yellow-600/60 text-xs uppercase tracking-widest font-medium mb-4">Professional Details (Optional)</p>
    </div>
    <InputField label="Occupation" name="educationInfo.occupation" register={register} errors={errors.educationInfo} placeholder="e.g. Software Engineer" />
    <InputField label="Employer / Company" name="educationInfo.employer" register={register} errors={errors.educationInfo} placeholder="e.g. TCS, Govt." />
    <InputField label="Annual Income" name="educationInfo.annualIncome" register={register} errors={errors.educationInfo} placeholder="e.g. 5-7 LPA" />
  </div>
);

const Step3 = ({ register, errors, siblings, setSiblings }) => {
  const addSibling = () => setSiblings([...siblings, { name: '', role: '' }]);
  const removeSibling = (i) => setSiblings(siblings.filter((_, idx) => idx !== i));
  const updateSibling = (i, field, value) => {
    const updated = [...siblings];
    updated[i][field] = value;
    setSiblings(updated);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Father's Name" name="familyInfo.fatherName" register={register} errors={errors.familyInfo} placeholder="Mr. Ramesh Kumar" />
        <InputField label="Father's Occupation" name="familyInfo.fatherOccupation" register={register} errors={errors.familyInfo} placeholder="e.g. Farmer, Business" />
        <InputField label="Mother's Name" name="familyInfo.motherName" register={register} errors={errors.familyInfo} placeholder="Mrs. Sunita Devi" />
        <InputField label="Mother's Occupation" name="familyInfo.motherOccupation" register={register} errors={errors.familyInfo} placeholder="e.g. Homemaker" />
        <InputField label="Native Place" name="familyInfo.nativePlace" register={register} errors={errors.familyInfo} placeholder="e.g. Sasaram, Bihar" />
        <InputField label="Family Type" name="familyInfo.familyType" as="select" register={register} errors={errors.familyInfo}
          options={['Joint Family', 'Nuclear Family', 'Extended Family']} />
        <InputField label="Family Status" name="familyInfo.familyStatus" as="select" register={register} errors={errors.familyInfo}
          options={['Upper Class', 'Upper Middle Class', 'Middle Class', 'Lower Middle Class']} />
      </div>

      {/* Siblings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-yellow-600/80 uppercase tracking-widest">Siblings</label>
          <button type="button" onClick={addSibling} className="text-yellow-600 hover:text-yellow-400 text-xs flex items-center gap-1 transition-colors">
            <PlusCircle className="w-4 h-4" /> Add Sibling
          </button>
        </div>
        <div className="space-y-3">
          {siblings.map((sib, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={sib.name}
                onChange={(e) => updateSibling(i, 'name', e.target.value)}
                placeholder="Name"
                className="flex-1 px-3 py-2.5 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-yellow-700/50"
              />
              <input
                type="text"
                value={sib.role}
                onChange={(e) => updateSibling(i, 'role', e.target.value)}
                placeholder="Role / Profession"
                className="flex-1 px-3 py-2.5 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-yellow-700/50"
              />
              <button type="button" onClick={() => removeSibling(i)} className="text-red-700 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Step4 = ({ register, errors }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    <div className="sm:col-span-2">
      <InputField label="Personal Bio / About" name="preferences.bio" as="textarea" register={register} errors={errors.preferences} placeholder="Write a brief personal bio..." />
    </div>
    <div className="sm:col-span-2">
      <InputField label="Partner Expectations" name="preferences.partnerExpectations" as="textarea" register={register} errors={errors.preferences} placeholder="Describe what you're looking for in a life partner..." />
    </div>
    <InputField label="Preferred Location" name="preferences.preferredLocation" register={register} errors={errors.preferences} placeholder="e.g. Bihar, UP, Any" />
    <InputField label="Hobbies & Interests" name="preferences.hobbies" register={register} errors={errors.preferences} placeholder="e.g. Reading, Cooking, Travel" />
    <InputField label="Contact Name" name="preferences.contactName" register={register} errors={errors.preferences} required placeholder="Primary contact person" />
    <InputField label="Contact Phone" name="preferences.contactPhone" type="tel" register={register} errors={errors.preferences} required placeholder="10-digit mobile number" />
    <InputField label="Contact Email" name="preferences.contactEmail" type="email" register={register} errors={errors.preferences} placeholder="Optional" />
  </div>
);

const Step5 = ({ photoPreview, setPhotoPreview, photoFile, setPhotoFile, isPublic, setIsPublic, uploadProgress, uploading }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* Photo Upload */}
      <div>
        <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-4">
          Profile Photo
        </label>
        <div className="flex flex-col items-center gap-6">
          {/* Preview */}
          <div className="relative">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-40 h-40 rounded-full object-cover border-4 border-yellow-600/40 shadow-2xl"
                />
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(''); setPhotoFile(null); }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-800 border border-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-red-950/40 border-2 border-dashed border-yellow-800/50 flex flex-col items-center justify-center gap-2">
                <Image className="w-10 h-10 text-yellow-800/60" />
                <span className="text-gray-600 text-xs">No photo</span>
              </div>
            )}
          </div>

          {/* Upload area */}
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-950/40 border border-yellow-800/30 text-yellow-600 hover:border-yellow-600/50 hover:text-yellow-400 transition-all text-sm font-medium">
              <Upload className="w-4 h-4" />
              {photoPreview ? 'Change Photo' : 'Upload Photo'}
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          {/* Progress */}
          {uploading && (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-red-950/60 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Public Toggle */}
      <div className="glass border border-yellow-900/20 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isPublic ? <Globe className="w-4 h-4 text-yellow-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
              <span className="font-medium text-white">{isPublic ? 'Public Profile' : 'Private Profile'}</span>
            </div>
            <p className="text-gray-500 text-sm">
              {isPublic
                ? 'Your biodata will appear in public listings and be shareable via link.'
                : 'Only people with the direct link can view your biodata.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${isPublic ? 'bg-yellow-600' : 'bg-red-950/60 border border-red-900/50'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <p className="text-center text-green-600/80 text-sm font-medium px-4">
        ✦ Almost done! Click "Save Biodata" to publish your premium biodata profile.
      </p>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────
const CreateBiodataPage = () => {
  const { currentUser } = useAuth();
  const { create, loading: saving } = useBiodata();
  const { upload, progress: uploadProgress, uploading } = useUpload();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [siblings, setSiblings] = useState([]);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [saveError, setSaveError] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ defaultValues: { personalInfo: {}, educationInfo: {}, familyInfo: {}, preferences: {} } });

  const goNext = async () => {
    const fieldsToValidate = {
      1: ['personalInfo.fullName', 'personalInfo.dob', 'personalInfo.maritalStatus'],
      2: ['educationInfo.highestQualification'],
      3: [],
      4: ['preferences.contactName', 'preferences.contactPhone'],
    };
    const valid = await trigger(fieldsToValidate[step] || []);
    if (!valid) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = async (formData) => {
    setSaveError('');
    try {
      let photoURL = '';

      // Helper: wraps a promise with a timeout
      const withTimeout = (ms, promise, label) =>
        new Promise((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error(`TIMEOUT:${label}`)),
            ms
          );
          promise
            .then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(timer));
        });

      if (photoFile && currentUser) {
        photoURL = await withTimeout(
          30000,
          upload(currentUser.uid, photoFile),
          'UPLOAD'
        );
      }

      const biodataId = await withTimeout(
        30000,
        create(currentUser.uid, {
          personalInfo: formData.personalInfo,
          educationInfo: formData.educationInfo,
          familyInfo: { ...formData.familyInfo, siblings },
          preferences: formData.preferences,
          photoURL,
          isPublic,
        }),
        'SAVE'
      );

      navigate(`/profile/${biodataId}`);
    } catch (err) {
      if (err.message?.startsWith('TIMEOUT')) {
        setSaveError(
          '⚠️ Request timed out. This is usually caused by a browser extension (ad-blocker, privacy shield, etc.) blocking Firebase. Please: 1) Disable extensions for this site, or 2) Try in an Incognito window without extensions, then retry.'
        );
      } else if (
        err.code === 'unavailable' ||
        err.code === 'auth/network-request-failed' ||
        err.message?.includes('network')
      ) {
        setSaveError(
          '🌐 Network error. Please check your internet connection and try again. If you have an ad-blocker enabled, try disabling it for this site.'
        );
      } else {
        setSaveError(
          `Failed to save: ${err.message || 'Unknown error'}. Check your Firebase configuration and try again.`
        );
      }
    }
  };

  const stepComponents = [
    <Step1 key={1} register={register} errors={errors} />,
    <Step2 key={2} register={register} errors={errors} />,
    <Step3 key={3} register={register} errors={errors} siblings={siblings} setSiblings={setSiblings} />,
    <Step4 key={4} register={register} errors={errors} />,
    <Step5
      key={5}
      photoPreview={photoPreview}
      setPhotoPreview={setPhotoPreview}
      photoFile={photoFile}
      setPhotoFile={setPhotoFile}
      isPublic={isPublic}
      setIsPublic={setIsPublic}
      uploadProgress={uploadProgress}
      uploading={uploading}
    />,
  ];

  const stepTitles = ['Personal Information', 'Education & Profession', 'Family Background', 'Preferences & Contact', 'Photo & Publish'];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#150000] to-[#0d0000] -z-10" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1
            className="text-3xl md:text-4xl font-light text-white mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Create Your <span className="text-yellow-400">Biodata</span>
          </h1>
          <p className="text-gray-600 text-sm">Fill in your details to create a beautiful, shareable marriage biodata</p>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-yellow-900/20">
          {/* Step Title */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Step {step}: {stepTitles[step - 1]}
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-yellow-800/40 via-yellow-700/20 to-transparent mt-2" />
          </div>

          {/* Animated Step Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative overflow-hidden min-h-[300px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {stepComponents[step - 1]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error */}
            {saveError && (
              <div className="mt-5 p-3 rounded-xl bg-red-950/60 border border-red-700/40 text-red-300 text-sm">
                {saveError}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-red-900/20">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={goPrev}
                disabled={step === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {step < TOTAL_STEPS ? (
                <Button type="button" variant="primary" size="md" onClick={goNext}>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  loading={saving || uploading}
                >
                  <Save className="w-4 h-4" />
                  Save Biodata
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBiodataPage;
