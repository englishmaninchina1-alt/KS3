import { useEffect, useMemo, useState } from 'react';
import { categories, getCategory } from '../data';
import { progressActions, useProgress } from '../lib/storage';
import { speak } from '../lib/speech';
import { useRecorder } from '../lib/useRecorder';
import { syllables } from '../lib/utils';
import { playCorrect } from '../lib/sfx';
import { CategoryChips } from '../components/Bits';

export default function Pronounce({
  topicId,
  wordId,
}: {
  topicId: string;
  wordId: string;
}) {
  const [topic, setTopic] = useState(topicId || categories[0].id);
  const category = getCategory(topic) ?? categories[0];
  const [selectedId, setSelectedId] = useState(wordId || category.words[0].id);
  const [search, setSearch] = useState('');
  const recorder = useRecorder();
  const progress = useProgress();

  const word = category.words.find((entry) => entry.id === selectedId) ?? category.words[0];

  useEffect(() => {
    if (topicId) setTopic(topicId);
  }, [topicId]);

  useEffect(() => {
    if (wordId) setSelectedId(wordId);
  }, [wordId]);

  useEffect(() => {
    recorder.reset();
    // A fresh recording panel for every word.
  }, [word.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return category.words;
    return category.words.filter(
      (entry) => entry.word.toLowerCase().includes(term) || entry.npr.toLowerCase().includes(term),
    );
  }, [category.words, search]);

  const chooseTopic = (id: string) => {
    const next = getCategory(id);
    if (!next) return;
    setTopic(id);
    setSelectedId(next.words[0].id);
    setSearch('');
    recorder.reset();
  };

  const markSuccess = () => {
    progressActions.markKnown(word.id);
    progressActions.recordRecording();
    playCorrect(progress.soundOn);
    recorder.reset();
  };

  const isRecording = recorder.status === 'recording';

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">🎙️ Pronunciation studio</span>
        <h1>Say it like a local</h1>
        <p>
          Listen to the British English model, read the Natural Phonetic Respelling, then record
          yourself and compare. CAPITAL letters show the strongest beat; say those a little louder and
          longer.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <CategoryChips value={topic} onChange={chooseTopic} categories={categories} label="Choose your word list" />
      </div>

      <div className="pronounce-layout">
        <div className="card">
          <label className="search" style={{ maxWidth: '100%', marginBottom: 12 }}>
            <span aria-hidden="true">🔍</span>
            <span className="sr-only">Find a word</span>
            <input
              type="search"
              placeholder="Find a word…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="word-picker">
            {filtered.length === 0 && <p className="record-note">No words match that search.</p>}
            {filtered.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`word-picker__item ${entry.id === word.id ? 'word-picker__item--active' : ''}`}
                onClick={() => {
                  setSelectedId(entry.id);
                  recorder.reset();
                }}
                aria-current={entry.id === word.id ? 'true' : undefined}
              >
                <span>{entry.word}</span>
                <span className="word-picker__npr">{entry.npr}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span className="chip">
                {category.emoji} {category.title}
              </span>
              <span className="chip">
                {progress.known[word.id] ? '⭐ Marked as known' : 'New word'}
              </span>
            </div>

            <h2 className="say-word" style={{ marginTop: 14 }}>
              {word.word}
            </h2>
            <span className="pos">{word.pos}</span>
            <p className="gloss" style={{ fontSize: '1rem', marginTop: 10 }}>
              {word.gloss}
            </p>

            <div className="say-syllables" aria-label={`Syllables: ${syllables(word.npr).join(', ')}`}>
              {syllables(word.npr).map((syllable, index) => {
                const stressed =
                  syllable === syllable.toUpperCase() && /[A-Z]/.test(syllable) && syllables(word.npr).length > 1;
                return (
                  <button
                    key={`${syllable}-${index}`}
                    type="button"
                    className={`say-syllable ${stressed ? 'say-syllable--stress' : ''}`}
                    onClick={() => speak(word.word, { rate: 0.45 })}
                    title="Hear the whole word slowly"
                  >
                    {syllable}
                    {stressed && <span className="sr-only"> (stressed)</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => speak(word.word, { rate: Math.max(0.55, progress.speechRate) })}
              >
                🔊 Hear it
              </button>
              <button
                type="button"
                className="btn btn--sun"
                onClick={() => speak(word.word, { rate: 0.5 })}
              >
                🐢 Slowly
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  const next = category.words[Math.floor(Math.random() * category.words.length)];
                  setSelectedId(next.id);
                  recorder.reset();
                }}
              >
                🎲 Surprise word
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  const index = category.words.findIndex((entry) => entry.id === word.id);
                  const next = category.words[(index + 1) % category.words.length];
                  setSelectedId(next.id);
                  recorder.reset();
                }}
              >
                Next word →
              </button>
            </div>

            <div className="record-panel" style={{ marginTop: 20 }}>
              <p className="quiz-prompt" style={{ margin: 0 }}>
                Your turn to speak
              </p>

              {recorder.error && <div className="feedback feedback--bad">{recorder.error}</div>}
              {!recorder.supported && !recorder.error && (
                <div className="feedback feedback--bad">
                  This browser cannot record audio. Chrome, Edge or Safari will work.
                </div>
              )}

              <div className="record-row">
                {isRecording ? (
                  <button
                    type="button"
                    className="record-btn record-btn--live"
                    onClick={recorder.stop}
                    aria-label="Stop recording"
                  >
                    ■
                  </button>
                ) : (
                  <button
                    type="button"
                    className="record-btn"
                    onClick={() => {
                      void recorder.start();
                    }}
                    disabled={recorder.status === 'requesting' || !recorder.supported}
                    aria-label="Start recording"
                  >
                    🎙️
                  </button>
                )}

                <div style={{ flex: 1, minWidth: 180 }}>
                  <div className="level-meter" aria-hidden="true">
                    <div
                      className="level-meter__fill"
                      style={{ width: `${Math.round(recorder.level * 100)}%` }}
                    />
                  </div>
                  <p className="record-note" style={{ marginTop: 6 }}>
                    {recorder.status === 'requesting' && 'Asking for microphone permission…'}
                    {recorder.status === 'recording' &&
                      `${recorder.seconds}s — say the word, then tap ■ to stop (30s max).`}
                    {recorder.status === 'ready' && 'Listen back and compare with the model above.'}
                    {(recorder.status === 'idle' || recorder.status === 'error') &&
                      'Tap the microphone and say the word out loud.'}
                  </p>
                </div>
              </div>

              {recorder.url && (
                <>
                  <audio controls src={recorder.url} style={{ width: '100%' }}>
                    <track kind="captions" />
                  </audio>
                  <div className="flash-controls" style={{ justifyContent: 'flex-start' }}>
                    <button type="button" className="btn btn--sm btn--ghost" onClick={recorder.reset}>
                      ↺ Record again
                    </button>
                    <button type="button" className="btn btn--sm btn--primary" onClick={markSuccess}>
                      ✓ That sounded good
                    </button>
                  </div>
                </>
              )}

              <p className="record-note">
                🔒 Your recording stays in this browser tab and is never uploaded or saved elsewhere.
                Say “yes” if your browser asks to use the microphone.
              </p>
            </div>
          </div>

          <div className="guide-grid">
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Three pronunciation tips</h3>
              <ul className="tip-list">
                <li>
                  <span aria-hidden="true">1️⃣</span>
                  <span>
                    <strong>Find the beat.</strong> The CAPITAL syllable is said louder and slightly
                    longer: <em>en-VY-ruhn-muhnt</em>.
                  </span>
                </li>
                <li>
                  <span aria-hidden="true">2️⃣</span>
                  <span>
                    <strong>Keep it smooth.</strong> Join the syllables together; do not put a gap
                    between them.
                  </span>
                </li>
                <li>
                  <span aria-hidden="true">3️⃣</span>
                  <span>
                    <strong>Finish the word.</strong> Endings like <em>-s</em>, <em>-ed</em> and{' '}
                    <em>-ing</em> carry meaning.
                  </span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>Speaking challenges</h3>
              <p className="record-note" style={{ marginBottom: 10 }}>
                Record your answer to one of these {category.title.toLowerCase()} questions.
              </p>
              <ul className="tip-list">
                {category.prompts.map((prompt) => (
                  <li key={prompt}>
                    <span aria-hidden="true">💬</span>
                    <span>{prompt}</span>
                    <button
                      type="button"
                      className="btn btn--audio"
                      onClick={() => speak(prompt, { rate: 0.85 })}
                      aria-label="Hear the question"
                    >
                      🔊
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
