import { supabase } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch initial data in parallel
  const [
    { data: profile },
    { data: papers },
    { data: chatSessions },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('papers').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('chat_sessions').select('*, paper:papers(*)').eq('user_id', session.user.id).order('updated_at', { ascending: false }).limit(3),
  ]);

  // Mock stats for demonstration if database is empty
  const stats = {
    totalPapers: profile?.total_papers || 0,
    totalQuestions: profile?.total_questions || 0,
    totalSessions: chatSessions?.length || 0,
    streak: profile?.study_streak || 0,
  };

  // Mock activity data for the chart
  const activityData = [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 12 },
    { day: 'Fri', count: 8 },
    { day: 'Sat', count: 2 },
    { day: 'Sun', count: 0 },
    { day: 'Mon', count: 6 },
    { day: 'Tue', count: 9 },
    { day: 'Wed', count: 14 },
    { day: 'Thu', count: 11 },
    { day: 'Fri', count: 15 },
    { day: 'Sat', count: 3 },
    { day: 'Sun', count: 1 },
  ];

  return (
    <DashboardClient 
      user={session.user}
      stats={stats}
      recentPapers={papers || []}
      chatSessions={chatSessions?.map(s => ({
        ...s,
        timeAgo: '2h ago' // Simplified for now
      })) || []}
      activityData={activityData}
    />
  );
}
