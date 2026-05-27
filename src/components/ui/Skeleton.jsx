/**
 * Skeleton.jsx — Skeleton loading primitives.
 *
 * Usage:
 *   <Skeleton width="100%" height={20} />
 *   <SkeletonCard />
 *   <SkeletonProfile />
 *   <SkeletonText lines={3} />
 */

/* ── Base shimmer pulse ──────────────────────────────────────────────────── */
const shimmer = `
  relative overflow-hidden
  bg-gradient-to-r from-[#1a0a00]/60 via-[#2a1500]/60 to-[#1a0a00]/60
  before:absolute before:inset-0
  before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent
  before:animate-[shimmer_1.8s_infinite]
  rounded-lg
`;

/* inject keyframe once */
if (typeof document !== 'undefined') {
  const id = 'skeleton-shimmer-style';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes shimmer {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ── Base Skeleton ───────────────────────────────────────────────────────── */
export const Skeleton = ({ width = '100%', height = 16, className = '' }) => (
  <div
    className={`${shimmer} ${className}`}
    style={{ width, height }}
    aria-hidden="true"
  />
);

/* ── Multi-line text skeleton ────────────────────────────────────────────── */
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton key={i} height={14} width={i === lines - 1 ? '65%' : '100%'} />
    ))}
  </div>
);

/* ── Biodata card skeleton ───────────────────────────────────────────────── */
export const SkeletonCard = ({ className = '' }) => (
  <div
    className={`rounded-2xl bg-[#120800]/60 border border-yellow-900/10 overflow-hidden ${className}`}
    aria-hidden="true"
  >
    {/* Image */}
    <Skeleton height={220} className="rounded-none" />
    {/* Content */}
    <div className="p-4 space-y-3">
      <Skeleton height={20} width="70%" />
      <Skeleton height={14} width="50%" />
      <div className="flex gap-2 pt-1">
        <Skeleton height={28} width={70} className="rounded-full" />
        <Skeleton height={28} width={60} className="rounded-full" />
      </div>
    </div>
  </div>
);

/* ── Profile page skeleton ───────────────────────────────────────────────── */
export const SkeletonProfile = () => (
  <div className="space-y-6" aria-hidden="true">
    {/* Hero banner */}
    <Skeleton height={300} className="rounded-3xl" />
    {/* Card row */}
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-[#120800]/60 border border-yellow-900/10 p-6 space-y-4">
        <Skeleton height={22} width="40%" />
        <SkeletonText lines={5} />
      </div>
      <div className="rounded-2xl bg-[#120800]/60 border border-yellow-900/10 p-6 space-y-4">
        <Skeleton height={22} width="40%" />
        <SkeletonText lines={5} />
      </div>
    </div>
    {/* Another row */}
    <div className="rounded-2xl bg-[#120800]/60 border border-yellow-900/10 p-6 space-y-4">
      <Skeleton height={22} width="30%" />
      <SkeletonText lines={3} />
    </div>
  </div>
);

/* ── Dashboard skeleton ──────────────────────────────────────────────────── */
export const SkeletonDashboard = () => (
  <div className="space-y-6" aria-hidden="true">
    {/* Header */}
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton height={30} width={200} />
        <Skeleton height={14} width={140} />
      </div>
      <Skeleton height={42} width={120} className="rounded-xl" />
    </div>
    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-2xl bg-[#120800]/60 border border-yellow-900/10 overflow-hidden">
          <div className="flex items-center gap-4 p-6 border-b border-red-900/10">
            <Skeleton width={48} height={64} className="flex-shrink-0 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton height={18} width="60%" />
              <Skeleton height={13} width="40%" />
            </div>
            <Skeleton width={60} height={24} className="rounded-full" />
          </div>
          <div className="flex gap-2 px-6 py-4">
            {[80, 60, 100].map((w, j) => (
              <Skeleton key={j} height={32} width={w} className="rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
