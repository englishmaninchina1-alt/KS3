import { useRef, useState, type FormEvent } from 'react';
import { findLearner, listLearners, signIn, startGuest } from '../lib/session';

interface Props {
  /** Opens the QR dialog that shows how to install the app on a phone. */
  onShowQr: () => void;
}

export default function Login({ onShowQr }: Props) {
  const learners = listLearners();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const returning = findLearner(name) !== null;

  const start = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await signIn(name, password);
      if (!result.ok) setError(result.message);
    } finally {
      setPending(false);
    }
  };

  const chooseLearner = (learnerName: string) => {
    setName(learnerName);
    setError(null);
    setPassword('');
    passwordRef.current?.focus();
  };

  return (
    <main className="login">
      <div className="panel login__card">
        <div className="login__logo" aria-hidden="true">
          W
        </div>
        <h1>Welcome to WordLab</h1>
        <p className="login__lead">
          600 words, 12 topics and 9 games for KS3 English. Sign in so your XP, badges and progress
          are saved for you.
        </p>

        <form className="login__form" onSubmit={start} noValidate>
          <div className="login__fields">
            <div>
              <label htmlFor="learner-name">Your first name</label>
              <input
                id="learner-name"
                name="learner-name"
                className="login__input"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                }}
                maxLength={24}
                autoComplete="username"
                placeholder="e.g. Amira"
                autoFocus
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div>
              <label htmlFor="learner-password">Password</label>
              <span className="login__field">
                <input
                  id="learner-password"
                  name="learner-password"
                  ref={passwordRef}
                  className="login__input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  maxLength={64}
                  autoComplete={returning ? 'current-password' : 'new-password'}
                  placeholder="At least 4 characters"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                />
                <button
                  type="button"
                  className="login__peek"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
            </div>
          </div>

          {error && (
            <p className="login__error" id="login-error" role="alert">
              {error}
            </p>
          )}

          {!returning && name.trim() !== '' && (
            <p className="login__hint">New name? This creates your profile with this password.</p>
          )}

          <button className="btn btn--primary login__submit" type="submit" disabled={pending}>
            {pending ? 'Checking…' : returning ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="login__guest">
          <button type="button" className="btn login__guest-btn" onClick={startGuest}>
            Continue as guest →
          </button>
          <p>
            Just looking around? You can play without a profile. Your XP stays on this device but no
            one has to type a password.
          </p>
        </div>

        <div className="login__app">
          <button type="button" className="login__app-link" onClick={onShowQr}>
            📲 Get the app
          </button>
          <p>On a phone or tablet? Scan a QR code to add WordLab to your home screen.</p>
        </div>

        {learners.length > 0 && (
          <div className="login__saved">
            <p>Or pick someone who has used this device before:</p>
            <div className="login__learners">
              {learners.map((learner) => (
                <button
                  key={learner.id}
                  type="button"
                  className="login__learner"
                  onClick={() => chooseLearner(learner.name)}
                >
                  👋 {learner.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="login__note">
          Passwords are checked inside this browser and never sent anywhere. There is no password
          reset — if you forget it, a grown-up can clear this site's data to remove the profile.
        </p>
      </div>
    </main>
  );
}
