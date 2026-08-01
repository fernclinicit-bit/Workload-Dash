import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

export function WorkloadAreaChart({ data }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Workload Over Time (This Week)</h3>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
            <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Area type="monotone" dataKey="tasks" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTasks)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function WorkloadBarChart({ data }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Workload Distribution</h3>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
            <XAxis type="number" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
            <YAxis dataKey="name" type="category" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} width={80} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
            />
            <Bar dataKey="value" fill="var(--accent)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
