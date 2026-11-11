import { useEffect, useState } from 'react';
import { progressActions, useProgress } from '../lib/storage';
import { isGuest, signOut, type Learner } from '../lib/session';
import { useInstallPrompt } from '../lib/install';
import { speak, speechSupported } from '../lib/speech';

const LINKS = [
  { href: '#/', label: 'Home', match: '' },
  { href: '#/topics', label: 'Topics', match: 'topics' },
  { href: '#/games', label: 'Games', match: 'games' },
  { href: '#/story', label: 'Story Coach', match: 'story' },
  { href: '#/pronounce', label: 'Say It', match: 'pronounce' },
  { href: '#/progress', label: 'My Progress', match: 'progress' },
  { href: '#/guide', label: 'Guide', match: 'guide' },
];

export default function Nav({
  route,
  learner,
  onShowQr,
}: {
  route: string;
  learner: Learner;
  onShowQr: () => void;
}) {
  const progress = useProgress();
  const { canInstall, install } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const segment = route.replace(/^\//, '').split(/[/?]/)[0];

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const isActive = (match: string) => (match === '' ? segment === '' : segment === match);

  const toggleSound = () => {
    const next = !progress.soundOn;
    progressActions.setSound(next);
    if (next) speak('Sound on', { rate: 0.9 });
  };

  const handleSignOut = () => {
    signOut();
    setOpen(false);
    window.location.hash = '#/';
  };

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand" href="#/" aria-label="WordLab KS3 home">
          <span className="brand__logo" aria-hidden="true">
            W
          </span>
          <span>
            WordLab
            <span className="brand__small">KS3 English</span>
          </span>
        </a>

        <nav className="nav" aria-label="Main navigation">
          {LINKS.map((link) => (
            <a
              key={link.href}
              className={`nav__link ${isActive(link.match) ? 'nav__link--active' : ''}`}
              href={link.href}
              aria-current={isActive(link.match) ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <span className="chip" aria-label={`${progress.xp} experience points`}>
            ⚡ {progress.xp} XP
          </span>
          {canInstall && (
            <button
              type="button"
              className="install-btn"
              onClick={install}
              aria-label="Install WordLab as an app"
              title="Install WordLab on this device"
            >
              <span aria-hidden="true">⬇</span>
              <span className="install-btn__label">Install app</span>
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            onClick={onShowQr}
            aria-label="Show QR codes to install on a phone"
            title="Install on your phone"
          >
            📲
          </button>
          {speechSupported && (
            <button
              type="button"
              className="icon-btn"
              onClick={toggleSound}
              aria-pressed={progress.soundOn}
              aria-label={progress.soundOn ? 'Sound effects on' : 'Sound effects off'}
              title={progress.soundOn ? 'Sound effects on' : 'Sound effects off'}
            >
              {progress.soundOn ? '🔔' : '🔕'}
            </button>
          )}
          <span
            className="nav__learner"
            title={isGuest(learner) ? 'Playing as a guest' : `Signed in as ${learner.name}`}
          >
            <span className="nav__avatar" aria-hidden="true">
              {learner.name.charAt(0).toUpperCase()}
            </span>
            <span className="nav__name">{learner.name}</span>
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={handleSignOut}
            aria-label={isGuest(learner) ? 'Leave guest mode' : `Sign out of ${learner.name}'s progress`}
            title={isGuest(learner) ? 'Leave guest mode' : 'Sign out'}
          >
            🚪
          </button>
          <button
            type="button"
            className="icon-btn nav__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
          {LINKS.map((link) => (
            <a
              key={link.href}
              className={isActive(link.match) ? 'active' : ''}
              href={link.href}
              aria-current={isActive(link.match) ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
