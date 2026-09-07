export const SkeletonCard = ({ className = "" }) => (
  <div className={`rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 animate-shimmer ${className}`}>
    <div className="h-4 w-2/3 bg-slate-800 rounded mb-4" />
    <div className="h-8 w-1/2 bg-slate-800/80 rounded mb-3" />
    <div className="h-3 w-full bg-slate-800/50 rounded mb-2" />
    <div className="h-3 w-4/5 bg-slate-800/50 rounded" />
  </div>
);

export const SkeletonGrid = ({ count = 3, className = "" }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 animate-shimmer mb-3">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-800" />
      <div>
        <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
        <div className="h-3 w-24 bg-slate-800/60 rounded" />
      </div>
    </div>
    <div className="h-6 w-16 bg-slate-800/80 rounded-full" />
  </div>
);

export default SkeletonCard;
