import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { JournalEntry, JournalMood } from '../types';
import { playGentleBellChime, playSoftTick } from '../utils/sound';
import { PAPER_STYLES, PaperStyleId, HandwritingFont } from '../components/journal/diaryStyles';
import { PaperDiaryPage } from '../components/journal/PaperDiaryPage';
import { JournalCalendarView } from '../components/journal/JournalCalendarView';

const PAPER_STORAGE_KEY = 'sanctuary_diary_paper_style';
const FONT_STORAGE_KEY = 'sanctuary_diary_font';

export const JournalPage: React.FC = () => {
  const { currentTheme, isDark } = useTheme();
  const {
    journalEntries,
    saveJournalEntry,
    deleteJournalEntry,
    selectedJournalDate,
    setSelectedJournalDate,
  } = useApp();

  const todayIso = new Date().toISOString().split('T')[0];

  // Primary view state: 'calendar' | 'paper'
  // When user opens Journal section, the first screen MUST be the calendar!
  const [viewMode, setViewMode] = useState<'calendar' | 'paper'>('calendar');

  // Currently active date for the diary page
  const [activeDate, setActiveDate] = useState<string>(selectedJournalDate || todayIso);

  // Selected Paper Style with localStorage persistence
  const [paperStyleId, setPaperStyleId] = useState<PaperStyleId>(() => {
    try {
      const saved = localStorage.getItem(PAPER_STORAGE_KEY);
      if (saved && saved in PAPER_STYLES) return saved as PaperStyleId;
    } catch {
      // ignore
    }
    return isDark ? 'midnight' : 'classic';
  });

  // Selected Handwriting Font with localStorage persistence
  const [fontChoice, setFontChoice] = useState<HandwritingFont>(() => {
    try {
      const saved = localStorage.getItem(FONT_STORAGE_KEY);
      if (saved && (saved === 'caveat' || saved === 'kalam' || saved === 'serif')) {
        return saved as HandwritingFont;
      }
    } catch {
      // ignore
    }
    return 'caveat';
  });

  // Auto-save status: 'saved' | 'saving' | 'unsaved'
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Page turn animation trigger class
  const [pageAnimationClass, setPageAnimationClass] = useState<string>('animate-fade-in');

  // Active entry draft in memory
  const [entryDraft, setEntryDraft] = useState<Partial<JournalEntry>>({
    id: activeDate,
    date: activeDate,
    mood: 'calm',
    thoughts: '',
    gratitude: '',
    highlight: '',
  });

  // Debounce save timer ref
  const saveTimeoutRef = useRef<number | null>(null);

  // Update paper style
  const handleSelectPaperStyle = (id: PaperStyleId) => {
    playSoftTick();
    setPaperStyleId(id);
    try {
      localStorage.setItem(PAPER_STORAGE_KEY, id);
    } catch {
      // ignore
    }
  };

  // Update font choice
  const handleSelectFont = (font: HandwritingFont) => {
    playSoftTick();
    setFontChoice(font);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, font);
    } catch {
      // ignore
    }
  };

  // Helper to format friendly date for entry
  const formatFriendlyDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Synchronize draft whenever activeDate changes or entries change externally
  useEffect(() => {
    const existing = journalEntries.find(e => e.date === activeDate);
    if (existing) {
      setEntryDraft({
        ...existing,
        pages: existing.pages && existing.pages.length > 0 ? existing.pages : [existing.thoughts || ''],
      });
    } else {
      setEntryDraft({
        id: activeDate,
        date: activeDate,
        formattedDate: formatFriendlyDate(activeDate),
        mood: 'calm',
        thoughts: '',
        pages: [''],
        gratitude: '',
        highlight: '',
      });
    }
    setSaveStatus('saved');
  }, [activeDate, journalEntries]);

  // Execute persistent save to context
  const executeSave = useCallback(
    (draft: Partial<JournalEntry>) => {
      // Only save if there is at least some content or a changed mood
      const hasContent =
        draft.thoughts?.trim() ||
        draft.gratitude?.trim() ||
        draft.highlight?.trim() ||
        draft.favoriteMemory?.trim() ||
        (draft.pages && draft.pages.some(p => p.trim()));

      const existing = journalEntries.find(e => e.date === activeDate);
      if (!hasContent && !existing) {
        setSaveStatus('saved');
        return;
      }

      const entryToSave: JournalEntry = {
        id: activeDate,
        date: activeDate,
        formattedDate: formatFriendlyDate(activeDate),
        mood: (draft.mood as JournalMood) || 'calm',
        thoughts: draft.thoughts || (draft.pages && draft.pages[0]) || '',
        pages: draft.pages || (draft.thoughts ? [draft.thoughts] : ['']),
        gratitude: draft.gratitude || '',
        highlight: draft.highlight || '',
        favoriteMemory: draft.favoriteMemory || undefined,
        learnedToday: draft.learnedToday || undefined,
        improveTomorrow: draft.improveTomorrow || undefined,
        updatedAt: new Date().toISOString(),
      };

      saveJournalEntry(entryToSave);
      setSaveStatus('saved');
    },
    [activeDate, journalEntries, saveJournalEntry]
  );

  // Field update with debounced auto-save
  const handleUpdateField = (field: keyof JournalEntry, value: any) => {
    setEntryDraft(prev => {
      const updated = { ...prev, [field]: value };

      setSaveStatus('saving');

      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        executeSave(updated);
      }, 1000);

      return updated;
    });
  };

  // Explicit save action
  const handleExplicitSave = () => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    executeSave(entryDraft);
  };

  // Clean up timer on unmount and flush save
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // When user clicks a date on the Calendar view:
  const handleSelectDateFromCalendar = (dateStr: string) => {
    playSoftTick();
    // 1. Set active date in local state and global context
    setActiveDate(dateStr);
    setSelectedJournalDate(dateStr);

    // 2. Immediately prepare the active entry draft for that date
    const existing = journalEntries.find(e => e.date === dateStr);
    if (existing) {
      setEntryDraft({
        ...existing,
        pages: existing.pages && existing.pages.length > 0 ? existing.pages : [existing.thoughts || ''],
      });
    } else {
      setEntryDraft({
        id: dateStr,
        date: dateStr,
        formattedDate: formatFriendlyDate(dateStr),
        mood: 'calm',
        thoughts: '',
        pages: [''],
        gratitude: '',
        highlight: '',
      });
    }

    // 3. Trigger state-driven transition into full-screen high-z-index diary container
    setPageAnimationClass('animate-diary-open');
    setViewMode('paper');
  };

  // When user returns to Calendar:
  const handleBackToCalendar = () => {
    playSoftTick();
    // Flush draft before returning if there are pending unsaved changes
    if (saveStatus === 'saving') {
      executeSave(entryDraft);
    }
    setViewMode('calendar');
  };

  // Turn page handlers (day by day navigation)
  const handleStepDate = (delta: number) => {
    // Flush current draft if saving
    if (saveStatus === 'saving') {
      executeSave(entryDraft);
    }

    playSoftTick();

    const [year, month, day] = activeDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + delta);
    const newDateStr = d.toISOString().split('T')[0];

    // Trigger page turn animation
    setPageAnimationClass(delta > 0 ? 'animate-page-turn-next' : 'animate-page-turn-prev');

    setActiveDate(newDateStr);
    setSelectedJournalDate(newDateStr);

    setTimeout(() => {
      setPageAnimationClass('');
    }, 320);
  };

  // Delete current entry
  const handleDeleteCurrentEntry = () => {
    playSoftTick();
    deleteJournalEntry(activeDate);
    setEntryDraft({
      id: activeDate,
      date: activeDate,
      mood: 'calm',
      thoughts: '',
      pages: [''],
      gratitude: '',
      highlight: '',
    });
    setSaveStatus('saved');
  };

  const activePaperConfig = PAPER_STYLES[paperStyleId] || PAPER_STYLES.classic;
  const hasSavedEntry = journalEntries.some(
    e =>
      e.date === activeDate &&
      (e.thoughts?.trim() || e.gratitude?.trim() || e.highlight?.trim())
  );

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-w-0">
      {viewMode === 'calendar' ? (
        /* STATE 1: CALENDAR LANDING PAGE */
        <JournalCalendarView
          onSelectDate={handleSelectDateFromCalendar}
          entries={journalEntries}
          activeDate={activeDate}
        />
      ) : (
        /* STATE 2: FULL DIARY PAPER */
        <PaperDiaryPage
          activeDate={activeDate}
          entry={entryDraft}
          paperStyle={activePaperConfig}
          paperStyleId={paperStyleId}
          fontChoice={fontChoice}
          saveStatus={saveStatus}
          isDark={isDark}
          pageAnimationClass={pageAnimationClass}
          onUpdateField={handleUpdateField}
          onSave={handleExplicitSave}
          onBackToCalendar={handleBackToCalendar}
          onPrevDay={() => handleStepDate(-1)}
          onNextDay={() => handleStepDate(1)}
          onDeleteEntry={hasSavedEntry ? handleDeleteCurrentEntry : undefined}
          hasSavedEntry={hasSavedEntry}
          onSelectPaperStyle={handleSelectPaperStyle}
          onSelectFont={handleSelectFont}
        />
      )}
    </div>
  );
};
