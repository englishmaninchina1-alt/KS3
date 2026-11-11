import { useEffect, useMemo, useState } from 'react';
import { getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { playCorrect, playWin, playWrong } from '../lib/sfx';
import { makeChoiceQuestion, poolFor } from './helpers';
import { GameHeader, GameResult, HudItem } from '../components/Bits';

const SECONDS = 60;

export default function SpeedGame({ topicId, onExit }: { topicId: string; onExit: () => void }) {
  const category = getCategory(topicId);
  const pool = useMemo(() => poolFor(topicId), [topicId]);
  const progress = useProgress();

  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready');
  const [timeLeft, setTimeLeft] = useState(SECONDS);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(() => makeChoiceQuestion(pool, 'word'));
  const [flash, setFlash] = useState<'right' | 'wrong' | null>(null);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      const earned = score * 5 + 10;
      setXp(earned);
      progressActions.addXp(earned);
      progressActions.recordGame('speed', score);
      setPhase('over');
      playWin(progress.soundOn);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phase, progress.soundOn, score, timeLeft]);

  const answer = (option: string) => {
    if (phase !== 'playing' || flash) return;
    const isCorrect = option === question.answer;
    setFlash(isCorrect ? 'right' : 'wrong');
    if (isCorrect) setScore((value) => value + 1);
    progressActions.recordAnswer(question.word.id, isCorrect);
    if (isCorrect) playCorrect(progress.soundOn);
    else playWrong(progress.soundOn);
    window.setTimeout(() => {
      setFlash(null);
      setQuestion(makeChoiceQuestion(pool, 'word'));
    }, 280);
  };

  const start = () => {
    setScore(0);
    setTimeLeft(SECONDS);
    setFlash(null);
    setQuestion(makeChoiceQuestion(pool, 'word'));
    setPhase('playing');
  };

  if (phase === 'ready') {
    return (
      <div className="game-shell">
        <GameHeader
          emoji="⏱️"
          title="Beat the Clock"
          subtitle={category ? `${category.emoji} ${category.title}` : '🌍 Words from every topic'}
          onExit={onExit}
        />
        <div className="panel" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem' }} aria-hidden="true">
            ⏱️
          </div>
          <h2>Sixty seconds. How many can you match?</h2>
          <p style={{ color: '#5f5688' }}>
            A meaning appears, and you choose the word that matches it. There is no penalty for a wrong
            answer, so keep going!
          </p>
          <button type="button" className="btn btn--primary" onClick={start} style={{ fontSize: '1.1rem', padding: '16px 30px' }}>
            ▶ Start the clock
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'over') {
    return (
      <div className="game-shell">
        <GameResult
          emoji="⏱️"
          title="Time's up!"
          score={score}
          stars={score >= 18 ? 3 : score >= 10 ? 2 : 1}
          xp={xp}
          message={`You matched ${score} ${score === 1 ? 'word' : 'words'} in sixty seconds. Speedy!`}
          onReplay={start}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <GameHeader
        emoji="⏱️"
        title="Beat the Clock"
        subtitle={category ? `${category.emoji} ${category.title}` : '🌍 Words from every topic'}
        onExit={onExit}
        hud={
          <>
            <HudItem label="Time" value={`${timeLeft}s`} />
            <HudItem label="Score" value={score} />
          </>
        }
      />

      <div className="timer-bar">
        <div className="timer-bar__fill" style={{ width: `${(timeLeft / SECONDS) * 100}%` }} />
      </div>

      <div className="panel quiz-card">
        <p className="quiz-prompt">Which word means…</p>
        <p className="quiz-question" style={{ minHeight: '3.2em' }}>
          {question.word.gloss}
        </p>

        <div
          className="feedback"
          style={{
            minHeight: 48,
            visibility: flash ? 'visible' : 'hidden',
            background: flash === 'right' ? '#f0fdf4' : '#fff1f2',
            border: `1px solid ${flash === 'right' ? '#bbf7d0' : '#fecdd3'}`,
            color: flash === 'right' ? '#14532d' : '#9f1239',
            marginTop: 8,
          }}
        >
          {flash === 'right' ? '✅ Yes!' : `💡 It was “${question.word.word}”`}
        </div>

        <div className="option-grid">
          {question.options.map((option) => (
            <button key={option} type="button" className="option" onClick={() => answer(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
