export const departments = [
  { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
  { id: 'it', name: 'IT Department', icon: 'Monitor' },
  { id: 'hr', name: 'Human Resources', icon: 'Users' },
  { id: 'sales', name: 'Sales', icon: 'TrendingUp' },
  { id: 'marketing', name: 'Marketing', icon: 'Megaphone' },
  { id: 'operations', name: 'Operations', icon: 'Settings' }
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const priorities = ['High', 'Medium', 'Low'];
const statuses = ['To Do', 'In Progress', 'Completed'];
const assigneeNames = ['John D.', 'Sarah W.', 'Mike T.', 'Emily R.', 'Alex C.', 'David L.'];

export const generateInitialTasks = () => {
  const tasks = [];
  const deptList = departments.filter(d => d.id !== 'overview').map(d => d.name);
  
  for (let i = 0; i < 80; i++) {
    const dept = deptList[Math.floor(Math.random() * deptList.length)];
    tasks.push({
      id: `TSK-${1000 + i}`,
      title: `Routine Task ${i + 1} for ${dept}`,
      dept: dept,
      assignee: assigneeNames[Math.floor(Math.random() * assigneeNames.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dayOfWeek: days[Math.floor(Math.random() * days.length)]
    });
  }
  return tasks;
};

export const computeDashboardData = (tasks, activeDeptId) => {
  const activeDept = departments.find(d => d.id === activeDeptId);
  const isOverview = activeDeptId === 'overview';
  
  // Filter tasks for current department if not overview
  const filteredTasks = isOverview ? tasks : tasks.filter(t => t.dept === activeDept.name);

  // Compute Metrics
  const activeTasksCount = filteredTasks.filter(t => t.status !== 'Completed').length;
  const completedCount = filteredTasks.filter(t => t.status === 'Completed').length;
  const overdueCount = filteredTasks.filter(t => t.priority === 'High' && t.status === 'To Do').length; // Mock overdue logic
  
  // Format numbers with commas
  const metrics = [
    { label: 'Active Tasks', value: activeTasksCount.toLocaleString(), trend: '+2%', isPositive: true },
    { label: 'Completed', value: completedCount.toLocaleString(), trend: '+5%', isPositive: true },
    { label: 'Avg. Time per Task', value: (Math.random() * 2 + 1).toFixed(1) + ' hrs', trend: '-5%', isPositive: true },
    { label: 'High Priority (To Do)', value: overdueCount.toString(), trend: overdueCount > 5 ? '+2' : '-1', isPositive: overdueCount <= 5 }
  ];

  // Compute Workload Over Time (Area Chart)
  const workloadByDay = {};
  days.forEach(d => workloadByDay[d] = 0);
  filteredTasks.forEach(t => {
    if (t.dayOfWeek && workloadByDay[t.dayOfWeek] !== undefined) {
      workloadByDay[t.dayOfWeek] += 1;
    }
  });
  const workloadOverTime = days.map(day => ({ name: day, tasks: workloadByDay[day] }));

  // Compute Distribution (Bar Chart) - Only for overview
  let distribution = null;
  if (isOverview) {
    const distMap = {};
    departments.filter(d => d.id !== 'overview').forEach(d => distMap[d.name] = 0);
    filteredTasks.forEach(t => {
      if (distMap[t.dept] !== undefined) {
        distMap[t.dept] += 1;
      }
    });
    distribution = Object.keys(distMap).map(key => ({
      name: key.replace(' Department', ''), // shorten names
      value: distMap[key]
    })).sort((a, b) => b.value - a.value);
  }

  // Sort tasks: newest first (assuming higher ID is newer)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const idA = parseInt(a.id.split('-')[1]);
    const idB = parseInt(b.id.split('-')[1]);
    return idB - idA;
  });

  return {
    title: isOverview ? 'Company Overview' : `${activeDept.name} Dashboard`,
    metrics,
    workloadOverTime,
    distribution,
    recentTasks: sortedTasks.slice(0, 15) // Return top 15 for table
  };
};
