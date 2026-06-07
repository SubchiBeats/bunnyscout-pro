const $ = (selector) => document.querySelector(selector);
const STORAGE_KEYS = ['profile', 'settings', 'clips'];

async function getStore() {
  const data = await chrome.storage.local.get(STORAGE_KEYS);
  return {
    profile: data.profile || {},
    settings: data.settings || { appUrl: 'http://localhost:8080/index.html', previewBeforeFill: true, highlightFilledFields: true, maxFieldsPerRun: 140 },
    clips: Array.isArray(data.clips) ? data.clips : []
  };
}

async function setStore(patch) {
  await chrome.storage.local.set(patch);
}

function scoreProfile(profile) {
  const keys = ['firstName', 'lastName', 'email', 'phone', 'city', 'state', 'linkedin', 'portfolio', 'currentTitle', 'desiredSalary', 'workAuthorization', 'sponsorship'];
  const filled = keys.filter((key) => String(profile[key] || '').trim()).length;
  return Math.round((filled / keys.length) * 100);
}

function setResult(html) {
  $('#result').innerHTML = html;
}

async function refresh() {
  const { profile, settings, clips } = await getStore();
  $('#clipCount').textContent = clips.length;
  $('#profileScore').textContent = `${scoreProfile(profile)}%`;
  $('#appUrl').value = settings.appUrl || '';
}

async function currentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('No active tab found.');
  if (/^(chrome|edge|about|devtools):/i.test(tab.url || '')) throw new Error('Extensions cannot run on browser settings pages. Open a normal job page first.');
  return tab;
}

async function ensureContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['contentScript.js'] });
  } catch (error) {
    throw new Error(`Could not access this page. Try refreshing it, then click BunnyScout again. ${error.message}`);
  }
}

async function sendToPage(action, payload = {}) {
  const tab = await currentTab();
  await ensureContentScript(tab.id);
  const response = await chrome.tabs.sendMessage(tab.id, { source: 'BunnyScout', action, payload });
  if (!response?.ok) throw new Error(response?.error || 'The page did not respond.');
  return response.result;
}

async function clipCurrentJob() {
  setResult('Clipping the current page...');
  const clip = await sendToPage('clip');
  const { clips } = await getStore();
  const stored = [{ ...clip, id: crypto.randomUUID(), status: 'saved' }, ...clips.filter((item) => item.url !== clip.url)].slice(0, 250);
  await setStore({ clips: stored });
  await navigator.clipboard.writeText(JSON.stringify({ app: 'BunnyScoutClip', version: 1, job: clip }, null, 2));
  setResult(`<strong>Clipped:</strong> ${escapeHtml(clip.company || 'Unknown company')} — ${escapeHtml(clip.title || 'Untitled role')}\n\nCopied BunnyScout import JSON to your clipboard.`);
  await refresh();
}

async function previewFields() {
  const { profile, settings } = await getStore();
  const result = await sendToPage('preview', { profile, settings });
  const lines = result.matches.slice(0, 9).map((item) => `• ${item.key}: ${item.label || item.tag}`);
  setResult(result.matches.length ? `<strong>${result.matches.length} likely fields found.</strong>\n${escapeHtml(lines.join('\n'))}${result.matches.length > 9 ? '\n…' : ''}` : 'No safe matching fields found on this page.');
}

async function autofillPage() {
  const { profile, settings } = await getStore();
  if (settings.previewBeforeFill) {
    const preview = await sendToPage('preview', { profile, settings });
    const ok = confirm(`BunnyScout found ${preview.matches.length} fields it can safely fill. Continue?\n\nIt will skip passwords, SSN, DOB, EEO demographic questions, veteran/disability questions, and file uploads.`);
    if (!ok) return setResult('Autofill canceled.');
  }
  const result = await sendToPage('autofill', { profile, settings });
  setResult(`<strong>Filled ${result.filled.length} field${result.filled.length === 1 ? '' : 's'}.</strong>\nSkipped sensitive, hidden, disabled, password, file-upload, and unknown fields.`);
}

async function openApp() {
  const { settings, clips } = await getStore();
  const latest = clips[0];
  let url = settings.appUrl || 'http://localhost:8080/index.html';
  if (!/^https?:\/\//i.test(url) && !/^file:/i.test(url)) url = `https://${url}`;
  const separator = url.includes('#') ? '&' : '#';
  const smallPayload = latest ? btoa(unescape(encodeURIComponent(JSON.stringify({ app: 'BunnyScoutClip', version: 1, job: latest })))) : '';
  if (smallPayload && smallPayload.length < 6500) {
    url = `${url}${separator}clip=${encodeURIComponent(smallPayload)}`;
  } else if (latest) {
    await navigator.clipboard.writeText(JSON.stringify({ app: 'BunnyScoutClip', version: 1, job: latest }, null, 2));
    url = `${url}${separator}importClip=1`;
  }
  chrome.tabs.create({ url });
}

async function copyLatestClip() {
  const { clips } = await getStore();
  if (!clips.length) return setResult('No clips saved yet.');
  await navigator.clipboard.writeText(JSON.stringify({ app: 'BunnyScoutClip', version: 1, job: clips[0] }, null, 2));
  setResult('Latest clip copied as BunnyScout import JSON.');
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

async function saveAppUrl() {
  const { settings } = await getStore();
  await setStore({ settings: { ...settings, appUrl: $('#appUrl').value.trim() } });
}

$('#clipBtn').addEventListener('click', () => clipCurrentJob().catch((error) => setResult(escapeHtml(error.message))));
$('#previewBtn').addEventListener('click', () => previewFields().catch((error) => setResult(escapeHtml(error.message))));
$('#fillBtn').addEventListener('click', () => autofillPage().catch((error) => setResult(escapeHtml(error.message))));
$('#openAppBtn').addEventListener('click', () => openApp().catch((error) => setResult(escapeHtml(error.message))));
$('#copyClipBtn').addEventListener('click', () => copyLatestClip().catch((error) => setResult(escapeHtml(error.message))));
$('#dashboardBtn').addEventListener('click', () => chrome.runtime.openOptionsPage());
$('#appUrl').addEventListener('change', saveAppUrl);

refresh();
