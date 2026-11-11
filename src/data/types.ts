export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase';

export interface WordEntry {
  /** Stable id: `${categoryId}-${index}` */
  id: string;
  word: string;
  /** Natural Phonetic Respelling, e.g. "FAM-uh-lee" */
  npr: string;
  pos: PartOfSpeech;
  gloss: string;
  categoryId: string;
}

export interface Category {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  /** Two colour stops used for the topic's gradient */
  colours: [string, string];
  /** How this topic links to the UK KS3 English programme of study */
  ks3: string;
  /** Speaking prompts used in the pronunciation studio */
  prompts: string[];
  words: WordEntry[];
}
