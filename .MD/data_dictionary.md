# QuranWBW — Data Dictionary & Schema Documentation

## 1. Local Storage Schema (`userSettings`)

All user preferences are stored as a JSON string under the `userSettings` key in `localStorage`.

### Schema Map

```json
{
  "displaySettings": {
    "fontType": 1,
    "displayType": 1,
    "websiteTheme": 1,
    "wordTransliterationEnabled": true,
    "wordTranslationEnabled": true,
    "wordTooltip": 1,
    "wordMorphologyOnClick": true,
    "mushafMinimalModeEnabled": false,
    "wideWesbiteLayoutEnabled": false,
    "englishTerminology": true,
    "fontSizes": {
      "arabicText": "text-3xl",
      "wordTranslationText": "text-xs",
      "verseTranslationText": "text-sm"
    }
  },
  "audioSettings": {
    "reciter": 10,
    "translationReciter": 1,
    "playbackSpeed": 4,
    "audioDelay": 1,
    "playArabicAndTranslation": false,
    "repeatVerse": 1,
    "repeatRange": 1,
    "versePlayButtonOption": 1
  },
  "translations": {
    "word": 1,
    "wordTransliteration": 1,
    "verse": [1, 2],
    "tafsir": 30
  },
  "userBookmarks": [
    "1:1",
    "2:255"
  ],
  "userNotes": {
    "2:255": "Ayat al-Kursi reflection note text..."
  },
  "userFavoriteChapters": [
    1, 18, 36, 55, 56, 67
  ],
  "lastRead": {
    "chapter": 2,
    "verse": 255,
    "page": 42,
    "juz": 3,
    "hizb": 6
  },
  "homepageLayoutPreferences": {
    "divisionsActiveTab": 1,
    "extrasActiveTab": 1,
    "chaptersSortIsAscending": true,
    "juzSortIsAscending": true,
    "hizbSortIsAscending": true,
    "favoritesSortIsAscending": true
  },
  "offlineModeSettings": {
    "serviceWorker": { "downloaded": true, "downloadedAt": "2026-08-10T12:00:00.000Z" },
    "chapterData": { "downloaded": true, "downloadedAt": "2026-08-10T12:00:00.000Z" },
    "mushafData": { "downloaded": false, "downloadedAt": null },
    "morphologyData": { "downloaded": false, "downloadedAt": null },
    "tafsirData": { "downloaded": false, "downloadedAt": null },
    "downloadedDataSettings": {
      "fontTypes": [1],
      "wordTranslations": [1],
      "wordTransliterations": [1],
      "verseTranslations": [1, 2],
      "tafsirs": [30]
    }
  }
}
```

---

## 2. IndexedDB Tables Schema (Dexie `quranwbw` DB)

### `word_data` Table

- **Primary Key**: `key` (Format: `{chapter}:{fontType}:{wordTranslation}:{wordTransliteration}`)
- **Value Schema**:

```json
{
  "key": "1:1:1:1",
  "timestamp": 1770768000000,
  "data": {
    "1:1": {
      "meta": {
        "words": 4,
        "page": 1,
        "juz": 1,
        "hizb": 1
      },
      "words": {
        "arabic": ["بِسْمِ", "اللَّهِ", "الرَّحْمَٰنِ", "الرَّحِيمِ"],
        "transliteration": ["Bismi", "Allahi", "Ar-Rahmani", "Ar-Rahim"],
        "translation": ["In (the) name", "(of) Allah", "the Most Gracious", "the Most Merciful"],
        "line": [1, 1, 1, 1],
        "end": "ﭑ",
        "timestamp": [0, 500, 1200, 2000]
      }
    }
  }
}
```

### `verse_translation_data` Table

- **Primary Key**: `key` (Format: `{chapter}:{translationId1_translationId2...}`)
- **Value Schema**:

```json
{
  "key": "1:1_2",
  "timestamp": 1770768000000,
  "data": {
    "1:1": {
      "1": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      "2": "Allah ke naam se jo behad meherbaan aur nihayat rahem wala hai."
    }
  }
}
```

### `morphology_data` Table

- **Primary Key**: `key` (Format: URL string or chapter number)
- **Value Schema** (Word Summary):

```json
{
  "key": "1",
  "timestamp": 1770768000000,
  "data": {
    "1:1:1": {
      "word": "بِسْمِ",
      "root": "س م و",
      "lemma": "اسْم",
      "pos": "P+N",
      "grammar": "Prefixed preposition bi + noun in genitive case"
    }
  }
}
```

### `tafsir_data` Table

- **Primary Key**: `key` (Format: `{tafsirSlug}:{chapter}`)
- **Value Schema**:

```json
{
  "key": "en-tafisr-ibn-kathir:1",
  "timestamp": 1770768000000,
  "data": {
    "1": "Tafsir text for Surah Al-Fatiha Verse 1...",
    "2": "Tafsir text for Surah Al-Fatiha Verse 2..."
  }
}
```

---

## 3. Quran Metadata Schema (`src/data/quranMeta.js`)

### `quranMetaData` Array Entry

```json
{
  "id": 1,
  "arabic": "الفاتحة",
  "translation": "The Opening",
  "transliteration": "Al Faatiha",
  "verses": 7,
  "revelation": 1,
  "icon": "04",
  "alternateNames": ["fatihah", "fatiha"]
}
```

### `juzMeta` Array Entry

```json
{
  "juz": 1,
  "from": "1:1",
  "to": "2:141",
  "name": "Alif Lam Meem",
  "icon": ""
}
```

### `hizbMeta` Array Entry

```json
{
  "hizb": 1,
  "from": "1:1",
  "to": "2:74"
}
```
