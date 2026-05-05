'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  BarChart3,
  ChevronRight
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { AccountTab } from '@/components/settings/AccountTab';

const StatsTab = dynamic(() => import('@/components/settings/StatsTab').then(mod => mod.StatsTab), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-surface-2 animate-pulse rounded-2xl" />
});
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalQuestions: 0,
    streak: 0
  });

  const loadData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setUser(authUser);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      setProfile(profileData);
      
      setStats({
        totalPapers: profileData?.total_papers || 0,
        totalQuestions: profileData?.total_questions || 0,
        streak: profileData?.study_streak || 0
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-black tracking-tight">Settings</h1>
        <p className="text-muted text-sm font-medium mt-1">Manage your account and learning preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Navigation */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-2 p-1 bg-surface-2 lg:bg-transparent rounded-2xl border border-border-accent lg:border-none overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group shrink-0",
                  activeTab === tab.id 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-glow" 
                    : "text-muted hover:text-foreground hover:bg-surface-2"
                )}
              >
                <tab.icon size={18} className={cn(activeTab === tab.id ? "text-primary" : "text-muted group-hover:text-primary")} />
                <span className="text-xs font-bold uppercase tracking-widest hidden lg:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <ChevronRight size={14} className="ml-auto hidden lg:inline" />
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <div key={activeTab}>
              {activeTab === 'profile' && (
                <ProfileTab user={user} profile={profile} onUpdate={loadData} />
              )}
              {activeTab === 'preferences' && (
                <PreferencesTab />
              )}
              {activeTab === 'account' && (
                <AccountTab user={user} />
              )}
              {activeTab === 'stats' && (
                <StatsTab stats={stats} profile={profile} />
              )}
            </div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
