import React, { useState, useEffect } from 'react';
import { X, Sparkles, Pin } from 'lucide-react';
import { FantasyItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { playGentleBellChime } from '../../utils/sound';

interface FantasyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fantasyData: Omit<FantasyItem, 'id' | 'createdAt'>, editingId?: string) => void;
  fantasyToEdit?: FantasyItem | null;
}

const EMOJI_OPTIONS = [
  '🌲', '🏮', '🪴', '🌊', '📖', '🥐', '🌸', '☕', '🎨', '✈️', '🏔️', '🕯️', '🧁', '🍓', '🧶', '🏡', '🌙', '🎻'
];

const CATEGORY_PRESETS = [
  'Travel & Lifestyle',
  'Sanctuary',
  'Creativity & Peace',
  'Cozy Nooks',
  'Comfort & Joy',
  'Career & Future',
  'Mindfulness',
];

export const FantasyModal: React.FC<FantasyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fantasyToEdit,
}) => {
  const { currentTheme, isDark } = useTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sanctuary');
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('🪴');
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fantasyToEdit) {
      setTitle(fantasyToEdit.title);
      setCategory(fantasyToEdit.category);
      setNotes(fantasyToEdit.notes);
      setEmoji(fantasyToEdit.emoji);
      setPinned(fantasyToEdit.pinned);
    } else {
      setTitle('');
      setCategory('Sanctuary');
      setNotes('');
      setEmoji('🪴');
      setPinned(false);
    }
    setError('');
  }, [fantasyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your vision ♡');
      return;
    }
    if (!notes.trim()) {
      setError('Please add a gentle note or description ♡');
      return;
    }

    playGentleBellChime();
    onSave(
      {
        title: title.trim(),
        category: category.trim(),
        notes: notes.trim(),
        emoji,
        pinned,
      },
      fantasyToEdit ? fantasyToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="text-lg font-bold font-serif">
                {fantasyToEdit ? 'Edit Vision' : 'New Dream & Fantasy'}
              </h3>
              <p className="text-xs text-slate-400">
                A comforting aspiration for your personal vision board.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-2.5 rounded-xl text-xs bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* Emoji Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Choose an Aesthetic Icon
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 max-h-24 overflow-y-auto">
              {EMOJI_OPTIONS.map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setEmoji(opt)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-transform cursor-pointer ${
                    emoji === opt
                      ? 'scale-110 shadow-sm border border-pink-400 dark:border-purple-400'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor:
                      emoji === opt
                        ? isDark
                          ? 'rgba(168, 85, 247, 0.25)'
                          : `${currentTheme.primaryColor}30`
                        : 'transparent',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Vision Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Mountain Cabin with a Crackling Fireplace"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Category / Realm
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CATEGORY_PRESETS.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    category === cat
                      ? 'font-semibold text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  style={{
                    backgroundColor: category === cat ? currentTheme.accentColor : undefined,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Or write custom category..."
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
          </div>

          {/* Notes / Visualization */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Gentle Description / Cozy Details
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe the mood, scents, sounds, and feelings of this vision..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50 resize-none"
            />
          </div>

          {/* Pinned Checkbox */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer">
            <input
              type="checkbox"
              id="pinned-checkbox"
              checked={pinned}
              onChange={e => setPinned(e.target.checked)}
              className="w-4 h-4 rounded text-pink-500 cursor-pointer"
            />
            <label
              htmlFor="pinned-checkbox"
              className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Pin className="w-3.5 h-3.5 text-pink-500" />
              Pin to the top of Vision Board
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition-transform active:scale-95 cursor-pointer hover:brightness-105"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              {fantasyToEdit ? 'Save Changes' : 'Plant Vision ♡'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
