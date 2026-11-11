import { useEffect, useMemo, useRef, useState } from 'react';
import { categories, getCategory } from '../data';
import { askStoryCoach, CoachError, type CoachTurn, type StoryPlan } from '../lib/storyCoach';
import { profileKey } from '../lib/session';

const GENRES = ['Adventure', 'Mystery', 'Fantasy', 'Friendship', 'Science fiction', 'School story', 'Funny'];
const MAX_WORDS = 6;
const MAX_INPUT = 1200;
const STORAGE_KEY = 'wordlab-story-plan-v1';

const GREETING =
  "Hi, I'm Coach Maple 🦉 — your story-writing partner. I won't write your story for you, but I'll help you build it one strong sentence at a time.\n\nFill in your story plan on the left, then tell me who your story is about and what happens first.";

interface SavedPlan {
  genre?: string;
  character?: string;
  setting?: string;
  problem?: string;
  topic?: string;
  targetWords?: string[];
}

function loadSavedPlan(key: string): SavedPlan {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '{}') as SavedPlan;
  } catch {
    return {};
  }
}

export default function StoryCoach({ topicId }: { topicId: string }) {
  const saved = useMemo(() => loadSavedPlan(profileKey(STORAGE_KEY)), []);
  const initialTopic = getCategory(topicId)?.id ?? getCategory(saved.topic)?.id ?? categories[0].id;

  const [genre, setGenre] = useState(
    saved.genre && GENRES.includes(saved.genre) ? saved.genre : GENRES[0],
  );
  const [character, setCharacter] = useState(saved.character ?? '');
  const [setting, setSetting] = useState(saved.setting ?? '');
  const [problem, setProblem] = useState(saved.problem ?? '');
  const [topic, setTopic] = useState(initialTopic);
  const [targetWords, setTargetWords] = useState<string[]>(
    Array.isArray(saved.targetWords)
      ? saved.targetWords.filter((word) => typeof word === 'string').slice(0, MAX_WORDS)
      : [],
  );

  const [turns, setTurns] = useState<CoachTurn[]>([{ role: 'coach', content: GREETING }]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryHistory, setRetryHistory] = useState<CoachTurn[] | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);

  const category = getCategory(topic) ?? categories[0];
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        profileKey(STORAGE_KEY),
        JSON.stringify({ genre, character, setting, problem, topic, targetWords }),
      );
    } catch {
      /* saving the plan is a bonus, not a requirement */
    }
  }, [genre, character, setting, problem, topic, targetWords]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [turns, pending]);

  const plan: StoryPlan = { genre, character, setting, problem, topic: category.title, targetWords };

  const request = async (history: CoachTurn[]) => {
    setPending(true);
    setError(null);
    setRetryHistory(null);
    try {
      const result = await askStoryCoach(history, plan);
      setTurns([...history, { role: 'coach', content: result.reply }]);
      setSuggestions(result.words);
      setRemaining(result.remaining);
    } catch (err) {
      setError(
        err instanceof CoachError
          ? err.message
          : 'Coach Maple could not reply just now. Please try again.',
      );
      setRetryHistory(history);
    } finally {
      setPending(false);
    }
  };

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || pending) return;
    if (content.length > MAX_INPUT) {
      setError(`Keep each message under ${MAX_INPUT} characters — about a paragraph.`);
      return;
    }
    const history: CoachTurn[] = [...turns, { role: 'student', content }];
    setTurns(history);
    setInput('');
    setSuggestions([]);
    setError(null);
    void request(history);
  };

  const addWord = (word: string) => {
    setTargetWords((current) =>
      current.includes(word) || current.length >= MAX_WORDS ? current : [...current, word],
    );
  };

  const removeWord = (word: string) => {
    setTargetWords((current) => current.filter((entry) => entry !== word));
  };

  const resetChat = () => {
    setTurns([{ role: 'coach', content: GREETING }]);
    setSuggestions([]);
    setError(null);
    setRetryHistory(null);
    setRemaining(null);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">✍️ AI story coach</span>
        <h1>Build a story with Coach Maple</h1>
        <p>
          Plan a character, a place and a problem, then write your story one step at a time. Coach
          Maple asks questions, suggests better words and never writes the story for you.
        </p>
      </div>

      <div className="story-layout">
        <aside className="story-side">
          <div className="card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Your story plan</h2>
            <p className="record-note" style={{ marginBottom: 14 }}>
              These ideas are sent to the coach with each message. Change them whenever you like.
            </p>

            <div className="plan-field">
              <label htmlFor="story-genre">Genre</label>
              <select id="story-genre" value={genre} onChange={(event) => setGenre(event.target.value)}>
                {GENRES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="plan-field">
              <label htmlFor="story-character">Main character</label>
              <input
                id="story-character"
                maxLength={120}
                placeholder="e.g. Maya, a curious 12-year-old"
                value={character}
                onChange={(event) => setCharacter(event.target.value)}
              />
            </div>

            <div className="plan-field">
              <label htmlFor="story-setting">Setting</label>
              <input
                id="story-setting"
                maxLength={120}
                placeholder="e.g. a rainy school trip to a museum"
                value={setting}
                onChange={(event) => setSetting(event.target.value)}
              />
            </div>

            <div className="plan-field">
              <label htmlFor="story-problem">The big problem</label>
              <textarea
                id="story-problem"
                maxLength={160}
                rows={3}
                placeholder="e.g. the lights go out and the museum doors lock"
                value={problem}
                onChange={(event) => setProblem(event.target.value)}
              />
            </div>

            <div className="plan-field">
              <label htmlFor="story-topic">Vocabulary topic</label>
              <select
                id="story-topic"
                value={topic}
                onChange={(event) => {
                  setTopic(event.target.value);
                  setTargetWords([]);
                }}
              >
                {categories.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.emoji} {entry.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="plan-field">
              <label htmlFor="story-word">Words to try</label>
              <select
                id="story-word"
                value=""
                onChange={(event) => {
                  if (event.target.value) addWord(event.target.value);
                  event.target.value = '';
                }}
              >
                <option value="">Add a word from this topic…</option>
                {category.words.map((word) => (
                  <option key={word.id} value={word.word}>
                    {word.word}
                  </option>
                ))}
              </select>
            </div>

            {targetWords.length > 0 ? (
              <div className="chip-row">
                {targetWords.map((word) => (
                  <button
                    key={word}
                    type="button"
                    className="chip chip--active"
                    onClick={() => removeWord(word)}
                    title={`Remove ${word}`}
                  >
                    {word} <span aria-hidden="true">×</span>
                    <span className="sr-only">remove</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="record-note">No words chosen yet — pick up to six to impress your reader.</p>
            )}
            <p className="record-note" style={{ marginTop: 8 }}>
              {MAX_WORDS - targetWords.length} word {MAX_WORDS - targetWords.length === 1 ? 'slot' : 'slots'} left.
            </p>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>How to get great coaching</h3>
            <ul className="tip-list">
              <li>
                <span aria-hidden="true">📝</span>
                <span>
                  <strong>Write a little.</strong> One sentence or a short paragraph at a time.
                </span>
              </li>
              <li>
                <span aria-hidden="true">🤔</span>
                <span>
                  <strong>Answer the question.</strong> That is how your story grows.
                </span>
              </li>
              <li>
                <span aria-hidden="true">🔁</span>
                <span>
                  <strong>Try the words.</strong> Tap a suggested word to add it to your sentence.
                </span>
              </li>
            </ul>
          </div>
        </aside>

        <section className="panel chat-panel">
          <header className="chat-head">
            <div className="coach-avatar" aria-hidden="true">
              🦉
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Coach Maple</h2>
              <p className="record-note" style={{ margin: 0 }}>
                AI writing partner · KS3 story coaching
              </p>
            </div>
            <span className="chip" style={{ marginLeft: 'auto' }}>
              🤖 AI
            </span>
          </header>

          <div
            className="chat__log"
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation with Coach Maple"
          >
            {turns.map((turn, index) => (
              <div
                key={`${turn.role}-${index}`}
                className={`bubble ${turn.role === 'student' ? 'bubble--student' : 'bubble--coach'}`}
              >
                <div className="bubble__who">{turn.role === 'student' ? 'You' : 'Coach Maple'}</div>
                {turn.content}
              </div>
            ))}
            {pending && (
              <div className="bubble bubble--coach">
                <div className="bubble__who">Coach Maple</div>
                <span className="typing" aria-label="Coach Maple is writing">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="chat-error" role="alert">
              <span style={{ flex: 1, minWidth: 180 }}>{error}</span>
              {retryHistory && !pending && (
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() => void request(retryHistory)}
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="coach-suggestions">
              <span className="chat-note">Words to try:</span>
              {suggestions.map((word) => (
                <button
                  key={word}
                  type="button"
                  className="chip"
                  onClick={() => {
                    setInput((value) => (value ? `${value} ${word}` : `${word} `));
                    inputRef.current?.focus();
                  }}
                >
                  + {word}
                </button>
              ))}
            </div>
          )}

          <div className="chat__composer">
            <div className="quick-row">
              {[
                'Help me plan my story',
                'What could happen next?',
                'Suggest stronger words',
                'Check my opening paragraph',
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="quick-chip"
                  disabled={pending}
                  onClick={() => send(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className="chat__input-row"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <label className="sr-only" htmlFor="story-message">
                Your message to Coach Maple
              </label>
              <textarea
                id="story-message"
                ref={inputRef}
                className="chat__input"
                rows={2}
                maxLength={MAX_INPUT}
                placeholder="Write your story sentence here, or ask a question…"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
              />
              <button type="submit" className="btn btn--primary" disabled={pending || !input.trim()}>
                {pending ? 'Thinking…' : 'Send ➤'}
              </button>
            </form>

            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <p className="chat-note">
                🔒 Your plan is saved on this device only. Never share personal details with an AI.
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {remaining !== null && <span className="chat-note">{remaining} replies left this hour</span>}
                <button type="button" className="chip" onClick={resetChat}>
                  ↺ New chat
                </button>
              </div>
            </div>
            <p className="chat-note">
              AI can make mistakes — check ideas with your teacher. Coach Maple gives tips, not finished
              stories.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
