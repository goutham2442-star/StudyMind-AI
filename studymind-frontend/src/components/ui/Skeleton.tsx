'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded",
    card: "h-48 w-full rounded-xl",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-32 rounded-xl",
  };

  return (
    <div
      className={cn(
        "bg-white/5 relative overflow-hidden",
        variants[variant],
        className
      )}
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  );
}

// Specialized Skeletons
export const PaperCardSkeleton = () => (
  <div className="glass p-6 rounded-xl space-y-4">
    <Skeleton variant="card" className="h-32" />
    <Skeleton className="w-3/4" />
    <Skeleton className="w-1/2 h-3" />
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="glass p-6 rounded-xl space-y-2">
    <Skeleton variant="avatar" className="h-8 w-8 rounded-lg" />
    <Skeleton className="w-2/3 h-3" />
    <Skeleton className="w-1/2 h-6" />
  </div>
);

export const MessageSkeleton = () => (
  <div className="flex gap-4 p-4">
    <Skeleton variant="avatar" />
    <div className="space-y-2 flex-1">
      <Skeleton className="w-full" />
      <Skeleton className="w-5/6" />
      <Skeleton className="w-2/3" />
    </div>
  </div>
);
