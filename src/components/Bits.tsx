import { Fragment, useMemo, type ReactNode } from 'react';
import { speak } from '../lib/speech';
import { syllables } from '../lib/utils';
import type { Category } from '../data';

export function SpeakerButton({
  text,
  label = 'Hear it spoken',
  slow = false,
}: {
  text: string;
  label?: string;
  slow?: boolean;
}) {
  return (
    <button
      type="button"
      className="btn btn--audio"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        speak(text, { rate: slow ? 0.5 : 0.9 });
      }}
    >
      {slow ? '🐢' : '🔊'}
    </button>
  );
}

export function Npr({ npr, small = false }: { npr: string; small?: boolean }) {
  const parts = syllables(npr);
  return (
    <span className={`npr ${small ? 'npr--sm' : ''}`} aria-label={`Pronounced ${npr}`}>
      {parts.map((part, index) => {
        const stressed = part === part.toUpperCase() && /[A-Z]/.test(part) && parts.length > 1;
        return (
          <Fragment key={`${part}-${index}`}>
            {index > 0 && (
              <span className="npr__sep" aria-hidden="true">
                -
              </span>
            )}
            <span className={`npr__syl ${stressed ? 'npr__syl--stress' : ''}`}>{part}</span>
          </Fragment>
        );
      })}
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  c1,
  c2,
}: {
  value: number;
  max: number;
  c1?: string;
  c2?: string;
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div
        className="bar__fill"
        style={{
          width: `${pct}%`,
          ...(c1 ? { background: `linear-gradient(90deg, ${c1}, ${c2 ?? c1})` } : {}),
        }}
      />
    </div>
  );
}

export function Stat({ emoji, value, label }: { emoji: string; value: ReactNode; label: string }) {
  return (
    <div className="stat">
      <div className="stat__emoji" aria-hidden="true">
        {emoji}
      </div>
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

const CONFETTI_COLOURS = ['#fbbf24', '#ec4899', '#8b5cf6', '#22c55e', '#0ea5e9', '#f97316'];

export function Confetti({ count = 34 }: { count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.1,
        duration: 2 + Math.random() * 1.6,
        rotate: Math.random() * 360,
        colour: CONFETTI_COLOURS[index % CONFETTI_COLOURS.length],
      })),
    [count],
  );

  return (
    <div aria-hidden="true">
      {bits.map((bit, index) => (
        <span
          key={index}
          className="confetti"
          style={{
            left: `${bit.left}%`,
            backgroundColor: bit.colour,
            animationDelay: `${bit.delay}s`,
            animationDuration: `${bit.duration}s`,
            transform: `rotate(${bit.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function Stars({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="result__stars" aria-label={`${count} out of ${max} stars`}>
      {Array.from({ length: max }, (_, index) => (
        <span key={index} aria-hidden="true">
          {index < count ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
}

export function GameResult({
  emoji,
  title,
  score,
  total,
  stars,
  xp,
  message,
  onReplay,
  onExit,
}: {
  emoji: string;
  title: string;
  score: number;
  total?: number;
  stars: number;
  xp: number;
  message: string;
  onReplay: () => void;
  onExit: () => void;
}) {
  return (
    <div className="panel result">
      <Confetti />
      <div style={{ fontSize: '3rem' }} aria-hidden="true">
        {emoji}
      </div>
      <h2>{title}</h2>
      <div className="result__score">
        {score}
        {typeof total === 'number' && (
          <span style={{ fontSize: '1.4rem', color: '#8b7fb0' }}> / {total}</span>
        )}
      </div>
      <Stars count={stars} />
      <p style={{ color: '#5f5688', fontWeight: 700 }}>{message}</p>
      <p className="chip" style={{ display: 'inline-flex' }}>
        ⚡ +{xp} XP earned
      </p>
      <div className="result__actions">
        <button type="button" className="btn btn--primary" onClick={onReplay}>
          Play again
        </button>
        <button type="button" className="btn btn--ghost" onClick={onExit}>
          Back to games
        </button>
      </div>
    </div>
  );
}

export function CategoryChips({
  value,
  onChange,
  categories,
  allowAll = false,
  label,
}: {
  value: string;
  onChange: (id: string) => void;
  categories: Category[];
  allowAll?: boolean;
  label?: string;
}) {
  return (
    <div>
      {label && (
        <p className="quiz-prompt" style={{ marginBottom: 8 }}>
          {label}
        </p>
      )}
      <div className="chip-row">
        {allowAll && (
          <button
            type="button"
            className={`chip ${value === 'all' ? 'chip--active' : ''}`}
            onClick={() => onChange('all')}
          >
            🌍 All topics
          </button>
        )}
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`chip ${value === category.id ? 'chip--active' : ''}`}
            onClick={() => onChange(category.id)}
          >
            {category.emoji} {category.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GameHeader({
  emoji,
  title,
  subtitle,
  hud,
  onExit,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  hud?: ReactNode;
  onExit: () => void;
}) {
  return (
    <div className="game-top">
      <button type="button" className="btn btn--ghost btn--sm" onClick={onExit}>
        ← Games
      </button>
      <div>
        <h1>
          <span aria-hidden="true">{emoji}</span> {title}
        </h1>
        {subtitle && <p className="game-top__sub">{subtitle}</p>}
      </div>
      {hud && <div className="hud">{hud}</div>}
    </div>
  );
}

export function HudItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="hud__item">
      <div className="hud__value">{value}</div>
      <div className="hud__label">{label}</div>
    </div>
  );
}
