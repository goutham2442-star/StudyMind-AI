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
      whileHover={{ y: -4 }}
      className="glass p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-glow", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
            change >= 0 ? "text-success bg-success/10" : "text-error bg-error/10"
          )}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-muted text-[10px] font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-heading font-black mt-1">
          {typeof value === 'string' && value.includes('+') ? `${displayValue}+` : displayValue}
        </h3>
      </div>

      {/* Decorative gradient */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-20 rounded-full",
        color === 'blue' && "bg-blue-500",
        color === 'violet' && "bg-violet-500",
        color === 'teal' && "bg-teal-500",
        color === 'orange' && "bg-orange-500"
      )} />
    </motion.div>
  );
}
