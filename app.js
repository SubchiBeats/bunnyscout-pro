const STORAGE_KEY = 'bunnyscout:v1';
const DB_NAME = 'bunnyscout-files';
const DB_VERSION = 1;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const STATUSES = [
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'interview', label: 'Interview' },
  { value: 'heardback', label: 'Heard back' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'ghosted', label: 'Likely ghosted' }
];

const ROLE_BANDS = {
  communications: {
    label: 'Communications / Marketing Specialist',
    base: [52000, 68000, 85000, 105000],
    keywords: ['communications', 'marketing', 'content', 'social media', 'newsletter', 'campaign']
  },
  project: {
    label: 'Project / Program Coordinator',
    base: [50000, 65000, 82000, 103000],
    keywords: ['project', 'program', 'coordinator', 'operations', 'timeline', 'stakeholder']
  },
  accessibility: {
    label: '508 / Accessibility Specialist',
    base: [62000, 82000, 105000, 132000],
    keywords: ['508', 'accessibility', 'wcag', 'pdf remediation', 'ada', 'compliance']
  },
  web: {
    label: 'Front-End / Web Developer',
    base: [65000, 90000, 120000, 155000],
    keywords: ['html', 'css', 'javascript', 'react', 'web developer', 'front-end']
  },
  product: {
    label: 'Product / UX / Digital PM',
    base: [76000, 102000, 135000, 175000],
    keywords: ['product', 'ux', 'roadmap', 'analytics', 'user research', 'digital']
  },
  data: {
    label: 'Data / Reporting Analyst',
    base: [60000, 82000, 108000, 140000],
    keywords: ['data', 'reporting', 'analytics', 'sql', 'dashboard', 'excel']
  }
};

const SKILL_TERMS = [
  '508 compliance', 'accessibility', 'wcag', 'pdf remediation', 'adobe acrobat', 'quality assurance', 'qa', 'social media', 'content strategy',
  'newsletter', 'email marketing', 'copywriting', 'editing', 'project management', 'stakeholder management', 'workfront', 'asana', 'jira',
  'html', 'css', 'javascript', 'react', 'netlify', 'github', 'figma', 'wordpress', 'drupal', 'seo', 'analytics', 'google analytics',
  'health communications', 'science communications', 'nih', 'federal', 'government contracting', 'client management', 'webinar',
  'event promotion', 'transcription', 'plain language', 'spanish', 'linkedin', 'facebook', 'x', 'twitter', 'ux', 'ui', 'crm', 'salesforce',
  'data visualization', 'excel', 'powerpoint', 'indesign', 'adobe creative cloud', 'cms', 'api', 'responsive design', 'mobile', 'security'
];

const RECRUITER_SEEDS = [
  { name: 'Robert Half', focus: 'Marketing, creative, tech, admin, finance', region: 'Washington + remote', url: 'https://www.roberthalf.com/us/en/jobs', notes: 'Good starter for contract, contract-to-hire, and permanent roles.' },
  { name: 'Creative Circle', focus: 'Creative, marketing, content, design', region: 'Remote + major metros', url: 'https://www.creativecircle.com/jobs/', notes: 'Useful for web, content, social, and freelance/contract opportunities.' },
  { name: 'Aquent', focus: 'Marketing, creative, UX, content, digital', region: 'Remote + U.S.', url: 'https://aquent.com/find-work/', notes: 'Often posts digital marketing and UX/content roles.' },
  { name: 'TEKsystems', focus: 'IT, web, software, support, project roles', region: 'Seattle + remote', url: 'https://www.teksystems.com/en/careers', notes: 'Useful when pivoting toward web/dev/technical project work.' },
  { name: 'Insight Global', focus: 'Tech, operations, healthcare, government', region: 'U.S. + remote', url: 'https://jobs.insightglobal.com/', notes: 'Broad staffing firm with contract and contract-to-hire roles.' },
  { name: 'Apex Systems', focus: 'Technology, business, healthcare, government', region: 'U.S. + remote', url: 'https://www.apexsystems.com/job-seekers', notes: 'Good for IT-adjacent and federal contractor opportunities.' },
  { name: 'Beacon Hill', focus: 'Technology, creative, legal, admin, pharma', region: 'U.S. + remote', url: 'https://beaconhillstaffing.com/job-search/', notes: 'Worth checking for comms/project roles and tech contracts.' },
  { name: 'Randstad', focus: 'Business, tech, operations, admin', region: 'U.S. + remote', url: 'https://www.randstadusa.com/jobs/', notes: 'Useful for volume searches and operations/project support roles.' },
  { name: 'Kforce', focus: 'Technology and finance/accounting', region: 'U.S. + remote', url: 'https://www.kforce.com/find-work/search-jobs/', notes: 'Good if targeting web, product, analyst, or IT project roles.' },
  { name: 'USAJOBS', focus: 'Federal jobs', region: 'U.S.', url: 'https://www.usajobs.gov/Search/Results?k=communications', notes: 'Use for direct federal roles; tailor your federal resume separately.' }
];

const DEFAULT_STATE = {
  version: 1,
  createdAt: new Date().toISOString(),
  profile: {
    name: '', email: '', phone: '', location: '', targetTitles: '', skills: '', links: '', resumeText: '', commonAnswers: ''
  },
  jobs: [],
  recruiters: RECRUITER_SEEDS,
  settings: {
    ghostDays: 21,
    followupDays: 7,
    showConfetti: true
  }
};

let state = loadState();
let lastAnalysis = null;
let activeView = 'dashboard';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const fmt = new Intl.NumberFormat('en-US');
const money = (value) => Number.isFinite(value) ? `$${fmt.format(Math.round(value))}` : '—';
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const uid = () => crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ').replace(/\s+/g, ' ').trim();
const compact = (value = '') => value.replace(/\s+/g, ' ').trim();
const statusLabel = (value) => STATUSES.find((s) => s.value === value)?.label || value;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      recruiters: parsed.recruiters?.length ? parsed.recruiters : RECRUITER_SEEDS,
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : []
    };
  } catch (error) {
    console.error(error);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderAll();
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

async function copyText(text, label = 'Copied') {
  try {
    await navigator.clipboard.writeText(text || '');
    showToast(label);
  } catch {
    const temp = document.createElement('textarea');
    temp.value = text || '';
    document.body.append(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    showToast(label);
  }
}

function daysBetween(dateValue, endDate = new Date()) {
  if (!dateValue) return 0;
  const start = new Date(dateValue);
  if (Number.isNaN(start.getTime())) return 0;
  return Math.floor((endDate - start) / 86400000);
}

function calcFollowUpDate(base = todayISO()) {
  const date = new Date(base);
  date.setDate(date.getDate() + Number(state.settings.followupDays || 7));
  return date.toISOString().slice(0, 10);
}

function isLikelyGhosted(job) {
  if (job.status === 'ghosted') return true;
  if (!['applied', 'waiting'].includes(job.status)) return false;
  const anchor = job.dateApplied || job.updatedAt || job.createdAt;
  return daysBetween(anchor) >= Number(state.settings.ghostDays || 21);
}

function populateStatusSelects() {
  const html = STATUSES.map((s) => `<option value="${s.value}">${s.label}</option>`).join('');
  $('#newJobStatus').innerHTML = html;
  $('#statusFilter').innerHTML = `<option value="all">All statuses</option>${html}`;
}

function populateSalaryRoles() {
  $('#salaryRole').innerHTML = Object.entries(ROLE_BANDS)
    .map(([key, role]) => `<option value="${key}">${role.label}</option>`)
    .join('');
}

function showView(view) {
  activeView = view;
  $$('.view').forEach((el) => el.classList.remove('active'));
  $(`#${view}View`)?.classList.add('active');
  $$('.nav-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
  $('#viewTitle').textContent = ({ dashboard: 'Dashboard', jobs: 'Job Tracker', add: 'Add / Analyze Job', prompt: 'Resume Prompt Lab', salary: 'Earnings Planner', profile: 'Profile + Vault', recruiters: 'Recruiter Map', settings: 'Backup + Settings' })[view] || 'BunnyScout';
  $('.sidebar')?.classList.remove('open');
  if (view === 'prompt') renderPromptJobOptions();
  if (view === 'profile') renderProfileForm();
  if (view === 'settings') renderSettingsForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function profileKeywords() {
  return normalize(`${state.profile.skills || ''} ${state.profile.resumeText || ''} ${state.profile.targetTitles || ''}`);
}

function extractSalary(text = '') {
  const normalized = text.replace(/,/g, '');
  const patterns = [
    /\$\s?(\d{2,3})(?:k|K)\s?(?:-|–|to)\s?\$?\s?(\d{2,3})(?:k|K)/,
    /\$\s?(\d{5,6})\s?(?:-|–|to)\s?\$?\s?(\d{5,6})/,
    /(\d{2,3})(?:k|K)\s?(?:-|–|to)\s?(\d{2,3})(?:k|K)/
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      let min = Number(match[1]);
      let max = Number(match[2]);
      if (min < 1000) min *= 1000;
      if (max < 1000) max *= 1000;
      return { min: Math.min(min, max), max: Math.max(min, max), text: `${money(Math.min(min, max))} – ${money(Math.max(min, max))}` };
    }
  }
  return { min: null, max: null, text: '' };
}

function extractField(text, labels) {
  const lines = text.split('\n').map(compact).filter(Boolean).slice(0, 60);
  for (const label of labels) {
    const regex = new RegExp(`^${label}\\s*[:\\-–—]\\s*(.+)$`, 'i');
    const line = lines.find((item) => regex.test(item));
    if (line) return line.replace(regex, '$1').trim();
  }
  return '';
}

function extractKeywords(text = '') {
  const clean = normalize(text);
  const found = SKILL_TERMS.filter((term) => clean.includes(normalize(term)));
  const words = clean.split(' ').filter((word) => word.length > 3 && !STOP_WORDS.has(word));
  const counts = words.reduce((map, word) => map.set(word, (map.get(word) || 0) + 1), new Map());
  const frequent = [...counts.entries()]
    .filter(([, count]) => count > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([word]) => word);
  return [...new Set([...found, ...frequent])].slice(0, 28);
}

const STOP_WORDS = new Set('about above across after again against also applicant applicants apply based been before being below between business candidate candidates company could description duties employer employment equal every experience experienced from have having including into other people position preferred qualified related required requirements responsibility responsibilities role should skills through using where while will with work working years your their them they this that what when which who whom able ability plus more must role job jobs'.split(' '));

function inferRoleFamily(text = '') {
  const clean = normalize(text);
  let best = { key: 'communications', score: 0 };
  Object.entries(ROLE_BANDS).forEach(([key, role]) => {
    const score = role.keywords.reduce((sum, term) => sum + (clean.includes(normalize(term)) ? 1 : 0), 0);
    if (score > best.score) best = { key, score };
  });
  return best.key;
}

function analyzeDescription(text = '') {
  const clean = text || '';
  const keywords = extractKeywords(clean);
  const profile = profileKeywords();
  const matched = keywords.filter((keyword) => profile.includes(normalize(keyword)));
  const missing = keywords.filter((keyword) => !profile.includes(normalize(keyword))).slice(0, 12);
  const score = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;
  const salary = extractSalary(clean);
  const title = extractField(clean, ['job title', 'title', 'position']) || compact(clean.split('\n').find((line) => line.trim().length > 6 && line.trim().length < 90) || '');
  const company = extractField(clean, ['company', 'organization', 'employer']);
  const location = extractField(clean, ['location', 'work location', 'job location']);
  const industry = inferRoleFamily(clean);
  return { title, company, location, salary, keywords, matched, missing, score, roleFamily: industry };
}

function renderAnalysis(analysis) {
  const role = ROLE_BANDS[analysis.roleFamily]?.label || 'General role';
  $('#analysisResults').innerHTML = `
    <article class="card">
      <div class="card-head">
        <div>
          <p class="eyebrow">job description insights</p>
          <h3>${analysis.score}% resume/profile keyword overlap</h3>
        </div>
        <span class="pill">${escapeHtml(role)}</span>
      </div>
      <div class="grid two-col">
        <div>
          <h4>Detected fields</h4>
          <p><strong>Title:</strong> ${escapeHtml(analysis.title || 'Not detected')}</p>
          <p><strong>Company:</strong> ${escapeHtml(analysis.company || 'Not detected')}</p>
          <p><strong>Location:</strong> ${escapeHtml(analysis.location || 'Not detected')}</p>
          <p><strong>Salary:</strong> ${escapeHtml(analysis.salary.text || 'Not detected')}</p>
        </div>
        <div>
          <h4>Suggested action</h4>
          <p class="muted">Use the matched terms as proof points and the missing terms as items to address only when truthful.</p>
          <button class="secondary-btn" id="fillDetectedBtn" type="button">Fill detected fields</button>
        </div>
      </div>
      <h4>Strong keywords</h4>
      <div class="keyword-pills">${analysis.keywords.map((k) => `<span class="pill">${escapeHtml(k)}</span>`).join('') || '<span class="muted">No keywords detected yet.</span>'}</div>
      <h4>Missing or weak keywords</h4>
      <div class="keyword-pills">${analysis.missing.map((k) => `<span class="pill">${escapeHtml(k)}</span>`).join('') || '<span class="muted">Nice overlap. No obvious gaps.</span>'}</div>
    </article>
  `;
  $('#fillDetectedBtn')?.addEventListener('click', () => {
    const form = $('#jobForm');
    if (analysis.title && !form.title.value) form.title.value = analysis.title;
    if (analysis.company && !form.company.value) form.company.value = analysis.company;
    if (analysis.location && !form.location.value) form.location.value = analysis.location;
    if (analysis.salary.min && !form.salaryMin.value) form.salaryMin.value = analysis.salary.min;
    if (analysis.salary.max && !form.salaryMax.value) form.salaryMax.value = analysis.salary.max;
    if (!form.industry.value) form.industry.value = role;
    showToast('Detected fields filled');
  });
}


function decodeClipFromHash() {
  const hash = window.location.hash || '';
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const encoded = params.get('clip');
  if (!encoded) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(encoded)))));
  } catch (error) {
    console.warn('Clip hash import failed', error);
    return null;
  }
}

function normalizeExtensionClipPayload(payload) {
  if (!payload) return [];
  if (payload.app === 'BunnyScoutClip' && payload.job) return [payload.job];
  if (payload.app === 'BunnyScoutClipBundle' && Array.isArray(payload.jobs)) return payload.jobs;
  if (Array.isArray(payload.jobs)) return payload.jobs;
  if (payload.title || payload.company || payload.jd) return [payload];
  return [];
}

function applyClipToForm(clip = {}) {
  showView('add');
  const form = $('#jobForm');
  if (!form) return;
  const analysis = analyzeDescription(clip.jd || clip.description || '');
  form.title.value = clip.title || analysis.title || '';
  form.company.value = clip.company || analysis.company || '';
  form.location.value = clip.location || analysis.location || '';
  form.industry.value = clip.industry || ROLE_BANDS[analysis.roleFamily]?.label || '';
  form.url.value = clip.url || '';
  form.source.value = clip.source || '';
  form.salaryMin.value = clip.salaryMin || analysis.salary?.min || '';
  form.salaryMax.value = clip.salaryMax || analysis.salary?.max || '';
  form.status.value = clip.status || 'saved';
  form.excitement.value = String(clip.excitement || 3);
  form.jd.value = clip.jd || clip.description || '';
  form.notes.value = clip.notes || `Imported from BunnyScout extension${clip.clippedAt ? ` on ${new Date(clip.clippedAt).toLocaleString()}` : ''}.`;
  lastAnalysis = analysis;
  renderAnalysis(analysis);
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('Extension clip filled the job form. Review and save it.');
}

function saveJobsFromClips(clips = []) {
  const now = new Date().toISOString();
  const imported = clips.map((clip) => {
    const analysis = analyzeDescription(clip.jd || clip.description || '');
    return {
      id: uid(),
      title: compact(clip.title || analysis.title || 'Untitled role'),
      company: compact(clip.company || analysis.company || 'Unknown company'),
      location: compact(clip.location || analysis.location || ''),
      industry: compact(clip.industry || ROLE_BANDS[analysis.roleFamily]?.label || ''),
      url: compact(clip.url || ''),
      source: compact(clip.source || 'Browser extension'),
      salaryMin: Number(clip.salaryMin) || analysis.salary?.min || null,
      salaryMax: Number(clip.salaryMax) || analysis.salary?.max || null,
      status: clip.status || 'saved',
      excitement: Number(clip.excitement || 3),
      jd: clip.jd || clip.description || '',
      notes: clip.notes || `Imported from BunnyScout extension${clip.clippedAt ? ` on ${new Date(clip.clippedAt).toLocaleString()}` : ''}.`,
      keywords: analysis.keywords || [],
      missingKeywords: analysis.missing || [],
      matchScore: analysis.score || 0,
      createdAt: now,
      updatedAt: now,
      dateSaved: todayISO(),
      dateApplied: '',
      followUpDate: '',
      contacts: [],
      tasks: defaultTasks('saved')
    };
  });
  state.jobs.unshift(...imported);
  saveState();
  renderAll();
  showToast(`${imported.length} clipped job${imported.length === 1 ? '' : 's'} imported`);
}

function importClipText(text) {
  if (!text.trim()) return showToast('Paste extension clip JSON first');
  let payload;
  try { payload = JSON.parse(text); }
  catch (error) { console.error(error); return showToast('Clip JSON could not be read'); }
  const clips = normalizeExtensionClipPayload(payload);
  if (!clips.length) return showToast('This does not look like BunnyScout clip JSON');
  if (clips.length === 1) applyClipToForm(clips[0]);
  else if (confirm(`Import ${clips.length} clipped jobs directly into your tracker?`)) saveJobsFromClips(clips);
}

function handleInitialClipImport() {
  const payload = decodeClipFromHash();
  if (payload) {
    const clips = normalizeExtensionClipPayload(payload);
    if (clips.length) applyClipToForm(clips[0]);
    history.replaceState(null, '', location.pathname + location.search);
    return;
  }
  if ((location.hash || '').includes('importClip')) {
    showView('add');
    $('#clipImportInput')?.focus();
    showToast('Paste the extension clip JSON, then import it');
  }
}

function saveJobFromForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form).entries());
  const analysis = formData.jd ? analyzeDescription(formData.jd) : { keywords: [], missing: [], matched: [], score: 0, salary: {} };
  const now = new Date().toISOString();
  const job = {
    id: uid(),
    title: compact(formData.title),
    company: compact(formData.company),
    location: compact(formData.location),
    industry: compact(formData.industry),
    url: compact(formData.url),
    source: compact(formData.source),
    salaryMin: Number(String(formData.salaryMin).replace(/[^0-9.]/g, '')) || analysis.salary?.min || null,
    salaryMax: Number(String(formData.salaryMax).replace(/[^0-9.]/g, '')) || analysis.salary?.max || null,
    status: formData.status || 'saved',
    excitement: Number(formData.excitement || 3),
    jd: formData.jd || '',
    notes: formData.notes || '',
    keywords: analysis.keywords || [],
    missingKeywords: analysis.missing || [],
    matchScore: analysis.score || 0,
    createdAt: now,
    updatedAt: now,
    dateSaved: todayISO(),
    dateApplied: ['applied', 'waiting'].includes(formData.status) ? todayISO() : '',
    followUpDate: ['applied', 'waiting'].includes(formData.status) ? calcFollowUpDate(todayISO()) : '',
    contacts: [],
    tasks: defaultTasks(formData.status)
  };
  state.jobs.unshift(job);
  saveState();
  form.reset();
  $('#analysisResults').innerHTML = '';
  lastAnalysis = null;
  showToast('Job saved');
  showView('jobs');
}

function defaultTasks(status) {
  const tasks = [
    { id: uid(), label: 'Tailor resume prompt generated', done: false },
    { id: uid(), label: 'Resume version saved', done: false },
    { id: uid(), label: 'Recruiter or referral checked', done: false },
    { id: uid(), label: 'Follow-up reminder set', done: ['applied', 'waiting'].includes(status) }
  ];
  return tasks;
}

function renderAll() {
  renderDashboard();
  renderJobs();
  renderPromptJobOptions();
  renderRecruiters();
  renderSalary();
  renderSettingsForm();
  renderProfileForm();
  renderFiles();
}

function renderDashboard() {
  const jobs = state.jobs;
  const applied = jobs.filter((j) => ['applied', 'waiting', 'interview', 'heardback', 'offer', 'rejected', 'ghosted'].includes(j.status)).length;
  const interviews = jobs.filter((j) => ['interview', 'heardback', 'offer'].includes(j.status)).length;
  const offers = jobs.filter((j) => j.status === 'offer').length;
  const responseRate = applied ? Math.round(((interviews + offers) / applied) * 100) : 0;
  const metrics = [
    ['Saved roles', jobs.length],
    ['Applied', applied],
    ['Interview / reply', interviews],
    ['Response rate', `${responseRate}%`]
  ];
  $('#metricGrid').innerHTML = metrics.map(([label, value]) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join('');

  const counts = STATUSES.map((status) => ({ ...status, count: jobs.filter((job) => (status.value === 'ghosted' ? isLikelyGhosted(job) : job.status === status.value)).length }));
  const max = Math.max(1, ...counts.map((item) => item.count));
  $('#pipelineChart').innerHTML = counts.map((item) => `
    <div class="bar-row">
      <strong>${item.label}</strong>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(3, (item.count / max) * 100)}%"></div></div>
      <span>${item.count}</span>
    </div>
  `).join('');

  const due = jobs
    .filter((j) => j.followUpDate && new Date(j.followUpDate) <= new Date() && !['offer', 'rejected'].includes(j.status))
    .slice(0, 5);
  const ghosts = jobs.filter(isLikelyGhosted).slice(0, 5);
  const queue = [
    ...due.map((job) => ({ job, label: `Follow up due ${job.followUpDate}` })),
    ...ghosts.map((job) => ({ job, label: `Likely ghosted after ${daysBetween(job.dateApplied || job.updatedAt || job.createdAt)} days` }))
  ].slice(0, 7);
  $('#actionQueue').innerHTML = queue.length ? queue.map(({ job, label }) => `
    <div class="stack-item">
      <strong>${escapeHtml(job.company)} · ${escapeHtml(job.title)}</strong>
      <small>${escapeHtml(label)}</small>
      <div class="chip-row"><button class="tiny-btn" data-copy-followup="${job.id}" type="button">Copy follow-up</button><button class="tiny-btn" data-view-job="${job.id}" type="button">View</button></div>
    </div>
  `).join('') : '<p class="muted">No urgent follow-ups yet. Save or apply to roles and they will show up here.</p>';

  $('#recentJobs').innerHTML = jobs.slice(0, 6).map(jobCard).join('') || '<p class="muted">No jobs yet. Start by pasting a job description.</p>';
  attachJobCardHandlers();
}

function getFilteredJobs() {
  const term = normalize($('#jobSearch')?.value || '');
  const status = $('#statusFilter')?.value || 'all';
  const sort = $('#sortJobs')?.value || 'newest';
  let jobs = [...state.jobs];
  if (term) {
    jobs = jobs.filter((job) => normalize(`${job.title} ${job.company} ${job.location} ${job.industry} ${job.source} ${job.keywords?.join(' ')} ${job.notes}`).includes(term));
  }
  if (status !== 'all') {
    jobs = jobs.filter((job) => status === 'ghosted' ? isLikelyGhosted(job) : job.status === status);
  }
  jobs.sort((a, b) => {
    if (sort === 'company') return a.company.localeCompare(b.company);
    if (sort === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sort === 'salary') return (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0);
    if (sort === 'followup') return String(a.followUpDate || '9999').localeCompare(String(b.followUpDate || '9999'));
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
  return jobs;
}

function renderJobs() {
  const list = $('#jobsList');
  if (!list) return;
  const jobs = getFilteredJobs();
  list.innerHTML = jobs.map(jobCard).join('') || '<p class="muted">No matching jobs. Try clearing filters or add a role.</p>';
  attachJobCardHandlers();
}

function jobCard(job) {
  const salary = job.salaryMin || job.salaryMax ? `${money(job.salaryMin)}${job.salaryMax ? ` – ${money(job.salaryMax)}` : ''}` : 'Salary unknown';
  const ghosted = isLikelyGhosted(job);
  const statusClass = ghosted ? 'ghosted' : job.status;
  const keywordPreview = (job.keywords || []).slice(0, 6).map((k) => `<span class="pill">${escapeHtml(k)}</span>`).join('');
  const statusOptions = STATUSES.map((s) => `<option value="${s.value}" ${job.status === s.value ? 'selected' : ''}>${s.label}</option>`).join('');
  return `
    <article class="job-card" data-job-card="${job.id}">
      <div class="match-ring" style="--score:${Number(job.matchScore || 0)}"><span>${Number(job.matchScore || 0)}%</span></div>
      <div style="padding-right:54px">
        <p class="eyebrow">${escapeHtml(job.source || 'saved role')}</p>
        <h4>${escapeHtml(job.title || 'Untitled role')}</h4>
        <div class="job-meta"><span>${escapeHtml(job.company || 'Unknown company')}</span><span>•</span><span>${escapeHtml(job.location || 'Location TBD')}</span></div>
      </div>
      <div class="chip-row"><span class="status-pill ${statusClass}">${escapeHtml(ghosted ? 'Likely ghosted' : statusLabel(job.status))}</span><span class="status-pill">${escapeHtml(salary)}</span><span class="status-pill">Excitement ${job.excitement || 3}/5</span></div>
      <label>Status<select class="inline-select" data-status-change="${job.id}">${statusOptions}</select></label>
      <div class="keyword-pills">${keywordPreview || '<span class="muted">No keywords analyzed.</span>'}</div>
      <div class="quick-copy-grid">
        <button data-copy-profile="${job.id}" type="button">Copy profile answers</button>
        <button data-copy-followup="${job.id}" type="button">Copy follow-up</button>
        <button data-copy-prompt="${job.id}" type="button">Copy resume prompt</button>
        <button data-copy-summary="${job.id}" type="button">Copy job summary</button>
      </div>
      <div class="job-actions">
        ${job.url ? `<a href="${escapeHtml(job.url)}" target="_blank" rel="noreferrer">Open job</a>` : ''}
        <button data-edit-job="${job.id}" type="button">Edit notes</button>
        <button data-delete-job="${job.id}" type="button">Delete</button>
      </div>
      <small class="muted">Saved ${escapeHtml(job.dateSaved || '')}${job.followUpDate ? ` · Follow up ${escapeHtml(job.followUpDate)}` : ''}</small>
    </article>
  `;
}

function attachJobCardHandlers() {
  $$('[data-status-change]').forEach((select) => {
    select.onchange = () => updateJobStatus(select.dataset.statusChange, select.value);
  });
  $$('[data-delete-job]').forEach((button) => {
    button.onclick = () => deleteJob(button.dataset.deleteJob);
  });
  $$('[data-edit-job]').forEach((button) => {
    button.onclick = () => editJobNotes(button.dataset.editJob);
  });
  $$('[data-copy-profile]').forEach((button) => {
    button.onclick = () => copyText(buildProfileAnswerPack(findJob(button.dataset.copyProfile)), 'Profile answers copied');
  });
  $$('[data-copy-followup]').forEach((button) => {
    button.onclick = () => copyText(buildFollowUp(findJob(button.dataset.copyFollowup)), 'Follow-up copied');
  });
  $$('[data-copy-prompt]').forEach((button) => {
    button.onclick = () => copyText(buildPrompt(findJob(button.dataset.copyPrompt), 'resume', 'strict'), 'Resume prompt copied');
  });
  $$('[data-copy-summary]').forEach((button) => {
    button.onclick = () => copyText(buildJobSummary(findJob(button.dataset.copySummary)), 'Job summary copied');
  });
  $$('[data-view-job]').forEach((button) => {
    button.onclick = () => {
      showView('jobs');
      setTimeout(() => $(`[data-job-card="${button.dataset.viewJob}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    };
  });
}

function findJob(id) {
  return state.jobs.find((job) => job.id === id) || null;
}

function updateJobStatus(id, status) {
  const job = findJob(id);
  if (!job) return;
  job.status = status;
  job.updatedAt = new Date().toISOString();
  if (['applied', 'waiting'].includes(status) && !job.dateApplied) job.dateApplied = todayISO();
  if (['applied', 'waiting'].includes(status) && !job.followUpDate) job.followUpDate = calcFollowUpDate(job.dateApplied || todayISO());
  saveState();
  if (status === 'offer' && state.settings.showConfetti) confetti();
  showToast(`Status updated to ${statusLabel(status)}`);
}

function deleteJob(id) {
  const job = findJob(id);
  if (!job) return;
  if (!confirm(`Delete ${job.company} · ${job.title}?`)) return;
  state.jobs = state.jobs.filter((item) => item.id !== id);
  saveState();
  showToast('Job deleted');
}

function editJobNotes(id) {
  const job = findJob(id);
  if (!job) return;
  const notes = prompt('Update notes for this role:', job.notes || '');
  if (notes === null) return;
  job.notes = notes;
  job.updatedAt = new Date().toISOString();
  saveState();
  showToast('Notes updated');
}

function buildJobSummary(job) {
  if (!job) return '';
  return [
    `${job.company} — ${job.title}`,
    `Location: ${job.location || 'TBD'}`,
    `Salary: ${job.salaryMin || job.salaryMax ? `${money(job.salaryMin)} – ${money(job.salaryMax)}` : 'Not listed'}`,
    `Status: ${statusLabel(job.status)}`,
    `URL: ${job.url || 'N/A'}`,
    `Keywords: ${(job.keywords || []).join(', ') || 'N/A'}`,
    `Missing/weak keywords: ${(job.missingKeywords || []).join(', ') || 'N/A'}`,
    '',
    'Job description:',
    job.jd || 'N/A'
  ].join('\n');
}

function buildProfileAnswerPack(job) {
  return [
    `Name: ${state.profile.name}`,
    `Email: ${state.profile.email}`,
    `Phone: ${state.profile.phone}`,
    `Location: ${state.profile.location}`,
    `Links: ${state.profile.links}`,
    `Target titles: ${state.profile.targetTitles}`,
    `Relevant skills: ${state.profile.skills}`,
    `Common answers: ${state.profile.commonAnswers}`,
    job ? `Applying for: ${job.company} — ${job.title}` : ''
  ].filter(Boolean).join('\n');
}

function buildFollowUp(job) {
  if (!job) return '';
  const name = state.profile.name || '[Your Name]';
  return `Hi,\n\nI hope you're doing well. I recently applied for the ${job.title} role at ${job.company} and wanted to follow up to reiterate my interest. My background in ${state.profile.skills ? state.profile.skills.split(',').slice(0, 3).join(', ') : 'communications, project coordination, and digital work'} seems aligned with the role, especially around ${(job.keywords || []).slice(0, 4).join(', ') || 'the responsibilities listed in the posting'}.\n\nI'm happy to share any additional information that would be helpful. Thank you for your time and consideration.\n\nBest,\n${name}`;
}

function renderPromptJobOptions() {
  const select = $('#promptJobSelect');
  if (!select) return;
  select.innerHTML = state.jobs.length
    ? state.jobs.map((job) => `<option value="${job.id}">${escapeHtml(job.company)} — ${escapeHtml(job.title)}</option>`).join('')
    : '<option value="">No saved jobs yet</option>';
}

function buildPrompt(job, style = 'resume', strictness = 'strict') {
  const guardrails = {
    strict: 'Do not invent experience, tools, employers, metrics, certifications, education, or responsibilities. If a requirement is missing, label it as a gap and suggest honest ways to address it.',
    balanced: 'Improve wording and positioning, but keep every claim truthful and grounded in my resume/profile.',
    bold: 'Make the positioning stronger and more confident, but do not fabricate anything.'
  }[strictness] || '';

  const base = `You are helping me tailor application materials for this job. ${guardrails}\n\nMy profile/resume source material:\n${state.profile.resumeText || '[Paste resume text here]'}\n\nMy reusable skills/answers:\n${state.profile.skills || '[Paste skills here]'}\n${state.profile.commonAnswers || ''}\n\nJob details:\n${buildJobSummary(job)}\n\n`;

  const prompts = {
    resume: `${base}Task: Rewrite my resume bullets and summary for this role. Return:\n1. A concise target summary.\n2. 8-12 tailored resume bullets grouped by role/skill area.\n3. A keyword coverage table with \"job keyword\", \"resume evidence\", and \"honest gap\".\n4. A short list of what NOT to claim.\nKeep the tone professional, ATS-friendly, specific, and easy to verify.`,
    cover: `${base}Task: Draft a one-page cover letter that sounds human, specific, and not over-the-top. Use the job description's priorities, connect them to my actual experience, and avoid generic filler. Include a strong opening, 2 proof paragraphs, and a concise closing.`,
    ats: `${base}Task: Compare my resume/profile against this job description. Return a prioritized ATS and recruiter-readability gap analysis with: missing keywords, weakly represented skills, strongest proof points, suggested truthful rewrites, and questions I should answer before applying.`,
    interview: `${base}Task: Build an interview prep guide. Include likely questions, STAR story prompts, role-specific talking points, concerns they may have about my background, and questions I should ask the interviewer.`,
    linkedin: `${base}Task: Write a concise LinkedIn message to a recruiter or hiring manager. Keep it under 900 characters, specific to this role, and not desperate or overly formal. Include a clear ask for consideration or a quick chat.`
  };
  return prompts[style] || prompts.resume;
}

function handlePromptGeneration() {
  const job = findJob($('#promptJobSelect').value);
  const style = $('#promptStyle').value;
  const strictness = $('#promptStrictness').value;
  $('#promptOutput').value = buildPrompt(job, style, strictness);
}

function renderSalary() {
  const roleKey = $('#salaryRole')?.value || 'communications';
  const years = Number($('#salaryYears')?.value || 3);
  const market = Number($('#salaryMarket')?.value || 1);
  const industry = Number($('#salaryIndustry')?.value || 1);
  $('#salaryYearsLabel').textContent = `${years} year${years === 1 ? '' : 's'}`;
  const role = ROLE_BANDS[roleKey];
  if (!role) return;
  const experienceIndex = years < 2 ? 0 : years < 5 ? 1 : years < 9 ? 2 : 3;
  const lowIndex = Math.max(0, experienceIndex - 1);
  const highIndex = Math.min(3, experienceIndex + 1);
  const low = role.base[lowIndex] * market * industry;
  const mid = role.base[experienceIndex] * market * industry;
  const high = role.base[highIndex] * market * industry;
  const floor = role.base[0] * market * industry;
  const ceiling = role.base[3] * market * industry;
  $('#salaryOutput').innerHTML = `
    <p class="eyebrow">planning estimate</p>
    <h3>${escapeHtml(role.label)}</h3>
    <p class="salary-big">${money(low)} – ${money(high)}</p>
    <p class="muted">Target midpoint: <strong>${money(mid)}</strong>. This is a planning estimate only, not live compensation data.</p>
    <div class="salary-bands">
      ${['Entry', 'Early', 'Mid', 'Senior'].map((label, index) => {
        const value = role.base[index] * market * industry;
        const width = ((value - floor) / Math.max(1, ceiling - floor)) * 100;
        return `<div class="salary-band"><strong>${label}</strong><div class="bar-track"><div class="bar-fill" style="width:${Math.max(5, width)}%"></div></div><span>${money(value)}</span></div>`;
      }).join('')}
    </div>
    <div class="security-note">Before negotiating, verify with BLS/OEWS, O*NET, company ranges, Levels.fyi for tech roles, Glassdoor, and recruiter data. Experience percentiles are approximations, not guarantees.</div>
  `;
}

function renderProfileForm() {
  const form = $('#profileForm');
  if (!form) return;
  Object.entries(state.profile).forEach(([key, value]) => {
    if (form.elements[key] && form.elements[key].value !== value) form.elements[key].value = value || '';
  });
}

function saveProfile(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget).entries());
  state.profile = { ...state.profile, ...values };
  saveState();
  showToast('Profile saved');
}

function renderRecruiters() {
  const list = $('#recruiterList');
  if (!list) return;
  const term = normalize($('#recruiterSearch')?.value || '');
  const recruiters = (state.recruiters || []).filter((r) => !term || normalize(`${r.name} ${r.focus} ${r.region} ${r.notes}`).includes(term));
  list.innerHTML = recruiters.map((r, index) => `
    <article class="job-card">
      <p class="eyebrow">${escapeHtml(r.region || 'anywhere')}</p>
      <h4>${escapeHtml(r.name)}</h4>
      <p class="muted">${escapeHtml(r.focus)}</p>
      <p>${escapeHtml(r.notes || '')}</p>
      <div class="job-actions">
        ${r.url ? `<a href="${escapeHtml(r.url)}" target="_blank" rel="noreferrer">Open jobs</a>` : ''}
        <button data-copy-recruiter="${index}" type="button">Copy pitch</button>
        <button data-delete-recruiter="${index}" type="button">Delete</button>
      </div>
    </article>
  `).join('') || '<p class="muted">No agencies match that search.</p>';
  $$('[data-copy-recruiter]').forEach((button) => {
    button.onclick = () => copyText(buildRecruiterPitch(state.recruiters[Number(button.dataset.copyRecruiter)]), 'Recruiter pitch copied');
  });
  $$('[data-delete-recruiter]').forEach((button) => {
    button.onclick = () => {
      const index = Number(button.dataset.deleteRecruiter);
      if (!confirm(`Delete ${state.recruiters[index]?.name}?`)) return;
      state.recruiters.splice(index, 1);
      saveState();
      showToast('Agency deleted');
    };
  });
}

function buildRecruiterPitch(recruiter = {}) {
  const name = state.profile.name || '[Your Name]';
  const titles = state.profile.targetTitles || '[target roles]';
  const location = state.profile.location || '[location / remote preference]';
  const skills = state.profile.skills || '[top skills]';
  return `Hi,\n\nI'm exploring ${titles} opportunities in ${location} and wanted to connect in case you are working on roles that fit my background. My experience includes ${skills}.\n\nI'm especially interested in roles where I can contribute to communications, accessibility/508, web content, project coordination, or digital operations. If helpful, I can send over my resume and a few examples of relevant work.\n\nBest,\n${name}`;
}

function addRecruiter() {
  const name = prompt('Agency or recruiter name:');
  if (!name) return;
  const focus = prompt('Focus areas:', 'Marketing, communications, web, tech, project roles') || '';
  const region = prompt('Region:', state.profile.location || 'Remote / local') || '';
  const url = prompt('Job search URL:', '') || '';
  const notes = prompt('Notes:', '') || '';
  state.recruiters.unshift({ name, focus, region, url, notes });
  saveState();
  showToast('Agency added');
}

function renderSettingsForm() {
  if (!$('#ghostDays')) return;
  $('#ghostDays').value = state.settings.ghostDays;
  $('#followupDays').value = state.settings.followupDays;
  $('#showConfetti').checked = Boolean(state.settings.showConfetti);
}

function saveSettings() {
  state.settings = {
    ...state.settings,
    ghostDays: Number($('#ghostDays').value || 21),
    followupDays: Number($('#followupDays').value || 7),
    showConfetti: $('#showConfetti').checked
  };
  saveState();
  showToast('Settings saved');
}

function exportBackup(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadJSON() {
  const backup = { ...state, exportedAt: new Date().toISOString() };
  exportBackup(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }), `bunnyscout-backup-${todayISO()}.json`);
}

async function encryptedExport() {
  const password = $('#backupPassword').value;
  if (!password) return showToast('Enter a password first');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const encoded = new TextEncoder().encode(JSON.stringify({ ...state, exportedAt: new Date().toISOString() }));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const payload = {
    app: 'BunnyScout',
    version: 1,
    salt: arrayToBase64(salt),
    iv: arrayToBase64(iv),
    data: arrayToBase64(new Uint8Array(ciphertext))
  };
  exportBackup(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `bunnyscout-encrypted-${todayISO()}.bunny`);
}

async function deriveKey(password, salt) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 210000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

function arrayToBase64(buffer) {
  return btoa(String.fromCharCode(...buffer));
}

function base64ToArray(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function importBackup(file) {
  const text = await file.text();
  let data = JSON.parse(text);
  if (data.app === 'BunnyScout' && data.data) {
    const password = prompt('Enter the password for this encrypted backup:');
    if (!password) return;
    const salt = base64ToArray(data.salt);
    const iv = base64ToArray(data.iv);
    const key = await deriveKey(password, salt);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToArray(data.data));
    data = JSON.parse(new TextDecoder().decode(plaintext));
  }
  if (!data.jobs || !data.profile) throw new Error('This does not look like a BunnyScout backup.');
  state = { ...structuredClone(DEFAULT_STATE), ...data, settings: { ...DEFAULT_STATE.settings, ...(data.settings || {}) } };
  saveState();
  showToast('Backup imported');
}

function wipeData() {
  if (!confirm('This deletes all local BunnyScout job/profile data in this browser. Continue?')) return;
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(DEFAULT_STATE);
  saveState();
  showToast('Local data wiped');
}

function confetti() {
  const colors = ['#8d5cf6', '#ff7aa8', '#58d7b4', '#ffc857'];
  for (let i = 0; i < 36; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.append(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function storeFiles(files) {
  const db = await openDB();
  const tx = db.transaction('files', 'readwrite');
  const store = tx.objectStore('files');
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      showToast(`${file.name} is over 5 MB`);
      continue;
    }
    const dataUrl = await readAsDataURL(file);
    store.put({ id: uid(), name: file.name, type: file.type || 'application/octet-stream', size: file.size, dataUrl, createdAt: new Date().toISOString() });
  }
  await txDone(tx);
  renderFiles();
  showToast('File vault updated');
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function getFiles() {
  const db = await openDB();
  const tx = db.transaction('files', 'readonly');
  const request = tx.objectStore('files').getAll();
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

async function renderFiles() {
  const list = $('#fileList');
  if (!list || !indexedDB) return;
  try {
    const files = await getFiles();
    list.innerHTML = files.length ? files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((file) => `
      <div class="stack-item">
        <strong>${escapeHtml(file.name)}</strong>
        <small>${escapeHtml(file.type || 'file')} · ${Math.round(file.size / 1024)} KB · ${new Date(file.createdAt).toLocaleDateString()}</small>
        <div class="chip-row"><button class="tiny-btn" data-download-file="${file.id}" type="button">Download</button><button class="tiny-btn" data-delete-file="${file.id}" type="button">Delete</button></div>
      </div>
    `).join('') : '<p class="muted">No files uploaded yet.</p>';
    $$('[data-download-file]').forEach((button) => button.onclick = () => downloadStoredFile(button.dataset.downloadFile));
    $$('[data-delete-file]').forEach((button) => button.onclick = () => deleteStoredFile(button.dataset.deleteFile));
  } catch (error) {
    console.error(error);
    list.innerHTML = '<p class="muted">File vault is unavailable in this browser.</p>';
  }
}

async function downloadStoredFile(id) {
  const files = await getFiles();
  const file = files.find((item) => item.id === id);
  if (!file) return;
  const link = document.createElement('a');
  link.href = file.dataUrl;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
}

async function deleteStoredFile(id) {
  if (!confirm('Delete this stored file from this browser?')) return;
  const db = await openDB();
  const tx = db.transaction('files', 'readwrite');
  tx.objectStore('files').delete(id);
  await txDone(tx);
  renderFiles();
  showToast('File deleted');
}

function seedDemo() {
  if (state.jobs.length && !confirm('Add sample jobs to your current tracker?')) return;
  const now = new Date().toISOString();
  const samples = [
    {
      title: 'Health Communications Specialist', company: 'Federal Health Contractor', location: 'Remote / DC', industry: 'Government contracting', source: 'Sample', salaryMin: 72000, salaryMax: 92000,
      jd: 'Job Title: Health Communications Specialist\nCompany: Federal Health Contractor\nLocation: Remote\nSalary: $72,000 - $92,000\nSupport NIH communications, newsletters, social media, plain language editing, webinar promotion, stakeholder coordination, 508 compliance, and project timelines. Experience with Workfront, Adobe Acrobat, quality assurance, and government clients preferred.'
    },
    {
      title: 'Accessibility / 508 Remediation Specialist', company: 'Digital Services Agency', location: 'Seattle / Remote', industry: 'Accessibility', source: 'Sample', salaryMin: 80000, salaryMax: 112000,
      jd: 'Position: Accessibility / 508 Remediation Specialist\nLocation: Seattle or Remote\nCompensation: $80k to $112k\nRemediate PDFs, audit documents for WCAG and Section 508 compliance, advise designers and content teams, create QA checklists, use Adobe Acrobat, and support accessible web content.'
    },
    {
      title: 'Front-End Web Developer for Artists', company: 'Music Tech Studio', location: 'Remote', industry: 'Web development', source: 'Sample', salaryMin: 70000, salaryMax: 105000,
      jd: 'Title: Front-End Web Developer\nBuild responsive websites for DJs, entertainers, and artists. Must know HTML, CSS, JavaScript, GitHub, Netlify, responsive design, SEO, accessibility, and client communication. React experience is a plus.'
    }
  ];
  samples.forEach((sample, index) => {
    const analysis = analyzeDescription(sample.jd);
    state.jobs.unshift({
      id: uid(),
      ...sample,
      status: index === 0 ? 'applied' : 'saved',
      excitement: 4,
      notes: 'Sample role. Replace or delete when ready.',
      keywords: analysis.keywords,
      missingKeywords: analysis.missing,
      matchScore: analysis.score,
      createdAt: now,
      updatedAt: now,
      dateSaved: todayISO(),
      dateApplied: index === 0 ? todayISO() : '',
      followUpDate: index === 0 ? calcFollowUpDate(todayISO()) : '',
      contacts: [],
      tasks: defaultTasks(index === 0 ? 'applied' : 'saved')
    });
  });
  if (!state.profile.skills) {
    state.profile.skills = '508 compliance, accessibility, Adobe Acrobat, NIH communications, social media, newsletters, QA/QC, project management, HTML, CSS, JavaScript, GitHub, Netlify, client communication';
    state.profile.targetTitles = 'Health Communications Specialist, 508 Remediation Specialist, Front-End Web Developer, Project Coordinator';
    state.profile.location = 'Bellingham, WA / Seattle / Remote';
  }
  saveState();
  showToast('Sample loaded');
}

const THEME_KEY = 'bunnyscout:theme';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  const toggle = $('#themeToggle');
  if (toggle) {
    toggle.textContent = isDark ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#140f1f' : '#8d5cf6');
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function initEvents() {
  $('#themeToggle')?.addEventListener('click', toggleTheme);
  $$('.nav-btn').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  $$('[data-view-target]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.viewTarget)));
  $('.mobile-menu')?.addEventListener('click', () => $('.sidebar')?.classList.toggle('open'));
  $('#jobForm').addEventListener('submit', saveJobFromForm);
  $('#analyzeBtn').addEventListener('click', () => {
    const text = $('#jdInput').value;
    if (!text.trim()) return showToast('Paste a job description first');
    lastAnalysis = analyzeDescription(text);
    renderAnalysis(lastAnalysis);
  });
  $('#importClipBtn')?.addEventListener('click', () => importClipText($('#clipImportInput')?.value || ''));
  $('#pasteClipBtn')?.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      $('#clipImportInput').value = text;
      importClipText(text);
    } catch (error) {
      console.error(error);
      showToast('Clipboard paste was blocked. Paste manually.');
    }
  });
  ['jobSearch', 'statusFilter', 'sortJobs'].forEach((id) => $(`#${id}`)?.addEventListener('input', renderJobs));
  $('#generatePromptBtn').addEventListener('click', handlePromptGeneration);
  $('#copyPromptBtn').addEventListener('click', () => copyText($('#promptOutput').value, 'Prompt copied'));
  ['salaryRole', 'salaryYears', 'salaryMarket', 'salaryIndustry'].forEach((id) => $(`#${id}`)?.addEventListener('input', renderSalary));
  $('#calcSalaryBtn').addEventListener('click', renderSalary);
  $('#profileForm').addEventListener('submit', saveProfile);
  $('#fileInput').addEventListener('change', (event) => storeFiles([...event.target.files]));
  $('#recruiterSearch').addEventListener('input', renderRecruiters);
  $('#addRecruiterBtn').addEventListener('click', addRecruiter);
  $('#copyRecruiterPitchBtn').addEventListener('click', () => copyText(buildRecruiterPitch(), 'Recruiter pitch copied'));
  $('#exportBtn').addEventListener('click', downloadJSON);
  $('#exportEncryptedBtn').addEventListener('click', encryptedExport);
  $('#importInput').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { await importBackup(file); }
    catch (error) { console.error(error); showToast('Import failed'); }
  });
  $('#wipeBtn').addEventListener('click', wipeData);
  $('#saveSettingsBtn').addEventListener('click', saveSettings);
  $('#seedDemoBtn').addEventListener('click', seedDemo);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./service-worker.js').catch((error) => console.warn('Service worker registration failed', error));
  }
}

initTheme();
populateStatusSelects();
populateSalaryRoles();
initEvents();
renderAll();
registerServiceWorker();
showView('dashboard');
handleInitialClipImport();
