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
  Plus
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
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card hover glow padding="none" className="flex flex-col h-full border-t-4" style={{ borderTopColor: color }}>
        <div className="p-5 flex-1 flex flex-col">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge size="sm">{paper.subject}</Badge>
              {isNew && (
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[8px] font-black uppercase tracking-widest animate-pulse">
                  New
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted">
              {paper.is_public ? (
                <Tooltip content="Public Paper"><Globe className="w-3.5 h-3.5" /></Tooltip>
              ) : (
                <Tooltip content="Private Paper"><Lock className="w-3.5 h-3.5" /></Tooltip>
              )}
              <span className="text-[10px] font-bold">{paper.exam_year}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold line-clamp-2 mb-4 hover:text-primary transition-colors cursor-pointer" onClick={() => onPreview(paper)}>
            {paper.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-muted text-[10px] font-bold uppercase tracking-wider mb-6">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {paper.page_count} Pages
            </div>
            <div className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              {paper.profiles?.university || 'Unknown Uni'}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {paper.tags?.slice(0, 3).map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-surface-2 text-[8px] font-bold text-muted uppercase">
                {tag}
              </span>
            ))}
            {paper.tags?.length > 3 && (
              <span className="px-2 py-0.5 rounded bg-surface-2 text-[8px] font-bold text-muted uppercase">
                +{paper.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto pt-4 border-t border-border-accent/30 flex items-center gap-2">
            <Link href={`/chat/${paper.id}`} className="flex-1">
              <Button size="sm" className="w-full h-9 text-[10px] font-black uppercase">
                Ask AI <MessageSquare className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Tooltip content="Preview PDF">
              <button 
                onClick={() => onPreview(paper)}
                className="w-9 h-9 rounded-xl bg-surface-2 border border-border-accent flex items-center justify-center text-muted hover:text-foreground hover:border-primary/50 transition-all"
              >
                <Eye className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content={isSaved ? "Remove from saved" : "Save Paper"}>
              <button 
                onClick={() => onToggleSave?.(paper.id)}
                className={cn(
                  "w-9 h-9 rounded-xl bg-surface-2 border border-border-accent flex items-center justify-center transition-all",
                  isSaved ? "text-primary border-primary/50" : "text-muted hover:text-foreground hover:border-primary/50"
                )}
              >
                <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
              </button>
            </Tooltip>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
