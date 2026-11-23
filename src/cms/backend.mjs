// Konfigurasi ini masuk ke build publik. Token dimasukkan melalui halaman login CMS.
export function remoteBackend({ provider = 'gitlab', repository, applicationId, branch }) {
  if (!repository && !applicationId) return null;
  if (!branch?.trim()) {
    throw new Error('Isi branch di src/cms/access.json.');
  }
  if (provider === 'github') {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || applicationId) {
      throw new Error('Isi repository GitHub dengan format pemilik/nama-repo. Biarkan applicationId kosong.');
    }
    return { name: 'github', repo: repository, branch, auth_methods: ['token'] };
  }
  if (provider !== 'gitlab') {
    throw new Error('Pilih provider github atau gitlab di src/cms/access.json.');
  }
  if (!/^[\w.-]+(?:\/[\w.-]+)+$/.test(repository ?? '') ||
      !/^[a-f0-9]{64}$/i.test(applicationId ?? '')) {
    throw new Error('Lengkapi path repository dan Application ID GitLab di src/cms/access.json.');
  }
  return { name: 'gitlab', repo: repository, branch, auth_type: 'pkce', app_id: applicationId, auth_methods: ['oauth'] };
}
