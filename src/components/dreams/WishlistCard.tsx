import React from 'react';
import { Coins, CheckCircle2, ShoppingBag, Edit3, Trash2, ExternalLink, Sparkles, Check } from 'lucide-react';
import { WishlistItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { playCoinChime, playCelebrationChime } from '../../utils/sound';

interface WishlistCardProps {
  item: WishlistItem;
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
  onAddSavings: (id: string, amount: number) => void;
  onTogglePurchased: (item: WishlistItem) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  onEdit,
  onDelete,
  onAddSavings,
  onTogglePurchased,
}) => {
  const { currentTheme, isDark } = useTheme();

  const percentage =
    item.targetPrice > 0
      ? Math.min(100, Math.round((item.savedAmount / item.targetPrice) * 100))
      : 0;

  const isPurchased = item.status === 'Purchased';

  const handleDeposit = (amount: number) => {
    playCoinChime();
    onAddSavings(item.id, amount);
  };

  const handlePurchasedClick = () => {
    if (!isPurchased) {
      playCelebrationChime();
    }
    onTogglePurchased(item);
  };

  return (
    <Card
      hoverable
      className={`p-5 flex flex-col justify-between border transition-all duration-300 group ${
        isPurchased
          ? isDark
            ? 'bg-emerald-950/20 border-emerald-800/40'
            : 'bg-emerald-50/40 border-emerald-200/60'
          : 'border-slate-200/70 dark:border-slate-800/80'
      }`}
    >
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-3xl select-none shrink-0 transform transition-transform group-hover:scale-110">
              {item.icon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-medium">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isPurchased
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : item.status === 'Saving'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 font-serif leading-tight truncate">
                {item.name}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(item)}
              title="Edit item"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Delete item"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
            "{item.notes}"
          </p>
        )}

        {/* Price & Saved Stats */}
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Target Cost</div>
              <div className="text-sm font-bold font-serif text-slate-800 dark:text-slate-200">
                ₹{item.targetPrice.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium">Saved So Far</div>
              <div className="text-sm font-bold font-serif" style={{ color: currentTheme.accentColor }}>
                ₹{item.savedAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Savings Progress</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{percentage}%</span>
            </div>
            <ProgressBar progress={percentage} size="sm" />
          </div>
        </div>
      </div>

      {/* Action Footer: Deposit Savings & Mark as Purchased */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Quick Deposit Pill Buttons */}
        {!isPurchased && (
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-[10px] text-slate-400 mr-0.5">Deposit:</span>
            <button
              onClick={() => handleDeposit(500)}
              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Coins className="w-3 h-3" /> +₹500
            </button>
            <button
              onClick={() => handleDeposit(1000)}
              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Coins className="w-3 h-3" /> +₹1k
            </button>
          </div>
        )}

        {/* Status Toggle Button */}
        <button
          onClick={handlePurchasedClick}
          className={`w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isPurchased
              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {isPurchased ? (
            <>
              <Check className="w-3.5 h-3.5" /> Purchased ♡
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Mark Purchased
            </>
          )}
        </button>
      </div>
    </Card>
  );
};
