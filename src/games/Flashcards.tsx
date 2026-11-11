import { useMemo, useState } from 'react';
import { allWords, categories, getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { shuffle } from '../lib/utils';
import { CategoryChips, GameHeader, HudItem, Npr, ProgressBar, SpeakerButton } from '../components/Bits';

export default function Flashcards({ topicId }: { topicId: string; onExit: () => void }) {
  const [topic, setTopic] = useState(topicId || 'all');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mixed, setMixed] = useState(false);
  const progress = useProgress();

  const category = getCategory(topic);
  const deck = useMemo(() => {
    const words = category ? category.words : allWords;
    return mixed ? shuffle(words) : words;
  }, [category, mixed]);

  const word = deck[index % deck.length];
  const known = Boolean(progress.known[word.id]);

  const go = (direction: number) => {
    setFlipped(false);
    setIndex((value) => (value + direction + deck.length) % deck.length);
  };

  return (
    <div className="game-shell">
      <GameHeader
        emoji="🃏"
        title="Flip Cards"
        subtitle={category ? `${category.emoji} ${category.title}` : '🌍 A mix of every topic'}
        onExit={() => {
          window.location.hash = '#/games';
        }}
        hud={
          <>
            <HudItem label="Card" value={`${index + 1}/${deck.length}`} />
            <HudItem
              label="Known"
              value={
                category
                  ? `${category.words.filter((entry) => progress.known[entry.id]).length}/50`
                  : Object.keys(progress.known).length
              }
            />
          </>
        }
      />

      <div className="panel" style={{ marginBottom: 18 }}>
        <CategoryChips
          value={topic}
          onChange={(next) => {
            setTopic(next);
            setIndex(0);
            setFlipped(false);
          }}
          categories={categories}
          allowAll
          label="Deck"
        />
      </div>

      <div className="flash-wrap">
        <div
          className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={flipped ? 'Card showing the meaning. Activate to flip back.' : `Card showing ${word.word}. Activate to see the meaning.`}
          onClick={() => setFlipped((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setFlipped((value) => !value);
            }
          }}
        >
          <div className="flashcard__inner">
            <div className="flashcard__face">
              <span className="flashcard__hint">Tap to flip</span>
              <h2 className="flashcard__word">{word.word}</h2>
              <Npr npr={word.npr} />
              <span className="pos">{word.pos}</span>
              <div onClick={(event) => event.stopPropagation()}>
                <SpeakerButton text={word.word} label={`Hear “${word.word}”`} />
              </div>
            </div>
            <div className="flashcard__face flashcard__face--back">
              <span className="flashcard__hint">Meaning</span>
              <p style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{word.gloss}</p>
              <Npr npr={word.npr} />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} onClick={(event) => event.stopPropagation()}>
                <SpeakerButton text={word.word} label="Hear it again" />
                <button
                  type="button"
                  className={`known-btn ${known ? 'known-btn--on' : ''}`}
                  aria-pressed={known}
                  onClick={() => progressActions.toggleKnown(word.id)}
                >
                  {known ? '✓ I know this' : '☆ I know this'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flash-controls">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => go(-1)}>
            ← Previous
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setFlipped((value) => !value)}>
            {flipped ? 'Show word' : 'Flip card'}
          </button>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => go(1)}>
            Next →
          </button>
          <button
            type="button"
            className="btn btn--sm btn--sun"
            onClick={() => {
              setMixed((value) => !value);
              setIndex(0);
              setFlipped(false);
            }}
          >
            🔀 Shuffle
          </button>
        </div>

        <div style={{ width: 'min(100%, 520px)' }}>
          <ProgressBar value={index + 1} max={deck.length} />
          <p className="record-note" style={{ textAlign: 'center', marginTop: 6 }}>
            {known ? 'You have marked this word as known. ⭐' : 'Mark words you know to grow your progress.'}
          </p>
        </div>
      </div>
    </div>
  );
}
