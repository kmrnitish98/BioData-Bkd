import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

const StepIndicator = ({ currentStep }) => {
  const { t } = useLang();
  const steps = t('stepLabels') || ['Personal', 'Education', 'Family', 'Preferences', 'Gallery'];

  return (
    <div className="w-full mb-10">
      {/* Step Labels */}
      <div className="flex justify-between mb-3">
        {steps.map((label, idx) => (
          <span
            key={idx}
            className={`text-[10px] sm:text-xs font-medium uppercase tracking-wide transition-colors duration-300 ${
              idx + 1 <= currentStep ? 'text-yellow-400' : 'text-gray-600'
            }`}
            style={{ fontFamily: typeof label === 'string' && /[\u0900-\u097F]/.test(label)
              ? "'Noto Sans Devanagari', 'Mukta', sans-serif"
              : 'inherit'
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Progress Bar + Circles */}
      <div className="relative flex items-center">
        {/* Background track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-red-950/80" />

        {/* Animated progress fill */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-0.5 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-600 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ width: '100%' }}
        />

        {/* Step circles */}
        <div className="relative w-full flex justify-between z-10">
          {steps.map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <motion.div
                key={idx}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-yellow-500 border-yellow-400 text-black'
                    : isCurrent
                    ? 'bg-red-900 border-yellow-500 text-yellow-400'
                    : 'bg-[#1a0000] border-red-900/50 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  <span className="text-xs font-bold">{stepNum}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
