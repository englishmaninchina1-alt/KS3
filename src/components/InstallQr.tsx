import { useEffect, useRef } from 'react';

export type InstallPlatform = 'android' | 'ios';

const CARDS: {
  id: InstallPlatform;
  label: string;
  emoji: string;
  qr: string;
  caption: string;
  steps: string[];
}[] = [
  {
    id: 'android',
    label: 'Android',
    emoji: '🤖',
    qr: '/qr-android.svg',
    caption: 'Direct APK download',
    steps: [
      'Scan with your camera or Google Lens.',
      'Tap the download when Chrome opens it.',
      'Allow installs from Chrome if asked, then tap Install.',
    ],
  },
  {
    id: 'ios',
    label: 'iPhone & iPad',
    emoji: '🍎',
    qr: '/qr-ios.svg',
    caption: 'ks3.freebuff.page',
    steps: [
      'Scan with the Camera app.',
      'Open the link in Safari.',
      'Tap Share → “Add to Home Screen” → Add.',
    ],
  },
];

interface Props {
  open: boolean;
  /** Set when the visitor arrived by scanning one of these codes. */
  hint?: InstallPlatform | null;
  onClose: () => void;
}

export default function InstallQr({ open, hint = null, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="qr-modal" role="presentation" onClick={onClose}>
      <div
        className="qr-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-title"
        aria-describedby="qr-lead"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="qr-modal__close"
          onClick={onClose}
          aria-label="Close install instructions"
        >
          ✕
        </button>

        <h2 id="qr-title" className="qr-modal__title">
          Put WordLab on your phone
        </h2>
        <p id="qr-lead" className="qr-modal__lead">
          Scan the code for your phone. Android gets the real app as a direct download; on iPhone
          and iPad the site saves to your home screen. No app store in either case.
        </p>

        <div className="qr-modal__grid">
          {CARDS.map((card) => (
            <section
              key={card.id}
              className={`qr-modal__item ${hint === card.id ? 'qr-modal__item--active' : ''}`}
              aria-label={`Install on ${card.label}`}
            >
              <h3 className="qr-modal__platform">
                <span aria-hidden="true">{card.emoji}</span> {card.label}
              </h3>
              <img
                className="qr-modal__code"
                src={card.qr}
                alt={`QR code to install WordLab on ${card.label}`}
                width={190}
                height={190}
              />
              <p className="qr-modal__url">{card.caption}</p>
              <ol className="qr-modal__steps">
                {card.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {card.id === 'android' && (
                <>
                  <a className="qr-modal__apk" href="/wordlab-android.apk" download>
                    ⬇️ Download the Android app
                  </a>
                  <p className="qr-modal__apk-note">
                    APK · Android 6.0+ · no app store needed
                  </p>
                </>
              )}
            </section>
          ))}
        </div>

        <p className="qr-modal__note">
          Already on this device? Android learners can download the app above, or use the{' '}
          <strong>Install app</strong> button in the top bar to save the site itself.
        </p>
      </div>
    </div>
  );
}
