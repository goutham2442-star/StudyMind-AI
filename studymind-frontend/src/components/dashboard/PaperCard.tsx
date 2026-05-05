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
  const color = generateColor(subject);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="min-w-[320px] max-w-[320px] snap-start h-full"
    >
      <Card padding="none" className="overflow-hidden h-full border border-white/5 bg-linear-to-br from-white/5 to-transparent relative group">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
        
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <Badge variant="secondary" size="sm" className="bg-white/5 text-muted-foreground border-white/10 font-black uppercase tracking-widest text-[9px]">{subject}</Badge>
            <div className="flex items-center gap-1.5 text-muted text-[10px] font-black uppercase tracking-tighter opacity-60">
              <Calendar className="w-3.5 h-3.5" />
              {exam_year}
            </div>
          </div>

          <h4 className="text-base font-black tracking-tight line-clamp-2 mb-6 group-hover:text-primary transition-colors">
            {title}
          </h4>

          <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted opacity-50">
                <Layers className="w-4 h-4" />
                {page_count} Pages
              </div>
            </div>
            
            <Link href={`/chat/${id}`}>
              <Button size="sm" variant="primary" className="h-9 text-[10px] font-black uppercase px-4 rounded-xl shadow-lg">
                Analyze <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Card>
    </motion.div>
  );
}
