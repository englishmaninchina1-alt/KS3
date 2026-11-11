import { allWords, categories, totalWords } from '../data';
import { games } from '../games/registry';
import { useProgress } from '../lib/storage';
import { levelFor, plural } from '../lib/utils';
import { ProgressBar, SpeakerButton, Stat, Npr } from '../components/Bits';
import { TopicCard } from '../components/TopicCard';

export default function Home() {
  const progress = useProgress();
  const known = Object.keys(progress.known).length;
  const { level, title, into, need } = levelFor(progress.xp);
  const plays = Object.values(progress.games).reduce((total, game) => total + game.plays, 0);

  const dayIndex = Math.floor(Date.now() / 86_400_000) % allWords.length;
  const wordOfDay = allWords[dayIndex];
  const featuredGames = games.slice(0, 4);

  return (
    <div>
      <section className="hero">
        <div>
          <span className="eyebrow">🇬🇧 UK KS3 · Ages 11–14</span>
          <h1>
            Make English your <span>superpower</span>
          </h1>
          <p className="hero__lead">
{totalWords} words across {categories.length} topics, nine games, a pronunciation studio
            and an AI story coach. Hear every word, learn how to say it with Natural Phonetic
            Respelling, then record yourself and listen back.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#/topics">
              🚀 Start learning
            </a>
            <a className="btn btn--sun" href="#/games">
              🎮 Play a game
            </a>
            <a className="btn btn--ghost" href="#/pronounce">
              🎙️ Say it
            </a>
          </div>
        </div>
        <div className="hero__art" aria-hidden="true">
          <div className="hero__orb">📚</div>
          <div className="chip-float chip-float--1">
            confident<span>KON-fuh-duhnt</span>
          </div>
          <div className="chip-float chip-float--2">
            species<span>SPEE-sheez</span>
          </div>
          <div className="chip-float chip-float--3">
            journey<span>JUR-nee</span>
          </div>
          <div className="chip-float chip-float--4">
            recycle<span>ree-SY-kuhl</span>
          </div>
          <div className="hero__note">Tap 🔊 anywhere to hear a word</div>
        </div>
      </section>

      <div className="stat-row">
        <Stat emoji="⚡" value={progress.xp} label="XP earned" />
        <Stat emoji="✅" value={`${known}/${totalWords}`} label="Words known" />
        <Stat emoji="🔥" value={`${progress.streak} ${plural(progress.streak, 'day')}`} label="Daily streak" />
        <Stat emoji="🎮" value={plays} label="Games played" />
      </div>

      <section className="section">
        <div className="guide-grid">
          <div className="panel">
            <p className="quiz-prompt">Word of the day</p>
            <h2 style={{ fontSize: '2rem', margin: '0 0 4px' }}>{wordOfDay.word}</h2>
            <Npr npr={wordOfDay.npr} />
            <p className="gloss" style={{ margin: '10px 0 16px' }}>
              {wordOfDay.gloss}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <SpeakerButton text={wordOfDay.word} label={`Hear “${wordOfDay.word}”`} />
              <a className="btn btn--sm btn--ghost" href={`#/pronounce?topic=${wordOfDay.categoryId}&word=${wordOfDay.id}`}>
                Practise saying it
              </a>
            </div>
          </div>

          <div className="panel panel--tint">
            <p className="quiz-prompt">Your level</p>
            <div className="level-card" style={{ marginTop: 6 }}>
              <div
                className="level-ring"
                style={{ '--pct': Math.round((into / need) * 100) } as React.CSSProperties}
              >
                <div className="level-ring__inner">
                  <div>
                    <div className="level-ring__num">{level}</div>
                    <div className="level-ring__label">Level</div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <h3 style={{ margin: '0 0 4px' }}>{title}</h3>
                <p className="gloss" style={{ marginBottom: 10 }}>
                  {need - into} XP until level {level + 1}
                </p>
                <ProgressBar value={into} max={need} />
                <a className="btn btn--sm btn--primary" href="#/progress" style={{ marginTop: 14 }}>
                  See my progress
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2>Pick a topic</h2>
            <p>{categories.length} topic worlds, 50 words each — every one with audio and a respelling.</p>
          </div>
          <a className="btn btn--sm btn--ghost" href="#/topics">
            All {categories.length} topics →
          </a>
        </div>
        <div className="topic-grid">
          {categories.slice(0, 6).map((category) => (
            <TopicCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2>Jump into a game</h2>
            <p>Every game uses the same vocabulary, so practise feels like play.</p>
          </div>
          <a className="btn btn--sm btn--ghost" href="#/games">
            All {games.length} games →
          </a>
        </div>
        <div className="game-grid">
          {featuredGames.map((game) => (
            <a
              key={game.id}
              className="game-card"
              href={`#/play/${game.id}`}
              style={{ '--c1': game.colours[0], '--c2': game.colours[1] } as React.CSSProperties}
            >
              <div className="game-card__emoji" aria-hidden="true">
                {game.emoji}
              </div>
              <h3>{game.title}</h3>
              <p>{game.blurb}</p>
              <span className="game-card__tag">{game.skill}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="panel" style={{ display: 'grid', gap: 22, gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Pronunciation studio</span>
            <h2>Say it, record it, hear the difference</h2>
            <p style={{ color: '#5f5688' }}>
              Natural Phonetic Respelling shows you exactly where the strong beat falls, using letters
              you already know — no strange symbols. Listen to a British voice, record your own, and
              compare them side by side.
            </p>
            <ul className="tip-list">
              <li>
                <span aria-hidden="true">🔊</span>
                <span>
                  <strong>Hear it</strong> at normal speed, or slow it right down.
                </span>
              </li>
              <li>
                <span aria-hidden="true">🎚️</span>
                <span>
                  <strong>See the beat</strong> — CAPITAL letters are the stressed syllable.
                </span>
              </li>
              <li>
                <span aria-hidden="true">🎙️</span>
                <span>
                  <strong>Record</strong> yourself and play it back straight away.
                </span>
              </li>
            </ul>
            <a className="btn btn--pink" href="#/pronounce" style={{ marginTop: 18 }}>
              Open the studio
            </a>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <p className="quiz-prompt">Try this one</p>
            <h3 style={{ fontSize: '1.9rem', marginBottom: 2 }}>environment</h3>
            <Npr npr="in-VY-ruhn-muhnt" />
            <p className="gloss" style={{ marginTop: 8 }}>
              The natural world around us.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <SpeakerButton text="environment" label="Hear environment" />
              <SpeakerButton text="environment" slow label="Hear environment slowly" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="panel story-promo">
          <div>
            <span className="eyebrow" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
              ✍️ New · AI story coach
            </span>
            <h2>Build a story with Coach Maple</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.92)', maxWidth: '62ch' }}>
              Plan a character, a place and a big problem, then get friendly coaching one question at
              a time. Coach Maple helps you find the words — the story stays yours.
            </p>
            <a className="btn btn--sun" href="#/story">
              🦉 Meet Coach Maple
            </a>
          </div>
          <div className="story-promo__owl" aria-hidden="true">
            🦉
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2>How WordLab works</h2>
            <p>Three steps, about ten minutes a day.</p>
          </div>
        </div>
        <div className="guide-grid">
          <div className="card">
            <div className="step">
              <span className="step-num">1</span>
              <div>
                <h3>Meet the words</h3>
                <p>Open a topic, hear each word and read its respelling and meaning.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="step">
              <span className="step-num">2</span>
              <div>
                <h3>Play to remember</h3>
                <p>Quizzes, word searches and memory games lock the words into your memory.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="step">
              <span className="step-num">3</span>
              <div>
                <h3>Say it out loud</h3>
                <p>Record yourself in the studio and build real speaking confidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <a
          className="teacher-cta"
          href="https://preply.com/en/?pref=MjA1MDc3OTA=&id=1793560453.016828&ep=w1"
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          <span className="teacher-cta__emoji" aria-hidden="true">
            🧑‍🏫
          </span>
          <span className="teacher-cta__text">
            <span className="eyebrow">Live 1-to-1 lessons</span>
            <strong>To learn with human teachers and save 30% on your first lesson</strong>
            <span className="teacher-cta__note">
              Opens Preply in a new tab. WordLab stays free.
            </span>
          </span>
          <span className="teacher-cta__arrow" aria-hidden="true">
            →
          </span>
        </a>
      </section>
    </div>
  );
}
