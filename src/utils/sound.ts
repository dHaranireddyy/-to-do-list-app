// Soothing gentle audio chimes generated using Web Audio API synthesis
// No external assets required, purely client-side and tranquil

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a soothing, harmonic bell chime (perfect for Pomodoro transitions)
 */
export function playGentleBellChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic frequencies for a gentle singing bowl / meditation chime
    const frequencies = [528, 792, 1056]; // Solfeggio 528Hz love/miracle tone harmonic

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const peakGain = 0.12 / (idx + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4 + idx * 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.8 + idx * 0.4);
    });
  } catch {
    // Audio contexts might be muted or unsupported in headless environments
  }
}

/**
 * Play a soft gentle click/tick for stopwatch or button presses
 */
export function playSoftTick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Play a cute celebratory arpeggio chime for task completions
 */
export function playCelebrationChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Pleasant musical major chord arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.09, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  } catch {
    // Ignore audio errors
  }
}

/**
 * Play a cute coin drop chime for savings deposit
 */
export function playCoinChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5, E6
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // Ignore
  }
}

