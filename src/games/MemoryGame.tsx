import { useEffect, useMemo, useState } from 'react';
import { getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { playCorrect, playWin, playWrong } from '../lib/sfx';
import { poolFor } from './helpers';
import { sample, shuffle } from '../lib/utils';
import { GameHeader, GameResult, HudItem } from '../components/Bits';

const PAIRS = 6;

interface Card {
  key: string;
  wordId: string;
  kind: 'word' | 'meaning';
  text: string;
}

export default function MemoryGame({ topicId, onExit }: { topicId: string; onExit: () => void }) {
  const category = getCategory(topicId);
  const pool = useMemo(() => poolFor(topicId), [topicId]);
  const progress = useProgress();

  const pairs = useMemo(() => sample(pool, PAIRS), [pool]);
  const cards = useMemo<Card[]>(
    () =>
      shuffle(
        pairs.flatMap((word, index) => [
          { key: `w-${index}`, wordId: word.id, kind: 'word' as const, text: word.word },
          {
            key: `m-${index}`,
            wordId: word.id,
            kind: 'meaning' as const,
            text: word.gloss,
          },
        ]),
      ),
    [pairs],
  );

  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xp, setXp] = useState(0);

  const flip = (key: string) => {
    if (finished || open.length >= 2) return;
    const card = cards.find((entry) => entry.key === key);
    if (!card || matched.includes(card.wordId) || open.includes(key)) return;

    const nextOpen = [...open, key];
    setOpen(nextOpen);

    if (nextOpen.length === 2) {
      setMoves((value) => value + 1);
      const [first, second] = nextOpen.map((cardKey) => cards.find((entry) => entry.key === cardKey)!);
      if (first.wordId === second.wordId) {
        setMatched((value) => [...value, first.wordId]);
        window.setTimeout(() => setOpen([]), 450);
        playCorrect(progress.soundOn);
      } else {
        window.setTimeout(() => setOpen([]), 900);
        playWrong(progress.soundOn);
      }
    }
  };

  useEffect(() => {
    if (matched.length !== pairs.length || finished) return;
    const earned = Math.max(20, 80 - moves * 3);
    setXp(earned);
    progressActions.addXp(earned);
    progressActions.recordGame('memory', pairs.length);
    setFinished(true);
    playWin(progress.soundOn);
  }, [finished, matched.length, moves, pairs.length, progress.soundOn]);

  if (finished) {
    return (
      <div className="game-shell">
        <GameResult
          emoji="🧠"
          title="All pairs found!"
          score={pairs.length}
          total={pairs.length}
          stars={moves <= 9 ? 3 : moves <= 13 ? 2 : 1}
          xp={xp}
          message={`You matched every word in ${moves} moves. Try again and beat your score!`}
          onReplay={() => window.location.reload()}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <GameHeader
        emoji="🧠"
        title="Memory Match"
        subtitle={category ? `${category.emoji} ${category.title}` : '🌍 Words from every topic'}
        onExit={onExit}
        hud={
          <>
            <HudItem label="Pairs" value={`${matched.length}/${pairs.length}`} />
            <HudItem label="Moves" value={moves} />
          </>
        }
      />

      <div className="panel">
        <p className="quiz-prompt" style={{ textAlign: 'center' }}>
          Find each word and its meaning
        </p>
        <div className="memory-grid">
          {cards.map((card) => {
            const isOpen = open.includes(card.key);
            const isMatched = matched.includes(card.wordId);
            const showFace = isOpen || isMatched;
            return (
              <button
                key={card.key}
                type="button"
                className={`memory-card ${isMatched ? 'memory-card--matched' : ''} ${
                  isOpen && !isMatched ? 'memory-card--flipped' : ''
                }`}
                onClick={() => flip(card.key)}
                aria-label={showFace ? `Card: ${card.text}` : 'Hidden card'}
                disabled={isMatched}
              >
                {showFace ? (
                  <span className={`memory-card__face ${card.kind === 'word' ? 'memory-card__face--word' : ''}`}>
                    {card.text}
                  </span>
                ) : (
                  <span className="memory-card__back" aria-hidden="true">
                    ❓
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="record-note" style={{ textAlign: 'center', marginTop: 16 }}>
          Each correct pair earns progress. Fewer moves means more stars.
        </p>
      </div>
    </div>
  );
}
