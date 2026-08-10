# QuranWBW — Project Information & Developer Guide

## 1. Repository Metadata

| Attribute | Details |
| --- | --- |
| **Project Name** | QuranWBW.com |
| **Tagline** | Word By Word Translation, Transliteration And Morphology |
| **Repository URL** | `https://github.com/marwan/quranwbw-v4` |
| **Framework** | SvelteKit 2.26+ (Svelte 4) |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3.4 + Flowbite Svelte |
| **Client Storage** | Dexie 4 (IndexedDB) + localStorage |
| **PWA Manifest** | `static/manifest.json` |

---

## 2. Package Dependencies (`package.json`)

### Core Dependencies (`dependencies`)

| Package | Version | Purpose |
| --- | --- | --- |
| `@sveltejs/adapter-auto` | `^3.0.0` | Cloudflare Pages / auto adapter |
| `@sveltejs/adapter-node` | `^5.2.11` | Node.js deployment adapter (toggled via `USE_NODE_ADAPTER`) |
| `@sveltejs/kit` | `^2.16.0` | SvelteKit meta-framework |
| `@sveltejs/vite-plugin-svelte` | `^3.0.0` | Vite plugin for Svelte compilation |
| `dexie` | `^4.0.10` | IndexedDB wrapper for 7-day data caching |
| `flowbite` | `^2.5.2` | UI component library primitives |
| `flowbite-svelte` | `^0.46.15` | Svelte bindings for Flowbite components |
| `marked` | `^15.0.6` | Markdown parser for About and Changelog pages |
| `svelte` | `^4.2.19` | Core UI framework |
| `svelte-inview` | `^4.1.0` | Intersection Observer for infinite scrolling |
| `vite` | `^5.0.3` | Next-generation frontend build tool |

### Development Dependencies (`devDependencies`)

| Package | Version | Purpose |
| --- | --- | --- |
| `@types/gtag.js` | `^0.0.20` | Google Analytics TypeScript declarations |
| `autoprefixer` | `^10.4.20` | CSS vendor prefixing |
| `eslint` | `^8.56.0` | Code linting |
| `eslint-config-prettier` | `^9.1.0` | Prettier ESLint rule disabling |
| `eslint-plugin-svelte` | `^2.35.1` | ESLint rules for Svelte components |
| `postcss` | `^8.4.49` | CSS post-processing pipeline |
| `prettier` | `^3.1.1` | Opinionated code formatter |
| `prettier-plugin-svelte` | `^3.1.2` | Prettier plugin for Svelte formatting |
| `prettier-plugin-tailwindcss` | `^0.6.9` | Auto-sorting Tailwind utility classes |
| `tailwind-scrollbar` | `^3.1.0` | Custom scrollbar styling utilities |
| `tailwindcss` | `^3.4.17` | Utility-first CSS framework |

---

## 3. npm Scripts Catalog

| Script | Command | Purpose |
| --- | --- | --- |
| `npm run dev` | `vite dev` | Launches local development server at `http://localhost:5173` |
| `npm run build` | `vite build` | Compiles application into production static site / Node bundle |
| `npm run preview` | `vite preview` | Previews production build locally |
| `npm run lint` | `prettier --check . && eslint .` | Runs Linter and Formatter checks across codebase |
| `npm run format` | `prettier --write .` | Auto-formats all JS, CSS, JSON, and Svelte files |
| `npm run sitemap` | `node scripts/generateSitemap.advanced.js` | Regenerates `sitemap.xml` and sub-sitemaps in `static/` |

---

## 4. Environment Variables & Endpoint Configurations

The application relies on static CDN endpoints defined in `src/data/websiteSettings.js`:

```javascript
export const staticEndpoint = 'https://static.quranwbw.com/data/v4';
export const wordsAudioURL = 'https://audios.quranwbw.com/words';
export const mushafWordFontLink = `${staticEndpoint}/fonts/Hafs/KFGQPC-v4`;
export const chapterHeaderFontLink = `${staticEndpoint}/fonts/Extras/chapter-headers/NeoHeader_COLOR-Regular.woff2?version=12`;
```

### Search API Key (`.env`)

For Kalimat AI search functionality:

```env
VITE_KALIMAT_PUBLIC_API_KEY=your_public_kalimat_api_key
```

---

## 5. Development Guidelines & Conventions

1. **Client-Side First**: Do not add server-only imports (`$app/server`, `+page.server.js`). All routes must remain `ssr = false`.
2. **Store Naming**: All global Svelte stores in `src/utils/stores.js` must follow the `__storeName` double-underscore prefix convention.
3. **No Direct DOM Mutation for Font Visibility**: Use the reactive `pageVisible` flag pattern in `WordsBlock.svelte` rather than manual `element.classList.remove('invisible')` to avoid conflicts with Svelte's Virtual DOM.
4. **Memory Hygiene**: When instantiating Audio or Blob URLs, ensure proper cleanup (`URL.revokeObjectURL`) to prevent browser memory leaks.
5. **Add Sub-Sitemaps for New Features**: If adding new root routes or dynamic routes, update `scripts/generateSitemap.advanced.js` and re-run `npm run sitemap`.
