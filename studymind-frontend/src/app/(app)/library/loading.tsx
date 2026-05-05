import { PaperCardSkeleton, Skeleton } from '@/components/ui';

export default function LibraryLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-surface-2 rounded-xl" />
          <div className="h-4 w-96 bg-surface-2 rounded-lg" />
        </div>
        <div className="h-11 w-40 bg-surface-2 rounded-xl" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-16 z-20 pt-2 pb-4">
        <div className="h-24 w-full bg-surface-2 rounded-[32px] border border-border-accent/50" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PaperCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
