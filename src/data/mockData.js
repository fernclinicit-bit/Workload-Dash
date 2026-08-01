export const departments = [
  { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
  { id: 'it', name: 'IT Department', icon: 'Monitor' },
  { id: 'hr', name: 'Human Resources', icon: 'Users' },
  { id: 'sales', name: 'Sales', icon: 'TrendingUp' },
  { id: 'marketing', name: 'Marketing', icon: 'Megaphone' },
  { id: 'operations', name: 'Operations', icon: 'Settings' }
];

export const generateMockData = (deptId) => {
  if (deptId === 'overview') {
    return {
      title: 'Company Overview',
      metrics: [
        { label: 'Total Active Tasks', value: '1,248', trend: '+12%', isPositive: true },
        { label: 'Completed This Week', value: '856', trend: '+5%', isPositive: true },
        { label: 'Avg. Resolution Time', value: '2.4 days', trend: '-18%', isPositive: true },
        { label: 'Delayed Projects', value: '14', trend: '+2', isPositive: false }
      ],
      workloadOverTime: [
        { name: 'Mon', tasks: 120 },
        { name: 'Tue', tasks: 132 },
        { name: 'Wed', tasks: 101 },
        { name: 'Thu', tasks: 142 },
        { name: 'Fri', tasks: 90 },
        { name: 'Sat', tasks: 30 },
        { name: 'Sun', tasks: 20 },
      ],
      distribution: [
        { name: 'IT', value: 400 },
        { name: 'Sales', value: 300 },
        { name: 'Marketing', value: 300 },
        { name: 'Operations', value: 200 },
        { name: 'HR', value: 100 },
      ],
      recentTasks: [
        { id: 'TASK-101', dept: 'IT', title: 'Server Upgrade', priority: 'High', status: 'In Progress', assignee: 'John D.' },
        { id: 'TASK-102', dept: 'Marketing', title: 'Q3 Campaign Launch', priority: 'Medium', status: 'To Do', assignee: 'Sarah W.' },
        { id: 'TASK-103', dept: 'Sales', title: 'Client Pitch Deck', priority: 'High', status: 'Completed', assignee: 'Mike T.' },
        { id: 'TASK-104', dept: 'HR', title: 'New Hire Onboarding', priority: 'Low', status: 'In Progress', assignee: 'Emily R.' },
      ]
    };
  }

  // Department specific mock data
  const deptName = departments.find(d => d.id === deptId)?.name || 'Department';
  const baseTasks = Math.floor(Math.random() * 200) + 50;
  
  return {
    title: `${deptName} Dashboard`,
    metrics: [
      { label: 'Active Tasks', value: baseTasks.toString(), trend: '+5%', isPositive: true },
      { label: 'Completed', value: Math.floor(baseTasks * 0.8).toString(), trend: '+2%', isPositive: true },
      { label: 'Avg. Time per Task', value: (Math.random() * 3 + 1).toFixed(1) + ' hrs', trend: '-5%', isPositive: true },
      { label: 'Overdue', value: Math.floor(Math.random() * 10).toString(), trend: '+1', isPositive: false }
    ],
    workloadOverTime: Array.from({length: 7}).map((_, i) => ({
      name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      tasks: Math.floor(Math.random() * 50) + 10
    })),
    recentTasks: Array.from({length: 5}).map((_, i) => {
      const statuses = ['To Do', 'In Progress', 'Completed'];
      return {
        id: `TSK-${Math.floor(Math.random() * 1000)}`,
        dept: deptName,
        title: `Routine Task ${i+1} for ${deptName}`,
        priority: Math.random() > 0.7 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low'),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        assignee: 'Staff Member'
      };
    })
  };
};
