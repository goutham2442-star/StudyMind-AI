'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Brain, 
  Sparkles, 
  ArrowLeft, 
  PanelRight,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { Button, Input, Avatar, Badge } from '@/components/ui';
import { MessageItem } from './MessageItem';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import axios from 'axios';

interface ChatInterfaceProps {
  paper: any;
  sessionId: string | null;
  onToggleTools: () => void;
  showTools: boolean;
}

export function ChatInterface({ paper, sessionId, onToggleTools, showTools }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (force = false) => {
    if (scrollRef.current && (!isScrolledUp || force)) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: force ? 'auto' : 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setIsScrolledUp(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    e?.preventDefault();
    const msg = customMsg || input;
    if (!msg.trim() || loading) return;

    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    // Auto-expand/shrink textarea
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      // Simulate Streaming for now as we don't have the SSE endpoint fully ready
      // In production, use EventSource or fetch with readable streams
      const aiMsgId = Date.now();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date() }]);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_id: paper.id,
          session_id: sessionId,
          content: msg
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const content = line.replace('data: ', '');
              if (content === '[DONE]') break;
              
              fullContent += JSON.parse(content);
              setMessages(prev => prev.map(m => 
                m.id === aiMsgId ? { ...m, content: fullContent } : m
              ));
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.', 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Summarize this paper",
    "What are the key topics?",
    "Generate 5 exam questions",
    "Explain the main subject",
    "What might come in exam?"
  ];

  // Listen for custom events from StudyTools
  useEffect(() => {
    const handleCustomMsg = (e: any) => handleSend(undefined, e.detail);
    window.addEventListener('send-chat-message', handleCustomMsg);
    return () => window.removeEventListener('send-chat-message', handleCustomMsg);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative bg-background/30">
      {/* Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-background/40 backdrop-blur-2xl z-10">
        <div className="flex items-center gap-6">
          <Link href="/library" className="p-2.5 hover:bg-white/5 rounded-xl transition-all lg:hidden border border-transparent hover:border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-black truncate max-w-[200px] md:max-w-[400px] text-glow tracking-tight">{paper.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge size="sm" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[9px]">{paper.subject}</Badge>
                <div className="w-1 h-1 rounded-full bg-muted/30" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{paper.exam_year} Paper</span>
              </div>
            </div>
          </div>
        </div>

        <Button 
          variant={showTools ? "primary" : "secondary"} 
          size="sm" 
          onClick={onToggleTools}
          className="h-10 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg"
        >
          <PanelRight className="w-4 h-4 mr-2" />
          Study Tools
        </Button>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-24 h-24 rounded-[36px] bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-[0_20px_50px_rgba(79,142,247,0.3)] relative group"
            >
              <div className="absolute inset-0 rounded-[36px] bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              <Brain className="text-white w-12 h-12" />
            </motion.div>
            <div className="space-y-3">
              <h1 className="text-3xl font-heading font-black tracking-tight text-glow">I've analyzed your paper.</h1>
              <p className="text-muted text-sm max-w-sm font-medium leading-relaxed">
                Ask me anything about <span className="text-foreground font-bold">{paper.title}</span> or use the smart tools on the right.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 max-w-xl">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(undefined, s)}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black text-muted hover:text-primary transition-all uppercase tracking-widest shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <MessageItem key={i} message={m} />
          ))
        )}
        
        {loading && messages[messages.length-1]?.role === 'user' && (
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-glow animate-pulse">
              <Brain className="text-white w-5 h-5" />
            </div>
            <div className="glass-card p-5 rounded-2xl flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">AI is synthesizing response</span>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll Button */}
      <AnimatePresence>
        {isScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(79,142,247,0.4)] flex items-center gap-3 text-[10px] font-black uppercase tracking-widest z-10 border border-white/20"
          >
            New Messages Below <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-8 shrink-0 bg-background/40 backdrop-blur-2xl border-t border-white/5">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-[22px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask anything about this paper..."
            className="relative w-full bg-surface-2/80 border border-white/10 rounded-2xl pl-8 pr-16 py-5 text-sm focus:border-primary focus:ring-0 outline-none transition-all resize-none overflow-hidden max-h-48 backdrop-blur-xl shadow-2xl placeholder:text-muted/50"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={cn(
              "absolute right-4 bottom-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              input.trim() ? "bg-primary text-white shadow-glow translate-y-0" : "bg-white/5 text-muted/30 cursor-not-allowed translate-y-0"
            )}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-shimmer" />
          <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-60">Verified AI Analysis Pipeline</span>
        </div>
      </div>
    </div>
    </div>
  );
}

function FileText(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
  );
}
