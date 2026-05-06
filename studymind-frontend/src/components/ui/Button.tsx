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
  const { onDrag, onDragStart, onDragEnd, onDragOver, ...filteredProps } = props as any;
  
  const variants = {
    primary: "bg-linear-to-r from-primary to-primary-dark text-white shadow-glow border border-white/10 hover:shadow-glow-lg",
    secondary: "bg-surface-3/50 backdrop-blur-xl border border-white/5 text-foreground hover:bg-surface-3 hover:border-white/10 shadow-premium",
    ghost: "bg-transparent text-muted hover:text-foreground hover:bg-white/5",
    danger: "bg-error/10 text-error border border-error/20 hover:bg-error/20 shadow-glow shadow-error/10",
  };

  const sizes = {
    sm: "px-4 h-9 text-[10px] uppercase tracking-widest",
    md: "px-6 h-12 text-xs uppercase tracking-widest",
    lg: "px-10 h-14 text-sm uppercase tracking-widest",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled && !loading ? { scale: 1.03, y: -2, transition: { type: "spring", stiffness: 400, damping: 10 } } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97, y: 0 } : {}}
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-3 font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group",
        variants[variant],
        sizes[size],
        className
      )}
      {...filteredProps}
    >
      {/* Primary Glow Effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      )}

      {/* Shimmer Effect */}
      {variant === 'primary' && !disabled && !loading && (
        <div className="absolute inset-0 w-full h-full animate-shimmer pointer-events-none opacity-30" />
      )}

      {loading ? (
        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-inherit" />
          <span className="font-black">Processing</span>
        </div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="relative z-10">{children}</span>
          {Icon && iconPosition === 'right' && (
            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </>
      )}

      {/* Gradient Border for Secondary */}
      {variant === 'secondary' && (
        <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };
