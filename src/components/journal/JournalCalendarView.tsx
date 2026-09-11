import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Calendar as CalendarIcon,
  Heart,
  Feather,
} from 'lucide-react';
import { JournalEntry } from '../../types';
import { MOOD_OPTIONS } from '../../data/initialJournal';
import { useTheme } from '../../context/ThemeContext';
import { playSoftTick } from '../../utils/sound';

interface JournalCalendarViewProps {
  onSelectDate: (date: string) => void;
  entries: JournalEntry[];
  activeDate: string;
}

export const JournalCalendarView: React.FC<JournalCalendarViewProps> = ({
  onSelectDate,
  entries,
  activeDate,
}) => {
  const { currentTheme, isDark } = useTheme();

  // Selected calendar viewing year and month
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(() => {
    const [y] = activeDate.split('-').map(Number);
    return y || today.getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    const [, m] = activeDate.split('-').map(Number);
    return m ? m - 1 : today.getMonth();
  });

  const todayIso = today.toISOString().split('T')[0];

  // Map of entries by date for instant lookup
  const entryDateMap = useMemo(() => {
    const map = new Map<string, JournalEntry>();
    entries.forEach(e => {
      // Only consider entries that have actual content
      const hasContent =
        e.thoughts?.trim() ||
        e.gratitude?.trim() ||
        e.highlight?.trim() ||
        e.favoriteMemory?.trim();
      if (hasContent || e.mood) {
        map.set(e.date, e);
      }
    });
    return map;
  }, [entries]);

  // Month navigation
  const handlePrevMonth = () => {
    playSoftTick();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    playSoftTick();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    playSoftTick();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Calculate calendar grid (Monday-first: Mon=0 .. Sun=6)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // JS getDay(): 0 is Sun, 1 is Mon, 2 is Tue ... 6 is Sat
    // To make Mon index 0:
    const startingCol = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      hasEntry: boolean;
      isToday: boolean;
      isSelected: boolean;
      entry?: JournalEntry;
    }> = [];

    // Preceding days from previous month
    for (let i = startingCol - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const mStr = String(prevMonthIdx + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${prevYear}-${mStr}-${dStr}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        hasEntry: entryDateMap.has(dateStr),
        isToday: dateStr === todayIso,
        isSelected: dateStr === activeDate,
        entry: entryDateMap.get(dateStr),
      });
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(currentMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${currentYear}-${mStr}-${dStr}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        hasEntry: entryDateMap.has(dateStr),
        isToday: dateStr === todayIso,
        isSelected: dateStr === activeDate,
        entry: entryDateMap.get(dateStr),
      });
    }

    // Trailing days to fill the last week (multiple of 7)
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remainingSlots = totalSlots - days.length;
    for (let d = 1; d <= remainingSlots; d++) {
      const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const mStr = String(nextMonthIdx + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${nextYear}-${mStr}-${dStr}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        hasEntry: entryDateMap.has(dateStr),
        isToday: dateStr === todayIso,
        isSelected: dateStr === activeDate,
        entry: entryDateMap.get(dateStr),
      });
    }

    return days;
  }, [currentYear, currentMonth, entryDateMap, activeDate, todayIso]);

  // Month Title (e.g., September 2026)
  const monthName = useMemo(() => {
    const d = new Date(currentYear, currentMonth, 1);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentYear, currentMonth]);

  // Entries in the currently viewed month
  const thisMonthEntries = useMemo(() => {
    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    return entries.filter(e => e.date.startsWith(prefix));
  }, [entries, currentYear, currentMonth]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-2 sm:py-6 animate-fade-in">
      {/* 📔 Title and Subtitle */}
      <div className="text-center mb-6 sm:mb-8 space-y-1">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
          <span>📔</span>
          <span>My Journal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-diary-serif tracking-tight text-slate-800 dark:text-slate-100">
          Daily Reflections & Diary
        </h1>
        <p className="text-sm font-diary-serif italic text-slate-500 dark:text-slate-400">
          Select a date to open your diary ♡
        </p>
      </div>

      {/* Main Calendar Card */}
      <div
        className="w-full rounded-3xl p-6 sm:p-8 shadow-xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xs"
        style={{
          backgroundColor: isDark ? 'rgba(30, 27, 36, 0.85)' : 'rgba(255, 253, 250, 0.95)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(230, 218, 204, 0.8)',
          boxShadow: isDark
            ? '0 10px 30px -10px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
            : '0 10px 30px -10px rgba(160, 130, 100, 0.15), 0 2px 8px rgba(160, 130, 100, 0.08)',
        }}
      >
        {/* Soft decorative background tint */}
        <div
          className="absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none opacity-20 blur-2xl"
          style={{ backgroundColor: currentTheme.primaryColor }}
        />
        <div
          className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full pointer-events-none opacity-20 blur-2xl"
          style={{ backgroundColor: currentTheme.accentColor }}
        />

        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/10 relative z-10">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 sm:p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title="Previous month"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold font-diary-serif tracking-tight text-slate-800 dark:text-slate-100">
              {monthName}
            </h2>
            <p className="text-[11px] font-diary-serif italic opacity-60 text-slate-500 dark:text-slate-400">
              {thisMonthEntries.length === 1
                ? '1 entry written'
                : `${thisMonthEntries.length} entries written`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 sm:p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title="Next month"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Day of Week Row: Mon  Tue  Wed  Thu  Fri  Sat  Sun */}
        <div className="grid grid-cols-7 text-center mb-3 font-diary-serif text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center relative z-10">
          {calendarDays.map(item => {
            const moodEmoji = item.entry?.mood
              ? MOOD_OPTIONS.find(m => m.id === item.entry?.mood)?.emoji
              : null;

            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => {
                  playSoftTick();
                  onSelectDate(item.dateStr);
                }}
                className={`group relative h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                  !item.isCurrentMonth
                    ? 'opacity-30 hover:opacity-70'
                    : 'hover:scale-105 active:scale-95'
                } ${
                  item.isSelected
                    ? 'ring-2 font-bold shadow-sm'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={
                  item.isSelected
                    ? {
                        backgroundColor: `${currentTheme.accentColor}18`,
                        color: currentTheme.accentColor,
                        borderColor: currentTheme.accentColor,
                      }
                    : undefined
                }
              >
                {/* Date Number */}
                <span
                  className={`text-sm sm:text-base font-diary-serif transition-colors ${
                    item.isToday
                      ? 'font-bold underline decoration-2 underline-offset-4'
                      : 'font-normal'
                  }`}
                  style={item.isToday ? { textDecorationColor: currentTheme.accentColor } : undefined}
                >
                  {item.dayNumber}
                </span>

                {/* Subtle Journal Entry Indicator: small heart / dot / flower */}
                {item.hasEntry && (
                  <div className="flex items-center gap-0.5 mt-0.5 leading-none">
                    <span
                      className="text-xs leading-none transition-transform group-hover:scale-125 font-semibold"
                      style={{ color: currentTheme.accentColor }}
                      title="Diary entry recorded"
                    >
                      ♡
                    </span>
                    {moodEmoji && (
                      <span className="text-[10px] hidden sm:inline-block leading-none opacity-80">
                        {moodEmoji}
                      </span>
                    )}
                  </div>
                )}

                {/* Today Subtle Ring */}
                {item.isToday && !item.isSelected && (
                  <div
                    className="absolute inset-0 rounded-2xl border border-dashed pointer-events-none opacity-50"
                    style={{ borderColor: currentTheme.accentColor }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar Footer: "Today" Button */}
        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-diary-serif">
          <button
            type="button"
            onClick={handleGoToToday}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            style={{
              backgroundColor: `${currentTheme.accentColor}15`,
              color: currentTheme.accentColor,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today ({today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
          </button>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <span className="text-xs font-semibold" style={{ color: currentTheme.accentColor }}>♡</span>
              <span>Journal exists</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-dashed" style={{ borderColor: currentTheme.accentColor }} />
              <span>Today</span>
            </span>
          </div>
        </div>
      </div>

      {/* Gentle Recent Entries Preview (if any) */}
      {thisMonthEntries.length > 0 && (
        <div className="w-full mt-6 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs font-diary-serif italic text-slate-500 dark:text-slate-400">
            <span>Written pages in {new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { month: 'long' })}</span>
            <span>Tap to read & edit</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {thisMonthEntries.slice(0, 4).map(e => {
              const moodItem = MOOD_OPTIONS.find(m => m.id === e.mood);
              let displayDate = e.date;
              try {
                const [y, m, d] = e.date.split('-').map(Number);
                displayDate = new Date(y, m - 1, d).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short',
                });
              } catch {
                // fallback
              }

              return (
                <div
                  key={e.id || e.date}
                  onClick={() => {
                    playSoftTick();
                    onSelectDate(e.date);
                  }}
                  className="p-3 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group flex items-start gap-2.5"
                  style={{
                    backgroundColor: isDark ? 'rgba(30, 27, 36, 0.6)' : 'rgba(255, 253, 250, 0.8)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(230, 218, 204, 0.7)',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
                    style={{ backgroundColor: `${currentTheme.accentColor}15` }}
                  >
                    {moodItem?.emoji || '📖'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs font-diary-serif font-medium">
                      <span className="text-slate-800 dark:text-slate-200">{displayDate}</span>
                      <span className="text-[10px] opacity-60" style={{ color: currentTheme.accentColor }}>● saved</span>
                    </div>

                    <p className="text-xs font-handwriting text-slate-600 dark:text-slate-300 truncate mt-0.5">
                      {e.thoughts || e.highlight || e.gratitude || 'Gentle quiet moment...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
