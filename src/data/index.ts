import type { Category, WordEntry } from './types';
import { me } from './words/me';
import { school } from './words/school';
import { food } from './words/food';
import { home } from './words/home';
import { sport } from './words/sport';
import { travel } from './words/travel';
import { nature } from './words/nature';
import { animals } from './words/animals';
import { jobs } from './words/jobs';
import { tech } from './words/tech';
import { town } from './words/town';
import { health } from './words/health';

export type { Category, WordEntry } from './types';

export const categories: Category[] = [
  me,
  school,
  food,
  home,
  sport,
  travel,
  nature,
  animals,
  jobs,
  tech,
  town,
  health,
];

export const allWords: WordEntry[] = categories.flatMap((category) => category.words);

export const totalWords = allWords.length;

export function getCategory(id: string | undefined): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function getWord(id: string): WordEntry | undefined {
  return allWords.find((word) => word.id === id);
}

export function categoryOf(word: WordEntry): Category {
  return categories.find((category) => category.id === word.categoryId) ?? categories[0];
}

export function wordsIn(categoryIds: string[]): WordEntry[] {
  return categories
    .filter((category) => categoryIds.includes(category.id))
    .flatMap((category) => category.words);
}
