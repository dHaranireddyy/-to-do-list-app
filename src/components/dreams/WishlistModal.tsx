import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Coins } from 'lucide-react';
import { WishlistItem, WishlistStatus } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { playGentleBellChime } from '../../utils/sound';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<WishlistItem, 'id' | 'createdAt'>, editingId?: string) => void;
  itemToEdit?: WishlistItem | null;
}

const WISHLIST_ICONS = ['🎧', '⌨️', '☕', '📚', '💡', '🎒', '🕯️', '🌸', '🪴', '👟', '🧴', '👗', '📷', '🍵'];

const WISHLIST_CATEGORIES = ['Tech & Study', 'Desk Setup', 'Cozy Sanctuary', 'Reading & Mind', 'Self-Care', 'Fashion'];

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const { currentTheme, isDark } = useTheme();

  const [name, setName] = useState('');
  const [targetPrice, setTargetPrice] = useState<number | ''>('');
  const [savedAmount, setSavedAmount] = useState<number | ''>(0);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [status, setStatus] = useState<WishlistStatus>('Saving');
  const [icon, setIcon] = useState('🎧');
  const [category, setCategory] = useState('Tech & Study');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setTargetPrice(itemToEdit.targetPrice);
      setSavedAmount(itemToEdit.savedAmount);
      setPriority(itemToEdit.priority);
      setStatus(itemToEdit.status);
      setIcon(itemToEdit.icon);
      setCategory(itemToEdit.category);
      setNotes(itemToEdit.notes || '');
    } else {
      setName('');
      setTargetPrice('');
      setSavedAmount(0);
      setPriority('medium');
      setStatus('Saving');
      setIcon('🎧');
      setCategory('Tech & Study');
      setNotes('');
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
    const numTargetPrice = Number(targetPrice);
    if (!numTargetPrice || numTargetPrice <= 0) {
      setError('Please enter a valid target price (in ₹) ♡');
      return;
    }

    const numSaved = Number(savedAmount) || 0;

    playGentleBellChime();
    onSave(
      {
        name: name.trim(),
        targetPrice: numTargetPrice,
        savedAmount: numSaved,
        priority,
        status: numSaved >= numTargetPrice ? 'Purchased' : status,
        icon,
        category: category.trim(),
        notes: notes.trim(),
      },
      itemToEdit ? itemToEdit.id : undefined
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
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="text-lg font-bold font-serif">
                {itemToEdit ? 'Edit Wishlist Item' : 'Add to Wishlist'}
              </h3>
              <p className="text-xs text-slate-400">
                Track savings towards things you'd love to own.
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

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Icon
            </label>
            <div className="flex flex-wrap gap-2 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 max-h-20 overflow-y-auto">
              {WISHLIST_ICONS.map(i => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-transform cursor-pointer ${
                    icon === i
                      ? 'scale-110 shadow-sm border border-pink-400'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor:
                      icon === i
                        ? isDark
                          ? 'rgba(236, 72, 153, 0.25)'
                          : `${currentTheme.primaryColor}25`
                        : 'transparent',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Noise-Cancelling Pastel Cream Headphones"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
          </div>

          {/* Price & Saved Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Target Cost (₹)
              </label>
              <input
                type="number"
                min="1"
                value={targetPrice}
                onChange={e => setTargetPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 8000"
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Saved So Far (₹)
              </label>
              <input
                type="number"
                min="0"
                value={savedAmount}
                onChange={e => setSavedAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 2500"
                className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              >
                {WISHLIST_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              >
                <option value="high">High (Dream Item)</option>
                <option value="medium">Medium</option>
                <option value="low">Low / Casual</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Current Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Planning', 'Saving', 'Purchased'] as WishlistStatus[]).map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    status === s
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Notes / Colorway / Link Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Cream colorway, bluetooth 5.3, comfortable over-ear cups..."
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/50 resize-none"
            />
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
              {itemToEdit ? 'Save Changes' : 'Add to Wishlist ♡'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
