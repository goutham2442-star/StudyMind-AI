'use client';

import { motion } from 'framer-motion';
import { 
  CloudUpload, 
  Search, 
  Brain, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingStateProps {
  stage: 1 | 2 | 3 | 4;
}

export function ProcessingState({ stage }: ProcessingStateProps) {
  const stages = [
    { id: 1, label: "Uploading PDF...", icon: CloudUpload, color: "text-blue-500", range: [0, 40] },
    { id: 2, label: "Extracting text...", icon: Search, color: "text-violet-500", range: [40, 70] },
    { id: 3, label: "AI is analyzing...", icon: Brain, color: "text-teal-500", range: [70, 95] },
    { id: 4, label: "Finalizing...", icon: CheckCircle2, color: "text-success", range: [95, 100] },
  ];

  const currentStage = stages.find(s => s.id === stage) || stages[0];

  return (
    <div className="py-20 flex flex-col items-center justify-center space-y-12">
      {/* Animated Icon */}
      <div className="relative">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn("w-32 h-32 rounded-[40px] bg-surface-2 flex items-center justify-center shadow-2xl", currentStage.color)}
        >
          <currentStage.icon size={56} className="relative z-10" />
          <div className={cn("absolute inset-0 blur-2xl opacity-20 rounded-full", currentStage.color.replace('text', 'bg'))} />
        </motion.div>
        
        <div className="absolute -bottom-2 -right-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-heading font-black tracking-tight">{currentStage.label}</h3>
        <p className="text-muted text-sm font-medium">Please wait while our AI processes your exam paper</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md space-y-4">
        <div className="h-3 bg-surface-2 rounded-full overflow-hidden border border-border-accent p-0.5">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${currentStage.range[1]}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-linear-to-r from-primary to-secondary rounded-full shadow-glow"
          />
        </div>
        
        <div className="flex justify-between px-2">
          {stages.map((s) => (
            <div 
              key={s.id}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                s.id <= stage ? "bg-primary shadow-glow scale-125" : "bg-border-accent"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {stages.map((s) => (
          <div 
            key={s.id} 
            className={cn(
              "p-4 rounded-2xl border flex items-center gap-3 transition-all",
              s.id === stage ? "border-primary bg-primary/5" : "border-border-accent bg-surface/30 opacity-40"
            )}
          >
            <s.icon className={cn("w-5 h-5", s.id <= stage ? s.color : "text-muted")} />
            <span className={cn("text-xs font-bold uppercase tracking-widest", s.id <= stage ? "text-foreground" : "text-muted")}>
              {s.label.replace('...', '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
