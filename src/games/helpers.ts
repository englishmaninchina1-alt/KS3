import { allWords, getCategory } from '../data';
import type { WordEntry } from '../data';
import { pickOne, sample, shuffle } from '../lib/utils';

export interface GameProps {
  topicId: string;
  onExit: () => void;
}

export function poolFor(topicId: string): WordEntry[] {
  const category = getCategory(topicId);
  return category ? category.words : allWords;
}

export interface ChoiceQuestion {
  word: WordEntry;
  mode: 'meaning' | 'word';
  options: string[];
  answer: string;
}

export function makeChoiceQuestionFor(
  word: WordEntry,
  pool: WordEntry[],
  mode: 'meaning' | 'word',
): ChoiceQuestion {
  const others = sample(
    pool.filter((entry) => entry.id !== word.id),
    3,
  );

  if (mode === 'word') {
    const options = shuffle([word.word, ...others.map((entry) => entry.word)]);
    return { word, mode, options, answer: word.word };
  }

  const options = shuffle([word.gloss, ...others.map((entry) => entry.gloss)]);
  return { word, mode, options, answer: word.gloss };
}

export function makeChoiceQuestion(pool: WordEntry[], mode: 'meaning' | 'word'): ChoiceQuestion {
  return makeChoiceQuestionFor(pickOne(pool), pool, mode);
}
