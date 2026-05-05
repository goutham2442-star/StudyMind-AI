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
    const stepTime = Math.abs(Math.floor(duration / end));
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 60);
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 20);
    
    return () => clearInterval(timer);
  }, [numericValue]);

  const colors = {
    blue: "text-blue-500 bg-blue-500/10 shadow-blue-500/20",
    violet: "text-violet-500 bg-violet-500/10 shadow-violet-500/20",
    teal: "text-teal-500 bg-teal-500/10 shadow-teal-500/20",
    orange: "text-orange-500 bg-orange-500/10 shadow-orange-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-card p-8 rounded-3xl flex flex-col gap-6 relative overflow-hidden group border border-white/5"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(79,142,247,0.2)]", colors[color])}>
          <Icon className="w-7 h-7" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-xl border",
            change >= 0 
              ? "text-success bg-success/10 border-success/20" 
              : "text-error bg-error/10 border-error/20"
          )}>
            {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{title}</p>
        <h3 className="text-4xl font-heading font-black mt-2 tracking-tight">
          {typeof value === 'string' && value.includes('+') ? `${displayValue}+` : displayValue}
        </h3>
      </div>

      {/* Background Accent */}
      <div className={cn(
        "absolute -bottom-16 -right-16 w-48 h-48 blur-[80px] opacity-10 rounded-full transition-all duration-700 group-hover:opacity-20 group-hover:scale-110",
        color === 'blue' && "bg-blue-500",
        color === 'violet' && "bg-violet-500",
        color === 'teal' && "bg-teal-500",
        color === 'orange' && "bg-orange-500"
      )} />
      
      {/* Subtle border shine */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
