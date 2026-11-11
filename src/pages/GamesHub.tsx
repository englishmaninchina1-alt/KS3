import { useState } from 'react';
import { categories } from '../data';
import { games } from '../games/registry';
import { CategoryChips, ProgressBar } from '../components/Bits';
import { useProgress } from '../lib/storage';

export default function GamesHub() {
  const [topic, setTopic] = useState('all');
  const progress = useProgress();
  const played = Object.values(progress.games).reduce((total, game) => total + game.plays, 0);

  const query = topic === 'all' ? '' : `?topic=${topic}`;
  const chosen = categories.find((category) => category.id === topic);

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">🎮 Games arcade</span>
        <h1>Ten ways to play with words</h1>
        <p>
          Nine games plus the pronunciation studio. Every answer earns XP, and each game gets harder as
          your vocabulary grows. Pick a topic first, or mix all {categories.length} together.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <CategoryChips
          value={topic}
          onChange={setTopic}
          categories={categories}
          allowAll
          label="Playing with"
        />
        <p style={{ margin: '14px 0 0', fontSize: '0.86rem', color: '#5f5688', fontWeight: 700 }}>
          {topic === 'all'
            ? '🌍 All 600 words are in the mix — great for a challenge.'
            : `${chosen?.emoji} Using only ${chosen?.title} words.`}
        </p>
      </div>

      <div className="game-grid">
        {games.map((game) => {
          const href = `#/play/${game.id}${query}`;
          const stat = progress.games[game.id];
          return (
            <a
              key={game.id}
              className="game-card"
              href={href}
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
              {stat && (
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#5f5688' }}>
                  Played {stat.plays}× · best {stat.best}
                </span>
              )}
            </a>
          );
        })}

        <a
          className="game-card"
          href={`#/pronounce${query}`}
          style={{ '--c1': '#db2777', '--c2': '#f59e0b' } as React.CSSProperties}
        >
          <div className="game-card__emoji" aria-hidden="true">
            🎙️
          </div>
          <h3>Say It Studio</h3>
          <p>Hear the model, record your voice and listen back. The heart of pronunciation practice.</p>
          <span className="game-card__tag">Speaking · any time</span>
          {progress.recordings > 0 && (
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#5f5688' }}>
              {progress.recordings} recordings made
            </span>
          )}
        </a>
      </div>

      <div className="panel" style={{ marginTop: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p className="quiz-prompt" style={{ marginBottom: 4 }}>
              Arcade progress
            </p>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{played} games played</h2>
          </div>
          <span className="chip">⚡ {progress.xp} XP</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar value={played} max={30} />
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '0.82rem', color: '#5f5688' }}>
          Play thirty rounds to become an arcade regular. Every round adds XP to your level.
        </p>
      </div>
    </div>
  );
}
