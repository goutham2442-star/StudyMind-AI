'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, placement = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const placements = {
    top: "-top-2 left-1/2 -translate-x-1/2 -translate-y-full mb-1",
    bottom: "-bottom-2 left-1/2 -translate-x-1/2 translate-y-full mt-1",
    left: "top-1/2 -left-2 -translate-x-full -translate-y-1/2 mr-1",
    right: "top-1/2 -right-2 translate-x-full -translate-y-1/2 ml-1",
  };

  const arrows = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-surface border-x-transparent border-b-transparent",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-surface border-x-transparent border-t-transparent",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-surface border-y-transparent border-r-transparent",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-surface border-y-transparent border-l-transparent",
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-[110] px-3 py-1.5 bg-surface border border-border-accent rounded-lg text-xs font-medium text-foreground whitespace-nowrap shadow-xl pointer-events-none",
              placements[placement]
            )}
          >
            {content}
            <div className={cn("absolute border-4", arrows[placement])} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
