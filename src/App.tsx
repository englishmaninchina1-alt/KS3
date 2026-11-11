import { useEffect, useState, type ReactNode } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import GamesHub from './pages/GamesHub';
import GamePlay from './pages/GamePlay';
import Pronounce from './pages/Pronounce';
import ProgressPage from './pages/ProgressPage';
import GuidePage from './pages/GuidePage';
import StoryCoach from './pages/StoryCoach';
import Login from './pages/Login';
import InstallQr, { type InstallPlatform } from './components/InstallQr';
import { getCategory } from './data';
import { useProgress } from './lib/storage';
import { isGuest, useLearner } from './lib/session';
import { setPreferredVoice } from './lib/speech';

function useHashRoute(): string {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, '') || '/');

  useEffect(() => {
    const onChange = () => {
      setRoute(window.location.hash.replace(/^#/, '') || '/');
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

function NotFound({ message }: { message: string }) {
  return (
    <div className="panel" style={{ marginTop: 40, textAlign: 'center' }}>
      <div style={{ fontSize: '3rem' }} aria-hidden="true">
        🧭
      </div>
      <h1>Lost in the word maze</h1>
      <p style={{ color: '#5f5688' }}>{message}</p>
      <a className="btn btn--primary" href="#/">
        Back to the start
      </a>
    </div>
  );
}

export default function App() {
  const route = useHashRoute();
  const progress = useProgress();
  const learner = useLearner();
  const [qrOpen, setQrOpen] = useState(false);
  const [qrHint, setQrHint] = useState<InstallPlatform | null>(null);

  // Arriving from a scanned install QR code: open the matching instructions.
  useEffect(() => {
    const hint = new URLSearchParams(window.location.search).get('install');
    if (hint === 'android' || hint === 'ios') {
      setQrHint(hint);
      setQrOpen(true);
    }
  }, []);

  const closeQr = () => {
    setQrOpen(false);
    setQrHint(null);
  };

  const openQr = () => {
    setQrHint(null);
    setQrOpen(true);
  };

  useEffect(() => {
    setPreferredVoice(progress.voiceURI);
  }, [progress.voiceURI]);

  if (!learner) {
    return (
      <>
        <Login onShowQr={openQr} />
        <InstallQr open={qrOpen} hint={qrHint} onClose={closeQr} />
      </>
    );
  }

  const [path, queryString = ''] = route.split('?');
  const segments = path.split('/').filter(Boolean);
  const params = new URLSearchParams(queryString);

  let content: ReactNode;

  if (segments.length === 0) {
    content = <Home />;
  } else if (segments[0] === 'topics') {
    content = <Topics />;
  } else if (segments[0] === 'topic') {
    const category = getCategory(segments[1]);
    content = category ? (
      <TopicDetail category={category} initialTab={params.get('tab')} />
    ) : (
      <NotFound message="That topic does not exist. It may have been a typo." />
    );
  } else if (segments[0] === 'games') {
    content = <GamesHub />;
  } else if (segments[0] === 'play') {
    content = <GamePlay gameId={segments[1]} topicId={params.get('topic') ?? ''} onExit={() => {
      window.location.hash = '#/games';
    }} />;
  } else if (segments[0] === 'pronounce') {
    content = <Pronounce topicId={params.get('topic') ?? ''} wordId={params.get('word') ?? ''} />;
  } else if (segments[0] === 'story') {
    content = <StoryCoach topicId={params.get('topic') ?? ''} />;
  } else if (segments[0] === 'progress') {
    content = <ProgressPage />;
  } else if (segments[0] === 'guide') {
    content = <GuidePage />;
  } else {
    content = <NotFound message="This page has wandered off. Try the home page." />;
  }

  return (
    <>
      <Nav
        route={route}
        learner={learner}
        onShowQr={openQr}
      />
      <main className="app">
        {content}
        <footer className="footer">
          <div>
            <strong>WordLab KS3</strong> · 600 words · 12 topics · 9 games · story coach · pronunciation studio
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#/guide">How to use it</a>
            <a href="#/guide">For parents &amp; teachers</a>
            <span>
              {isGuest(learner)
                ? 'Playing as a guest — progress is saved on this device only.'
                : `Progress for ${learner.name} is saved on this device only.`}
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
