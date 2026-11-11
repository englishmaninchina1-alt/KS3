import { useMemo, useState } from 'react';
import { categories, totalWords } from '../data';
import { TopicCard } from '../components/TopicCard';
import { ProgressBar } from '../components/Bits';
import { useProgress } from '../lib/storage';

export default function Topics() {
  const [query, setQuery] = useState('');
  const progress = useProgress();
  const known = Object.keys(progress.known).length;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter(
      (category) =>
        category.title.toLowerCase().includes(term) ||
        category.tagline.toLowerCase().includes(term) ||
        category.words.some((word) => word.word.toLowerCase().includes(term)),
    );
  }, [query]);

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">📚 Vocabulary library</span>
        <h1>Topic worlds</h1>
        <p>
          Twelve topics, each with fifty carefully chosen words for Key Stage 3. Every entry includes a
          child-friendly meaning, a Natural Phonetic Respelling and a British English audio model.
        </p>
      </div>

      <div className="panel" style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p className="quiz-prompt" style={{ marginBottom: 4 }}>
              Your word bank
            </p>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              {known} of {totalWords} words known
            </h2>
          </div>
          <a className="btn btn--sm btn--sun" href="#/progress">
            ⚡ View progress
          </a>
        </div>
        <ProgressBar value={known} max={totalWords} />
      </div>

      <div className="toolbar">
        <label className="search">
          <span aria-hidden="true">🔍</span>
          <span className="sr-only">Search topics or words</span>
          <input
            type="search"
            placeholder="Search topics or a word…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <span style={{ fontWeight: 800, color: '#5f5688', fontSize: '0.88rem' }}>
          {filtered.length} {filtered.length === 1 ? 'topic' : 'topics'}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }} aria-hidden="true">
            🕵️
          </div>
          <h2>No matches yet</h2>
          <p style={{ color: '#5f5688' }}>
            Nothing matched “{query}”. Try a shorter word, or browse all topics.
          </p>
          <button type="button" className="btn btn--primary" onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="topic-grid">
          {filtered.map((category) => (
            <TopicCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
