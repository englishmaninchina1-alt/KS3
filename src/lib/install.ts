import { useEffect, useState } from 'react';

/**
 * Wraps the browser's `beforeinstallprompt` flow.
 *
 * Chromium browsers fire the event only when the app is actually installable
 * (manifest, icons, an active service worker) and the learner has shown a bit
 * of interest. We stash the event so a button in the nav can call `prompt()`
 * later — the event may only be used once, so it is dropped afterwards.
 *
 * Safari on iOS has no event at all, so the button simply never appears there.
 */
interface InstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** True once the app is running from the home screen / desktop install. */
function isInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches === true;
  const iOSStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return standalone || iOSStandalone;
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Stop the browser's own mini-infobar; the nav button is our only prompt.
    event.preventDefault();
    deferredPrompt = event as InstallPromptEvent;
    emit();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    emit();
  });
}

export function useInstallPrompt() {
  const [available, setAvailable] = useState(() => deferredPrompt !== null && !isInstalled());

  useEffect(() => {
    const update = () => setAvailable(deferredPrompt !== null && !isInstalled());
    listeners.add(update);
    update();
    window.addEventListener('appinstalled', update);
    return () => {
      listeners.delete(update);
      window.removeEventListener('appinstalled', update);
    };
  }, []);

  const install = async () => {
    const prompt = deferredPrompt;
    if (!prompt) return;
    // One use only: never offer the button again for this page view.
    deferredPrompt = null;
    setAvailable(false);
    emit();
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      /* the learner dismissed it, or the browser refused — the app still works */
    }
  };

  return { canInstall: available, install };
}
