export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

export function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function scramble(word: string): string {
  const letters = word.split('');
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const mixed = shuffle(letters).join('');
    if (mixed.toLowerCase() !== word.toLowerCase()) return mixed;
  }
  return shuffle(letters).join('');
}

/** Split an NPR string into syllables, e.g. "FAM-uh-lee" -> ["FAM", "uh", "lee"] */
export function syllables(npr: string): string[] {
  return npr
    .split(/[-\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function starsFor(correct: number, total: number): number {
  if (total <= 0) return 0;
  const ratio = correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.65) return 2;
  if (ratio >= 0.35) return 1;
  return 0;
}

export function plural(count: number, singular: string, pluralForm?: string): string {
  return count === 1 ? singular : pluralForm ?? `${singular}s`;
}

export function formatSeconds(total: number): string {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const LEVEL_STEP = 150;

export const LEVEL_TITLES = [
  'Word Sprout',
  'Word Wanderer',
  'Word Explorer',
  'Phrase Finder',
  'Sentence Builder',
  'Story Teller',
  'Language Detective',
  'Word Wizard',
  'Vocabulary Champion',
  'WordLab Legend',
];

export function levelFor(xp: number): { level: number; title: string; into: number; need: number } {
  const level = Math.floor(xp / LEVEL_STEP) + 1;
  const into = xp % LEVEL_STEP;
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  return { level, title, into, need: LEVEL_STEP };
}
