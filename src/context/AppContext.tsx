import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationTab,
  UserProfile,
  GoalPreview,
  TaskSummary,
  JournalEntry,
  TaskItem,
  FantasyItem,
  WishlistItem,
  NeedItem,
  SanctuaryBackupData,
} from '../types';
import { INITIAL_JOURNAL_ENTRIES } from '../data/initialJournal';
import { INITIAL_TASKS } from '../data/initialTasks';
import {
  INITIAL_FANTASIES,
  INITIAL_GOALS_FULL,
  INITIAL_WISHLIST,
  INITIAL_NEEDS,
} from '../data/initialDreams';
import { exportSanctuaryBackupFile } from '../utils/sanctuaryStorage';
import { getManualFocusLogs } from '../utils/analytics';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  goals: GoalPreview[];
  addGoal: (goal: Omit<GoalPreview, 'id' | 'createdAt'>) => void;
  updateGoal: (goal: GoalPreview) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  fantasies: FantasyItem[];
  addFantasy: (fantasy: Omit<FantasyItem, 'id' | 'createdAt'>) => void;
  updateFantasy: (fantasy: FantasyItem) => void;
  deleteFantasy: (id: string) => void;
  togglePinFantasy: (id: string) => void;
  wishlist: WishlistItem[];
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'createdAt'>) => void;
  updateWishlistItem: (item: WishlistItem) => void;
  deleteWishlistItem: (id: string) => void;
  addSavingsToWishlist: (id: string, amount: number) => void;
  needs: NeedItem[];
  addNeedItem: (item: Omit<NeedItem, 'id' | 'createdAt'>) => void;
  updateNeedItem: (item: NeedItem) => void;
  deleteNeedItem: (id: string) => void;
  toggleNeedItem: (id: string) => void;
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  updateTask: (task: TaskItem) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  taskSummary: TaskSummary;
  journalEntries: JournalEntry[];
  saveJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  getJournalEntryByDate: (dateStr: string) => JournalEntry | undefined;
  journalDoneToday: boolean;
  selectedJournalDate: string;
  setSelectedJournalDate: (date: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  exportSanctuaryBackup: () => void;
  importSanctuaryBackup: (data: SanctuaryBackupData) => void;
  resetSanctuaryData: (mode: 'demo' | 'clean') => void;
  setSanctuaryPin: (pin: string, hint?: string) => void;
  removeSanctuaryPin: () => void;
  verifySanctuaryPin: (pin: string) => boolean;
  toggleSoundEnabled: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PROFILE_KEY = 'my_little_world_profile';
const JOURNAL_KEY = 'my_little_world_journal_entries';
const TASKS_KEY = 'my_little_world_tasks';
const GOALS_KEY = 'my_little_world_goals';
const FANTASIES_KEY = 'my_little_world_fantasies';
const WISHLIST_KEY = 'my_little_world_wishlist';
const NEEDS_KEY = 'my_little_world_needs';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Dharani',
  avatarIcon: '🌸',
  streakDays: 7,
  pinCode: '1234',
  isPinSet: true,
  securityHint: 'Default passcode: 1234 (changeable in Settings)',
  autoLockMinutes: 15,
  soundEnabled: true,
};

const INITIAL_GOALS: GoalPreview[] = [
  {
    id: '1',
    title: 'Master Modern Web & AI Integrations',
    category: 'short-term',
    progress: 75,
    targetDate: 'Oct 15, 2026',
    icon: '✨',
  },
  {
    id: '2',
    title: 'Create My Cozy Dream Study Sanctuary',
    category: 'short-term',
    progress: 50,
    targetDate: 'Nov 01, 2026',
    icon: '🪴',
  },
  {
    id: '3',
    title: 'Build High-Impact Tech Career Portfolio',
    category: 'long-term',
    progress: 40,
    targetDate: 'Dec 31, 2026',
    icon: '🚀',
  },
];

const INITIAL_TASK_SUMMARY: TaskSummary = {
  total: 6,
  completed: 4,
  activeToday: [
    {
      id: 't1',
      title: 'Practice React architecture & custom hooks',
      category: '🧠 Learning',
      priority: 'high',
      completed: true,
      dueTime: '10:00 AM',
    },
    {
      id: 't2',
      title: 'Review System Design notes for placement',
      category: '💻 Placement',
      priority: 'high',
      completed: true,
      dueTime: '12:30 PM',
    },
    {
      id: 't3',
      title: '30-minute calming afternoon walk in nature',
      category: '💪 Health',
      priority: 'medium',
      completed: true,
      dueTime: '04:30 PM',
    },
    {
      id: 't4',
      title: 'Water the cute little succulents on the desk',
      category: '🏠 Personal',
      priority: 'low',
      completed: true,
      dueTime: '05:00 PM',
    },
    {
      id: 't5',
      title: 'Complete Stage 1 of My Little World dashboard',
      category: '🚀 Projects',
      priority: 'high',
      completed: false,
      dueTime: '08:00 PM',
    },
    {
      id: 't6',
      title: 'Write evening gratitude journal & reflection',
      category: '🏠 Personal',
      priority: 'medium',
      completed: false,
      dueTime: '09:30 PM',
    },
  ],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  // Start locked on app launch so it asks for the lock and then opens
  const [isLocked, setIsLocked] = useState<boolean>(true);

  // Goals state with LocalStorage persistence
  const [goals, setGoals] = useState<GoalPreview[]>(() => {
    try {
      const saved = localStorage.getItem(GOALS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_GOALS_FULL;
  });

  const saveGoalsToStorage = (updatedGoals: GoalPreview[]) => {
    try {
      localStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
    } catch {
      // ignore
    }
  };

  const addGoal = (newGoalData: Omit<GoalPreview, 'id' | 'createdAt'>) => {
    setGoals(prev => {
      const newGoal: GoalPreview = {
        ...newGoalData,
        id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newGoal, ...prev];
      saveGoalsToStorage(updated);
      return updated;
    });
  };

  const updateGoal = (updatedGoal: GoalPreview) => {
    setGoals(prev => {
      const updated = prev.map(g => (g.id === updatedGoal.id ? updatedGoal : g));
      saveGoalsToStorage(updated);
      return updated;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => {
      const updated = prev.filter(g => g.id !== id);
      saveGoalsToStorage(updated);
      return updated;
    });
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => {
      const updated = prev.map(g => {
        if (g.id !== goalId || !g.milestones) return g;
        const updatedMilestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const total = updatedMilestones.length;
        const done = updatedMilestones.filter(m => m.completed).length;
        const progress = total > 0 ? Math.round((done / total) * 100) : g.progress;
        return {
          ...g,
          milestones: updatedMilestones,
          progress,
        };
      });
      saveGoalsToStorage(updated);
      return updated;
    });
  };

  // Fantasies state with LocalStorage persistence
  const [fantasies, setFantasies] = useState<FantasyItem[]>(() => {
    try {
      const saved = localStorage.getItem(FANTASIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_FANTASIES;
  });

  const saveFantasiesToStorage = (updatedFantasies: FantasyItem[]) => {
    try {
      localStorage.setItem(FANTASIES_KEY, JSON.stringify(updatedFantasies));
    } catch {
      // ignore
    }
  };

  const addFantasy = (newFantasyData: Omit<FantasyItem, 'id' | 'createdAt'>) => {
    setFantasies(prev => {
      const item: FantasyItem = {
        ...newFantasyData,
        id: `fan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [item, ...prev];
      saveFantasiesToStorage(updated);
      return updated;
    });
  };

  const updateFantasy = (updatedFantasy: FantasyItem) => {
    setFantasies(prev => {
      const updated = prev.map(f => (f.id === updatedFantasy.id ? updatedFantasy : f));
      saveFantasiesToStorage(updated);
      return updated;
    });
  };

  const deleteFantasy = (id: string) => {
    setFantasies(prev => {
      const updated = prev.filter(f => f.id !== id);
      saveFantasiesToStorage(updated);
      return updated;
    });
  };

  const togglePinFantasy = (id: string) => {
    setFantasies(prev => {
      const updated = prev.map(f => (f.id === id ? { ...f, pinned: !f.pinned } : f));
      saveFantasiesToStorage(updated);
      return updated;
    });
  };

  // Wishlist state with LocalStorage persistence
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_WISHLIST;
  });

  const saveWishlistToStorage = (updatedWishlist: WishlistItem[]) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
    } catch {
      // ignore
    }
  };

  const addWishlistItem = (newItemData: Omit<WishlistItem, 'id' | 'createdAt'>) => {
    setWishlist(prev => {
      const item: WishlistItem = {
        ...newItemData,
        id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [item, ...prev];
      saveWishlistToStorage(updated);
      return updated;
    });
  };

  const updateWishlistItem = (updatedItem: WishlistItem) => {
    setWishlist(prev => {
      const updated = prev.map(w => (w.id === updatedItem.id ? updatedItem : w));
      saveWishlistToStorage(updated);
      return updated;
    });
  };

  const deleteWishlistItem = (id: string) => {
    setWishlist(prev => {
      const updated = prev.filter(w => w.id !== id);
      saveWishlistToStorage(updated);
      return updated;
    });
  };

  const addSavingsToWishlist = (id: string, amount: number) => {
    setWishlist(prev => {
      const updated = prev.map(w => {
        if (w.id !== id) return w;
        const newSaved = Math.max(0, Math.min(w.targetPrice, w.savedAmount + amount));
        const newStatus = newSaved >= w.targetPrice ? 'Purchased' : newSaved > 0 ? 'Saving' : w.status;
        return {
          ...w,
          savedAmount: newSaved,
          status: newStatus,
        };
      });
      saveWishlistToStorage(updated);
      return updated;
    });
  };

  // Needs state with LocalStorage persistence
  const [needs, setNeeds] = useState<NeedItem[]>(() => {
    try {
      const saved = localStorage.getItem(NEEDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_NEEDS;
  });

  const saveNeedsToStorage = (updatedNeeds: NeedItem[]) => {
    try {
      localStorage.setItem(NEEDS_KEY, JSON.stringify(updatedNeeds));
    } catch {
      // ignore
    }
  };

  const addNeedItem = (newItemData: Omit<NeedItem, 'id' | 'createdAt'>) => {
    setNeeds(prev => {
      const item: NeedItem = {
        ...newItemData,
        id: `need-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [item, ...prev];
      saveNeedsToStorage(updated);
      return updated;
    });
  };

  const updateNeedItem = (updatedItem: NeedItem) => {
    setNeeds(prev => {
      const updated = prev.map(n => (n.id === updatedItem.id ? updatedItem : n));
      saveNeedsToStorage(updated);
      return updated;
    });
  };

  const deleteNeedItem = (id: string) => {
    setNeeds(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNeedsToStorage(updated);
      return updated;
    });
  };

  const toggleNeedItem = (id: string) => {
    setNeeds(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, checked: !n.checked } : n));
      saveNeedsToStorage(updated);
      return updated;
    });
  };

  // Tasks state with LocalStorage persistence
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_TASKS;
  });

  const saveTasksToStorage = (updatedTasks: TaskItem[]) => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    } catch {
      // ignore
    }
  };

  const addTask = (newTaskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    setTasks(prev => {
      const created: TaskItem = {
        ...newTaskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [created, ...prev];
      saveTasksToStorage(updated);
      return updated;
    });
  };

  const updateTask = (updatedTask: TaskItem) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === updatedTask.id ? updatedTask : t));
      saveTasksToStorage(updated);
      return updated;
    });
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          const nextState = !t.completed;
          return {
            ...t,
            completed: nextState,
            completedAt: nextState ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });
      saveTasksToStorage(updated);
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTasksToStorage(updated);
      return updated;
    });
  };

  // Derive task summary dynamically from tasks
  const taskSummary: TaskSummary = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    activeToday: tasks.slice(0, 5).map(t => ({
      id: t.id,
      title: t.title,
      category: t.category,
      priority: t.priority,
      completed: t.completed,
      dueTime: t.dueTime,
    })),
  };

  // Today's formatted local date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedJournalDate, setSelectedJournalDate] = useState<string>(todayStr);

  // Journal entries state with LocalStorage
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(JOURNAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_JOURNAL_ENTRIES;
  });

  const saveJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => {
      const existingIdx = prev.findIndex(e => e.id === entry.id || e.date === entry.date);
      let updated: JournalEntry[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = entry;
      } else {
        updated = [entry, ...prev];
      }
      // Sort descending by date
      updated.sort((a, b) => (a.date < b.date ? 1 : -1));
      try {
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prev => {
      const updated = prev.filter(e => e.id !== id && e.date !== id);
      try {
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const getJournalEntryByDate = (dateStr: string) => {
    return journalEntries.find(e => e.date === dateStr || e.id === dateStr);
  };

  const journalDoneToday = Boolean(journalEntries.some(e => e.date === todayStr));

  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          pinCode: parsed.pinCode || '1234',
          isPinSet: true,
          securityHint: parsed.securityHint || 'Default passcode: 1234',
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfileState(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const setSanctuaryPin = (pin: string, hint?: string) => {
    updateUserProfile({
      pinCode: pin,
      isPinSet: true,
      securityHint: hint?.trim() || undefined,
    });
  };

  const removeSanctuaryPin = () => {
    updateUserProfile({
      pinCode: undefined,
      isPinSet: false,
      securityHint: undefined,
    });
  };

  const verifySanctuaryPin = (enteredPin: string): boolean => {
    if (!userProfile.isPinSet || !userProfile.pinCode) {
      return true;
    }
    return userProfile.pinCode === enteredPin;
  };

  const toggleSoundEnabled = () => {
    updateUserProfile({ soundEnabled: !userProfile.soundEnabled });
  };

  // Auto-lock inactivity watcher
  useEffect(() => {
    if (!userProfile.autoLockMinutes || userProfile.autoLockMinutes <= 0 || isLocked) {
      return;
    }

    let lastActivity = Date.now();
    const handleUserActivity = () => {
      lastActivity = Date.now();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    const checkInterval = setInterval(() => {
      const elapsedMinutes = (Date.now() - lastActivity) / 60000;
      if (elapsedMinutes >= userProfile.autoLockMinutes) {
        setIsLocked(true);
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      clearInterval(checkInterval);
    };
  }, [userProfile.autoLockMinutes, isLocked]);

  const exportSanctuaryBackup = () => {
    let focusMins = 100;
    try {
      const saved = localStorage.getItem('mlw_pomodoro_focus_mins');
      if (saved) focusMins = parseInt(saved, 10);
    } catch {
      // ignore
    }

    const backup: SanctuaryBackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'My Little World♡',
      userProfile,
      tasks,
      journalEntries,
      goals,
      fantasies,
      wishlist,
      needs,
      pomodoroFocusMins: focusMins,
      manualFocusLogs: getManualFocusLogs(),
    };

    exportSanctuaryBackupFile(backup);
    localStorage.setItem('mlw_last_backup_date', new Date().toLocaleDateString());
  };

  const importSanctuaryBackup = (data: SanctuaryBackupData) => {
    if (data.userProfile) {
      setUserProfileState(data.userProfile);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data.userProfile));
    }
    if (Array.isArray(data.tasks)) {
      setTasks(data.tasks);
      localStorage.setItem(TASKS_KEY, JSON.stringify(data.tasks));
    }
    if (Array.isArray(data.journalEntries)) {
      setJournalEntries(data.journalEntries);
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(data.journalEntries));
    }
    if (Array.isArray(data.goals)) {
      setGoals(data.goals);
      localStorage.setItem(GOALS_KEY, JSON.stringify(data.goals));
    }
    if (Array.isArray(data.fantasies)) {
      setFantasies(data.fantasies);
      localStorage.setItem(FANTASIES_KEY, JSON.stringify(data.fantasies));
    }
    if (Array.isArray(data.wishlist)) {
      setWishlist(data.wishlist);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(data.wishlist));
    }
    if (Array.isArray(data.needs)) {
      setNeeds(data.needs);
      localStorage.setItem(NEEDS_KEY, JSON.stringify(data.needs));
    }
    if (data.pomodoroFocusMins !== undefined) {
      localStorage.setItem('mlw_pomodoro_focus_mins', data.pomodoroFocusMins.toString());
    }
    if (Array.isArray(data.manualFocusLogs)) {
      localStorage.setItem('mlw_manual_focus_logs', JSON.stringify(data.manualFocusLogs));
    }
  };

  const resetSanctuaryData = (mode: 'demo' | 'clean') => {
    if (mode === 'demo') {
      setUserProfileState(DEFAULT_PROFILE);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      setTasks(INITIAL_TASKS);
      localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
      setJournalEntries(INITIAL_JOURNAL_ENTRIES);
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
      setGoals(INITIAL_GOALS_FULL);
      localStorage.setItem(GOALS_KEY, JSON.stringify(INITIAL_GOALS_FULL));
      setFantasies(INITIAL_FANTASIES);
      localStorage.setItem(FANTASIES_KEY, JSON.stringify(INITIAL_FANTASIES));
      setWishlist(INITIAL_WISHLIST);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(INITIAL_WISHLIST));
      setNeeds(INITIAL_NEEDS);
      localStorage.setItem(NEEDS_KEY, JSON.stringify(INITIAL_NEEDS));
      localStorage.setItem('mlw_pomodoro_focus_mins', '100');
      localStorage.setItem('mlw_pomodoro_sessions_today', '4');
      localStorage.removeItem('mlw_manual_focus_logs');
    } else {
      const freshProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        name: userProfile.name,
        avatarIcon: userProfile.avatarIcon,
      };
      setUserProfileState(freshProfile);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(freshProfile));
      setTasks([]);
      localStorage.setItem(TASKS_KEY, JSON.stringify([]));
      setJournalEntries([]);
      localStorage.setItem(JOURNAL_KEY, JSON.stringify([]));
      setGoals([]);
      localStorage.setItem(GOALS_KEY, JSON.stringify([]));
      setFantasies([]);
      localStorage.setItem(FANTASIES_KEY, JSON.stringify([]));
      setWishlist([]);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([]));
      setNeeds([]);
      localStorage.setItem(NEEDS_KEY, JSON.stringify([]));
      localStorage.setItem('mlw_pomodoro_focus_mins', '0');
      localStorage.setItem('mlw_pomodoro_sessions_today', '0');
      localStorage.removeItem('mlw_manual_focus_logs');
    }
  };

  useEffect(() => {
    // Scroll to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        updateUserProfile,
        isLocked,
        setIsLocked,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        fantasies,
        addFantasy,
        updateFantasy,
        deleteFantasy,
        togglePinFantasy,
        wishlist,
        addWishlistItem,
        updateWishlistItem,
        deleteWishlistItem,
        addSavingsToWishlist,
        needs,
        addNeedItem,
        updateNeedItem,
        deleteNeedItem,
        toggleNeedItem,
        tasks,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        taskSummary,
        journalEntries,
        saveJournalEntry,
        deleteJournalEntry,
        getJournalEntryByDate,
        journalDoneToday,
        selectedJournalDate,
        setSelectedJournalDate,
        mobileMenuOpen,
        setMobileMenuOpen,
        exportSanctuaryBackup,
        importSanctuaryBackup,
        resetSanctuaryData,
        setSanctuaryPin,
        removeSanctuaryPin,
        verifySanctuaryPin,
        toggleSoundEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
