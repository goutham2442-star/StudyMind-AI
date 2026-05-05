'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className,
  hover = false,
  glow = false,
  padding = 'md',
}: CardProps) {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={cn(
        "glass rounded-xl transition-all duration-300",
        hover ? "hover:border-primary/30" : "",
        glow ? "shadow-glow" : "",
        paddings[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
