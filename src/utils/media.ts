const youtubeId = /^[A-Za-z0-9_-]{11}$/;

export function parseYouTubeId(value: string): string | undefined {
  const text = value.trim();
  if (youtubeId.test(text)) return text;
  const url = URL.parse(text);
  if (!url || url.protocol !== 'https:' || url.username || url.password || url.port) return;

  let id: string | null | undefined;
  if (url.hostname === 'youtu.be') {
    id = url.pathname.match(/^\/([^/]+)\/?$/)?.[1];
  } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
    id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)\/?$/)?.[1];
  }
  return id && youtubeId.test(id) ? id : undefined;
}

export const modelDirectory = 'src/assets/models';
const modelPath = /^\/?src\/assets\/models\/([a-z0-9][a-z0-9._-]*\.glb)$/i;

export function modelFileName(path: string): string | undefined {
  return path.match(modelPath)?.[1];
}

export function modelHref(path: string): string {
  const file = modelFileName(path);
  if (!file) throw new Error('Gunakan file .glb dari folder src/assets/models.');
  return '/media/model-3d/' + file;
}
