'use client';

import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  FileText, 
  History, 
  Plus, 
  MoreVertical,
  MessageSquare,
  Clock,
  Eye,
  ChevronLeft
} from 'lucide-react';
import { Badge, Button, Avatar } from '@/components/ui';
import { cn, generateColor } from '@/lib/utils';
import Link from 'next/link';

interface PaperPanelProps {
  paper: any;
  sessions: any[];
  currentSessionId: string | null;
  onSessionSelect: (id: string) => void;
  onNewSession: () => void;
}

export function PaperPanel({ paper, sessions, currentSessionId, onSessionSelect, onNewSession }: PaperPanelProps) {
  const color = generateColor(paper.subject);

  return (
    <aside className="w-[280px] bg-[#0D0D14] border-r border-border-accent flex flex-col h-full overflow-hidden">
      {/* Paper Info */}
      <div className="p-6 space-y-6">
        <Link href="/library" className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors uppercase tracking-widest group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Library
        </Link>

        <div className="space-y-4">
          <div 
            className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden shadow-glow"
            style={{ backgroundColor: color + '20' }}
          >
            <FileText className="w-12 h-12" style={{ color }} />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            <Badge size="sm" className="absolute bottom-3 left-3">{paper.subject}</Badge>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold leading-snug line-clamp-2">{paper.title}</h2>
            <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-widest">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {paper.exam_year}</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {paper.page_count}p</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {paper.view_count || 0}</span>
            </div>
          </div>
          
          <Button variant="secondary" size="sm" className="w-full h-9 text-[10px] font-black uppercase">
            Preview PDF
          </Button>
        </div>
      </div>

      <div className="px-6 py-2">
        <div className="h-px bg-border-accent/30 w-full" />
        <div className="flex items-center justify-between mt-4 mb-2">
          <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Study Sessions</h3>
          <button 
            onClick={onNewSession}
            className="p-1 rounded-md hover:bg-primary/10 text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar space-y-1">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSessionSelect(session.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group",
              currentSessionId === session.id 
                ? "bg-primary/10 border border-primary/20 shadow-glow" 
                : "hover:bg-surface-2 border border-transparent"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              currentSessionId === session.id ? "bg-primary text-white" : "bg-surface-2 text-muted"
            )}>
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-xs font-bold truncate",
                currentSessionId === session.id ? "text-foreground" : "text-muted group-hover:text-foreground"
              )}>
                {session.title || 'Untitled Session'}
              </p>
              <p className="text-[9px] text-muted font-medium uppercase mt-0.5">
                {session.messageCount || 0} messages • {session.timeAgo || 'Just now'}
              </p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-foreground transition-all">
              <MoreVertical className="w-4 h-4" />
            </button>
          </button>
        ))}
        
        {sessions.length === 0 && (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center mx-auto text-muted/30">
              <History className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">No sessions yet</p>
          </div>
        )}
      </div>
    </aside>
  );
}
