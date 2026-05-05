'use client';

import { GraduationCap, Globe, MessageCircle, Users, Camera } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border-accent pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Col */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-glow">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight text-foreground">StudyMind AI</span>
          </div>
          <p className="text-muted text-sm leading-relaxed max-w-xs">
            Empowering students with AI-driven academic intelligence. Master your subjects, ace your exams.
          </p>
          <div className="flex items-center gap-4">
            <SocialLink href="#" icon={MessageCircle} />
            <SocialLink href="#" icon={Globe} />
            <SocialLink href="#" icon={Users} />
            <SocialLink href="#" icon={Camera} />
          </div>
        </div>

        {/* Links Col 1 */}
        <div>
          <h4 className="font-bold mb-6 text-foreground uppercase tracking-widest text-xs">Product</h4>
          <ul className="space-y-4 text-sm text-muted">
            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link href="/papers" className="hover:text-primary transition-colors">Public Papers</Link></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div>
          <h4 className="font-bold mb-6 text-foreground uppercase tracking-widest text-xs">Company</h4>
          <ul className="space-y-4 text-sm text-muted">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Links Col 3 */}
        <div>
          <h4 className="font-bold mb-6 text-foreground uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-4 text-sm text-muted">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border-accent/30 text-center">
        <p className="text-muted text-xs font-medium">
          © {new Date().getFullYear()} StudyMind AI. All rights reserved. Built with ❤️ for university students.
        </p>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon }: any) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-xl bg-surface-2 border border-border-accent flex items-center justify-center text-muted hover:text-primary hover:border-primary/50 transition-all"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}
