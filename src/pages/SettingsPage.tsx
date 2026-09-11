import React, { useState, useRef } from 'react';
import {
  User,
  Shield,
  Database,
  Sparkles,
  Check,
  Lock,
  Unlock,
  KeyRound,
  Bell,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  FileCheck,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { playGentleBellChime, playCelebrationChime } from '../utils/sound';
import {
  validateSanctuaryBackup,
  getSanctuaryStorageStats,
  BackupValidationResult,
} from '../utils/sanctuaryStorage';

export const SettingsPage: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    setIsLocked,
    exportSanctuaryBackup,
    importSanctuaryBackup,
    resetSanctuaryData,
    setSanctuaryPin,
    removeSanctuaryPin,
    tasks,
    journalEntries,
    goals,
    wishlist,
    needs,
  } = useApp();

  const { currentTheme, themeSymbol, isDark } = useTheme();

  // Profile form state
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [greetingInput, setGreetingInput] = useState(userProfile.greetingCustom || '');
  const [profileNotice, setProfileNotice] = useState(false);

  // PIN security states
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [securityHint, setSecurityHint] = useState(userProfile.securityHint || '');
  const [pinError, setPinError] = useState('');
  const [pinSuccessNotice, setPinSuccessNotice] = useState('');

  // Backup & Import states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importPendingData, setImportPendingData] = useState<BackupValidationResult | null>(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  // Reset modal state
  const [showResetModal, setShowResetModal] = useState(false);

  const avatars = ['🌸', '🧸', '🪻', '🌿', '🌙', '🍓', '✨', '☕', '🐱', '🦋'];
  const storageStats = getSanctuaryStorageStats();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateUserProfile({
        name: nameInput.trim(),
        greetingCustom: greetingInput.trim() || undefined,
      });
      setProfileNotice(true);
      setTimeout(() => setProfileNotice(false), 2500);
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    updateUserProfile({ avatarIcon: avatar });
  };

  const handleTestSound = () => {
    playGentleBellChime();
  };

  const handleOpenPinSetup = () => {
    setNewPin('');
    setConfirmPin('');
    setSecurityHint(userProfile.securityHint || '');
    setPinError('');
    setShowPinModal(true);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setPinError('Passcode must be exactly 4 numeric digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('Passcodes do not match. Please try again.');
      return;
    }

    setSanctuaryPin(newPin, securityHint);
    setShowPinModal(false);
    setPinSuccessNotice('Passcode saved! Your sanctuary is now protected 🔒');
    setTimeout(() => setPinSuccessNotice(''), 3000);
  };

  const handleRemovePin = () => {
    removeSanctuaryPin();
    setPinSuccessNotice('Passcode removed. Quick-unlock enabled.');
    setTimeout(() => setPinSuccessNotice(''), 3000);
  };

  const handleExportClick = () => {
    exportSanctuaryBackup();
    if (userProfile.soundEnabled) {
      playCelebrationChime();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const validation = validateSanctuaryBackup(content);
      if (!validation.valid) {
        setImportError(validation.error || 'Failed to parse sanctuary backup file.');
        setImportPendingData(null);
      } else {
        setImportError('');
        setImportPendingData(validation);
      }
    };
    reader.readAsText(file);
    // Reset file input so user can choose the same file again if desired
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (importPendingData?.data) {
      importSanctuaryBackup(importPendingData.data);
      if (userProfile.soundEnabled) {
        playCelebrationChime();
      }
      setImportPendingData(null);
      setImportSuccess('Sanctuary restored successfully! Welcome home ♡');
      setTimeout(() => setImportSuccess(''), 4000);
    }
  };

  const handleExecuteReset = (mode: 'demo' | 'clean') => {
    resetSanctuaryData(mode);
    setShowResetModal(false);
    if (userProfile.soundEnabled) {
      playGentleBellChime();
    }
    setImportSuccess(
      mode === 'demo' ? 'Restored demo sanctuary data.' : 'Clean slate initialized.'
    );
    setTimeout(() => setImportSuccess(''), 3500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
              Sanctuary Settings & Data
            </h2>
            <Badge variant="primary" icon={themeSymbol}>
              Personalize
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize your identity, security PIN, audio ambiance, and offline backups.
          </p>
        </div>

        {/* Quick Lock Button */}
        <button
          onClick={() => setIsLocked(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border shadow-2xs transition-all hover:scale-105 active:scale-95 self-start sm:self-auto"
          style={{
            borderColor: `${currentTheme.accentColor}40`,
            backgroundColor: `${currentTheme.primaryColor}15`,
            color: currentTheme.accentColor,
          }}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Lock Sanctuary Now</span>
        </button>
      </div>

      {pinSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{pinSuccessNotice}</span>
        </div>
      )}

      {importSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{importSuccess}</span>
        </div>
      )}

      {importError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{importError}</span>
        </div>
      )}

      {/* 1. Profile & Identity Card */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Profile & Identity
            </h3>
          </div>
          <span className="text-xs text-slate-400">Personal Space</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Sanctuary Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Enter your name"
                className={`w-full px-3.5 py-2.5 rounded-2xl text-sm border transition-colors ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Warmly displayed on your home dashboard and journal greeting.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Custom Welcome Subtitle
              </label>
              <input
                type="text"
                value={greetingInput}
                onChange={e => setGreetingInput(e.target.value)}
                placeholder="e.g. Welcome to my private cozy corner ♡"
                className={`w-full px-3.5 py-2.5 rounded-2xl text-sm border transition-colors ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Leaves a personal motivational motto below your name.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Choose an Aesthetic Avatar Icon
            </label>
            <div className="flex flex-wrap gap-2.5">
              {avatars.map(av => (
                <button
                  key={av}
                  type="button"
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center border transition-all ${
                    userProfile.avatarIcon === av
                      ? 'border-2 scale-110 shadow-sm'
                      : isDark
                      ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                  style={
                    userProfile.avatarIcon === av
                      ? {
                          borderColor: currentTheme.accentColor,
                          backgroundColor: `${currentTheme.primaryColor}25`,
                        }
                      : undefined
                  }
                >
                  <span>{av}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-1 flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-95"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              {profileNotice ? 'Profile Updated ✓' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Card>

      {/* 2. Privacy & Security Settings (Stage 8) */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Privacy & Passcode Lock
            </h3>
          </div>
          {userProfile.isPinSet ? (
            <Badge variant="primary" icon="🔒">
              PIN Protected
            </Badge>
          ) : (
            <Badge variant="neutral" icon="🔓">
              Quick Unlock
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
            <div>
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>Sanctuary PIN Code</span>
                {userProfile.isPinSet && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-normal">
                    Active
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {userProfile.isPinSet
                  ? 'Your dashboard requires a 4-digit PIN code to unlock.'
                  : 'No PIN is set. Anyone with browser access can open your sanctuary.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenPinSetup}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {userProfile.isPinSet ? 'Change PIN' : 'Set 4-Digit PIN'}
              </button>

              {userProfile.isPinSet && (
                <button
                  type="button"
                  onClick={handleRemovePin}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  Remove PIN
                </button>
              )}
            </div>
          </div>

          {/* Auto-Lock Inactivity Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-t border-inherit/40">
            <div>
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Auto-Lock on Inactivity</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically protects your sanctuary when left idle.
              </p>
            </div>

            <select
              value={userProfile.autoLockMinutes}
              onChange={e =>
                updateUserProfile({ autoLockMinutes: parseInt(e.target.value, 10) })
              }
              className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="0">Disabled (Never auto-lock)</option>
              <option value="1">1 Minute (Ultra private)</option>
              <option value="5">5 Minutes</option>
              <option value="15">15 Minutes (Recommended)</option>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
            </select>
          </div>

          {/* Audio Chimes Preferences */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-t border-inherit/40">
            <div>
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {userProfile.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Tranquil Audio Ambiance</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Soothing Web Audio harmonic bells for Pomodoro and task achievements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {userProfile.soundEnabled && (
                <button
                  type="button"
                  onClick={handleTestSound}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Test Chime 🔔
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  updateUserProfile({ soundEnabled: !userProfile.soundEnabled })
                }
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  userProfile.soundEnabled
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {userProfile.soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Data Storage, Backup & Restore (Stage 7) */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Data Storage & Offline Backups
            </h3>
          </div>
          <Badge variant="primary">100% Client-Side</Badge>
        </div>

        {/* Storage Metrics Meter */}
        <div
          className="p-4 rounded-2xl border text-xs space-y-3"
          style={{
            backgroundColor: `${currentTheme.primaryColor}10`,
            borderColor: `${currentTheme.accentColor}25`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Browser Storage Footprint
            </span>
            <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold">
              ~{storageStats.approxKb} KB used
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-black/5">
              <span className="text-[11px] text-slate-400 block">Tasks</span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
                {tasks.length} items
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-black/5">
              <span className="text-[11px] text-slate-400 block">Journals</span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
                {journalEntries.length} entries
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-black/5">
              <span className="text-[11px] text-slate-400 block">Goals & Visions</span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
                {goals.length} active
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-black/5">
              <span className="text-[11px] text-slate-400 block">Wishlist & Needs</span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
                {wishlist.length + needs.length} items
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Your sacred space is kept strictly in your local browser sandbox. To prevent loss if your browser cache is cleared, export a backup copy regularly.
          </p>
        </div>

        {/* Export & Import Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleExportClick}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sanctuary (.json)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Sanctuary (.json)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-3 py-2 text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors self-start sm:self-auto"
          >
            Reset Sanctuary Options
          </button>
        </div>
      </Card>

      {/* PIN Setup Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 text-center border shadow-2xl ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-pink-100 text-slate-800'
            }`}
          >
            <div
              className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-xs mb-3"
              style={{
                backgroundColor: `${currentTheme.primaryColor}25`,
                color: currentTheme.accentColor,
              }}
            >
              <KeyRound className="w-6 h-6" />
            </div>

            <h4 className="font-bold text-base font-serif">Set Sanctuary Passcode</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Enter a 4-digit PIN code to safeguard your thoughts and dreams.
            </p>

            <form onSubmit={handleSavePin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  4-Digit Passcode
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 1234"
                  className={`w-full text-center tracking-widest font-mono text-base py-2 px-3 rounded-xl border ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Passcode
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Re-enter 4 digits"
                  className={`w-full text-center tracking-widest font-mono text-base py-2 px-3 rounded-xl border ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Security Hint (Optional)
                </label>
                <input
                  type="text"
                  value={securityHint}
                  onChange={e => setSecurityHint(e.target.value)}
                  placeholder="e.g. Favorite cafe street number"
                  className={`w-full py-2 px-3 text-xs rounded-xl border ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {pinError && <p className="text-xs text-rose-500 font-medium">{pinError}</p>}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: currentTheme.accentColor }}
                >
                  Save Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Confirmation Preview Modal */}
      {importPendingData?.summary && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl p-6 text-center border shadow-2xl ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-pink-100 text-slate-800'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-emerald-100 text-emerald-600 text-2xl mb-3">
              <FileCheck className="w-6 h-6" />
            </div>

            <h4 className="font-bold text-base font-serif">Confirm Sanctuary Restore</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Restoring this backup will replace current items with the contents below:
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-inherit text-left text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-400">Sanctuary Owner:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {importPendingData.summary.userName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tasks:</span>
                <span className="font-medium">{importPendingData.summary.tasksCount} tasks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Journal Reflections:</span>
                <span className="font-medium">
                  {importPendingData.summary.journalCount} entries
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Goals & Visions:</span>
                <span className="font-medium">{importPendingData.summary.goalsCount} goals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Wishlist & Needs:</span>
                <span className="font-medium">
                  {importPendingData.summary.wishlistCount + importPendingData.summary.needsCount}{' '}
                  items
                </span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setImportPendingData(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs"
                style={{ backgroundColor: currentTheme.accentColor }}
              >
                Confirm & Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sanctuary Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 text-center border shadow-2xl ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-pink-100 text-slate-800'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-rose-100 text-rose-500 text-2xl mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>

            <h4 className="font-bold text-base font-serif">Sanctuary Reset</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 leading-relaxed">
              Choose how you would like to reset your sanctuary data:
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleExecuteReset('demo')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left flex items-center justify-between"
              >
                <span>Restore Demo Sanctuary</span>
                <span className="text-[10px] text-slate-400">Gentle defaults</span>
              </button>

              <button
                type="button"
                onClick={() => handleExecuteReset('clean')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left flex items-center justify-between"
              >
                <span>Start Clean Slate</span>
                <span className="text-[10px] text-rose-400">Empty workspace</span>
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-inherit">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
