'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (!session) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow"
        >
          <GraduationCap className="text-white w-8 h-8" />
        </motion.div>
        <p className="text-muted text-sm font-bold animate-pulse tracking-widest uppercase">
          Verifying Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* App Shell */}
      <Sidebar />
      
      <div className="lg:pl-(--sidebar-width) transition-all duration-300">
        <Topbar />
        <main className="p-4 md:p-8 pb-32 lg:pb-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      <MobileNav />
      <CommandPalette />

      {/* Sidebar Width Variable Sync */}
      <style jsx global>{`
        :root {
          --sidebar-width: ${isLoading ? '0px' : '260px'};
        }
        @media (max-width: 1024px) {
          :root {
            --sidebar-width: 0px;
          }
        }
      `}</style>
    </div>
  );
}
