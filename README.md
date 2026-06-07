<div align="center">

<img src="favicon.svg" width="104" alt="BunnyScout logo" />

# BunnyScout Pro

**A local-first job-search command center — plus a Chrome/Edge clipper & safe-autofill extension.**

Track applications, analyze job descriptions, generate AI tailoring prompts, plan salaries, and stay on top of follow-ups — without sending a single byte of your data to a server.

[**▶ Live app**](https://subchibeats.github.io/bunnyscout-pro/) · [Extension](#-browser-extension) · [Roadmap](https://github.com/SubchiBeats/bunnyscout-pro/issues)

![Static site](https://img.shields.io/badge/stack-vanilla%20JS-8d5cf6) ![Manifest V3](https://img.shields.io/badge/extension-Manifest%20V3-58d7b4) ![No backend](https://img.shields.io/badge/data-100%25%20local-ff7aa8) ![License: MIT](https://img.shields.io/badge/license-MIT-20152e)

</div>

---

## ✨ What it does

BunnyScout turns a chaotic job hunt into an organized, private workflow.

| Area | Highlights |
| --- | --- |
| **Dashboard** | Pipeline breakdown, response-rate metrics, and an action queue for follow-ups and likely ghosts. |
| **Job Tracker** | Card view with live status, match score, salary, excitement, search, sort, and one-click copy chips. |
| **Add / Analyze** | Paste a job description → auto-extracts title, company, location, salary, keywords, and a fit score. |
| **Resume Prompt Lab** | Generates resume / cover-letter / ATS-gap / interview-prep / LinkedIn prompts for ChatGPT or Claude — with truthfulness guardrails. |
| **Earnings Planner** | Role-family salary bands adjusted by experience, market, and industry multipliers. |
| **Profile + Vault** | Reusable answers, skills, links, and a resume/cover-letter vault stored locally in IndexedDB. |
| **Recruiter Map** | Starter directory of staffing agencies with copy-ready outreach pitches. |
| **Backup + Settings** | Plain or **AES-GCM password-encrypted** JSON backups, import/restore, and a one-click data wipe. |

### Polish
- 🌙 **Dark mode** with a header toggle that remembers your choice and honors your system preference.
- 📱 **Fully responsive** with a mobile drawer nav.
- ♿ **Accessibility-minded** — semantic landmarks, ARIA live regions, and `prefers-reduced-motion` support.
- ⚡ **Installable PWA** with offline caching via a service worker.
- 🔒 **Private by default** — no analytics, no trackers, no third-party requests.

## 🔐 Privacy & security model

- **No backend, no APIs, no remote code.** Everything runs in your browser.
- Web-app data lives in `localStorage` (records) and `IndexedDB` (files).
- Extension data lives in `chrome.storage.local`.
- Backups are user-triggered exports; encrypted backups use PBKDF2 (210k iterations) + AES-GCM.
- The deployed app ships strict security headers and a tight Content-Security-Policy (`netlify.toml`).

## 🚀 Run it

### Use the hosted version
Just open **[subchibeats.github.io/bunnyscout-pro](https://subchibeats.github.io/bunnyscout-pro/)** — no install required.

### Run locally
```powershell
# From the project folder (the one containing index.html):
py -m http.server 8080
# then open http://localhost:8080
```
Any static server works. Opening `index.html` directly works too, but service-worker / PWA features need `http://localhost` or a real host.

### Deploy your own
- **GitHub Pages** — Settings → Pages → deploy from the default branch root. (This repo is already configured this way.)
- **Netlify** — drag the folder into a manual deploy; the included `netlify.toml` sets headers and the SPA fallback.

## 🧩 Browser extension

A Manifest V3 extension (`extension/`) that clips job postings from the active tab and offers **assisted, preview-first autofill**.

**Install (Chrome or Edge):**
1. Go to `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/` folder.
4. Open a job posting → click BunnyScout → **Clip this job**, or open the dashboard to set up autofill.

**Safety guarantees — the extension never:**
- submits applications for you,
- bypasses CAPTCHAs, logins, or anti-bot protections,
- uploads files automatically, or
- fills sensitive fields: **passwords, SSN/tax IDs, banking, date of birth, EEO/demographic, veteran/disability**, or file uploads.

Autofill is **preview-first** — review the fields it found before anything is written, and review every page before you submit. See [`extension/README.md`](extension/README.md).

## 🗂️ Project structure

```
bunnyscout-pro/
├── index.html            # Web app shell
├── styles.css            # Theme tokens + light/dark themes
├── app.js                # All app logic (state, analysis, prompts, vault, backups)
├── favicon.svg           # Bunny mark
├── manifest.json         # PWA manifest
├── service-worker.js     # Offline caching
├── 404.html              # Themed not-found page
├── netlify.toml          # Security headers + SPA fallback
└── extension/            # Chrome/Edge Manifest V3 extension
    ├── manifest.json
    ├── popup.html/css/js
    ├── dashboard.html/css/js
    ├── contentScript.js  # Clip + safe autofill (sensitive-field blocklist)
    ├── service-worker.js
    └── icons/
```

## 🛠️ Tech

Vanilla **HTML / CSS / JavaScript** — zero dependencies, no build step. Web Crypto for encrypted backups, IndexedDB for the file vault, and a service worker for offline use.

## 🗺️ Roadmap

Tracked in [GitHub Issues](https://github.com/SubchiBeats/bunnyscout-pro/issues): job-board parser improvements, import/export UX, accessibility, automated testing, resume-vault upgrades, and optional future API/backend integrations. Contributions and ideas welcome.

## 📄 License

[MIT](LICENSE) © Sahib Singh
