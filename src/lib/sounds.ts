let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let musicStep = 0;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0.12;
    musicGain.connect(masterGain);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.5;
    sfxGain.connect(masterGain);
  }
  return ctx;
}

export function resumeAudio() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
}

export function setMusicEnabled(enabled: boolean) {
  const c = getCtx();
  if (enabled) {
    if (c.state === 'suspended') c.resume();
    if (!musicTimer) startMusic();
  } else {
    stopMusic();
  }
}

export function setSfxEnabled(enabled: boolean) {
  const c = getCtx();
  sfxGain!.gain.value = enabled ? 0.5 : 0;
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.5, when = 0) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, c.currentTime + when);
  gain.gain.linearRampToValueAtTime(vol, c.currentTime + when + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + when + dur);
  osc.connect(gain);
  gain.connect(sfxGain!);
  osc.start(c.currentTime + when);
  osc.stop(c.currentTime + when + dur + 0.05);
}

export function playCardFlip() {
  tone(420, 0.08, 'triangle', 0.3);
  tone(680, 0.06, 'sine', 0.15, 0.02);
}

export function playCardMove() {
  tone(320, 0.1, 'triangle', 0.25);
  tone(440, 0.08, 'sine', 0.12, 0.03);
}

export function playCardPlace() {
  tone(280, 0.12, 'sine', 0.3);
  tone(360, 0.08, 'triangle', 0.15, 0.04);
}

export function playFoundation() {
  tone(523, 0.1, 'triangle', 0.25);
  tone(659, 0.1, 'triangle', 0.2, 0.06);
  tone(784, 0.15, 'sine', 0.2, 0.12);
}

export function playError() {
  tone(200, 0.15, 'sawtooth', 0.15);
  tone(180, 0.12, 'sawtooth', 0.1, 0.05);
}

export function playWin() {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((n, i) => tone(n, 0.3, 'triangle', 0.3, i * 0.12));
  notes.forEach((n, i) => tone(n * 2, 0.2, 'sine', 0.15, i * 0.12 + 0.02));
}

export function playLose() {
  tone(330, 0.2, 'sawtooth', 0.2);
  tone(247, 0.25, 'sawtooth', 0.18, 0.1);
  tone(196, 0.3, 'sine', 0.15, 0.2);
}

export function playCoin() {
  tone(988, 0.08, 'triangle', 0.25);
  tone(1319, 0.1, 'sine', 0.2, 0.04);
}

export function playLevelUp() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => tone(n, 0.2, 'triangle', 0.3, i * 0.08));
  tone(1568, 0.4, 'sine', 0.25, 0.32);
}

export function playClick() {
  tone(800, 0.04, 'sine', 0.15);
}

export function playJackpot() {
  const notes = [523, 659, 784, 1047, 1319, 1568, 2093];
  notes.forEach((n, i) => tone(n, 0.15, 'triangle', 0.25, i * 0.06));
}

const MUSIC_MELODY = [
  0, 0, 262, 0, 330, 0, 392, 0, 523, 0, 392, 0, 330, 0, 294, 0,
  0, 0, 294, 0, 349, 0, 440, 0, 587, 0, 440, 0, 349, 0, 294, 0,
  0, 0, 262, 0, 330, 0, 392, 0, 523, 0, 659, 0, 523, 0, 392, 0,
  0, 0, 392, 0, 349, 0, 330, 0, 294, 0, 262, 0, 247, 0, 262, 0,
];

const MUSIC_BASS = [
  131, 0, 0, 0, 131, 0, 0, 0, 131, 0, 0, 0, 131, 0, 0, 0,
  147, 0, 0, 0, 147, 0, 0, 0, 147, 0, 0, 0, 147, 0, 0, 0,
  131, 0, 0, 0, 131, 0, 0, 0, 131, 0, 0, 0, 131, 0, 0, 0,
  165, 0, 0, 0, 165, 0, 0, 0, 131, 0, 0, 0, 131, 0, 0, 0,
];

function startMusic() {
  const c = getCtx();
  musicStep = 0;
  musicTimer = setInterval(() => {
    const m = MUSIC_MELODY[musicStep % MUSIC_MELODY.length];
    const b = MUSIC_BASS[musicStep % MUSIC_BASS.length];
    if (m > 0) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.value = m;
      gain.gain.setValueAtTime(0, c.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, c.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(musicGain!);
      osc.start();
      osc.stop(c.currentTime + 0.3);
    }
    if (b > 0) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = b;
      gain.gain.setValueAtTime(0, c.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, c.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(musicGain!);
      osc.start();
      osc.stop(c.currentTime + 0.42);
    }
    musicStep++;
  }, 220);
}

function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}
