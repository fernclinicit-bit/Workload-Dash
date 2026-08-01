import React from 'react';
import { 
  LayoutDashboard, 
  Monitor, 
  Users, 
  TrendingUp, 
  Megaphone, 
  Settings,
  ChevronRight,
  ChevronDown
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

export default function Sidebar({ activeDept, setActiveDept, activeView, setActiveView }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>WorkloadHub</h2>
      </div>
      <nav className="sidebar-nav">
        {departments.map((dept) => {
          const Icon = iconMap[dept.icon];
          const isActive = activeDept === dept.id;
          const hasSubMenu = dept.id !== 'overview';
          
          return (
            <div key={dept.id} className="nav-item-container">
              <button
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveDept(dept.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {Icon && <Icon size={20} />}
                  <span>{dept.name}</span>
                </div>
                {hasSubMenu && (
                  <div className="nav-chevron">
                    {isActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                )}
              </button>
              
              {isActive && hasSubMenu && (
                <div className="sub-menu">
                  <button 
                    className={`sub-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveView('dashboard')}
                  >
                    Dashboard
                  </button>
                  <button 
                    className={`sub-nav-item ${activeView === 'form' ? 'active' : ''}`}
                    onClick={() => setActiveView('form')}
                  >
                    Data Entry
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
