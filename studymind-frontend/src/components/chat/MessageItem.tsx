'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui';
import { Brain, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MessageItemProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}

export function MessageItem({ message }: MessageItemProps) {
  const isAI = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 group",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-glow">
          <Brain className="text-white w-5 h-5" />
        </div>
      )}

      <div className={cn(
        "flex flex-col gap-2 relative",
        isAI ? "max-w-[85%]" : "max-w-[70%] items-end"
      )}
      >
        <div className={cn(
          "p-4 rounded-2xl relative",
          isAI 
            ? "bg-surface-2 border-l-2 border-primary text-foreground" 
            : "bg-linear-to-br from-primary to-secondary text-white shadow-glow"
        )}>
          {isAI && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">StudyMind AI</span>
              <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold uppercase tracking-widest">Gemini 1.5</span>
            </div>
          )}

          <div className={cn(
            "prose prose-invert prose-sm max-w-none leading-relaxed prose-pre:bg-surface-3 prose-pre:border prose-pre:border-border-accent prose-code:text-primary",
            !isAI && "prose-p:text-white prose-strong:text-white"
          )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {isAI && (
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-1.5 hover:bg-surface-3 rounded-md transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
              </button>
              <button className="p-1.5 hover:bg-surface-3 rounded-md transition-colors text-muted hover:text-success">
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-surface-3 rounded-md transition-colors text-muted hover:text-error">
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        
        <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(message.timestamp)}
        </span>
      </div>

      {!isAI && (
        <Avatar name="User" size="sm" className="shrink-0" />
      )}
    </motion.div>
  );
}
