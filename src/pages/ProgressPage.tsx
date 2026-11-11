import { categories, totalWords } from '../data';
import { games } from '../games/registry';
import { progressActions, useProgress } from '../lib/storage';
import { levelFor } from '../lib/utils';
import { ProgressBar, Stat } from '../components/Bits';

export default function ProgressPage() {
  const progress = useProgress();
  const { level, title, into, need } = levelFor(progress.xp);
  const known = Object.keys(progress.known).length;
  const played = Object.values(progress.games).reduce((total, game) => total + game.plays, 0);
  const bestTopic = [...categories].sort(
    (a, b) =>
      b.words.filter((word) => progress.known[word.id]).length -
      a.words.filter((word) => progress.known[word.id]).length,
  )[0];

  const badges = [
    { emoji: '🌱', name: 'First Steps', desc: 'Earn your first XP', earned: progress.xp > 0 },
    {
      emoji: '📚',
      name: 'Word Collector',
      desc: 'Know 50 words',
      earned: known >= 50,
    },
    {
      emoji: '🏅',
      name: 'Topic Champion',
      desc: 'Know every word in one topic',
      earned: categories.some((category) => category.words.every((word) => progress.known[word.id])),
    },
    {
      emoji: '🔎',
      name: 'Grid Detective',
      desc: 'Finish a word search',
      earned: Boolean(progress.games['word-search']),
    },
    {
      emoji: '🎯',
      name: 'Perfect Ten',
      desc: 'Score 10/10 in Quick Quiz',
      earned: (progress.games.quiz?.best ?? 0) >= 10,
    },
    {
      emoji: '⏱️',
      name: 'Speed Reader',
      desc: 'Score 15+ in Beat the Clock',
      earned: (progress.games.speed?.best ?? 0) >= 15,
    },
    {
      emoji: '🧠',
      name: 'Memory Master',
      desc: 'Finish Memory Match',
      earned: Boolean(progress.games.memory),
    },
    {
      emoji: '🐝',
      name: 'Spelling Star',
      desc: 'Score 6+ in Spelling Bee',
      earned: (progress.games.spelling?.best ?? 0) >= 6,
    },
    {
      emoji: '🎙️',
      name: 'Brave Speaker',
      desc: 'Make your first recording',
      earned: progress.recordings > 0,
    },
    { emoji: '🔥', name: 'On a Roll', desc: 'Reach a 3-day streak', earned: progress.streak >= 3 },
    { emoji: '🏆', name: 'Word Titan', desc: 'Know 300 words', earned: known >= 300 },
    { emoji: '🌟', name: 'Rising Star', desc: 'Reach level 5', earned: level >= 5 },
  ];

  const earnedBadges = badges.filter((badge) => badge.earned).length;

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">📈 My progress</span>
        <h1>Look how far you have come</h1>
        <p>
          Everything is saved on this device only. No account, no email, no data sent anywhere — just
          your words and your XP.
        </p>
      </div>

      <div className="panel">
        <div className="level-card">
          <div className="level-ring" style={{ '--pct': Math.round((into / need) * 100) } as React.CSSProperties}>
            <div className="level-ring__inner">
              <div>
                <div className="level-ring__num">{level}</div>
                <div className="level-ring__label">Level</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p className="quiz-prompt" style={{ marginBottom: 2 }}>
              {title}
            </p>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.6rem' }}>{progress.xp} XP</h2>
            <ProgressBar value={into} max={need} />
            <p className="record-note" style={{ marginTop: 6 }}>
              {need - into} XP until level {level + 1}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a className="btn btn--sm btn--primary" href={`#/topic/${bestTopic.id}`}>
              Continue with {bestTopic.emoji} {bestTopic.title}
            </a>
            <a className="btn btn--sm btn--sun" href="#/games">
              Play a game
            </a>
          </div>
        </div>
      </div>

      <div className="stat-row" style={{ marginTop: 18 }}>
        <Stat emoji="✅" value={`${known}/${totalWords}`} label="Words known" />
        <Stat emoji="🔥" value={progress.streak} label="Day streak" />
        <Stat emoji="🎮" value={played} label="Games played" />
        <Stat emoji="🎙️" value={progress.recordings} label="Recordings" />
      </div>

      <section className="section">
        <div className="section__head">
          <div>
            <h2>Topic mastery</h2>
            <p>Mark words as known by tapping the star on any word card.</p>
          </div>
        </div>
        <div className="card">
          {categories.map((category) => {
            const count = category.words.filter((word) => progress.known[word.id]).length;
            return (
              <div className="progress-row" key={category.id}>
                <a className="progress-row__name" href={`#/topic/${category.id}`}>
                  <span aria-hidden="true">{category.emoji}</span> {category.title}
                </a>
                <ProgressBar
                  value={count}
                  max={category.words.length}
                  c1={category.colours[0]}
                  c2={category.colours[1]}
                />
                <span className="progress-row__value">
                  {count}/{category.words.length}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2>Badges</h2>
            <p>
              {earnedBadges} of {badges.length} earned
            </p>
          </div>
        </div>
        <div className="badge-grid">
          {badges.map((badge) => (
            <div key={badge.name} className={`badge ${badge.earned ? 'badge--earned' : ''}`}>
              <div className="badge__emoji" aria-hidden="true">
                {badge.emoji}
              </div>
              <div className="badge__name">{badge.name}</div>
              <div className="badge__desc">{badge.desc}</div>
              <div className="badge__desc">{badge.earned ? 'Unlocked' : 'Locked'}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2>Game best scores</h2>
            <p>Beat your own record — that is what champions do.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Game</th>
                <th scope="col">Plays</th>
                <th scope="col">Best score</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => {
                const stat = progress.games[game.id];
                return (
                  <tr key={game.id}>
                    <th scope="row" style={{ background: 'transparent', fontFamily: 'inherit' }}>
                      <span aria-hidden="true">{game.emoji}</span> {game.title}
                    </th>
                    <td>{stat?.plays ?? 0}</td>
                    <td>{stat ? stat.best : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 4px' }}>Start fresh</h3>
            <p className="record-note" style={{ margin: 0 }}>
              This clears XP, known words, badges and best scores on this device. It cannot be undone.
            </p>
          </div>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              if (window.confirm('Reset all progress on this device? This cannot be undone.')) {
                progressActions.reset();
              }
            }}
          >
            Reset my progress
          </button>
        </div>
      </section>
    </div>
  );
}
