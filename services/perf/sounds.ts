export function createBeep(frequency: number, durationMs = 100): void {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + durationMs / 1000);
  oscillator.stop(context.currentTime + durationMs / 1000);
}

export const soundByStatus = {
  OK: () => createBeep(880, 90),
  NOK: () => createBeep(220, 180),
  DUPLICATE: () => createBeep(440, 140),
};
