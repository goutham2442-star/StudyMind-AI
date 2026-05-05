import { createServerClient } from '@/lib/supabase/server';
import { LibraryClient } from '@/components/library/LibraryClient';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paper Library — StudyMind AI',
  description: 'Explore our vast collection of university exam papers. Filter by subject, year, or department to find exactly what you need.',
};

export const dynamic = 'force-dynamic';

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Initial fetch for first 12 papers
  let query = supabase
    .from('papers')
    .select('*, profiles(university)', { count: 'exact' });

  // Apply basic initial filters from searchParams if any
  const q = searchParams.q as string;
  const subject = searchParams.subject as string;
  const year = searchParams.year as string;
  const tab = searchParams.tab as string;

  if (q) query = query.or(`title.ilike.%${q}%,subject.ilike.%${q}%`);
  if (subject && subject !== 'All Subjects') query = query.eq('subject', subject);
  if (year && year !== 'All Years') query = query.eq('exam_year', parseInt(year));
  
  if (tab === 'my') {
    query = query.eq('user_id', session.user.id);
  } else {
    query = query.eq('is_public', true);
  }

  query = query.order('created_at', { ascending: false }).range(0, 11);

  const { data: papers, count, error } = await query;

  if (error) {
    console.error('Library fetch error:', error);
  }

  return (
    <LibraryClient 
      initialPapers={papers || []} 
      totalCount={count || 0} 
    />
  );
}
