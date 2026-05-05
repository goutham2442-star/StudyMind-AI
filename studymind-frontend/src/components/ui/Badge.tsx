'use client';

import { cn, generateColor } from '@/lib/utils';

interface BadgeProps {
  children: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, className, size = 'md' }: BadgeProps) {
  const color = generateColor(children);
  
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-widest rounded-full",
        size === 'sm' ? "px-2 py-0.5 text-[8px]" : "px-3 py-1 text-[10px]",
        className
      )}
      style={{
        backgroundColor: `${color}15`, // 15% opacity
        color: color,
        border: `1px solid ${color}30` // 30% opacity
      }}
    >
      {children}
    </span>
  );
}
