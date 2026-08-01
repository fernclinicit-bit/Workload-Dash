import React from 'react';
import { 
  LayoutDashboard, 
  Monitor, 
  Users, 
  TrendingUp, 
  Megaphone, 
  Settings 
} from 'lucide-react';
import { departments } from '../data/mockData';

const iconMap = {
  LayoutDashboard,
  Monitor,
  Users,
  TrendingUp,
  Megaphone,
  Settings
};

export default function Sidebar({ activeDept, setActiveDept }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>WorkloadHub</h2>
      </div>
      <nav className="sidebar-nav">
        {departments.map((dept) => {
          const Icon = iconMap[dept.icon];
          return (
            <button
              key={dept.id}
              className={`nav-item ${activeDept === dept.id ? 'active' : ''}`}
              onClick={() => setActiveDept(dept.id)}
            >
              {Icon && <Icon size={20} />}
              <span>{dept.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
