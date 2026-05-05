'use client';

import { Modal, Button, Badge } from '@/components/ui';
import { FileText, BookOpen, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: any;
}

export function PreviewModal({ isOpen, onClose, paper }: PreviewModalProps) {
  if (!paper) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Paper Preview" 
      size="xl"
    >
      <div className="flex flex-col lg:flex-row gap-8 h-[70vh]">
        {/* PDF View */}
        <div className="flex-1 bg-surface-2 rounded-xl border border-border-accent overflow-hidden relative">
          <iframe 
            src={`${paper.file_url}#toolbar=0`} 
            className="w-full h-full border-none"
            title={paper.title}
          />
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <Badge className="mb-2">{paper.subject}</Badge>
            <h2 className="text-xl font-heading font-bold leading-tight">{paper.title}</h2>
            <p className="text-xs text-muted font-medium mt-2 uppercase tracking-widest">
              Exam Year: {paper.exam_year} • {paper.page_count} Pages
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Summary
              </h3>
              <p className="text-sm text-muted leading-relaxed italic">
                {paper.summary || "AI-generated summary will appear once processing is complete."}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Key Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {paper.key_topics?.length > 0 ? (
                  paper.key_topics.map((topic: string) => (
                    <span key={topic} className="px-2 py-1 rounded bg-surface-2 text-[10px] font-medium border border-border-accent">
                      {topic}
                    </span>
                  ))
                ) : (
                  <p className="text-[10px] text-muted italic">Processing topics...</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border-accent/30">
            <Link href={`/chat/${paper.id}`}>
              <Button className="w-full h-12 text-base group">
                Start Studying <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
