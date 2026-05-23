import { createContext, useContext, useState, useEffect } from 'react';

// ─── Translation Dictionary ─────────────────────────────────────────
const translations = {
  en: {
    // Navigation
    next: 'Next',
    back: 'Back',
    saveBiodata: 'Save Biodata',
    savePublish: 'Save & Publish',
    draftSaved: '✓ Draft saved',
    // Step titles
    step1Title: 'Personal Information',
    step2Title: 'Education & Profession',
    step3Title: 'Family Background',
    step4Title: 'Preferences & Contact',
    step5Title: 'Gallery & Publish',
    stepLabels: ['Personal', 'Education', 'Family', 'Preferences', 'Gallery'],
    // Step header helpers
    stepOf: 'Step',
    of: 'of',
    complete: '% complete',
    // Page header
    createBiodataTitle: 'Create Your Biodata',
    createBiodataSubtitle: 'Fill in your details to create a beautiful, shareable marriage biodata',
    editBiodataTitle: 'Edit Your Biodata',
    editBiodataSubtitle: 'Update your details for your premium biodata profile',
    // ── Step 1 ──
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    fullNamePlaceholder: 'e.g. Priya Kumari',
    dob: 'Date of Birth',
    height: 'Height',
    heightPlaceholder: "e.g. 5'4\"",
    weight: 'Weight',
    weightPlaceholder: 'e.g. 55 kg',
    maritalStatus: 'Marital Status',
    city: 'Current City',
    cityPlaceholder: 'e.g. Patna, Bihar',
    religion: 'Religion',
    religionPlaceholder: 'e.g. Hindu',
    caste: 'Caste',
    castePlaceholder: 'e.g. Brahmin',
    gotra: 'Gotra',
    gotraPlaceholder: 'e.g. Kashi',
    zodiac: 'Zodiac Sign',
    zodiacPlaceholder: 'e.g. Virgo / Kanya',
    complexion: 'Complexion',
    motherTongue: 'Mother Tongue',
    motherTonguePlaceholder: 'e.g. Hindi',
    manglikStatus: 'Manglik Status',
    dietPreference: 'Diet Preference',
    bloodGroup: 'Blood Group',
    smoking: 'Smoking',
    drinking: 'Drinking',
    disability: 'Disability Status',
    profileCreatedBy: 'Profile Created By',
    languagesKnown: 'Languages Known',
    // Marital options
    neverMarried: 'Never Married',
    divorced: 'Divorced',
    widowed: 'Widowed',
    awaitingDivorce: 'Awaiting Divorce',
    // Complexion options
    fair: 'Fair',
    wheatish: 'Wheatish',
    dusky: 'Dusky',
    dark: 'Dark',
    // Manglik
    yes: 'Yes',
    no: 'No',
    partial: 'Partial',
    // Diet
    vegetarian: 'Vegetarian',
    nonVeg: 'Non-Veg',
    jain: 'Jain',
    vegan: 'Vegan',
    // Smoking / Drinking
    occasionally: 'Occasionally',
    // ── Step 2 ──
    highestQualification: 'Highest Qualification',
    highestQualificationPlaceholder: 'e.g. B.A Honors (Psychology)',
    college: 'College / University',
    collegePlaceholder: 'e.g. Rohtas Mahila College',
    passingYear: 'Passing Year',
    passingYearPlaceholder: 'e.g. 2025',
    additionalQualification: 'Additional Qualifications',
    additionalQualificationPlaceholder: 'Certifications, diplomas, etc.',
    professionalDetails: 'Professional Details',
    professionalDetailsOptional: '(Optional)',
    occupation: 'Occupation',
    occupationPlaceholder: 'e.g. Software Engineer',
    employer: 'Employer / Company',
    employerPlaceholder: 'e.g. TCS, Govt.',
    annualIncome: 'Annual Income',
    occupationType: 'Occupation Type',
    workLocation: 'Work Location',
    workLocationPlaceholder: 'e.g. Delhi, Mumbai',
    employmentType: 'Employment Type',
    careerDescription: 'Career Summary',
    careerDescriptionPlaceholder: 'Briefly describe your career and professional journey...',
    // ── Step 3 ──
    fatherName: "Father's Name",
    fatherNamePlaceholder: 'Mr. Ramesh Kumar',
    fatherOccupation: "Father's Occupation",
    fatherOccupationPlaceholder: 'e.g. Farmer, Business',
    motherName: "Mother's Name",
    motherNamePlaceholder: 'Mrs. Sunita Devi',
    motherOccupation: "Mother's Occupation",
    motherOccupationPlaceholder: 'e.g. Homemaker',
    nativePlace: 'Native Place',
    nativePlaceholder: 'e.g. Sasaram, Bihar',
    familyType: 'Family Type',
    familyStatus: 'Family Status',
    brothers: 'Brothers',
    sisters: 'Sisters',
    marriedSiblings: 'Married Siblings',
    familyValues: 'Family Values',
    familyIncome: 'Family Income',
    familyDescription: 'Family Description',
    familyDescriptionPlaceholder: 'Describe your family background and values...',
    siblings: 'Siblings',
    addSibling: '+ Add Sibling',
    siblingName: 'Name',
    siblingRole: 'Role / Profession',
    siblingMarried: 'Married',
    // ── Step 4 ──
    aboutMe: 'About Me',
    aboutMePlaceholder: 'Write a brief personal bio about yourself...',
    partnerExpectations: 'Partner Expectations',
    partnerExpectationsPlaceholder: "Describe what you're looking for in a life partner...",
    preferredLocation: 'Preferred Location',
    preferredLocationPlaceholder: 'e.g. Bihar, UP, Any',
    hobbies: 'Hobbies & Interests',
    hobbiesPlaceholder: 'e.g. Reading, Cooking, Travel',
    contactName: 'Contact Name',
    contactNamePlaceholder: 'Primary contact person',
    contactPhone: 'Contact Phone',
    contactPhonePlaceholder: '10-digit mobile number',
    contactEmail: 'Contact Email',
    contactEmailPlaceholder: 'Optional',
    preferredAgeRange: 'Preferred Age Range',
    ageMin: 'Min Age',
    ageMax: 'Max Age',
    years: 'yrs',
    preferredEducation: 'Preferred Education',
    preferredProfession: 'Preferred Profession',
    preferredCity: 'Preferred City',
    preferredReligion: 'Preferred Religion',
    preferredCaste: 'Preferred Caste / Any',
    preferredCastePlaceholder: 'e.g. Any / Brahmin',
    contactSection: 'Contact Information',
    partnerPreferences: 'Partner Preferences',
    // ── Step 5 ──
    profileGallery: 'Profile Gallery',
    jpgPngLimit: 'JPG, PNG up to 5MB',
    clickOrDrag: 'Click to upload or drag & drop',
    addImage: 'Add Image',
    highQuality: 'High quality portrait photos recommended for best results.',
    uploading: 'Uploading...',
    setCover: 'Set Cover',
    cover: 'Cover',
    publicProfile: 'Public Profile',
    privateProfile: 'Private Profile',
    publicDesc: 'Your biodata will appear in public listings and be shareable via link.',
    privateDesc: 'Only people with the direct link can view your biodata.',
    almostDone: '✦ Almost done! Click "Save Biodata" to publish your premium biodata profile.',
    // AI Assist
    aiGenerate: '✨ Generate',
    aiImprove: '✨ Improve',
    aiRegenerate: '🔄 Regenerate',
    aiTranslate: '🌐 Translate',
    aiTone: 'Tone',
    aiGenerating: 'Generating...',
    aiHelper: 'AI can help you write this',
    aiTones: {
      traditional: 'Traditional',
      modern: 'Modern',
      elegant: 'Elegant',
      premium: 'Premium',
      simple: 'Simple',
    },
    // Validation
    required: 'This field is required',
    fillRequired: 'Please fill in all required fields marked with * before proceeding.',
    // Errors
    timeoutError: '⚠️ Request timed out. Please check your internet connection and try again.',
    saveFailedError: 'Failed to save. Please try again.',
    // Misc
    select: 'Select...',
    any: 'Any',
    to: 'to',
    optional: 'Optional',
  },
  hi: {
    // Navigation
    next: 'आगे बढ़ें',
    back: 'वापस',
    saveBiodata: 'बायोडाटा सेव करें',
    savePublish: 'सेव और प्रकाशित करें',
    draftSaved: '✓ ड्राफ्ट सेव हुआ',
    // Step titles
    step1Title: 'व्यक्तिगत जानकारी',
    step2Title: 'शिक्षा और व्यवसाय',
    step3Title: 'पारिवारिक पृष्ठभूमि',
    step4Title: 'प्राथमिकताएं और संपर्क',
    step5Title: 'फोटो और प्रकाशन',
    stepLabels: ['व्यक्तिगत', 'शिक्षा', 'परिवार', 'प्राथमिकता', 'फोटो'],
    // Step header helpers
    stepOf: 'चरण',
    of: '/',
    complete: '% पूर्ण',
    // Page header
    createBiodataTitle: 'अपना बायोडाटा बनाएं',
    createBiodataSubtitle: 'एक सुंदर, साझा करने योग्य विवाह बायोडाटा बनाने के लिए विवरण भरें',
    editBiodataTitle: 'अपना बायोडाटा संपादित करें',
    editBiodataSubtitle: 'अपने प्रीमियम बायोडाटा प्रोफाइल के लिए विवरण अपडेट करें',
    // ── Step 1 ──
    personalInfo: 'व्यक्तिगत जानकारी',
    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'जैसे: प्रिया कुमारी',
    dob: 'जन्म तिथि',
    height: 'ऊँचाई',
    heightPlaceholder: "जैसे: 5'4\"",
    weight: 'वजन',
    weightPlaceholder: 'जैसे: 55 किग्रा',
    maritalStatus: 'वैवाहिक स्थिति',
    city: 'वर्तमान शहर',
    cityPlaceholder: 'जैसे: पटना, बिहार',
    religion: 'धर्म',
    religionPlaceholder: 'जैसे: हिंदू',
    caste: 'जाति',
    castePlaceholder: 'जैसे: ब्राह्मण',
    gotra: 'गोत्र',
    gotraPlaceholder: 'जैसे: काशी',
    zodiac: 'राशि',
    zodiacPlaceholder: 'जैसे: कन्या / Virgo',
    complexion: 'रंग-रूप',
    motherTongue: 'मातृभाषा',
    motherTonguePlaceholder: 'जैसे: हिंदी',
    manglikStatus: 'मांगलिक स्थिति',
    dietPreference: 'खान-पान',
    bloodGroup: 'ब्लड ग्रुप',
    smoking: 'धूम्रपान',
    drinking: 'मद्यपान',
    disability: 'दिव्यांगता स्थिति',
    profileCreatedBy: 'प्रोफाइल बनाने वाले',
    languagesKnown: 'ज्ञात भाषाएं',
    // Marital options
    neverMarried: 'कभी विवाहित नहीं',
    divorced: 'तलाकशुदा',
    widowed: 'विधवा / विधुर',
    awaitingDivorce: 'तलाक की प्रतीक्षा',
    // Complexion
    fair: 'गोरा',
    wheatish: 'गेहुआँ',
    dusky: 'साँवला',
    dark: 'श्यामला',
    // Manglik
    yes: 'हाँ',
    no: 'नहीं',
    partial: 'आंशिक',
    // Diet
    vegetarian: 'शाकाहारी',
    nonVeg: 'मांसाहारी',
    jain: 'जैन',
    vegan: 'वीगन',
    // Smoking/Drinking
    occasionally: 'कभी-कभी',
    // ── Step 2 ──
    highestQualification: 'उच्चतम शिक्षा',
    highestQualificationPlaceholder: 'जैसे: बी.ए. ऑनर्स (मनोविज्ञान)',
    college: 'कॉलेज / विश्वविद्यालय',
    collegePlaceholder: 'जैसे: रोहतास महिला कॉलेज',
    passingYear: 'उत्तीर्ण वर्ष',
    passingYearPlaceholder: 'जैसे: 2025',
    additionalQualification: 'अतिरिक्त योग्यताएं',
    additionalQualificationPlaceholder: 'प्रमाणपत्र, डिप्लोमा आदि',
    professionalDetails: 'व्यावसायिक विवरण',
    professionalDetailsOptional: '(वैकल्पिक)',
    occupation: 'व्यवसाय',
    occupationPlaceholder: 'जैसे: सॉफ्टवेयर इंजीनियर',
    employer: 'नियोक्ता / कंपनी',
    employerPlaceholder: 'जैसे: TCS, सरकार',
    annualIncome: 'वार्षिक आय',
    occupationType: 'व्यवसाय का प्रकार',
    workLocation: 'कार्यस्थल',
    workLocationPlaceholder: 'जैसे: दिल्ली, मुंबई',
    employmentType: 'रोजगार का प्रकार',
    careerDescription: 'करियर सारांश',
    careerDescriptionPlaceholder: 'अपने करियर का संक्षिप्त विवरण लिखें...',
    // ── Step 3 ──
    fatherName: 'पिताजी का नाम',
    fatherNamePlaceholder: 'श्री रमेश कुमार',
    fatherOccupation: 'पिताजी का व्यवसाय',
    fatherOccupationPlaceholder: 'जैसे: किसान, व्यवसाय',
    motherName: 'माताजी का नाम',
    motherNamePlaceholder: 'श्रीमती सुनीता देवी',
    motherOccupation: 'माताजी का व्यवसाय',
    motherOccupationPlaceholder: 'जैसे: गृहिणी',
    nativePlace: 'मूल स्थान',
    nativePlaceholder: 'जैसे: सासाराम, बिहार',
    familyType: 'परिवार का प्रकार',
    familyStatus: 'परिवार की स्थिति',
    brothers: 'भाई',
    sisters: 'बहन',
    marriedSiblings: 'विवाहित भाई-बहन',
    familyValues: 'पारिवारिक मूल्य',
    familyIncome: 'पारिवारिक आय',
    familyDescription: 'परिवार का विवरण',
    familyDescriptionPlaceholder: 'अपने परिवार की पृष्ठभूमि और मूल्यों के बारे में लिखें...',
    siblings: 'भाई-बहन',
    addSibling: '+ भाई-बहन जोड़ें',
    siblingName: 'नाम',
    siblingRole: 'भूमिका / व्यवसाय',
    siblingMarried: 'विवाहित',
    // ── Step 4 ──
    aboutMe: 'मेरे बारे में',
    aboutMePlaceholder: 'अपने बारे में संक्षिप्त परिचय लिखें...',
    partnerExpectations: 'जीवनसाथी की अपेक्षाएं',
    partnerExpectationsPlaceholder: 'अपने जीवनसाथी में आप क्या देखना चाहते हैं...',
    preferredLocation: 'पसंदीदा स्थान',
    preferredLocationPlaceholder: 'जैसे: बिहार, UP, कहीं भी',
    hobbies: 'शौक और रुचियाँ',
    hobbiesPlaceholder: 'जैसे: पढ़ना, खाना बनाना, यात्रा',
    contactName: 'संपर्क नाम',
    contactNamePlaceholder: 'मुख्य संपर्क व्यक्ति',
    contactPhone: 'संपर्क फोन',
    contactPhonePlaceholder: '10 अंकों का मोबाइल नंबर',
    contactEmail: 'संपर्क ईमेल',
    contactEmailPlaceholder: 'वैकल्पिक',
    preferredAgeRange: 'पसंदीदा आयु सीमा',
    ageMin: 'न्यूनतम आयु',
    ageMax: 'अधिकतम आयु',
    years: 'वर्ष',
    preferredEducation: 'पसंदीदा शिक्षा',
    preferredProfession: 'पसंदीदा व्यवसाय',
    preferredCity: 'पसंदीदा शहर',
    preferredReligion: 'पसंदीदा धर्म',
    preferredCaste: 'पसंदीदा जाति / कोई भी',
    preferredCastePlaceholder: 'जैसे: कोई भी / ब्राह्मण',
    contactSection: 'संपर्क जानकारी',
    partnerPreferences: 'जीवनसाथी की प्राथमिकताएं',
    // ── Step 5 ──
    profileGallery: 'प्रोफाइल गैलरी',
    jpgPngLimit: 'JPG, PNG अधिकतम 5MB',
    clickOrDrag: 'क्लिक करें या ड्रैग एवं ड्रॉप करें',
    addImage: 'फोटो जोड़ें',
    highQuality: 'सर्वोत्तम परिणाम के लिए उच्च गुणवत्ता वाली पोर्ट्रेट फोटो अनुशंसित है।',
    uploading: 'अपलोड हो रहा है...',
    setCover: 'कवर सेट करें',
    cover: 'कवर',
    publicProfile: 'सार्वजनिक प्रोफाइल',
    privateProfile: 'निजी प्रोफाइल',
    publicDesc: 'आपका बायोडाटा सार्वजनिक सूची में दिखेगा और लिंक से साझा किया जा सकेगा।',
    privateDesc: 'केवल सीधे लिंक वाले लोग ही आपका बायोडाटा देख सकेंगे।',
    almostDone: '✦ लगभग हो गया! अपना प्रीमियम बायोडाटा प्रकाशित करने के लिए "बायोडाटा सेव करें" पर क्लिक करें।',
    // AI Assist
    aiGenerate: '✨ बनाएं',
    aiImprove: '✨ सुधारें',
    aiRegenerate: '🔄 पुनः बनाएं',
    aiTranslate: '🌐 अनुवाद करें',
    aiTone: 'शैली',
    aiGenerating: 'बना रहे हैं...',
    aiHelper: 'AI इसे लिखने में मदद कर सकता है',
    aiTones: {
      traditional: 'पारंपरिक',
      modern: 'आधुनिक',
      elegant: 'सुरुचिपूर्ण',
      premium: 'प्रीमियम',
      simple: 'सरल',
    },
    // Validation
    required: 'यह फ़ील्ड आवश्यक है',
    fillRequired: 'कृपया आगे बढ़ने से पहले * से चिह्नित सभी आवश्यक फ़ील्ड भरें।',
    // Errors
    timeoutError: '⚠️ अनुरोध का समय समाप्त हो गया। कृपया अपना इंटरनेट कनेक्शन जाँचें।',
    saveFailedError: 'सेव करने में विफल। कृपया पुनः प्रयास करें।',
    // Misc
    select: 'चुनें...',
    any: 'कोई भी',
    to: 'से',
    optional: 'वैकल्पिक',
  },
};

// ─── Context ─────────────────────────────────────────────────────────
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('biodata_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('biodata_lang', lang);
    // Set document direction (Hindi is LTR too)
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, [lang]);

  const t = (key) => {
    const val = translations[lang]?.[key];
    if (val !== undefined) return val;
    // Fallback to English
    return translations['en']?.[key] ?? key;
  };

  const tObj = (key) => {
    const val = translations[lang]?.[key];
    if (val && typeof val === 'object') return val;
    return translations['en']?.[key] ?? {};
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
};

export default LanguageContext;
