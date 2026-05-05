'use client';

import { motion } from 'framer-motion';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  ...props
}, ref) => {
  // Filter out props that might conflict with motion.button
  const { onDrag, onDragStart, onDragEnd, onDragOver, ...filteredProps } = props as any;
  const variants = {
    primary: "bg-linear-to-r from-primary to-secondary text-white shadow-glow hover:opacity-95 border border-white/10",
    secondary: "bg-surface-2/50 backdrop-blur-md border border-white/5 text-foreground hover:bg-surface-2 hover:border-white/10",
    ghost: "bg-transparent text-muted hover:text-foreground hover:bg-white/5",
    danger: "bg-error/10 text-error border border-error/20 hover:bg-error/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98, y: 0 } : {}}
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
        variants[variant],
        sizes[size],
        className
      )}
      {...filteredProps}
    >
      {/* Shimmer Effect for Primary */}
      {variant === 'primary' && !disabled && !loading && (
        <div className="absolute inset-0 w-full h-full animate-shimmer pointer-events-none opacity-20" />
      )}

      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">Please wait...</span>
        </div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />}
          <span className="relative z-10">{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };
