'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button, Card, Badge, Tooltip } from '@/components/ui';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';

interface StudySession {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  duration: number; // in minutes
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: '1',
      title: 'Thermodynamics Review',
      subject: 'Physics',
      startTime: format(new Date(), "yyyy-MM-dd'T'14:00:00"),
      duration: 90,
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Neural Networks Basics',
      subject: 'Computer Science',
      startTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'10:00:00"),
      duration: 120,
      completed: false,
      priority: 'medium'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const days = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6)
  });

  const toggleSession = (id: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tighter text-glow">Study Planner</h1>
          <p className="text-muted text-sm font-black uppercase tracking-widest opacity-50 mt-1">Optimize your academic schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1">
            <button 
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 text-xs font-black uppercase tracking-widest min-w-[140px] text-center">
              {format(days[0], 'MMM d')} - {format(days[6], 'MMM d')}
            </span>
            <button 
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="rounded-2xl h-12 px-6 shadow-glow">
            <Plus size={20} className="mr-2" /> Schedule
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {days.map((day, idx) => {
          const daySessions = sessions.filter(s => isSameDay(new Date(s.startTime), day));
          return (
            <div key={idx} className="space-y-4">
              <div className={cn(
                "flex flex-col items-center p-4 rounded-3xl border transition-all duration-300",
                isToday(day) 
                  ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(79,142,247,0.15)]" 
                  : "bg-white/5 border-white/5"
              )}>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  isToday(day) ? "text-primary" : "text-muted"
                )}>
                  {format(day, 'EEE')}
                </span>
                <span className={cn(
                  "text-xl font-black mt-1",
                  isToday(day) ? "text-foreground" : "text-muted/60"
                )}>
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {daySessions.map(session => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <Card padding="none" className={cn(
                        "relative overflow-hidden group border transition-all duration-300",
                        session.completed ? "opacity-50 grayscale" : "hover:border-primary/30",
                        session.priority === 'high' ? "border-l-4 border-l-error" : 
                        session.priority === 'medium' ? "border-l-4 border-l-secondary" : 
                        "border-l-4 border-l-primary"
                      )}>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className={cn(
                                "text-sm font-black tracking-tight leading-tight",
                                session.completed && "line-through"
                              )}>
                                {session.title}
                              </h4>
                              <p className="text-[10px] font-black text-muted uppercase tracking-widest">
                                {session.subject}
                              </p>
                            </div>
                            <button 
                              onClick={() => toggleSession(session.id)}
                              className={cn(
                                "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                                session.completed 
                                  ? "bg-success border-success text-white" 
                                  : "border-white/10 hover:border-primary text-transparent hover:text-primary/40"
                              )}
                            >
                              <CheckCircle2 size={14} className={cn(session.completed ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] font-bold text-muted/60">
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} />
                              {format(new Date(session.startTime), 'HH:mm')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <BookOpen size={12} />
                              {session.duration}m
                            </div>
                          </div>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 pointer-events-none">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id);
                            }}
                            className="w-8 h-8 rounded-xl bg-error/10 text-error border border-error/20 flex items-center justify-center hover:bg-error hover:text-white transition-all pointer-events-auto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {daySessions.length === 0 && (
                  <div className="h-20 rounded-3xl border border-dashed border-white/5 flex items-center justify-center">
                    <span className="text-[9px] font-black text-muted/20 uppercase tracking-[0.2em]">Rest Day</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistics Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-glow">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Completion</p>
              <p className="text-2xl font-black">{Math.round((sessions.filter(s => s.completed).length / (sessions.length || 1)) * 100)}%</p>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(sessions.filter(s => s.completed).length / (sessions.length || 1)) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-glow">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Total Study Time</p>
            <p className="text-2xl font-black">{sessions.reduce((acc, s) => acc + s.duration, 0)} mins</p>
          </div>
        </div>

        <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success shadow-glow">
            <CalendarIcon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Sessions Scheduled</p>
            <p className="text-2xl font-black">{sessions.length}</p>
          </div>
        </div>
      </div>

      {/* Empty State / Tips */}
      <div className="p-8 rounded-[40px] bg-linear-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black tracking-tight">AI Planning Tip</h3>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">
            Based on your recent uploads, we recommend spending at least **45 minutes** on the "Complex Variables" topic. 
            High-priority sessions are marked in red and should be tackled during your peak focus hours.
          </p>
        </div>
        <Button variant="secondary" className="md:ml-auto rounded-2xl whitespace-nowrap">
          Optimize Schedule
        </Button>
      </div>
    </div>
  );
}
