import React from 'react';
import { Pin, Edit3, Trash2, Sparkles } from 'lucide-react';
import { FantasyItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { playGentleBellChime } from '../../utils/sound';

interface FantasyCardProps {
  fantasy: FantasyItem;
  onTogglePin: (id: string) => void;
  onEdit: (fantasy: FantasyItem) => void;
  onDelete: (id: string) => void;
}

export const FantasyCard: React.FC<FantasyCardProps> = ({
  fantasy,
  onTogglePin,
  onEdit,
  onDelete,
}) => {
  const { currentTheme, isDark } = useTheme();

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    playGentleBellChime();
    onTogglePin(fantasy.id);
  };

  return (
    <Card
      hoverable
      className={`p-5 flex flex-col justify-between transition-all duration-300 relative group border ${
        fantasy.pinned
          ? isDark
            ? 'border-purple-500/40 bg-purple-950/20 shadow-sm'
            : 'border-pink-300/70 bg-gradient-to-br from-pink-50/50 via-white to-purple-50/30 shadow-sm'
          : 'border-slate-200/70 dark:border-slate-800/80'
      }`}
    >
      <div>
        {/* Card Header: Emoji & Action Buttons */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none transform transition-transform group-hover:scale-110">
              {fantasy.emoji}
            </span>
            {fantasy.pinned && (
              <span
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: isDark ? 'rgba(236, 72, 153, 0.25)' : '#FCE7F3',
                  color: currentTheme.accentColor,
                }}
              >
                <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePin}
              title={fantasy.pinned ? 'Unpin vision' : 'Pin vision to top'}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                fantasy.pinned
                  ? 'text-pink-500 bg-pink-100/80 dark:bg-pink-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${fantasy.pinned ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => onEdit(fantasy)}
              title="Edit vision"
              className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(fantasy.id)}
              title="Delete vision"
              className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100 font-serif leading-snug">
          {fantasy.title}
        </h4>

        {/* Handwritten notes / thoughts */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed italic font-sans">
          "{fantasy.notes}"
        </p>
      </div>

      {/* Footer: Category & Date */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
          {fantasy.category}
        </span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Vision Board
        </span>
      </div>
    </Card>
  );
};
