'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Brain, 
  BookOpen, 
  Target, 
  FileText, 
  History, 
  Users,
  Upload as UploadIcon,
  Search,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Button, Card, Badge, Avatar } from '@/components/ui';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';

// --- Components ---

const Section = ({ children, className, id }: any) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={cn("py-24 px-6 md:px-12", className)}
  >
    {children}
  </motion.section>
);

const AnimatedNumber = ({ value }: { value: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const numericValue = parseInt(value.replace(/,/g, '')) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const end = numericValue;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / end));
        
        const timer = setInterval(() => {
          start += Math.ceil(end / 100);
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 20);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericValue]);

  return <span ref={ref}>{count.toLocaleString()}{value.includes('+') ? '+' : ''}{value.includes('%') ? '%' : ''}</span>;
};

// --- Page ---

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-30" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-secondary/20 blur-[120px] rounded-full opacity-30" 
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full opacity-20" 
        />
      </div>

      {/* Hero Section */}
      <Section className="pt-40 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-4 py-1.5 rounded-full glass border-primary/30 text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-8 animate-shimmer bg-linear-to-r from-transparent via-white/5 to-transparent bg-size-[200%_100%]"
        >
          <Sparkles className="w-3 h-3 text-warning" /> ✨ Powered by Gemini AI
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-8xl font-heading font-extrabold leading-[1.05] tracking-tight max-w-5xl"
        >
          Study Smarter. <br />
          <span className="text-gradient">Score Higher.</span>
        </motion.h1>

        <motion.p 
          className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed font-sans"
        >
          Upload your past papers, ask questions, and get instant AI-powered explanations tailored to your university syllabus.
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Link href="/register">
            <Button size="lg" className="px-10 py-5 text-lg rounded-2xl group">
              Start For Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="ghost" className="px-10 py-5 text-lg rounded-2xl">
            <Play className="w-5 h-5 mr-2 fill-current" /> Watch Demo
          </Button>
        </motion.div>

        <motion.p className="mt-8 text-xs font-bold text-muted uppercase tracking-widest">
          Free to use · No credit card · 10,000+ students
        </motion.p>

        {/* Hero Mockup */}
        <motion.div 
          className="mt-24 w-full max-w-5xl relative group"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 opacity-50 group-hover:opacity-80 transition-opacity" />
          <Card padding="none" className="overflow-hidden border-primary/20 shadow-2xl bg-surface/90">
            {/* Mockup Header */}
            <div className="bg-surface-2/80 px-6 py-4 border-b border-border-accent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-primary w-5 h-5" />
                <span className="font-bold text-sm">Computer Networks — 2023 Paper</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error/50" />
                <div className="w-3 h-3 rounded-full bg-warning/50" />
                <div className="w-3 h-3 rounded-full bg-success/50" />
              </div>
            </div>
            {/* Mockup Chat */}
            <div className="p-8 space-y-6 text-left font-sans">
              <div className="flex gap-4 max-w-[80%]">
                <Avatar name="User" size="sm" />
                <div className="glass p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm">Explain TCP/IP handshake from question 3</p>
                </div>
              </div>
              <div className="flex gap-4 max-w-[90%] ml-auto flex-row-reverse">
                <div className="w-8 h-8 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                  <Brain className="text-white w-5 h-5" />
                </div>
                <div className="bg-surface-2 p-6 rounded-2xl rounded-tr-none border border-primary/20">
                  <div className="text-sm prose prose-invert prose-sm leading-relaxed">
                    <ReactMarkdown>
                      {`The **TCP 3-way handshake** is the process used to establish a reliable connection.
                    
1. **SYN**: The client sends a synchronize packet.
2. **SYN-ACK**: The server responds with an acknowledgment.
3. **ACK**: The client sends a final acknowledgment.

This ensures both sides are ready to transmit data.`}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Section>

      {/* Stats Bar */}
      <div className="w-full bg-surface-2 border-y border-border-accent py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          <StatItem label="Papers Uploaded" value="10,000+" />
          <div className="hidden md:block w-px h-12 bg-border-accent" />
          <StatItem label="Questions Answered" value="50,000+" />
          <div className="hidden md:block w-px h-12 bg-border-accent" />
          <StatItem label="Students Improved" value="98%" />
        </div>
      </div>

      {/* Features Grid */}
      <Section id="features">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">Everything you need to ace your exams</h2>
          <p className="text-muted max-w-2xl mx-auto">Powerful AI features designed specifically for the academic needs of university students.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FeatureCard 
            icon={Brain} 
            title="AI Question Answering" 
            description="Ask anything about your paper. Get instant, step-by-step explanations for even the toughest questions."
            color="text-primary"
          />
          <FeatureCard 
            icon={BookOpen} 
            title="Past Paper Library" 
            description="Browse a massive collection of past papers from all departments, uploaded and curated by fellow students."
            color="text-secondary"
          />
          <FeatureCard 
            icon={Target} 
            title="Exam Question Generator" 
            description="Our AI predicts potential exam questions based on historical patterns in your past papers."
            color="text-success"
          />
          <FeatureCard 
            icon={FileText} 
            title="Smart Summaries" 
            description="Get the essence of any document in seconds. We extract key concepts and formulas automatically."
            color="text-warning"
          />
          <FeatureCard 
            icon={History} 
            title="Study Sessions" 
            description="Every question you ask and every paper you upload is saved forever in your personal learning history."
            color="text-error"
          />
          <FeatureCard 
            icon={Users} 
            title="Share With Classmates" 
            description="Collaborate on difficult papers. Share insights, summaries, and AI explanations with your study group."
            color="text-teal-400"
          />
        </div>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" className="bg-surface/30">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">Get started in 3 simple steps</h2>
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute top-24 left-0 w-full h-0.5 border-t-2 border-dashed border-border-accent hidden lg:block -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <StepCard 
              step="1" 
              title="Upload" 
              description="Drop your PDF exam paper into your personal dashboard."
              icon={UploadIcon}
              bg="bg-surface"
            />
            <StepCard 
              step="2" 
              title="Ask" 
              description="Type any question about the paper and get instant detailed AI answers."
              icon={Search}
              bg="bg-surface-2"
            />
            <StepCard 
              step="3" 
              title="Ace" 
              description="Review personalized insights and ace your university examinations."
              icon={CheckCircle}
              bg="bg-surface"
            />
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">Loved by students across universities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <TestimonialCard 
            quote="This helped me pass my finals! The AI explained past paper answers better than my textbook."
            author="Priya S."
            university="Anna University"
            initials="PS"
          />
          <TestimonialCard 
            quote="I uploaded 5 years of papers and now I'm fully prepared. Game changer."
            author="Rahul M."
            university="VIT Chennai"
            initials="RM"
          />
          <TestimonialCard 
            quote="The exam question predictor is scary accurate. Got 3 out of 5 right!"
            author="Aisha K."
            university="SRM University"
            initials="AK"
          />
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-32">
        <div className="max-w-5xl mx-auto bg-linear-to-r from-primary to-secondary rounded-[40px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-glow">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[80px] rounded-full -ml-32 -mb-32" />
          
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-6">Ready to transform how you study?</h2>
          <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">Join 10,000+ students already using StudyMind AI to master their academics.</p>
          
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-xl px-12 py-6 rounded-2xl shadow-xl">
              Get Started Free <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}

// --- Internal Helper Components ---

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <h3 className="text-4xl font-heading font-extrabold mb-2">
        <AnimatedNumber value={value} />
      </h3>
      <p className="text-muted text-sm font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  return (
    <Card hover padding="lg" className="flex flex-col gap-4 group">
      <motion.div 
        whileHover={{ y: -5 }}
        className={cn("w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center transition-all group-hover:shadow-glow", color)}
      >
        <Icon className="w-7 h-7" />
      </motion.div>
      <h3 className="text-xl font-heading font-bold mt-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </Card>
  );
}

function StepCard({ step, title, description, icon: Icon, bg }: any) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center relative mb-8 shadow-xl transition-transform group-hover:scale-110", bg)}>
        <span className="absolute -top-4 -left-4 w-10 h-10 bg-linear-to-br from-primary to-secondary text-white font-black text-xl rounded-2xl flex items-center justify-center shadow-glow">
          {step}
        </span>
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-heading font-bold mb-4">{title}</h3>
      <p className="text-muted max-w-[200px] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, university, initials }: any) {
  return (
    <Card padding="lg" className="flex flex-col gap-6 relative">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-warning text-warning" />
        ))}
      </div>
      <p className="text-foreground italic leading-relaxed text-sm">"{quote}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-border-accent/30">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-sm">
          {initials}
        </div>
        <div className="text-left">
          <p className="font-bold text-sm">{author}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">{university}</p>
        </div>
      </div>
    </Card>
  );
}
