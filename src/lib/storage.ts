import { useSyncExternalStore } from 'react';

const KEY = 'wordlab-ks3-progress-v1';

/** Signed-in learner whose progress is being read and written, if any. */
let scope: string | null = null;

function keyFor(learnerId: string | null): string {
  return learnerId ? `${KEY}::${learnerId}` : KEY;
}

export interface GameStat {
  plays: number;
  best: number;
}

export interface ProgressState {
  xp: number;
  /** Words the learner has marked as known. */
  known: Record<string, true>;
  /** Correct answers per word id. */
  correct: Record<string, number>;
  /** Times a word has been quizzed. */
  seen: Record<string, number>;
  games: Record<string, GameStat>;
  recordings: number;
  streak: number;
  lastDay: string | null;
  soundOn: boolean;
  speechRate: number;
  voiceURI: string | null;
}

const initial: ProgressState = {
  xp: 0,
  known: {},
  correct: {},
  seen: {},
  games: {},
  recordings: 0,
  streak: 0,
  lastDay: null,
  soundOn: true,
  speechRate: 0.9,
  voiceURI: null,
};

function read(): ProgressState {
  if (typeof window === 'undefined') return { ...initial };
  try {
    const raw = window.localStorage.getItem(keyFor(scope));
    if (!raw) return { ...initial };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      ...initial,
      ...parsed,
      known: parsed.known ?? {},
      correct: parsed.correct ?? {},
      seen: parsed.seen ?? {},
      games: parsed.games ?? {},
    };
  } catch {
    return { ...initial };
  }
}

let state: ProgressState = read();
const listeners = new Set<() => void>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function commit(next: ProgressState) {
  state = next;
  try {
    window.localStorage.setItem(keyFor(scope), JSON.stringify(state));
  } catch {
    /* storage may be full or blocked — progress still works for this session */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, () => state);
}

function touchStreak(next: ProgressState): ProgressState {
  const day = today();
  if (next.lastDay === day) return next;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const streak = next.lastDay === yesterday ? next.streak + 1 : 1;
  return { ...next, lastDay: day, streak };
}

export const progressActions = {
  addXp(amount: number) {
    if (amount <= 0) return;
    commit(touchStreak({ ...state, xp: state.xp + amount }));
  },

  recordAnswer(wordId: string, correct: boolean) {
    const next = {
      ...state,
      xp: state.xp + (correct ? 5 : 1),
      correct: { ...state.correct, [wordId]: (state.correct[wordId] ?? 0) + (correct ? 1 : 0) },
      seen: { ...state.seen, [wordId]: (state.seen[wordId] ?? 0) + 1 },
    };
    commit(touchStreak(next));
  },

  toggleKnown(wordId: string) {
    const known = { ...state.known };
    if (known[wordId]) {
      delete known[wordId];
    } else {
      known[wordId] = true;
    }
    commit({ ...state, known, xp: state.xp + (known[wordId] ? 3 : 0) });
  },

  markKnown(wordId: string) {
    if (state.known[wordId]) return;
    commit({ ...state, known: { ...state.known, [wordId]: true }, xp: state.xp + 3 });
  },

  recordGame(gameId: string, score: number) {
    const previous = state.games[gameId] ?? { plays: 0, best: 0 };
    commit(
      touchStreak({
        ...state,
        games: {
          ...state.games,
          [gameId]: { plays: previous.plays + 1, best: Math.max(previous.best, score) },
        },
      }),
    );
  },

  recordRecording() {
    commit(touchStreak({ ...state, recordings: state.recordings + 1, xp: state.xp + 4 }));
  },

  setSound(on: boolean) {
    commit({ ...state, soundOn: on });
  },

  setRate(rate: number) {
    commit({ ...state, speechRate: rate });
  },

  setVoice(voiceURI: string | null) {
    commit({ ...state, voiceURI });
  },

  reset() {
    commit({ ...initial });
  },
};

/** Load the saved progress for a learner (or the anonymous default when null). */
export function setProgressLearner(learnerId: string | null) {
  if (learnerId === scope) return;
  scope = learnerId;
  state = read();
  listeners.forEach((listener) => listener());
}

/** Give the first learner on a device any progress made before sign-in existed. */
export function adoptAnonymousProgress(learnerId: string) {
  if (typeof window === 'undefined') return;
  try {
    const legacy = window.localStorage.getItem(keyFor(null));
    const target = keyFor(learnerId);
    if (legacy && !window.localStorage.getItem(target)) {
      window.localStorage.setItem(target, legacy);
    }
  } catch {
    /* nothing to migrate */
  }
}
