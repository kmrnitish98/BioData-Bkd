import { useState } from 'react';
import { X } from 'lucide-react';

// ChipSelector — Multi-select chip input with predefined options + custom entry

const ChipSelector = ({ label, options = [], value = [], onChange, placeholder }) => {
  const [customInput, setCustomInput] = useState('');

  const toggle = (chip) => {
    if (value.includes(chip)) {
      onChange(value.filter((v) => v !== chip));
    } else {
      onChange([...value, chip]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustomInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-yellow-600/80 uppercase tracking-widest mb-2">
          {label}
        </label>
      )}

      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-600/20 border border-yellow-600/40 text-yellow-300"
            >
              {chip}
              <button
                type="button"
                onClick={() => toggle(chip)}
                className="hover:text-red-300 transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Predefined options */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {options
            .filter((o) => !value.includes(o))
            .map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className="px-3 py-1 rounded-full text-xs border border-red-900/40 text-gray-400 bg-red-950/30 hover:border-yellow-800/50 hover:text-gray-200 transition-all duration-150"
              >
                + {opt}
              </button>
            ))}
        </div>
      )}

      {/* Custom input */}
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type and press Enter...'}
          className="flex-1 px-3 py-2 rounded-xl bg-red-950/30 border border-red-900/40 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-700/50 transition-colors"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim()}
          className="px-3 py-2 rounded-xl bg-yellow-900/30 border border-yellow-800/40 text-yellow-500 text-xs hover:bg-yellow-800/40 transition-colors disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ChipSelector;
