import { useMemo, useState } from 'react';
import type { Category } from '../data';
import { games } from '../games/registry';
import { progressActions, useProgress } from '../lib/storage';
import { plural } from '../lib/utils';
import { WordCard } from '../components/WordCard';

type Tab = 'learn' | 'games';

export default function TopicDetail({
  category,
  initialTab,
}: {
  category: Category;
  initialTab?: string | null;
}) {
  const [tab, setTab] = useState<Tab>(initialTab === 'games' ? 'games' : 'learn');
  const [query, setQuery] = useState('');
  const [hideKnown, setHideKnown] = useState(false);
  const progress = useProgress();

  const known = category.words.filter((word) => progress.known[word.id]).length;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return category.words.filter((word) => {
      if (hideKnown && progress.known[word.id]) return false;
      if (!term) return true;
      return (
        word.word.toLowerCase().includes(term) ||
        word.gloss.toLowerCase().includes(term) ||
        word.npr.toLowerCase().includes(term)
      );
    });
  }, [category.words, hideKnown, progress.known, query]);

  return (
    <div>
      <div
        className="topic-hero"
        style={
          {
            '--c1': category.colours[0],
            '--c2': category.colours[1],
          } as React.CSSProperties
        }
      >
        <div className="topic-hero__emoji" aria-hidden="true">
          {category.emoji}
        </div>
        <div style={{ flex: '1 1 320px' }}>
          <h1>{category.title}</h1>
          <p>{category.tagline}</p>
        </div>
        <div className="topic-hero__meta">
          <strong>{known}/{category.words.length}</strong>
          <span style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            words known
          </span>
          <div className="bar">
            <div
              className="bar__fill"
              style={{ width: `${Math.round((known / category.words.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="ks3-note">
        <span aria-hidden="true">🎓</span>
        <span>
          <strong>KS3 link:</strong> {category.ks3}
        </span>
      </div>

      <div className="toolbar">
        <div className="tabs" role="tablist" aria-label="Topic sections">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'learn'}
            className={`tab ${tab === 'learn' ? 'tab--active' : ''}`}
            onClick={() => setTab('learn')}
          >
            📖 Learn the words
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'games'}
            className={`tab ${tab === 'games' ? 'tab--active' : ''}`}
            onClick={() => setTab('games')}
          >
            🎮 Play with these words
          </button>
        </div>
        <a className="btn btn--sm btn--pink" href={`#/pronounce?topic=${category.id}`}>
          🎙️ Pronunciation studio
        </a>
      </div>

      {tab === 'learn' ? (
        <>
          <div className="toolbar" style={{ marginTop: 0 }}>
            <label className="search">
              <span aria-hidden="true">🔍</span>
              <span className="sr-only">Search these words</span>
              <input
                type="search"
                placeholder={`Search ${category.title.toLowerCase()} words…`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`chip ${hideKnown ? 'chip--active' : ''}`}
                aria-pressed={hideKnown}
                onClick={() => setHideKnown((value) => !value)}
              >
                {hideKnown ? '👁️ Showing unlearned' : '🙈 Hide words I know'}
              </button>
              <button
                type="button"
                className="chip"
                onClick={() => category.words.forEach((word) => progressActions.markKnown(word.id))}
              >
                ✅ Mark all as known
              </button>
            </div>
          </div>

          <p style={{ fontWeight: 800, color: '#5f5688', fontSize: '0.86rem' }}>
            {filtered.length} {plural(filtered.length, 'word')} shown
          </p>

          {filtered.length === 0 ? (
            <div className="panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem' }} aria-hidden="true">
                🌟
              </div>
              <h2>You know these words!</h2>
              <p style={{ color: '#5f5688' }}>
                Nothing left to show with these filters. Try turning off “Hide words I know”, or jump
                into a game.
              </p>
              <button type="button" className="btn btn--primary" onClick={() => setHideKnown(false)}>
                Show all words
              </button>
            </div>
          ) : (
            <div className="word-grid">
              {filtered.map((word) => (
                <WordCard key={word.id} word={word} />
              ))}
            </div>
          )}

          <div className="panel panel--tint" style={{ marginTop: 26 }}>
            <div className="step">
              <span className="step-num" aria-hidden="true">
                🎙️
              </span>
              <div>
                <h3>Ready to say them out loud?</h3>
                <p style={{ marginBottom: 12 }}>
                  The studio gives you a big respelling, a slow audio model and a recorder so you can
                  compare your voice with the British English model.
                </p>
                <a className="btn btn--sm btn--pink" href={`#/pronounce?topic=${category.id}`}>
                  Open the pronunciation studio
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p style={{ color: '#5f5688', fontWeight: 700 }}>
            All nine games will use words from <strong>{category.title}</strong>.
          </p>
          <div className="game-grid">
            {games.map((game) => (
              <a
                key={game.id}
                className="game-card"
                href={`#/play/${game.id}?topic=${category.id}`}
                style={{ '--c1': game.colours[0], '--c2': game.colours[1] } as React.CSSProperties}
              >
                <div className="game-card__emoji" aria-hidden="true">
                  {game.emoji}
                </div>
                <h3>{game.title}</h3>
                <p>{game.blurb}</p>
                <span className="game-card__tag">
                  {game.skill} · {game.minutes}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
