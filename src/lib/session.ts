import { useSyncExternalStore } from 'react';
import { adoptAnonymousProgress, setProgressLearner } from './storage';

const LEARNERS_KEY = 'wordlab-learners-v1';
const ACTIVE_KEY = 'wordlab-active-learner-v1';
const MAX_LEARNERS = 12;
const MAX_NAME = 24;
const MIN_PASSWORD = 4;
const MAX_PASSWORD = 64;
const SALT_BYTES = 16;
const PBKDF2_ITERATIONS = 120_000;
const GUEST_ID = 'guest';
/** Kept in sessionStorage so a guest stays a guest on reload but not in a new tab. */
const GUEST_KEY = 'wordlab-guest-v1';

export interface Learner {
  id: string;
  name: string;
  createdAt: number;
}

/** Stored shape: the password is only ever kept as a salted PBKDF2 hash. */
interface StoredLearner extends Learner {
  salt?: string;
  hash?: string;
}

const guest: Learner = { id: GUEST_ID, name: 'Guest', createdAt: 0 };

export type SignInResult =
  | { ok: true; learner: Learner; created: boolean }
  | { ok: false; message: string };

const listeners = new Set<() => void>();

function storageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function secretsAvailable(): boolean {
  return (
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  );
}

function toPublic(learner: StoredLearner): Learner {
  return { id: learner.id, name: learner.name, createdAt: learner.createdAt };
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  return toBase64(new Uint8Array(bits));
}

function sameHash(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function readLearners(): StoredLearner[] {
  if (!storageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(LEARNERS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is StoredLearner =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as StoredLearner).id === 'string' &&
          typeof (item as StoredLearner).name === 'string',
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: typeof item.createdAt === 'number' ? item.createdAt : 0,
        salt: typeof item.salt === 'string' ? item.salt : undefined,
        hash: typeof item.hash === 'string' ? item.hash : undefined,
      }))
      .slice(0, MAX_LEARNERS);
  } catch {
    return [];
  }
}

function readGuest(): boolean {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(GUEST_KEY) === '1';
  } catch {
    return false;
  }
}

function writeGuest(on: boolean) {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return;
  try {
    if (on) {
      window.sessionStorage.setItem(GUEST_KEY, '1');
    } else {
      window.sessionStorage.removeItem(GUEST_KEY);
    }
  } catch {
    /* guest mode still works for this page view */
  }
}

function readActiveId(): string | null {
  if (!storageAvailable()) return null;
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

let learners: StoredLearner[] = readLearners();
let active: Learner | null =
  learners.find((learner) => learner.id === readActiveId()) ?? (readGuest() ? guest : null);

// Point saved progress at the learner who was signed in when the page loaded.
setProgressLearner(active?.id ?? null);

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function persist() {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(LEARNERS_KEY, JSON.stringify(learners));
    if (active && active.id !== GUEST_ID) {
      window.localStorage.setItem(ACTIVE_KEY, active.id);
    } else {
      window.localStorage.removeItem(ACTIVE_KEY);
    }
  } catch {
    /* the signed-in learner still works for this browser session */
  }
}

function makeId(): string {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `learner-${random}`;
}

function activate(learner: StoredLearner) {
  active = learner;
  writeGuest(false);
  setProgressLearner(learner.id);
  persist();
  emit();
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
}

/** The saved profile with this name, if there is one. */
export function findLearner(rawName: string): Learner | null {
  const name = cleanName(rawName);
  if (!name) return null;
  const match = learners.find((learner) => learner.name.toLowerCase() === name.toLowerCase());
  return match ? toPublic(match) : null;
}

export function listLearners(): Learner[] {
  return learners.map(toPublic);
}

export function useLearner(): Learner | null {
  return useSyncExternalStore(subscribe, () => active);
}

/**
 * Sign in to an existing profile, or create one when the name is new.
 * Passwords never leave the browser: only a salted PBKDF2 hash is stored.
 */
export async function signIn(rawName: string, password: string): Promise<SignInResult> {
  const name = cleanName(rawName);
  if (!name) return { ok: false, message: 'Type your first name.' };
  if (password.length < MIN_PASSWORD) {
    return { ok: false, message: `Use at least ${MIN_PASSWORD} characters for your password.` };
  }
  if (password.length > MAX_PASSWORD) {
    return { ok: false, message: 'That password is too long — keep it under 64 characters.' };
  }
  if (!secretsAvailable()) {
    return {
      ok: false,
      message: 'This browser cannot check passwords. Try a newer browser, or leave private mode.',
    };
  }

  const existing = learners.find((learner) => learner.name.toLowerCase() === name.toLowerCase());

  try {
    if (existing && existing.salt && existing.hash) {
      const attempt = await derive(password, fromBase64(existing.salt));
      if (!sameHash(attempt, existing.hash)) {
        return { ok: false, message: `That password does not match ${existing.name}. Try again.` };
      }
      activate(existing);
      return { ok: true, learner: toPublic(existing), created: false };
    }

    const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    const hash = await derive(password, salt);

    if (existing) {
      // Profiles made before passwords existed get one the first time they sign in.
      existing.salt = toBase64(salt);
      existing.hash = hash;
      activate(existing);
      return { ok: true, learner: toPublic(existing), created: false };
    }

    const learner: StoredLearner = {
      id: makeId(),
      name,
      createdAt: Date.now(),
      salt: toBase64(salt),
      hash,
    };
    const firstOnDevice = learners.length === 0;
    learners = [learner, ...learners].slice(0, MAX_LEARNERS);
    // Keep any progress made before sign-in was added for the first learner.
    if (firstOnDevice) adoptAnonymousProgress(learner.id);

    activate(learner);
    return { ok: true, learner: toPublic(learner), created: true };
  } catch {
    return { ok: false, message: 'Something went wrong checking that password. Please try again.' };
  }
}

/** Play without a profile: no name or password, progress stays in this browser. */
export function startGuest() {
  active = guest;
  writeGuest(true);
  setProgressLearner(GUEST_ID);
  persist();
  emit();
}

export function isGuest(learner: Learner | null): boolean {
  return learner?.id === GUEST_ID;
}

export function signOut() {
  active = null;
  writeGuest(false);
  setProgressLearner(null);
  persist();
  emit();
}

/** Namespace a storage key so saved work belongs to the signed-in learner. */
export function profileKey(base: string): string {
  return active ? `${base}::${active.id}` : base;
}
