import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';
import { generateContent, improveContent, translateContent, TONES } from '../../utils/aiAssist';

// ─── AITextarea — Smart editable textarea with AI assistance toolbar ──
// AI-generated content always appears inside editable textarea.
// Users can edit, clear, regenerate, or ignore AI entirely.

const AITextarea = ({
  label,
  name,
  register,
  value,
  onChange,
  placeholder,
  required,
  field, // AI field key: 'aboutMe' | 'partnerExpectations' | 'familyDescription' | 'careerSummary' | 'hobbies'
  rows = 4,
  error,
}) => {
  const { lang, t, tObj } = useLang();
  const [tone, setTone] = useState('traditional');
  const [generating, setGenerating] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const tones = tObj('aiTones');

  const simulateGeneration = (fn) => {
    setGenerating(true);
    setTimeout(() => {
      const result = fn();
      onChange(result);
      setGenerating(false);
    }, 800);
  };

  const handleGenerate = () => {
    simulateGeneration(() => generateContent(field, tone, lang));
  };

  const handleImprove = () => {
    simulateGeneration(() => improveContent(field, lang));
  };

  const handleRegenerate = () => {
    const tonesList = TONES;
    const nextTone = tonesList[(tonesList.indexOf(tone) + 1) % tonesList.length];
    setTone(nextTone);
    simulateGeneration(() => generateContent(field, nextTone, lang));
  };

  const handleTranslate = () => {
    simulateGeneration(() => translateContent(field, tone, lang));
  };

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Textarea */}
      <div className={`relative rounded-xl overflow-hidden border transition-all duration-200 ${
        error ? 'border-red-500/60' : 'border-red-900/40 focus-within:border-yellow-700/50'
      }`}>
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{ fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', 'Mukta', sans-serif" : 'inherit' }}
          className="w-full px-4 py-3 bg-red-950/30 text-white placeholder-gray-600 focus:outline-none resize-none text-sm leading-relaxed"
        />

        {/* Generating overlay */}
        <AnimatePresence>
          {generating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2"
            >
              <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
              <p className="text-yellow-400/80 text-xs font-medium tracking-wide">
                {t('aiGenerating')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}

      {/* AI Toolbar */}
      {field && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {/* AI helper label */}
          <span className="text-yellow-700/60 text-[10px] uppercase tracking-widest hidden sm:inline">
            {t('aiHelper')}:
          </span>

          {/* Generate */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="ai-btn"
          >
            {t('aiGenerate')}
          </button>

          {/* Improve */}
          <button
            type="button"
            onClick={handleImprove}
            disabled={generating || !value}
            className="ai-btn"
          >
            {t('aiImprove')}
          </button>

          {/* Regenerate */}
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={generating}
            className="ai-btn"
          >
            {t('aiRegenerate')}
          </button>

          {/* Translate */}
          <button
            type="button"
            onClick={handleTranslate}
            disabled={generating}
            className="ai-btn"
          >
            {t('aiTranslate')}
          </button>

          {/* Tone Selector */}
          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setShowToneMenu((p) => !p)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/50 border border-red-900/40 text-yellow-600/70 text-[10px] uppercase tracking-widest hover:border-yellow-800/50 transition-colors"
            >
              <span>{t('aiTone')}: {tones[tone] || tone}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
              {showToneMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-full mb-1 z-20 min-w-[140px] bg-[#1a0000] border border-yellow-900/30 rounded-xl shadow-2xl overflow-hidden"
                >
                  {TONES.map((t_) => (
                    <button
                      key={t_}
                      type="button"
                      onClick={() => { setTone(t_); setShowToneMenu(false); }}
                      className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                        tone === t_
                          ? 'bg-yellow-900/30 text-yellow-300'
                          : 'text-gray-400 hover:bg-red-900/30 hover:text-gray-200'
                      }`}
                    >
                      {tones[t_] || t_}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITextarea;
