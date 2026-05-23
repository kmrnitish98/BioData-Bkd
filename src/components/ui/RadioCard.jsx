// RadioCard — Touch-friendly radio button cards
// Works with react-hook-form via value + onChange props (use watch + setValue)

const RadioCard = ({ label, options, value, onChange, columns = 2 }) => {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }[columns] || 'grid-cols-2';

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <div className={`grid ${colClass} gap-2`}>
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isSelected = value === optValue;

          return (
            <button
              key={optValue}
              type="button"
              onClick={() => onChange(isSelected ? '' : optValue)}
              className={`
                relative px-3 py-2.5 rounded-xl border text-sm font-medium
                transition-all duration-200 text-center cursor-pointer
                min-h-[44px] flex items-center justify-center
                ${isSelected
                  ? 'bg-yellow-600/20 border-yellow-500/70 text-yellow-300 shadow-[0_0_12px_rgba(184,134,11,0.25)]'
                  : 'bg-red-950/30 border-red-900/40 text-gray-400 hover:border-yellow-800/50 hover:text-gray-200 hover:bg-red-950/50'
                }
              `}
            >
              {isSelected && (
                <span className="absolute top-1 right-1.5 text-yellow-400 text-[10px]">✓</span>
              )}
              {optLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RadioCard;
