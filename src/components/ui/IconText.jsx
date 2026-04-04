const IconText = ({ icon, label, value, className = '' }) => (
  <div className={`flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition duration-300 group ${className}`}>
    <div className="p-3 rounded-full bg-red-950/60 text-gold-400 border border-gold-600/30 flex-shrink-0 group-hover:border-gold-500/60 transition-all">
      <span className="text-yellow-500 w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
    </div>
    <div className="min-w-0">
      <p className="text-xs text-yellow-600/80 mb-1 uppercase tracking-widest font-medium">{label}</p>
      <p className="text-lg font-medium text-white leading-snug break-words">{value || '—'}</p>
    </div>
  </div>
);

export default IconText;
