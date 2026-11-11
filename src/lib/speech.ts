import { useEffect, useState } from 'react';

export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

let preferredVoiceURI: string | null = null;

export function setPreferredVoice(uri: string | null) {
  preferredVoiceURI = uri;
}

export function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith('en'));
}

export function chooseVoice(): SpeechSynthesisVoice | undefined {
  const voices = getEnglishVoices();
  if (preferredVoiceURI) {
    const match = voices.find((voice) => voice.voiceURI === preferredVoiceURI);
    if (match) return match;
  }
  const british = voices.find((voice) => voice.lang.replace('_', '-') === 'en-GB');
  return british ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) ?? voices[0];
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
}

/** Speaks a word or phrase in English, cancelling anything already playing. */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  if (!speechSupported || !text.trim()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = chooseVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? 'en-GB';
  utterance.rate = Math.min(1.6, Math.max(0.4, options.rate ?? 0.9));
  utterance.pitch = options.pitch ?? 1.05;
  utterance.volume = 1;
  if (options.onEnd) utterance.onend = () => options.onEnd?.();
  synth.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (speechSupported) window.speechSynthesis.cancel();
}

/** Returns the browser's English voices once they have loaded. */
export function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => getEnglishVoices());

  useEffect(() => {
    if (!speechSupported) return;
    const update = () => setVoices(getEnglishVoices());
    update();
    window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, []);

  return voices;
}
