import React, { useState, useEffect } from 'react';
import { Lock, Unlock, KeyRound, HelpCircle, AlertCircle, Sparkles, Delete, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { playSoftTick, playCelebrationChime } from '../utils/sound';

export const LockModal: React.FC = () => {
  const { isLocked, setIsLocked, userProfile, verifySanctuaryPin, removeSanctuaryPin } = useApp();
  const { currentTheme, isDark, themeSymbol, themeIcon } = useTheme();

  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const targetPinLength = userProfile.pinCode ? userProfile.pinCode.length : 4;
  const isPinProtected = Boolean(userProfile.isPinSet && userProfile.pinCode);

  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      setEnteredPin('');
      setErrorMsg('');
      setShowHint(false);
      setShowForgotModal(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLocked]);

  // Physical keyboard listener for PIN typing
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPinProtected) {
        if (e.key === 'Enter' || e.key === ' ') {
          handleUnlockSuccess();
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigitInput(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        setEnteredPin('');
        setErrorMsg('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, enteredPin, isPinProtected, targetPinLength]);

  const handleDigitInput = (digit: string) => {
    if (enteredPin.length >= targetPinLength) return;

    if (userProfile.soundEnabled) {
      playSoftTick();
    }

    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);
    setErrorMsg('');

    if (nextPin.length === targetPinLength) {
      checkPin(nextPin);
    }
  };

  const handleBackspace = () => {
    if (enteredPin.length > 0) {
      if (userProfile.soundEnabled) {
        playSoftTick();
      }
      setEnteredPin(prev => prev.slice(0, -1));
      setErrorMsg('');
    }
  };

  const handleClear = () => {
    if (userProfile.soundEnabled) {
      playSoftTick();
    }
    setEnteredPin('');
    setErrorMsg('');
  };

  const checkPin = (pinToCheck: string) => {
    if (verifySanctuaryPin(pinToCheck)) {
      handleUnlockSuccess();
    } else {
      setIsShaking(true);
      setErrorMsg('Incorrect PIN ♡ Please try again');
      setTimeout(() => {
        setIsShaking(false);
        setEnteredPin('');
      }, 500);
    }
  };

  const handleUnlockSuccess = () => {
    if (userProfile.soundEnabled) {
      playCelebrationChime();
    }
    setIsLocked(false);
    setEnteredPin('');
    setErrorMsg('');
  };

  const handleEmergencyResetPin = () => {
    removeSanctuaryPin();
    setShowForgotModal(false);
    handleUnlockSuccess();
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl p-6 sm:p-8 text-center shadow-2xl border transition-all relative ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-white'
            : 'bg-white/95 border-pink-100 text-slate-800'
        }`}
      >
        {/* Emblem */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm mb-3.5 transition-transform duration-300 hover:scale-105"
          style={{
            backgroundColor: `${currentTheme.primaryColor}25`,
            color: currentTheme.accentColor,
          }}
        >
          <span>{themeIcon}</span>
        </div>

        <h3 className="text-xl font-bold font-serif flex items-center justify-center gap-1.5">
          <span>{themeSymbol}</span>
          <span>Welcome Back ♡</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          {userProfile.name}'s Little World♡ is safe & protected.
        </p>

        {isPinProtected ? (
          <div className="space-y-5">
            {/* PIN Indicator Dots */}
            <div
              className={`flex items-center justify-center gap-3.5 py-2 transition-transform ${
                isShaking ? 'animate-bounce text-rose-500' : ''
              }`}
            >
              {Array.from({ length: targetPinLength }).map((_, idx) => {
                const filled = idx < enteredPin.length;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                      filled
                        ? 'scale-110 shadow-xs'
                        : isDark
                        ? 'border-slate-700 bg-slate-800'
                        : 'border-slate-300 bg-slate-100'
                    }`}
                    style={
                      filled
                        ? {
                            borderColor: currentTheme.accentColor,
                            backgroundColor: currentTheme.accentColor,
                          }
                        : undefined
                    }
                  />
                );
              })}
            </div>

            {errorMsg ? (
              <p className="text-xs text-rose-500 font-medium animate-fade-in">{errorMsg}</p>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-[11px] text-slate-400">Enter your {targetPinLength}-digit passcode</p>
                {userProfile.pinCode === '1234' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEnteredPin('1234');
                      checkPin('1234');
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-mono transition-all hover:scale-105 active:scale-95 border"
                    style={{
                      backgroundColor: `${currentTheme.primaryColor}20`,
                      borderColor: `${currentTheme.accentColor}30`,
                      color: currentTheme.accentColor,
                    }}
                    title="Tap to unlock with default PIN (1234)"
                  >
                    <span>Default PIN: 1234</span>
                  </button>
                )}
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigitInput(num)}
                  className={`h-12 rounded-2xl text-base font-semibold transition-all active:scale-90 flex items-center justify-center border ${
                    isDark
                      ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={handleClear}
                className={`h-12 rounded-2xl text-xs font-semibold transition-all active:scale-90 flex items-center justify-center border text-slate-400 hover:text-slate-600 ${
                  isDark
                    ? 'bg-slate-800/40 border-slate-800'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => handleDigitInput('0')}
                className={`h-12 rounded-2xl text-base font-semibold transition-all active:scale-90 flex items-center justify-center border ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                }`}
              >
                0
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                className={`h-12 rounded-2xl text-base transition-all active:scale-90 flex items-center justify-center border text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 ${
                  isDark
                    ? 'bg-slate-800/40 border-slate-800'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
                title="Delete digit"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Hint and Emergency Options */}
            <div className="pt-2 flex items-center justify-center gap-4 text-xs">
              {userProfile.securityHint && (
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'View Hint'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                Forgot PIN?
              </button>
            </div>

            {showHint && userProfile.securityHint && (
              <div
                className="p-3 rounded-2xl text-xs text-center border animate-fade-in"
                style={{
                  backgroundColor: `${currentTheme.primaryColor}15`,
                  borderColor: `${currentTheme.accentColor}30`,
                }}
              >
                <span className="font-semibold text-slate-600 dark:text-slate-300">Security Hint: </span>
                <span className="text-slate-500 dark:text-slate-400 italic">"{userProfile.securityHint}"</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="p-4 rounded-2xl text-xs border text-left"
              style={{
                backgroundColor: `${currentTheme.primaryColor}10`,
                borderColor: `${currentTheme.accentColor}25`,
              }}
            >
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  No custom PIN is set yet. Tap below to re-enter your sanctuary, and configure a personal PIN in Settings whenever you like!
                </span>
              </div>
            </div>

            <button
              onClick={handleUnlockSuccess}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock My Little World♡</span>
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-inherit/40 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          <span>Private Client-Side Sanctuary Encryption</span>
        </div>
      </div>

      {/* Emergency Forgot PIN Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 text-center border shadow-2xl ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-pink-100 text-slate-800'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-rose-100 text-rose-500 text-xl mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base font-serif">Forgot Passcode?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Because My Little World♡ is purely client-side and completely private, you can safely reset your PIN to regain entry. Your tasks, journals, and dreams will remain intact.
            </p>

            {userProfile.securityHint && (
              <div className="my-3.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
                Hint: <span className="font-medium italic">{userProfile.securityHint}</span>
              </div>
            )}

            <div className="flex gap-2.5 mt-4">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmergencyResetPin}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-xs"
              >
                Reset PIN & Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
