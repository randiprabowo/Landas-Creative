import { collections } from './collections';
import { settings } from './settings';
import access from './access.json';
import { remoteBackend } from './backend.mjs';

export function GET() {
  // Sveltia requires a Git backend identifier even for its directory-picker workflow.
  const backend = remoteBackend(access) ?? { name: 'github', repo: 'local/Landas-Creative', auth_methods: ['token'] };
  return Response.json({
    backend, app_title: 'Landas Creative · Pengelola konten',
    media_folder: 'src/assets/photos', public_folder: '/src/assets/photos',
    media_libraries: { stock_assets: false },
    editor: { preview: false }, output: { omit_empty_optional_fields: true, yaml: { quote: 'single' } },
    collections: [{ name: 'settings', label: 'Halaman dan data bisnis', files: settings }, ...collections],
  });
}
