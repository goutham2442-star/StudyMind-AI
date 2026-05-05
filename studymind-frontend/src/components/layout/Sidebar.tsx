'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Upload, 
  MessageSquare, 
  Bookmark, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Calendar as CalendarIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, Tooltip } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) setIsCollapsed(JSON.parse(saved));

    supabase.auth.getUser().then(({ data }: any) => {
      setUser(data.user);
    });
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Library', href: '/library', icon: BookOpen },
    { label: 'Study Planner', href: '/planner', icon: CalendarIcon },
    { label: 'Upload Paper', href: '/upload', icon: Upload, isCta: true },
    { label: 'Chat History', href: '/chat', icon: MessageSquare },
    { label: 'Saved Questions', href: '/saved', icon: Bookmark },
  ];

  const bottomItems = [
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help', href: '/help', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 260 }}
      className="hidden lg:flex flex-col h-screen fixed left-0 top-0 bg-[#050508]/80 backdrop-blur-2xl border-r border-white/5 z-40 transition-all duration-500 shadow-[20px_0_40px_rgba(0,0,0,0.3)]"
    >
      {/* Logo Section */}
      <div className={cn("p-8 mb-4 flex items-center gap-4", isCollapsed && "justify-center px-0")}>
        <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shrink-0 shadow-glow relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 animate-shimmer pointer-events-none" />
          <GraduationCap className="text-white w-6 h-6 relative z-10" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-heading font-black text-xl tracking-tight text-glow">StudyMind</span>
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] opacity-80">Academic Intelligence</span>
          </div>
        )}
      </div>

      {/* Nav Section */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavItem 
            key={item.href} 
            {...item} 
            active={pathname === item.href} 
            collapsed={isCollapsed} 
          />
        ))}
        
        <div className="my-6 border-t border-white/5 mx-4" />

        {bottomItems.map((item) => (
          <NavItem 
            key={item.href} 
            {...item} 
            active={pathname === item.href} 
            collapsed={isCollapsed} 
          />
        ))}
      </div>

      {/* User Section */}
      <div className="p-6 mt-auto bg-white/2 border-t border-white/5">
        <div className={cn("flex items-center gap-4", isCollapsed && "justify-center")}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity" />
            <Avatar 
              name={user?.user_metadata?.full_name || 'User'} 
              size={isCollapsed ? 'sm' : 'md'} 
              className="relative border border-white/10"
            />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate tracking-tight">
                {user?.user_metadata?.full_name || 'Student'}
              </p>
              <p className="text-[9px] text-muted truncate uppercase tracking-widest font-black opacity-50">
                {user?.user_metadata?.university || 'University AI'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-error/10 text-muted hover:text-error transition-all border border-transparent hover:border-error/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-24 w-6 h-6 bg-[#050508] border border-white/10 rounded-full flex items-center justify-center text-muted hover:text-primary transition-all shadow-[10px_0_20px_rgba(0,0,0,0.5)] z-50 group"
      >
        {isCollapsed ? <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />}
      </button>
    </motion.aside>
  );
}

function NavItem({ label, href, icon: Icon, active, collapsed, isCta }: any) {
  const content = (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
        active 
          ? "bg-white/4 text-white shadow-[0_0_20px_rgba(79,142,247,0.1)] border border-white/5" 
          : "text-muted hover:bg-white/2 hover:text-foreground",
        isCta && !active && "bg-linear-to-r from-primary/5 to-secondary/5 border border-primary/10",
        collapsed && "justify-center px-0"
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full shadow-glow"
        />
      )}
      
      <Icon className={cn(
        "w-5 h-5 shrink-0 transition-all duration-300",
        active ? "text-primary scale-110" : "group-hover:text-primary group-hover:scale-110",
        isCta && "text-primary"
      )} />
      
      {!collapsed && (
        <span className={cn(
          "text-sm font-bold tracking-tight transition-colors",
          active ? "text-white" : "text-muted group-hover:text-foreground"
        )}>
          {label}
        </span>
      )}

      {isCta && !collapsed && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      )}
    </Link>
  );

  if (collapsed) {
    return <Tooltip content={label} placement="right">{content}</Tooltip>;
  }

  return content;
}
