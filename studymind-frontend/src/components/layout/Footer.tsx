'use client';

import { GraduationCap, Globe, MessageCircle, Users, Camera } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-white/5 pt-32 pb-16 px-8 md:px-16 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24 relative z-10">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-[14px] flex items-center justify-center shadow-glow transition-transform group-hover:scale-110 duration-500">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-black tracking-tight text-glow">StudyMind</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-80">Academic Intelligence</span>
            </div>
          </div>
          <p className="text-muted text-base leading-relaxed max-w-sm font-medium opacity-70">
            Empowering students with AI-driven academic intelligence. Master your subjects, navigate complex papers, and ace your university examinations with the power of Gemini.
          </p>
          <div className="flex items-center gap-3">
            <SocialLink href="#" icon={MessageCircle} />
            <SocialLink href="#" icon={Globe} />
            <SocialLink href="#" icon={Users} />
            <SocialLink href="#" icon={Camera} />
          </div>
        </div>

        {/* Links Columns */}
        <div>
          <h4 className="font-black mb-8 text-foreground uppercase tracking-[0.2em] text-[11px] opacity-40">Product</h4>
          <ul className="space-y-4 text-sm font-bold text-muted">
            <li><Link href="#features" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Features</Link></li>
            <li><Link href="#how-it-works" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">How it works</Link></li>
            <li><Link href="/pricing" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Pricing</Link></li>
            <li><Link href="/papers" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Public Papers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-8 text-foreground uppercase tracking-[0.2em] text-[11px] opacity-40">Company</h4>
          <ul className="space-y-4 text-sm font-bold text-muted">
            <li><Link href="/about" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-8 text-foreground uppercase tracking-[0.2em] text-[11px] opacity-40">Legal</h4>
          <ul className="space-y-4 text-sm font-bold text-muted">
            <li><Link href="/privacy" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Terms of Service</Link></li>
            <li><Link href="/cookies" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
          © {new Date().getFullYear()} StudyMind AI. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-success">All Systems Operational</span>
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
    </footer>
  );
}

function SocialLink({ href, icon: Icon }: any) {
  return (
    <a 
      href={href} 
      className="w-11 h-11 rounded-[14px] bg-white/3 border border-white/5 flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group shadow-sm"
    >
      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    </a>
  );
}
