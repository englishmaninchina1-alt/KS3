import { useMemo, useState } from 'react';
import { getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { playCorrect, playWin, playWrong } from '../lib/sfx';
import { makeChoiceQuestionFor, poolFor, type ChoiceQuestion } from './helpers';
import { sample, starsFor } from '../lib/utils';
import {
  GameHeader,
  GameResult,
  HudItem,
  Npr,
  SpeakerButton,
  ProgressBar,
} from '../components/Bits';

const ROUNDS = 10;

export default function QuizGame({ topicId, onExit }: { topicId: string; onExit: () => void }) {
  const pool = useMemo(() => poolFor(topicId), [topicId]);
  const category = getCategory(topicId);
  const progress = useProgress();

  const [questions] = useState<ChoiceQuestion[]>(() =>
    sample(pool, ROUNDS).map((word, index) =>
      makeChoiceQuestionFor(word, pool, index % 2 === 0 ? 'meaning' : 'word'),
    ),
  );
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xp, setXp] = useState(0);

  const question = questions[round];
  const answered = selected !== null;
  const correct = selected === question.answer;

  const choose = (option: string) => {
    if (answered) return;
    setSelected(option);
    const isCorrect = option === question.answer;
    if (isCorrect) setScore((value) => value + 1);
    progressActions.recordAnswer(question.word.id, isCorrect);
    if (isCorrect) playCorrect(progress.soundOn);
    else playWrong(progress.soundOn);
  };

  const next = () => {
    if (round + 1 >= questions.length) {
      const finalScore = score;
      const earned = finalScore * 10 + 20;
      setXp(earned);
      progressActions.addXp(earned);
      progressActions.recordGame('quiz', finalScore);
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
          emoji="❓"
          title={score === questions.length ? 'Perfect score!' : 'Quiz complete'}
          score={score}
          total={questions.length}
          stars={starsFor(score, questions.length)}
          xp={xp}
          message={
            score === questions.length
              ? 'Ten out of ten — your vocabulary is on fire!'
              : 'Every wrong answer is a word waiting to be learned. Try again!'
          }
          onReplay={() => window.location.reload()}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <GameHeader
        emoji="❓"
        title="Quick Quiz"
        subtitle={category ? `${category.emoji} ${category.title}` : '🌍 Words from every topic'}
        onExit={onExit}
        hud={
          <>
            <HudItem label="Question" value={`${round + 1}/${questions.length}`} />
            <HudItem label="Score" value={score} />
          </>
        }
      />

      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={round + (answered ? 1 : 0)} max={questions.length} />
      </div>

      <div className="panel quiz-card">
        <p className="quiz-prompt">
          {question.mode === 'meaning' ? 'What does this word mean?' : 'Which word matches this meaning?'}
        </p>

        {question.mode === 'meaning' ? (
          <>
            <div className="quiz-word">
              {question.word.word}
              <SpeakerButton text={question.word.word} label={`Hear “${question.word.word}”`} />
            </div>
            <div style={{ textAlign: 'center', marginBottom: 6 }}>
              <Npr npr={question.word.npr} />
            </div>
          </>
        ) : (
          <p className="quiz-question">{question.word.gloss}</p>
        )}

        <div className="option-grid">
          {question.options.map((option, index) => {
            const isAnswer = option === question.answer;
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
                <span className="option__key" aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
                {answered && isAnswer && <span aria-hidden="true"> ✓</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div className={`feedback ${correct ? 'feedback--good' : 'feedback--bad'}`}>
              {correct ? '✅ Correct! ' : '💡 Not quite. '}
              <strong>{question.word.word}</strong> — <Npr npr={question.word.npr} small /> —{' '}
              {question.word.gloss}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" className="btn btn--primary" onClick={next}>
                {round + 1 >= questions.length ? 'See my score →' : 'Next question →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
