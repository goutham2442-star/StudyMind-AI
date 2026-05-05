'use client';

import { Search, Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/components/ui';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function Topbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-16 border-b border-border-accent bg-background/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-heading font-bold text-foreground">
          {getPageTitle()}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted font-medium">
          <span className="opacity-50">/</span>
          <span>App</span>
          <span className="opacity-50">/</span>
          <span className="text-primary">{getPageTitle()}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-2 group"
        >
          <Search className="w-5 h-5" />
          <span className="hidden lg:inline text-xs font-bold bg-surface-2 px-1.5 py-0.5 rounded border border-border-accent group-hover:border-primary/30">
            ⌘K
          </span>
        </button>

        <button className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background" />
        </button>

        <div className="w-px h-6 bg-border-accent mx-2" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none">
              {user?.user_metadata?.full_name || 'Student'}
            </p>
            <p className="text-[10px] text-muted leading-none mt-1 uppercase tracking-widest">
              {user?.user_metadata?.university || 'University'}
            </p>
          </div>
          <Avatar 
            name={user?.user_metadata?.full_name || 'User'} 
            size="sm" 
          />
        </div>
      </div>
    </header>
  );
}
