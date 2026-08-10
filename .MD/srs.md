# QuranWBW — Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This document details the functional and non-functional requirements for **QuranWBW.com**, a client-side web application designed to facilitate Quranic study through word-by-word translations, transliterations, morphological analysis, recitation audio, and exegesis (tafsir).

### 1.2 Scope

QuranWBW is a progressive web application (PWA) serving all 114 Surahs (chapters), 6,236 Ayat (verses), and 77,430+ individual words of the Holy Quran. It provides multi-lingual translations, multi-reciter audio playback, Tajweed color coding, and customizable visual themes without relying on a custom backend server infrastructure.

---

## 2. Functional Requirements

### 2.1 Reading & Display Modes (FR-DISPLAY)

- **FR-DISPLAY-01 (Layout Modes)**: The system shall support 7 distinct display modes:
  1. *Word By Word (WBW)*: Grid layout displaying Arabic text, transliteration, and translation per word.
  2. *Normal*: Clean Arabic text only.
  3. *Continuous WBW*: Inline flow of word-by-word blocks across lines.
  4. *Continuous Normal*: Paragraph-style continuous Arabic script flow.
  5. *Side By Side*: Dual-column format with Arabic script on the right and translation on the left.
  6. *Mushaf Mode*: Full-page layout matching the traditional 604-page Madinah Mushaf.
  7. *Translation / Transliteration*: Focus view prioritizing translation text with secondary Arabic reference.
- **FR-DISPLAY-02 (Font Selection)**: The system shall support 10 selectable Arabic font styles:
  1. Uthmani Digital Font
  2. Uthmani Mushaf Font (Page-based COLRv1/OT-SVG)
  3. Uthmani Mushaf Tajweed Font (Color-coded COLRv1/OT-SVG)
  4. Qalam Digital Font (Madinah Edition / IndoPak)
  5. Uthman Taha Digital (Nastaleeq)
  6. Qalam Digital Font (Hanafi Edition)
  7. Uthmani Digital Bold
  8. Uthman Taha Digital Bold (Nastaleeq)
  9. Indonesian Isep Misbah Digital Font
  10. Majidi Nastaleeq Digital Font
- **FR-DISPLAY-03 (Tajweed Color Coding)**: When Tajweed mode is enabled, the system shall render text using font color palettes mapping 41 Tajweed rules across 32 color IDs (silent letters, lengthening, ghunnah, qalqalah, etc.).
- **FR-DISPLAY-04 (Distraction-Free Minimal Mode)**: In Mushaf mode, users shall be able to toggle "Minimal Mode", which hides the top navbar and bottom toolbar.

### 2.2 Audio Engine & Recitation (FR-AUDIO)

- **FR-AUDIO-01 (Verse Recitation)**: The system shall stream verse audio from 22 selectable Qaris/reciters via EveryAyah.com.
- **FR-AUDIO-02 (Word Audio)**: The system shall play individual word pronunciations when any word is clicked.
- **FR-AUDIO-03 (Word Highlighting)**: During verse audio playback, the system shall synchronously highlight the currently playing word using timestamp data.
- **FR-AUDIO-04 (Translation Recitation)**: The system shall support playing translation audio in English (Ibrahim Walk) and Urdu (Dr. Farhat Hashmi & Shamshad Ali Khan).
- **FR-AUDIO-05 (Playback Controls)**: The system shall allow configuring playback speed (0.5x to 2.0x), verse delay (0s to 15s or audio length), and verse repeat intervals (1 to 50 times).
- **FR-AUDIO-06 (Audio Caching)**: All audio files shall be cached in the browser's Cache API (`quranwbw-audio-cache`) for offline access.

### 2.3 Morphology & Grammar Engine (FR-MORPH)

- **FR-MORPH-01 (Word Summary)**: The system shall display word-level grammar summaries, including root letters, lemma, POS (Part of Speech) tags, and verb forms.
- **FR-MORPH-02 (Root Words Explorer)**: The system shall allow users to click a word's root to view all occurrences of that root across the Quran.
- **FR-MORPH-03 (Verb Form Analysis)**: The system shall break down verb forms (Form I through Form X) and display exact matching words across the Quran.

### 2.4 Navigation & Search (FR-NAV)

- **FR-NAV-01 (URL Route Parsing)**: The system shall parse flexible URL structures, supporting Surah numbers (`/2`), Surah names (`/baqarah`, `/al-baqarah`), verse numbers (`/2/255`), verse ranges (`/2/285-286`), colon notation (`/2:255`), dot notation (`/2.255`), dash notation (`/2-255`), and query params (`?startVerse=255`).
- **FR-NAV-02 (Division Browsing)**: The system shall support browsing by Surah (1-114), Juz (1-30), Hizb (1-60), and Mushaf Page (1-604).
- **FR-NAV-03 (Hybrid Search)**: The search engine shall combine results from:
  1. *Kalimat AI API*: Natural language semantic search across topics and concepts.
  2. *Quran Cloud API*: Exact keyword search in English translations.

### 2.5 Personalization & User Data (FR-USER)

- **FR-USER-01 (Bookmarks)**: Users shall be able to bookmark individual verses. Bookmarks are saved to `localStorage` and viewable on the homepage dashboard.
- **FR-USER-02 (Notes)**: Users shall be able to attach personal text notes to specific verses.
- **FR-USER-03 (Last Read Tracker)**: The system shall automatically save the user's reading position (Surah, Verse, Juz, Page) to `localStorage`.
- **FR-USER-04 (Settings Import/Export)**: The system shall allow users to export all settings, bookmarks, and notes to a `.qwbw` file (Base64-encoded reversed JSON) and import them on another device.
- **FR-USER-05 (Favorite Surahs)**: Users shall be able to mark Surahs as favorites and sort them on the homepage.

### 2.6 Offline Functionality (FR-OFFLINE)

- **FR-OFFLINE-01 (Selective Data Downloading)**: The `/offline` page shall allow users to download individual offline data packs:
  1. Chapter Data (~20 MB)
  2. Mushaf Font & Page Data (~60 MB)
  3. Morphology Data (~90 MB)
  4. Tafsir Data (~90 MB)
- **FR-OFFLINE-02 (Service Worker Interception)**: When offline data is installed, the Service Worker shall intercept all network requests and serve responses from IndexedDB/Cache API.

---

## 3. Non-Functional Requirements

### 3.1 Performance (NFR-PERF)

- **NFR-PERF-01 (Page Load Speed)**: First Contentful Paint (FCP) must occur under 1.2 seconds on standard 4G connections.
- **NFR-PERF-02 (Zero Layout Shift)**: Page fonts shall use CSS font-display policies and pre-allocated container heights to avoid Cumulative Layout Shift (CLS < 0.05).
- **NFR-PERF-03 (Memory Safety)**: Audio Blob URLs must be revoked immediately when changing audio tracks to prevent memory leaks during extended listening sessions.

### 3.2 Compatibility & Platform Support (NFR-COMPAT)

- **NFR-COMPAT-01 (Cross-Browser)**: Full support for Chrome, Safari, Firefox, Edge, iOS Safari, and Android Chrome.
- **NFR-COMPAT-02 (Browser Workarounds)**:
  - *iOS/macOS COLRv1 Bug*: Fallback to OT-SVG fonts (`OT-SVG-LIGHT`) on iOS/macOS for specific light themes.
  - *Firefox Dark Mode Bug*: Fallback to single-palette dark fonts (`COLRv1-Dark-FF`) for Firefox dark mode.
- **NFR-COMPAT-03 (Responsive Breakpoints)**: Tailwind breakpoints `sm: 640px`, `md: 768px`, `lg: 1024px`. Full support for mobile, tablet, and desktop viewports.

### 3.3 Security & Privacy (NFR-SEC)

- **NFR-SEC-01 (Client-Only Storage)**: User bookmarks, notes, and reading history must remain strictly on the user's device (`localStorage`). No user data is transmitted to remote servers.
- **NFR-SEC-02 (HTTPS & CDN Integrity)**: All external resources (fonts, JSON data, audio) must be fetched exclusively over secure HTTPS channels.
