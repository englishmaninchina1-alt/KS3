import type { Category } from '../data';
import { useProgress } from '../lib/storage';
import { ProgressBar } from './Bits';

export function TopicCard({ category }: { category: Category }) {
  const progress = useProgress();
  const known = category.words.filter((word) => progress.known[word.id]).length;

  return (
    <a
      className="topic-card"
      href={`#/topic/${category.id}`}
      style={
        {
          '--c1': category.colours[0],
          '--c2': category.colours[1],
        } as React.CSSProperties
      }
    >
      <div className="topic-card__top">
        <div className="topic-card__emoji" aria-hidden="true">
          {category.emoji}
        </div>
        <div>
          <h3>{category.title}</h3>
          <div className="topic-card__count">{category.words.length} words</div>
        </div>
      </div>
      <p className="topic-card__tagline">{category.tagline}</p>
      <ProgressBar value={known} max={category.words.length} c1={category.colours[0]} c2={category.colours[1]} />
      <div className="topic-card__meta">
        <span>{known} known</span>
        <span>{Math.round((known / category.words.length) * 100)}%</span>
      </div>
    </a>
  );
}
