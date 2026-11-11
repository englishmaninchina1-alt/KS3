import { useEffect, useMemo, useState } from 'react';
import { getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { speak } from '../lib/speech';
import { playCorrect, playWin, playWrong } from '../lib/sfx';
import { poolFor } from './helpers';
import { sample, shuffle, starsFor } from '../lib/utils';
import { GameHeader, GameResult, HudItem, Npr, SpeakerButton } from '../components/Bits';
import type { WordEntry } from '../data';

const ROUNDS = 8;

interface Round {
  word: WordEntry;
  options: string[];
}

export default function ListenGame({ topicId, onExit }: { topicId: string; onExit: () => void }) {
  const pool = useMemo(() => poolFor(topicId), [topicId]);
  const category = getCategory(topicId);
  const progress = useProgress();

  const [rounds] = useState<Round[]>(() => {
    const picked = sample(pool, ROUNDS);
    return picked.map((word) => {
      const others = sample(pool.filter((entry) => entry.id !== word.id && entry.word !== word.word), 3);
      return { word, options: shuffle([word.word, ...others.map((entry) => entry.word)]) };
    });
  });

  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xp, setXp] = useState(0);

  const current = rounds[round];
  const answered = selected !== null;

  useEffect(() => {
    if (!progress.soundOn) return;
    const timer = window.setTimeout(() => speak(current.word.word, { rate: 0.85 }), 350);
    return () => window.clearTimeout(timer);
  }, [current.word.word, progress.soundOn]);

  const choose = (option: string) => {
    if (answered) return;
    setSelected(option);
    const isCorrect = option === current.word.word;
    if (isCorrect) setScore((value) => value + 1);
    progressActions.recordAnswer(current.word.id, isCorrect);
    if (isCorrect) playCorrect(progress.soundOn);
    else playWrong(progress.soundOn);
  };

  const next = () => {
    if (round + 1 >= rounds.length) {
      const earned = score * 10 + 15;
      setXp(earned);
      progressActions.addXp(earned);
      progressActions.recordGame('listen', score);
      setFinished(true);
      playWin(progress.soundOn);
      return;
    }
    setRound((value) => value + 1);
    setSelected(null);
  };

  if (finished) {
    return (
      <div className="game-shell">
        <GameResult
          emoji="🎧"
          title="Listening complete"
          score={score}
          total={rounds.length}
          stars={starsFor(score, rounds.length)}
          xp={xp}
          message="Listen again whenever you like — repetition builds real listening confidence."
          onReplay={() => window.location.reload()}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <GameHeader
        emoji="🎧"
        title="Listen & Choose"
        subtitle={category ? `${category.emoji} ${category.title}` : '🌍 Words from every topic'}
        onExit={onExit}
        hud={
          <>
            <HudItem label="Round" value={`${round + 1}/${rounds.length}`} />
            <HudItem label="Score" value={score} />
          </>
        }
      />

      <div className="panel quiz-card" style={{ textAlign: 'center' }}>
        <p className="quiz-prompt">Listen, then choose the spelling you heard</p>

        <div style={{ margin: '10px 0 4px' }}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => speak(current.word.word, { rate: 0.85 })}
            style={{ fontSize: '1.1rem', padding: '18px 28px' }}
          >
            🔊 Play the word
          </button>
        </div>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => speak(current.word.word, { rate: 0.55 })}
        >
          🐢 Play it slowly
        </button>

        <div className="option-grid" style={{ textAlign: 'left' }}>
          {current.options.map((option) => {
            const isAnswer = option === current.word.word;
            const isChosen = option === selected;
            const className = answered
              ? isAnswer
                ? 'option option--correct'
                : isChosen
                  ? 'option option--wrong'
                  : 'option'
              : 'option';
            return (
              <button
                key={option}
                type="button"
                className={className}
                onClick={() => choose(option)}
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div className={`feedback ${selected === current.word.word ? 'feedback--good' : 'feedback--bad'}`} style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <strong>{current.word.word}</strong>
                <Npr npr={current.word.npr} small />
                <SpeakerButton text={current.word.word} label="Hear it again" />
              </div>
              <div style={{ marginTop: 6 }}>{current.word.gloss}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="btn btn--primary" onClick={next}>
                {round + 1 >= rounds.length ? 'See my score →' : 'Next word →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
