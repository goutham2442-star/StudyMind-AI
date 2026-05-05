import { createServerClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch dashboard stats from FastAPI
  const statsRes = await fetch(`http://localhost:8000/api/stats/dashboard/${session.user.id}`, {
    headers: { 'Authorization': `Bearer ${session.access_token}` },
    cache: 'no-store'
  });
  
  const dashboardData = await statsRes.json();

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
