'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hover = false,
  glow = false,
  padding = 'md',
  style,
  onClick,
}: CardProps) {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      style={style}
      onClick={onClick}
      className={cn(
        "glass-card rounded-2xl transition-all duration-500",
        hover ? "hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] cursor-pointer" : "",
        glow ? "shadow-glow" : "",
        paddings[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
