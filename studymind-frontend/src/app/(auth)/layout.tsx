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
    <div className="min-h-screen w-full flex bg-background overflow-hidden">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-16 overflow-hidden border-r border-border-accent bg-linear-to-b from-[#0A0A0F] to-[#0F0F1A]">
        {/* Floating Background Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingIcon icon={BookOpen} delay={0} top="20%" left="15%" />
          <FloatingIcon icon={Brain} delay={1} top="50%" left="25%" />
          <FloatingIcon icon={GraduationCap} delay={2} top="80%" left="10%" />
          <FloatingIcon icon={Lightbulb} delay={0.5} top="30%" left="75%" />
          <FloatingIcon icon={Star} delay={1.5} top="65%" left="80%" />
        </div>

        {/* Top Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-heading font-extrabold tracking-tight">StudyMind</span>
            <span className="text-xl font-heading font-extrabold text-primary">AI</span>
          </div>
        </Link>

        {/* Center Content */}
        <div className="relative z-10 max-w-sm">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-heading font-bold italic leading-tight mb-4 text-foreground/90"
          >
            "The more that you read, the more things you will know."
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted text-sm font-bold uppercase tracking-widest"
          >
            — Dr. Seuss
          </motion.p>
        </div>

        {/* Bottom Features */}
        <div className="space-y-4 z-10">
          <FeaturePoint text="AI-powered summaries in seconds" />
          <FeaturePoint text="Predicted exam questions" />
          <FeaturePoint text="Universal past paper library" />
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
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
        opacity: 0.15,
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      style={{ position: 'absolute', top, left }}
      className="text-primary"
    >
      <Icon className="w-16 h-16" />
    </motion.div>
  );
}

function FeaturePoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
      </div>
      <span className="text-sm font-medium text-foreground/80">{text}</span>
    </div>
  );
}
