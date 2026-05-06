'use client';

import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Brain, 
  Lightbulb, 
  Star, 
  CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background selection:bg-primary/30">
      {/* Left Panel - High-End Branding */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-background p-20 lg:flex">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-background opacity-40">
          <div className="absolute top-[-20%] left-[-20%] h-[600px] w-[600px] animate-pulse rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[120px]" />
        </div>

        {/* Floating Geometric Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingIcon icon={BookOpen} delay={0} top="15%" left="10%" />
          <FloatingIcon icon={Brain} delay={1} top="45%" left="20%" />
          <FloatingIcon icon={GraduationCap} delay={2} top="75%" left="15%" />
          <FloatingIcon icon={Lightbulb} delay={0.5} top="25%" left="70%" />
          <FloatingIcon icon={Star} delay={1.5} top="60%" left="75%" />
        </div>

        {/* Top Branding */}
        <Link href="/" className="flex items-center gap-4 z-10 group">
          <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-[14px] flex items-center justify-center shadow-glow transition-transform group-hover:scale-110 duration-500">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-heading font-black tracking-tighter text-glow">StudyMind</span>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] opacity-80">Academic Intelligence</span>
          </div>
        </Link>

        {/* Hero Quote */}
        <div className="relative z-10 max-w-sm mt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-12 h-1 bg-primary rounded-full mb-8 shadow-glow"
          />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-heading font-black leading-tight mb-6 text-foreground tracking-tight text-glow"
          >
            Elevate your academic <span className="text-gradient">performance</span> with AI.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted text-sm font-bold uppercase tracking-[0.2em] opacity-50"
          >
            Join thousands of students mastering complex subjects.
          </motion.p>
        </div>

        {/* Premium Features List */}
        <div className="space-y-6 z-10">
          <FeaturePoint text="Intelligent Document Synthesis" />
          <FeaturePoint text="Predictive Examination Analytics" />
          <FeaturePoint text="Unified University Paper Repository" />
        </div>

        {/* Footer Credit */}
        <div className="z-10 text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-30">
          © {new Date().getFullYear()} StudyMind AI Systems
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-[58%] flex flex-col items-center justify-center p-8 md:p-16 relative bg-background">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,142,247,0.1),transparent_50%)]" />
        </div>
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function FloatingIcon({ icon: Icon, delay, top, left }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.1, 0.05, 0.1],
        y: [0, -30, 0],
        rotate: [0, 15, -15, 0]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      style={{ position: 'absolute', top, left }}
      className="text-primary"
    >
      <Icon className="w-20 h-20 blur-[2px]" />
    </motion.div>
  );
}

function FeaturePoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-foreground/70 group-hover:text-foreground transition-colors">{text}</span>
    </div>
  );
}
