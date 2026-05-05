'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, ArrowRight, Upload, BookOpen, MessageSquare, ChevronDown } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

interface SuccessStateProps {
  paper: any;
  onReset: () => void;
}

export function SuccessState({ paper, onReset }: SuccessStateProps) {
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#4F8EF7', '#7C3AED'] 
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#4F8EF7', '#7C3AED'] 
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-10 flex flex-col items-center space-y-12">
      {/* Animated Success Icon */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-success flex items-center justify-center text-white shadow-[0_0_50px_rgba(34,197,94,0.4)]"
        >
          <CheckCircle size={48} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-4 -right-4 bg-primary text-white p-2 rounded-xl shadow-glow"
        >
          <span className="text-[10px] font-black uppercase tracking-widest px-2">Ready</span>
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-black tracking-tight">Paper uploaded successfully! 🎉</h2>
        <p className="text-muted text-sm font-medium">Your study material is now powered by StudyMind AI</p>
      </div>

      <div className="w-full space-y-6">
        {/* AI Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-primary w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">AI Summary</h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90 italic">
            "{paper.summary || "This paper covers key concepts in " + paper.subject + ". AI has extracted the main themes and created practice questions for you."}"
          </p>
        </Card>

        {/* Practice Questions */}
        <div className="space-y-3">
          <button 
            onClick={() => setShowQuestions(!showQuestions)}
            className="flex items-center justify-between w-full p-4 glass rounded-xl hover:bg-surface-2 transition-all group"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="text-secondary w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Predicted Exam Questions</h3>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-muted transition-transform", showQuestions && "rotate-180")} />
          </button>
          
          {showQuestions && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-3 overflow-hidden"
            >
              {(paper.exam_questions || [
                "Explain the core architectural components of the system described.",
                "Discuss the security implications of the proposed model.",
                "Compare and contrast with previous years' methodologies.",
                "What are the primary performance bottlenecks mentioned?",
                "Outline the step-by-step implementation process."
              ]).map((q: string, i: number) => (
                <div key={i} className="p-4 bg-surface-2 border border-border-accent rounded-xl text-xs font-medium leading-relaxed">
                  <span className="text-primary font-black mr-2">Q{i+1}:</span> {q}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full pt-6">
        <Link href={`/chat/${paper.id}`} className="flex-1">
          <Button className="w-full h-14 text-base group">
            Start Studying <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Button variant="ghost" onClick={onReset} className="h-14 px-8 border border-border-accent">
          <Upload className="w-5 h-5 mr-2" /> Upload Another
        </Button>
      </div>
    </div>
  );
}
