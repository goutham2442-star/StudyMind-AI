'use client';

import { 
  LayoutDashboard, 
  BookOpen, 
  Upload, 
  MessageSquare, 
  Bookmark,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dash', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Library', href: '/library', icon: BookOpen },
    { label: 'Chat', href: '/chat', icon: MessageSquare },
    { label: 'Saved', href: '/saved', icon: Bookmark },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0D0D14]/80 backdrop-blur-xl border-t border-[#1E1E2E] z-50 px-4 pb-4">
      <div className="flex items-center justify-between h-full relative">
        {navItems.slice(0, 2).map((item) => (
          <MobileNavItem key={item.href} {...item} active={pathname === item.href} />
        ))}

        {/* Center Upload Button */}
        <div className="relative -top-6">
          <Link href="/upload">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-glow text-white border-4 border-[#0D0D14]"
            >
              <Plus className="w-8 h-8" />
            </motion.div>
          </Link>
        </div>

        {navItems.slice(2).map((item) => (
          <MobileNavItem key={item.href} {...item} active={pathname === item.href} />
        ))}
      </div>
    </nav>
  );
}

function MobileNavItem({ label, href, icon: Icon, active }: any) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
        active ? "text-primary" : "text-muted"
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      {active && (
        <motion.div 
          layoutId="mobile-nav-active"
          className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full shadow-glow"
        />
      )}
    </Link>
  );
}
