'use client';

import { motion } from 'framer-motion';
import { FileText, MessageSquare, ArrowRight, Calendar, Layers } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { cn, generateColor } from '@/lib/utils';
import Link from 'next/link';

interface PaperCardProps {
  id: string;
  title: string;
  subject: string;
  exam_year: number;
  page_count: number;
}

export function PaperCard({ id, title, subject, exam_year, page_count }: PaperCardProps) {
  const subjectColor = generateColor(subject);

  return (
    <motion.div
      whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="min-w-[300px] max-w-[300px] snap-start h-full"
    >
      <Card padding="none" className="overflow-hidden h-full border border-white/5 bg-surface-2/30 backdrop-blur-xl relative group rounded-[28px] flex flex-col">
        {/* Color Strip */}
        <div 
          className="absolute top-0 left-0 w-full h-1.5 opacity-60 transition-opacity group-hover:opacity-100" 
          style={{ 
            background: `linear-gradient(90deg, ${subjectColor}, transparent)` 
          }} 
        />
        
        <div className="p-7 flex flex-col h-full space-y-5">
          <div className="flex items-start justify-between">
            <Badge size="sm" className="bg-primary/5 text-primary border-primary/10 font-black uppercase tracking-[0.2em] text-[8px] px-2.5 py-1">
              {subject}
            </Badge>
            <div className="flex items-center gap-1.5 text-muted-dark text-[9px] font-black uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 opacity-40" />
              {exam_year}
            </div>
          </div>

          <h4 className="text-lg font-black tracking-tight leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h4>

          <div className="flex-1" />

          <div className="flex items-center justify-between pt-5 border-t border-white/5">
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.15em] text-muted-dark">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 opacity-40" />
                <span>{page_count} Pages</span>
              </div>
            </div>
            
            <Link href={`/chat/${id}`}>
              <Button size="sm" className="h-10 text-[9px] font-black uppercase tracking-[0.2em] px-5 rounded-xl bg-white/5 border-white/5 hover:bg-primary hover:text-white transition-all shadow-md">
                Launch <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Premium Shine Effect */}
        <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-700" />
      </Card>
    </motion.div>
  );
}
