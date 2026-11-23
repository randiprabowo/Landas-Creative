// Hanya pengenal publik aplikasi OAuth yang boleh masuk ke konfigurasi build.
export function remoteBackend({ repository, applicationId, branch }) {
  if (!repository && !applicationId) return null;
  if (!/^[\w.-]+(?:\/[\w.-]+)+$/.test(repository ?? '') ||
      !/^[a-f0-9]{64}$/i.test(applicationId ?? '') || !branch?.trim()) {
    throw new Error('Lengkapi path repository, Application ID GitLab dan branch di src/cms/access.json.');
  }
  return { name: 'gitlab', repo: repository, branch, auth_type: 'pkce', app_id: applicationId, auth_methods: ['oauth'] };
}
