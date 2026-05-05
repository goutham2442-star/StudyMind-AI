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
      whileHover={{ y: -4, scale: 1.02 }}
      className="min-w-[320px] max-w-[320px] snap-start"
    >
      <Card padding="none" className="overflow-hidden h-full border-l-4" style={{ borderLeftColor: color }}>
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <Badge size="sm">{subject}</Badge>
            <div className="flex items-center gap-1.5 text-muted text-[10px] font-bold uppercase">
              <Calendar className="w-3 h-3" />
              {exam_year}
            </div>
          </div>

          <h4 className="text-sm font-bold line-clamp-2 mb-4 flex-1">
            {title}
          </h4>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-accent/30">
            <div className="flex items-center gap-3 text-muted">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                <Layers className="w-3 h-3" />
                {page_count} Pages
              </div>
            </div>
            
            <Link href={`/chat/${id}`}>
              <Button size="sm" variant="primary" className="h-8 text-[10px] font-bold uppercase px-3">
                Ask AI <MessageSquare className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
