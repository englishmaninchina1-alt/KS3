export interface StoryPlan {
  genre: string;
  character: string;
  setting: string;
  problem: string;
  topic: string;
  targetWords: string[];
}

export interface CoachTurn {
  role: 'student' | 'coach';
  content: string;
}

export interface CoachReply {
  reply: string;
  words: string[];
  remaining: number | null;
}

export class CoachError extends Error {
  code: string;

  constructor(message: string, code = 'coach_error') {
    super(message);
    this.name = 'CoachError';
    this.code = code;
  }
}

interface CoachResponseBody {
  error?: unknown;
  message?: unknown;
  reply?: unknown;
  words?: unknown;
  remaining?: unknown;
}

export async function askStoryCoach(turns: CoachTurn[], plan: StoryPlan): Promise<CoachReply> {
  let response: Response;
  try {
    response = await fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: turns.slice(-10), plan }),
    });
  } catch {
    throw new CoachError(
      'Could not reach the story coach. Check your internet connection and try again.',
      'network',
    );
  }

  const data = (await response.json().catch(() => null)) as CoachResponseBody | null;

  if (!response.ok) {
    const message =
      typeof data?.message === 'string' && data.message.trim()
        ? data.message
        : 'Coach Maple is taking a break. Please try again in a moment.';
    throw new CoachError(message, typeof data?.error === 'string' ? data.error : 'coach_error');
  }

  const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
  if (!reply) throw new CoachError('Coach Maple sent an empty reply. Please try again.', 'empty_reply');

  const words = Array.isArray(data?.words)
    ? data.words.filter((word): word is string => typeof word === 'string').slice(0, 3)
    : [];

  return {
    reply,
    words,
    remaining: typeof data?.remaining === 'number' ? data.remaining : null,
  };
}
