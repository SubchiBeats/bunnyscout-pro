const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const PROFILE_KEYS = ['firstName','lastName','email','phone','address1','city','state','zip','linkedin','portfolio','github','website','currentCompany','currentTitle','desiredSalary','yearsExperience','workAuthorization','sponsorship','summary','coverLetter'];

async function store() {
  const data = await chrome.storage.local.get(['profile', 'settings', 'clips']);
  return { profile: data.profile || {}, settings: data.settings || {}, clips: Array.isArray(data.clips) ? data.clips : [] };
}

async function render() {
  const { profile, settings, clips } = await store();
  const form = $('#profileForm');
  PROFILE_KEYS.forEach((key) => { if (form.elements[key]) form.elements[key].value = profile[key] || ''; });
  $('#appUrl').value = settings.appUrl || 'http://localhost:8080/index.html';
  $('#maxFieldsPerRun').value = settings.maxFieldsPerRun || 140;
  $('#previewBeforeFill').checked = settings.previewBeforeFill !== false;
  $('#highlightFilledFields').checked = settings.highlightFilledFields !== false;
  $('#clipsList').innerHTML = clips.length ? clips.map((clip, index) => clipCard(clip, index)).join('') : '<p>No clips yet. Open a job posting, click the BunnyScout extension, then choose “Clip this job.”</p>';
  attachClipHandlers();
}

function clipCard(clip, index) {
  const salary = clip.salaryText || (clip.salaryMin || clip.salaryMax ? `$${Number(clip.salaryMin || 0).toLocaleString()} - $${Number(clip.salaryMax || 0).toLocaleString()}` : 'Salary unknown');
  return `<article class="clip">
    <div>
      <h3>${escapeHtml(clip.company || 'Unknown company')} — ${escapeHtml(clip.title || 'Untitled role')}</h3>
      <p>${escapeHtml(clip.location || 'Location unknown')} · ${escapeHtml(salary)} · ${escapeHtml(clip.source || 'Source unknown')}</p>
      <div class="meta"><span class="pill">${escapeHtml(new Date(clip.clippedAt || Date.now()).toLocaleString())}</span><span class="pill">${escapeHtml((clip.jd || '').length.toLocaleString())} JD chars</span></div>
    </div>
    <div class="actions small">
      ${clip.url ? `<a class="file-btn" href="${escapeHtml(clip.url)}" target="_blank" rel="noreferrer">Open</a>` : ''}
      <button data-copy="${index}" type="button">Copy JSON</button>
      <button data-delete="${index}" type="button">Delete</button>
    </div>
  </article>`;
}

function attachClipHandlers() {
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const { clips } = await store();
    const clip = clips[Number(btn.dataset.copy)];
    await navigator.clipboard.writeText(JSON.stringify({ app: 'BunnyScoutClip', version: 1, job: clip }, null, 2));
    btn.textContent = 'Copied';
    setTimeout(() => btn.textContent = 'Copy JSON', 1200);
  }));
  $$('[data-delete]').forEach((btn) => btn.addEventListener('click', async () => {
    const { clips } = await store();
    clips.splice(Number(btn.dataset.delete), 1);
    await chrome.storage.local.set({ clips });
    render();
  }));
}

async function saveProfile() {
  const values = Object.fromEntries(new FormData($('#profileForm')).entries());
  await chrome.storage.local.set({ profile: values });
  alert('Profile saved.');
}

async function saveSettings() {
  const { settings } = await store();
  await chrome.storage.local.set({ settings: {
    ...settings,
    appUrl: $('#appUrl').value.trim() || 'http://localhost:8080/index.html',
    maxFieldsPerRun: Number($('#maxFieldsPerRun').value || 140),
    previewBeforeFill: $('#previewBeforeFill').checked,
    highlightFilledFields: $('#highlightFilledFields').checked
  }});
  alert('Settings saved.');
}

async function exportBackup() {
  const data = await store();
  const blob = new Blob([JSON.stringify({ app: 'BunnyScoutExtension', version: 1, exportedAt: new Date().toISOString(), ...data }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bunnyscout-extension-backup-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importBackup(file) {
  const parsed = JSON.parse(await file.text());
  if (parsed.app !== 'BunnyScoutExtension') throw new Error('Not a BunnyScout extension backup.');
  await chrome.storage.local.set({ profile: parsed.profile || {}, settings: parsed.settings || {}, clips: Array.isArray(parsed.clips) ? parsed.clips : [] });
  render();
}

async function copyAll() {
  const { clips } = await store();
  await navigator.clipboard.writeText(JSON.stringify({ app: 'BunnyScoutClipBundle', version: 1, jobs: clips }, null, 2));
  alert('All clips copied as BunnyScout JSON.');
}

async function clearClips() {
  if (!confirm('Clear all saved clips in the extension?')) return;
  await chrome.storage.local.set({ clips: [] });
  render();
}

function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

$('#saveProfileBtn').addEventListener('click', saveProfile);
$('#saveSettingsBtn').addEventListener('click', saveSettings);
$('#exportBtn').addEventListener('click', exportBackup);
$('#copyAllBtn').addEventListener('click', copyAll);
$('#clearClipsBtn').addEventListener('click', clearClips);
$('#importInput').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try { await importBackup(file); }
  catch (error) { alert(error.message); }
});
render();
