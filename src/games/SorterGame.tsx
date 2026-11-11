import { useMemo, useState } from 'react';
import { categoryOf, categories, getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { playCorrect, playWin, playWrong } from '../lib/sfx';
import { poolFor } from './helpers';
import { sample, shuffle, starsFor } from '../lib/utils';
import { GameHeader, GameResult, HudItem, Npr, SpeakerButton } from '../components/Bits';

const ROUNDS = 10;

export default function SorterGame({ topicId, onExit }: { topicId: string; onExit: () => void }) {
  const pool = useMemo(() => poolFor(topicId), [topicId]);
  const progress = useProgress();

  const [words] = useState(() => sample(pool, ROUNDS));
  const [round, setRound] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xp, setXp] = useState(0);

  const word = words[round];
  const correctCategory = categoryOf(word);

  const options = useMemo(() => {
    const others = sample(
      categories.filter((category) => category.id !== correctCategory.id),
      3,
    );
    return shuffle([correctCategory, ...others]);
  }, [correctCategory]);

  const answer = (categoryId: string) => {
    if (chosen) return;
    setChosen(categoryId);
    const isCorrect = categoryId === correctCategory.id;
    if (isCorrect) setScore((value) => value + 1);
    progressActions.recordAnswer(word.id, isCorrect);
    if (isCorrect) playCorrect(progress.soundOn);
    else playWrong(progress.soundOn);
  };

  const next = () => {
    if (round + 1 >= words.length) {
      const earned = score * 10 + 15;
      setXp(earned);
      progressActions.addXp(earned);
      progressActions.recordGame('sorter', score);
      setFinished(true);
      playWin(progress.soundOn);
      return;
    }
    setRound((value) => value + 1);
    setChosen(null);
  };

  if (finished) {
    return (
      <div className="game-shell">
        <GameResult
          emoji="🗂️"
          title="Sorting complete"
          score={score}
          total={words.length}
          stars={starsFor(score, words.length)}
          xp={xp}
          message="Knowing which topic a word belongs to helps you remember it in context."
          onReplay={() => window.location.reload()}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <GameHeader
        emoji="🗂️"
        title="Topic Sorter"
        subtitle={getCategory(topicId) ? `Words from ${getCategory(topicId)?.title}` : 'A mix of every topic'}
        onExit={onExit}
        hud={
          <>
            <HudItem label="Word" value={`${round + 1}/${words.length}`} />
            <HudItem label="Score" value={score} />
          </>
        }
      />

      <div className="panel quiz-card">
        <p className="quiz-prompt">Which topic does this word belong to?</p>
        <div className="quiz-word">
          {word.word}
          <SpeakerButton text={word.word} label={`Hear “${word.word}”`} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <Npr npr={word.npr} />
        </div>
        <p className="gloss" style={{ textAlign: 'center', marginBottom: 18 }}>
          {word.gloss}
        </p>

        <div className="option-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {options.map((category) => {
            const isCorrect = category.id === correctCategory.id;
            const isChosen = chosen === category.id;
            const className = chosen
              ? isCorrect
                ? 'option option--correct'
                : isChosen
                  ? 'option option--wrong'
                  : 'option'
              : 'option';
            return (
              <button
                key={category.id}
                type="button"
                className={className}
                onClick={() => answer(category.id)}
                disabled={Boolean(chosen)}
              >
                <span aria-hidden="true" style={{ fontSize: '1.3rem' }}>
                  {category.emoji}
                </span>
                {category.title}
                {chosen && isCorrect && <span aria-hidden="true"> ✓</span>}
              </button>
            );
          })}
        </div>

        {chosen && (
          <>
            <div className={`feedback ${chosen === correctCategory.id ? 'feedback--good' : 'feedback--bad'}`}>
              {chosen === correctCategory.id ? '✅ Correct! ' : '💡 Not quite. '}
              <strong>{word.word}</strong> lives in <strong>{correctCategory.title}</strong>.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="btn btn--primary" onClick={next}>
                {round + 1 >= words.length ? 'See my score →' : 'Next word →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
