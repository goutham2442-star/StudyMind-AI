'use client';

import { Search, Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar } from '@/components/ui';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/login');
  };

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-20 border-b border-white/5 bg-background/40 backdrop-blur-2xl sticky top-0 z-30 px-8 flex items-center justify-between">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-heading font-black text-foreground tracking-tight text-glow">
          {getPageTitle()}
        </h1>
        <div className="hidden lg:flex items-center gap-3 text-[10px] text-muted font-black uppercase tracking-[0.2em] opacity-40">
          <span>App</span>
          <span>/</span>
          <span className="text-primary opacity-100">{getPageTitle()}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLogout}
          className="p-2.5 text-muted hover:text-error hover:bg-error/5 border border-transparent hover:border-error/20 rounded-xl transition-all group lg:hidden"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="h-10 px-4 text-muted hover:text-primary hover:bg-white/5 border border-white/5 hover:border-primary/20 rounded-xl transition-all flex items-center gap-4 group"
        >
          <Search className="w-4 h-4" />
          <div className="hidden lg:flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black border border-white/20 px-1.5 py-0.5 rounded-md bg-white/5">
              ⌘
            </span>
            <span className="text-[10px] font-black border border-white/20 px-1.5 py-0.5 rounded-md bg-white/5">
              K
            </span>
          </div>
        </button>

        <button className="p-2.5 text-muted hover:text-primary hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all relative group">
          <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-background shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        </button>

        <div className="w-px h-8 bg-white/5 mx-2" />

        <Link href="/settings" className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black tracking-tight group-hover:text-primary transition-colors">
              {user?.user_metadata?.full_name || 'Student'}
            </p>
            <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em] mt-1 opacity-50">
              {user?.user_metadata?.university || 'University'}
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity" />
            <Avatar 
              name={user?.user_metadata?.full_name || 'User'} 
              size="sm" 
              className="relative border border-white/10"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
