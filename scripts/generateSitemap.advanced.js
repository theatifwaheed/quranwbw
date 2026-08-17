#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { quranMetaData, supplicationsFromQuran } from '../src/data/quranMeta.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const baseURL = 'https://quran.fluxpert.com';
const sitemapDir = path.join(__dirname, '../static');
const LAST_TOPIC_ID = 1857;

// Ensure output dir exists
if (!fs.existsSync(sitemapDir)) {
    fs.mkdirSync(sitemapDir, { recursive: true });
}

// Helpers
const escapeXml = (str) =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

const today = new Date().toISOString().split('T')[0];

const entry = (loc, p = 0.8, freq = 'monthly', lastmod = today) => `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${p}</priority>
  </url>
`;

const write = (name, content) => {
    const file = path.join(sitemapDir, name);
    fs.writeFileSync(file, content);
    return file;
};

// 1. Static Routes
const staticRoutes = [
    ['/', 1.0, 'daily'],
    ['/duas', 0.9, 'weekly'],
    ['/supplications', 0.9, 'weekly'],
    ['/topics', 0.8, 'weekly'],
    ['/morphology', 0.8, 'weekly'],
    ['/bookmarks', 0.6, 'monthly'],
    ['/search', 0.7, 'monthly'],
    ['/games', 0.5, 'monthly'],
    ['/about', 0.4, 'monthly'],
    ['/faq', 0.4, 'monthly'],
    ['/changelog', 0.3, 'monthly'],
];

// 2. Chapters (1 to 114)
const chapters = Array.from({ length: 114 }, (_, i) => [`/${i + 1}`, 0.9, 'weekly']);

// 3. Divisions: Juz (1-30), Hizb (1-60), Mushaf Pages (1-604)
const juz = Array.from({ length: 30 }, (_, i) => [`/juz?id=${i + 1}`, 0.8, 'monthly']);
const hizb = Array.from({ length: 60 }, (_, i) => [`/hizb?id=${i + 1}`, 0.7, 'monthly']);
const pages = Array.from({ length: 604 }, (_, i) => [`/page?id=${i + 1}`, 0.7, 'monthly']);

// 4. Verses: All 6,236 Ayahs across 114 Surahs
const verses = [];
for (let chapterId = 1; chapterId <= 114; chapterId++) {
    const surah = quranMetaData[chapterId];
    if (surah && surah.verses) {
        for (let verseNum = 1; verseNum <= surah.verses; verseNum++) {
            verses.push([`/${chapterId}?startVerse=${verseNum}`, 0.6, 'monthly']);
        }
    }
}

// 5. Topics (1 to 1,857)
const topics = Array.from({ length: LAST_TOPIC_ID }, (_, i) => [`/topics?id=${i + 1}`, 0.7, 'monthly']);

// 6. Quranic Duas & Supplications
const duaVerses = Object.keys(supplicationsFromQuran || {}).map((verseKey) => {
    const [ch, v] = verseKey.split(':');
    return [`/${ch}?startVerse=${v}`, 0.8, 'weekly'];
});

// 7. Morphology for all 114 chapters
const morphologyRoutes = Array.from({ length: 114 }, (_, i) => [`/morphology?chapter=${i + 1}`, 0.7, 'monthly']);

// Build sitemap file helper
const buildSitemap = (name, routes) => {
    const body = routes
        .map((r) => {
            if (Array.isArray(r)) {
                return entry(baseURL + r[0], r[1] ?? 0.8, r[2] ?? 'monthly', today);
            }
            return entry(baseURL + r, 0.8, 'monthly', today);
        })
        .join('\n');

    const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        body +
        `\n</urlset>`;

    write(name, xml);
    return routes.length;
};

// Generate all individual sitemaps
console.log('Generating sitemaps...');

const counts = {
    static: buildSitemap('sitemap-static.xml', staticRoutes),
    chapters: buildSitemap('sitemap-chapters.xml', chapters),
    divisions: buildSitemap('sitemap-divisions.xml', [...juz, ...hizb, ...pages]),
    verses: buildSitemap('sitemap-verses.xml', verses),
    topics: buildSitemap('sitemap-topics.xml', topics),
    duas: buildSitemap('sitemap-duas.xml', duaVerses),
    morphology: buildSitemap('sitemap-morphology.xml', morphologyRoutes),
};

// Build index sitemap
const indexFiles = [
    'sitemap-static.xml',
    'sitemap-chapters.xml',
    'sitemap-divisions.xml',
    'sitemap-verses.xml',
    'sitemap-topics.xml',
    'sitemap-duas.xml',
    'sitemap-morphology.xml',
];

const indexXml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexFiles
        .map(
            (f) => `  <sitemap>
    <loc>${baseURL}/${f}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
        )
        .join('\n') +
    `\n</sitemapindex>`;

write('sitemap-index.xml', indexXml);
write('sitemap.xml', indexXml);

console.log('✅ Sitemaps generated successfully!');
console.log(counts);
console.log(`Total URLs indexed: ${Object.values(counts).reduce((a, b) => a + b, 0)}`);