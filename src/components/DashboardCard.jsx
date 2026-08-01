import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function DashboardCard({ label, value, trend, isPositive }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{label}</span>
        <Activity size={18} />
      </div>
      <div className="card-value">{value}</div>
      <div className={`card-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{trend}</span>
      </div>
    </div>
  );
}
