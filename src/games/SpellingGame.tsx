import { useEffect, useMemo, useRef, useState } from 'react';
import { getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { playCorrect, playWin, playWrong } from '../lib/sfx';
import { speak } from '../lib/speech';
import { poolFor } from './helpers';
import { sample, starsFor } from '../lib/utils';
import { GameHeader, GameResult, HudItem, Npr, SpeakerButton } from '../components/Bits';

const ROUNDS = 8;

export default function SpellingGame({ topicId, onExit }: { topicId: string; onExit: () => void }) {
  const category = getCategory(topicId);
  const pool = useMemo(() => poolFor(topicId), [topicId]);
  const progress = useProgress();

  const [words] = useState(() => sample(pool, ROUNDS));
  const [round, setRound] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [xp, setXp] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const word = words[round];
  const letterCount = word.word.replace(/[^A-Za-z]/g, '').length;

  useEffect(() => {
    setValue('');
    setStatus('idle');
    setShowHint(false);
    inputRef.current?.focus();
  }, [round]);

  const check = () => {
    if (status !== 'idle' || !value.trim()) return;
    const isCorrect = value.trim().toLowerCase() === word.word.toLowerCase();
    setStatus(isCorrect ? 'right' : 'wrong');
    if (isCorrect) {
      setScore((current) => current + 1);
      progressActions.markKnown(word.id);
      playCorrect(progress.soundOn);
    } else {
      playWrong(progress.soundOn);
    }
    progressActions.recordAnswer(word.id, isCorrect);
  };

  const next = () => {
    if (round + 1 >= words.length) {
      const earned = score * 10 + 20;
      setXp(earned);
      progressActions.addXp(earned);
      progressActions.recordGame('spelling', score);
      setFinished(true);
      playWin(progress.soundOn);
      return;
    }
    setRound((current) => current + 1);
  };

  if (finished) {
    return (
      <div className="game-shell">
        <GameResult
          emoji="🐝"
          title="Spelling Bee finished"
          score={score}
          total={words.length}
          stars={starsFor(score, words.length)}
          xp={xp}
          message="Careful spelling is a superpower — especially in exams. Bee proud of your score!"
          onReplay={() => window.location.reload()}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <GameHeader
        emoji="🐝"
        title="Spelling Bee"
        subtitle={category ? `${category.emoji} ${category.title}` : '🌍 Words from every topic'}
        onExit={onExit}
        hud={
          <>
            <HudItem label="Word" value={`${round + 1}/${words.length}`} />
            <HudItem label="Score" value={score} />
          </>
        }
      />

      <div className="panel quiz-card">
        <p className="quiz-prompt">Listen to the word, read the clue, then type it</p>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
          <SpeakerButton text={word.word} label={`Hear “${word.word}”`} />
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={() => speakWord(word.word)}
          >
            🐢 Slowly
          </button>
          <span className="chip">🔤 {letterCount} letters</span>
          <span className="chip">🏷️ {word.pos}</span>
        </div>

        <p className="quiz-question">{word.gloss}</p>

        {showHint && (
          <div className="hint-box" style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span>
              Starts with <strong>{word.word.charAt(0).toUpperCase()}</strong> · ends with{' '}
              <strong>{word.word.charAt(word.word.length - 1)}</strong>
            </span>
            <Npr npr={word.npr} small />
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (status === 'idle') check();
            else next();
          }}
          style={{ marginTop: 16 }}
        >
          <label className="sr-only" htmlFor="spelling-answer">
            Type the word you heard
          </label>
          <input
            id="spelling-answer"
            ref={inputRef}
            className="search"
            style={{ maxWidth: '100%', fontSize: '1.15rem', fontWeight: 700 }}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Type the word…"
            value={value}
            disabled={status !== 'idle'}
            onChange={(event) => setValue(event.target.value)}
          />

          {status === 'right' && (
            <div className="feedback feedback--good">
              ✅ Beautifully spelled! <strong>{word.word}</strong>
            </div>
          )}
          {status === 'wrong' && (
            <div className="feedback feedback--bad">
              💡 The correct spelling is <strong>{word.word}</strong>. <Npr npr={word.npr} small /> —{' '}
              {word.gloss}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => setShowHint(true)}
              disabled={showHint || status !== 'idle'}
            >
              💡 Hint
            </button>
            {status === 'idle' ? (
              <button type="submit" className="btn btn--primary" disabled={!value.trim()}>
                Check spelling
              </button>
            ) : (
              <button type="submit" className="btn btn--primary">
                {round + 1 >= words.length ? 'See my score →' : 'Next word →'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function speakWord(word: string) {
  speak(word, { rate: 0.5 });
}
