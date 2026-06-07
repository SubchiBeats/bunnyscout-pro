# BunnyScout Pro — Claude/GitHub Handoff
This document is a complete handoff for uploading the BunnyScout Pro codebase to GitHub and continuing development with Claude. The downloadable ZIP contains the full repo, including PNG icon binaries. This Markdown file includes all textual source files inline for review/copying.
## Project Summary
BunnyScout Pro is a local-first job-search web app plus a Chrome/Edge extension. The web app is static and can run locally or on Netlify. The extension clips job postings from active tabs, stores job clips locally, exports/imports JSON to the app, and provides assisted autofill for common application fields while avoiding sensitive fields.
## Key Design Choices
- Static-first web app: no server required, deployable to Netlify/GitHub Pages.
- Local-first storage: browser localStorage/extension storage; no resumes or application data are sent to a backend.
- Safer autofill: the extension previews/fills common fields and avoids passwords, SSN, banking, DOB, EEO, veteran/disability, and file upload fields.
- No mass applying: the extension does not submit applications or bypass anti-bot protections.
## How to Run Locally on Windows
1. Unzip the project.
2. Open PowerShell normally from Start Menu.
3. Change into the folder that contains `index.html`, for example:

```powershell
cd "$env:USERPROFILE\Downloads\bunnyscout-pro"
```

4. Confirm you see the app files:

```powershell
dir
```

5. Start a local server:

```powershell
py -m http.server 8080
```

6. Open `http://localhost:8080` in the browser. If Python is unavailable, double-click `index.html` or deploy to Netlify.
## Netlify Deployment
Drag the unzipped `bunnyscout-pro` folder into Netlify manual deploy. The included `netlify.toml` sets security headers and SPA fallback behavior.
## Chrome/Edge Extension Install
1. Open `chrome://extensions` or `edge://extensions`.
2. Enable Developer Mode.
3. Click **Load unpacked**.
4. Select the `bunnyscout-pro/extension` folder.
5. Open a job posting, click the extension, and use **Clip this job** or autofill preview/fill.
## Suggested Claude Instructions
```text
You are helping me upload and improve BunnyScout Pro, a static local-first job-search web app plus Chrome/Edge extension. Please create a clean GitHub repository from the files I provide. Preserve the structure exactly. Add or improve README content if needed, but do not remove features. Verify that index.html works locally, that the extension manifest is valid Manifest V3, and that the extension avoids sensitive fields during autofill. Then suggest a roadmap for GitHub issues: job-board parser improvements, import/export UX, resume vault improvements, testing, accessibility, and optional hosted backend/API integrations.
```
## File Tree
```text
bunnyscout-pro/
├── extension/
│   ├── icons/
│   │   ├── icon-128.png
│   │   ├── icon-16.png
│   │   ├── icon-32.png
│   │   └── icon-48.png
│   ├── lib/
│   ├── contentScript.js
│   ├── dashboard.css
│   ├── dashboard.html
│   ├── dashboard.js
│   ├── manifest.json
│   ├── popup.css
│   ├── popup.html
│   ├── popup.js
│   ├── README.md
│   └── service-worker.js
├── app.js
├── index.html
├── manifest.json
├── netlify.toml
├── README.md
├── service-worker.js
└── styles.css
```
## Binary Assets Included in ZIP
The following PNG icons are included in the ZIP and should be committed as-is:

- `extension/icons/icon-128.png`
- `extension/icons/icon-16.png`
- `extension/icons/icon-32.png`
- `extension/icons/icon-48.png`

## Text Source Files
### `README.md`

```markdown
# BunnyScout Job Search HQ + Clipper Extension

BunnyScout is a local-first job-search command center with a cute bunny theme. It includes:

- A mobile-friendly web app you can run locally or deploy on Netlify.
- A Chrome/Edge Manifest V3 extension for desktop job clipping and assisted autofill.
- Local-only storage for jobs, profile answers, clips, and backups.
- Resume-tailoring prompt generation for ChatGPT/Claude.
- Salary planning estimates, recruiter agency tracking, follow-up templates, and application stats.

## Folder map

``​`text
bunnyscout-pro/
  index.html              # Web app
  styles.css
  app.js
  manifest.json           # PWA manifest for web app
  service-worker.js
  netlify.toml            # Netlify security headers
  extension/              # Chrome/Edge extension
    manifest.json
    popup.html/css/js
    dashboard.html/css/js
    contentScript.js
    service-worker.js
    icons/
``​`

## Run the web app locally on Windows

Your previous error happened because PowerShell was in `C:\WINDOWS\system32`, not the folder where you unzipped BunnyScout.

1. Unzip the ZIP to a known place, such as Downloads or Desktop.
2. In File Explorer, open the unzipped `bunnyscout-pro` folder.
3. Click the address bar, type `powershell`, and press Enter. This opens PowerShell in the correct folder.
4. Try one of these:

``​`powershell
py -m http.server 8080
``​`

or, if Python is installed as `python`:

``​`powershell
python -m http.server 8080
``​`

Then open:

``​`text
http://localhost:8080
``​`

If Windows says Python is not found, install Python or skip local hosting and deploy the folder to Netlify. You can also double-click `index.html`, but service worker/PWA features work better through `http://localhost` or Netlify.

## Deploy the web app to Netlify

1. Go to Netlify.
2. Drag the unzipped `bunnyscout-pro` folder into a manual deploy.
3. Open the Netlify URL on your iPhone.
4. In Safari, use Share → Add to Home Screen.

The extension is desktop-only because iPhone Safari/Chrome do not support this Chrome extension workflow.

## Install the Chrome extension locally

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the `bunnyscout-pro/extension` folder.
6. Pin BunnyScout from the extensions puzzle-piece menu.

## Install the Edge extension locally

1. Open Edge.
2. Go to `edge://extensions`.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select the `bunnyscout-pro/extension` folder.

## Extension workflow

1. Open a job posting on LinkedIn, Indeed, Greenhouse, Lever, Workday, USAJOBS, Ashby, SmartRecruiters, iCIMS, or another job page.
2. Click the BunnyScout extension.
3. Click **Clip this job**.
4. BunnyScout saves the clip in extension storage and copies import JSON to your clipboard.
5. Click **Open app** to move the clip into the web app. If the job description is too large for a URL handoff, paste the copied JSON into the app's **Browser extension bridge** box and click **Import clip**.

## Autofill workflow

1. Open the extension dashboard from the popup.
2. Fill your reusable profile answers.
3. Open a job application form.
4. Click BunnyScout.
5. Use **Preview autofill fields** first.
6. Use **Autofill page** only after reviewing the preview.

BunnyScout intentionally skips passwords, SSNs, banking fields, file uploads, date of birth, EEO demographic questions, veteran/disability questions, and unknown sensitive fields.

## Security model

- No backend.
- No third-party APIs.
- No remote extension code.
- Web app data stays in the browser via localStorage/IndexedDB.
- Extension data stays in `chrome.storage.local`.
- Backups are user-triggered exports.

## Important limitation

A web app hosted on Netlify cannot fill forms inside third-party sites. Browser extensions can interact with active tabs after user action, which is why the autofill upgrade lives in the extension. Some application sites use custom components, iframes, anti-automation checks, or shadow DOM, so assisted autofill will not be perfect everywhere. Use preview, review every page before submitting, and avoid mass-applying spam behavior.
```

### `app.js`

```javascript
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
const todayISO = () => new Date().toISOString().slice(0, 10);
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

function initEvents() {
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

populateStatusSelects();
populateSalaryRoles();
initEvents();
renderAll();
registerServiceWorker();
showView('dashboard');
handleInitialClipImport();
```

### `extension/README.md`

```markdown
# BunnyScout Chrome/Edge Extension

This Manifest V3 extension clips job postings and assists with form autofill.

## Install

Chrome: `chrome://extensions` → Developer mode → Load unpacked → select this `extension` folder.

Edge: `edge://extensions` → Developer mode → Load unpacked → select this `extension` folder.

## What it does

- Clips job title, company, location, salary range, source, URL, and job description from the active tab.
- Stores clips locally in the extension.
- Copies BunnyScout import JSON to the clipboard.
- Opens the BunnyScout web app and passes small clips through the URL hash.
- Assists with form autofill using your saved local profile.
- Skips sensitive fields and asks before filling when preview mode is enabled.

## What it does not do

- It does not submit applications for you.
- It does not bypass CAPTCHAs, anti-bot systems, logins, or application-site rules.
- It does not upload resumes automatically, because browsers block programmatic file upload for security.
- It does not share data with a cloud server.
```

### `extension/contentScript.js`

```javascript
(() => {
  if (window.__BUNNYSCOUT_EXTENSION__) return;

  const BUNNY = {};
  const MAX_TEXT = 24000;
  const FIELD_LIMIT_DEFAULT = 140;

  const normalize = (value = '') => String(value).replace(/\s+/g, ' ').trim();
  const lower = (value = '') => normalize(value).toLowerCase();

  function visible(el) {
    if (!el || el.disabled || el.readOnly) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function textOf(selector) {
    const node = document.querySelector(selector);
    return normalize(node?.innerText || node?.textContent || node?.getAttribute('content') || '');
  }

  function meta(name) {
    return normalize(document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)?.content || '');
  }

  function getJsonLdJobs() {
    return [...document.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((script) => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          const nodes = Array.isArray(data) ? data : data['@graph'] || [data];
          return nodes.filter((node) => lower(node?.['@type']).includes('jobposting'));
        } catch {
          return [];
        }
      });
  }

  function firstText(selectors) {
    for (const selector of selectors) {
      const value = textOf(selector);
      if (value) return value;
    }
    return '';
  }

  function cleanDescription(text = '') {
    let cleaned = String(text)
      .replace(/\u00a0/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
    const startMarkers = ['job description', 'about the role', 'about this role', 'position summary', 'responsibilities', 'what you will do'];
    const endMarkers = ['equal opportunity', 'eeo', 'privacy notice', 'accommodation', 'apply now', 'similar jobs'];
    const lowerText = cleaned.toLowerCase();
    const start = startMarkers.map((m) => lowerText.indexOf(m)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
    if (start > 0) cleaned = cleaned.slice(start);
    const loweredAgain = cleaned.toLowerCase();
    const end = endMarkers.map((m) => loweredAgain.indexOf(m)).filter((i) => i > 600).sort((a, b) => a - b)[0];
    if (end) cleaned = cleaned.slice(0, end);
    return cleaned.slice(0, MAX_TEXT);
  }

  function extractSalary(text = '') {
    const compact = String(text).replace(/,/g, '');
    const patterns = [
      /\$\s?(\d{2,3}(?:\.\d+)?)\s?k?\s?(?:-|–|—|to)\s?\$?\s?(\d{2,3}(?:\.\d+)?)\s?k?/i,
      /(\d{2,3}(?:\.\d+)?)\s?k\s?(?:-|–|—|to)\s?(\d{2,3}(?:\.\d+)?)\s?k/i,
      /\$\s?(\d{5,6})\s?(?:-|–|—|to)\s?\$?\s?(\d{5,6})/i
    ];
    for (const pattern of patterns) {
      const match = compact.match(pattern);
      if (!match) continue;
      let min = Number(match[1]);
      let max = Number(match[2]);
      if (min < 1000) min *= 1000;
      if (max < 1000) max *= 1000;
      if (min && max) return { min: Math.min(min, max), max: Math.max(min, max), text: `$${Math.min(min, max).toLocaleString()} - $${Math.max(min, max).toLocaleString()}` };
    }
    return { min: null, max: null, text: '' };
  }

  function inferSource() {
    const host = location.hostname.replace(/^www\./, '');
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('indeed')) return 'Indeed';
    if (host.includes('greenhouse')) return 'Greenhouse';
    if (host.includes('lever')) return 'Lever';
    if (host.includes('workday')) return 'Workday';
    if (host.includes('ashbyhq')) return 'Ashby';
    if (host.includes('smartrecruiters')) return 'SmartRecruiters';
    if (host.includes('icims')) return 'iCIMS';
    if (host.includes('usajobs')) return 'USAJOBS';
    return host;
  }

  function inferCompanyFromHost() {
    const host = location.hostname.replace(/^www\./, '');
    const parts = host.split('.').filter(Boolean);
    const blacklist = new Set(['jobs', 'careers', 'apply', 'myworkdayjobs', 'greenhouse', 'lever', 'linkedin', 'indeed', 'workday', 'ashbyhq', 'smartrecruiters']);
    const candidate = parts.find((part) => !blacklist.has(part));
    return candidate ? candidate.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) : '';
  }

  function getDescription() {
    const selectors = [
      '[data-automation-id="jobPostingDescription"]',
      '[data-testid="jobDescription"]',
      '.jobs-description',
      '.jobs-description-content',
      '.show-more-less-html__markup',
      '.description__text',
      '.jobsearch-jobDescriptionText',
      '.job-description',
      '.jobDescriptionText',
      '.posting-page',
      '.posting-content',
      '.section-wrapper',
      '[class*="job-description"]',
      '[class*="JobDescription"]',
      'article',
      'main'
    ];
    const candidates = selectors.map((selector) => document.querySelector(selector)).filter(Boolean);
    let best = '';
    for (const node of candidates) {
      const value = normalize(node.innerText || node.textContent || '');
      if (value.length > best.length) best = value;
    }
    if (best.length < 900) {
      const bodyText = normalize(document.body?.innerText || '');
      if (bodyText.length > best.length) best = bodyText;
    }
    return cleanDescription(best);
  }

  BUNNY.clipJob = function clipJob() {
    const jsonJob = getJsonLdJobs()[0] || {};
    const description = getDescription();
    const salaryFromText = extractSalary(`${description}\n${document.body?.innerText || ''}`);
    const companyFromJson = typeof jsonJob.hiringOrganization === 'object' ? jsonJob.hiringOrganization?.name : jsonJob.hiringOrganization;
    const loc = jsonJob.jobLocation?.address;
    const locationText = typeof loc === 'object'
      ? [loc.addressLocality, loc.addressRegion, loc.addressCountry].filter(Boolean).join(', ')
      : '';

    const title = normalize(jsonJob.title || firstText([
      '[data-automation-id="jobPostingHeader"]',
      '[data-testid="job-title"]',
      '.jobs-unified-top-card__job-title',
      '.top-card-layout__title',
      '.jobsearch-JobInfoHeader-title',
      '.posting-headline h2',
      '.posting-headline h1',
      'h1'
    ]));

    const company = normalize(companyFromJson || firstText([
      '[data-automation-id="subtitle"]',
      '.jobs-unified-top-card__company-name',
      '.topcard__org-name-link',
      '.jobsearch-InlineCompanyRating div:first-child',
      '.posting-company',
      '[class*="company"]',
      '[data-testid="company-name"]'
    ]) || meta('og:site_name') || inferCompanyFromHost());

    const locationCandidate = normalize(locationText || firstText([
      '[data-automation-id="locations"]',
      '[data-testid="job-location"]',
      '.jobs-unified-top-card__bullet',
      '.topcard__flavor--bullet',
      '.jobsearch-JobInfoHeader-subtitle div',
      '.posting-categories .location',
      '[class*="location"]'
    ]));

    const clip = {
      source: inferSource(),
      url: location.href,
      pageTitle: document.title,
      title: title || document.title.split('|')[0].split('-')[0].trim(),
      company,
      location: locationCandidate,
      salaryMin: salaryFromText.min,
      salaryMax: salaryFromText.max,
      salaryText: salaryFromText.text,
      jd: description,
      clippedAt: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    return clip;
  };

  function labelFor(el) {
    const bits = [];
    if (el.id) {
      const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (label) bits.push(label.innerText || label.textContent || '');
    }
    const parentLabel = el.closest('label');
    if (parentLabel) bits.push(parentLabel.innerText || parentLabel.textContent || '');
    bits.push(el.getAttribute('aria-label') || '');
    bits.push(el.getAttribute('placeholder') || '');
    bits.push(el.getAttribute('name') || '');
    bits.push(el.id || '');
    bits.push(el.getAttribute('data-automation-id') || '');
    bits.push(el.closest('[aria-labelledby]')?.innerText || '');
    return lower(bits.filter(Boolean).join(' '));
  }

  function setNativeValue(el, value) {
    const prototype = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    if (descriptor?.set) descriptor.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function matchKey(label, el) {
    const type = lower(el.type || el.tagName);
    if (/password|captcha|recaptcha|verification|security code|one time|otp|ssn|social security|tax id|ein|routing|account number|credit card|card number|cvv|cvc|date of birth|birthdate|birthday/.test(label)) return null;
    if (/race|ethnicity|gender|disability|veteran|military|pronoun|sexual orientation|religion/.test(label)) return null;
    if (/resume|cv|cover letter upload|portfolio upload|file/.test(label) && type === 'file') return null;
    if (/first name|given name/.test(label)) return 'firstName';
    if (/last name|family name|surname/.test(label)) return 'lastName';
    if (/full name|legal name|preferred name|name/.test(label)) return 'fullName';
    if (/e-?mail/.test(label)) return 'email';
    if (/phone|mobile|cell/.test(label)) return 'phone';
    if (/address line 1|street address|address/.test(label)) return 'address1';
    if (/city/.test(label)) return 'city';
    if (/state|province|region/.test(label)) return 'state';
    if (/zip|postal/.test(label)) return 'zip';
    if (/location|where are you located/.test(label)) return 'location';
    if (/linkedin/.test(label)) return 'linkedin';
    if (/github/.test(label)) return 'github';
    if (/portfolio|website|personal site|url/.test(label)) return 'portfolio';
    if (/current company|employer/.test(label)) return 'currentCompany';
    if (/current title|current role|job title/.test(label)) return 'currentTitle';
    if (/salary|compensation|pay expectation|desired pay/.test(label)) return 'desiredSalary';
    if (/years.+experience|experience.+years/.test(label)) return 'yearsExperience';
    if (/authorized|eligible.+work|legally.+work|work.+authorization/.test(label)) return 'workAuthorization';
    if (/sponsor|sponsorship|visa/.test(label)) return 'sponsorship';
    if (/cover letter|why.+interested|additional information|summary|message to hiring/.test(label)) return 'coverLetter';
    return null;
  }

  function valueForKey(key, profile) {
    const fullName = normalize(`${profile.firstName || ''} ${profile.lastName || ''}`);
    const map = {
      fullName,
      location: normalize([profile.city, profile.state].filter(Boolean).join(', ')),
      portfolio: profile.portfolio || profile.website || profile.github,
      coverLetter: profile.coverLetter || profile.summary
    };
    return map[key] || profile[key] || '';
  }

  function selectOption(select, desired) {
    const value = lower(desired);
    if (!value) return false;
    const options = [...select.options];
    const direct = options.find((option) => lower(option.value) === value || lower(option.textContent) === value);
    const contains = direct || options.find((option) => lower(option.textContent).includes(value) || value.includes(lower(option.textContent)));
    if (contains) {
      select.value = contains.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }

  function chooseRadioOrCheckbox(el, desired) {
    const label = labelFor(el);
    const value = lower(el.value || '');
    const desiredValue = lower(desired);
    const wantsYes = desiredValue === 'yes' || desiredValue === 'true';
    const wantsNo = desiredValue === 'no' || desiredValue === 'false';
    const isYes = /yes|true|authorized|eligible/.test(value + ' ' + label);
    const isNo = /no|false|not/.test(value + ' ' + label);
    if ((wantsYes && isYes) || (wantsNo && isNo)) {
      el.click();
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }

  function describeField(el, key, value) {
    const rect = el.getBoundingClientRect();
    return {
      key,
      value,
      label: labelFor(el).slice(0, 120),
      tag: el.tagName.toLowerCase(),
      type: el.type || '',
      visible: visible(el),
      x: Math.round(rect.left + window.scrollX),
      y: Math.round(rect.top + window.scrollY)
    };
  }

  BUNNY.autofill = function autofill({ profile = {}, previewOnly = false, settings = {} } = {}) {
    const fields = [...document.querySelectorAll('input, textarea, select')].filter(visible).slice(0, settings.maxFieldsPerRun || FIELD_LIMIT_DEFAULT);
    const matches = [];
    const filled = [];
    for (const el of fields) {
      const label = labelFor(el);
      const key = matchKey(label, el);
      if (!key) continue;
      const value = valueForKey(key, profile);
      if (!value) continue;
      const item = describeField(el, key, value);
      matches.push(item);
      if (previewOnly) continue;
      try {
        if (el instanceof HTMLSelectElement) {
          if (!selectOption(el, value)) continue;
        } else if (el.type === 'radio' || el.type === 'checkbox') {
          if (!chooseRadioOrCheckbox(el, value)) continue;
        } else if (!el.value || settings.overwriteExisting) {
          setNativeValue(el, value);
        } else {
          continue;
        }
        if (settings.highlightFilledFields) {
          el.style.outline = '2px solid #8d5cf6';
          el.style.boxShadow = '0 0 0 4px rgba(141, 92, 246, .18)';
        }
        filled.push(item);
      } catch (error) {
        item.error = error.message;
      }
    }
    return { url: location.href, title: document.title, matches, filled, totalFields: fields.length };
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || message.source !== 'BunnyScout') return false;
    Promise.resolve()
      .then(() => {
        if (message.action === 'clip') return BUNNY.clipJob();
        if (message.action === 'autofill') return BUNNY.autofill(message.payload || {});
        if (message.action === 'preview') return BUNNY.autofill({ ...(message.payload || {}), previewOnly: true });
        throw new Error('Unknown BunnyScout action');
      })
      .then((result) => sendResponse({ ok: true, result }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  });

  window.__BUNNYSCOUT_EXTENSION__ = BUNNY;
})();
```

### `extension/dashboard.css`

```css
:root { --bg: #fff8fb; --card: #fff; --ink: #2b2438; --muted: #6d6578; --primary: #8d5cf6; --pink: #ff7aa8; --line: rgba(43,36,56,.12); --shadow: 0 18px 55px rgba(75,47,120,.14); }
* { box-sizing: border-box; }
body { margin: 0; background: radial-gradient(circle at top left, #ffe0ec, transparent 30%), linear-gradient(180deg, #fff8fb, #f7f2ff); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; }
.shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 44px; }
.masthead, .card { background: rgba(255,255,255,.9); border: 1px solid var(--line); border-radius: 28px; box-shadow: var(--shadow); }
.masthead { padding: 24px; display: flex; justify-content: space-between; gap: 20px; align-items: center; margin-bottom: 18px; }
.brand { display: flex; align-items: center; gap: 18px; }
.bunny { width: 72px; height: 66px; position: relative; flex: 0 0 auto; }
.bunny:before, .bunny:after { content: ''; position: absolute; top: 0; width: 20px; height: 44px; border: 2px solid var(--ink); background: #fff; border-radius: 999px; transform-origin: bottom; }
.bunny:before { left: 15px; transform: rotate(-15deg); } .bunny:after { right: 15px; transform: rotate(15deg); }
.bunny span { position: absolute; inset: 25px 4px 0; background: #fff; border: 2px solid var(--ink); border-radius: 50% 50% 44% 44%; box-shadow: inset 20px 0 0 #ffe0ec; }
.bunny span:before, .bunny span:after { content: ''; position: absolute; top: 17px; width: 6px; height: 6px; background: var(--ink); border-radius: 50%; } .bunny span:before { left: 18px; } .bunny span:after { right: 18px; }
.eyebrow { margin: 0 0 4px; text-transform: uppercase; color: var(--primary); letter-spacing: .12em; font-size: 11px; font-weight: 850; }
h1, h2 { margin: 0; } h1 { font-size: clamp(28px, 4vw, 44px); } h2 { font-size: 22px; } p { line-height: 1.55; color: var(--muted); }
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
.actions.small { justify-content: flex-end; }
button, .file-btn { border: 0; border-radius: 14px; background: #f1ebff; color: var(--ink); padding: 12px 14px; font-weight: 800; cursor: pointer; font: inherit; display: inline-flex; align-items: center; justify-content: center; }
button.primary { background: linear-gradient(135deg, var(--primary), var(--pink)); color: #fff; }
.grid { display: grid; gap: 18px; }
.card { padding: 20px; }
.card-head { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 14px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }
.profile-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
label { display: grid; gap: 6px; color: var(--muted); font-size: 13px; font-weight: 750; }
label.full { grid-column: 1 / -1; }
label.check { display: flex; align-items: center; gap: 8px; background: #fbf8ff; border: 1px solid var(--line); border-radius: 16px; padding: 12px; }
input, textarea, select { width: 100%; border: 1px solid var(--line); border-radius: 14px; padding: 11px 12px; font: inherit; background: #fff; color: var(--ink); }
textarea { resize: vertical; }
.note { background: #fbf8ff; border: 1px solid var(--line); padding: 12px; border-radius: 16px; }
.clips { display: grid; gap: 12px; }
.clip { display: grid; grid-template-columns: 1fr auto; gap: 12px; padding: 14px; border: 1px solid var(--line); border-radius: 18px; background: #fff; }
.clip h3 { margin: 0 0 6px; } .clip p { margin: 0 0 8px; }
.clip .meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; color: var(--muted); }
.pill { border: 1px solid var(--line); background: #fbf8ff; border-radius: 999px; padding: 5px 8px; }
@media (max-width: 850px) { .masthead, .card-head { flex-direction: column; align-items: stretch; } .profile-grid, .form-grid { grid-template-columns: 1fr; } .clip { grid-template-columns: 1fr; } }
```

### `extension/dashboard.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BunnyScout Extension Dashboard</title>
  <link rel="stylesheet" href="dashboard.css" />
</head>
<body>
  <div class="shell">
    <header class="masthead">
      <div class="brand">
        <div class="bunny" aria-hidden="true"><span></span></div>
        <div>
          <p class="eyebrow">Chrome / Edge extension</p>
          <h1>BunnyScout Clipper + Autofill</h1>
          <p>Keep a local autofill profile, review clipped jobs, and export anything you want to move into the BunnyScout web app.</p>
        </div>
      </div>
      <div class="actions">
        <button id="exportBtn" type="button">Export extension backup</button>
        <label class="file-btn">Import backup<input id="importInput" type="file" accept="application/json,.json" hidden /></label>
      </div>
    </header>

    <main class="grid">
      <section class="card wide">
        <div class="card-head">
          <div>
            <p class="eyebrow">settings</p>
            <h2>Extension behavior</h2>
          </div>
          <button class="primary" id="saveSettingsBtn" type="button">Save settings</button>
        </div>
        <div class="form-grid">
          <label>App URL for Open app
            <input id="appUrl" placeholder="https://your-bunnyscout.netlify.app/index.html" />
          </label>
          <label>Max fields per autofill run
            <input id="maxFieldsPerRun" type="number" min="20" max="250" step="10" />
          </label>
          <label class="check"><input id="previewBeforeFill" type="checkbox" /> Preview before filling</label>
          <label class="check"><input id="highlightFilledFields" type="checkbox" /> Highlight filled fields</label>
        </div>
        <p class="note">BunnyScout skips passwords, SSNs, banking fields, file uploads, birth dates, EEO demographics, veteran/disability questions, and unknown sensitive fields.</p>
      </section>

      <section class="card wide">
        <div class="card-head">
          <div>
            <p class="eyebrow">autofill profile</p>
            <h2>Your reusable application answers</h2>
          </div>
          <button class="primary" id="saveProfileBtn" type="button">Save profile</button>
        </div>
        <form id="profileForm" class="form-grid profile-grid">
          <label>First name<input name="firstName" autocomplete="given-name" /></label>
          <label>Last name<input name="lastName" autocomplete="family-name" /></label>
          <label>Email<input name="email" type="email" autocomplete="email" /></label>
          <label>Phone<input name="phone" autocomplete="tel" /></label>
          <label>Address line 1<input name="address1" autocomplete="address-line1" /></label>
          <label>City<input name="city" autocomplete="address-level2" /></label>
          <label>State<input name="state" autocomplete="address-level1" /></label>
          <label>ZIP<input name="zip" autocomplete="postal-code" /></label>
          <label>LinkedIn<input name="linkedin" placeholder="https://linkedin.com/in/..." /></label>
          <label>Portfolio<input name="portfolio" placeholder="https://..." /></label>
          <label>GitHub<input name="github" placeholder="https://github.com/..." /></label>
          <label>Website<input name="website" placeholder="https://..." /></label>
          <label>Current company<input name="currentCompany" /></label>
          <label>Current title<input name="currentTitle" /></label>
          <label>Desired salary<input name="desiredSalary" placeholder="$85,000" /></label>
          <label>Years of relevant experience<input name="yearsExperience" placeholder="3" /></label>
          <label>Authorized to work?
            <select name="workAuthorization"><option value="yes">Yes</option><option value="no">No</option></select>
          </label>
          <label>Need sponsorship?
            <select name="sponsorship"><option value="no">No</option><option value="yes">Yes</option></select>
          </label>
          <label class="full">Short professional summary<textarea name="summary" rows="4" placeholder="Brief truthful summary for open-ended application fields."></textarea></label>
          <label class="full">Reusable cover-letter / additional-info text<textarea name="coverLetter" rows="7" placeholder="Optional reusable response. Keep it honest and easy to customize."></textarea></label>
        </form>
      </section>

      <section class="card wide">
        <div class="card-head">
          <div>
            <p class="eyebrow">clips</p>
            <h2>Saved job clips</h2>
          </div>
          <div class="actions small">
            <button id="copyAllBtn" type="button">Copy all as BunnyScout JSON</button>
            <button id="clearClipsBtn" type="button">Clear clips</button>
          </div>
        </div>
        <div id="clipsList" class="clips"></div>
      </section>
    </main>
  </div>
  <script src="dashboard.js"></script>
</body>
</html>
```

### `extension/dashboard.js`

```javascript
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
```

### `extension/manifest.json`

```json
{
  "manifest_version": 3,
  "name": "BunnyScout Clipper + Autofill",
  "version": "1.0.0",
  "description": "Clip job postings, save them locally, and assist with safe application autofill for BunnyScout.",
  "minimum_chrome_version": "114",
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "action": {
    "default_title": "BunnyScout",
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "permissions": ["activeTab", "scripting", "storage"],
  "options_page": "dashboard.html",
  "background": {
    "service_worker": "service-worker.js"
  }
}
```

### `extension/popup.css`

```css
:root {
  --bg: #fff8fb;
  --card: #ffffff;
  --ink: #2b2438;
  --muted: #6d6578;
  --primary: #8d5cf6;
  --primary-2: #ff7aa8;
  --line: rgba(43, 36, 56, .12);
  --shadow: 0 18px 45px rgba(75, 47, 120, .18);
}
* { box-sizing: border-box; }
body { margin: 0; width: 360px; min-height: 560px; background: radial-gradient(circle at top left, #ffe0ec, transparent 34%), var(--bg); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; }
.popup-shell { padding: 16px; display: grid; gap: 12px; }
.hero { display: flex; gap: 12px; align-items: center; background: linear-gradient(135deg, #ffffff, #f6f0ff); border: 1px solid var(--line); border-radius: 22px; padding: 14px; box-shadow: var(--shadow); }
.eyebrow { margin: 0 0 2px; text-transform: uppercase; letter-spacing: .12em; color: var(--primary); font-size: 10px; font-weight: 800; }
h1 { margin: 0; font-size: 22px; }
.bunny { width: 54px; height: 50px; position: relative; }
.bunny:before, .bunny:after { content: ''; position: absolute; top: -2px; width: 16px; height: 34px; border-radius: 999px; background: #fff; border: 2px solid #2b2438; transform-origin: bottom; }
.bunny:before { left: 10px; transform: rotate(-14deg); }
.bunny:after { right: 10px; transform: rotate(14deg); }
.bunny span { position: absolute; inset: 16px 2px 0; background: #fff; border: 2px solid #2b2438; border-radius: 50% 50% 42% 42%; box-shadow: inset 14px 0 0 #ffe0ec; }
.bunny span:before, .bunny span:after { content: ''; position: absolute; top: 14px; width: 5px; height: 5px; background: #2b2438; border-radius: 50%; }
.bunny span:before { left: 14px; } .bunny span:after { right: 14px; }
.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.stats div, .panel, .result, footer { background: rgba(255,255,255,.88); border: 1px solid var(--line); border-radius: 18px; padding: 12px; box-shadow: 0 12px 25px rgba(75, 47, 120, .08); }
.stats strong { display: block; font-size: 24px; }
.stats span { font-size: 12px; color: var(--muted); }
.panel { display: grid; gap: 10px; }
.compact { gap: 8px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
label { display: grid; gap: 5px; font-size: 12px; color: var(--muted); font-weight: 700; }
input { border: 1px solid var(--line); border-radius: 12px; padding: 10px; font: inherit; color: var(--ink); background: #fff; }
button { border: 0; border-radius: 14px; padding: 11px 12px; font-weight: 800; cursor: pointer; color: var(--ink); background: #f1ebff; transition: transform .15s ease, filter .15s ease; }
button:hover { transform: translateY(-1px); filter: brightness(.98); }
button.primary { background: linear-gradient(135deg, var(--primary), var(--primary-2)); color: white; }
.result { min-height: 92px; font-size: 13px; color: var(--muted); line-height: 1.45; white-space: pre-wrap; }
.result strong { color: var(--ink); }
footer button { width: 100%; background: #fff; border: 1px solid var(--line); }
```

### `extension/popup.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BunnyScout</title>
  <link rel="stylesheet" href="popup.css" />
</head>
<body>
  <main class="popup-shell">
    <header class="hero">
      <div class="bunny" aria-hidden="true"><span></span></div>
      <div>
        <p class="eyebrow">BunnyScout</p>
        <h1>Clip + autofill</h1>
      </div>
    </header>

    <section class="stats">
      <div><strong id="clipCount">0</strong><span>clips</span></div>
      <div><strong id="profileScore">0%</strong><span>profile ready</span></div>
    </section>

    <section class="panel">
      <button class="primary" id="clipBtn" type="button">Clip this job</button>
      <button id="previewBtn" type="button">Preview autofill fields</button>
      <button id="fillBtn" type="button">Autofill page</button>
    </section>

    <section class="panel compact">
      <label>
        App URL
        <input id="appUrl" placeholder="https://your-site.netlify.app/index.html" />
      </label>
      <div class="row">
        <button id="openAppBtn" type="button">Open app</button>
        <button id="copyClipBtn" type="button">Copy latest clip</button>
      </div>
    </section>

    <section id="result" class="result" aria-live="polite">Ready when you are.</section>

    <footer>
      <button id="dashboardBtn" type="button">Profile + saved clips</button>
    </footer>
  </main>
  <script src="popup.js"></script>
</body>
</html>
```

### `extension/popup.js`

```javascript
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
```

### `extension/service-worker.js`

```javascript
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(['profile', 'settings', 'clips']);
  const defaults = {};
  if (!existing.profile) {
    defaults.profile = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
      address1: '',
      linkedin: '',
      portfolio: '',
      github: '',
      website: '',
      currentCompany: '',
      currentTitle: '',
      desiredSalary: '',
      yearsExperience: '',
      workAuthorization: 'yes',
      sponsorship: 'no',
      coverLetter: '',
      summary: ''
    };
  }
  if (!existing.settings) {
    defaults.settings = {
      appUrl: 'http://localhost:8080/index.html',
      previewBeforeFill: true,
      highlightFilledFields: true,
      maxFieldsPerRun: 140
    };
  }
  if (!Array.isArray(existing.clips)) defaults.clips = [];
  if (Object.keys(defaults).length) await chrome.storage.local.set(defaults);
});
```

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#8d5cf6" />
    <meta name="description" content="BunnyScout is a local-first job search command center for tracking applications, tailoring resume prompts, salary planning, follow-ups, and recruiter outreach." />
    <title>BunnyScout Job Search HQ</title>
    <link rel="manifest" href="manifest.json" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="app-shell">
      <aside class="sidebar" aria-label="Primary navigation">
        <div class="brand-block">
          <div class="bunny-logo" aria-hidden="true">
            <div class="ear ear-left"></div>
            <div class="ear ear-right"></div>
            <div class="head">
              <span class="eye eye-left"></span>
              <span class="eye eye-right"></span>
              <span class="nose"></span>
              <span class="smile"></span>
            </div>
          </div>
          <div>
            <p class="eyebrow">local-first</p>
            <h1>BunnyScout</h1>
          </div>
        </div>

        <nav class="nav-list">
          <button class="nav-btn active" data-view="dashboard">Dashboard</button>
          <button class="nav-btn" data-view="jobs">Job Tracker</button>
          <button class="nav-btn" data-view="add">Add / Analyze Job</button>
          <button class="nav-btn" data-view="prompt">Resume Prompt Lab</button>
          <button class="nav-btn" data-view="salary">Earnings Planner</button>
          <button class="nav-btn" data-view="profile">Profile + Vault</button>
          <button class="nav-btn" data-view="recruiters">Recruiter Map</button>
          <button class="nav-btn" data-view="settings">Backup + Settings</button>
        </nav>

        <div class="privacy-card">
          <strong>Private by default</strong>
          <span>Your data stays in this browser unless you export it.</span>
        </div>
      </aside>

      <main class="main-panel">
        <header class="topbar">
          <button class="mobile-menu" type="button" aria-label="Open navigation">☰</button>
          <div>
            <p class="eyebrow">job hunt command center</p>
            <h2 id="viewTitle">Dashboard</h2>
          </div>
          <div class="top-actions">
            <button class="ghost-btn" id="seedDemoBtn" type="button">Load sample</button>
            <button class="primary-btn" data-view-target="add" type="button">+ Add job</button>
          </div>
        </header>

        <section class="view active" id="dashboardView" aria-labelledby="dashboardHeading">
          <div class="hero-card">
            <div>
              <p class="eyebrow">today's mission</p>
              <h3 id="dashboardHeading">Apply smarter, follow up faster, stay sane.</h3>
              <p>BunnyScout keeps your job search organized without sending your resume, job descriptions, notes, or personal details to a server.</p>
              <div class="hero-actions">
                <button class="primary-btn" data-view-target="add" type="button">Analyze a job description</button>
                <button class="secondary-btn" data-view-target="prompt" type="button">Generate tailoring prompt</button>
              </div>
            </div>
            <div class="bunny-hero" aria-hidden="true">
              <div class="moon"></div>
              <div class="bunny-bounce">
                <div class="ear ear-left"></div>
                <div class="ear ear-right"></div>
                <div class="head"><span class="eye eye-left"></span><span class="eye eye-right"></span><span class="nose"></span><span class="smile"></span></div>
                <div class="body"></div>
              </div>
            </div>
          </div>

          <div class="metric-grid" id="metricGrid"></div>

          <div class="grid two-col">
            <article class="card">
              <div class="card-head">
                <div>
                  <p class="eyebrow">pipeline</p>
                  <h3>Status breakdown</h3>
                </div>
                <button class="tiny-btn" data-view-target="jobs" type="button">Open tracker</button>
              </div>
              <div id="pipelineChart" class="pipeline-chart"></div>
            </article>
            <article class="card">
              <div class="card-head">
                <div>
                  <p class="eyebrow">action queue</p>
                  <h3>Follow-ups and likely ghosts</h3>
                </div>
              </div>
              <div id="actionQueue" class="stack-list"></div>
            </article>
          </div>

          <article class="card">
            <div class="card-head">
              <div>
                <p class="eyebrow">recent jobs</p>
                <h3>Latest saved roles</h3>
              </div>
            </div>
            <div id="recentJobs" class="job-card-list"></div>
          </article>
        </section>

        <section class="view" id="jobsView" aria-labelledby="jobsHeading">
          <div class="section-head">
            <div>
              <p class="eyebrow">kanban + table</p>
              <h3 id="jobsHeading">Job Tracker</h3>
              <p>Track the roles, which resume you used, when to follow up, and what happened next.</p>
            </div>
            <button class="primary-btn" data-view-target="add" type="button">Add job</button>
          </div>
          <div class="toolbar">
            <label class="search-label">
              <span>Search</span>
              <input id="jobSearch" type="search" placeholder="Company, title, keyword..." />
            </label>
            <label>
              <span>Status</span>
              <select id="statusFilter"></select>
            </label>
            <label>
              <span>Sort</span>
              <select id="sortJobs">
                <option value="newest">Newest saved</option>
                <option value="followup">Follow-up due</option>
                <option value="match">Best match</option>
                <option value="salary">Highest salary</option>
                <option value="company">Company A-Z</option>
              </select>
            </label>
          </div>
          <div id="jobsList" class="job-card-list"></div>
        </section>

        <section class="view" id="addView" aria-labelledby="addHeading">
          <div class="section-head">
            <div>
              <p class="eyebrow">clip + analyze</p>
              <h3 id="addHeading">Add / Analyze Job</h3>
              <p>Paste a job description and BunnyScout will extract salary, keywords, likely fit, and a follow-up date.</p>
            </div>
          </div>
          <article class="card extension-import-card">
            <div class="card-head">
              <div>
                <p class="eyebrow">browser extension bridge</p>
                <h3>Import a clipped job</h3>
                <p>Use the Chrome/Edge extension to clip a job page, then paste the BunnyScout JSON here to fill this form.</p>
              </div>
              <div class="chip-row">
                <button class="tiny-btn" id="pasteClipBtn" type="button">Paste from clipboard</button>
                <button class="tiny-btn" id="importClipBtn" type="button">Import clip</button>
              </div>
            </div>
            <label>Extension clip JSON<textarea id="clipImportInput" rows="4" placeholder="Paste BunnyScoutClip or BunnyScoutClipBundle JSON from the extension..."></textarea></label>
            <p class="security-note">The extension and this app do not share a cloud account. This keeps your job-search data private, but means clips move through clipboard, hash import, or backup files.</p>
          </article>

          <form id="jobForm" class="card form-grid">
            <div class="field-pair">
              <label>Job title<input name="title" required placeholder="Health Communications Specialist" /></label>
              <label>Company<input name="company" required placeholder="Agency, nonprofit, startup..." /></label>
            </div>
            <div class="field-pair">
              <label>Location<input name="location" placeholder="Seattle, Remote, DC..." /></label>
              <label>Industry<input name="industry" placeholder="Government, health, marketing, tech..." /></label>
            </div>
            <div class="field-pair">
              <label>Job URL<input name="url" type="url" placeholder="https://..." /></label>
              <label>Source<input name="source" placeholder="LinkedIn, Indeed, recruiter..." /></label>
            </div>
            <div class="field-pair">
              <label>Salary minimum<input name="salaryMin" inputmode="numeric" placeholder="70000" /></label>
              <label>Salary maximum<input name="salaryMax" inputmode="numeric" placeholder="95000" /></label>
            </div>
            <div class="field-pair">
              <label>Status
                <select name="status" id="newJobStatus"></select>
              </label>
              <label>Excitement
                <select name="excitement">
                  <option value="3">3 - neutral</option>
                  <option value="5">5 - dream role</option>
                  <option value="4">4 - strong fit</option>
                  <option value="2">2 - maybe</option>
                  <option value="1">1 - backup</option>
                </select>
              </label>
            </div>
            <label>Job description<textarea name="jd" id="jdInput" rows="12" placeholder="Paste the full job description here..."></textarea></label>
            <label>Notes<textarea name="notes" rows="4" placeholder="Recruiter notes, concerns, referral ideas, etc."></textarea></label>
            <div class="form-actions">
              <button class="secondary-btn" id="analyzeBtn" type="button">Analyze description</button>
              <button class="primary-btn" type="submit">Save job</button>
            </div>
          </form>
          <div id="analysisResults" class="analysis-results"></div>
        </section>

        <section class="view" id="promptView" aria-labelledby="promptHeading">
          <div class="section-head">
            <div>
              <p class="eyebrow">chatgpt / claude helper</p>
              <h3 id="promptHeading">Resume Prompt Lab</h3>
              <p>Pick a saved job and generate a resume tailoring prompt that tells AI exactly what to do without inventing experience.</p>
            </div>
          </div>
          <div class="grid two-col">
            <article class="card">
              <label>Choose job<select id="promptJobSelect"></select></label>
              <label>Prompt style
                <select id="promptStyle">
                  <option value="resume">Tailor resume bullets</option>
                  <option value="cover">Cover letter</option>
                  <option value="ats">ATS keyword gap analysis</option>
                  <option value="interview">Interview prep</option>
                  <option value="linkedin">LinkedIn recruiter message</option>
                </select>
              </label>
              <label>Strictness
                <select id="promptStrictness">
                  <option value="strict">Strict: never fabricate</option>
                  <option value="balanced">Balanced: improve phrasing only</option>
                  <option value="bold">Bold: stronger positioning, still truthful</option>
                </select>
              </label>
              <button class="primary-btn full" id="generatePromptBtn" type="button">Generate prompt</button>
            </article>
            <article class="card">
              <div class="card-head">
                <div>
                  <p class="eyebrow">output</p>
                  <h3>Copy this into ChatGPT or Claude</h3>
                </div>
                <button class="tiny-btn" id="copyPromptBtn" type="button">Copy</button>
              </div>
              <textarea id="promptOutput" class="prompt-output" rows="18" readonly></textarea>
            </article>
          </div>
        </section>

        <section class="view" id="salaryView" aria-labelledby="salaryHeading">
          <div class="section-head">
            <div>
              <p class="eyebrow">earnings potential</p>
              <h3 id="salaryHeading">Earnings Planner</h3>
              <p>Estimate bands by role family, experience, industry, and location multiplier. Use official salary sources before negotiating.</p>
            </div>
          </div>
          <div class="grid two-col">
            <article class="card form-grid">
              <label>Role family<select id="salaryRole"></select></label>
              <label>Years of relevant experience<input id="salaryYears" type="range" min="0" max="20" step="1" value="3" /><span id="salaryYearsLabel" class="range-readout">3 years</span></label>
              <label>Market / location multiplier<select id="salaryMarket"><option value="0.9">Lower-cost market · 0.90x</option><option value="1" selected>National baseline · 1.00x</option><option value="1.12">Large metro · 1.12x</option><option value="1.22">Seattle / high-cost tech market · 1.22x</option><option value="1.32">Bay Area / NYC senior market · 1.32x</option></select></label>
              <label>Industry multiplier<select id="salaryIndustry"><option value="0.92">Nonprofit / education · 0.92x</option><option value="1" selected>General private sector · 1.00x</option><option value="1.06">Government contractor · 1.06x</option><option value="1.14">Tech / software · 1.14x</option><option value="1.2">Specialized healthcare / pharma · 1.20x</option></select></label>
              <button class="primary-btn full" id="calcSalaryBtn" type="button">Estimate range</button>
            </article>
            <article class="card salary-card" id="salaryOutput"></article>
          </div>
        </section>

        <section class="view" id="profileView" aria-labelledby="profileHeading">
          <div class="section-head">
            <div>
              <p class="eyebrow">identity + assets</p>
              <h3 id="profileHeading">Profile + Resume Vault</h3>
              <p>Save reusable application answers, skills, links, and resume files. Files are stored in this browser using IndexedDB.</p>
            </div>
          </div>
          <div class="grid two-col">
            <form id="profileForm" class="card form-grid">
              <label>Full name<input name="name" placeholder="Your name" /></label>
              <div class="field-pair"><label>Email<input name="email" type="email" /></label><label>Phone<input name="phone" /></label></div>
              <label>Location<input name="location" placeholder="Bellingham, WA / Seattle / Remote" /></label>
              <label>Target titles<input name="targetTitles" placeholder="Communications Specialist, Web Developer, 508 Specialist" /></label>
              <label>Skills / keywords<textarea name="skills" rows="5" placeholder="508 compliance, NIH communications, social media, HTML, CSS, project management..."></textarea></label>
              <label>Reusable profile links<textarea name="links" rows="3" placeholder="Portfolio, LinkedIn, GitHub..."></textarea></label>
              <label>Resume text for matching<textarea name="resumeText" rows="8" placeholder="Paste your master resume text here. This stays local."></textarea></label>
              <label>Common application answers<textarea name="commonAnswers" rows="7" placeholder="Work authorization, salary range, availability, preferred schedule, pronouns, references policy, etc."></textarea></label>
              <button class="primary-btn full" type="submit">Save profile</button>
            </form>
            <article class="card">
              <div class="card-head">
                <div>
                  <p class="eyebrow">documents</p>
                  <h3>Resume / cover letter vault</h3>
                </div>
              </div>
              <div class="upload-box">
                <input id="fileInput" type="file" multiple accept=".pdf,.doc,.docx,.txt,.md,.rtf" />
                <p>Upload resume versions, cover letters, or notes. Keep files under 5 MB each for smooth mobile storage.</p>
              </div>
              <div id="fileList" class="stack-list"></div>
            </article>
          </div>
        </section>

        <section class="view" id="recruitersView" aria-labelledby="recruitersHeading">
          <div class="section-head">
            <div>
              <p class="eyebrow">outreach</p>
              <h3 id="recruitersHeading">Recruiter Map</h3>
              <p>Starter directory for agencies and search shortcuts. Add notes about which recruiters actually respond.</p>
            </div>
            <button class="primary-btn" id="addRecruiterBtn" type="button">Add agency</button>
          </div>
          <div class="toolbar">
            <label class="search-label"><span>Search agencies</span><input id="recruiterSearch" type="search" placeholder="Creative, tech, remote, Seattle..." /></label>
            <button class="secondary-btn" id="copyRecruiterPitchBtn" type="button">Copy outreach pitch</button>
          </div>
          <div id="recruiterList" class="job-card-list"></div>
        </section>

        <section class="view" id="settingsView" aria-labelledby="settingsHeading">
          <div class="section-head">
            <div>
              <p class="eyebrow">security + portability</p>
              <h3 id="settingsHeading">Backup + Settings</h3>
              <p>Export your data, import it on another device, or create an encrypted backup file.</p>
            </div>
          </div>
          <div class="grid two-col">
            <article class="card form-grid">
              <h3>Backups</h3>
              <button class="primary-btn full" id="exportBtn" type="button">Export JSON backup</button>
              <label>Password for encrypted backup<input id="backupPassword" type="password" autocomplete="new-password" placeholder="Optional but recommended" /></label>
              <button class="secondary-btn full" id="exportEncryptedBtn" type="button">Export encrypted backup</button>
              <label>Import backup<input id="importInput" type="file" accept=".json,.bunny" /></label>
              <button class="danger-btn full" id="wipeBtn" type="button">Wipe local app data</button>
            </article>
            <article class="card form-grid">
              <h3>Settings</h3>
              <label>Days until “likely ghosted”<input id="ghostDays" type="number" min="3" max="90" /></label>
              <label>Default follow-up days after applying<input id="followupDays" type="number" min="1" max="30" /></label>
              <label><span class="checkbox-row"><input id="showConfetti" type="checkbox" /> Celebrate when offer status is selected</span></label>
              <button class="primary-btn full" id="saveSettingsBtn" type="button">Save settings</button>
              <div class="security-note">
                <strong>Important limitation:</strong> this web app cannot directly type into job boards running in other tabs. Use the copy chips, prompt lab, and optional bookmarklet pattern in the README for safer form assistance.
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>

    <div id="toast" role="status" aria-live="polite"></div>
    <script src="app.js" type="module"></script>
  </body>
</html>
```

### `manifest.json`

```json
{
  "name": "BunnyScout Job Search HQ",
  "short_name": "BunnyScout",
  "description": "Local-first job tracker, prompt generator, salary planner, recruiter map, and resume vault.",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#fbf7ff",
  "theme_color": "#8d5cf6",
  "icons": [
    {
      "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='44' fill='%238d5cf6'/%3E%3Cellipse cx='73' cy='66' rx='20' ry='48' fill='%23fff'/%3E%3Cellipse cx='119' cy='66' rx='20' ry='48' fill='%23fff'/%3E%3Ccircle cx='96' cy='108' r='52' fill='%23fff'/%3E%3Ccircle cx='78' cy='101' r='7' fill='%2320152e'/%3E%3Ccircle cx='114' cy='101' r='7' fill='%2320152e'/%3E%3Cpath d='M91 116c4-4 8-4 12 0-2 5-10 5-12 0z' fill='%23ff7aa8'/%3E%3Cpath d='M77 128c10 11 28 11 38 0' stroke='%2320152e' stroke-width='6' stroke-linecap='round' fill='none'/%3E%3C/svg%3E",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

### `netlify.toml`

```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
```

### `service-worker.js`

```javascript
const CACHE_NAME = 'bunnyscout-cache-v1';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
```

### `styles.css`

```css
:root {
  color-scheme: light;
  --bg: #fbf7ff;
  --panel: #ffffff;
  --panel-soft: #fff8fd;
  --text: #20152e;
  --muted: #6f627a;
  --line: #eadff4;
  --primary: #8d5cf6;
  --primary-deep: #6037bb;
  --primary-soft: #efe6ff;
  --pink: #ff7aa8;
  --mint: #58d7b4;
  --amber: #ffc857;
  --danger: #cf3450;
  --shadow: 0 20px 60px rgba(72, 42, 117, 0.14);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }
html { min-height: 100%; background: radial-gradient(circle at 10% 0%, #ffffff 0, var(--bg) 35%, #f3edff 100%); }
body { margin: 0; color: var(--text); min-height: 100vh; }
button, input, textarea, select { font: inherit; }
button { cursor: pointer; }
a { color: var(--primary-deep); }

.app-shell { display: grid; grid-template-columns: 292px minmax(0, 1fr); min-height: 100vh; }
.sidebar { position: sticky; top: 0; height: 100vh; padding: 24px 18px; background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,248,253,.88)); border-right: 1px solid var(--line); backdrop-filter: blur(18px); display: flex; flex-direction: column; gap: 22px; z-index: 20; }
.brand-block { display: flex; align-items: center; gap: 14px; padding: 8px; }
.brand-block h1 { margin: 0; letter-spacing: -0.04em; font-size: 1.8rem; }
.eyebrow { margin: 0 0 5px; text-transform: uppercase; font-size: .72rem; letter-spacing: .16em; font-weight: 800; color: var(--primary-deep); }
.nav-list { display: grid; gap: 8px; }
.nav-btn { width: 100%; text-align: left; border: 1px solid transparent; background: transparent; color: var(--muted); padding: 13px 14px; border-radius: 16px; font-weight: 750; transition: .18s ease; }
.nav-btn:hover { background: var(--panel); color: var(--text); box-shadow: 0 8px 24px rgba(72,42,117,.08); }
.nav-btn.active { background: var(--primary); color: #fff; box-shadow: 0 12px 30px rgba(141,92,246,.28); }
.privacy-card { margin-top: auto; border-radius: 20px; padding: 15px; background: #fff; border: 1px solid var(--line); box-shadow: 0 10px 30px rgba(72,42,117,.08); display: grid; gap: 4px; }
.privacy-card span { color: var(--muted); font-size: .9rem; line-height: 1.35; }

.main-panel { min-width: 0; padding: 24px clamp(16px, 4vw, 44px) 60px; }
.topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 22px; }
.topbar h2, .section-head h3, .card h3 { margin: 0; letter-spacing: -0.03em; }
.topbar h2 { font-size: clamp(2rem, 4vw, 3.4rem); }
.top-actions { display: flex; gap: 10px; align-items: center; }
.mobile-menu { display: none; border: 1px solid var(--line); background: var(--panel); border-radius: 14px; padding: 11px 14px; }

.view { display: none; animation: fadeIn .2s ease both; }
.view.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.hero-card { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(210px, .8fr); gap: 22px; align-items: center; border-radius: var(--radius-xl); padding: clamp(24px, 4vw, 44px); background: linear-gradient(135deg, #fff, #fff2f8 48%, #efe6ff); box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,.8); overflow: hidden; position: relative; }
.hero-card h3 { font-size: clamp(2.1rem, 5vw, 4.6rem); line-height: .95; margin: 0 0 16px; letter-spacing: -0.07em; max-width: 880px; }
.hero-card p:not(.eyebrow) { color: var(--muted); max-width: 640px; font-size: 1.04rem; line-height: 1.6; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }

.primary-btn, .secondary-btn, .ghost-btn, .tiny-btn, .danger-btn { border: 0; border-radius: 15px; min-height: 42px; padding: 11px 15px; font-weight: 850; display: inline-flex; justify-content: center; align-items: center; gap: 8px; transition: .16s ease; }
.primary-btn { background: var(--primary); color: #fff; box-shadow: 0 12px 26px rgba(141,92,246,.28); }
.primary-btn:hover { background: var(--primary-deep); transform: translateY(-1px); }
.secondary-btn { background: var(--primary-soft); color: var(--primary-deep); }
.secondary-btn:hover { background: #e5d6ff; transform: translateY(-1px); }
.ghost-btn, .tiny-btn { background: #fff; color: var(--text); border: 1px solid var(--line); }
.tiny-btn { min-height: 34px; padding: 8px 12px; font-size: .86rem; }
.danger-btn { background: #ffe8ee; color: var(--danger); }
.full { width: 100%; }

.metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin: 18px 0; }
.metric { padding: 18px; border-radius: 22px; background: var(--panel); border: 1px solid var(--line); box-shadow: 0 12px 35px rgba(72,42,117,.07); }
.metric strong { display: block; font-size: 2.1rem; letter-spacing: -0.06em; }
.metric span { color: var(--muted); font-weight: 750; font-size: .9rem; }

.grid { display: grid; gap: 18px; margin-top: 18px; }
.two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.card { background: rgba(255,255,255,.92); border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: 0 14px 44px rgba(72,42,117,.08); padding: clamp(16px, 3vw, 24px); }
.card-head, .section-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; margin-bottom: 16px; }
.section-head { margin-top: 6px; }
.section-head p:not(.eyebrow) { color: var(--muted); margin: 8px 0 0; line-height: 1.5; max-width: 780px; }

.pipeline-chart { display: grid; gap: 12px; }
.bar-row { display: grid; grid-template-columns: 120px minmax(0, 1fr) 36px; gap: 10px; align-items: center; font-size: .9rem; }
.bar-track { height: 12px; background: var(--primary-soft); border-radius: 999px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--pink)); border-radius: inherit; min-width: 4px; }
.stack-list { display: grid; gap: 10px; }
.stack-item { border: 1px solid var(--line); border-radius: 16px; padding: 12px; background: var(--panel-soft); display: grid; gap: 4px; }
.stack-item small, .muted { color: var(--muted); }

.toolbar { display: grid; grid-template-columns: 1fr 190px 170px; gap: 12px; align-items: end; margin-bottom: 16px; }
label { display: grid; gap: 7px; color: var(--muted); font-weight: 800; font-size: .88rem; }
input, select, textarea { width: 100%; border: 1px solid var(--line); background: #fff; border-radius: 14px; padding: 12px 13px; color: var(--text); outline: none; transition: border .15s ease, box-shadow .15s ease; }
textarea { resize: vertical; line-height: 1.45; }
input:focus, select:focus, textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(141,92,246,.12); }

.form-grid { display: grid; gap: 14px; }
.field-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
.analysis-results { display: grid; gap: 14px; margin-top: 16px; }
.keyword-pills, .chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.pill, .status-pill { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 7px 10px; font-size: .8rem; font-weight: 850; background: var(--primary-soft); color: var(--primary-deep); }
.status-pill { background: #f7f1ff; color: var(--muted); }
.status-pill.offer { background: #dcfff4; color: #08785f; }
.status-pill.rejected { background: #ffe8ee; color: var(--danger); }
.status-pill.interview { background: #fff4d5; color: #8c5a00; }
.status-pill.ghosted { background: #f0edf5; color: #5d5268; }

.job-card-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(285px, 1fr)); gap: 14px; }
.job-card { position: relative; display: grid; gap: 12px; border: 1px solid var(--line); border-radius: 22px; padding: 17px; background: #fff; box-shadow: 0 12px 34px rgba(72,42,117,.07); }
.job-card h4 { margin: 0; font-size: 1.05rem; letter-spacing: -0.02em; }
.job-meta { display: flex; flex-wrap: wrap; gap: 8px; color: var(--muted); font-size: .86rem; }
.match-ring { --score: 0; position: absolute; top: 16px; right: 16px; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; background: conic-gradient(var(--primary) calc(var(--score) * 1%), #eee6f5 0); font-weight: 900; font-size: .8rem; }
.match-ring::before { content: ''; position: absolute; inset: 5px; border-radius: inherit; background: #fff; }
.match-ring span { position: relative; z-index: 1; }
.job-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.job-actions button, .job-actions a { text-decoration: none; border: 1px solid var(--line); background: var(--panel-soft); color: var(--text); border-radius: 12px; padding: 8px 10px; font-weight: 800; font-size: .84rem; }
.quick-copy-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.quick-copy-grid button { border: 1px solid var(--line); background: #fff; border-radius: 12px; padding: 9px; text-align: left; color: var(--text); font-weight: 800; }
.inline-select { padding: 8px 10px; min-height: 36px; }

.prompt-output { min-height: 420px; background: #171121; color: #fff; border-color: #302241; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .88rem; }
.salary-card { display: grid; align-content: start; gap: 16px; }
.salary-big { font-size: clamp(2.2rem, 4vw, 3.4rem); line-height: 1; letter-spacing: -0.06em; margin: 0; }
.salary-bands { display: grid; gap: 10px; }
.salary-band { display: grid; grid-template-columns: 90px 1fr; gap: 10px; align-items: center; }
.range-readout { color: var(--text); font-size: .95rem; font-weight: 900; }
.upload-box { border: 2px dashed #d7c7ee; border-radius: 20px; padding: 18px; background: var(--panel-soft); margin-bottom: 14px; }
.upload-box p { color: var(--muted); margin: 10px 0 0; font-size: .9rem; }
.checkbox-row { display: flex; align-items: center; gap: 8px; color: var(--text); }
.checkbox-row input { width: auto; }
.security-note { border-radius: 16px; background: #fff8e0; border: 1px solid #ffe49b; padding: 12px; line-height: 1.45; color: #654600; }

.bunny-logo { position: relative; width: 58px; height: 58px; flex: 0 0 auto; }
.bunny-logo .ear, .bunny-hero .ear { position: absolute; width: 15px; height: 38px; border-radius: 999px; background: #fff; border: 3px solid #20152e; top: -4px; }
.bunny-logo .ear-left { left: 12px; transform: rotate(-16deg); }
.bunny-logo .ear-right { right: 12px; transform: rotate(16deg); }
.bunny-logo .head, .bunny-hero .head { position: absolute; width: 54px; height: 46px; border-radius: 52% 52% 48% 48%; background: #fff; border: 3px solid #20152e; bottom: 0; left: 2px; }
.eye { position: absolute; width: 5px; height: 7px; background: #20152e; border-radius: 50%; top: 17px; }
.eye-left { left: 15px; }
.eye-right { right: 15px; }
.nose { position: absolute; width: 8px; height: 6px; border-radius: 50%; background: var(--pink); top: 26px; left: 50%; transform: translateX(-50%); }
.smile { position: absolute; width: 18px; height: 8px; border-bottom: 3px solid #20152e; border-radius: 0 0 999px 999px; left: 50%; transform: translateX(-50%) rotate(-3deg); top: 31px; }
.bunny-logo::after { content: ''; position: absolute; inset: -6px; z-index: -1; border-radius: 20px; background: linear-gradient(135deg, var(--primary), var(--pink)); opacity: .2; }

.bunny-hero { min-height: 250px; position: relative; display: grid; place-items: center; }
.moon { position: absolute; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,.6); box-shadow: inset -16px -20px 0 rgba(141,92,246,.08); }
.bunny-bounce { position: relative; width: 170px; height: 190px; animation: hop 2.7s ease-in-out infinite; }
@keyframes hop { 0%, 100% { transform: translateY(0); } 45% { transform: translateY(-13px); } }
.bunny-hero .ear { width: 36px; height: 100px; top: -8px; }
.bunny-hero .ear-left { left: 43px; transform: rotate(-12deg); }
.bunny-hero .ear-right { right: 43px; transform: rotate(12deg); }
.bunny-hero .head { width: 126px; height: 100px; left: 22px; top: 64px; border-width: 4px; }
.bunny-hero .eye { width: 10px; height: 14px; top: 38px; }
.bunny-hero .eye-left { left: 34px; }
.bunny-hero .eye-right { right: 34px; }
.bunny-hero .nose { width: 17px; height: 12px; top: 56px; }
.bunny-hero .smile { width: 42px; height: 18px; border-bottom-width: 4px; top: 66px; transform: translateX(-50%) rotate(-6deg); }
.bunny-hero .body { position: absolute; width: 116px; height: 72px; background: #fff; border: 4px solid #20152e; border-radius: 50% 50% 44% 44%; bottom: 0; left: 27px; z-index: -1; }

#toast { position: fixed; left: 50%; bottom: calc(20px + var(--safe-bottom)); transform: translateX(-50%) translateY(20px); opacity: 0; pointer-events: none; background: #20152e; color: #fff; border-radius: 999px; padding: 12px 16px; font-weight: 800; box-shadow: var(--shadow); transition: .22s ease; z-index: 60; max-width: min(92vw, 620px); text-align: center; }
#toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

.confetti-piece { position: fixed; width: 9px; height: 14px; border-radius: 4px; top: -20px; animation: fall 1.8s ease-in forwards; z-index: 100; }
@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }

@media (max-width: 980px) {
  .app-shell { grid-template-columns: 1fr; }
  .sidebar { position: fixed; left: 0; transform: translateX(-105%); width: min(86vw, 320px); transition: transform .2s ease; box-shadow: var(--shadow); }
  .sidebar.open { transform: translateX(0); }
  .mobile-menu { display: inline-flex; }
  .topbar { align-items: flex-start; }
  .top-actions { display: none; }
  .hero-card, .two-col, .field-pair { grid-template-columns: 1fr; }
  .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .toolbar { grid-template-columns: 1fr; }
  .main-panel { padding-top: 14px; }
}

@media (max-width: 560px) {
  .main-panel { padding-inline: 12px; padding-bottom: 86px; }
  .hero-card { padding: 22px; }
  .hero-card h3 { font-size: 2.45rem; }
  .bunny-hero { min-height: 180px; }
  .bunny-bounce { transform: scale(.8); animation-name: hopSmall; }
  @keyframes hopSmall { 0%,100% { transform: scale(.8) translateY(0); } 45% { transform: scale(.8) translateY(-13px); } }
  .metric-grid { grid-template-columns: 1fr; }
  .card-head, .section-head { flex-direction: column; }
  .job-card-list { grid-template-columns: 1fr; }
  .quick-copy-grid { grid-template-columns: 1fr; }
  .bar-row { grid-template-columns: 96px 1fr 28px; }
}
```

