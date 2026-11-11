import { gameById } from '../games/registry';
import WordSearchGame from '../games/WordSearchGame';
import Flashcards from '../games/Flashcards';
import QuizGame from '../games/QuizGame';
import ListenGame from '../games/ListenGame';
import ScrambleGame from '../games/ScrambleGame';
import MemoryGame from '../games/MemoryGame';
import SpellingGame from '../games/SpellingGame';
import SpeedGame from '../games/SpeedGame';
import SorterGame from '../games/SorterGame';

export default function GamePlay({
  gameId,
  topicId,
  onExit,
}: {
  gameId: string | undefined;
  topicId: string;
  onExit: () => void;
}) {
  const game = gameById(gameId);

  if (!game) {
    return (
      <div className="panel" style={{ marginTop: 40, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }} aria-hidden="true">
          🎮
        </div>
        <h1>Game not found</h1>
        <p style={{ color: '#5f5688' }}>That game does not exist — but the arcade is full of others.</p>
        <button type="button" className="btn btn--primary" onClick={onExit}>
          Back to games
        </button>
      </div>
    );
  }

  const props = { topicId, onExit };
  const key = `${game.id}-${topicId}`;

  switch (game.id) {
    case 'word-search':
      return <WordSearchGame key={key} {...props} />;
    case 'flashcards':
      return <Flashcards key={key} {...props} />;
    case 'quiz':
      return <QuizGame key={key} {...props} />;
    case 'listen':
      return <ListenGame key={key} {...props} />;
    case 'scramble':
      return <ScrambleGame key={key} {...props} />;
    case 'memory':
      return <MemoryGame key={key} {...props} />;
    case 'spelling':
      return <SpellingGame key={key} {...props} />;
    case 'speed':
      return <SpeedGame key={key} {...props} />;
    case 'sorter':
      return <SorterGame key={key} {...props} />;
    default:
      return null;
  }
}
