/**
 * Production server: serves the built Vite app from `dist` and the same story
 * coach API used by the dev middleware. Run `npm run build && npm start`.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStoryHandler } from './storyCoach.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT ?? 3000);
const storyHandler = createStoryHandler();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  const pathname = (req.url ?? '/').split('?')[0];

  if (pathname === '/api/story') {
    await storyHandler(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.end('Method not allowed');
    return;
  }

  let decoded = '/';
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  const candidate = path.resolve(dist, `.${decoded === '/' ? '/index.html' : decoded}`);
  if (candidate !== path.join(dist, 'index.html') && !candidate.startsWith(`${dist}${path.sep}`)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  try {
    const file = await readFile(candidate);
    res.setHeader('Content-Type', MIME_TYPES[path.extname(candidate)] ?? 'application/octet-stream');
    res.end(file);
    return;
  } catch {
    /* fall through to the single-page app shell */
  }

  try {
    const shell = await readFile(path.join(dist, 'index.html'));
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(shell);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Build the site first with `npm run build`.');
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`WordLab KS3 is running at http://localhost:${port}`);
});
