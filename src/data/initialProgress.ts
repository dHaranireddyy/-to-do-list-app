import { DailyActivityRecord, HabitBadge } from '../types';

// Helper to get formatted date string YYYY-MM-DD
export function getPastDateStr(daysAgo: number): { dateStr: string; dayLabel: string; fullDate: string } {
  const d = new Date(2026, 8, 11); // Sep 11, 2026
  d.setDate(d.getDate() - daysAgo);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${date}`;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return {
    dateStr,
    dayLabel: days[d.getDay()],
    fullDate: `${months[d.getMonth()]} ${d.getDate()}, ${year}`,
  };
}

// Generate realistic 30-day activity history
export const GENERATED_30_DAYS_ACTIVITY: DailyActivityRecord[] = [
  // 0 days ago (Today, Sep 11, 2026)
  {
    date: getPastDateStr(0).dateStr,
    dayLabel: getPastDateStr(0).dayLabel,
    fullDate: getPastDateStr(0).fullDate,
    tasksDone: 4,
    tasksTotal: 6,
    focusMinutes: 100,
    journalLogged: true,
    journalMood: 'happy',
  },
  // 1 day ago (Sep 10)
  {
    date: getPastDateStr(1).dateStr,
    dayLabel: getPastDateStr(1).dayLabel,
    fullDate: getPastDateStr(1).fullDate,
    tasksDone: 5,
    tasksTotal: 5,
    focusMinutes: 75,
    journalLogged: true,
    journalMood: 'loved',
  },
  // 2 days ago (Sep 09)
  {
    date: getPastDateStr(2).dateStr,
    dayLabel: getPastDateStr(2).dayLabel,
    fullDate: getPastDateStr(2).fullDate,
    tasksDone: 6,
    tasksTotal: 6,
    focusMinutes: 125,
    journalLogged: true,
    journalMood: 'calm',
  },
  // 3 days ago (Sep 08)
  {
    date: getPastDateStr(3).dateStr,
    dayLabel: getPastDateStr(3).dayLabel,
    fullDate: getPastDateStr(3).fullDate,
    tasksDone: 4,
    tasksTotal: 5,
    focusMinutes: 50,
    journalLogged: true,
    journalMood: 'excited',
  },
  // 4 days ago (Sep 07)
  {
    date: getPastDateStr(4).dateStr,
    dayLabel: getPastDateStr(4).dayLabel,
    fullDate: getPastDateStr(4).fullDate,
    tasksDone: 3,
    tasksTotal: 4,
    focusMinutes: 50,
    journalLogged: true,
    journalMood: 'calm',
  },
  // 5 days ago (Sep 06)
  {
    date: getPastDateStr(5).dateStr,
    dayLabel: getPastDateStr(5).dayLabel,
    fullDate: getPastDateStr(5).fullDate,
    tasksDone: 4,
    tasksTotal: 4,
    focusMinutes: 75,
    journalLogged: true,
    journalMood: 'loved',
  },
  // 6 days ago (Sep 05)
  {
    date: getPastDateStr(6).dateStr,
    dayLabel: getPastDateStr(6).dayLabel,
    fullDate: getPastDateStr(6).fullDate,
    tasksDone: 5,
    tasksTotal: 6,
    focusMinutes: 100,
    journalLogged: true,
    journalMood: 'happy',
  },
  // 7 days ago (Sep 04)
  {
    date: getPastDateStr(7).dateStr,
    dayLabel: getPastDateStr(7).dayLabel,
    fullDate: getPastDateStr(7).fullDate,
    tasksDone: 4,
    tasksTotal: 5,
    focusMinutes: 75,
    journalLogged: true,
    journalMood: 'calm',
  },
  // 8 days ago (Sep 03)
  {
    date: getPastDateStr(8).dateStr,
    dayLabel: getPastDateStr(8).dayLabel,
    fullDate: getPastDateStr(8).fullDate,
    tasksDone: 6,
    tasksTotal: 6,
    focusMinutes: 125,
    journalLogged: true,
    journalMood: 'excited',
  },
  // 9 days ago (Sep 02)
  {
    date: getPastDateStr(9).dateStr,
    dayLabel: getPastDateStr(9).dayLabel,
    fullDate: getPastDateStr(9).fullDate,
    tasksDone: 3,
    tasksTotal: 5,
    focusMinutes: 50,
    journalLogged: false,
  },
  // 10 days ago (Sep 01)
  {
    date: getPastDateStr(10).dateStr,
    dayLabel: getPastDateStr(10).dayLabel,
    fullDate: getPastDateStr(10).fullDate,
    tasksDone: 5,
    tasksTotal: 5,
    focusMinutes: 100,
    journalLogged: true,
    journalMood: 'happy',
  },
  // 11 days ago (Aug 31)
  {
    date: getPastDateStr(11).dateStr,
    dayLabel: getPastDateStr(11).dayLabel,
    fullDate: getPastDateStr(11).fullDate,
    tasksDone: 4,
    tasksTotal: 4,
    focusMinutes: 75,
    journalLogged: true,
    journalMood: 'loved',
  },
  // 12 days ago (Aug 30)
  {
    date: getPastDateStr(12).dateStr,
    dayLabel: getPastDateStr(12).dayLabel,
    fullDate: getPastDateStr(12).fullDate,
    tasksDone: 2,
    tasksTotal: 3,
    focusMinutes: 25,
    journalLogged: true,
    journalMood: 'calm',
  },
  // 13 days ago (Aug 29)
  {
    date: getPastDateStr(13).dateStr,
    dayLabel: getPastDateStr(13).dayLabel,
    fullDate: getPastDateStr(13).fullDate,
    tasksDone: 5,
    tasksTotal: 6,
    focusMinutes: 100,
    journalLogged: true,
    journalMood: 'happy',
  },
  // 14 days ago (Aug 28)
  {
    date: getPastDateStr(14).dateStr,
    dayLabel: getPastDateStr(14).dayLabel,
    fullDate: getPastDateStr(14).fullDate,
    tasksDone: 4,
    tasksTotal: 5,
    focusMinutes: 50,
    journalLogged: true,
    journalMood: 'calm',
  },
  // 15 days ago (Aug 27)
  {
    date: getPastDateStr(15).dateStr,
    dayLabel: getPastDateStr(15).dayLabel,
    fullDate: getPastDateStr(15).fullDate,
    tasksDone: 6,
    tasksTotal: 6,
    focusMinutes: 150,
    journalLogged: true,
    journalMood: 'excited',
  },
  // 16 days ago (Aug 26)
  {
    date: getPastDateStr(16).dateStr,
    dayLabel: getPastDateStr(16).dayLabel,
    fullDate: getPastDateStr(16).fullDate,
    tasksDone: 3,
    tasksTotal: 4,
    focusMinutes: 50,
    journalLogged: true,
    journalMood: 'loved',
  },
  // 17 days ago (Aug 25)
  {
    date: getPastDateStr(17).dateStr,
    dayLabel: getPastDateStr(17).dayLabel,
    fullDate: getPastDateStr(17).fullDate,
    tasksDone: 5,
    tasksTotal: 5,
    focusMinutes: 100,
    journalLogged: true,
    journalMood: 'happy',
  },
  // 18 days ago (Aug 24)
  {
    date: getPastDateStr(18).dateStr,
    dayLabel: getPastDateStr(18).dayLabel,
    fullDate: getPastDateStr(18).fullDate,
    tasksDone: 4,
    tasksTotal: 5,
    focusMinutes: 75,
    journalLogged: true,
    journalMood: 'calm',
  },
  // 19 days ago (Aug 23)
  {
    date: getPastDateStr(19).dateStr,
    dayLabel: getPastDateStr(19).dayLabel,
    fullDate: getPastDateStr(19).fullDate,
    tasksDone: 3,
    tasksTotal: 3,
    focusMinutes: 50,
    journalLogged: true,
    journalMood: 'loved',
  },
  // 20 days ago (Aug 22)
  {
    date: getPastDateStr(20).dateStr,
    dayLabel: getPastDateStr(20).dayLabel,
    fullDate: getPastDateStr(20).fullDate,
    tasksDone: 4,
    tasksTotal: 5,
    focusMinutes: 75,
    journalLogged: true,
    journalMood: 'happy',
  },
];

// Baseline milestone achievements
export const BASE_MILESTONE_BADGES: HabitBadge[] = [
  {
    id: 'sanctuary_awakened',
    title: 'Sanctuary Awakened',
    description: 'Began crafting your safe personal aesthetic space.',
    icon: '🌸',
    category: 'mindfulness',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: 'Sep 01, 2026',
    requirement: 'Create your Little World space',
  },
  {
    id: 'journal_streak_7',
    title: '7-Day Mindful Glow',
    description: 'Reflected in your private journal for 7 active days.',
    icon: '🔥',
    category: 'mindfulness',
    unlocked: true,
    progress: 7,
    maxProgress: 7,
    unlockedAt: 'Sep 11, 2026',
    requirement: 'Log journal for 7 consecutive days',
  },
  {
    id: 'deep_flow_master',
    title: 'Gentle Flow Master',
    description: 'Completed 100+ mindful Pomodoro focus minutes.',
    icon: '⏱️',
    category: 'focus',
    unlocked: true,
    progress: 100,
    maxProgress: 100,
    unlockedAt: 'Sep 09, 2026',
    requirement: 'Reach 100 focus minutes in the study timer',
  },
  {
    id: 'organized_mind',
    title: 'Organized Mind',
    description: 'Accomplished 15+ actionable tasks across your boards.',
    icon: '📝',
    category: 'growth',
    unlocked: true,
    progress: 28,
    maxProgress: 30,
    unlockedAt: 'Sep 10, 2026',
    requirement: 'Complete 30 to-do items',
  },
  {
    id: 'dream_weaver',
    title: 'Visionary Dreamer',
    description: 'Crafted 3+ goals and milestones in your sanctuary.',
    icon: '🎯',
    category: 'dreams',
    unlocked: true,
    progress: 3,
    maxProgress: 3,
    unlockedAt: 'Sep 08, 2026',
    requirement: 'Log 3 active short or long term goals',
  },
  {
    id: 'mindful_saver',
    title: 'Intentional Saver',
    description: 'Deposited savings towards your peaceful sanctuary wishlist.',
    icon: '🛍️',
    category: 'dreams',
    unlocked: true,
    progress: 4300,
    maxProgress: 5000,
    unlockedAt: 'Sep 09, 2026',
    requirement: 'Accumulate ₹5,000 in wishlist savings',
  },
  {
    id: 'peaceful_heart',
    title: 'Peaceful Heart',
    description: 'Logged 5 reflections filled with calm and gratitude.',
    icon: '😌',
    category: 'mindfulness',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    unlockedAt: 'Sep 10, 2026',
    requirement: 'Log 5 Calm or Loved journal entries',
  },
  {
    id: 'zen_perseverance',
    title: 'Zen Perseverance',
    description: 'Maintain focus discipline and achieve a 14-day consistency rhythm.',
    icon: '🌱',
    category: 'growth',
    unlocked: false,
    progress: 7,
    maxProgress: 14,
    requirement: 'Reach a 14-day mindfulness streak',
  },
];
