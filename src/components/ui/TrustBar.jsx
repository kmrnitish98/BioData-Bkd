import { ShieldCheck, BadgeCheck, Sparkles, Globe2, Lock } from 'lucide-react';

/**
 * TrustBar — horizontal trust signal strip.
 * Renders a row of social-proof / security badges.
 * Used on ExplorePage and DashboardPage.
 */
const SIGNALS = [
  { icon: ShieldCheck, label: 'Secure & Private',    color: 'text-emerald-400' },
  { icon: BadgeCheck,  label: 'Verified Profiles',   color: 'text-blue-400'    },
  { icon: Lock,        label: 'Data Encrypted',       color: 'text-yellow-500'  },
  { icon: Sparkles,    label: 'Free to Browse',       color: 'text-yellow-400'  },
  { icon: Globe2,      label: 'Made in India 🇮🇳',   color: 'text-orange-400'  },
];

const TrustBar = ({ className = '' }) => (
  <div
    className={`w-full overflow-x-auto scrollbar-hidden ${className}`}
    aria-label="Trust signals"
  >
    <div className="flex items-center justify-center gap-1 sm:gap-2 min-w-max mx-auto px-4 py-3">
      {SIGNALS.map((s, i) => {
        const Icon = s.icon;
        return (
          <span key={s.label} className="flex items-center">
            {/* Signal pill */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                         bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm
                         hover:bg-white/[0.05] hover:border-white/[0.1]
                         transition-all duration-200 whitespace-nowrap cursor-default select-none"
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${s.color}`} />
              <span className="text-gray-400">{s.label}</span>
            </span>
            {/* Separator dot */}
            {i < SIGNALS.length - 1 && (
              <span className="w-1 h-1 rounded-full bg-yellow-900/50 mx-1.5 flex-shrink-0" />
            )}
          </span>
        );
      })}
    </div>
  </div>
);

export default TrustBar;
