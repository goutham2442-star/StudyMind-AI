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
  GraduationCap
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

    supabase.auth.getUser().then(({ data }) => {
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
      className="hidden lg:flex flex-col h-screen fixed left-0 top-0 bg-[#0D0D14] border-r border-[#1E1E2E] z-40 transition-all duration-300"
    >
      {/* Logo Section */}
      <div className={cn("p-6 flex items-center gap-3", isCollapsed && "justify-center px-0")}>
        <div className="w-8 h-8 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center shrink-0 shadow-glow">
          <GraduationCap className="text-white w-5 h-5" />
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-lg">StudyMind</span>
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Beta</span>
          </div>
        )}
      </div>

      {/* Nav Section */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavItem 
            key={item.href} 
            {...item} 
            active={pathname === item.href} 
            collapsed={isCollapsed} 
          />
        ))}
        
        <div className="my-4 border-t border-border-accent/30 mx-3" />

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
      <div className="p-4 mt-auto border-t border-border-accent/30">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <Avatar 
            name={user?.user_metadata?.full_name || 'User'} 
            size={isCollapsed ? 'sm' : 'md'} 
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {user?.user_metadata?.full_name || 'Student'}
              </p>
              <p className="text-[10px] text-muted truncate uppercase tracking-widest">
                {user?.user_metadata?.university || 'University'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-error/10 text-muted hover:text-error transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 bg-surface border border-border-accent rounded-full flex items-center justify-center text-muted hover:text-primary transition-all shadow-xl"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
}

function NavItem({ label, href, icon: Icon, active, collapsed, isCta }: any) {
  const content = (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-primary/10 text-foreground" 
          : "text-muted hover:bg-surface-2 hover:text-foreground",
        isCta && !active && "bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20",
        collapsed && "justify-center px-0"
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
        />
      )}
      
      <Icon className={cn(
        "w-5 h-5 shrink-0 transition-colors",
        active ? "text-primary" : "group-hover:text-primary",
        isCta && "text-primary"
      )} />
      
      {!collapsed && (
        <span className={cn(
          "text-sm font-medium",
          active && "font-bold"
        )}>
          {label}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return <Tooltip content={label} placement="right">{content}</Tooltip>;
  }

  return content;
}
