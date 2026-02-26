export function SkeletonCard() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
      <div className="mb-2 h-24 w-24 rounded-full skeleton-shimmer" />
      <div className="h-4 w-20 rounded skeleton-shimmer" />
      <div className="mt-2 h-3 w-14 rounded skeleton-shimmer" />
      <div className="mt-3 flex gap-1.5">
        <div className="h-5 w-12 rounded-full skeleton-shimmer" />
        <div className="h-5 w-12 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
