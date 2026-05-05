import { createServerClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

export const metadata: Metadata = {
  title: 'Dashboard — StudyMind AI',
  description: 'Manage your academic papers, track your study progress, and continue your AI-powered learning sessions.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Use cached fetching for dashboard data
  const getDashboardData = unstable_cache(
    async (userId: string, token: string) => {
      const res = await fetch(`http://localhost:8000/api/stats/dashboard/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return res.json();
    },
    [`dashboard-${session.user.id}`],
    { revalidate: 60, tags: [`dashboard-${session.user.id}`] }
  );

  const dashboardData = await getDashboardData(session.user.id, session.access_token);

  const stats = {
    totalPapers: dashboardData.total_papers || 0,
    totalQuestions: dashboardData.total_questions || 0,
    totalSessions: dashboardData.total_sessions || 0,
    streak: dashboardData.study_streak || 0,
  };

  const papers = dashboardData.recent_papers || [];
  const chatSessions = dashboardData.recent_sessions || [];
  const activityData = dashboardData.activity || [];

  return (
    <DashboardClient 
      user={session.user}
      stats={stats}
      recentPapers={papers}
      chatSessions={chatSessions.map((s: any) => ({
        ...s,
        timeAgo: 'Just now'
      }))}
      activityData={activityData}
    />
  );
}
