import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'ready' | 'error';

export interface RecorderApi {
  status: RecorderStatus;
  error: string | null;
  seconds: number;
  level: number;
  url: string | null;
  supported: boolean;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

/**
 * Records a short clip with the microphone and exposes a playback URL plus a
 * live input level so learners can see that their voice is being picked up.
 */
export function useRecorder(): RecorderApi {
  const supported =
    typeof navigator !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia;

  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [url, setUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const urlRef = useRef<string | null>(null);
  const secondsRef = useRef(0);

  const cleanupAudio = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setLevel(0);
  }, []);

  const reset = useCallback(() => {
    cleanupAudio();
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setUrl(null);
    setSeconds(0);
    secondsRef.current = 0;
    setError(null);
    setStatus('idle');
  }, [cleanupAudio]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    recorderRef.current = null;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (!supported) {
      setStatus('error');
      setError('This browser cannot record audio. Try Chrome, Edge or Safari on a laptop or phone.');
      return;
    }

    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
      setUrl(null);
    }
    setError(null);
    setStatus('requesting');
    setSeconds(0);
    secondsRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: pickMimeType(),
      });
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const nextUrl = URL.createObjectURL(blob);
        urlRef.current = nextUrl;
        setUrl(nextUrl);
        setStatus(blob.size > 0 ? 'ready' : 'idle');
        cleanupAudio();
      };

      recorder.start();
      setStatus('recording');
      timerRef.current = window.setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
        if (secondsRef.current >= 30) stop();
      }, 1000);

      const AudioCtx = window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const context = new AudioCtx();
        audioContextRef.current = context;
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i += 1) {
            const value = (data[i] - 128) / 128;
            sum += value * value;
          }
          setLevel(Math.min(1, Math.sqrt(sum / data.length) * 4));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }
    } catch (err) {
      cleanupAudio();
      setStatus('error');
      const name = err instanceof DOMException ? err.name : '';
      if (name === 'NotAllowedError' || name === 'SecurityError') {
        setError('Microphone blocked. Allow microphone access in your browser settings, then try again.');
      } else if (name === 'NotFoundError') {
        setError('No microphone found. Plug one in or check your device settings.');
      } else {
        setError('We could not start the microphone. Please try again.');
      }
    }
  }, [cleanupAudio, stop, supported]);

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      cleanupAudio();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [cleanupAudio]);

  return { status, error, seconds, level, url, supported, start, stop, reset };
}
