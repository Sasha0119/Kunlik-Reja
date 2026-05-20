export type PriorityType = 'low' | 'medium' | 'high';
export type CategoryType = 'work' | 'personal' | 'study' | 'health' | 'other';
export type TimeBlockType = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  priority: PriorityType;
  category: CategoryType;
  completed: boolean;
  timeBlock: TimeBlockType;
  createdAt: string;
}

export interface DailyNote {
  id: string;
  content: string;
  createdAt: string;
}

export type ActiveTab = 'dashboard' | 'tasks' | 'planner' | 'analytics' | 'notes';
