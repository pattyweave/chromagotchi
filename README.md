# Chromagotchi

A Chrome extension virtual pet game inspired by Tamagotchi, with pixel-art interactions, stat management, and a Fortnite-style shop. Users care for a pet (feed, play, clean, sleep) affecting stats (health, energy, hunger, mood). Features backend syncing (MongoDB/Express), JWT auth, and a React PWA for the shop.

## Tech Stack

- **Extension**: Vanilla JS, HTML/CSS, Chrome APIs (storage, tabs).
- **Backend**: Node.js/Express, MongoDB Atlas, JWT.
- **PWA**: React, Axios, Stripe.
- **Assets**: Pixel-art sprites from itch.io (in /images).

## Folder Structure & File Responsibilities

The extension is modular for maintainability. Each JS file handles a specific concern; import them in popup.html or main.js.

### /images

- Spritesheets for pets, animations, UI icons (e.g., hearts for health, bolts for energy).
- **Responsibility**: Static assets for canvas.js and animation.js. Purchased/free from itch.io; plan to generate more via AI prompts (animals like cat, dog).

### /js

- **achievements.js**: Tracks user achievements (e.g., "Fed pet 100 times"); unlocks rewards.
- **animation.js**: Handles sprite animations (e.g., walk, eat) on the canvas; loops frames from spritesheets.
- **auth.js**: Manages login/signup modal (email/password), JWT storage/decoding (via jwt-decode.min.js), API auth calls.
    - **Code Direction**: Use fetch for /api/auth/login; store token in chrome.storage.local; decode for userId.
- **canvas.js**: Renders pet/UI on <canvas> element; draws stats as pixel icons, overlays cooldown timers.
- **db.js**: Local storage abstraction (wrappers for chrome.storage.sync/local or IndexedDB); persists pet state offline.
    - **Code Direction**: Async get/set functions; fallback for errors.
- **main.js**: Entry point; initializes app, loads state, sets up event listeners.
- **onboarding.js**: Guides new users (e.g., create first pet, tutorial modals).
- **pet.js**: Core pet logic—interactions (feed/play/clean/sleep), stat updates, cooldowns.
    - **Code Direction**: Update stats (0-100%); apply decay timers; prevent spamming via cooldowns.
- **shop.js**: Extension-side shop teaser (e.g., "Open Shop" button to launch PWA); local purchase simulation if needed.
    - **Code Direction**: Integrate with inventory; trigger PWA tab open via chrome.tabs.create.
- **state.js**: Manages persistent pet object (stats, inventory, currency); handles stat decay over time.
    - **Code Direction**: Use intervals for decay; merge with backend data.
- **sync.js**: Backend communication—poll/fetch/update pet state, inventory, balance via API.
    - **Code Direction**: Periodic polling (e.g., every 5min); use JWT headers; handle offline queuing.
- **utils.js**: Helper functions (e.g., timers, randomizers, UI utils).

### /libs

- **html2canvas.min.js**: For capturing screenshots (e.g., share pet image).
- **jwt-decode.min.js**: Decodes JWT tokens for user data without verification.

### Root Files

- **background.js**: Background script for persistent logic (e.g., alarms for stat decay when popup closed).
- **manifest.json**: Chrome extension config (permissions, icons, popup).
- **package.json**: NPM dependencies (if bundled; keep light—no Webpack).
- **popup.css**: Styles for popup UI (pixel-art theme, responsive).
- **popup.html**: Main popup markup (canvas, buttons, stats, login modal).

## Getting Started

1. Load extension in Chrome (Developer mode > Load unpacked).
2. Backend: Run Node server; connect to MongoDB Atlas.
3. PWA: Deploy React app; link shop URL in shop.js.
4. Test: Create account, interact with pet, sync changes.

## In Progress / Todos

- Finish inventory syncing on login (auth.js + sync.js).
- Merge backend pet state with local (state.js + sync.js).
- Add equipping for cosmetics (pet.js + shop.js).
- Implement real-time updates (WebSockets in sync.js).
- Generate AI pixel assets for animals (prompts in assets.md).

## AI Context (for Claude/Grok)

- **Project Goal**: Modern Tamagotchi in Chrome; sync pet/inventory across extension/PWA/backend.
- **Code Style**: Vanilla JS, async/await for APIs, modular exports/imports.
- **Key Challenges**: Offline syncing, state conflicts, lightweight bundle.
- When prompting: Reference this README + specific files; e.g., "Refactor sync.js for inventory merging based on timestamps."

## Contributing

Fork repo, add features (e.g., new pet types), PR with changes.
