'use client';

import { useState, useEffect } from 'react';
import { PaperPanel } from '@/components/chat/PaperPanel';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { StudyTools } from '@/components/chat/StudyTools';
import { supabase } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatPage() {
  const { paperId } = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTools, setShowTools] = useState(true);

  useEffect(() => {
    const loadPaperData = async () => {
      try {
        // 1. Fetch Paper
        const { data: paperData, error: paperError } = await supabase
          .from('papers')
          .select('*')
          .eq('id', paperId)
          .single();

        if (paperError) throw paperError;
        setPaper(paperData);

        // 2. Fetch Sessions via Proxy
        const sessionRes = await fetch(`/api/chat/sessions/${paperId}`);
        const sessionData = await sessionRes.json();

        if (sessionRes.ok) {
          setSessions(sessionData);
          if (sessionData.length > 0) {
            setCurrentSessionId(sessionData[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setLoading(false);
      }
    };

    if (paperId) loadPaperData();
  }, [paperId]);

  const handleNewSession = async () => {
    // Create new session via Proxy
    const response = await fetch('/api/chat/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paper_id: paperId })
    });

    const newSession = await response.json();

    if (response.ok && newSession) {
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0F] gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow"
        >
          <GraduationCap className="text-white w-8 h-8" />
        </motion.div>
        <p className="text-muted text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Initializing AI Tutor...</p>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0F] gap-4">
        <p className="text-error font-bold">Paper not found</p>
        <button onClick={() => router.push('/library')} className="text-primary hover:underline font-bold">Return to Library</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-100 bg-background flex overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:block shrink-0">
        <PaperPanel 
          paper={paper} 
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={setCurrentSessionId}
          onNewSession={handleNewSession}
        />
      </div>

      {/* Main Chat Area */}
      <ChatInterface 
        paper={paper} 
        showTools={showTools}
        onToggleTools={() => setShowTools(!showTools)}
      />

      {/* Right Panel */}
      {showTools && (
        <div className="hidden xl:block shrink-0">
          <StudyTools paper={paper} />
        </div>
      )}
    </div>
  );
}
