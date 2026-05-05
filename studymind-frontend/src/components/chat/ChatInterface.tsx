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
    <div className="flex-1 flex flex-col h-full relative bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border-accent flex items-center justify-between px-6 shrink-0 bg-background/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link href="/library" className="p-2 hover:bg-surface-2 rounded-lg transition-colors lg:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold truncate max-w-[200px] md:max-w-[400px]">{paper.title}</h2>
              <Badge size="sm" className="mt-0.5">{paper.subject}</Badge>
            </div>
          </div>
        </div>

        <Button 
          variant={showTools ? "primary" : "secondary"} 
          size="sm" 
          onClick={onToggleTools}
          className="h-9 text-[10px] font-black uppercase"
        >
          <PanelRight className="w-4 h-4 mr-2" />
          Study Tools
        </Button>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-[32px] bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-glow"
            >
              <Brain className="text-white w-10 h-10" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-2xl font-heading font-black">Hi! I've read this paper.</h1>
              <p className="text-muted text-sm max-w-sm">Ask me anything about <span className="text-foreground font-bold">{paper.title}</span> or use the tools on the right.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(undefined, s)}
                  className="px-4 py-2 rounded-xl bg-surface-2 border border-border-accent hover:border-primary/50 text-xs font-bold text-muted hover:text-foreground transition-all"
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
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-glow animate-pulse">
              <Brain className="text-white w-5 h-5" />
            </div>
            <div className="bg-surface-2 p-4 rounded-2xl flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">StudyMind is thinking</span>
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
            className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-glow flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-10"
          >
            New Messages <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-6 shrink-0 bg-background/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto relative group">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask anything about this paper..."
            className="w-full bg-surface-2 border border-border-accent rounded-2xl pl-6 pr-16 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none overflow-hidden max-h-40"
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
              "absolute right-3 bottom-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              input.trim() ? "bg-primary text-white shadow-glow" : "bg-surface-3 text-muted cursor-not-allowed"
            )}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-[9px] font-bold text-muted uppercase tracking-[0.2em]">Powered by Gemini AI</span>
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
