let context: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!context) context = new Ctx();
  if (context.state === 'suspended') context.resume().catch(() => undefined);
  return context;
}

function tone(frequency: number, start: number, duration: number, gainValue: number) {
  const ctx = audioContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + start);
  oscillator.stop(ctx.currentTime + start + duration + 0.02);
}

export function playCorrect(enabled: boolean) {
  if (!enabled) return;
  tone(660, 0, 0.16, 0.09);
  tone(880, 0.1, 0.2, 0.08);
}

export function playWrong(enabled: boolean) {
  if (!enabled) return;
  tone(220, 0, 0.2, 0.07);
  tone(170, 0.12, 0.24, 0.06);
}

export function playWin(enabled: boolean) {
  if (!enabled) return;
  [523, 659, 784, 1046].forEach((frequency, index) => {
    tone(frequency, index * 0.12, 0.26, 0.08);
  });
}

export function playClick(enabled: boolean) {
  if (!enabled) return;
  tone(520, 0, 0.07, 0.05);
}
