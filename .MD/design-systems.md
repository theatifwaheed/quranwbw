# QuranWBW — Design System Documentation

## Overview

The design system of **QuranWBW** is built around flexibility, accessibility, high contrast readability for sacred text, and seamless multi-device responsiveness. It leverages **Tailwind CSS 3.4**, **CSS Custom Properties (Variables)** for theme switching, custom `@font-face` bindings, and font color palettes (`@font-palette-values`) for COLRv1/OT-SVG font rendering.

---

## 1. Color Palette & Theming Engine

The application features **9 pre-configured visual themes** (4 Light, 5 Dark).

### Theme Tokens & Dynamic Styling

Themes are dynamically applied to the `<html>` root node (e.g. `<html class="theme-5">`).
CSS variables define 3 primary RGB channels and 4 palette tokens per theme in `src/app.html`:

```css
:root {
  --theme-bg-rgb: 255, 255, 255;
  --theme-accent-rgb: 17, 24, 39;
  --theme-text-rgb: 0, 0, 0;
  --theme-palette-normal: --palette0;
  --theme-palette-tajweed: --palette1;
}
```

### Theme Catalog

| ID | Name | Theme Type | Background Color (`--theme-bg`) | Accent Color (`--theme-accent`) | Text Color (`--theme-text`) |
| --- | --- | --- | --- | --- | --- |
| **1** | Golden Glint | Light | Light Sand (`#FBF9F4`) | Warm Amber (`#B1901F`) | Charcoal (`#1F2937`) |
| **2** | Classic Light | Light | Pure White (`#FFFFFF`) | Emerald Green (`#059669`) | Charcoal (`#111827`) |
| **3** | Silver Lining | Light | Soft Gray (`#F3F4F6`) | Slate Blue (`#475569`) | Dark Gray (`#1E293B`) |
| **4** | Vintage Sepia | Light | Warm Cream (`#FDF6E3`) | Bronze (`#B58900`) | Dark Sepia (`#433422`) |
| **5** | Mocha Night | Dark | Espresso (`#120F0D`) | Warm Gold (`#C59F60`) | Off-White (`#E5E7EB`) |
| **6** | Midnight Blue | Dark | Deep Navy (`#0F172A`) | Sky Accent (`#38BDF8`) | Cool Gray (`#F1F5F9`) |
| **7** | Forest Green | Dark | Deep Forest (`#061A14`) | Jade Green (`#34D399`) | Mint White (`#ECFDF5`) |
| **8** | OLED Black | Dark | Pure Black (`#000000`) | High Contrast Gold (`#EAB308`) | Bright White (`#FFFFFF`) |
| **9** | Dark Luxury | Dark | Charcoal Obsidian (`#18181B`) | Rose Gold/Bronze (`#D97706`) | Light Gray (`#F4F4F5`) |

---

## 2. Typography System

The application relies heavily on dynamic font loading and browser font rendering engines due to complex Arabic calligraphy requirements (Uthmani vs. IndoPak vs. Nastaleeq vs. COLRv1 Tajweed).

### Font Families

| Font Key | Family Name | Type | Source / Format | Usage |
| --- | --- | --- | --- | --- |
| `arabic-font-1` | Uthmani-Hafs | Arabic | `qcf-uthmanic-digital.woff2` | Standard Uthmani Quranic script |
| `arabic-font-2` | Uthmani-Hafs | Arabic (Mushaf) | CDN COLRv1 / OT-SVG per-page fonts | Page-by-page Uthmani Mushaf |
| `arabic-font-3` | Uthmani-Hafs | Arabic (Tajweed) | CDN COLRv1 / OT-SVG Tajweed fonts | Color-coded Tajweed pronunciation |
| `arabic-font-4` | IndoPak | Arabic | `AlQuranNeo5x2.woff2` | South Asian / Subcontinent Madinah style |
| `arabic-font-5` | Nastaleeq-Hafs | Arabic | `Nastaleeq_COLOR-Regular.woff2` | Nastaleeq calligraphic script |
| `arabic-font-6` | IndoPak | Arabic (Hanafi) | `AlQuranNeo5x2.woff2` | Hanafi variation |
| `arabic-font-7` | Uthmani-Hafs-Bold | Arabic | `qcf-uthmanic-digital-Bold.woff2` | Bold Uthmani |
| `arabic-font-8` | Nastaleeq-Hafs-Bold | Arabic | `NastaleeqB_COLOR-Regular.woff2` | Bold Nastaleeq |
| `arabic-font-9` | Indonesian-Misbah | Arabic | `LPMQIsepMisbah-Regular.woff2` | Indonesian standard Mushaf script |
| `arabic-font-10` | Majidi-Nastaleeq | Arabic | `Majidi5_QWBW-Bold.woff2` | Majidi Nastaleeq calligraphic script |
| `font-Arabic-Sign-Language` | Arabic Sign Language | Sign Language | `LPMQ-MSI-ISYARAT.woff2` | Visual sign language font |
| `chapter-icons` | chapter-icons | Icon Glyphs | `surahs_v4-Regular.woff2` | Decorative Surah headers |
| `juz-icons` | juz-icons | Icon Glyphs | `juz_names-Regular.woff2` | Decorative Juz header icons |
| `font-Urdu` | urdu | Urdu | `Mehr-Nastaliq.ttf` | Urdu translation/tafsir text |
| `font-Sindhi` | sindhi | Sindhi | `MBLateefi.otf` | Sindhi translation text |

### Font Size Scale (`selectableFontSizes`)

Font sizes are configurable per element type (Arabic text vs. Word Translation text vs. Verse Translation text):

- `text-xs` (0.75rem / 12px)
- `text-sm` (0.875rem / 14px)
- `text-base` (1rem / 16px)
- `text-lg` (1.125rem / 18px)
- `text-xl` (1.25rem / 20px)
- `text-2xl` (1.5rem / 24px)
- `text-3xl` (1.875rem / 30px)
- `text-4xl` (2.25rem / 36px)
- `text-5xl` (3rem / 48px)
- `text-6xl` (3.75rem / 60px)
- `text-7xl` (4.5rem / 72px)
- `text-8xl` (6rem / 96px)

---

## 3. UI Component Structure & Design Tokens

Common Tailwind CSS design tokens are defined in `src/data/commonClasses.js` and `src/app.css`:

### Standard UI Elements

- **Disabled State**: `opacity-30 cursor-not-allowed pointer-events-none select-none`
- **Primary Button**: `inline-flex items-center justify-center space-x-2 py-2 px-4 focus:border-theme-accent focus:ring-theme-accent rounded-3xl transition-colors duration-150 cursor-pointer border border-transparent hover:border-theme-accent bg-theme-accent/5`
- **Outline Button**: `bg-transparent border border-theme-accent/20 inline-flex items-center justify-center space-x-2 py-2 px-4 focus:border-theme-accent focus:ring-theme-accent rounded-3xl transition-colors duration-150 cursor-pointer`
- **Tab Pill**: `py-2 px-4 text-xs cursor-pointer rounded-3xl hover:bg-theme-accent/5`
- **Label Pill**: `bg-theme-accent/5 text-sm font-normal me-2 px-2.5 py-0.5 rounded-full`
- **Link**: `font-semibold underline text-theme-accent`
- **Selected Radio/Checkbox**: `bg-theme-accent/5 !border-theme-accent`
- **Interactive Card**: `inline-flex justify-between items-center p-5 w-full rounded-lg cursor-pointer border-2 border-theme-accent/20 bg-theme-bg hover:bg-theme-accent/5`

### Layout Width Container (`getWebsiteWidth`)

The application layout dynamically toggles between standard maximum width (`max-w-7xl`) and full/wide container layout (`max-w-full px-4`).

---

## 4. Tajweed Color Ruling Matrix

The Tajweed engine maps **41 distinct Tajweed rulings** across 32 color spectrum IDs ([src/data/tajweedRulings.js](file:///Users/theatifwaheed/Documents/code/quranwbw/src/data/tajweedRulings.js)):

| Color Group | Ruling Category | Examples / Rules |
| --- | --- | --- |
| **Grays** | Silent & Merged Letters | Alif Hamzat Wasl, Lam Ash-Shamsiyyah, Idghaam without Ghunna, Idghaam Mutajaanis, Idghaam Mutaqaarib |
| **Maroons** | Compulsory Lengthening | Madd Lazim (6 Harakah), Madd Farq |
| **Reds** | Obligatory Lengthening | Madd Wajib Muttasil / Munfasil (4-5 Harakah), Madd Silah Kubra |
| **Oranges** | Permissible Lengthening | Madd Arid Lis-sukoon (2, 4, 6 Harakah), Madd Linn |
| **Golds** | Normal Lengthening | Madd (2 Harakah), Alif Khanjariyyah, Madd Silah Sughra |
| **Greens** | Nasalization (Ghunnah) | Ghunnah Ikhfa'a, Ikhfa'a Shafawy, Noon/Meem Tashdid |
| **Assorted (Blue/Teal)** | Emphatic & Echoing | Tafkhim (Thickening), Qalqalah (Echoing sound) |
| **Symbols / Icons** | Waqf & Ayah Markers | Waqf Signs, Normal Ayah Icons, Special Continuation Icons |
