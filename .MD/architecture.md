# QuranWBW — System Architecture Documentation

## Executive Overview

**QuranWBW** is a client-side Single Page Application (SPA) built using **SvelteKit 2** (with Svelte 4), **Vite**, **Tailwind CSS**, and **Dexie (IndexedDB)**. It follows a **Static CDN + Client-Side Assembly Architecture**:

1. **Zero Real-Time Backend Servers**: The application has no backend API server logic. All data (Arabic text, word-by-word translations, transliterations, morphology, metadata, fonts, audio timestamps) is pre-computed and stored as static JSON files on Cloudflare CDN servers.
2. **Client-Side Data Fetching & Caching**: Data is fetched on-demand by the client application, cached locally in **IndexedDB** using Dexie with a 7-day stale-while-revalidate policy.
3. **Reactive State Pipeline**: State is driven by over 60 Svelte `writable` stores in `src/utils/stores.js`, which are synchronized with `localStorage` on mutation.
4. **Service Worker Offline Cache**: An optional Service Worker handles full offline PWA execution by pre-caching static assets and routing data.

---

## High-Level Architecture Diagram

```text
+-----------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                    |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             SVELTEKIT SPA                                   |  |
|  |                                                                             |  |
|  |  +-------------------+   +----------------------+   +--------------------+  |  |
|  |  |   Svelte Views    |   |   Svelte Stores      |   |   Audio Engine     |  |  |
|  |  |  (Chapter, Mushaf,| <-> (60+ Writable        | <-> (HTML5 Audio       |  |  |
|  |  |   Juz, Search...) |   |  Stores - stores.js) |   |  Controller)       |  |  |
|  |  +-------------------+   +----------------------+   +--------------------+  |  |
|  |            ^                        ^                                       |  |
|  +------------|------------------------|---------------------------------------+  |
|               v                        v                                          |
|  +--------------------+   +------------------------+   +-----------------------+  |
|  |    localStorage    |   |     IndexedDB (Dexie)  |   |   Cache API (Service  |  |
|  |  (User Settings)   |   |   (5 Data Tables)      |   |   Worker Caches)      |  |
|  +--------------------+   +------------------------+   +-----------------------+  |
|                                        ^                                          |
+----------------------------------------|------------------------------------------+
                                         v
                         +-------------------------------+
                         |          CDN / REMOTE         |
                         |                               |
                         |  * static.quranwbw.com        |
                         |  * audios.quranwbw.com        |
                         |  * everyayah.com              |
                         |  * cdn.jsdelivr.net           |
                         |  * api.kalimat.dev            |
                         |  * api.alquran.cloud          |
                         +-------------------------------+
```

---

## Layer-by-Layer Architectural Break Down

### 1. Routing & Shell Layer (`src/routes/`)

SvelteKit handles client-side routing. SSR is explicitly disabled globally (`export const ssr = false` in `+layout.js`).

#### Route Tree

- `/` (`src/routes/+page.svelte`): Main dashboard featuring Surah/Juz/Hizb/Favorites tabs, Continue Reading trigger, Bookmarks/Notes widgets.
- `/[chapter]` (`src/routes/[chapter]/+page.svelte`): Dynamic Surah view. `+page.js` parses numeric IDs or textual slugs (e.g. `/2`, `/baqarah`, `/al-baqarah`) and verse ranges (`/2/255`, `/2:255`, `/2.255`, `/2-255`, `/2/285-286`).
- `/page` (`src/routes/page/+page.svelte`): Mushaf page-by-page reader (Pages 1 to 604) with swipe navigation.
- `/juz` & `/hizb`: Quranic division readers using `FullVersesDisplay.svelte`.
- `/search` (`src/routes/search/+page.svelte`): Hybrid search combining **Kalimat AI Semantic Search API** and **Quran Cloud Keyword Search API**.
- `/morphology` (`src/routes/morphology/+page.svelte`): Detailed word root, lemma, verb form, and occurrence explorer.
- `/offline` (`src/routes/offline/+page.svelte`): PWA offline data pack manager.
- `/duas`, `/supplications`, `/topics`, `/bookmarks`, `/faq`, `/about`, `/changelog`, `/games`.

### 2. State & Settings Layer (`src/utils/stores.js` & `updateSettings.js`)

State management relies entirely on Svelte `writable` stores.

#### Bootstrapping Pipeline

1. `src/hooks.client.js` executes before application render. It initializes `localStorage.userSettings` by merging default settings with any pre-existing user configurations.
2. `src/utils/stores.js` creates Svelte stores initialized from `localStorage` values.
3. Any UI component modifying settings calls `updateSettings({ type, value, ... })`.
4. `updateSettings.js` mutates the target field, writes the updated JSON string back to `localStorage`, and updates the corresponding Svelte store, triggering reactive UI re-renders.

### 3. Data Fetching & Storage Pipeline (`src/utils/fetchData.js` & `dexie.js`)

Data is fetched lazily and cached locally in IndexedDB using **Dexie v4**.

#### Dexie Database Schema (`quranwbw`)

- `word_data`: Primary key `key` (Stores chapter word data including Arabic, transliterations, and translations)
- `verse_translation_data`: Primary key `key` (Stores verse-level translations)
- `morphology_data`: Primary key `key` (Stores word summaries, roots, verbs)
- `tafsir_data`: Primary key `key` (Stores Tafsir texts per chapter)
- `other_data`: Primary key `key` (Stores metadata, tajweed rules, topics)

#### Stale-While-Revalidate Algorithm

```text
Client Request -> Check Dexie Table by Key
  |
  +--> Record Exists?
  |      |
  |      +--> YES: Serve cached record IMMEDIATELY.
  |      |         Check timestamp: Is record age > 7 days (604,800,000 ms)?
  |      |            +--> YES: Fetch fresh JSON from CDN asynchronously in background.
  |      |            |         Update Dexie record upon response.
  |      |            +--> NO: Return (no background fetch needed).
  |      |
  |      +--> NO: Fetch JSON from CDN synchronously.
  |                Store record in Dexie with current timestamp.
  |                Return fetched data.
```

#### Request Deduplication

To prevent duplicate network requests when rendering many components simultaneously, `fetchData.js` maintains an in-flight `Map` of pending `Promise` objects (`pendingFetches`). Duplicate requests for the same URL return the active promise.

---

## 4. Audio Engine Architecture (`src/utils/audioController.js`)

The audio engine is an event-driven HTML5 `Audio` controller capable of gapless verse playback, word-by-word synchronized highlighting, translation audio playback, and audio prefetching.

```text
+-----------------------------------------------------------------------------------+
|                                 AUDIO ENGINE                                      |
|                                                                                   |
|  +-------------------+       +-----------------------+     +-------------------+  |
|  | Verse Audio (MP3) |       | Word Audio (MP3)      |     | Translation Audio |  |
|  | EveryAyah CDN     |       | audios.quranwbw.com   |     | EveryAyah CDN     |  |
|  +-------------------+       +-----------------------+     +-------------------+  |
|            |                             |                           |            |
|            +-----------------------------+---------------------------+            |
|                                          v                                        |
|                          +-------------------------------+                        |
|                          |    Browser Cache API          |                        |
|                          |   (quranwbw-audio-cache)      |                        |
|                          +-------------------------------+                        |
|                                          v                                        |
|                          +-------------------------------+                        |
|                          |    HTML5 Audio Instance       |                        |
|                          +-------------------------------+                        |
|                                          |                                        |
|                                     timeupdate                                    |
|                                          v                                        |
|                          +-------------------------------+                        |
|                          | Synchronized Word Highlight   |                        |
|                          |  (__audioSettings.playingWord)|                        |
|                          +-------------------------------+                        |
+-----------------------------------------------------------------------------------+
```

### Key Audio Features

- **Single Audio Instance**: Reuses a single `HTMLAudioElement` globally to avoid memory leaks.
- **Audio Cache**: All fetched audio files are stored in the browser's Cache API (`quranwbw-audio-cache`).
- **Blob URLs**: Audio binary responses are converted to Blob URLs (`URL.createObjectURL`). Previous Blob URLs are revoked via `URL.revokeObjectURL()` to prevent memory accumulation.
- **Request ID Guards**: Increments `activeAudioRequestId` on every play/stop event to invalidate stale asynchronous audio load promises.
- **Word Highlight Sync**: Listens to `timeupdate` events on verse audio. Compares current `currentTime` against pre-computed word segment timestamps (`value.words.timestamp`) to update `__audioSettings.playingWordKey`.
- **Prefetching**: When verse `N` reaches 70% playback duration, the engine automatically prefetches audio for verse `N+1`.

---

## 5. Offline PWA & Service Worker (`src/service-worker.js`)

Offline mode is managed via a custom Service Worker using a modular caching strategy:

### Cache Containers

1. `quranwbw-cache-vX`: Static app shell (routes, JS bundles, static CSS, SVGs).
2. `quranwbw-chapter-data`: Pre-cached chapter routes (`/1` through `/114`).
3. `quranwbw-mushaf-data`: Pre-cached Mushaf page font files (Pages 1 to 604).
4. `quranwbw-audio-cache`: Cached recitations and word audios.

### Communication Protocol

The main thread and Service Worker communicate via `postMessage`:

- `START_CACHING`: Triggers pre-caching of essential app shell routes.
- `CACHE_URL`: Requests caching of a specific asset into a named cache container.
- `DELETE_CACHE`: Deletes a specified cache container.
- `CACHE_STARTED`, `CACHE_PROGRESS`, `CACHE_COMPLETE`: Custom events dispatched to the window for progress bars.
