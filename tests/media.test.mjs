import test from 'node:test';
import assert from 'node:assert/strict';
import { modelHref, parseYouTubeId } from '../src/utils/media.ts';
import { supplementalMedia } from '../src/schemas/media.ts';
import { consultationLink } from '../src/utils/whatsapp.ts';

const videoId = 'A0b1C2d3-E_';

test('URL dan ID dari beberapa format YouTube mengarah ke ID video yang sama', () => {
  const urls = [
    videoId, `https://www.youtube.com/watch?v=${videoId}&t=15`,
    `https://youtu.be/${videoId}?si=abc`, `https://m.youtube.com/shorts/${videoId}`,
    `https://youtube.com/live/${videoId}`, `https://www.youtube-nocookie.com/embed/${videoId}`,
  ];
  for (const url of urls) assert.equal(parseYouTubeId(url), videoId);
  for (const url of ['https://www.youtube.com/@landas', 'https://youtube.com.example.test/watch?v=' + videoId,
    'https://www.youtube.com:444/watch?v=' + videoId, 'https://editor@youtu.be/' + videoId, 'http://youtu.be/' + videoId,
    'https://www.youtube.com/playlist?list=123', '<iframe></iframe>']) {
    assert.equal(parseYouTubeId(url), undefined, url);
  }
});

test('media opsional memerlukan data lengkap dan izin terpisah', () => {
  const { video, model } = supplementalMedia;
  assert.equal(video.parse(undefined), undefined);
  assert.equal(model.parse(undefined), undefined);
  assert.equal(video.parse({ url: videoId, title: 'Video uji' }).permissionConfirmed, false);
  const src = '/src/assets/models/model-uji.glb';
  assert.equal(model.parse({ src, title: 'Model uji', caption: 'Visualisasi uji' }).permissionConfirmed, false);
  assert.equal(modelHref(src), '/media/model-3d/model-uji.glb');
  assert.equal(model.safeParse({ src, title: 'Model uji', caption: ' ' }).success, false);
  for (const path of ['src/assets/models/../a.glb', 'src/assets/models/x.gltf', 'https://example.test/model.glb']) {
    assert.equal(model.safeParse({ src: path, title: 'Model uji', caption: 'Visualisasi uji' }).success, false);
  }
});

test('tombol konsultasi detail membawa referensi ke formulir', () => {
  assert.equal(consultationLink('properti', 'rumah-a'), '/kontak?properti=rumah-a#pesan');
  assert.equal(consultationLink('layanan', 'sumur-bor', true), '/_preview/interaksi?layanan=layanan#pesan');
});
