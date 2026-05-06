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
  ChevronRight,
  Lightbulb,
  GraduationCap,
  Brain
} from 'lucide-react';
import { Button, Card, Avatar, Badge, Skeleton, PaperCardSkeleton, DashboardStatSkeleton } from '@/components/ui';
import { StatsCard } from './StatsCard';
import { PaperCard } from './PaperCard';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ActivityChart = dynamic(() => import('./ActivityChart').then(mod => mod.ActivityChart), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-surface-2 animate-pulse rounded-[32px]" />
});

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 400 
      } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1400px] mx-auto space-y-12 pb-20"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="space-y-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-black uppercase tracking-[0.2em] text-[10px]">
            Academic Workspace
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-none text-glow">
            {greeting}, <span className="text-gradient">{firstName}</span>
          </h2>
          <div className="flex items-center gap-4 text-muted/60 text-[11px] font-bold uppercase tracking-[0.15em]">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>{stats.totalPapers} Papers</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted/20" />
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-secondary" />
              <span>{stats.totalQuestions} Questions</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted/20" />
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{stats.streak} Day Streak</span>
            </div>
          </div>
        </div>
        
        <Link href="/upload">
          <Button size="lg" className="h-14 px-8 rounded-2xl group shadow-glow-lg bg-linear-to-r from-primary to-primary-dark border-none">
            Analyze New Paper 
            <div className="ml-3 w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-all duration-500">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </Button>
        </Link>
      </motion.div>

      {/* Primary Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Library Size" 
          value={stats.totalPapers} 
          icon={BookOpen} 
          color="blue" 
          change={12} 
        />
        <StatsCard 
          title="AI Insights" 
          value={stats.totalQuestions} 
          icon={Brain} 
          color="violet" 
          change={8} 
        />
        <StatsCard 
          title="Study Hours" 
          value={stats.totalSessions} 
          icon={Clock} 
          color="teal" 
          change={-3} 
        />
        <StatsCard 
          title="Mastery Streak" 
          value={stats.streak} 
          icon={Flame} 
          color="orange" 
          change={100} 
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* Motivation Banner */}
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[32px] bg-linear-to-r from-primary/20 to-secondary/20 p-8 border border-white/5 group">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="text-primary w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Daily Motivation</p>
                <h3 className="text-xl font-heading font-black italic tracking-tight">"The secret of getting ahead is getting started."</h3>
                <p className="text-[11px] text-muted-dark font-bold">— Mark Twain</p>
              </div>
            </div>
            {/* Abstract Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-20 -mt-20 animate-pulse" />
          </motion.div>

          {/* Recent Papers Carousel */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h3 className="text-xl font-heading font-black tracking-tight">Recent Analysis</h3>
              </div>
              <Link href="/library" className="group text-[10px] font-black text-muted hover:text-primary flex items-center gap-2 uppercase tracking-[0.2em] transition-all">
                Explore Library <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {recentPapers.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-6 px-2 snap-x custom-scrollbar -mx-2">
                {recentPapers.map((paper) => (
                  <div key={paper.id} className="snap-start shrink-0">
                    <PaperCard {...paper} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-[32px] p-16 text-center border-dashed space-y-6">
                <div className="w-20 h-20 bg-surface-2 rounded-3xl flex items-center justify-center mx-auto text-muted/30 border border-white/5">
                  <Upload className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold">Your library is empty</p>
                  <p className="text-muted text-sm max-w-xs mx-auto">Upload an exam paper and let StudyMind AI generate comprehensive model answers for you.</p>
                </div>
                <Link href="/upload">
                  <Button variant="secondary" className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">Start First Analysis</Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Activity Visualizer */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-1.5 h-6 bg-secondary rounded-full" />
              <h3 className="text-xl font-heading font-black tracking-tight">Activity Heatmap</h3>
            </div>
            <div className="glass-card rounded-[32px] p-8">
              <ActivityChart data={activityData} mostActiveSubject="Engineering Mathematics" />
            </div>
          </motion.div>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-4 space-y-12">
          {/* Continue Learning */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-accent rounded-full" />
              <h3 className="text-xl font-heading font-black tracking-tight text-glow">Resume Sessions</h3>
            </div>
            <div className="space-y-4">
              {chatSessions.length > 0 ? (
                chatSessions.map((session) => (
                  <Card key={session.id} hover className="group p-5 bg-surface-2/40 border-white/5 hover:border-primary/20 transition-all duration-500 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <Badge size="sm" className="bg-white/5 text-muted-dark border-transparent font-black uppercase tracking-widest text-[8px]">
                        {session.paper.subject}
                      </Badge>
                      <span className="text-[9px] text-muted-dark font-black uppercase tracking-widest">{session.timeAgo}</span>
                    </div>
                    <h4 className="text-sm font-bold truncate mb-4 group-hover:text-primary transition-colors">{session.paper.title}</h4>
                    <Link href={`/chat/${session.paper_id}`}>
                      <Button variant="ghost" size="sm" className="w-full h-10 text-[9px] uppercase font-black tracking-[0.2em] bg-white/5 hover:bg-primary hover:text-white transition-all rounded-xl border border-white/5">
                        Resume Session <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </Card>
                ))
              ) : (
                <div className="glass p-8 rounded-[32px] text-center border-dashed opacity-40">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">No active sessions</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Productivity Tools */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary/40 rounded-full" />
              <h3 className="text-xl font-heading font-black tracking-tight">Productivity</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <QuickActionCard 
                title="Library Sync" 
                desc="Manage your academic vault" 
                icon={Grid} 
                href="/library" 
                color="text-primary"
              />
              <QuickActionCard 
                title="Knowledge Base" 
                desc="Explore saved AI insights" 
                icon={Bookmark} 
                href="/saved" 
                color="text-secondary"
              />
            </div>
          </motion.div>

          {/* Student Pro-Tip */}
          <motion.div variants={itemVariants} className="glass-card rounded-[32px] p-8 border border-primary/10 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-primary">Student Pro-Tip</h4>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                Try asking the AI for a <strong>"Summary for a 5-year-old"</strong> first to grasp the intuition before diving into complex model answers.
              </p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        </div>
      </div>
    </motion.div>
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
