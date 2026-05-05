'use client';

import { motion } from 'framer-motion';
import { Brain, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center gap-8 max-w-4xl"
      >
        <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-glow animate-float">
          <Brain className="text-white w-12 h-12" />
        </div>

        <div className="space-y-4">
          <div className="px-4 py-1.5 rounded-full glass inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Welcome to the Future of Study
          </div>
          <h1 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tight">
            StudyMind <span className="text-gradient">AI</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Your production-ready academic intelligence assistant is set up and ready to build.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/login" className="bg-linear-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold shadow-glow hover:scale-[1.02] transition-all flex items-center gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="glass px-8 py-4 rounded-xl font-bold hover:bg-surface-2 transition-all">
            Documentation
          </button>
        </div>
      </motion.div>

      {/* Shimmer Placeholder */}
      <div className="mt-20 w-full max-w-5xl h-64 glass rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="p-8 space-y-4 relative z-10">
          <div className="h-8 w-1/3 bg-white/5 rounded-lg" />
          <div className="h-4 w-full bg-white/5 rounded-lg" />
          <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
