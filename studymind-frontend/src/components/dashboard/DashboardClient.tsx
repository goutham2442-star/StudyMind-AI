'use client';

import { motion } from 'framer-motion';
import { 
  Plus, 
  ArrowRight, 
  BookOpen, 
  MessageSquare, 
  Clock, 
  Flame, 
  Upload, 
  Grid, 
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { Button, Card, Avatar, Badge, Skeleton, PaperCardSkeleton, DashboardStatSkeleton } from '@/components/ui';
import { StatsCard } from './StatsCard';
import { PaperCard } from './PaperCard';
import { ActivityChart } from './ActivityChart';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardClientProps {
  user: any;
  stats: any;
  recentPapers: any[];
  chatSessions: any[];
  activityData: any[];
}

export function DashboardClient({ user, stats, recentPapers, chatSessions, activityData }: DashboardClientProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-heading font-black tracking-tight">
            {greeting}, {firstName} 👋
          </h2>
          <p className="text-muted text-sm font-medium">
            You have <span className="text-primary font-bold">{stats.totalPapers}</span> papers · 
            <span className="text-secondary font-bold"> {stats.totalQuestions}</span> questions asked · 
            <span className="text-orange-500 font-bold"> {stats.streak}</span> day streak 🔥
          </p>
        </div>
        <Link href="/upload">
          <Button className="h-12 px-6 rounded-xl group shadow-glow">
            Upload New Paper <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Papers" 
          value={stats.totalPapers} 
          icon={BookOpen} 
          color="blue" 
          change={12} 
        />
        <StatsCard 
          title="Questions Asked" 
          value={stats.totalQuestions} 
          icon={MessageSquare} 
          color="violet" 
          change={8} 
        />
        <StatsCard 
          title="Study Sessions" 
          value={stats.totalSessions} 
          icon={Clock} 
          color="teal" 
          change={-3} 
        />
        <StatsCard 
          title="Current Streak" 
          value={stats.streak} 
          icon={Flame} 
          color="orange" 
          change={100} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Papers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading font-bold">Recent Papers</h3>
            <Link href="/library" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentPapers.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x custom-scrollbar">
              {recentPapers.map((paper) => (
                <PaperCard key={paper.id} {...paper} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center border-dashed space-y-4">
              <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto text-muted">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-muted text-sm font-medium">Upload your first paper to get started</p>
              <Link href="/upload">
                <Button variant="secondary" size="sm">Upload Paper</Button>
              </Link>
            </div>
          )}

          {/* Activity Chart */}
          <ActivityChart data={activityData} mostActiveSubject="Computer Networks" />
        </div>

        {/* Sidebar: Continue & Actions */}
        <div className="space-y-8">
          {/* Continue Studying */}
          {chatSessions.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-heading font-bold">Continue Studying</h3>
              <div className="space-y-4">
                {chatSessions.map((session) => (
                  <Card key={session.id} hover className="group">
                    <div className="flex items-center justify-between mb-2">
                      <Badge size="sm">{session.paper.subject}</Badge>
                      <span className="text-[10px] text-muted font-bold uppercase tracking-tighter">{session.timeAgo}</span>
                    </div>
                    <h4 className="text-sm font-bold truncate mb-3">{session.paper.title}</h4>
                    <Link href={`/chat/${session.id}`}>
                      <Button variant="ghost" size="sm" className="w-full h-8 text-[10px] uppercase font-bold group-hover:bg-primary group-hover:text-white transition-all">
                        Continue <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-bold">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <QuickActionCard 
                title="Upload New Paper" 
                desc="Add papers to your library" 
                icon={Upload} 
                href="/upload" 
                color="text-primary"
              />
              <QuickActionCard 
                title="Browse Library" 
                desc="Find papers from your department" 
                icon={Grid} 
                href="/library" 
                color="text-secondary"
              />
              <QuickActionCard 
                title="Saved Questions" 
                desc="Review bookmarked answers" 
                icon={Bookmark} 
                href="/saved" 
                color="text-success"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, desc, icon: Icon, href, color }: any) {
  return (
    <Link href={href}>
      <Card hover className="group flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center group-hover:shadow-glow transition-all", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-[10px] text-muted uppercase tracking-widest">{desc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-all" />
      </Card>
    </Link>
  );
}
