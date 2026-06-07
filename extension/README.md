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
