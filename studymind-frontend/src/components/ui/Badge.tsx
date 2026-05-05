'use client';

import { cn, generateColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, className, size = 'md' }: BadgeProps) {
  // Use children as string for color generation, fallback to "default" if not a string
  const colorKey = typeof children === 'string' ? children : String(children);
  const color = generateColor(colorKey);
  
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
