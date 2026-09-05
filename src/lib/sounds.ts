let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export const sounds = {
  cardFlip() {
    playTone(600, 0.08, 'triangle', 0.1);
  },
  cardPlace() {
    playTone(400, 0.1, 'sine', 0.12);
  },
  win() {
    playTone(523, 0.15, 'sine', 0.15);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.15), 120);
    setTimeout(() => playTone(784, 0.3, 'sine', 0.15), 240);
  },
  lose() {
    playTone(300, 0.2, 'sawtooth', 0.1);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.1), 150);
  },
  click() {
    playTone(800, 0.04, 'square', 0.08);
  },
  coin() {
    playTone(880, 0.06, 'triangle', 0.1);
    setTimeout(() => playTone(1100, 0.08, 'triangle', 0.1), 50);
  },
  levelUp() {
    playTone(523, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 80);
    setTimeout(() => playTone(784, 0.1, 'sine', 0.15), 160);
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.15), 240);
  },
  error() {
    playTone(200, 0.15, 'square', 0.1);
  },
  reward() {
    playTone(659, 0.1, 'triangle', 0.12);
    setTimeout(() => playTone(880, 0.1, 'triangle', 0.12), 80);
    setTimeout(() => playTone(1100, 0.2, 'triangle', 0.12), 160);
  },
};
