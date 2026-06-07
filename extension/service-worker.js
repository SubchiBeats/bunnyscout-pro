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
