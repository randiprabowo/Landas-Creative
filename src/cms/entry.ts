import html from './index.html?raw';
import type { APIRoute } from 'astro';
import access from './access.json';
import { remoteBackend } from './backend.mjs';

export const GET: APIRoute = ({ url }) => {
  const localOnly = !remoteBackend(access);
  if (localOnly && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    return new Response('Buka editor lokal melalui localhost di komputer pemilik berkas.', { status: 403 });
  }
  // Only the directory picker is relevant before a real remote repository is configured.
  const localHead = `<meta http-equiv="Content-Security-Policy" content="connect-src 'self' blob: data: https://unpkg.com https://cdn.jsdelivr.net">
    <style>#nc-root .buttons:has(> button.primary) > button.secondary { display: none }</style>`;
  return new Response(localOnly ? html.replace('</head>', localHead + '</head>') : html,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
