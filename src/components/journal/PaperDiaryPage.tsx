import React, { useRef, useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Heart,
  Palette,
  Type,
  Trash2,
  Plus,
  BookOpen,
} from 'lucide-react';
import { JournalEntry } from '../../types';
import { MOOD_OPTIONS } from '../../data/initialJournal';
import { PaperStyleConfig, HandwritingFont, PaperStyleId, PAPER_STYLES } from './diaryStyles';
import { playSoftTick, playGentleBellChime } from '../../utils/sound';

interface PaperDiaryPageProps {
  activeDate: string;
  entry: Partial<JournalEntry>;
  paperStyle: PaperStyleConfig;
  paperStyleId: PaperStyleId;
  fontChoice: HandwritingFont;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isDark: boolean;
  pageAnimationClass: string;
  onUpdateField: (field: keyof JournalEntry, value: any) => void;
  onSave: () => void;
  onBackToCalendar: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onDeleteEntry?: () => void;
  hasSavedEntry: boolean;
  onSelectPaperStyle: (id: PaperStyleId) => void;
  onSelectFont: (font: HandwritingFont) => void;
}

export const PaperDiaryPage: React.FC<PaperDiaryPageProps> = ({
  activeDate,
  entry,
  paperStyle,
  paperStyleId,
  fontChoice,
  saveStatus,
  isDark,
  pageAnimationClass,
  onUpdateField,
  onSave,
  onBackToCalendar,
  onPrevDay,
  onNextDay,
  onDeleteEntry,
  hasSavedEntry,
  onSelectPaperStyle,
  onSelectFont,
}) => {
  const [showToast, setShowToast] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [localTurnAnimation, setLocalTurnAnimation] = useState<string>('');
  const toastTimeoutRef = useRef<number | null>(null);

  // Derive pages array from entry (backward-compatible with thoughts)
  const pages: string[] = useMemo(() => {
    if (entry.pages && entry.pages.length > 0) {
      return entry.pages;
    }
    return [entry.thoughts || ''];
  }, [entry.pages, entry.thoughts]);

  // Keep currentPageIndex bounded within valid pages
  useEffect(() => {
    if (currentPageIndex >= pages.length) {
      setCurrentPageIndex(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPageIndex]);

  // Reset page index to 0 when date changes
  useEffect(() => {
    setCurrentPageIndex(0);
  }, [activeDate]);

  // Formatted date and weekday
  const formattedDateParts = useMemo(() => {
    try {
      const [year, month, day] = activeDate.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return {
        monthDayYear: d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
      };
    } catch {
      return { monthDayYear: activeDate, weekday: '' };
    }
  }, [activeDate]);

  // Determine handwritten font class
  const getFontFamilyClass = () => {
    if (fontChoice === 'kalam') return 'font-kalam';
    if (fontChoice === 'serif') return 'font-diary-serif';
    return 'font-handwriting';
  };

  const fontFamilyClass = getFontFamilyClass();

  // Paper background selection
  const actualPaperBg = isDark && paperStyle.paperBgDark ? paperStyle.paperBgDark : paperStyle.paperBg;

  // Ruled line style for large notebook paper
  const notebookRulingStyle: React.CSSProperties = paperStyle.hasLines
    ? {
        backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${paperStyle.lineColor} 31px, ${paperStyle.lineColor} 32px)`,
        backgroundSize: '100% 32px',
        lineHeight: '32px',
      }
    : {
        lineHeight: '32px',
      };

  // Update text of current page
  const handleUpdatePageContent = (text: string) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex] = text;
    onUpdateField('pages', updatedPages);
    // Keep thoughts updated with page 1 or joined content
    onUpdateField('thoughts', updatedPages[0]);
  };

  // Turn to a specific page
  const handleGoToPage = (newIdx: number) => {
    if (newIdx < 0 || newIdx >= pages.length) return;
    playSoftTick();
    setLocalTurnAnimation(newIdx > currentPageIndex ? 'animate-page-turn-next' : 'animate-page-turn-prev');
    setCurrentPageIndex(newIdx);
    setTimeout(() => setLocalTurnAnimation(''), 300);
  };

  // Add a new page and turn to it
  const handleAddNewPage = () => {
    playGentleBellChime();
    const updatedPages = [...pages, ''];
    onUpdateField('pages', updatedPages);
    setLocalTurnAnimation('animate-page-turn-next');
    setCurrentPageIndex(updatedPages.length - 1);
    setTimeout(() => setLocalTurnAnimation(''), 300);
  };

  // Delete current page (only if page > 0)
  const handleDeleteCurrentPage = () => {
    if (currentPageIndex === 0) return;
    playSoftTick();
    const updatedPages = pages.filter((_, idx) => idx !== currentPageIndex);
    onUpdateField('pages', updatedPages);
    onUpdateField('thoughts', updatedPages[0]);
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };

  // Handle explicit manual save
  const handleSaveClick = () => {
    playGentleBellChime();
    onSave();
    setShowToast(true);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setShowToast(false);
    }, 2800);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Lock body scroll while full-screen diary is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Allow Escape key to smoothly return to calendar
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToCalendar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [onBackToCalendar]);

  const totalPagesCount = pages.length;

  if (!isMounted && typeof document !== 'undefined') {
    return null;
  }

  const diaryContent = (
    <div
      id="fullscreen-diary-viewport-container"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 overflow-hidden transition-colors duration-500 select-none ${
        pageAnimationClass || 'animate-diary-open'
      }`}
      style={{
        backgroundColor: isDark ? '#121118' : '#ECE5D8',
      }}
    >
      {/* Subtle Atmospheric Ambient Lighting on the Desk */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 30%, rgba(255, 230, 200, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 20%, rgba(255, 250, 240, 0.7) 0%, rgba(180, 150, 120, 0.15) 100%)',
        }}
      />

      {/* MINIMAL TOP DESK HEADER (Takes ~44px) */}
      <div className="w-full max-w-[1360px] flex items-center justify-between gap-3 px-2 py-1.5 shrink-0 relative z-10">
        {/* Left: ← Back to Calendar */}
        <button
          type="button"
          onClick={() => {
            playSoftTick();
            onBackToCalendar();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-diary-serif font-medium transition-all hover:-translate-x-0.5 cursor-pointer shadow-xs"
          title="Return to Calendar"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Calendar</span>
        </button>

        {/* Center: Minimal Page Counter (Page 1 / 3) */}
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-2xl text-xs sm:text-sm font-diary-serif shadow-xs">
          <button
            type="button"
            disabled={currentPageIndex === 0}
            onClick={() => handleGoToPage(currentPageIndex - 1)}
            className={`p-1 rounded-lg transition-all cursor-pointer ${
              currentPageIndex === 0 ? 'opacity-25 cursor-not-allowed' : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-wide px-1">
            Page {currentPageIndex + 1} / {totalPagesCount}
          </span>

          <button
            type="button"
            disabled={currentPageIndex >= totalPagesCount - 1}
            onClick={() => handleGoToPage(currentPageIndex + 1)}
            className={`p-1 rounded-lg transition-all cursor-pointer ${
              currentPageIndex >= totalPagesCount - 1
                ? 'opacity-25 cursor-not-allowed'
                : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* + Add Page button */}
          <button
            type="button"
            onClick={handleAddNewPage}
            className="flex items-center gap-1 pl-2 border-l border-black/10 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Turn to a new page"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Page</span>
          </button>
        </div>

        {/* Right: Autosave status & [ Save ♡ ] Button */}
        <div className="flex items-center gap-3">
          {/* Subtle Saving status indicator */}
          <div className="text-xs font-diary-serif italic opacity-75 hidden md:flex items-center gap-1 text-slate-600 dark:text-slate-300">
            {saveStatus === 'saving' ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <span className="flex items-center gap-0.5">
                <span>Saved</span>
                <span className="text-xs">♡</span>
              </span>
            )}
          </div>

          {/* Paper Style Selector */}
          <div className="hidden lg:flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/10 text-xs">
            {(Object.keys(PAPER_STYLES) as PaperStyleId[]).map(id => {
              const cfg = PAPER_STYLES[id];
              const isSelected = paperStyleId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectPaperStyle(id)}
                  title={cfg.name}
                  className={`p-1 px-1.5 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 shadow-xs font-bold scale-105'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-xs">{cfg.icon}</span>
                </button>
              );
            })}
          </div>

          {/* Font Selector */}
          <div className="hidden xl:flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => onSelectFont('caveat')}
              className={`px-1.5 py-0.5 rounded-lg font-handwriting cursor-pointer transition-all ${
                fontChoice === 'caveat' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Caveat
            </button>
            <button
              type="button"
              onClick={() => onSelectFont('kalam')}
              className={`px-1.5 py-0.5 rounded-lg font-kalam cursor-pointer transition-all ${
                fontChoice === 'kalam' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Kalam
            </button>
            <button
              type="button"
              onClick={() => onSelectFont('serif')}
              className={`px-1.5 py-0.5 rounded-lg font-diary-serif cursor-pointer transition-all ${
                fontChoice === 'serif' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Serif
            </button>
          </div>

          {/* [ Save ♡ ] Button */}
          <button
            type="button"
            onClick={handleSaveClick}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full font-diary-serif text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            style={{
              backgroundColor: paperStyle.accentColor,
              color: '#FFFFFF',
            }}
          >
            <span>Save</span>
            <span>♡</span>
          </button>
        </div>
      </div>

      {/* THE MASSIVE DIARY PAPER — Occupies 90-96% of the Viewport */}
      <div className="w-full max-w-[1360px] flex-1 min-h-0 relative flex flex-col my-1 sm:my-2">
        {/* Physical Stacked Book Depth (Multiple sheets illusion) */}
        <div
          className="absolute inset-0 translate-x-2.5 translate-y-3 rounded-3xl sm:rounded-4xl opacity-35 -z-20 pointer-events-none"
          style={{
            backgroundColor: actualPaperBg,
            border: `1px solid ${paperStyle.borderEdge}`,
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute inset-0 translate-x-1 translate-y-1.5 rounded-3xl sm:rounded-4xl opacity-70 -z-10 pointer-events-none"
          style={{
            backgroundColor: actualPaperBg,
            border: `1px solid ${paperStyle.borderEdge}`,
          }}
        />

        {/* Satin Ribbon Bookmark hanging down */}
        <div
          className="absolute -top-1.5 right-12 sm:right-20 w-5 h-16 sm:h-24 rounded-b-md shadow-md z-30 pointer-events-none transition-all"
          style={{
            backgroundColor: paperStyle.accentColor,
            opacity: 0.85,
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-black/15 clip-path-ribbon" />
        </div>

        {/* The Giant Diary Page Sheet */}
        <div
          className={`relative flex-1 min-h-0 w-full rounded-3xl sm:rounded-4xl p-6 sm:p-10 md:p-12 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
            localTurnAnimation || pageAnimationClass
          }`}
          style={{
            backgroundColor: actualPaperBg,
            color: paperStyle.inkColor,
            border: `1px solid ${paperStyle.borderEdge}`,
            boxShadow: paperStyle.boxShadow,
          }}
        >
          {/* Subtle Paper Vignette Shadow */}
          <div
            className="absolute inset-0 rounded-3xl sm:rounded-4xl pointer-events-none z-0"
            style={{
              boxShadow: isDark
                ? 'inset 0 0 70px rgba(0,0,0,0.6)'
                : 'inset 0 0 60px rgba(180, 150, 110, 0.09)',
            }}
          />

          {/* Notebook Left Spine / Margin Line */}
          {paperStyle.hasMargin && paperStyle.marginLineColor && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-0"
              style={{
                left: 'clamp(38px, 6vw, 68px)',
                width: '1px',
                backgroundColor: paperStyle.marginLineColor,
              }}
            />
          )}

          {/* Corner Watermarks */}
          {paperStyle.decorativeTheme === 'floral' && (
            <>
              <div className="absolute top-3 left-4 text-rose-300/30 select-none pointer-events-none text-2xl">
                🌸 🍃
              </div>
              <div className="absolute bottom-4 right-6 text-rose-300/30 select-none pointer-events-none text-2xl">
                🌸
              </div>
            </>
          )}

          {paperStyle.decorativeTheme === 'stars' && (
            <>
              <div className="absolute top-3 left-5 text-amber-200/25 select-none pointer-events-none text-xl">
                ✨ 🌙
              </div>
              <div className="absolute bottom-4 right-6 text-amber-200/25 select-none pointer-events-none text-xl">
                ✦ ⋆
              </div>
            </>
          )}

          {/* PAGE CONTENT CONTAINER (Scrolls gracefully along lines if user writes an epic essay) */}
          <div
            className="relative z-10 flex-1 min-h-0 flex flex-col justify-between gap-3 overflow-y-auto pr-1 sm:pr-3"
            style={{
              paddingLeft: paperStyle.hasMargin ? 'clamp(20px, 4vw, 36px)' : '0px',
            }}
          >
            {/* PAGE 1: TITLE, DEAR DIARY, MAIN ENTRY, HIGHLIGHT, GRATITUDE, MOOD */}
            {currentPageIndex === 0 ? (
              <>
                {/* Header: Date & Day of Week */}
                <div
                  className="text-center pb-3 border-b shrink-0 select-none"
                  style={{ borderColor: paperStyle.lineColor }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-diary-serif font-medium tracking-tight">
                    {formattedDateParts.monthDayYear}
                  </h1>
                  <p
                    className="text-sm sm:text-base font-diary-serif italic -mt-0.5"
                    style={{ color: paperStyle.promptColor }}
                  >
                    {formattedDateParts.weekday}
                  </p>
                </div>

                {/* Opening: Dear diary, */}
                <div className="flex-1 min-h-[160px] flex flex-col gap-1">
                  <div
                    className="font-diary-serif italic text-lg sm:text-xl select-none shrink-0"
                    style={{ color: paperStyle.promptColor }}
                  >
                    Dear diary,
                  </div>

                  {/* Main Free-form Writing on Paper Lines */}
                  <div
                    className="flex-1 min-h-[140px] w-full rounded-lg transition-all"
                    style={notebookRulingStyle}
                  >
                    <textarea
                      value={pages[0] || ''}
                      onChange={e => handleUpdatePageContent(e.target.value)}
                      placeholder="Today I... (pour your gentle thoughts, stories, and quiet moments here ♡)"
                      className={`w-full h-full bg-transparent border-0 outline-none resize-none p-0 m-0 ${fontFamilyClass} text-xl sm:text-2xl tracking-wide placeholder-opacity-40 transition-colors focus:ring-0`}
                      style={{
                        color: paperStyle.inkColor,
                        lineHeight: '32px',
                      }}
                    />
                  </div>
                </div>

                {/* Bottom of Page 1: Highlight, Gratitude, Mood & Page Turn Prompt */}
                <div className="shrink-0 space-y-3 pt-2">
                  {/* Highlight & Gratitude in a balanced row on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {/* Today's little highlight ✦ */}
                    <div className="space-y-0.5">
                      <div
                        className="font-diary-serif italic text-xs sm:text-sm select-none flex items-center gap-1"
                        style={{ color: paperStyle.promptColor }}
                      >
                        <span>Today's little highlight</span>
                        <span>✦</span>
                      </div>

                      <div className="w-full rounded-lg h-16" style={notebookRulingStyle}>
                        <textarea
                          value={entry.highlight || ''}
                          onChange={e => onUpdateField('highlight', e.target.value)}
                          placeholder="The sweetest, most joyful, or proudest moment of today..."
                          rows={2}
                          className={`w-full h-full bg-transparent border-0 outline-none resize-none p-0 m-0 ${fontFamilyClass} text-base sm:text-lg tracking-wide placeholder-opacity-40 transition-colors focus:ring-0`}
                          style={{
                            color: paperStyle.inkColor,
                            lineHeight: '32px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Today I'm grateful for... ♡ */}
                    <div className="space-y-0.5">
                      <div
                        className="font-diary-serif italic text-xs sm:text-sm select-none flex items-center gap-1"
                        style={{ color: paperStyle.promptColor }}
                      >
                        <span>Today I'm grateful for...</span>
                        <span>♡</span>
                      </div>

                      <div className="w-full rounded-lg h-16" style={notebookRulingStyle}>
                        <textarea
                          value={entry.gratitude || ''}
                          onChange={e => onUpdateField('gratitude', e.target.value)}
                          placeholder="1. Warm sunlight  2. A cozy chat  3. Peaceful tea..."
                          rows={2}
                          className={`w-full h-full bg-transparent border-0 outline-none resize-none p-0 m-0 ${fontFamilyClass} text-base sm:text-lg tracking-wide placeholder-opacity-40 transition-colors focus:ring-0`}
                          style={{
                            color: paperStyle.inkColor,
                            lineHeight: '32px',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Foot Row: Mood & Continue writing on Page 2 button */}
                  <div
                    className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-2.5 select-none"
                    style={{ borderColor: paperStyle.lineColor }}
                  >
                    {/* Cute Mood Selector: Mood: 😊 🥰 😌 😐 😔 😫 🤩 */}
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="font-diary-serif italic text-xs sm:text-sm select-none"
                        style={{ color: paperStyle.promptColor }}
                      >
                        Mood:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {MOOD_OPTIONS.map(m => {
                          const isSelected = entry.mood === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                playSoftTick();
                                onUpdateField('mood', m.id);
                              }}
                              className={`relative p-1 rounded-full transition-all duration-150 transform hover:scale-125 active:scale-95 cursor-pointer ${
                                isSelected ? 'scale-120' : 'opacity-65 hover:opacity-100'
                              }`}
                              title={m.label}
                            >
                              {isSelected && (
                                <div
                                  className="absolute inset-0 rounded-full border border-dashed animate-fade-in"
                                  style={{
                                    borderColor: paperStyle.accentColor,
                                    backgroundColor: `${paperStyle.accentColor}22`,
                                  }}
                                />
                              )}
                              <span className="relative z-10 text-lg sm:text-xl">{m.emoji}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Page continuation / Next page button */}
                    <div className="flex items-center gap-3">
                      {hasSavedEntry && onDeleteEntry && (
                        <>
                          {confirmDelete ? (
                            <div className="flex items-center gap-1.5 text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteEntry();
                                  setConfirmDelete(false);
                                }}
                                className="px-2.5 py-1 rounded-lg text-rose-600 bg-rose-100 dark:bg-rose-950/60 font-sans cursor-pointer font-medium"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(false)}
                                className="px-2 py-1 rounded-lg opacity-60 hover:opacity-100 font-sans cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(true)}
                              title="Tear out diary entry"
                              className="p-1.5 rounded-full opacity-40 hover:opacity-90 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}

                      {totalPagesCount > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleGoToPage(1)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-diary-serif transition-all hover:scale-105 active:scale-95 cursor-pointer"
                          style={{
                            color: paperStyle.accentColor,
                            backgroundColor: `${paperStyle.accentColor}18`,
                          }}
                        >
                          <span>Continue reading Page 2</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleAddNewPage}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-diary-serif transition-all hover:scale-105 active:scale-95 cursor-pointer"
                          style={{
                            color: paperStyle.accentColor,
                            backgroundColor: `${paperStyle.accentColor}18`,
                          }}
                        >
                          <span>Turn page to continue writing 📖</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* PAGE 2, 3...: FULL-PAGE CONTINUATION SHEET */
              <div className="flex-1 min-h-0 flex flex-col justify-between gap-2">
                {/* Header: Date + Page Number */}
                <div
                  className="flex items-center justify-between pb-3 border-b shrink-0 select-none"
                  style={{ borderColor: paperStyle.lineColor }}
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-diary-serif font-medium tracking-tight">
                      {formattedDateParts.monthDayYear}
                    </h2>
                    <p
                      className="text-xs sm:text-sm font-diary-serif italic"
                      style={{ color: paperStyle.promptColor }}
                    >
                      Page {currentPageIndex + 1} · Continued Reflections ✍️
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteCurrentPage}
                      className="text-xs text-rose-500/70 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Tear out this extra page"
                    >
                      Tear out page
                    </button>
                  </div>
                </div>

                {/* Massive Ruled Lines Textarea Filling The Whole Page */}
                <div
                  className="flex-1 min-h-[280px] w-full rounded-lg transition-all"
                  style={notebookRulingStyle}
                >
                  <textarea
                    value={pages[currentPageIndex] || ''}
                    onChange={e => handleUpdatePageContent(e.target.value)}
                    placeholder="Continue your thoughts, feelings, stories, and reflections here..."
                    className={`w-full h-full bg-transparent border-0 outline-none resize-none p-0 m-0 ${fontFamilyClass} text-xl sm:text-2xl tracking-wide placeholder-opacity-40 transition-colors focus:ring-0`}
                    style={{
                      color: paperStyle.inkColor,
                      lineHeight: '32px',
                    }}
                  />
                </div>

                {/* Footer Navigation: Return to Page 1 or Next Page */}
                <div
                  className="pt-2 border-t flex items-center justify-between gap-2 text-xs font-diary-serif select-none shrink-0"
                  style={{ borderColor: paperStyle.lineColor }}
                >
                  <button
                    type="button"
                    onClick={() => handleGoToPage(currentPageIndex - 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
                    style={{ color: paperStyle.accentColor }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Return to Page {currentPageIndex}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {currentPageIndex < totalPagesCount - 1 ? (
                      <button
                        type="button"
                        onClick={() => handleGoToPage(currentPageIndex + 1)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
                        style={{ color: paperStyle.accentColor }}
                      >
                        <span>Page {currentPageIndex + 2}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddNewPage}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
                        style={{ color: paperStyle.accentColor }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Page {totalPagesCount + 1}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Small Confirmation Toast: "Saved to your little world ♡" */}
      {showToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fade-in">
          <div
            className="px-5 py-2.5 rounded-full shadow-2xl border flex items-center gap-2 text-xs sm:text-sm font-diary-serif backdrop-blur-md"
            style={{
              backgroundColor: isDark ? 'rgba(30, 27, 36, 0.95)' : 'rgba(255, 253, 250, 0.95)',
              borderColor: paperStyle.accentColor,
              color: paperStyle.inkColor,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: paperStyle.accentColor }} />
            <span className="font-semibold">Saved to your little world ♡</span>
          </div>
        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(diaryContent, document.body) : diaryContent;
};
