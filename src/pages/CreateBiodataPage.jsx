import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Save, X, Globe, Lock,
  PlusCircle, Trash2, Crown, UploadCloud, Maximize2, Minus, Plus, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBiodata } from '../hooks/useBiodata';
import { useUpload } from '../hooks/useUpload';
import { useLang } from '../context/LanguageContext';
import StepIndicator from '../components/ui/StepIndicator';
import Button from '../components/ui/Button';
import RadioCard from '../components/ui/RadioCard';
import ChipSelector from '../components/ui/ChipSelector';
import AITextarea from '../components/ui/AITextarea';
import LanguageToggle from '../components/ui/LanguageToggle';

const TOTAL_STEPS = 5;
const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
};

// ─── Shared InputField ────────────────────────────────────────────────
const InputField = ({ label, name, register, errors, type = 'text', placeholder, required, options, as, lang }) => {
  const fieldName = name.includes('.') ? name.split('.').pop() : name;
  const error = errors?.[fieldName];
  const isHindi = lang === 'hi';
  const fontStyle = isHindi ? { fontFamily: "'Noto Sans Devanagari', 'Mukta', sans-serif" } : {};

  const baseClass = 'w-full px-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-700/50 transition-colors text-sm';

  return (
    <div>
      <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2" style={fontStyle}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {as === 'select' ? (
        <select
          {...register(name, { required: required ? `${label} is required` : false })}
          className={baseClass}
        >
          <option value="">Select...</option>
          {options?.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val} className="bg-[#1a0000]" style={fontStyle}>
                {lbl}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          {...register(name, { required: required ? `${label} is required` : false })}
          type={type}
          placeholder={placeholder}
          className={baseClass}
          style={fontStyle}
        />
      )}
      {error && <p className="text-red-400 text-xs mt-1" style={fontStyle}>{error.message}</p>}
    </div>
  );
};

// ─── Number Stepper ───────────────────────────────────────────────────
const NumberStepper = ({ label, value, onChange, min = 0, max = 15 }) => (
  <div>
    <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">{label}</label>
    <div className="flex items-center gap-3">
      <button type="button" className="stepper-btn" onClick={() => onChange(Math.max(min, value - 1))}>
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center text-white font-semibold text-lg tabular-nums">{value}</span>
      <button type="button" className="stepper-btn" onClick={() => onChange(Math.min(max, value + 1))}>
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

// ─── SectionHeader ────────────────────────────────────────────────────
const SectionHeader = ({ title }) => (
  <div className="sm:col-span-2 flex items-center gap-3 pt-2">
    <p className="section-label whitespace-nowrap">{title}</p>
    <div className="flex-1 h-px bg-gradient-to-r from-yellow-800/40 to-transparent" />
  </div>
);

// ─── Lightbox ─────────────────────────────────────────────────────────
const Lightbox = ({ image, onClose }) => {
  if (!image) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
          <X className="w-8 h-8" />
        </button>
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          src={image.preview}
          alt="Preview"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// ─── STEP 1 — Personal Information ───────────────────────────────────
const Step1 = ({ register, errors, watch, setValue, t, lang, languagesKnown, setLanguagesKnown }) => {
  const maritalOptions = [
    { value: 'Never Married', label: t('neverMarried') },
    { value: 'Divorced', label: t('divorced') },
    { value: 'Widowed', label: t('widowed') },
    { value: 'Awaiting Divorce', label: t('awaitingDivorce') },
  ];
  const complexionOptions = [
    { value: 'Fair', label: t('fair') },
    { value: 'Wheatish', label: t('wheatish') },
    { value: 'Dusky', label: t('dusky') },
    { value: 'Dark', label: t('dark') },
  ];
  const manglikOptions = [
    { value: 'Yes', label: t('yes') },
    { value: 'No', label: t('no') },
    { value: 'Partial', label: t('partial') },
  ];
  const dietOptions = [
    { value: 'Vegetarian', label: t('vegetarian') },
    { value: 'Non-Veg', label: t('nonVeg') },
    { value: 'Jain', label: t('jain') },
    { value: 'Vegan', label: t('vegan') },
  ];
  const smokingOptions = [
    { value: 'No', label: t('no') },
    { value: 'Occasionally', label: t('occasionally') },
    { value: 'Yes', label: t('yes') },
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const disabilityOptions = ['None', 'Physical', 'Visual', 'Hearing', 'Other'];
  const createdByOptions = ['Self', 'Parent', 'Sibling', 'Relative', 'Friend'];
  const languageChips = ['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi', 'Kannada', 'Malayalam', 'Odia', 'Urdu'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* Full Name */}
      <div className="sm:col-span-2">
        <InputField label={t('fullName')} name="personalInfo.fullName" register={register}
          errors={errors.personalInfo} required placeholder={t('fullNamePlaceholder')} lang={lang} />
      </div>

      {/* DOB + Height + Weight */}
      <InputField label={t('dob')} name="personalInfo.dob" type="date" register={register}
        errors={errors.personalInfo} required lang={lang} />
      <InputField label={t('height')} name="personalInfo.height" register={register}
        errors={errors.personalInfo} placeholder={t('heightPlaceholder')} lang={lang} />
      <InputField label={t('weight')} name="personalInfo.weight" register={register}
        errors={errors.personalInfo} placeholder={t('weightPlaceholder')} lang={lang} />

      {/* Blood Group */}
      <InputField label={t('bloodGroup')} name="personalInfo.bloodGroup" as="select"
        register={register} errors={errors.personalInfo} options={bloodGroups} lang={lang} />

      {/* Marital Status — RadioCard */}
      <div className="sm:col-span-2">
        <RadioCard
          label={t('maritalStatus') + ' *'}
          options={maritalOptions}
          value={watch('personalInfo.maritalStatus')}
          onChange={(v) => setValue('personalInfo.maritalStatus', v)}
          columns={4}
        />
      </div>

      {/* Complexion — RadioCard */}
      <div className="sm:col-span-2">
        <RadioCard
          label={t('complexion')}
          options={complexionOptions}
          value={watch('personalInfo.complexion')}
          onChange={(v) => setValue('personalInfo.complexion', v)}
          columns={4}
        />
      </div>

      {/* Manglik — RadioCard */}
      <div className="sm:col-span-2">
        <RadioCard
          label={t('manglikStatus')}
          options={manglikOptions}
          value={watch('personalInfo.manglikStatus')}
          onChange={(v) => setValue('personalInfo.manglikStatus', v)}
          columns={3}
        />
      </div>

      {/* Diet — RadioCard */}
      <div className="sm:col-span-2">
        <RadioCard
          label={t('dietPreference')}
          options={dietOptions}
          value={watch('personalInfo.dietPreference')}
          onChange={(v) => setValue('personalInfo.dietPreference', v)}
          columns={4}
        />
      </div>

      {/* Smoking */}
      <div>
        <RadioCard
          label={t('smoking')}
          options={smokingOptions}
          value={watch('personalInfo.smoking')}
          onChange={(v) => setValue('personalInfo.smoking', v)}
          columns={3}
        />
      </div>

      {/* Drinking */}
      <div>
        <RadioCard
          label={t('drinking')}
          options={smokingOptions}
          value={watch('personalInfo.drinking')}
          onChange={(v) => setValue('personalInfo.drinking', v)}
          columns={3}
        />
      </div>

      {/* City + Religion */}
      <InputField label={t('city')} name="personalInfo.city" register={register}
        errors={errors.personalInfo} placeholder={t('cityPlaceholder')} lang={lang} />
      <InputField label={t('religion')} name="personalInfo.religion" register={register}
        errors={errors.personalInfo} placeholder={t('religionPlaceholder')} lang={lang} />

      {/* Caste + Gotra */}
      <InputField label={t('caste')} name="personalInfo.caste" register={register}
        errors={errors.personalInfo} placeholder={t('castePlaceholder')} lang={lang} />
      <InputField label={t('gotra')} name="personalInfo.gotra" register={register}
        errors={errors.personalInfo} placeholder={t('gotraPlaceholder')} lang={lang} />

      {/* Zodiac + Mother Tongue */}
      <InputField label={t('zodiac')} name="personalInfo.zodiac" register={register}
        errors={errors.personalInfo} placeholder={t('zodiacPlaceholder')} lang={lang} />
      <InputField label={t('motherTongue')} name="personalInfo.motherTongue" register={register}
        errors={errors.personalInfo} placeholder={t('motherTonguePlaceholder')} lang={lang} />

      {/* Disability + Profile Created By */}
      <InputField label={t('disability')} name="personalInfo.disability" as="select"
        register={register} errors={errors.personalInfo} options={disabilityOptions} lang={lang} />
      <InputField label={t('profileCreatedBy')} name="personalInfo.profileCreatedBy" as="select"
        register={register} errors={errors.personalInfo} options={createdByOptions} lang={lang} />

      {/* Languages Known */}
      <div className="sm:col-span-2">
        <ChipSelector
          label={t('languagesKnown')}
          options={languageChips}
          value={languagesKnown}
          onChange={setLanguagesKnown}
          placeholder={lang === 'hi' ? 'भाषा लिखें...' : 'Type a language...'}
        />
      </div>
    </div>
  );
};

// ─── STEP 2 — Education & Profession ─────────────────────────────────
const Step2 = ({ register, errors, t, lang, careerDescription, setCareerDescription }) => {
  const incomeOptions = [
    'Below 2 LPA', '2–5 LPA', '5–7 LPA', '7–10 LPA', '10–15 LPA',
    '15–25 LPA', '25–50 LPA', '50+ LPA', 'Not Disclosed',
  ];
  const occupationTypeOptions = ['Government', 'Private', 'Business / Self-Employed', 'Freelancer', 'Defence', 'Not Working'];
  const employmentTypeOptions = ['Full-Time', 'Part-Time', 'Contract', 'Consultant'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* Education Section */}
      <SectionHeader title={lang === 'hi' ? 'शैक्षणिक विवरण' : 'Educational Details'} />

      <div className="sm:col-span-2">
        <InputField label={t('highestQualification')} name="educationInfo.highestQualification"
          register={register} errors={errors.educationInfo} required
          placeholder={t('highestQualificationPlaceholder')} lang={lang} />
      </div>
      <InputField label={t('college')} name="educationInfo.college" register={register}
        errors={errors.educationInfo} placeholder={t('collegePlaceholder')} lang={lang} />
      <InputField label={t('passingYear')} name="educationInfo.passingYear" register={register}
        errors={errors.educationInfo} placeholder={t('passingYearPlaceholder')} lang={lang} />
      <div className="sm:col-span-2">
        <InputField label={t('additionalQualification')} name="educationInfo.additionalQualification"
          register={register} errors={errors.educationInfo}
          placeholder={t('additionalQualificationPlaceholder')} lang={lang} />
      </div>

      {/* Professional Section */}
      <SectionHeader title={`${t('professionalDetails')} ${t('professionalDetailsOptional')}`} />

      <InputField label={t('occupation')} name="educationInfo.occupation" register={register}
        errors={errors.educationInfo} placeholder={t('occupationPlaceholder')} lang={lang} />
      <InputField label={t('employer')} name="educationInfo.employer" register={register}
        errors={errors.educationInfo} placeholder={t('employerPlaceholder')} lang={lang} />
      <InputField label={t('occupationType')} name="educationInfo.occupationType" as="select"
        register={register} errors={errors.educationInfo} options={occupationTypeOptions} lang={lang} />
      <InputField label={t('employmentType')} name="educationInfo.employmentType" as="select"
        register={register} errors={errors.educationInfo} options={employmentTypeOptions} lang={lang} />
      <InputField label={t('workLocation')} name="educationInfo.workLocation" register={register}
        errors={errors.educationInfo} placeholder={t('workLocationPlaceholder')} lang={lang} />
      <InputField label={t('annualIncome')} name="educationInfo.annualIncome" as="select"
        register={register} errors={errors.educationInfo} options={incomeOptions} lang={lang} />

      {/* AI Career Description */}
      <div className="sm:col-span-2">
        <AITextarea
          label={t('careerDescription')}
          name="careerDescription"
          value={careerDescription}
          onChange={setCareerDescription}
          placeholder={t('careerDescriptionPlaceholder')}
          field="careerSummary"
          rows={3}
        />
      </div>
    </div>
  );
};

// ─── STEP 3 — Family Background ───────────────────────────────────────
const Step3 = ({
  register, errors, t, lang, siblings, setSiblings,
  brothersCount, setBrothersCount, sistersCount, setSistersCount,
  marriedSiblings, setMarriedSiblings, familyValues, setFamilyValues,
  familyDescription, setFamilyDescription,
}) => {
  const familyTypeOptions = ['Joint Family', 'Nuclear Family', 'Extended Family'];
  const familyStatusOptions = ['Upper Class', 'Upper Middle Class', 'Middle Class', 'Lower Middle Class'];
  const familyIncomeOptions = ['Below 2 LPA', '2–5 LPA', '5–10 LPA', '10–20 LPA', '20–50 LPA', '50+ LPA'];
  const familyValuesChips = ['Traditional', 'Modern', 'Religious', 'Liberal', 'Balanced', 'Conservative'];

  const addSibling = () => setSiblings([...siblings, { name: '', role: '', married: false }]);
  const removeSibling = (i) => setSiblings(siblings.filter((_, idx) => idx !== i));
  const updateSibling = (i, field, value) => {
    const updated = [...siblings];
    updated[i][field] = value;
    setSiblings(updated);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Parents */}
        <SectionHeader title={lang === 'hi' ? 'माता-पिता' : 'Parents'} />
        <InputField label={t('fatherName')} name="familyInfo.fatherName" register={register}
          errors={errors.familyInfo} placeholder={t('fatherNamePlaceholder')} lang={lang} />
        <InputField label={t('fatherOccupation')} name="familyInfo.fatherOccupation" register={register}
          errors={errors.familyInfo} placeholder={t('fatherOccupationPlaceholder')} lang={lang} />
        <InputField label={t('motherName')} name="familyInfo.motherName" register={register}
          errors={errors.familyInfo} placeholder={t('motherNamePlaceholder')} lang={lang} />
        <InputField label={t('motherOccupation')} name="familyInfo.motherOccupation" register={register}
          errors={errors.familyInfo} placeholder={t('motherOccupationPlaceholder')} lang={lang} />

        {/* Family Details */}
        <SectionHeader title={lang === 'hi' ? 'पारिवारिक विवरण' : 'Family Details'} />
        <InputField label={t('nativePlace')} name="familyInfo.nativePlace" register={register}
          errors={errors.familyInfo} placeholder={t('nativePlaceholder')} lang={lang} />
        <InputField label={t('familyType')} name="familyInfo.familyType" as="select"
          register={register} errors={errors.familyInfo} options={familyTypeOptions} lang={lang} />
        <InputField label={t('familyStatus')} name="familyInfo.familyStatus" as="select"
          register={register} errors={errors.familyInfo} options={familyStatusOptions} lang={lang} />
        <InputField label={t('familyIncome')} name="familyInfo.familyIncome" as="select"
          register={register} errors={errors.familyInfo} options={familyIncomeOptions} lang={lang} />

        {/* Sibling Counts */}
        <SectionHeader title={lang === 'hi' ? 'भाई-बहन' : 'Siblings'} />
        <NumberStepper label={t('brothers')} value={brothersCount} onChange={setBrothersCount} />
        <NumberStepper label={t('sisters')} value={sistersCount} onChange={setSistersCount} />
        <NumberStepper label={t('marriedSiblings')} value={marriedSiblings} onChange={setMarriedSiblings} />

        {/* Family Values */}
        <div className="sm:col-span-2">
          <ChipSelector
            label={t('familyValues')}
            options={familyValuesChips}
            value={familyValues}
            onChange={setFamilyValues}
            placeholder={lang === 'hi' ? 'मूल्य लिखें...' : 'Type a value...'}
          />
        </div>
      </div>

      {/* Dynamic Siblings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-yellow-600/80 uppercase tracking-widest">
            {t('siblings')} ({lang === 'hi' ? 'विस्तृत' : 'Detailed'})
          </label>
          <button type="button" onClick={addSibling}
            className="text-yellow-600 hover:text-yellow-400 text-xs flex items-center gap-1 transition-colors">
            <PlusCircle className="w-4 h-4" /> {t('addSibling')}
          </button>
        </div>
        <div className="space-y-2.5">
          {siblings.map((sib, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text" value={sib.name}
                onChange={(e) => updateSibling(i, 'name', e.target.value)}
                placeholder={t('siblingName')}
                className="flex-1 px-3 py-2.5 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-700/50"
              />
              <input
                type="text" value={sib.role}
                onChange={(e) => updateSibling(i, 'role', e.target.value)}
                placeholder={t('siblingRole')}
                className="flex-1 px-3 py-2.5 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-700/50"
              />
              <button
                type="button"
                onClick={() => updateSibling(i, 'married', !sib.married)}
                title={t('siblingMarried')}
                className={`flex-shrink-0 w-9 h-9 rounded-xl border text-xs font-bold transition-all ${
                  sib.married
                    ? 'bg-yellow-600/20 border-yellow-500/60 text-yellow-400'
                    : 'bg-red-950/30 border-red-900/40 text-gray-600 hover:text-gray-300'
                }`}
              >
                {sib.married ? '✓' : 'M'}
              </button>
              <button type="button" onClick={() => removeSibling(i)} className="text-red-700 hover:text-red-400 transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Family Description — AI Assisted */}
      <AITextarea
        label={t('familyDescription')}
        value={familyDescription}
        onChange={setFamilyDescription}
        placeholder={t('familyDescriptionPlaceholder')}
        field="familyDescription"
        rows={3}
      />
    </div>
  );
};

// ─── STEP 4 — Preferences & Contact ──────────────────────────────────
const Step4 = ({
  register, errors, t, lang,
  aboutMe, setAboutMe, partnerExpectations, setPartnerExpectations,
  hobbies, setHobbies, preferredEducation, setPreferredEducation,
  preferredProfession, setPreferredProfession, preferredCity, setPreferredCity,
}) => {
  const religionOptions = ['Any', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'];
  const educationChips = ['10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'PhD', 'MBBS', 'B.Tech', 'MBA', 'CA', 'LLB'];
  const professionChips = ['Doctor', 'Engineer', 'Teacher', 'Lawyer', 'Business', 'Government Job', 'IT Professional', 'Banking', 'Army', 'Police', 'Nurse', 'Accountant'];
  const cityChips = ['Delhi', 'Mumbai', 'Patna', 'Lucknow', 'Varanasi', 'Jaipur', 'Pune', 'Bangalore', 'Hyderabad', 'Kolkata'];
  const hobbiesChips = ['Reading', 'Cooking', 'Travel', 'Music', 'Dancing', 'Painting', 'Photography', 'Yoga', 'Gardening', 'Sports', 'Movies', 'Meditation'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

      {/* About Me — AI Textarea */}
      <div className="sm:col-span-2">
        <AITextarea
          label={t('aboutMe')}
          value={aboutMe}
          onChange={setAboutMe}
          placeholder={t('aboutMePlaceholder')}
          field="aboutMe"
          rows={4}
        />
      </div>

      {/* Hobbies */}
      <div className="sm:col-span-2">
        <ChipSelector
          label={t('hobbies')}
          options={hobbiesChips}
          value={hobbies}
          onChange={setHobbies}
          placeholder={lang === 'hi' ? 'शौक लिखें...' : 'Type a hobby...'}
        />
      </div>

      {/* Partner Preferences Section */}
      <SectionHeader title={t('partnerPreferences')} />

      {/* Partner Expectations — AI Textarea */}
      <div className="sm:col-span-2">
        <AITextarea
          label={t('partnerExpectations')}
          value={partnerExpectations}
          onChange={setPartnerExpectations}
          placeholder={t('partnerExpectationsPlaceholder')}
          field="partnerExpectations"
          rows={4}
        />
      </div>

      {/* Age Range */}
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
          {t('preferredAgeRange')}
        </label>
        <div className="flex items-center gap-3">
          <input
            {...register('preferences.preferredAgeMin')}
            type="number"
            placeholder={t('ageMin')}
            min="18"
            max="70"
            className="w-full px-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-700/50 transition-colors text-sm"
          />
          <span className="text-gray-500 text-sm flex-shrink-0">{t('to')}</span>
          <input
            {...register('preferences.preferredAgeMax')}
            type="number"
            placeholder={t('ageMax')}
            min="18"
            max="70"
            className="w-full px-4 py-3 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-700/50 transition-colors text-sm"
          />
          <span className="text-gray-400 text-xs flex-shrink-0">{t('years')}</span>
        </div>
      </div>

      {/* Preferred Education */}
      <div className="sm:col-span-2">
        <ChipSelector
          label={t('preferredEducation')}
          options={educationChips}
          value={preferredEducation}
          onChange={setPreferredEducation}
          placeholder={lang === 'hi' ? 'शिक्षा लिखें...' : 'Type education...'}
        />
      </div>

      {/* Preferred Profession */}
      <div className="sm:col-span-2">
        <ChipSelector
          label={t('preferredProfession')}
          options={professionChips}
          value={preferredProfession}
          onChange={setPreferredProfession}
          placeholder={lang === 'hi' ? 'व्यवसाय लिखें...' : 'Type profession...'}
        />
      </div>

      {/* Preferred City */}
      <div className="sm:col-span-2">
        <ChipSelector
          label={t('preferredCity')}
          options={cityChips}
          value={preferredCity}
          onChange={setPreferredCity}
          placeholder={lang === 'hi' ? 'शहर लिखें...' : 'Type a city...'}
        />
      </div>

      {/* Preferred Religion + Caste */}
      <InputField label={t('preferredReligion')} name="preferences.preferredReligion" as="select"
        register={register} errors={errors.preferences} options={religionOptions} lang={lang} />
      <InputField label={t('preferredCaste')} name="preferences.preferredCaste" register={register}
        errors={errors.preferences} placeholder={t('preferredCastePlaceholder')} lang={lang} />

      {/* Preferred Location */}
      <div className="sm:col-span-2">
        <InputField label={t('preferredLocation')} name="preferences.preferredLocation"
          register={register} errors={errors.preferences}
          placeholder={t('preferredLocationPlaceholder')} lang={lang} />
      </div>

      {/* Contact Section */}
      <SectionHeader title={t('contactSection')} />

      <InputField label={t('contactName')} name="preferences.contactName" register={register}
        errors={errors.preferences} required placeholder={t('contactNamePlaceholder')} lang={lang} />
      <InputField label={t('contactPhone')} name="preferences.contactPhone" type="tel"
        register={register} errors={errors.preferences} required
        placeholder={t('contactPhonePlaceholder')} lang={lang} />
      <div className="sm:col-span-2">
        <InputField label={t('contactEmail')} name="preferences.contactEmail" type="email"
          register={register} errors={errors.preferences}
          placeholder={t('contactEmailPlaceholder')} lang={lang} />
      </div>
    </div>
  );
};

// ─── STEP 5 — Gallery & Publish ───────────────────────────────────────
const Step5 = ({ images, setImages, coverId, setCoverId, isPublic, setIsPublic, uploadProgress, uploading, setUploadError, t }) => {
  const [dragActive, setDragActive] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const fileInputRef = useRef(null);

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) { setUploadError('Only image files are allowed.'); return false; }
      if (file.size > MAX_FILE_SIZE) { setUploadError('Image size must be less than 5MB.'); return false; }
      return true;
    });
    if (images.length + validFiles.length > MAX_IMAGES) {
      setUploadError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }
    setUploadError('');
    const newImages = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => {
      const updated = [...prev, ...newImages];
      if (updated.length > 0 && !coverId) setCoverId(updated[0].id);
      return updated;
    });
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFiles(e.dataTransfer.files);
  };

  const removeImage = (id, e) => {
    e.stopPropagation();
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      if (coverId === id) setCoverId(updated.length > 0 ? updated[0].id : null);
      return updated;
    });
  };

  const moveImage = (index, direction, e) => {
    e.stopPropagation();
    if (index + direction < 0 || index + direction >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      [updated[index], updated[index + direction]] = [updated[index + direction], updated[index]];
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-medium text-yellow-600/80 uppercase tracking-widest">
            {t('profileGallery')} ({images.length}/{MAX_IMAGES})
          </label>
          <span className="text-[10px] text-gray-500">{t('jpgPngLimit')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`relative group aspect-[3/4] rounded-2xl overflow-hidden glass-premium border-2 transition-all duration-300 ${
                  coverId === img.id ? 'border-yellow-500 shadow-gold-glow' : 'border-transparent hover:border-yellow-700/50'
                }`}
                onClick={() => setLightboxImage(img)}
              >
                <img src={img.preview} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 cursor-pointer">
                  <div className="flex justify-between items-start">
                    {coverId === img.id ? (
                      <div className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Crown className="w-3 h-3" /> {t('cover')}
                      </div>
                    ) : (
                      <button type="button" onClick={(e) => { e.stopPropagation(); setCoverId(img.id); }}
                        className="bg-black/50 backdrop-blur text-white/80 hover:text-yellow-400 hover:bg-black/80 text-[10px] font-medium px-2 py-1 rounded-full transition-colors border border-white/10 hover:border-yellow-500/50">
                        {t('setCover')}
                      </button>
                    )}
                    <button type="button" onClick={(e) => removeImage(img.id, e)}
                      className="bg-red-900/80 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors backdrop-blur">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    {index > 0 && (
                      <button type="button" onClick={(e) => moveImage(index, -1, e)} className="p-1.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur border border-white/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    <button type="button" className="p-1.5 bg-yellow-600/80 hover:bg-yellow-500 rounded-full text-white backdrop-blur border border-yellow-400/50 transition-colors" onClick={(e) => { e.stopPropagation(); setLightboxImage(img); }}>
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    {index < images.length - 1 && (
                      <button type="button" onClick={(e) => moveImage(index, 1, e)} className="p-1.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur border border-white/10 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Dropzone */}
          {images.length < MAX_IMAGES && (
            <motion.div
              layout
              className={`${images.length === 0 ? 'col-span-2 sm:col-span-4 min-h-[200px]' : 'aspect-[3/4]'} flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                dragActive ? 'border-yellow-400 bg-yellow-900/20' : 'border-yellow-800/40 bg-red-950/20 hover:bg-red-950/40 hover:border-yellow-600/60'
              }`}
              onDragEnter={handleDrag} onDragLeave={handleDrag}
              onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple accept="image/jpeg, image/png, image/webp"
                onChange={(e) => { e.preventDefault(); if (e.target.files?.[0]) processFiles(e.target.files); }}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center mb-3">
                  <UploadCloud className={`w-6 h-6 ${dragActive ? 'text-yellow-400 animate-bounce' : 'text-yellow-600'}`} />
                </div>
                <p className="text-sm font-medium text-white mb-1">
                  {images.length === 0 ? t('clickOrDrag') : t('addImage')}
                </p>
                {images.length === 0 && <p className="text-xs text-gray-500 px-4">{t('highQuality')}</p>}
              </div>
            </motion.div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="w-full mt-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span className="animate-pulse text-yellow-500">{t('uploading')}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 bg-red-950/60 rounded-full overflow-hidden border border-red-900/30">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-300 rounded-full"
                animate={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Visibility Toggle */}
      <div className="glass-premium border border-yellow-900/20 rounded-2xl p-6 shadow-luxury">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isPublic ? <Globe className="w-4 h-4 text-yellow-500" /> : <Lock className="w-4 h-4 text-gray-500" />}
              <span className="font-medium text-white">{isPublic ? t('publicProfile') : t('privateProfile')}</span>
            </div>
            <p className="text-gray-400 text-sm">{isPublic ? t('publicDesc') : t('privateDesc')}</p>
          </div>
          <button type="button" onClick={() => setIsPublic(!isPublic)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
              isPublic ? 'bg-yellow-600' : 'bg-red-950/60 border border-red-900/50'
            }`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <p className="text-center text-green-500/90 text-sm font-medium px-4 animate-pulse">
        {t('almostDone')}
      </p>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────
const CreateBiodataPage = () => {
  const { lang, t } = useLang();
  const { currentUser } = useAuth();
  const { create, loading: saving } = useBiodata();
  const { upload, progress: uploadProgress, uploading } = useUpload();
  const navigate = useNavigate();

  // ── Step state ──
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [saveError, setSaveError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const draftTimerRef = useRef(null);

  // ── Gallery state ──
  const [images, setImages] = useState([]);
  const [coverId, setCoverId] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  // ── Custom field state (chip / AI / stepper) ──
  const [languagesKnown, setLanguagesKnown] = useState([]);
  const [siblings, setSiblings] = useState([]);
  const [brothersCount, setBrothersCount] = useState(0);
  const [sistersCount, setSistersCount] = useState(0);
  const [marriedSiblings, setMarriedSiblings] = useState(0);
  const [familyValues, setFamilyValues] = useState([]);
  const [familyDescription, setFamilyDescription] = useState('');
  const [careerDescription, setCareerDescription] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [partnerExpectations, setPartnerExpectations] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [preferredEducation, setPreferredEducation] = useState([]);
  const [preferredProfession, setPreferredProfession] = useState([]);
  const [preferredCity, setPreferredCity] = useState([]);

  // ── react-hook-form ──
  const {
    register, handleSubmit, trigger, watch, setValue,
    formState: { errors }, reset,
  } = useForm({
    defaultValues: {
      personalInfo: {},
      educationInfo: {},
      familyInfo: {},
      preferences: {},
    },
  });

  // ── Load draft from localStorage ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem('biodata_create_draft');
      if (raw) {
        const d = JSON.parse(raw);
        if (d.formValues) reset(d.formValues);
        if (d.aboutMe) setAboutMe(d.aboutMe);
        if (d.partnerExpectations) setPartnerExpectations(d.partnerExpectations);
        if (d.careerDescription) setCareerDescription(d.careerDescription);
        if (d.familyDescription) setFamilyDescription(d.familyDescription);
        if (d.languagesKnown) setLanguagesKnown(d.languagesKnown);
        if (d.familyValues) setFamilyValues(d.familyValues);
        if (d.hobbies) setHobbies(d.hobbies);
        if (d.preferredEducation) setPreferredEducation(d.preferredEducation);
        if (d.preferredProfession) setPreferredProfession(d.preferredProfession);
        if (d.preferredCity) setPreferredCity(d.preferredCity);
        if (d.brothersCount !== undefined) setBrothersCount(d.brothersCount);
        if (d.sistersCount !== undefined) setSistersCount(d.sistersCount);
        if (d.marriedSiblings !== undefined) setMarriedSiblings(d.marriedSiblings);
        if (d.siblings) setSiblings(d.siblings);
        if (d.isPublic !== undefined) setIsPublic(d.isPublic);
      }
    } catch (_) { /* ignore */ }
  }, [reset]);

  // ── Auto-save to localStorage with debounce ──
  const triggerDraftSave = useCallback(() => {
    clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      try {
        const snapshot = {
          formValues: watch(),
          aboutMe, partnerExpectations, careerDescription, familyDescription,
          languagesKnown, familyValues, hobbies, preferredEducation,
          preferredProfession, preferredCity, brothersCount, sistersCount,
          marriedSiblings, siblings, isPublic,
        };
        localStorage.setItem('biodata_create_draft', JSON.stringify(snapshot));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2500);
      } catch (_) { /* ignore */ }
    }, 800);
  }, [
    watch, aboutMe, partnerExpectations, careerDescription, familyDescription,
    languagesKnown, familyValues, hobbies, preferredEducation, preferredProfession,
    preferredCity, brothersCount, sistersCount, marriedSiblings, siblings, isPublic,
  ]);

  useEffect(() => {
    const sub = watch(() => triggerDraftSave());
    return () => sub.unsubscribe();
  }, [watch, triggerDraftSave]);

  useEffect(() => {
    triggerDraftSave();
  }, [
    aboutMe, partnerExpectations, careerDescription, familyDescription,
    languagesKnown, familyValues, hobbies, preferredEducation, preferredProfession,
    preferredCity, brothersCount, sistersCount, marriedSiblings, siblings, isPublic,
    triggerDraftSave,
  ]);

  // ── Unsaved changes guard ──
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // ── Navigation ──
  const fieldsToValidate = {
    1: ['personalInfo.fullName', 'personalInfo.dob'],
    2: ['educationInfo.highestQualification'],
    3: [],
    4: ['preferences.contactName', 'preferences.contactPhone'],
  };

  const goNext = async () => {
    const valid = await trigger(fieldsToValidate[step] || []);
    if (!valid) {
      setSaveError(t('fillRequired'));
      return;
    }
    setSaveError('');
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    setSaveError('');
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Submit ──
  const onSubmit = async (formData) => {
    setSaveError('');
    setUploadError('');
    try {
      const withTimeout = (ms, promise, label) =>
        new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error(`TIMEOUT:${label}`)), ms);
          promise.then(resolve).catch(reject).finally(() => clearTimeout(timer));
        });

      // Upload images
      let finalPhotos = [];
      for (const img of images) {
        if (img.file) {
          const result = await withTimeout(30000, upload(img.file), 'UPLOAD');
          finalPhotos.push({ url: result.photoURL, publicId: result.photoPublicId, id: img.id });
        }
      }

      const coverPhoto = finalPhotos.find((p) => p.id === coverId) || finalPhotos[0];
      const photoURL = coverPhoto?.url || '';
      const photoPublicId = coverPhoto?.publicId || '';

      const biodataId = await withTimeout(
        30000,
        create({
          personalInfo: {
            ...formData.personalInfo,
            languagesKnown,
          },
          educationInfo: {
            ...formData.educationInfo,
            careerDescription,
          },
          familyInfo: {
            ...formData.familyInfo,
            siblings,
            brothersCount,
            sistersCount,
            marriedSiblings,
            familyValues,
            familyDescription,
          },
          preferences: {
            ...formData.preferences,
            aboutMe,
            partnerExpectations,
            hobbies,
            preferredEducation,
            preferredProfession,
            preferredCity,
          },
          photoURL,
          photoPublicId,
          photos: finalPhotos.map((p) => ({ url: p.url, publicId: p.publicId })),
          isPublic,
        }),
        'SAVE',
      );

      // Clear draft
      localStorage.removeItem('biodata_create_draft');
      navigate(`/profile/${biodataId}`);
    } catch (err) {
      if (err.message?.startsWith('TIMEOUT')) {
        setSaveError(t('timeoutError'));
      } else {
        setSaveError(`${t('saveFailedError')} ${err.message || ''}`);
      }
    }
  };

  // ── Step titles ──
  const stepTitles = [
    t('step1Title'), t('step2Title'), t('step3Title'),
    t('step4Title'), t('step5Title'),
  ];

  const progressPct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  // ── Step Components ──
  const stepComponents = [
    <Step1 key={1} register={register} errors={errors} watch={watch} setValue={setValue}
      t={t} lang={lang} languagesKnown={languagesKnown} setLanguagesKnown={setLanguagesKnown} />,
    <Step2 key={2} register={register} errors={errors} t={t} lang={lang}
      careerDescription={careerDescription} setCareerDescription={setCareerDescription} />,
    <Step3 key={3} register={register} errors={errors} t={t} lang={lang}
      siblings={siblings} setSiblings={setSiblings}
      brothersCount={brothersCount} setBrothersCount={setBrothersCount}
      sistersCount={sistersCount} setSistersCount={setSistersCount}
      marriedSiblings={marriedSiblings} setMarriedSiblings={setMarriedSiblings}
      familyValues={familyValues} setFamilyValues={setFamilyValues}
      familyDescription={familyDescription} setFamilyDescription={setFamilyDescription} />,
    <Step4 key={4} register={register} errors={errors} t={t} lang={lang}
      aboutMe={aboutMe} setAboutMe={setAboutMe}
      partnerExpectations={partnerExpectations} setPartnerExpectations={setPartnerExpectations}
      hobbies={hobbies} setHobbies={setHobbies}
      preferredEducation={preferredEducation} setPreferredEducation={setPreferredEducation}
      preferredProfession={preferredProfession} setPreferredProfession={setPreferredProfession}
      preferredCity={preferredCity} setPreferredCity={setPreferredCity} />,
    <Step5 key={5} images={images} setImages={setImages} coverId={coverId} setCoverId={setCoverId}
      isPublic={isPublic} setIsPublic={setIsPublic}
      uploadProgress={uploadProgress} uploading={uploading}
      setUploadError={setUploadError} t={t} />,
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-28 sm:pb-16 px-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0d0000] via-[#150000] to-[#0d0000] -z-10" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>

          <h1 className="text-3xl md:text-4xl font-light text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('createBiodataTitle').split(' ').map((word, i) =>
              i === 2 ? <span key={i} className="text-yellow-400"> {word}</span> : ` ${word}`
            )}
          </h1>
          <p className="text-gray-500 text-sm"
            style={{ fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}>
            {t('createBiodataSubtitle')}
          </p>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-yellow-900/20 shadow-luxury">

          {/* Step Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg sm:text-xl font-semibold text-white"
                style={{
                  fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', 'Playfair Display', serif" : 'Playfair Display, serif',
                }}>
                {t('stepOf')} {step}: {stepTitles[step - 1]}
              </h2>
              {/* Draft saved badge */}
              <AnimatePresence>
                {draftSaved && (
                  <motion.div
                    key="draft"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1 text-green-400/80 text-[10px] font-medium tracking-wide auto-save-badge"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {t('draftSaved')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="mt-2 mb-1 h-1 bg-red-950/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-400 rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-[10px] text-gray-600 text-right">{progressPct}{t('complete')}</p>
          </div>

          {/* Animated Step Content */}
          <form onSubmit={(e) => { e.preventDefault(); step < TOTAL_STEPS ? goNext() : handleSubmit(onSubmit)(e); }}>
            <div className="relative overflow-hidden min-h-[300px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {stepComponents[step - 1]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Errors */}
            {(saveError || uploadError) && (
              <div className="mt-5 p-3 rounded-xl bg-red-950/60 border border-red-700/40 text-red-300 text-sm"
                style={{ fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}>
                {saveError || uploadError}
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden sm:flex justify-between items-center mt-10 pt-6 border-t border-red-900/20">
              <Button type="button" variant="ghost" size="md" onClick={goPrev} disabled={step === 1}>
                <ChevronLeft className="w-4 h-4" /> {t('back')}
              </Button>
              {step < TOTAL_STEPS ? (
                <Button type="button" variant="primary" size="md" onClick={goNext}>
                  {t('next')} <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button type="button" variant="gold" size="md"
                  onClick={handleSubmit(onSubmit)} loading={saving || uploading}>
                  <Save className="w-4 h-4" /> {t('saveBiodata')}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="sm:hidden mobile-sticky-nav">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={goPrev} disabled={step === 1}
            className="flex-1">
            <ChevronLeft className="w-4 h-4" /> {t('back')}
          </Button>
          <div className="flex-shrink-0 text-center">
            <p className="text-[10px] text-gray-500">{step}/{TOTAL_STEPS}</p>
            <div className="flex gap-0.5 mt-0.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} className={`h-1 w-4 rounded-full transition-colors ${i < step ? 'bg-yellow-500' : 'bg-red-900/50'}`} />
              ))}
            </div>
          </div>
          {step < TOTAL_STEPS ? (
            <Button type="button" variant="primary" size="sm" onClick={goNext} className="flex-1">
              {t('next')} <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="button" variant="gold" size="sm"
              onClick={handleSubmit(onSubmit)} loading={saving || uploading} className="flex-1"
              style={{ fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}>
              <Save className="w-3.5 h-3.5" /> {t('saveBiodata')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBiodataPage;
