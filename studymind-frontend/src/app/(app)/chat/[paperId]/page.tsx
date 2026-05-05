import { Metadata } from 'next';
import ChatClient from './ChatClient';
import { createServerClient } from '@/lib/supabase/server';

interface Props {
  params: { paperId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createServerClient();
  const { data: paper } = await supabase
    .from('papers')
    .select('title, subject')
    .eq('id', params.paperId)
    .single();

  return {
    title: paper ? `${paper.title} — AI Tutor` : 'Chat — StudyMind AI',
    description: paper 
      ? `AI-powered discussion and tutoring for ${paper.title} (${paper.subject}).`
      : 'Interactive AI tutoring session for your academic papers.',
  };
}

export default function Page() {
  return <ChatClient />;
}
