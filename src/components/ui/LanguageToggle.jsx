import { useLang } from '../../context/LanguageContext';

// LanguageToggle — EN | हिंदी switcher

const LanguageToggle = () => {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-0.5 bg-red-950/50 border border-red-900/40 rounded-full p-0.5">
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
          lang === 'en'
            ? 'bg-yellow-600 text-black shadow-sm'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('hi')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
          lang === 'hi'
            ? 'bg-yellow-600 text-black shadow-sm'
            : 'text-gray-400 hover:text-gray-200'
        }`}
        style={{ fontFamily: "'Noto Sans Devanagari', 'Mukta', sans-serif" }}
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageToggle;
