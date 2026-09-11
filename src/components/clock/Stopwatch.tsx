import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Clock as ClockIcon, Sparkles, Trash2, Award } from 'lucide-react';
import { Card } from '../common/Card';
import { useTheme } from '../../context/ThemeContext';
import { playSoftTick } from '../../utils/sound';

interface LapRecord {
  lapNumber: number;
  lapTimeMs: number;
  overallTimeMs: number;
}

export const Stopwatch: React.FC = () => {
  const { currentTheme, isDark } = useTheme();

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastLapTimeRef = useRef<number>(0);

  // Update stopwatch using requestAnimationFrame for smooth precision
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;

      const tick = () => {
        setElapsedTime(Date.now() - startTimeRef.current);
        animationFrameRef.current = requestAnimationFrame(tick);
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    playSoftTick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    playSoftTick();
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const handleLap = () => {
    if (!isRunning && elapsedTime === 0) return;
    playSoftTick();
    const lapTimeMs = elapsedTime - lastLapTimeRef.current;
    lastLapTimeRef.current = elapsedTime;

    const newLap: LapRecord = {
      lapNumber: laps.length + 1,
      lapTimeMs,
      overallTimeMs: elapsedTime,
    };

    setLaps(prev => [newLap, ...prev]);
  };

  // Format milliseconds into MM:SS.cs
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      centiseconds: centiseconds.toString().padStart(2, '0'),
    };
  };

  const mainTime = formatTime(elapsedTime);

  // Determine fastest and slowest lap for friendly highlighting
  let fastestLapIdx = -1;
  let slowestLapIdx = -1;

  if (laps.length > 1) {
    let min = Infinity;
    let max = -Infinity;
    laps.forEach((lap, idx) => {
      if (lap.lapTimeMs < min) {
        min = lap.lapTimeMs;
        fastestLapIdx = idx;
      }
      if (lap.lapTimeMs > max) {
        max = lap.lapTimeMs;
        slowestLapIdx = idx;
      }
    });
  }

  return (
    <Card className="p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
      {/* Header bar */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs"
              style={{
                backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : '#E0F2FE',
              }}
            >
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif text-slate-900 dark:text-slate-100">
                Aesthetic Stopwatch
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Precision interval and lap measurements
              </span>
            </div>
          </div>

          {laps.length > 0 && (
            <button
              onClick={() => {
                setLaps([]);
                lastLapTimeRef.current = elapsedTime;
              }}
              title="Clear laps"
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Laps
            </button>
          )}
        </div>

        {/* Stopwatch Main Display */}
        <div className="text-center py-6">
          <div className="inline-flex items-baseline justify-center font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            <span>{mainTime.minutes}</span>
            <span className="mx-0.5 text-sky-500">:</span>
            <span>{mainTime.seconds}</span>
            <span className="text-2xl sm:text-3xl font-mono text-sky-500/80 ml-1">
              .{mainTime.centiseconds}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {isRunning ? '⏱️ Measuring study intervals...' : 'Ready to record your timing'}
          </p>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="mt-2 mb-4 max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-3 pb-1 border-b border-inherit">
              <span>Lap</span>
              <span>Split Time</span>
              <span>Overall Time</span>
            </div>
            {laps.map((lap, idx) => {
              const split = formatTime(lap.lapTimeMs);
              const total = formatTime(lap.overallTimeMs);
              const isFastest = idx === fastestLapIdx;
              const isSlowest = idx === slowestLapIdx;

              return (
                <div
                  key={lap.lapNumber}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    isFastest
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium'
                      : isSlowest
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      : isDark
                      ? 'bg-slate-800/40 text-slate-300'
                      : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span>#{lap.lapNumber}</span>
                    {isFastest && <Award className="w-3.5 h-3.5 text-emerald-500" title="Fastest Lap" />}
                  </span>
                  <span className="font-mono">
                    +{split.minutes}:{split.seconds}.{split.centiseconds}
                  </span>
                  <span className="font-mono opacity-80">
                    {total.minutes}:{total.seconds}.{total.centiseconds}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 pt-6 border-t border-inherit">
        <button
          onClick={handleReset}
          title="Reset stopwatch"
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleStartPause}
          className="px-8 py-3.5 rounded-2xl font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 text-sm bg-sky-600 hover:bg-sky-500"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{elapsedTime > 0 ? 'Resume' : 'Start'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning && elapsedTime === 0}
          title="Record lap"
          className={`p-3 rounded-2xl border transition-all ${
            isRunning || elapsedTime > 0
              ? 'border-sky-300 dark:border-sky-800 text-sky-600 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 active:scale-95'
              : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};
