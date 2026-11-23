import { defineConfig } from 'astro/config';
import siteSettings from './src/data/site.json' with { type: 'json' };
import editorAccess from './src/cms/access.json' with { type: 'json' };
import { remoteBackend } from './src/cms/backend.mjs';

const onlineEditor = remoteBackend(editorAccess);

/** @type {import('astro').AstroIntegration} */
const developmentPreview = {
  name: 'landas-development-preview',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev' || onlineEditor) {
        const editorRoute = (pattern, file) => injectRoute({ pattern, entrypoint: new URL('./src/cms/' + file, import.meta.url) });
        editorRoute('/admin/index.html', 'entry.ts');
        editorRoute('/admin/config.json', 'config-route.ts');
        editorRoute('/admin/runtime/[...asset]', 'runtime.ts');
      }
      if (command === 'dev') {
        injectRoute({ pattern: '/_preview/kartu', entrypoint: new URL('./src/dev/preview.astro', import.meta.url) });
        injectRoute({ pattern: '/_preview/detail/[jenis]', entrypoint: new URL('./src/dev/detail.astro', import.meta.url) });
        injectRoute({ pattern: '/_preview/interaksi', entrypoint: new URL('./src/dev/interactions.astro', import.meta.url) });
      }
    },
  },
};

// Tidak mengisi domain buatan; konfigurasi hanya mengikuti domain yang disetujui.
export default defineConfig({
  site: siteSettings.siteUrl ?? undefined,
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  vite: {
    plugins: [{
      name: 'landas-admin-local-url',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!/^\/admin\/?(?:\?|$)/.test(req.url ?? '')) return next();
          res.writeHead(302, { Location: '/admin/index.html' });
          res.end();
        });
      },
    }],
  },
  integrations: [developmentPreview],
});
