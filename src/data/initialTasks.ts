import { TaskCategory, TaskItem, TaskPriority } from '../types';

export interface CategoryMeta {
  id: TaskCategory | 'all';
  label: string;
  icon: string;
  color: string;
  bgLight: string;
  bgDark: string;
}

export const TASK_CATEGORIES: CategoryMeta[] = [
  { id: 'all', label: 'All Tasks', icon: '✨', color: '#8B5CF6', bgLight: '#EDE9FE', bgDark: 'rgba(139, 92, 246, 0.2)' },
  { id: 'college', label: 'College', icon: '📚', color: '#3B82F6', bgLight: '#DBEAFE', bgDark: 'rgba(59, 130, 246, 0.2)' },
  { id: 'placement', label: 'Placement', icon: '💻', color: '#6366F1', bgLight: '#E0E7FF', bgDark: 'rgba(99, 102, 241, 0.2)' },
  { id: 'learning', label: 'Learning', icon: '🧠', color: '#EC4899', bgLight: '#FCE7F3', bgDark: 'rgba(236, 72, 153, 0.2)' },
  { id: 'projects', label: 'Projects', icon: '🚀', color: '#F97316', bgLight: '#FFEDD5', bgDark: 'rgba(249, 115, 22, 0.2)' },
  { id: 'personal', label: 'Personal', icon: '🏠', color: '#EAB308', bgLight: '#FEF9C3', bgDark: 'rgba(234, 179, 8, 0.2)' },
  { id: 'health', label: 'Health', icon: '💪', color: '#10B981', bgLight: '#D1FAE5', bgDark: 'rgba(16, 185, 129, 0.2)' },
];

export interface PriorityMeta {
  id: TaskPriority;
  label: string;
  icon: string;
  textColor: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
}

export const PRIORITY_CONFIG: Record<TaskPriority, PriorityMeta> = {
  high: {
    id: 'high',
    label: 'High Priority',
    icon: '🌸',
    textColor: '#E11D48', // Soft coral / warm rose
    bgLight: '#FFE4E6',
    bgDark: 'rgba(225, 29, 72, 0.2)',
    borderLight: '#FDA4AF',
    borderDark: 'rgba(225, 29, 72, 0.4)',
  },
  medium: {
    id: 'medium',
    label: 'Medium Priority',
    icon: '🍑',
    textColor: '#D97706', // Pastel peach / warm yellow
    bgLight: '#FEF3C7',
    bgDark: 'rgba(217, 119, 6, 0.2)',
    borderLight: '#FDE68A',
    borderDark: 'rgba(217, 119, 6, 0.4)',
  },
  low: {
    id: 'low',
    label: 'Low Priority',
    icon: '🌿',
    textColor: '#059669', // Soft sage / muted mint
    bgLight: '#D1FAE5',
    bgDark: 'rgba(5, 150, 105, 0.2)',
    borderLight: '#A7F3D0',
    borderDark: 'rgba(5, 150, 105, 0.4)',
  },
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Practice React architecture & custom hooks',
    category: 'learning',
    priority: 'high',
    dueDate: '2026-09-11',
    dueTime: '10:00 AM',
    timeEstimate: '45 mins',
    notes: 'Focus on context separation, clean state updates, and custom sound synthesizer hooks.',
    completed: true,
    createdAt: '2026-09-11T08:00:00Z',
    completedAt: '2026-09-11T10:15:00Z',
  },
  {
    id: 'task-2',
    title: 'Review System Design & Distributed Caching',
    category: 'placement',
    priority: 'high',
    dueDate: '2026-09-11',
    dueTime: '12:30 PM',
    timeEstimate: '1 hr',
    notes: 'Go over Redis cache strategies, write-through vs write-back, and LRU eviction algorithms.',
    completed: true,
    createdAt: '2026-09-11T09:00:00Z',
    completedAt: '2026-09-11T12:45:00Z',
  },
  {
    id: 'task-3',
    title: '30-minute calming afternoon walk in nature',
    category: 'health',
    priority: 'medium',
    dueDate: '2026-09-11',
    dueTime: '04:30 PM',
    timeEstimate: '30 mins',
    notes: 'Breathe in fresh air, stretch legs after deep study, and listen to the birds.',
    completed: true,
    createdAt: '2026-09-11T11:00:00Z',
    completedAt: '2026-09-11T17:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Water the cute little succulents on the desk',
    category: 'personal',
    priority: 'low',
    dueDate: '2026-09-11',
    dueTime: '05:00 PM',
    timeEstimate: '10 mins',
    notes: 'Light misting on the leaves and check window sunlight placement.',
    completed: true,
    createdAt: '2026-09-11T12:00:00Z',
    completedAt: '2026-09-11T17:30:00Z',
  },
  {
    id: 'task-5',
    title: 'Build Stage 4 To-Do List with cute celebratory confetti',
    category: 'projects',
    priority: 'high',
    dueDate: '2026-09-11',
    dueTime: '08:00 PM',
    timeEstimate: '1 hr',
    notes: 'Implement full CRUD, filtering by category, search, sorting, and cute completion rewards ♡',
    completed: false,
    createdAt: '2026-09-11T13:00:00Z',
  },
  {
    id: 'task-6',
    title: 'Prepare Database Management notes for upcoming semester',
    category: 'college',
    priority: 'medium',
    dueDate: '2026-09-12',
    dueTime: '11:00 AM',
    timeEstimate: '45 mins',
    notes: 'Summarize B-tree indexing, query optimization, and normalization up to 3NF/BCNF.',
    completed: false,
    createdAt: '2026-09-11T14:00:00Z',
  },
  {
    id: 'task-7',
    title: 'Cozy bedtime tea & reading 2 chapters of favorite book',
    category: 'personal',
    priority: 'low',
    dueDate: '2026-09-11',
    dueTime: '09:30 PM',
    timeEstimate: '25 mins',
    notes: 'Warm lavender or chamomile tea with gentle ambient background sounds.',
    completed: false,
    createdAt: '2026-09-11T15:00:00Z',
  },
];
