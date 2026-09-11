import React, { useState } from 'react';
import { Check, Circle, CheckCircle2, Edit3, Trash2, Plus, Sparkles, ShoppingCart } from 'lucide-react';
import { NeedItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { playCelebrationChime, playGentleBellChime } from '../../utils/sound';

interface NeedsCardProps {
  needs: NeedItem[];
  onToggleCheck: (id: string) => void;
  onEdit: (item: NeedItem) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
  onQuickAdd: (name: string, price: number, qty: string, category: string) => void;
}

export const NeedsCard: React.FC<NeedsCardProps> = ({
  needs,
  onToggleCheck,
  onEdit,
  onDelete,
  onOpenAddModal,
  onQuickAdd,
}) => {
  const { currentTheme, isDark } = useTheme();

  const [quickName, setQuickName] = useState('');
  const [quickPrice, setQuickPrice] = useState('');
  const [quickQty, setQuickQty] = useState('1');

  const totalEstimated = needs.reduce((sum, n) => sum + (n.estimatedPrice || 0), 0);
  const pendingNeeds = needs.filter(n => !n.checked);
  const completedNeeds = needs.filter(n => n.checked);
  const pendingTotal = pendingNeeds.reduce((sum, n) => sum + (n.estimatedPrice || 0), 0);

  const handleToggle = (item: NeedItem) => {
    if (!item.checked) {
      playCelebrationChime();
    } else {
      playGentleBellChime();
    }
    onToggleCheck(item.id);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    const price = Number(quickPrice) || 0;
    playGentleBellChime();
    onQuickAdd(quickName.trim(), price, quickQty.trim() || '1', 'General Need');
    setQuickName('');
    setQuickPrice('');
    setQuickQty('1');
  };

  return (
    <div className="space-y-4">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Pending Total</div>
            <div className="text-xl font-bold font-serif" style={{ color: currentTheme.accentColor }}>
              ₹{pendingTotal.toLocaleString()}
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 font-semibold">
            {pendingNeeds.length} items left
          </span>
        </Card>

        <Card className="p-4 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Purchased / Acquired</div>
            <div className="text-xl font-bold font-serif text-emerald-600 dark:text-emerald-400">
              {completedNeeds.length} / {needs.length}
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </Card>

        <Card className="p-4 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">All Essentials Budget</div>
            <div className="text-xl font-bold font-serif text-slate-800 dark:text-slate-200">
              ₹{totalEstimated.toLocaleString()}
            </div>
          </div>
          <ShoppingCart className="w-5 h-5 text-slate-400" />
        </Card>
      </div>

      {/* Quick Add Bar */}
      <Card className="p-3 border border-slate-200/70 dark:border-slate-800/80">
        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={quickName}
            onChange={e => setQuickName(e.target.value)}
            placeholder="Quick add practical need (e.g., Gel pen refills, notebook)..."
            className="flex-1 w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={quickQty}
              onChange={e => setQuickQty(e.target.value)}
              placeholder="Qty (e.g. 2)"
              className="w-20 px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
            <input
              type="number"
              value={quickPrice}
              onChange={e => setQuickPrice(e.target.value)}
              placeholder="Est. ₹"
              className="w-24 px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
            <button
              type="submit"
              disabled={!quickName.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1 transition-transform active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </Card>

      {/* Needs Checklist Items */}
      <div className="space-y-2">
        {needs.map(item => (
          <Card
            key={item.id}
            hoverable
            className={`p-3.5 flex items-center justify-between border transition-all duration-200 group ${
              item.checked
                ? isDark
                  ? 'bg-slate-900/40 border-slate-800/50 opacity-75'
                  : 'bg-slate-50/70 border-slate-200/50 opacity-75'
                : 'border-slate-200/70 dark:border-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => handleToggle(item)}
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                  item.checked
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-600 hover:border-pink-400 dark:hover:border-pink-500'
                }`}
              >
                {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs sm:text-sm font-medium transition-all ${
                      item.checked
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {item.name}
                  </span>
                  {item.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>Qty: <strong className="font-medium text-slate-600 dark:text-slate-300">{item.qty}</strong></span>
                  <span>•</span>
                  <span>Est: <strong className="font-medium text-slate-700 dark:text-slate-300">₹{item.estimatedPrice.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`font-semibold text-xs sm:text-sm ${
                  item.checked ? 'text-slate-400 line-through' : ''
                }`}
                style={{ color: item.checked ? undefined : currentTheme.accentColor }}
              >
                ₹{item.estimatedPrice.toLocaleString()}
              </span>

              <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(item)}
                  title="Edit item"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  title="Delete item"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {needs.length === 0 && (
          <Card className="p-8 text-center border-dashed border-slate-300 dark:border-slate-800">
            <Sparkles className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-serif font-medium text-slate-700 dark:text-slate-300">
              Your essentials list is currently clear!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add stationery, desk tools, or cozy items you need to pick up.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
