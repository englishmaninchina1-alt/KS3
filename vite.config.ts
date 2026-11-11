import {
  defineConfig,
  type Plugin,
  type PreviewServer,
  type ViteDevServer,
} from 'vite';
import react from '@vitejs/plugin-react';
import { createStoryHandler } from './server/storyCoach.mjs';

declare const process: { env: Record<string, string | undefined> };

/**
 * The cloud preview serves the dev server through a generated hostname, so it
 * has to be passed to Vite at start-up. Keeping it in an environment variable
 * means no machine-specific hostname is committed to the repository.
 */
const previewHosts = (process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

/** Mounts the server-side story coach under /api/story in dev and preview. */
function storyCoachApi(): Plugin {
  return {
    name: 'wordlab-story-coach',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/story', createStoryHandler());
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use('/api/story', createStoryHandler());
    },
  };
}

export default defineConfig({
  plugins: [react(), storyCoachApi()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    ...(previewHosts.length > 0 ? { allowedHosts: previewHosts } : {}),
  },
  build: {
    outDir: 'dist',
  },
});
