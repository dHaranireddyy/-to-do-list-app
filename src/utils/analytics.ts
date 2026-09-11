import {
  TaskItem,
  JournalEntry,
  GoalPreview,
  WishlistItem,
  DailyActivityRecord,
  HabitBadge,
  TaskCategory,
  JournalMood,
  FocusLogEntry,
} from '../types';
import { GENERATED_30_DAYS_ACTIVITY, BASE_MILESTONE_BADGES, getPastDateStr } from '../data/initialProgress';

const MANUAL_FOCUS_KEY = 'mlw_manual_focus_logs';

export function getManualFocusLogs(): FocusLogEntry[] {
  try {
    const saved = localStorage.getItem(MANUAL_FOCUS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveManualFocusLog(entry: Omit<FocusLogEntry, 'id' | 'timestamp'>): FocusLogEntry {
  const newEntry: FocusLogEntry = {
    ...entry,
    id: `focus-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  try {
    const prev = getManualFocusLogs();
    const updated = [newEntry, ...prev];
    localStorage.setItem(MANUAL_FOCUS_KEY, JSON.stringify(updated));

    // Also update pomodoro totals in localStorage
    const savedMins = localStorage.getItem('mlw_pomodoro_focus_mins');
    const currentMins = savedMins ? parseInt(savedMins, 10) : 100;
    localStorage.setItem('mlw_pomodoro_focus_mins', (currentMins + entry.minutes).toString());

    const savedSessions = localStorage.getItem('mlw_pomodoro_sessions_today');
    const currentSessions = savedSessions ? parseInt(savedSessions, 10) : 4;
    localStorage.setItem('mlw_pomodoro_sessions_today', (currentSessions + 1).toString());
  } catch {
    // ignore
  }
  return newEntry;
}

export interface ProgressSummaryStats {
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
  todayFocusMinutes: number;
  todayFocusSessions: number;
  weeklyFocusMinutes: number;
  journalStreak: number;
  totalJournalEntries: number;
  dominantMood: { mood: JournalMood; emoji: string; label: string; count: number } | null;
  overallGrowthScore: number;
}

export function computeProgressStats(
  tasks: TaskItem[],
  journalEntries: JournalEntry[],
  goals: GoalPreview[],
  wishlist: WishlistItem[],
  streakDays: number
): ProgressSummaryStats {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Read focus minutes from localStorage
  let todayFocusMinutes = 100;
  let todayFocusSessions = 4;
  try {
    const savedMins = localStorage.getItem('mlw_pomodoro_focus_mins');
    if (savedMins) todayFocusMinutes = parseInt(savedMins, 10);
    const savedSessions = localStorage.getItem('mlw_pomodoro_sessions_today');
    if (savedSessions) todayFocusSessions = parseInt(savedSessions, 10);
  } catch {
    // fallback
  }

  // Include manual logs in weekly focus calculation
  const manualLogs = getManualFocusLogs();
  const manualMinsSum = manualLogs.reduce((sum, l) => sum + l.minutes, 0);
  const weeklyFocusMinutes = todayFocusMinutes + 350 + manualMinsSum; // 350 mins prior this week

  // Dominant mood
  const moodCounts: Record<string, number> = {};
  journalEntries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  const moodMeta: Record<JournalMood, { emoji: string; label: string }> = {
    happy: { emoji: '😊', label: 'Happy' },
    loved: { emoji: '🥰', label: 'Loved' },
    calm: { emoji: '😌', label: 'Calm' },
    okay: { emoji: '😐', label: 'Okay' },
    sad: { emoji: '😔', label: 'Reflective' },
    stressed: { emoji: '😫', label: 'Seeking Peace' },
    excited: { emoji: '🤩', label: 'Inspired' },
  };

  let dominantMood: { mood: JournalMood; emoji: string; label: string; count: number } | null = null;
  let maxCount = 0;
  Object.entries(moodCounts).forEach(([m, count]) => {
    if (count > maxCount) {
      maxCount = count;
      const key = m as JournalMood;
      dominantMood = {
        mood: key,
        emoji: moodMeta[key]?.emoji || '✨',
        label: moodMeta[key]?.label || key,
        count,
      };
    }
  });

  if (!dominantMood) {
    dominantMood = { mood: 'calm', emoji: '😌', label: 'Calm', count: 2 };
  }

  // Calculate composite growth score (0 - 100)
  const taskFactor = Math.min(40, (taskCompletionRate / 100) * 40);
  const streakFactor = Math.min(30, (streakDays / 7) * 30);
  const goalsFactor = goals.length > 0 ? (goals.reduce((s, g) => s + g.progress, 0) / (goals.length * 100)) * 20 : 15;
  const journalFactor = journalEntries.length >= 2 ? 10 : 5;
  const overallGrowthScore = Math.min(100, Math.round(taskFactor + streakFactor + goalsFactor + journalFactor));

  return {
    totalTasks,
    completedTasks,
    taskCompletionRate,
    todayFocusMinutes,
    todayFocusSessions,
    weeklyFocusMinutes,
    journalStreak: streakDays,
    totalJournalEntries: journalEntries.length,
    dominantMood,
    overallGrowthScore,
  };
}

// Category breakdown helper
export interface CategoryProgress {
  category: TaskCategory;
  label: string;
  emoji: string;
  color: string;
  total: number;
  completed: number;
  percentage: number;
}

export function computeCategoryProgress(tasks: TaskItem[]): CategoryProgress[] {
  const categories: Array<{ id: TaskCategory; label: string; emoji: string; color: string }> = [
    { id: 'college', label: 'College & Academics', emoji: '📚', color: '#6366F1' },
    { id: 'placement', label: 'Placement Prep', emoji: '💻', color: '#EC4899' },
    { id: 'learning', label: 'Continuous Learning', emoji: '🧠', color: '#8B5CF6' },
    { id: 'projects', label: 'Build & Projects', emoji: '🚀', color: '#10B981' },
    { id: 'health', label: 'Health & Wellness', emoji: '🧘‍♀️', color: '#F59E0B' },
    { id: 'personal', label: 'Personal Sanctuary', emoji: '🌸', color: '#F43F5E' },
  ];

  return categories.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat.id);
    const total = catTasks.length;
    const completed = catTasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      category: cat.id,
      label: cat.label,
      emoji: cat.emoji,
      color: cat.color,
      total,
      completed,
      percentage,
    };
  });
}

// Merge live activity for the given timeframe (7, 14, or 30 days)
export function getMergedActivityRecords(
  daysCount: number,
  tasks: TaskItem[],
  journalEntries: JournalEntry[]
): DailyActivityRecord[] {
  const records = GENERATED_30_DAYS_ACTIVITY.slice(0, daysCount);

  // Synchronize index 0 (Today) with actual live tasks & journal
  const todayTasksCompleted = tasks.filter(t => t.completed).length;
  const todayTasksTotal = tasks.length;
  const todayStr = getPastDateStr(0).dateStr;
  const todayJournal = journalEntries.find(j => j.date === todayStr);

  let todayFocus = 100;
  try {
    const savedMins = localStorage.getItem('mlw_pomodoro_focus_mins');
    if (savedMins) todayFocus = parseInt(savedMins, 10);
  } catch {
    // ignore
  }

  const updatedRecords = records.map((rec, idx) => {
    if (idx === 0) {
      return {
        ...rec,
        tasksDone: todayTasksCompleted,
        tasksTotal: todayTasksTotal,
        focusMinutes: todayFocus,
        journalLogged: Boolean(todayJournal),
        journalMood: todayJournal ? todayJournal.mood : rec.journalMood,
      };
    }
    // Check if user has real journal entries matching historical days
    const foundJournal = journalEntries.find(j => j.date === rec.date);
    if (foundJournal) {
      return {
        ...rec,
        journalLogged: true,
        journalMood: foundJournal.mood,
      };
    }
    return rec;
  });

  return updatedRecords;
}

// Compute live badges with actual user progress
export function computeLiveBadges(
  tasks: TaskItem[],
  journalEntries: JournalEntry[],
  goals: GoalPreview[],
  wishlist: WishlistItem[],
  streakDays: number
): HabitBadge[] {
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalSavedWishlist = wishlist.reduce((s, w) => s + (w.savedAmount || 0), 0);
  const calmLovedJournals = journalEntries.filter(j => j.mood === 'calm' || j.mood === 'loved').length;

  let totalFocusMinutes = 100;
  try {
    const saved = localStorage.getItem('mlw_pomodoro_focus_mins');
    if (saved) totalFocusMinutes = parseInt(saved, 10);
  } catch {
    // ignore
  }

  return BASE_MILESTONE_BADGES.map(badge => {
    switch (badge.id) {
      case 'journal_streak_7':
        return {
          ...badge,
          progress: Math.min(badge.maxProgress, streakDays),
          unlocked: streakDays >= badge.maxProgress,
        };
      case 'deep_flow_master':
        return {
          ...badge,
          progress: Math.min(badge.maxProgress, totalFocusMinutes),
          unlocked: totalFocusMinutes >= badge.maxProgress,
        };
      case 'organized_mind':
        return {
          ...badge,
          progress: Math.min(badge.maxProgress, completedTasksCount),
          unlocked: completedTasksCount >= badge.maxProgress,
        };
      case 'dream_weaver':
        return {
          ...badge,
          progress: Math.min(badge.maxProgress, goals.length),
          unlocked: goals.length >= badge.maxProgress,
        };
      case 'mindful_saver':
        return {
          ...badge,
          progress: Math.min(badge.maxProgress, totalSavedWishlist),
          unlocked: totalSavedWishlist >= badge.maxProgress,
        };
      case 'peaceful_heart':
        return {
          ...badge,
          progress: Math.min(badge.maxProgress, calmLovedJournals),
          unlocked: calmLovedJournals >= badge.maxProgress,
        };
      case 'zen_perseverance':
        return {
          ...badge,
          progress: Math.min(badge.maxProgress, streakDays),
          unlocked: streakDays >= badge.maxProgress,
        };
      default:
        return badge;
    }
  });
}
