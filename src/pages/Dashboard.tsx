import React, { useState, useEffect } from 'react';
import {
  Clock as ClockIcon,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  Flame,
  ArrowRight,
  RefreshCw,
  Calendar,
  Heart,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { AESTHETIC_QUOTES } from '../data/quotes';

export const Dashboard: React.FC = () => {
  const {
    userProfile,
    goals,
    tasks,
    taskSummary,
    toggleTaskCompleted,
    journalEntries,
    journalDoneToday,
    setSelectedJournalDate,
    setActiveTab,
  } = useApp();
  const { currentTheme, isDark, themeSymbol } = useTheme();

  const todayIso = new Date().toISOString().split('T')[0];
  const todayJournalEntry = journalEntries.find(e => e.date === todayIso);

  // Quote State
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = AESTHETIC_QUOTES[quoteIndex % AESTHETIC_QUOTES.length];

  const handleNextQuote = () => {
    setQuoteIndex(prev => (prev + 1) % AESTHETIC_QUOTES.length);
  };

  // Live Clock State
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0];
  const minutes = time.toLocaleTimeString('en-US', { minute: '2-digit' }).padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.toLocaleTimeString('en-US', { hour12: true }).slice(-2);

  const completedCount = taskSummary.activeToday.filter(t => t.completed).length;
  const totalCount = taskSummary.activeToday.length;
  const taskProgressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner / Welcome card with cozy aesthetic */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xs border transition-all"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))'
            : `linear-gradient(135deg, ${currentTheme.primaryColor}15, ${currentTheme.secondaryColor}25)`,
          borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : `${currentTheme.primaryColor}25`,
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border backdrop-blur-xs"
              style={{
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : `${currentTheme.primaryColor}40`,
                color: isDark ? '#E0E7FF' : currentTheme.accentColor,
              }}
            >
              <span>{themeSymbol}</span>
              <span>Welcome to your private sanctuary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100 tracking-tight">
              Make today peaceful, intentional & kind.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              You have completed <strong className="font-semibold" style={{ color: currentTheme.accentColor }}>{completedCount} of {totalCount}</strong> tasks today, and your cozy Little World♡ is flourishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('journal')}
              className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: currentTheme.accentColor,
                color: '#FFFFFF',
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span>{journalDoneToday ? "Review Journal" : "Write Today's Diary"}</span>
            </button>
            <button
              onClick={() => setActiveTab('todo')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all border flex items-center gap-2 hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div
          className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: currentTheme.primaryColor }}
        />
      </div>

      {/* Main Grid: 2-column or 3-column responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* 1. CLOCK CARD */}
        <Card hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : `${currentTheme.primaryColor}20`,
                    color: currentTheme.accentColor,
                  }}
                >
                  <ClockIcon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Live Clock</h3>
              </div>
              <Badge variant="primary" icon="✨">
                Live
              </Badge>
            </div>

            {/* Big aesthetic clock digits */}
            <div className="text-center py-4 sm:py-6">
              <div className="flex items-baseline justify-center font-serif text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                <span>{hours}</span>
                <span className="animate-pulse mx-1" style={{ color: currentTheme.accentColor }}>:</span>
                <span>{minutes}</span>
                <span className="text-xs font-sans text-slate-400 dark:text-slate-500 ml-1.5 font-mono">
                  :{seconds}
                </span>
                <span
                  className="text-xs font-semibold font-sans px-2 py-0.5 rounded-md ml-2 border"
                  style={{
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : `${currentTheme.primaryColor}15`,
                    color: currentTheme.accentColor,
                    borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : `${currentTheme.primaryColor}30`,
                  }}
                >
                  {ampm}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Every second is a chance to start gently.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('clock')}
            className="w-full mt-4 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group"
            style={{
              backgroundColor: isDark ? 'rgba(51, 65, 85, 0.4)' : `${currentTheme.primaryColor}12`,
              color: isDark ? '#CBD5E1' : currentTheme.accentColor,
            }}
          >
            <span>Open Clock & Pomodoro</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </Card>

        {/* 2. TODAY'S TASKS CARD */}
        <Card hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5',
                    color: '#059669',
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Today's Tasks</h3>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {completedCount} / {totalCount} completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 mb-4">
              <ProgressBar progress={taskProgressPercent} />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                <span>{totalCount - completedCount} tasks remaining</span>
                <span className="font-semibold" style={{ color: currentTheme.accentColor }}>
                  {taskProgressPercent}% done
                </span>
              </div>
            </div>

            {/* Quick task list preview */}
            <div className="space-y-2">
              {taskSummary.activeToday.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskCompleted(task.id)}
                  className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    task.completed
                      ? 'text-slate-400 line-through bg-slate-50/50 dark:bg-slate-800/30'
                      : 'text-slate-700 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <span className="truncate flex-1 font-medium">{task.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 shrink-0">
                    {task.category.includes(' ') ? task.category.split(' ')[1] : task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('todo')}
            className="w-full mt-4 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group"
            style={{
              backgroundColor: isDark ? 'rgba(51, 65, 85, 0.4)' : `${currentTheme.primaryColor}12`,
              color: isDark ? '#CBD5E1' : currentTheme.accentColor,
            }}
          >
            <span>Manage All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </Card>

        {/* 3. DAILY JOURNAL STATUS CARD */}
        <Card hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(236, 72, 153, 0.2)' : `${currentTheme.primaryColor}20`,
                    color: currentTheme.accentColor,
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Daily Journal</h3>
              </div>
              <Badge variant={journalDoneToday ? 'success' : 'warning'}>
                {journalDoneToday ? 'Written' : 'Pending'}
              </Badge>
            </div>

            <div
              className={`p-4 rounded-2xl border text-center my-2 transition-colors ${
                journalDoneToday
                  ? isDark
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                    : 'bg-emerald-50/60 border-emerald-200/60 text-emerald-800'
                  : isDark
                  ? 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                  : 'bg-pink-50/40 border-pink-100 text-slate-700'
              }`}
            >
              <div className="text-2xl mb-1.5">
                {todayJournalEntry
                  ? todayJournalEntry.mood === 'happy'
                    ? '😊'
                    : todayJournalEntry.mood === 'loved'
                    ? '🥰'
                    : todayJournalEntry.mood === 'calm'
                    ? '😌'
                    : todayJournalEntry.mood === 'okay'
                    ? '😐'
                    : todayJournalEntry.mood === 'sad'
                    ? '😔'
                    : todayJournalEntry.mood === 'stressed'
                    ? '😫'
                    : '🤩'
                  : '📔'}
              </div>
              <p className="font-serif font-semibold text-sm">
                {journalDoneToday
                  ? "Today's thoughts are recorded ♡"
                  : "Your journal is waiting for you ♡"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {todayJournalEntry?.thoughts
                  ? `"${todayJournalEntry.thoughts}"`
                  : journalDoneToday
                  ? "Revisit anytime or write another reflection."
                  : "Reflect on gratitude, moments, and feelings."}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedJournalDate(todayIso);
              setActiveTab('journal');
            }}
            className="w-full mt-4 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group"
            style={{
              backgroundColor: isDark ? 'rgba(51, 65, 85, 0.4)' : `${currentTheme.primaryColor}12`,
              color: isDark ? '#CBD5E1' : currentTheme.accentColor,
            }}
          >
            <span>{journalDoneToday ? 'Open Journal Entry' : 'Write in Journal'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </Card>

        {/* 4. CURRENT GOALS CARD */}
        <Card hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : '#F3E8FF',
                    color: '#9333EA',
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Current Goals</h3>
              </div>
              <Badge variant="primary" icon="🎯">
                {goals.length} Active
              </Badge>
            </div>

            {/* Goals list */}
            <div className="space-y-3 mt-3">
              {goals.slice(0, 3).map(goal => (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{goal.icon}</span>
                      <span className="truncate max-w-[170px]">{goal.title}</span>
                    </span>
                    <span className="text-[11px] font-semibold" style={{ color: currentTheme.accentColor }}>
                      {goal.progress}%
                    </span>
                  </div>
                  <ProgressBar progress={goal.progress} size="sm" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('dreams')}
            className="w-full mt-4 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group"
            style={{
              backgroundColor: isDark ? 'rgba(51, 65, 85, 0.4)' : `${currentTheme.primaryColor}12`,
              color: isDark ? '#CBD5E1' : currentTheme.accentColor,
            }}
          >
            <span>Explore Dreams & Goals</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </Card>

        {/* 5. DAILY QUOTE CARD */}
        <Card hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(234, 179, 8, 0.2)' : '#FEF3C7',
                    color: '#D97706',
                  }}
                >
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Daily Gentle Quote</h3>
              </div>
              <button
                onClick={handleNextQuote}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform active:rotate-180"
                title="New inspiring quote"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-3 px-2">
              <p className="font-serif italic text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                "{quote.quote}"
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>— {quote.author}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {quote.tag}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
            Tap the refresh icon for more calm inspiration
          </div>
        </Card>

        {/* 6. STREAK & WORLD PROGRESS CARD */}
        <Card hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFEDD5',
                    color: '#EA580C',
                  }}
                >
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Consistency Streak</h3>
              </div>
              <span className="text-xs font-bold text-amber-500">Active</span>
            </div>

            <div className="text-center py-3">
              <div className="inline-flex items-center justify-center gap-2 text-3xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-white">
                <span>🔥</span>
                <span>{userProfile.streakDays}</span>
                <span className="text-base font-sans font-medium text-slate-500 dark:text-slate-400">Days</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                You've checked into your Little World for 7 days in a row. Keep the rhythm glowing!
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('progress')}
            className="w-full mt-4 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group"
            style={{
              backgroundColor: isDark ? 'rgba(51, 65, 85, 0.4)' : `${currentTheme.primaryColor}12`,
              color: isDark ? '#CBD5E1' : currentTheme.accentColor,
            }}
          >
            <span>View Progress & Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </Card>
      </div>

      {/* Quick Navigation Cards row */}
      <div className="pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Explore My Little World♡
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { id: 'clock', title: 'Clock & Focus', icon: '🕐', desc: 'Stopwatch & Pomodoro' },
            { id: 'journal', title: 'Daily Journal', icon: '📔', desc: 'Mood, Thoughts, Gratitude' },
            { id: 'todo', title: 'To-Do List', icon: '✅', desc: 'College, Projects, Life' },
            { id: 'dreams', title: 'Dreams & Goals', icon: '🌈', desc: 'Fantasies, Wishlist' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`p-3.5 sm:p-4 rounded-2xl text-left border transition-all duration-200 hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200'
                  : 'bg-white/70 border-slate-200/80 hover:border-slate-300 text-slate-700 shadow-2xs'
              }`}
            >
              <div className="text-2xl mb-1.5">{item.icon}</div>
              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
