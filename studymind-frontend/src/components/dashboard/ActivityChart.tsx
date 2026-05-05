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
              cursor={{ fill: 'rgba(79, 142, 247, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#111118', 
                border: '1px solid #1E1E2E',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#4F8EF7' }}
            />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
              barSize={20}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.count > 0 ? '#4F8EF7' : '#1E1E2E'} 
                  fillOpacity={entry.count > 0 ? 0.8 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
