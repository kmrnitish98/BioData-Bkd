/**
 * seo.js — Central SEO Configuration for Aguaa
 *
 * All per-page metadata, keywords, and schema definitions.
 * Used by the useSEO hook to dynamically update head tags.
 *
 * Domain: https://aguaa.in
 */

export const SITE = {
  name: 'Aguaa',
  tagline: 'Dil Se Rishta, Vishwas Se Shaadi',
  description: "India's Trusted Marriage Biodata Platform",
  url: 'https://aguaa.in',
  logo: 'https://aguaa.in/logo.png',
  ogImage: 'https://aguaa.in/og-banner.jpg',
  twitterHandle: '@aguaa_in',
  email: 'support@aguaa.in',
  phone: '',   // Add real phone when available — do not leave placeholder in structured data
  region: 'Bihar, Uttar Pradesh, Jharkhand, India',
};

/**
 * Per-route SEO metadata.
 * Each key maps to a URL path.
 */
export const PAGE_SEO = {
  '/': {
    title: 'Aguaa — #1 Shaadi Biodata Maker | Marriage Biodata Platform | Bihar UP Jharkhand',
    description:
      "Aguaa is India's most trusted marriage biodata maker. Create beautiful shaadi biodata in minutes. Free PDF download. Serving Bihar, UP, Jharkhand families. शादी के लिए बायोडाटा — Dil Se Rishta, Vishwas Se Shaadi.",
    keywords:
      'shaadi biodata, marriage biodata, biodata maker, shaadi ke liye biodata, wedding biodata, matrimonial website, rishta website, online biodata maker, Bihar matrimonial, UP matrimonial, Jharkhand matrimonial, विवाह बायोडाटा, शादी के लिए बायोडाटा, dulha dulhan biodata, aguaa',
    canonical: 'https://aguaa.in/',
    ogType: 'website',
    schema: 'home',
    noIndex: false,
  },
  '/about': {
    title: 'About Aguaa — India\'s Trusted Marriage Mediator Platform | Aguaa Meaning',
    description:
      "Learn about Aguaa — the word 'Aguaa' means a traditional marriage mediator in Bihar/UP culture. India's trusted digital matrimonial platform for families in Bihar, UP & Jharkhand.",
    keywords:
      'about aguaa, aguaa meaning, aguaa kya hai, what is aguaa, marriage mediator India, Bihar matrimonial platform, rishta karane wala, aguaa shaadi',
    canonical: 'https://aguaa.in/about',
    ogType: 'website',
    schema: 'about',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://aguaa.in/' },
      { name: 'About', url: 'https://aguaa.in/about' },
    ],
  },
  '/explore': {
    title: 'Explore Marriage Biodata Profiles — Shaadi Rishta | Aguaa',
    description:
      'Browse thousands of verified marriage biodata profiles on Aguaa. Find the perfect rishta from Bihar, UP, Jharkhand. Search by name, city, religion. Free matchmaking platform.',
    keywords:
      'explore biodata, marriage profiles, rishta profiles, shaadi rishta, Bihar matrimonial profiles, UP rishta, Jharkhand biodata, matrimonial search, free rishta website',
    canonical: 'https://aguaa.in/explore',
    ogType: 'website',
    schema: 'explore',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://aguaa.in/' },
      { name: 'Explore Profiles', url: 'https://aguaa.in/explore' },
    ],
  },
  '/gallery': {
    title: 'Biodata Template Gallery — Premium Shaadi Biodata Designs | Aguaa',
    description:
      'Browse Aguaa\'s gallery of premium marriage biodata templates. Traditional royal designs and modern layouts for Hindu, Muslim, and Sikh families from Bihar, UP & Jharkhand.',
    keywords:
      'biodata template, shaadi biodata design, marriage biodata format, premium biodata template, Hindu biodata, Muslim biodata, Bihar biodata template',
    canonical: 'https://aguaa.in/gallery',
    ogType: 'website',
    schema: 'gallery',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://aguaa.in/' },
      { name: 'Biodata Templates', url: 'https://aguaa.in/gallery' },
    ],
  },
  '/pricing': {
    title: 'Pricing Plans — Free & Premium Biodata | Aguaa',
    description:
      'Create your marriage biodata for free on Aguaa. Upgrade to premium for exclusive templates, PDF downloads, and advanced privacy controls. Best value matrimonial plans.',
    keywords:
      'biodata pricing, free biodata maker, premium matrimonial plan, shaadi biodata cost, free marriage profile, biodata subscription India',
    canonical: 'https://aguaa.in/pricing',
    ogType: 'website',
    schema: 'pricing',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://aguaa.in/' },
      { name: 'Pricing', url: 'https://aguaa.in/pricing' },
    ],
  },
  '/contact': {
    title: 'Contact Aguaa — Matrimonial Support | Reach Us',
    description:
      'Get in touch with Aguaa for matrimonial support. We help families in Bihar, UP, Jharkhand find the perfect rishta. Contact us via WhatsApp, email or our contact form.',
    keywords:
      'contact aguaa, aguaa support, matrimonial help, rishta support, biodata help, Bihar matrimonial contact',
    canonical: 'https://aguaa.in/contact',
    ogType: 'website',
    schema: 'contact',
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://aguaa.in/' },
      { name: 'Contact', url: 'https://aguaa.in/contact' },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy — Aguaa | Your Data is Safe',
    description:
      'Aguaa privacy policy. We protect your personal information with bank-grade encryption. Learn how we handle your matrimonial data and biodata information.',
    keywords: 'aguaa privacy policy, biodata privacy, matrimonial data security',
    canonical: 'https://aguaa.in/privacy',
    ogType: 'website',
    schema: null,
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://aguaa.in/' },
      { name: 'Privacy Policy', url: 'https://aguaa.in/privacy' },
    ],
  },
  '/terms': {
    title: 'Terms of Service — Aguaa | Usage Guidelines',
    description:
      "Aguaa's terms of service for using India's trusted marriage biodata platform. Read our usage guidelines and policies.",
    keywords: 'aguaa terms of service, matrimonial terms, biodata platform terms',
    canonical: 'https://aguaa.in/terms',
    ogType: 'website',
    schema: null,
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://aguaa.in/' },
      { name: 'Terms of Service', url: 'https://aguaa.in/terms' },
    ],
  },
  '/refund': {
    title: 'Refund Policy — Aguaa | Fair & Transparent',
    description:
      "Aguaa's refund policy for premium matrimonial services. We offer fair and transparent refunds.",
    keywords: 'aguaa refund policy, biodata refund, matrimonial refund',
    canonical: 'https://aguaa.in/refund',
    ogType: 'website',
    schema: null,
    noIndex: false,
    breadcrumb: [
      { name: 'Home', url: 'https://aguaa.in/' },
      { name: 'Refund Policy', url: 'https://aguaa.in/refund' },
    ],
  },
  '/login': {
    title: 'Login — Aguaa | Access Your Marriage Biodata',
    description: 'Login to your Aguaa account to manage your marriage biodata and explore profiles.',
    keywords: 'aguaa login, biodata login, matrimonial login',
    canonical: 'https://aguaa.in/login',
    ogType: 'website',
    schema: null,
    noIndex: true, // Don't index auth pages
  },
  '/signup': {
    title: 'Sign Up Free — Aguaa | Create Marriage Biodata',
    description:
      'Create your free Aguaa account and start making your marriage biodata today. Join 10,000+ families on India\'s trusted matrimonial platform.',
    keywords: 'aguaa signup, create biodata account, free matrimonial registration',
    canonical: 'https://aguaa.in/signup',
    ogType: 'website',
    schema: null,
    noIndex: true, // Don't index auth pages
  },
  '/create': {
    title: 'Create Marriage Biodata — Aguaa',
    description: 'Create your professional marriage biodata on Aguaa.',
    canonical: 'https://aguaa.in/create',
    schema: null,
    noIndex: true,
  },
  '/dashboard': {
    title: 'My Dashboard — Aguaa',
    description: 'Manage your marriage biodata on Aguaa.',
    canonical: 'https://aguaa.in/dashboard',
    schema: null,
    noIndex: true,
  },
  '/edit': {
    title: 'Edit Marriage Biodata — Aguaa',
    description: 'Update your marriage biodata on Aguaa.',
    canonical: 'https://aguaa.in/dashboard',
    schema: null,
    noIndex: true,
  },
  '/404': {
    title: 'Page Not Found | Aguaa',
    description: 'The page you are looking for does not exist on Aguaa.',
    canonical: 'https://aguaa.in/',
    schema: null,
    noIndex: true,
  },
};

/**
 * Shared FAQ schema data (used across home + about pages)
 * Optimized for Google FAQ rich results + AI search engines
 */
export const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Aguaa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Aguaa is India's trusted online marriage biodata platform. The word 'Aguaa' comes from Bihar and UP culture, meaning a traditional marriage mediator who connects the bride's and groom's families. Aguaa brings this tradition online — helping families in Bihar, Uttar Pradesh, and Jharkhand create beautiful matrimonial biodatas and find the perfect match.",
      },
    },
    {
      '@type': 'Question',
      name: 'Aguaa ka matlab kya hai? (What does Aguaa mean?)',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Aguaa ek Bhojpuri/Hindi shabd hai jo Bihar aur UP ki shaadi ki parampara mein ek vishesh bhumika ke liye use hota hai. Aguaa woh vyakti hota hai jo dulha aur dulhan ke parivaron ko milata hai aur shaadi karane mein madad karta hai — ek trusted marriage mediator. Aguaa.in yahi kaam digital roop mein karta hai.",
      },
    },
    {
      '@type': 'Question',
      name: 'How to create a shaadi biodata on Aguaa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Creating your marriage biodata on Aguaa is simple: 1) Sign up for a free account, 2) Fill in your personal, family, and educational details, 3) Upload your photo, 4) Choose a premium template, 5) Download as PDF or share via WhatsApp link. The entire process takes less than 10 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Shaadi ke liye biodata mein kya likhna chahiye?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ek achhe shaadi biodata mein yeh cheezein honi chahiye: Personal Information (naam, umar, height, rang), Educational Qualification, Occupation & Income, Family Details (mata-pita, bhai-behen), Religious & Caste Information, Contact Details, aur ek acchi photo. Aguaa ka platform automatically yeh sab organize karta hai.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Aguaa free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Aguaa is completely free to create and share your basic marriage biodata. You can create a professional biodata, download it as PDF, and share it via WhatsApp at no cost. We also offer premium plans with exclusive royal templates, advanced privacy controls, and profile analytics.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kya Aguaa par biodata PDF mein download ho sakta hai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Haan! Aguaa par aap apna shaadi biodata high-quality PDF format mein ek click mein download kar sakte hain. Yeh PDF WhatsApp share karne ya print karne ke liye bilkul ready hoti hai. Premium users ko aur bhi advanced PDF options milte hain.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Aguaa safe and secure for sharing personal information?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Aguaa takes your privacy very seriously. Your personal information is protected with bank-grade encryption. You control who sees your biodata — you can keep it private and share only a secure link with specific families, or make it public for wider reach. We never share your data with third parties.",
      },
    },
    {
      '@type': 'Question',
      name: 'What areas does Aguaa serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aguaa primarily serves families in Bihar, Uttar Pradesh (UP), and Jharkhand — the heartland of Bhojpuri and Hindi-speaking matrimonial culture. However, our platform is available across all of India and for the Indian diaspora worldwide.',
      },
    },
    {
      '@type': 'Question',
      name: 'Aguaa aur doosre matrimonial sites mein kya fark hai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aguaa doosre matrimonial sites se alag hai kyunki: 1) Yeh specially Bihar, UP, Jharkhand ke liye banaya gaya hai, 2) Aap kuch minutes mein sundar biodata bana sakte hain, 3) PDF download aur WhatsApp sharing bilkul free hai, 4) Saare profiles manually verified hote hain, 5) Privacy aur security pe extra dhyan diya jaata hai.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I edit my biodata after creating it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can log into your Aguaa dashboard anytime to update your biodata details, change your photo, or switch to a different template. All changes are reflected immediately and your shareable link remains the same.',
      },
    },
  ],
};

/**
 * Breadcrumb schema generator
 * @param {Array<{name: string, url: string}>} items
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
