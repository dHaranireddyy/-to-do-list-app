export type NavigationTab =
  | 'home'
  | 'clock'
  | 'journal'
  | 'todo'
  | 'dreams'
  | 'progress'
  | 'themes'
  | 'settings'
  | 'lock';

export type ThemeId =
  | 'blush-garden'
  | 'cozy'
  | 'lavender-dream'
  | 'sage-garden'
  | 'midnight'
  | 'strawberry-milk'
  | 'matcha-latte'
  | 'peach-sorbet'
  | 'ocean-breeze'
  | 'honey-chamomile'
  | 'cosmic-starlight'
  | 'warm-cocoa';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  icon: string;
  symbol: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  cardBg: string;
  pageBg: string;
  textColor: string;
  accentColor: string;
  isDark?: boolean;
}

export interface UserProfile {
  name: string;
  greetingCustom?: string;
  avatarIcon: string;
  streakDays: number;
  pinCode?: string;
  isPinSet: boolean;
  securityHint?: string;
  autoLockMinutes: number;
  soundEnabled: boolean;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface GoalPreview {
  id: string;
  title: string;
  category: 'short-term' | 'long-term';
  progress: number;
  targetDate: string;
  icon: string;
  desc?: string;
  priority?: 'high' | 'medium' | 'low';
  milestones?: GoalMilestone[];
  createdAt?: string;
}

export interface FantasyItem {
  id: string;
  title: string;
  category: string;
  notes: string;
  emoji: string;
  pinned: boolean;
  createdAt: string;
  imageUrl?: string;
}

export type WishlistStatus = 'Planning' | 'Saving' | 'Purchased';

export interface WishlistItem {
  id: string;
  name: string;
  targetPrice: number;
  savedAmount: number;
  priority: 'high' | 'medium' | 'low';
  status: WishlistStatus;
  icon: string;
  category: string;
  link?: string;
  notes?: string;
  createdAt: string;
}

export interface NeedItem {
  id: string;
  name: string;
  qty: string;
  estimatedPrice: number;
  checked: boolean;
  category: string;
  createdAt: string;
}

export type TaskCategory =
  | 'college'
  | 'placement'
  | 'learning'
  | 'projects'
  | 'personal'
  | 'health';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // e.g. "10:00 AM"
  timeEstimate?: string; // e.g. "30 mins", "1 hr"
  notes?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface TaskSummary {
  total: number;
  completed: number;
  activeToday: Array<{
    id: string;
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    dueTime?: string;
  }>;
}

export interface DailyQuote {
  quote: string;
  author: string;
  tag: string;
}

export type JournalMood =
  | 'happy'
  | 'loved'
  | 'calm'
  | 'okay'
  | 'sad'
  | 'stressed'
  | 'excited';

export interface JournalEntry {
  id: string; // e.g. "2026-09-11"
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "Friday, September 11, 2026"
  mood: JournalMood;
  thoughts: string;
  pages?: string[]; // Multiple diary pages for this date
  gratitude: string;
  highlight: string;
  favoriteMemory?: string;
  learnedToday?: string;
  improveTomorrow?: string;
  updatedAt: string;
}

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Mon", "Tue"
  fullDate: string; // e.g. "Sep 11, 2026"
  tasksDone: number;
  tasksTotal: number;
  focusMinutes: number;
  journalLogged: boolean;
  journalMood?: JournalMood;
}

export interface HabitBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'growth' | 'focus' | 'mindfulness' | 'dreams';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
  requirement: string;
}

export interface FocusLogEntry {
  id: string;
  date: string;
  minutes: number;
  tag: string;
  notes?: string;
  timestamp: string;
}

export interface SanctuaryBackupData {
  version: string;
  exportedAt: string;
  appName: string;
  userProfile: UserProfile;
  themeId?: ThemeId;
  tasks: TaskItem[];
  journalEntries: JournalEntry[];
  goals: GoalPreview[];
  fantasies: FantasyItem[];
  wishlist: WishlistItem[];
  needs: NeedItem[];
  pomodoroFocusMins?: number;
  manualFocusLogs?: FocusLogEntry[];
}
