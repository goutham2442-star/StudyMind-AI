'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
  color: 'blue' | 'violet' | 'teal' | 'orange';
}

export function StatsCard({ title, value, icon: Icon, change, color }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (start === end) return;
    
    const duration = 1500;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = Math.ceil(end / totalSteps);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [numericValue]);

  const colors = {
    blue: "text-primary bg-primary/10 shadow-primary/20 border-primary/10",
    violet: "text-secondary bg-secondary/10 shadow-secondary/20 border-secondary/10",
    teal: "text-accent bg-accent/10 shadow-accent/20 border-accent/10",
    orange: "text-orange-500 bg-orange-500/10 shadow-orange-500/20 border-orange-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      className="glass-card p-7 rounded-[32px] flex flex-col gap-8 relative overflow-hidden group border border-white/5"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border group-hover:scale-110", 
          colors[color]
        )}>
          <Icon className="w-7 h-7" />
        </div>
        {change !== undefined && (
          <Badge 
            variant={change >= 0 ? "success" : "error"}
            className="h-7 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg border-none bg-white/5"
          >
            {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1.5" /> : <TrendingDown className="w-3 h-3 mr-1.5" />}
            {Math.abs(change)}%
          </Badge>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-muted-dark text-[10px] font-black uppercase tracking-[0.25em] mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-4xl font-heading font-black tracking-tight text-glow">
            {displayValue.toLocaleString()}
          </h3>
          {typeof value === 'string' && value.includes('+') && (
            <span className="text-primary font-black text-xl">+</span>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-40 h-40 blur-[70px] opacity-10 rounded-full transition-all duration-700 group-hover:opacity-25 group-hover:scale-150",
        color === 'blue' && "bg-primary",
        color === 'violet' && "bg-secondary",
        color === 'teal' && "bg-accent",
        color === 'orange' && "bg-orange-500"
      )} />
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]" />
    </motion.div>
  );
}
