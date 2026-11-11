export type GameId =
  | 'word-search'
  | 'flashcards'
  | 'quiz'
  | 'listen'
  | 'scramble'
  | 'memory'
  | 'spelling'
  | 'speed'
  | 'sorter';

export interface GameMeta {
  id: GameId;
  title: string;
  emoji: string;
  blurb: string;
  skill: string;
  colours: [string, string];
  /** Games that need one topic rather than a mix. */
  singleTopic?: boolean;
  minutes: string;
}

export const games: GameMeta[] = [
  {
    id: 'word-search',
    title: 'Word Search',
    emoji: '🔎',
    blurb: 'Hunt for hidden words in a letter grid. Tap the first letter, then the last.',
    skill: 'Spelling & scanning',
    colours: ['#0ea5e9', '#22d3ee'],
    singleTopic: true,
    minutes: '3–6 min',
  },
  {
    id: 'flashcards',
    title: 'Flip Cards',
    emoji: '🃏',
    blurb: 'Flip a card to meet a new word, hear it and read what it means.',
    skill: 'Word meaning',
    colours: ['#8b5cf6', '#ec4899'],
    singleTopic: true,
    minutes: '5 min',
  },
  {
    id: 'quiz',
    title: 'Quick Quiz',
    emoji: '❓',
    blurb: 'Ten questions that mix meanings and words. Can you get a perfect score?',
    skill: 'Comprehension',
    colours: ['#6366f1', '#0ea5e9'],
    minutes: '4 min',
  },
  {
    id: 'listen',
    title: 'Listen & Choose',
    emoji: '🎧',
    blurb: 'Hear a word spoken aloud, then pick the correct spelling.',
    skill: 'Listening',
    colours: ['#14b8a6', '#22c55e'],
    minutes: '4 min',
  },
  {
    id: 'scramble',
    title: 'Letter Scramble',
    emoji: '🔀',
    blurb: 'The letters have tumbled. Put them back in the right order.',
    skill: 'Spelling',
    colours: ['#f97316', '#f59e0b'],
    minutes: '4 min',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    emoji: '🧠',
    blurb: 'Turn over cards and pair each word with its meaning.',
    skill: 'Recall',
    colours: ['#ec4899', '#8b5cf6'],
    minutes: '3 min',
  },
  {
    id: 'spelling',
    title: 'Spelling Bee',
    emoji: '🐝',
    blurb: 'Read the clue, listen carefully and type the word correctly.',
    skill: 'Spelling & typing',
    colours: ['#eab308', '#f97316'],
    minutes: '4 min',
  },
  {
    id: 'speed',
    title: 'Beat the Clock',
    emoji: '⏱️',
    blurb: 'Sixty seconds. How many words can you match before time runs out?',
    skill: 'Fast recall',
    colours: ['#ef4444', '#f97316'],
    minutes: '1 min',
  },
  {
    id: 'sorter',
    title: 'Topic Sorter',
    emoji: '🗂️',
    blurb: 'Which topic does this word belong to? Sort them before the pile grows.',
    skill: 'Word families',
    colours: ['#0d9488', '#3b82f6'],
    minutes: '3 min',
  },
];

export const gameById = (id: string | undefined): GameMeta | undefined =>
  games.find((game) => game.id === id);
