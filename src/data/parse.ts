import type { Category, PartOfSpeech, WordEntry } from './types';

const POS: PartOfSpeech[] = ['noun', 'verb', 'adjective', 'adverb', 'phrase'];

/**
 * Parses the compact vocabulary format used in `src/data/words/*.ts`:
 *   word | NPR | part of speech | child-friendly gloss
 */
export function parseWords(categoryId: string, raw: string): WordEntry[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line, index) => {
      const parts = line.split('|').map((part) => part.trim());
      if (parts.length < 4) {
        throw new Error(`Bad vocabulary line in "${categoryId}": ${line}`);
      }
      const [word, npr, pos, ...rest] = parts;
      const cleanPos = (POS.includes(pos as PartOfSpeech) ? pos : 'noun') as PartOfSpeech;
      return {
        id: `${categoryId}-${index}`,
        word,
        npr,
        pos: cleanPos,
        gloss: rest.join(' | '),
        categoryId,
      };
    });
}

export function makeCategory(
  meta: Omit<Category, 'words'>,
  raw: string,
): Category {
  return { ...meta, words: parseWords(meta.id, raw) };
}
