'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

export function Avatar({ src, name, size = 'md', online = false, className }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      <div className={cn(
        "rounded-full overflow-hidden flex items-center justify-center border-2 border-border-accent",
        sizes[size],
        !src && "bg-linear-to-br from-primary to-secondary text-white font-bold"
      )}>
        {src ? (
          <Image 
            src={src} 
            alt={name} 
            width={100} 
            height={100} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      
      {online && (
        <span className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-background bg-success",
          size === 'sm' ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
        )} />
      )}
    </div>
  );
}
