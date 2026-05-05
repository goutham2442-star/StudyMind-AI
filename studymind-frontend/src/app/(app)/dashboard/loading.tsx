import { DashboardStatSkeleton, PaperCardSkeleton } from '@/components/ui';

export default function DashboardLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-surface-2 rounded-xl" />
          <div className="h-4 w-96 bg-surface-2 rounded-lg" />
        </div>
        <div className="h-12 w-48 bg-surface-2 rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <DashboardStatSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-40 bg-surface-2 rounded-lg" />
            <div className="h-4 w-20 bg-surface-2 rounded-lg" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[300px]">
                <PaperCardSkeleton />
              </div>
            ))}
          </div>
          
          <div className="h-64 w-full bg-surface-2 rounded-[32px]" />
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="h-8 w-40 bg-surface-2 rounded-lg" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 w-full bg-surface-2 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
