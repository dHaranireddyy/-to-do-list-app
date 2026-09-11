import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { JournalEntry } from '../../types';
import { MOOD_OPTIONS } from '../../data/initialJournal';
import { PaperStyleConfig } from './diaryStyles';
import { playSoftTick } from '../../utils/sound';

interface DiaryIndexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeDate: string;
  onSelectDate: (date: string) => void;
  entries: JournalEntry[];
  paperStyle: PaperStyleConfig;
  isDark: boolean;
}

export const DiaryIndexDrawer: React.FC<DiaryIndexDrawerProps> = ({
  isOpen,
  onClose,
  activeDate,
  onSelectDate,
  entries,
  paperStyle,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Current calendar view month (starts on activeDate or current date)
  const [viewYearMonth, setViewYearMonth] = useState(() => {
    const [y, m] = activeDate.split('-').map(Number);
    return { year: y || new Date().getFullYear(), month: (m ? m - 1 : new Date().getMonth()) };
  });

  if (!isOpen) return null;

  // Build calendar matrix for viewYearMonth
  const daysInMonth = new Date(viewYearMonth.year, viewYearMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYearMonth.year, viewYearMonth.month, 1).getDay();

  const monthName = new Date(viewYearMonth.year, viewYearMonth.month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    playSoftTick();
    setViewYearMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    playSoftTick();
    setViewYearMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  // Map of date strings that have entries
  const entryDateMap = new Set(entries.map(e => e.date));

  // Filter entries based on search
  const filteredEntries = entries.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.thoughts.toLowerCase().includes(q) ||
      e.gratitude.toLowerCase().includes(q) ||
      e.highlight.toLowerCase().includes(q) ||
      e.formattedDate.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-md h-[90vh] max-h-[720px] rounded-3xl p-6 flex flex-col shadow-2xl border transition-all relative overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-[#faf6ee] border-[#e8dfd1] text-slate-800'
        }`}
        style={{
          boxShadow: paperStyle.boxShadow,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: paperStyle.accentColor }} />
            <div>
              <h3 className="font-diary-serif text-xl font-medium tracking-tight">Diary Index & Calendar</h3>
              <p className="text-[11px] opacity-60 font-diary-serif italic">Turn to any memory page</p>
            </div>
          </div>
          <button
            onClick={() => {
              playSoftTick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Memory Bar */}
        <div className="relative my-4">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search words, feelings, gratitude..."
            className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border outline-none transition-colors ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                : 'bg-white/80 border-stone-200 text-slate-800 placeholder-stone-400'
            }`}
          />
        </div>

        {/* Content Tabs / Split view */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Mini Calendar */}
          <div
            className={`p-4 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white/60 border-stone-200/80'
            }`}
          >
            {/* Month switch */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-diary-serif text-base font-medium">{monthName}</span>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-mono opacity-50 mb-1">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Dates grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const mStr = String(viewYearMonth.month + 1).padStart(2, '0');
                const dStr = String(dayNum).padStart(2, '0');
                const dateStr = `${viewYearMonth.year}-${mStr}-${dStr}`;

                const hasEntry = entryDateMap.has(dateStr);
                const isSelected = dateStr === activeDate;
                const isToday = dateStr === new Date().toISOString().split('T')[0];

                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      playSoftTick();
                      onSelectDate(dateStr);
                      onClose();
                    }}
                    className={`h-8 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                      isSelected
                        ? 'font-bold shadow-xs'
                        : hasEntry
                        ? 'hover:bg-black/5 dark:hover:bg-white/10 font-medium'
                        : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: paperStyle.accentColor,
                            color: '#FFFFFF',
                          }
                        : undefined
                    }
                  >
                    <span className="text-[11px] leading-none">{dayNum}</span>
                    {/* Subtle dot indicator ● for days with entries */}
                    {hasEntry && !isSelected && (
                      <span
                        className="text-[8px] leading-none mt-0.5"
                        style={{ color: paperStyle.accentColor }}
                      >
                        ●
                      </span>
                    )}
                    {isToday && !isSelected && !hasEntry && (
                      <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of Entries / Pages */}
          <div className="space-y-2">
            <h4 className="text-xs font-diary-serif italic opacity-70 px-1">
              Pages with reflections ({filteredEntries.length})
            </h4>

            {filteredEntries.length === 0 ? (
              <div className="py-6 text-center text-xs opacity-50 italic">
                No diary pages found matching search.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEntries.map(e => {
                  const isCurrent = e.date === activeDate;
                  const moodConfig = MOOD_OPTIONS.find(m => m.id === e.mood);

                  // Extract month and day for subtle indicator: e.g. "September 11 ●"
                  let displayDate = e.formattedDate;
                  try {
                    const [y, m, d] = e.date.split('-').map(Number);
                    const dt = new Date(y, m - 1, d);
                    displayDate = dt.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    });
                  } catch {
                    // fallback
                  }

                  return (
                    <div
                      key={e.id}
                      onClick={() => {
                        playSoftTick();
                        onSelectDate(e.date);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                        isCurrent
                          ? 'ring-2 shadow-xs'
                          : isDark
                          ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                          : 'bg-white/70 border-stone-200/70 hover:bg-white'
                      }`}
                      style={
                        isCurrent
                          ? {
                              borderColor: paperStyle.accentColor,
                              backgroundColor: isDark ? `${paperStyle.accentColor}20` : `${paperStyle.accentColor}12`,
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-diary-serif font-medium text-sm flex items-center gap-1.5">
                          <span>{displayDate}</span>
                          <span style={{ color: paperStyle.accentColor }} className="text-xs">
                            ●
                          </span>
                        </span>
                        {moodConfig && (
                          <span className="text-xs flex items-center gap-1">
                            <span>{moodConfig.emoji}</span>
                            <span className="text-[10px] opacity-70">{moodConfig.label}</span>
                          </span>
                        )}
                      </div>

                      {e.thoughts && (
                        <p className="text-xs opacity-75 line-clamp-2 leading-relaxed font-handwriting text-base">
                          {e.thoughts}
                        </p>
                      )}

                      {e.highlight && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] opacity-65 italic truncate">
                          <span>✨</span>
                          <span className="truncate">"{e.highlight}"</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Jump to today */}
        <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs">
          <button
            onClick={() => {
              playSoftTick();
              const todayStr = new Date().toISOString().split('T')[0];
              onSelectDate(todayStr);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: `${paperStyle.accentColor}20`,
              color: paperStyle.accentColor,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turn to Today</span>
          </button>
          <span className="opacity-50 text-[11px] font-diary-serif italic">My Little World Diary ♡</span>
        </div>
      </div>
    </div>
  );
};
