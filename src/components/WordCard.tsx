import type { WordEntry } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { Npr, SpeakerButton } from './Bits';

export function WordCard({ word }: { word: WordEntry }) {
  const progress = useProgress();
  const known = Boolean(progress.known[word.id]);

  return (
    <article className={`word-card ${known ? 'word-card--known' : ''}`}>
      <div className="word-card__top">
        <div>
          <h3 className="word-card__word">
            {word.word}
            <span className="pos">{word.pos}</span>
          </h3>
          <Npr npr={word.npr} />
        </div>
        <SpeakerButton text={word.word} label={`Hear “${word.word}”`} />
      </div>
      <p className="gloss">{word.gloss}</p>
      <div className="word-card__actions">
        <button
          type="button"
          className={`known-btn ${known ? 'known-btn--on' : ''}`}
          aria-pressed={known}
          onClick={() => progressActions.toggleKnown(word.id)}
        >
          {known ? '✓ I know this' : '☆ I know this'}
        </button>
        <a className="chip" href={`#/pronounce?topic=${word.categoryId}&word=${word.id}`}>
          🎙️ Say it
        </a>
      </div>
    </article>
  );
}
