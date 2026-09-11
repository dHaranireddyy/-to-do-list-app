import React, { useState, useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { NeedItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { playGentleBellChime } from '../../utils/sound';

interface NeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<NeedItem, 'id' | 'createdAt'>, editingId?: string) => void;
  itemToEdit?: NeedItem | null;
}

const NEED_CATEGORIES = ['Stationery', 'Health & Desk', 'Tech Gear', 'Self-Care', 'Home & Room', 'General Need'];

export const NeedModal: React.FC<NeedModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const { currentTheme, isDark } = useTheme();

  const [name, setName] = useState('');
  const [qty, setQty] = useState('1');
  const [estimatedPrice, setEstimatedPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('Stationery');
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setQty(itemToEdit.qty);
      setEstimatedPrice(itemToEdit.estimatedPrice);
      setCategory(itemToEdit.category || 'Stationery');
      setChecked(itemToEdit.checked);
    } else {
      setName('');
      setQty('1');
      setEstimatedPrice('');
      setCategory('Stationery');
      setChecked(false);
    }
    setError('');
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an item name ♡');
      return;
    }
    const price = Number(estimatedPrice) || 0;

    playGentleBellChime();
    onSave(
      {
        name: name.trim(),
        qty: qty.trim() || '1',
        estimatedPrice: price,
        category: category.trim(),
        checked,
      },
      itemToEdit ? itemToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
            <div>
              <h3 className="text-lg font-bold font-serif">
                {itemToEdit ? 'Edit Essential Need' : 'Add Essential Need'}
              </h3>
              <p className="text-xs text-slate-400">
                Practical shopping checklist for your desk and sanctuary.
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

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Study Notebooks & Highlighters"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
          </div>

          {/* Quantity & Estimated Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Quantity / Pack
              </label>
              <input
                type="text"
                value={qty}
                onChange={e => setQty(e.target.value)}
                placeholder="e.g., 2 sets or 1 piece"
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Estimated Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={estimatedPrice}
                onChange={e => setEstimatedPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 600"
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            >
              {NEED_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Checked state */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer">
            <input
              type="checkbox"
              id="need-checked"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              className="w-4 h-4 rounded text-pink-500 cursor-pointer"
            />
            <label
              htmlFor="need-checked"
              className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Mark already purchased / acquired
            </label>
          </div>

          {/* Actions */}
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
              {itemToEdit ? 'Save Changes' : 'Add Item ♡'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
