// ─── AI Assist — Template-Based Content Generator ─────────────────
// All content is fully editable. No API keys required.
// Templates are curated for Indian marriage biodata context.

const templates = {
  aboutMe: {
    en: {
      traditional:
        'I am a well-educated and cultured individual raised in a respected family with strong values of devotion, respect, and family togetherness. I believe in maintaining our beautiful traditions while embracing the responsibilities of a shared future. I seek a loving and understanding life partner to walk this journey of life with grace, love, and togetherness.',
      modern:
        'A passionate and driven individual who believes in building a life filled with purpose, love, and growth. I balance my career ambitions with a deep appreciation for family bonds and personal well-being. I enjoy exploring new experiences and look forward to building a beautiful, fulfilling life with the right partner.',
      elegant:
        'Graceful in temperament and thoughtful in nature, I bring warmth, wisdom, and genuine affection to every relationship. My life is guided by principles of kindness, loyalty, and a quiet elegance that values depth over superficiality. I am looking for a partner who cherishes the beauty of a meaningful life together.',
      premium:
        'An accomplished individual with a cultured sensibility and a warm heart. I believe that a great marriage is built on mutual respect, shared dreams, and unwavering support. My journey is one of continuous growth, and I seek a partner who will walk beside me with equal passion and lifelong commitment.',
      simple:
        'I am a simple, honest person who values family, love, and a peaceful life. I believe in hard work, staying grounded, and building a warm home filled with happiness, laughter, and love.',
    },
    hi: {
      traditional:
        'मैं एक सुशिक्षित और संस्कारी परिवार से हूँ। मुझे परिवार के प्रति समर्पण, आदर-सत्कार और हमारी संस्कृति में गहरी आस्था है। मैं पारंपरिक मूल्यों को मानते हुए एक सुखद और प्रेमपूर्ण वैवाहिक जीवन की तलाश में हूँ।',
      modern:
        'मैं एक जुझारू और सकारात्मक सोच वाला व्यक्ति हूँ जो जीवन में प्रगति और परिवार दोनों को समान महत्व देता है। मुझे नई चीज़ें सीखना और जीवन को पूरे उत्साह से जीना पसंद है। मैं एक ऐसे जीवनसाथी की तलाश में हूँ जो जीवन की हर राह पर साथ दे।',
      elegant:
        'स्वभाव से शांत, संवेदनशील और परिपक्व। मेरा जीवन सौहार्द, ईमानदारी और सच्ची भावनाओं पर आधारित है। मैं एक ऐसे जीवनसाथी की तलाश में हूँ जो गहरे रिश्तों की कद्र करे और जीवन को सुंदर बनाए।',
      premium:
        'एक सफल और सुसंस्कृत व्यक्ति जो जीवन में प्रेम, सम्मान और उत्कृष्टता को महत्व देता है। मेरा मानना है कि एक आदर्श विवाह आपसी सम्मान, साझे सपनों और अटूट विश्वास पर टिका होता है।',
      simple:
        'मैं एक सीधे-सादे स्वभाव का व्यक्ति हूँ जो परिवार, प्रेम और शांतिपूर्ण जीवन में विश्वास रखता है। मेहनत, ईमानदारी और परिवार की खुशी मेरी प्राथमिकता है।',
    },
  },
  partnerExpectations: {
    en: {
      traditional:
        'Seeking a well-educated, family-oriented life partner from a good family background. She should be respectful, loving, and devoted to family values. A caring, understanding companion who can blend warmly into our family and build a harmonious home together filled with love and tradition.',
      modern:
        'Looking for an independent, educated, and ambitious life partner who values both career and family. Someone who is supportive, understanding, and ready to grow together through life\'s journey. Open-minded, yet grounded in core values of respect and togetherness.',
      elegant:
        'Seeking a graceful, educated, and emotionally mature life partner. Someone who brings warmth, intelligence, and grace to our relationship — a partner who values depth of character, loyalty, and the beauty of a life lived with intention and love.',
      premium:
        'Looking for a well-accomplished, refined life partner who shares my vision for a fulfilling and meaningful life. She should be confident, kind-hearted, professionally accomplished, deeply committed to family, and ready to build a life of shared dreams and mutual growth.',
      simple:
        'Looking for a simple, honest, and caring life partner who values family, love, and a peaceful life together. Someone who is kind, understanding, and ready to start a beautiful journey together.',
    },
    hi: {
      traditional:
        'एक सुशिक्षित, संस्कारी और अच्छे परिवार से ताल्लुक रखने वाली जीवनसाथी की तलाश है। वह परिवार के प्रति समर्पित, आदरणीय और स्नेहमयी होनी चाहिए। एक ऐसी जीवनसंगिनी जो हमारे परिवार में प्रेम और सौहार्द लाए।',
      modern:
        'एक स्वतंत्र, शिक्षित और महत्वाकांक्षी जीवनसाथी की तलाश जो करियर और परिवार दोनों में संतुलन रखे। जो समझदार हो, सहयोगी हो और मिलकर जीवन को आगे बढ़ाने में विश्वास रखे।',
      elegant:
        'एक शालीन, शिक्षित और भावनात्मक रूप से परिपक्व जीवनसाथी की तलाश। जो रिश्ते में गहराई, वफादारी और एक खूबसूरत साझा जीवन की कद्र करे।',
      premium:
        'एक सफल, संस्कारी और अपने जीवन लक्ष्यों के प्रति स्पष्ट जीवनसाथी की तलाश। जो आत्मनिर्भर हो, दयालु हो, पेशेवर रूप से सक्षम हो और परिवार के प्रति पूरी तरह समर्पित हो।',
      simple:
        'एक सरल, ईमानदार और प्रेमपूर्ण जीवनसाथी की तलाश जो परिवार और शांतिपूर्ण जीवन को महत्व दे। जो दयालु, समझदार और जीवन की एक सुंदर यात्रा शुरू करने के लिए तैयार हो।',
    },
  },
  familyDescription: {
    en: {
      traditional:
        'We are a closely-knit joint family rooted in tradition, culture, and strong family values. Our household is filled with warmth, respect, and devotion. We celebrate every milestone together and believe in maintaining the beautiful bonds of family unity across generations.',
      modern:
        'A modern, progressive family that values both tradition and personal growth. We support each other\'s dreams and ambitions while staying rooted in our cultural values. Our home is a place of love, learning, mutual encouragement, and open conversations.',
      elegant:
        'A family of grace, culture, and deep mutual respect. We are a closely bonded family that believes in nurturing relationships, celebrating life\'s milestones together, and building a lasting legacy of dignity, warmth, and genuine love.',
      premium:
        'A distinguished family with strong values, accomplished members, and a rich cultural heritage. We pride ourselves on our unity, our achievements, and our commitment to excellence in all aspects of life. Our family brings together the best of tradition and modernity.',
      simple:
        'A loving, happy family that believes in honesty, hard work, and staying together through all of life\'s moments — both joyful and challenging. We are a family that cares for each other deeply.',
    },
    hi: {
      traditional:
        'हम एक संयुक्त और संस्कारी परिवार हैं जो परंपरा, संस्कृति और पारिवारिक मूल्यों में गहरी आस्था रखते हैं। हमारा घर प्रेम, सम्मान और समर्पण से भरा है। हम हर खुशी और त्योहार मिलकर मनाते हैं।',
      modern:
        'एक आधुनिक और प्रगतिशील परिवार जो परंपरा और व्यक्तिगत विकास दोनों को महत्व देता है। हम एक-दूसरे के सपनों का समर्थन करते हैं और सांस्कृतिक मूल्यों से जुड़े रहते हैं।',
      elegant:
        'एक शालीन, सुसंस्कृत और आपसी सम्मान से जुड़ा परिवार। हम जीवन के हर पल को मिलकर मनाते हैं और रिश्तों को गहराई और सच्चाई से निभाते हैं।',
      premium:
        'एक प्रतिष्ठित परिवार जिसमें मजबूत मूल्य, कुशल सदस्य और समृद्ध सांस्कृतिक विरासत है। हम अपनी एकता, उपलब्धियों और उत्कृष्टता के प्रति प्रतिबद्धता पर गर्व करते हैं।',
      simple:
        'एक प्यार करने वाला परिवार जो ईमानदारी, मेहनत और एकता में विश्वास रखता है। हम जीवन के हर पल में एक-दूसरे का साथ देते हैं।',
    },
  },
  careerSummary: {
    en: {
      traditional:
        'I have pursued my education with sincere dedication and currently hold a stable and respected position. My career reflects my commitment to duty, discipline, and continuous improvement. I am grateful for the opportunities I have received and continue to serve with full sincerity and dedication.',
      modern:
        'A driven professional with expertise in my field. I have built a rewarding career through continuous learning, hard work, and a passion for delivering results. My work is an expression of my ambition, and I am always seeking opportunities to grow and contribute meaningfully.',
      elegant:
        'My professional journey has been one of purposeful growth, meaningful contribution, and continuous refinement. I bring expertise, dedication, and a genuine commitment to excellence in everything I undertake professionally — and I carry that same spirit into all areas of my life.',
      premium:
        'An accomplished professional with a strong track record of achievement and consistent growth. My career represents years of focused effort, strategic thinking, and a commitment to delivering exceptional outcomes that create lasting value.',
      simple:
        'I am a hardworking and sincere professional who is fully dedicated to my work. I always strive to improve, learn new things, and give my best in everything I do.',
    },
    hi: {
      traditional:
        'मैंने अपनी शिक्षा पूरी मेहनत और लगन से पूरी की है और वर्तमान में एक स्थिर और सम्मानित पद पर कार्यरत हूँ। मेरा करियर कर्तव्य, अनुशासन और निरंतर सुधार के प्रति मेरी प्रतिबद्धता को दर्शाता है।',
      modern:
        'मैं एक उत्साही पेशेवर हूँ जिसने अपने क्षेत्र में लगातार सीखने और कड़ी मेहनत से अपना करियर बनाया है। मैं हमेशा बेहतर परिणाम देने और नई संभावनाओं को तलाशने में विश्वास रखता हूँ।',
      elegant:
        'मेरा पेशेवर सफर उद्देश्यपूर्ण विकास और सार्थक योगदान का रहा है। मैं जो भी काम करता हूँ उसमें पूरी निष्ठा, विशेषज्ञता और श्रेष्ठता लाने की कोशिश करता हूँ।',
      premium:
        'एक सफल पेशेवर जिसका करियर वर्षों की मेहनत, रणनीतिक सोच और उत्कृष्ट परिणाम देने की प्रतिबद्धता को दर्शाता है।',
      simple:
        'मैं एक मेहनती और ईमानदार पेशेवर हूँ जो अपने काम के प्रति पूरी तरह समर्पित है। मैं हमेशा सीखने और बेहतर बनने की कोशिश करता हूँ।',
    },
  },
  hobbies: {
    en: {
      traditional:
        'I enjoy spending quality time with family, participating in cultural and religious ceremonies, preparing traditional recipes, reading devotional and classical literature, and celebrating our rich heritage. My hobbies reflect my deep-rooted connection to family, culture, and tradition.',
      modern:
        'I love traveling to new destinations, exploring world cuisines, staying active through yoga and the gym, reading contemporary literature and non-fiction, staying up-to-date with technology, and having meaningful conversations. Life is an adventure, and I embrace every moment of it enthusiastically.',
      elegant:
        'My leisure pursuits include classical music, poetry, reading fine literature, gardening, and the practice of mindful, intentional living. I believe in the beauty of quiet moments, the richness of a cultured mind, and the joy of discovering something new every day.',
      premium:
        'I enjoy a curated blend of interests — from gourmet cooking and appreciating art and architecture to international travel, fine music, and meaningful conversations. My hobbies reflect my love for life\'s richer, more beautiful experiences.',
      simple:
        'I love spending time with my family, watching good movies, experimenting in the kitchen, listening to music, and enjoying simple moments that make life truly beautiful and worth cherishing.',
    },
    hi: {
      traditional:
        'मुझे परिवार के साथ समय बिताना, धार्मिक और सांस्कृतिक कार्यक्रमों में भाग लेना, पारंपरिक व्यंजन बनाना और भक्ति व शास्त्रीय साहित्य पढ़ना बेहद पसंद है।',
      modern:
        'मुझे नई जगहों की यात्रा करना, नए व्यंजन आज़माना, योग और जिम से फिट रहना, समकालीन साहित्य पढ़ना और तकनीक से अपडेट रहना पसंद है। जिंदगी को पूरे जोश के साथ जीना मेरी पसंद है।',
      elegant:
        'मेरी अभिरुचियों में शास्त्रीय संगीत, कविता, साहित्य पढ़ना, बागवानी और सचेत जीवनशैली शामिल हैं। मुझे हर दिन कुछ नया सीखने और जीवन की सुंदरता को महसूस करने में आनंद आता है।',
      premium:
        'मुझे गौरमेट खाना बनाना, कला और वास्तुकला की सराहना करना, अंतर्राष्ट्रीय यात्रा करना, उत्कृष्ट संगीत सुनना और गहरी बातचीत करना पसंद है।',
      simple:
        'परिवार के साथ समय बिताना, अच्छी फिल्में देखना, खाना बनाना और संगीत सुनना मेरे पसंदीदा शौक हैं। छोटी-छोटी खुशियाँ ही जीवन को खूबसूरत बनाती हैं।',
    },
  },
};

// ─── Public API ───────────────────────────────────────────────────────

export const TONES = ['traditional', 'modern', 'elegant', 'premium', 'simple'];
export const FIELDS = [
  'aboutMe',
  'partnerExpectations',
  'familyDescription',
  'careerSummary',
  'hobbies',
];

/**
 * Generate content for a specific field in a given tone and language.
 * @param {string} field - One of FIELDS
 * @param {string} tone  - One of TONES
 * @param {string} lang  - 'en' | 'hi'
 * @returns {string}
 */
export const generateContent = (field, tone, lang) => {
  const fieldTemplates = templates[field];
  if (!fieldTemplates) return '';
  const langTemplates = fieldTemplates[lang] || fieldTemplates['en'];
  return langTemplates[tone] || langTemplates['traditional'] || '';
};

/**
 * "Improve" the current content by returning the elegant-tone template.
 */
export const improveContent = (field, lang) => {
  return generateContent(field, 'elegant', lang);
};

/**
 * Translate to the opposite language using a curated template.
 * @param {string} field
 * @param {string} tone
 * @param {string} currentLang - current language of the content
 */
export const translateContent = (field, tone, currentLang) => {
  const targetLang = currentLang === 'hi' ? 'en' : 'hi';
  return generateContent(field, tone, targetLang);
};
