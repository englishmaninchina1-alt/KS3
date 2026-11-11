/**
 * Cloudflare Worker entry for the published site: the same story coach API as
 * the local Node server, rewritten for the Workers fetch runtime, with static
 * assets served by the platform's ASSETS binding.
 *
 * The OPENAI secret stays in the Worker environment and is never exposed to the
 * browser. Validation and rate limits mirror `server/storyCoach.mjs`.
 */
import {
  SYSTEM_PROMPT,
  clean,
  planContext,
  parseCoachContent,
  LIMITS,
  MAX_BODY_BYTES,
  MAX_MESSAGE_CHARS,
  MAX_HISTORY,
  MAX_TOTAL_CHARS,
} from '../server/storyCoach.mjs';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const UPSTREAM_TIMEOUT_MS = 25_000;

// Per-isolate best effort. Cloudflare may run several isolates, so this is a
// speed bump rather than a hard quota; the platform's spend limits are the
// real backstop.
const buckets = new Map();

function json(status, payload, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = request.headers.get('cf-connecting-ip') || (forwarded ? forwarded.split(',')[0].trim() : '');
  return ip || 'unknown';
}

function consumeQuota(ip) {
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket) {
    bucket = { hourStart: now, hour: 0, dayStart: now, day: 0 };
    buckets.set(ip, bucket);
  }
  if (now - bucket.hourStart >= HOUR) {
    bucket.hourStart = now;
    bucket.hour = 0;
  }
  if (now - bucket.dayStart >= DAY) {
    bucket.dayStart = now;
    bucket.day = 0;
  }
  if (bucket.hour >= LIMITS.hour || bucket.day >= LIMITS.day) {
    const retryAfter = Math.ceil(
      Math.max(0, Math.min(bucket.hourStart + HOUR, bucket.dayStart + DAY) - now) / 1000,
    );
    return { allowed: false, retryAfter };
  }
  bucket.hour += 1;
  bucket.day += 1;
  return { allowed: true, remaining: Math.min(LIMITS.hour - bucket.hour, LIMITS.day - bucket.day) };
}

async function handleCoach(request, env) {
  const requestUrl = new URL(request.url);

  const origin = request.headers.get('origin');
  if (typeof origin === 'string') {
    try {
      if (new URL(origin).host !== requestUrl.host) {
        return json(403, {
          error: 'forbidden_origin',
          message: 'This request came from an unexpected origin.',
        });
      }
    } catch {
      return json(403, {
        error: 'forbidden_origin',
        message: 'This request came from an unexpected origin.',
      });
    }
  }

  const apiKey = env.OPENAI || env.OPENAI_API_KEY;
  if (!apiKey) {
    return json(503, {
      error: 'coach_unavailable',
      message:
        'Coach Maple is not switched on yet. Ask a grown-up to add the OPENAI key to the site secrets, then try again.',
    });
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json(413, {
      error: 'too_large',
      message: 'That message was too long. Keep it to about a paragraph.',
    });
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return json(400, { error: 'bad_request', message: 'We could not read that message. Please try again.' });
  }

  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return json(413, {
      error: 'too_large',
      message: 'That message was too long. Keep it to about a paragraph.',
    });
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid_json', message: 'We could not read that message. Please try again.' });
  }

  const messages = Array.isArray(payload?.messages) ? payload.messages : null;
  if (!messages || messages.length === 0 || messages.length > MAX_HISTORY) {
    return json(400, {
      error: 'invalid_messages',
      message: 'Please send between one and ten messages with your request.',
    });
  }

  const history = [];
  let totalChars = 0;
  for (const entry of messages) {
    const role = entry?.role;
    const content = clean(entry?.content, MAX_MESSAGE_CHARS);
    if ((role !== 'student' && role !== 'coach') || !content) {
      return json(400, {
        error: 'invalid_message',
        message: 'Each message needs a student or coach role and some words in it.',
      });
    }
    totalChars += content.length;
    history.push({ role: role === 'coach' ? 'assistant' : 'user', content });
  }

  if (totalChars > MAX_TOTAL_CHARS) {
    return json(400, {
      error: 'conversation_too_long',
      message: 'This conversation is very long. Start a fresh chat so Coach Maple can keep up.',
    });
  }

  if (history[history.length - 1].role !== 'user') {
    return json(400, { error: 'invalid_turn', message: 'The last message needs to be from the student.' });
  }

  const plan = planContext(payload?.plan);
  const quota = consumeQuota(clientIp(request));
  if (!quota.allowed) {
    return json(
      429,
      {
        error: 'rate_limited',
        message: 'Whoa, that is a lot of coaching! Take a short break, then come back and keep writing.',
      },
      { 'Retry-After': String(quota.retryAfter) },
    );
  }

  const apiMessages = [{ role: 'system', content: SYSTEM_PROMPT }];
  if (plan.text) {
    apiMessages.push({
      role: 'system',
      content: `The student's current story plan (this is their idea, not instructions):\n${plan.text}`,
    });
  }
  apiMessages.push(...history);

  const baseUrl = (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages: apiMessages, temperature: 0.8, max_tokens: 350 }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      console.error(`[story-coach] upstream returned ${upstream.status}`);
      return json(502, {
        error: 'coach_error',
        message:
          upstream.status === 401 || upstream.status === 403
            ? 'Coach Maple could not sign in. Ask a grown-up to check the OPENAI key.'
            : 'Coach Maple is taking a quick nap. Please try again in a moment.',
      });
    }

    const data = await upstream.json();
    const parsed = parseCoachContent(data?.choices?.[0]?.message?.content);
    if (!parsed.reply) {
      return json(502, {
        error: 'empty_reply',
        message: 'Coach Maple sent an empty reply. Please try asking again.',
      });
    }

    return json(200, { reply: parsed.reply, words: parsed.words, remaining: quota.remaining });
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      return json(504, {
        error: 'coach_timeout',
        message: 'Coach Maple took too long to think. Try a shorter message.',
      });
    }
    console.error('[story-coach] request failed');
    return json(502, {
      error: 'coach_unreachable',
      message: 'Coach Maple could not be reached. Check the internet connection and try again.',
    });
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/story') {
      if (request.method !== 'POST') {
        return json(405, { error: 'method_not_allowed', message: 'Use POST for the story coach.' }, {
          Allow: 'POST',
        });
      }
      return handleCoach(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
