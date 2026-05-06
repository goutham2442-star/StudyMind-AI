'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ActivityChartProps {
  data: { day: string; count: number }[];
  mostActiveSubject?: string;
}

export function ActivityChart({ data, mostActiveSubject }: ActivityChartProps) {
  return (
    <div className="glass p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted">Your Study Activity</h3>
          <p className="text-xs text-muted mt-1">Questions asked per day (Last 14 days)</p>
        </div>
        {mostActiveSubject && (
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-muted tracking-widest">Most active</p>
            <p className="text-xs font-bold text-primary">{mostActiveSubject}</p>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748b' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(79, 142, 247, 0.05)', radius: 8 }}
              contentStyle={{ 
                backgroundColor: 'rgba(17, 17, 24, 0.8)', 
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
              itemStyle={{ color: '#4F8EF7' }}
            />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]}
              barSize={24}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="url(#barGradient)"
                  style={{ filter: entry.count > 0 ? 'drop-shadow(0 0 8px rgba(79, 142, 247, 0.3))' : 'none' }}
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F8EF7" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2D5BFF" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
