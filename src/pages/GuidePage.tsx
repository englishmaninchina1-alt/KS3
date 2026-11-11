import { useState } from 'react';
import { categories, totalWords } from '../data';
import { games } from '../games/registry';
import { progressActions, useProgress } from '../lib/storage';
import { speak, setPreferredVoice, speechSupported, useVoices } from '../lib/speech';

export default function GuidePage() {
  const progress = useProgress();
  const voices = useVoices();
  const [sample, setSample] = useState('confident');

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">📖 Guide</span>
        <h1>How WordLab works</h1>
        <p>
          A complete Key Stage 3 vocabulary and pronunciation course for learners aged 11–14 who are
          building English as an additional language. Use it in class, at home, or both.
        </p>
      </div>

      <div className="prose">
        <h2>What is inside</h2>
        <div className="guide-grid">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>📚 {totalWords} words</h3>
            <p className="gloss">
              {categories.length} topics with fifty words each. Every word has a meaning written for
              young learners, a part of speech and a phonetic respelling.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>🎮 {games.length} games</h3>
            <p className="gloss">
              Word search, flip cards, quiz, listening, letter scramble, memory match, spelling bee,
              beat the clock and topic sorter.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>🎙️ Pronunciation studio</h3>
            <p className="gloss">
              Hear a British English model, slow it down, record your own voice and play it back next
              to the model.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>✍️ Story Coach</h3>
            <p className="gloss">
              An AI writing partner that asks questions and suggests better words, without writing the
              story for the learner.
            </p>
          </div>
        </div>

        <h2>A ten-minute routine</h2>
        <div className="guide-grid">
          <div className="card">
            <div className="step">
              <span className="step-num">1</span>
              <div>
                <h3>Meet five words</h3>
                <p>Open a topic and read five word cards. Tap 🔊 each time.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="step">
              <span className="step-num">2</span>
              <div>
                <h3>Play one round</h3>
                <p>Choose a game that uses the same topic. Aim for three stars.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="step">
              <span className="step-num">3</span>
              <div>
                <h3>Record one word</h3>
                <p>Say it out loud in the studio, listen back, then mark it as known.</p>
              </div>
            </div>
          </div>
        </div>

        <h2>Natural Phonetic Respelling (NPR)</h2>
        <p>
          NPR spells a word the way it sounds, using everyday letters instead of the International
          Phonetic Alphabet. It is the same idea as <em>“said” → sed</em> or{' '}
          <em>“nation” → NAY-shun</em>. Syllables are separated with hyphens, and the strongest
          syllable is written in CAPITAL LETTERS.
        </p>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <strong style={{ fontFamily: 'var(--font-head)', fontSize: '1.2rem' }}>phonetic</strong>
            <span className="npr">
              <span className="npr__syl">fuh</span>
              <span className="npr__syl npr__syl--stress">NET</span>
              <span className="npr__syl">ik</span>
            </span>
            <button
              type="button"
              className="btn btn--audio"
              onClick={() => speak('phonetic', { rate: 0.85 })}
              aria-label="Hear phonetic"
            >
              🔊
            </button>
          </div>
          <p className="gloss" style={{ marginTop: 8, marginBottom: 0 }}>
            Say <em>fuh</em> quickly, hit <em>NET</em> strongly, then finish with <em>ik</em>.
          </p>
        </div>

        <div className="table-wrap">
          <table>
            <caption className="sr-only">Respelling symbols used in WordLab</caption>
            <thead>
              <tr>
                <th scope="col">In the respelling</th>
                <th scope="col">Sounds like</th>
                <th scope="col">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>CAPITALS</strong>
                </td>
                <td>The strong beat (stress)</td>
                <td>
                  <strong>FAM</strong>-uh-lee
                </td>
              </tr>
              <tr>
                <td>uh</td>
                <td>The soft “a” in about</td>
                <td>FAM-<strong>uh</strong>-lee</td>
              </tr>
              <tr>
                <td>ee</td>
                <td>Long e, as in see</td>
                <td>SPEE-sheez</td>
              </tr>
              <tr>
                <td>i</td>
                <td>Short i, as in sit</td>
                <td>KICH-in</td>
              </tr>
              <tr>
                <td>y</td>
                <td>Long i, as in my</td>
                <td>KYOOR-ee-uhss</td>
              </tr>
              <tr>
                <td>ay</td>
                <td>As in day</td>
                <td>NAY-buh</td>
              </tr>
              <tr>
                <td>ow</td>
                <td>As in cow</td>
                <td>FOWN-tuhn</td>
              </tr>
              <tr>
                <td>oh</td>
                <td>As in go</td>
                <td>TOH-may-toh</td>
              </tr>
              <tr>
                <td>oo</td>
                <td>As in moon</td>
                <td>SKOO-tuh</td>
              </tr>
              <tr>
                <td>air</td>
                <td>As in hair</td>
                <td>PAIR-uhnts</td>
              </tr>
              <tr>
                <td>eer</td>
                <td>As in near</td>
                <td>KREE-chuh</td>
              </tr>
              <tr>
                <td>ur</td>
                <td>As in bird</td>
                <td>FUR-nuh-chuh</td>
              </tr>
              <tr>
                <td>aw</td>
                <td>As in law</td>
                <td>TAW-tuhss</td>
              </tr>
              <tr>
                <td>ss</td>
                <td>A hissing s</td>
                <td>KLOSS-uhss</td>
              </tr>
              <tr>
                <td>th</td>
                <td>As in think or this</td>
                <td>THUN-duh</td>
              </tr>
              <tr>
                <td>zh</td>
                <td>As in vision</td>
                <td>tel-uh-VIZH-uhn</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Audio settings</h2>
        <div className="card">
          <p style={{ marginTop: 0 }}>
            WordLab uses your device&apos;s built-in speech voice, so words are spoken instantly and
            offline. Different devices offer different voices — pick your favourite British English
            voice below.
          </p>
          {speechSupported ? (
            <>
              <label htmlFor="voice-choice" style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                Speaking voice
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '8px 0 14px' }}>
                <select
                  id="voice-choice"
                  className="search"
                  style={{ padding: '12px 14px', fontWeight: 700 }}
                  value={progress.voiceURI ?? ''}
                  onChange={(event) => {
                    const value = event.target.value || null;
                    progressActions.setVoice(value);
                    setPreferredVoice(value);
                    speak('Hello, let us learn some English', { rate: 0.9 });
                  }}
                >
                  <option value="">Best available British voice</option>
                  {voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <button type="button" className="btn btn--sm btn--primary" onClick={() => speak(sample, { rate: 0.85 })}>
                  🔊 Test the voice
                </button>
                <select
                  className="search"
                  aria-label="Sample word"
                  style={{ padding: '11px 14px', fontWeight: 700, maxWidth: 240 }}
                  value={sample}
                  onChange={(event) => setSample(event.target.value)}
                >
                  {categories[0].words.slice(0, 12).map((word) => (
                    <option key={word.id} value={word.word}>
                      {word.word}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="chip"
                  aria-pressed={progress.soundOn}
                  onClick={() => progressActions.setSound(!progress.soundOn)}
                >
                  {progress.soundOn ? '🔔 Game sounds on' : '🔕 Game sounds off'}
                </button>
              </div>
            </>
          ) : (
            <div className="feedback feedback--bad">
              This browser does not support speech synthesis. Try Chrome, Edge, Safari or Firefox on a
              desktop or phone.
            </div>
          )}
        </div>

        <h2>Story Coach &amp; AI safety</h2>
        <p>
          Coach Maple is an AI writing partner. Students fill in a story plan, then chat about their
          ideas. The coach gives one thing that works, one tip and one question — it deliberately does
          not write the story for them.
        </p>
        <ul>
          <li>
            Messages travel through this site&apos;s own server to the OpenAI API. The API key stays on
            the server and is never sent to the browser.
          </li>
          <li>
            WordLab does not store conversations. The story plan is saved in this browser only, and
            “New chat” clears the conversation.
          </li>
          <li>
            Each device can send up to 30 coach messages an hour (150 a day) to keep classroom use
            affordable.
          </li>
          <li>
            AI can be wrong. Check facts and ideas with a teacher, and never share personal details such
            as a school name, address or contact information.
          </li>
        </ul>
        <p className="record-note">
          For adults setting this up: the server reads the <code>OPENAI</code> secret, with optional{' '}
          <code>OPENAI_MODEL</code> and <code>OPENAI_BASE_URL</code> overrides. If the key is missing,
          the coach shows a friendly “not switched on” message and the rest of WordLab keeps working.
          Use <code>npm run build</code> and <code>npm start</code> to run the production server, which
          serves both the app and the coach API.
        </p>

        <h2>Microphone &amp; privacy</h2>
        <ul>
          <li>Recording needs your permission. Nothing starts until you tap the microphone button.</li>
          <li>
            Clips are held in memory in this browser tab only. They are never uploaded, and closing or
            reloading the page deletes them.
          </li>
          <li>Progress, XP and badges are stored in this browser&apos;s local storage on this device.</li>
          <li>There are no accounts, no adverts, no tracking and no third-party analytics.</li>
        </ul>

        <h2>Links to the UK KS3 English curriculum</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Topic</th>
                <th scope="col">KS3 focus</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <th scope="row" style={{ background: 'transparent', fontFamily: 'inherit' }}>
                    {category.emoji} {category.title}
                  </th>
                  <td>{category.ks3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="record-note">
          WordLab supports the KS3 aims of reading fluently, understanding new vocabulary, writing
          accurately and speaking confidently. It is a vocabulary and pronunciation companion — pair it
          with your school&apos;s reading and writing units.
        </p>

        <h2>For parents and teachers</h2>
        <ul>
          <li>
            <strong>Stretch and support:</strong> every topic includes concrete everyday nouns and
            more ambitious KS3 words (for example <em>sustainable</em>, <em>algorithm</em>,{' '}
            <em>resilience</em>-style adjectives), so mixed-ability groups can work in the same topic.
          </li>
          <li>
            <strong>Assessment:</strong> the progress page shows words known, best game scores and
            recordings made. Use it as a low-stakes check, not a formal test.
          </li>
          <li>
            <strong>Speaking:</strong> the studio&apos;s prompts make quick paired speaking tasks:
            learners record a 20-second answer, then swap devices.
          </li>
          <li>
            <strong>Accessibility:</strong> large text, high contrast, keyboard navigation and reduced
            motion are supported. Audio is available for every word.
          </li>
        </ul>

        <h2>Troubleshooting</h2>
        <ul>
          <li>
            <strong>No sound?</strong> Check the device volume, then pick a different voice above.
            Some browsers need one tap on the page before audio can play.
          </li>
          <li>
            <strong>Microphone blocked?</strong> Open the site settings in your browser and allow the
            microphone, then reload.
          </li>
          <li>
            <strong>Progress disappeared?</strong> Local storage may be cleared by private browsing or
            by clearing site data.
          </li>
        </ul>
      </div>
    </div>
  );
}
