'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  suffix?: React.ReactNode;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  icon: Icon,
  suffix,
  hint,
  onFocus,
  onBlur,
  value,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';

  return (
    <div className="w-full space-y-1.5">
      <div className="relative group">
        {/* Main Input Container */}
        <div className={cn(
          "relative flex items-center bg-surface border rounded-lg transition-all duration-200",
          isFocused ? "border-primary/50 ring-1 ring-primary/20 shadow-[0_0_15px_rgba(79,142,247,0.1)]" : "border-border-accent",
          error ? "border-error/50 ring-1 ring-error/20" : "",
          className
        )}>
          {Icon && (
            <div className="pl-4">
              <Icon className={cn("w-4 h-4 transition-colors", isFocused ? "text-primary" : "text-muted")} />
            </div>
          )}
          
          <div className="relative flex-1">
            {label && (
              <label className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none select-none",
                (isFocused || hasValue) 
                  ? "-top-2.5 left-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-surface px-1.5" 
                  : "top-1/2 -translate-y-1/2 text-muted text-sm"
              )}>
                {label}
              </label>
            )}
            
            <input
              ref={ref}
              className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-transparent"
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              {...props}
            />
          </div>

          {suffix && <div className="pr-4">{suffix}</div>}
        </div>

        {/* Shaking Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -bottom-6 left-0 flex items-center gap-1 text-[10px] font-bold text-error uppercase tracking-wider"
            >
              <AlertCircle className="w-3 h-3" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {!error && hint && (
        <p className="text-[10px] text-muted ml-1 uppercase tracking-wider">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
