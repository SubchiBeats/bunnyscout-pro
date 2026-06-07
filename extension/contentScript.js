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
