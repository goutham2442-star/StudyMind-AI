'use client';

import { motion } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  Eye, 
  Bookmark, 
  Layers, 
  Globe, 
  Lock,
  ExternalLink,
  Plus,
  School
} from 'lucide-react';
import { Badge, Button, Card, Tooltip } from '@/components/ui';
import { cn, generateColor } from '@/lib/utils';
import Link from 'next/link';

interface LibraryPaperCardProps {
  paper: any;
  onPreview: (paper: any) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export function LibraryPaperCard({ paper, onPreview, isSaved, onToggleSave }: LibraryPaperCardProps) {
  const color = generateColor(paper.subject);
  const isNew = new Date(paper.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full group"
    >
      <Card padding="none" className="flex flex-col h-full border border-white/5 bg-linear-to-br from-white/5 to-transparent relative overflow-hidden rounded-[32px] shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 shadow-glow" style={{ backgroundColor: color }} />
        
        <div className="p-7 flex-1 flex flex-col relative z-10">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Badge size="sm" className="font-black uppercase tracking-widest text-[9px]">{paper.subject}</Badge>
              {isNew && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[8px] font-black uppercase tracking-[0.2em] animate-pulse">
                  <div className="w-1 h-1 rounded-full bg-success" />
                  Recent
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-muted/40">
              {paper.is_public ? (
                <Tooltip content="Institutional Access"><Globe className="w-4 h-4" /></Tooltip>
              ) : (
                <Tooltip content="Private Archive"><Lock className="w-4 h-4" /></Tooltip>
              )}
              <span className="text-[10px] font-black uppercase tracking-tighter">{paper.exam_year}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            className="text-lg font-black leading-tight mb-5 hover:text-primary transition-colors cursor-pointer text-glow tracking-tight line-clamp-2" 
            onClick={() => onPreview(paper)}
          >
            {paper.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-5 text-muted text-[9px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary/60" />
              {paper.page_count} Pages
            </div>
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-secondary/60" />
              {paper.profiles?.university?.split(' ')[0] || 'Uni'} System
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {paper.tags?.slice(0, 3).map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-muted/80 uppercase tracking-widest">
                #{tag}
              </span>
            ))}
            {paper.tags?.length > 3 && (
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-primary uppercase tracking-widest">
                +{paper.tags.length - 3}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3">
            <Link href={`/chat/${paper.id}`} className="flex-1">
              <Button size="sm" className="w-full h-11 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-glow group">
                Analyze AI <MessageSquare className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Tooltip content="Full Preview">
                <button 
                  onClick={() => onPreview(paper)}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-all group/btn"
                >
                  <Eye className="w-4.5 h-4.5 transition-transform group-hover/btn:scale-110" />
                </button>
              </Tooltip>
              <Tooltip content={isSaved ? "Unarchive" : "Archive"}>
                <button 
                  onClick={() => onToggleSave?.(paper.id)}
                  className={cn(
                    "w-11 h-11 rounded-xl border flex items-center justify-center transition-all group/btn",
                    isSaved ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-muted hover:text-secondary hover:border-secondary/40"
                  )}
                >
                  <Bookmark className={cn("w-4.5 h-4.5 transition-transform group-hover/btn:scale-110", isSaved && "fill-current")} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

