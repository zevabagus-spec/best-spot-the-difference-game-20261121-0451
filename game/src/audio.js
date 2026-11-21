// Synthesised sound for Lanternlight Twins: no audio files, no network.
// Every effect is a few oscillators through one gain envelope, built lazily on
// the first user gesture (browsers block audio before that).

let audioContext = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

/** Create (or resume) the shared context. Safe to call before any gesture. */
export function ensureAudio() {
  if (typeof window === 'undefined') return null;
  if (audioContext === null) {
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

function playTone({ frequency, at, duration, type, volume }) {
  const context = ensureAudio();
  if (context === null || muted) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  const start = context.currentTime + at;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

/** A bright two-note chime when a difference is found. */
export function playFoundChime() {
  playTone({ frequency: 659.25, at: 0, duration: 0.22, type: 'sine', volume: 0.22 });
  playTone({ frequency: 987.77, at: 0.07, duration: 0.3, type: 'sine', volume: 0.2 });
  playTone({ frequency: 1318.5, at: 0.14, duration: 0.34, type: 'triangle', volume: 0.12 });
}

/** A soft low buzz for a wrong click. */
export function playMissBuzz() {
  playTone({ frequency: 164.81, at: 0, duration: 0.18, type: 'sawtooth', volume: 0.08 });
  playTone({ frequency: 130.81, at: 0.05, duration: 0.2, type: 'sawtooth', volume: 0.06 });
}

/** A warm shimmer when a hint is spent. */
export function playHintShimmer() {
  playTone({ frequency: 880, at: 0, duration: 0.25, type: 'sine', volume: 0.12 });
  playTone({ frequency: 1174.66, at: 0.09, duration: 0.3, type: 'sine', volume: 0.1 });
}

/** A short rising fanfare when a level is cleared. */
export function playLevelFanfare() {
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    playTone({ frequency, at: index * 0.11, duration: 0.32, type: 'triangle', volume: 0.16 });
  });
}

/** A quiet tick when the timer drops under ten seconds. */
export function playTick() {
  playTone({ frequency: 1200, at: 0, duration: 0.05, type: 'square', volume: 0.05 });
}
