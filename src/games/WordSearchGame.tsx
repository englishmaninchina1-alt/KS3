import { useMemo, useState } from 'react';
import { categories, getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { playCorrect, playWin, playWrong } from '../lib/sfx';
import {
  buildPuzzle,
  cellsBetween,
  FOUND_COLOURS,
  type Cell,
} from '../lib/wordsearch';
import { sample, starsFor } from '../lib/utils';
import {
  CategoryChips,
  GameHeader,
  GameResult,
  HudItem,
  ProgressBar,
} from '../components/Bits';

type Level = 'easy' | 'medium' | 'hard';

const LEVELS: Record<Level, { size: number; diagonals: boolean; backwards: boolean; label: string; note: string }> = {
  easy: { size: 10, diagonals: false, backwards: false, label: 'Easy', note: 'Across and down only' },
  medium: { size: 12, diagonals: true, backwards: false, label: 'Medium', note: 'Diagonals added' },
  hard: { size: 15, diagonals: true, backwards: true, label: 'Hard', note: 'Backwards too' },
};

export default function WordSearchGame({
  topicId,
  onExit,
}: {
  topicId: string;
  onExit: () => void;
}) {
  const [topic, setTopic] = useState(topicId || '');
  const [level, setLevel] = useState<Level>('easy');
  const [seed, setSeed] = useState(0);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [wrongCell, setWrongCell] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const progress = useProgress();

  const category = getCategory(topic);
  const config = LEVELS[level];

  const chosenWords = useMemo(() => {
    if (!category) return [];
    const candidates = category.words.filter(
      (word) => /^[A-Za-z]+$/.test(word.word) && word.word.length >= 3 && word.word.length <= config.size,
    );
    return sample(candidates, 8).map((word) => word.word);
    // `seed` forces a fresh selection each time the learner asks for a new grid.
  }, [category, config.size, seed]);

  const puzzle = useMemo(() => {
    if (chosenWords.length === 0) return null;
    return buildPuzzle(chosenWords, config.size, {
      diagonals: config.diagonals,
      backwards: config.backwards,
    });
  }, [chosenWords, config.backwards, config.diagonals, config.size]);

  const foundColours = useMemo(() => {
    const map = new Map<string, string>();
    puzzle?.placements.forEach((placement) => {
      if (found.includes(placement.word)) {
        placement.cells.forEach((cell) => {
          map.set(`${cell.row}-${cell.col}`, FOUND_COLOURS[placement.colour % FOUND_COLOURS.length]);
        });
      }
    });
    return map;
  }, [found, puzzle]);

  const resetBoard = (nextLevel = level) => {
    setLevel(nextLevel);
    setSeed((value) => value + 1);
    setFound([]);
    setStartCell(null);
    setWrongCell(null);
    setFinished(false);
  };

  const finish = (score: number, total: number) => {
    setFinished(true);
    const xp = 25 + score * 5;
    progressActions.addXp(xp);
    progressActions.recordGame('word-search', score);
    playWin(progress.soundOn);
    return { score, total, xp };
  };

  const [result, setResult] = useState({ score: 0, total: 0, xp: 0 });

  const handleCellClick = (cell: Cell) => {
    if (!puzzle || finished) return;

    if (!startCell) {
      setStartCell(cell);
      return;
    }

    if (startCell.row === cell.row && startCell.col === cell.col) {
      setStartCell(null);
      return;
    }

    const line = cellsBetween(startCell, cell);
    if (!line) {
      playWrong(progress.soundOn);
      setWrongCell(`${cell.row}-${cell.col}`);
      window.setTimeout(() => setWrongCell(null), 400);
      setStartCell(null);
      return;
    }

    const letters = line.map((point) => puzzle.grid[point.row][point.col]).join('');
    const reversed = [...line].reverse();
    const reversedLetters = reversed.map((point) => puzzle.grid[point.row][point.col]).join('');

    const match = puzzle.placements.find(
      (placement) =>
        !found.includes(placement.word) &&
        (placement.word === letters || placement.word === reversedLetters),
    );

    if (match) {
      const nextFound = [...found, match.word];
      setFound(nextFound);
      setStartCell(null);
      playCorrect(progress.soundOn);
      if (nextFound.length === puzzle.placements.length) {
        setResult(finish(nextFound.length, puzzle.placements.length));
      }
    } else {
      playWrong(progress.soundOn);
      setWrongCell(`${cell.row}-${cell.col}`);
      window.setTimeout(() => setWrongCell(null), 400);
      setStartCell(null);
    }
  };

  if (!category) {
    return (
      <div className="game-shell">
        <GameHeader emoji="🔎" title="Word Search" onExit={onExit} subtitle="Pick a topic to build a grid" />
        <div className="panel">
          <CategoryChips
            value={topic}
            onChange={setTopic}
            categories={categories}
            label="Choose the vocabulary for your puzzle"
          />
          <div className="hint-box" style={{ marginTop: 18 }}>
            Tip: each topic has 50 words, and every grid hides eight of them. Longer topics make
            tougher puzzles.
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="game-shell">
        <GameResult
          emoji="🔎"
          title="Grid complete!"
          score={result.score}
          total={result.total}
          stars={starsFor(result.score, result.total)}
          xp={result.xp}
          message="Every hidden word found. Try a bigger grid next time!"
          onReplay={() => resetBoard()}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <GameHeader
        emoji="🔎"
        title="Word Search"
        subtitle={`${category.emoji} ${category.title} · ${config.note}`}
        onExit={onExit}
        hud={
          <>
            <HudItem label="Found" value={`${found.length}/${puzzle?.placements.length ?? 0}`} />
            <HudItem label="Level" value={config.label} />
          </>
        }
      />

      <div className="toolbar">
        <div className="chip-row">
          {(Object.keys(LEVELS) as Level[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`chip ${level === key ? 'chip--active' : ''}`}
              onClick={() => resetBoard(key)}
            >
              {LEVELS[key].label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setTopic('')}>
            Change topic
          </button>
          <button type="button" className="btn btn--sm btn--primary" onClick={() => resetBoard()}>
            🎲 New grid
          </button>
        </div>
      </div>

      <div className="ws-layout">
        <div className="ws-board-wrap">
          <div
            className="ws-grid"
            style={{ '--size': config.size } as React.CSSProperties}
            role="grid"
            aria-label={`Word search grid, ${config.size} by ${config.size}`}
          >
            {puzzle?.grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const isStart = startCell?.row === rowIndex && startCell?.col === colIndex;
                const colour = foundColours.get(key);
                return (
                  <button
                    key={key}
                    type="button"
                    role="gridcell"
                    className={[
                      'ws-cell',
                      isStart ? 'ws-cell--start' : '',
                      colour ? 'ws-cell--found' : '',
                      wrongCell === key ? 'ws-cell--shake' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={colour ? ({ '--found': colour } as React.CSSProperties) : undefined}
                    aria-label={`${letter}, row ${rowIndex + 1}, column ${colIndex + 1}`}
                    aria-pressed={Boolean(isStart)}
                    onClick={() => handleCellClick({ row: rowIndex, col: colIndex })}
                  >
                    {letter}
                  </button>
                );
              }),
            )}
          </div>
        </div>

        <div className="ws-side">
          <div className="card" style={{ padding: 16 }}>
            <p className="quiz-prompt" style={{ marginBottom: 8 }}>
              Words to find
            </p>
            <div className="ws-words">
              {puzzle?.placements.map((placement) => (
                <span
                  key={placement.word}
                  className={`ws-word ${found.includes(placement.word) ? 'ws-word--done' : ''}`}
                >
                  {found.includes(placement.word) ? '✓ ' : ''}
                  {placement.word.toLowerCase()}
                </span>
              ))}
            </div>
            {puzzle && puzzle.skipped.length > 0 && (
              <p className="record-note" style={{ marginTop: 10 }}>
                ({puzzle.skipped.length} long word{puzzle.skipped.length === 1 ? '' : 's'} did not fit
                this grid.)
              </p>
            )}
          </div>

          <div className="card" style={{ padding: 16 }}>
            <p className="quiz-prompt" style={{ marginBottom: 8 }}>
              Progress
            </p>
            <ProgressBar
              value={found.length}
              max={puzzle?.placements.length ?? 1}
              c1={category.colours[0]}
              c2={category.colours[1]}
            />
            <p className="record-note" style={{ marginTop: 8 }}>
              {found.length} of {puzzle?.placements.length ?? 0} words found
            </p>
          </div>

          <div className="hint-box">
            <strong>How to play:</strong> tap the first letter of a word, then tap its last letter.
            Words can run across, down{config.diagonals ? ', diagonally' : ''}
            {config.backwards ? ' or backwards' : ''}.
          </div>
        </div>
      </div>
    </div>
  );
}
