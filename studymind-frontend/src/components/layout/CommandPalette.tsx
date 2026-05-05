'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, MessageSquare, BookOpen, Settings, X, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const actions = [
    { id: 'upload', title: 'Upload New Paper', icon: Upload, href: '/upload', category: 'Actions' },
    { id: 'chat', title: 'Start New Chat', icon: MessageSquare, href: '/chat', category: 'Actions' },
    { id: 'library', title: 'Browse Library', icon: BookOpen, href: '/library', category: 'Navigation' },
    { id: 'settings', title: 'Account Settings', icon: Settings, href: '/settings', category: 'Navigation' },
  ];

  const filteredActions = query === '' 
    ? actions 
    : actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleCustomEvent = () => setIsOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomEvent);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomEvent);
    };
  }, []);

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-surface border border-border-accent rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center px-6 py-4 border-b border-border-accent">
              <Search className="w-5 h-5 text-muted mr-4" />
              <input
                autoFocus
                placeholder="Search papers, actions, or settings..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-2 border border-border-accent text-[10px] font-bold text-muted uppercase">
                ESC
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {filteredActions.length > 0 ? (
                <div className="space-y-1">
                  {filteredActions.map((action, idx) => (
                    <button
                      key={action.id}
                      onClick={() => handleSelect(action.href)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left group",
                        idx === selectedIndex ? "bg-primary/10 text-foreground" : "text-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          idx === selectedIndex ? "bg-primary/20 text-primary" : "bg-surface-2"
                        )}>
                          <action.icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{action.title}</p>
                          <p className="text-[10px] uppercase tracking-widest opacity-50">{action.category}</p>
                        </div>
                      </div>
                      <Command className={cn("w-4 h-4 opacity-0 transition-opacity", idx === selectedIndex && "opacity-30")} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-2">
                  <div className="w-12 h-12 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-muted" />
                  </div>
                  <p className="font-bold">No results found</p>
                  <p className="text-sm text-muted">Try searching for something else</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-surface-2 border-t border-border-accent flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="px-1 py-0.5 rounded border border-border-accent bg-surface min-w-[1.2rem] text-center">↑↓</span> Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="px-1 py-0.5 rounded border border-border-accent bg-surface min-w-[1.2rem] text-center">Enter</span> Select
                </span>
              </div>
              <p>StudyMind AI Search</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
