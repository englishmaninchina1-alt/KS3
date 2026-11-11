import { useMemo, useState } from 'react';
import { getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { playCorrect, playWin, playWrong } from '../lib/sfx';
import { poolFor } from './helpers';
import { sample, scramble, starsFor } from '../lib/utils';
import { GameHeader, GameResult, HudItem, Npr, SpeakerButton } from '../components/Bits';

const ROUNDS = 8;

export default function ScrambleGame({ topicId, onExit }: { topicId: string; onExit: () => void }) {
  const pool = useMemo(() => poolFor(topicId), [topicId]);
  const category = getCategory(topicId);
  const progress = useProgress();

  const [words] = useState(() => sample(pool, ROUNDS));
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xp, setXp] = useState(0);

  const word = words[round];
  const letters = useMemo(() => scramble(word.word).toUpperCase().split(''), [word.word]);

  const answer = picked.map((index) => letters[index]).join('');
  const complete = picked.length === letters.length;

  const check = () => {
    if (!complete || status !== 'idle') return;
    const isCorrect = answer.toLowerCase() === word.word.toLowerCase();
    setStatus(isCorrect ? 'right' : 'wrong');
    if (isCorrect) {
      setScore((value) => value + 1);
      playCorrect(progress.soundOn);
    } else {
      playWrong(progress.soundOn);
    }
    progressActions.recordAnswer(word.id, isCorrect);
    if (isCorrect) progressActions.markKnown(word.id);
  };

  const next = () => {
    if (round + 1 >= words.length) {
      const earned = score * 10 + 15;
      setXp(earned);
      progressActions.addXp(earned);
      progressActions.recordGame('scramble', score);
      setFinished(true);
      playWin(progress.soundOn);
      return;
    }
    setRound((value) => value + 1);
    setPicked([]);
    setStatus('idle');
  };

  if (finished) {
    return (
      <div className="game-shell">
        <GameResult
          emoji="🔀"
          title="Scramble solved"
          score={score}
          total={words.length}
          stars={starsFor(score, words.length)}
          xp={xp}
          message="Letter by letter, your spelling is getting stronger."
          onReplay={() => window.location.reload()}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <GameHeader
        emoji="🔀"
        title="Letter Scramble"
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
        <div style={{ textAlign: 'center' }}>
          <p className="quiz-prompt">Unscramble the letters</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Npr npr={word.npr} />
            <SpeakerButton text={word.word} label={`Hear “${word.word}”`} />
          </div>
          <p className="gloss" style={{ marginTop: 8 }}>
            {word.gloss}
          </p>
        </div>

        <div
          className={`answer-strip ${
            status === 'right' ? 'answer-strip--correct' : status === 'wrong' ? 'answer-strip--wrong' : ''
          }`}
        >
          {picked.length === 0 && <span className="answer-placeholder">Tap the letters in the right order…</span>}
          {picked.map((letterIndex, position) => (
            <button
              key={`${letterIndex}-${position}`}
              type="button"
              className="letter-tile"
              onClick={() => {
                if (status !== 'idle') return;
                setPicked((value) => value.filter((_, index) => index !== position));
              }}
              aria-label={`Remove letter ${letters[letterIndex]}`}
            >
              {letters[letterIndex]}
            </button>
          ))}
        </div>

        <div className="tile-row">
          {letters.map((letter, index) => {
            const used = picked.includes(index);
            return (
              <button
                key={`${letter}-${index}`}
                type="button"
                className={`letter-tile ${used ? 'letter-tile--used' : ''}`}
                disabled={used || status !== 'idle'}
                onClick={() => setPicked((value) => [...value, index])}
                aria-label={`Letter ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {status === 'right' && (
          <div className="feedback feedback--good" style={{ textAlign: 'center' }}>
            ✅ Brilliant! <strong>{word.word}</strong> is correct. <Npr npr={word.npr} small />
          </div>
        )}
        {status === 'wrong' && (
          <div className="feedback feedback--bad" style={{ textAlign: 'center' }}>
            💡 Not quite — the word is <strong>{word.word}</strong>. Listen to it again and check the
            respelling.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            disabled={picked.length === 0}
            onClick={() => setPicked([])}
          >
            Clear
          </button>
          {status === 'idle' ? (
            <button type="button" className="btn btn--primary" disabled={!complete} onClick={check}>
              Check my answer
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={next}>
              {round + 1 >= words.length ? 'See my score →' : 'Next word →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
