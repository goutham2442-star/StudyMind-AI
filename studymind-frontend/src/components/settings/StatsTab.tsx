'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Card } from '@/components/ui';
import { BookOpen, MessageSquare, Bookmark, Calendar } from 'lucide-react';

export function StatsTab({ stats, profile }: any) {
  const activityData = [
    { day: '1', count: 4 }, { day: '5', count: 12 }, { day: '10', count: 8 },
    { day: '15', count: 15 }, { day: '20', count: 5 }, { day: '25', count: 18 },
    { day: '30', count: 10 }
  ];

  const subjectData = [
    { name: 'Computer Networks', value: 45, color: '#4F8EF7' },
    { name: 'Operating Systems', value: 25, color: '#7C3AED' },
    { name: 'Data Structures', value: 20, color: '#10B981' },
    { name: 'Mathematics', value: 10, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStatCard label="Total Papers" value={stats.totalPapers} icon={BookOpen} color="text-primary" />
        <MiniStatCard label="Total Messages" value={stats.totalQuestions} icon={MessageSquare} color="text-secondary" />
        <MiniStatCard label="Saved Q&As" value="12" icon={Bookmark} color="text-success" />
        <MiniStatCard label="Days Active" value={stats.streak} icon={Calendar} color="text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="glass p-6 rounded-2xl space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted">Study Activity (30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="day" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: '12px' }}
                  itemStyle={{ color: '#4F8EF7' }}
                />
                <Bar dataKey="count" fill="#4F8EF7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="glass p-6 rounded-2xl space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted">Papers by Subject</h3>
          <div className="h-64 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 w-full md:w-auto">
              {subjectData.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest flex-1">{s.name}</span>
                  <span className="text-xs font-bold">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Subjects Progress */}
      <div className="glass p-8 rounded-2xl space-y-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted">Subject Mastery</h3>
        <div className="space-y-6">
          <SubjectProgress label="Computer Networks" value={85} color="bg-primary" />
          <SubjectProgress label="Operating Systems" value={62} color="bg-secondary" />
          <SubjectProgress label="Data Structures" value={45} color="bg-success" />
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
          Member since {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

function MiniStatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 text-center p-6">
      <div className={cn("w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center", color)}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-black font-heading mt-1">{value}</p>
      <p className="text-[9px] font-bold text-muted uppercase tracking-widest">{label}</p>
    </Card>
  );
}

function SubjectProgress({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-foreground">{label}</span>
        <span className="text-xs font-black text-primary">{value}%</span>
      </div>
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full shadow-glow transition-all duration-1000", color)} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
