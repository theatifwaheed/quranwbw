# QuranWBW — Complete Project Context

## What Is QuranWBW?

**QuranWBW.com** is a full-featured Quran reading, learning, and listening web application. Its primary differentiator is **word-by-word** (WBW) translations, transliterations, and morphological analysis — meaning every single Arabic word in the Quran is individually mapped to its translation, transliteration, and grammatical breakdown.

**It is NOT solely an offline application.** It is primarily an **online web application** that requires internet connectivity by default, and offers **optional** offline capability through a service worker that users can manually enable from the `/offline` page.

---

## How Does It Work? (Online vs Offline)

### Default Mode: Online (Requires Internet)

- All Quran text data (Arabic words, translations, transliterations, morphology) is fetched **on-demand** from a private CDN at `https://static.quranwbw.com/data/v4`
- Audio recitations are streamed from `https://everyayah.com` (verse-level) and `https://audios.quranwbw.com` (word-level)
- Tafsir content is loaded from `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api` and `https://static.quranwbw.com/data/v4/tafsirs`
- Search uses `https://api.kalimat.dev` (semantic AI search) and `https://api.alquran.cloud` (keyword search)
- Font files are downloaded per-page from the CDN for Mushaf display modes

### Optional: Offline Mode (Opt-in)

Users can visit `/offline` to download specific data packs for offline use:

| Pack | Size | Contents |
| --- | --- | --- |
| **Chapter Data** | ~20 MB | All 114 chapters of Quran text + translations |
| **Mushaf Data** | ~60 MB | All 604 page fonts + text for Mushaf view |
| **Morphology Data** | ~90 MB | Word roots, verb forms, related words |
| **Tafsir Data** | ~90 MB | Selected tafsir commentary for all chapters |

The offline mode works by:

1. Registering a service worker (`/service-worker.js`)
2. Caching core site files (routes, fonts, static assets)
3. Caching data files to IndexedDB (Dexie) and Cache API
4. Switching to cache-first strategy when offline data is available

---

## Where Is the Quran Audio Coming From?

### Verse-Level Audio (Full Verse Recitation)

**Source:** `https://everyayah.com`

Audio URL pattern: `{reciter_url}/{chapter_padded}{verse_padded}.mp3`

- Example: `https://everyayah.com/data/Alafasy_128kbps/002255.mp3` plays Surah 2, Verse 255 by Mishary Alafasy

**22 Reciters Available:**

| ID | Reciter | Bitrate | Special |
| --- | --- | --- | --- |
| 1 | Abdul Basit (Mujawwad) | 128kbps | WBW timestamps |
| 2 | Abdul Basit (Murattal) | 192kbps | WBW timestamps |
| 3 | Abdul-Rahman Al-Sudais | 192kbps | None |
| 4 | Abu Bakr Ash-Shaatree | 128kbps | None |
| 5 | Ayman Suwayd | 64kbps | None |
| 6 | Hani Ar-Rifai | 192kbps | WBW timestamps |
| 7 | Maher Al-Muaiqly | 128kbps | None |
| 8 | Mahmoud Khalil Al-Husary | 128kbps | WBW timestamps |
| 9 | Mahmoud Khalil Al-Husary (Muallim) | 128kbps | Gaps between words |
| 10 | Mishary Rashid Alafasy | 128kbps | WBW timestamps |
| 11 | Mohamed El-Minshawi (Mujawwad) | 192kbps | None |
| 12 | Mohamed El-Minshawi (Teacher) | 128kbps | None |
| 13 | Muhammad Ayyub | 128kbps | None |
| 14 | Nasser Al Qatami | 128kbps | None |
| 15 | Saood Ash-Shuraym | 128kbps | WBW timestamps |
| 16 | Yasser Ad-Dossari | 128kbps | None |
| 17 | Ibrahim Al Akhdar | 32kbps | None |
| 18 | Khalifah Al Tunaiji | 64kbps | None |
| 19 | Abdullah Matroud | 128kbps | None |
| 20 | Ali Jaber | 64kbps | None |
| 21 | Nabil Ar Rifay | 48kbps | None |
| 22 | Bandar Baleelah | 128kbps | GitHub-hosted |

### Word-Level Audio (Individual Word Pronunciation)

**Source:** `https://audios.quranwbw.com/words/{chapter}/{verse}/{word}.mp3`

Used when clicking on individual words to hear their pronunciation.

### Translation Audio

**Source:** `https://everyayah.com` (3 translation reciters)

- English - Ibrahim Walk (Sahih International)
- Urdu - Dr. Farhat Hashmi (WBW)
- Urdu - Shamshad Ali Khan

### Audio Caching

All played audio files are cached in the browser's **Cache API** under `quranwbw-audio-cache`. Once a verse or word audio is played, subsequent plays are instant from cache.

---

## Static Data & CDN Endpoints

All data originates from `src/data/websiteSettings.js`:

### Primary CDN

**Base URL:** `https://static.quranwbw.com/data/v4`

| Resource | URL Pattern |
| --- | --- |
| Chapter word data | `{base}/chapters/{fontType}/{wordTranslation}/{wordTransliteration}/{chapter}.json` |
| Verse translations | `{base}/translations/{translationId}/{chapter}.json` |
| Full Quran (Uthmani) | `{base}/full-quran/uthmani.json` |
| Verse key data | `{base}/meta/verseKeyData.json` |
| Tajweed rules | `{base}/tajweed/tajweed-rules.json` |
| Quran topics | `{base}/others/quran-topics.json` |
| Morphology summaries | `{base}/lexicon/word-summaries/{chapter}.json` |
| Morphology verbs | `{base}/morphology-data/word-verbs.json` |
| Root words keys | `{base}/morphology-data/words-with-same-root-keys.json` |
| Uthmani & roots | `{base}/morphology-data/word-uthmani-and-roots.json` |
| Exact word keys | `{base}/morphology-data/exact-words-keys.json` |
| Mushaf page fonts | `{base}/fonts/Hafs/KFGQPC-v4/{variant}/QCF4{page}_COLOR-Regular.woff2` |
| Bismillah fonts | `{base}/fonts/Extras/bismillah/{file}.woff2` |
| Chapter header font | `{base}/fonts/Extras/chapter-headers/NeoHeader_COLOR-Regular.woff2` |

### Tafsir Sources

| Endpoint | Content |
| --- | --- |
| `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir` | Most tafsirs (24 editions) |
| `https://static.quranwbw.com/data/v4/tafsirs` | Tafheem Ul Quran (Urdu) |

### Search APIs

| API | Purpose |
| --- | --- |
| `https://api.kalimat.dev/api/v2/search` | AI semantic search (API key required) |
| `https://api.alquran.cloud/v1/search` | Keyword search in English translations |

### Audio CDNs

| CDN | Purpose |
| --- | --- |
| `https://everyayah.com/data/` | All verse recitations |
| `https://audios.quranwbw.com/words/` | Individual word pronunciations |
| `https://marwan.github.io/` | Bandar Baleelah recitation |

---

## Client-Side Data Storage

### localStorage

Stores all user preferences as a single `userSettings` JSON object including:

- Display settings (font type, display mode, theme, font sizes)
- Audio settings (reciter, playback speed, repeat mode)
- Translation selections (word translation language, verse translations)
- User data (bookmarks array, notes object, last read position, favorites)
- Homepage layout preferences
- Offline mode settings

### IndexedDB (via Dexie)

Five tables used for data caching:

| Table | Contents | Cache Duration |
| --- | --- | --- |
| `word_data` | Chapter word data (Arabic + translations) | 7 days |
| `verse_translation_data` | Verse-level translations | 7 days |
| `morphology_data` | Word morphology data | 7 days |
| `tafsir_data` | Tafsir commentary text | 7 days |
| `other_data` | Static data (topics, Uthmani text, etc.) | 7 days |

### Cache API (Browser)

| Cache Name | Contents |
| --- | --- |
| `quranwbw-cache-{version}` | Core site files (HTML, JS, CSS, fonts) |
| `quranwbw-chapter-data` | Offline chapter routes |
| `quranwbw-mushaf-data` | Offline Mushaf fonts |
| `quranwbw-audio-cache` | Played audio files |

---

## Static Files in the Repository

### Fonts (`static/fonts/`)

14 font files bundled with the app:

- `qcf-uthmanic-digital.woff2` — Uthmani Hafs
- `qcf-uthmanic-digital-Bold.woff2` — Uthmani Hafs Bold
- `AlQuranNeo5x2.woff2` — IndoPak font
- `Nastaleeq_COLOR-Regular.woff2` — Nastaleeq Hafs
- `NastaleeqB_COLOR-Regular.woff2` — Nastaleeq Bold
- `LPMQIsepMisbah-Regular.woff2` — Indonesian Misbah
- `Majidi5_QWBW-Bold.woff2` — Majidi Nastaleeq
- `LPMQ-MSI-ISYARAT.woff2` — Arabic Sign Language
- `surahs_v4-Regular.woff2` — Chapter icon glyphs
- `juz_names-Regular.woff2` — Juz name icon glyphs
- `QCF4_TajweedRules-Regular.woff2` — Tajweed rules font
- `Mehr-Nastaliq.ttf` — Urdu font
- `MBLateefi.otf` — Sindhi font
- `NotoSerif-Regular.woff2` — Serif fallback

### Images (`static/images/`)

- PWA icons (192px, 512px, maskable)
- Homepage background image
- Reciter profile photos (22 images)
- Screenshots for PWA install prompt (mobile + desktop)

### Other Static Files

- `manifest.json` — PWA manifest (fullscreen display, categories: books/education)
- `events.js` — Umami analytics tracking script
- `sitemap.xml` + 5 sub-sitemaps — SEO sitemaps for all routes
- `robots.txt` — Search engine crawling rules
- `_routes.json` — Cloudflare Pages routing config
