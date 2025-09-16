// Define types for our data structures
interface Reminder {
  id: string;
  title: string;
  time: string;
  status?: 'normal' | 'due-soon' | 'overdue';
}

interface FollowUp {
  id: string;
  company: string;
  lastContact: string;
}

interface Activity {
  id: string;
  action: string;
  time: string;
  type?: 'document' | 'interview' | 'application' | 'communication';
}

// KPI Data
export const kpiData = {
  applicationsSubmitted: {
    value: 32,
    change: '+5 this week',
    changePositive: true
  },
  interviewsScheduled: {
    value: 4,
    change: '2 this week',
    changePositive: true
  },
  documentsUploaded: {
    value: 21,
    change: 'CVs & cover letters',
    changePositive: true
  },
  successRate: {
    value: 18,
    change: 'offers / applications',
    changePositive: true
  }
};

// Chart Data
export const applicationsOverTimeData = [
  { week: 'W1', applications: 2 },
  { week: 'W2', applications: 5 },
  { week: 'W3', applications: 3 },
  { week: 'W4', applications: 7 },
  { week: 'W5', applications: 4 },
  { week: 'W6', applications: 6 },
  { week: 'W7', applications: 8 },
  { week: 'W8', applications: 5 },
  { week: 'W9', applications: 9 },
  { week: 'W10', applications: 7 },
  { week: 'W11', applications: 11 },
  { week: 'W12', applications: 12 }
];

export const tasksCompletedData = [
  { week: 'W1', completed: 3, pending: 2 },
  { week: 'W2', completed: 5, pending: 1 },
  { week: 'W3', completed: 2, pending: 4 },
  { week: 'W4', completed: 6, pending: 3 },
  { week: 'W5', completed: 4, pending: 2 },
  { week: 'W6', completed: 7, pending: 1 },
  { week: 'W7', completed: 5, pending: 3 },
  { week: 'W8', completed: 8, pending: 2 }
];

// Reminders Data
export const upcomingReminders: Reminder[] = [
  {
    id: '1',
    title: 'Follow up with Acme',
    time: 'Tomorrow 09:00',
    status: 'due-soon'
  },
  {
    id: '2',
    title: 'Prepare portfolio',
    time: 'Fri 14:00',
    status: 'normal'
  },
  {
    id: '3',
    title: 'Call recruiter',
    time: 'Overdue',
    status: 'overdue'
  }
];

// Follow-ups Needed
export const followUpsNeeded: FollowUp[] = [
  {
    id: '1',
    company: 'Globex',
    lastContact: '2025-09-10'
  },
  {
    id: '2',
    company: 'Initech',
    lastContact: '2025-09-08'
  },
  {
    id: '3',
    company: 'Umbrella Corp',
    lastContact: '2025-09-05'
  }
];

// Recent Activity
export const recentActivity: Activity[] = [
  {
    id: '1',
    action: 'Moved \'Globex\' to Interview',
    time: '2 hours ago',
    type: 'interview'
  },
  {
    id: '2',
    action: 'Uploaded CV v3.pdf',
    time: '1 day ago',
    type: 'document'
  },
  {
    id: '3',
    action: 'Sent follow-up to Initech',
    time: '2 days ago',
    type: 'communication'
  },
  {
    id: '4',
    action: 'Applied to Acme Corp',
    time: '3 days ago',
    type: 'application'
  }
];

// Export types
export type { Reminder, FollowUp, Activity };