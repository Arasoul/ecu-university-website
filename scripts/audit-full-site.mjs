import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = (process.argv.find((a) => a.startsWith('--base=')) || '--base=http://127.0.0.1:3100').split('=')[1].replace(/\/$/, '');
const outputPath = process.argv.find((a) => a.startsWith('--out='))?.split('=')[1] || 'reports/FULL_SITE_AUDIT.json';
const screenshotDir = 'reports/screenshots';

const issues = [];
const record = (severity, area, subject, message, detail) => {
  issues.push({ severity, area, subject, message, ...(detail ? { detail } : {}) });
  console.log(`[${severity.toUpperCase()}] ${area} :: ${subject} :: ${message}${detail ? ` :: ${detail}` : ''}`);
};

// ---------------------------------------------------------------- route discovery
const appDir = path.join(root, 'app');
const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name === 'page.js' || entry.name === 'page.jsx') files.push(full);
  }
  return files;
};

const toRoute = (file) => {
  const rel = path.relative(appDir, file).replace(/[\\/]/g, '/').replace(/\/page\.jsx?$/, '');
  if (rel === 'page.js') return '/';
  return `/${rel}`;
};

const dynamicRouteTemplates = (await walk(appDir)).map(toRoute).filter((r) => r.includes('[')).sort();
const staticRoutes = (await walk(appDir)).map(toRoute).filter((r) => !r.includes('[')).sort();

const readJson = async (p) => JSON.parse(await readFile(path.join(root, p), 'utf8'));

const facultyDirectory = (await readJson('data/imports/ecu_verified_content_2026-10-21.json')).faculties
  .map((f) => f.slug)
  .filter(Boolean);
const verifiedStories = (await readJson('data/imports/ecu_verified_content_2026-10-21.json')).archivedStories;
const newsSlugs = verifiedStories.filter((s) => s.kind === 'archived-news').map((s) => s.id);
const eventSlugs = verifiedStories.filter((s) => s.kind === 'archived-activity').map((s) => s.id);
const enrichment = await readJson('data/content/milestone-6-enrichment.json');
const enrichmentEventSlugs = enrichment.publishedActivities.map((a) => a.slug || a.id).filter(Boolean);

// programme slugs are derived: <faculty-slug>/<programme-slug>
const facultySlugToPrograms = {};
for (const story of verifiedStories) {
  void story;
}
const facultyModule = await readFile(path.join(root, 'lib/faculties.js'), 'utf8');
const slugify = (value) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const facultyPrograms = [];
const programBlocks = [...facultyModule.matchAll(/const (\w+Programs) = \[([\s\S]*?)\n\];/g)];
const facultyNameToSlug = new Map();
for (const entry of verifiedStories) void entry;
for (const m of facultyModule.matchAll(/\{ id: '([^']+)', slug: '([^']+)', name: '([^']+)'/g)) {
  facultyNameToSlug.set(m[3], m[2]);
}
for (const block of programBlocks) {
  for (const pm of block[2].matchAll(/name: '([^']+)'/g)) {
    facultyPrograms.push({ name: pm[1] });
  }
}
// Pair programs to faculties using the module order.
const facultyOrder = [...facultyModule.matchAll(/\{ id: 'faculty-[^']+', slug: '([^']+)', name: '([^']+)'/g)].map((m) => ({ slug: m[1], name: m[2] }));
const facultyWithPrograms = facultyOrder.filter((f) => facultyModule.includes(`const `) && new RegExp(`${f.slug}`).test(facultyModule));
const programmeRoutes = [];
const programGroups = [
  { slug: 'computers-and-information-systems', names: ['Computer Science', 'Information Systems', 'Artificial Intelligence', 'Cybersecurity', 'Data Sciences'] },
  { slug: 'engineering-and-technology', names: ['Construction and Building Engineering', 'Energy and Renewable Energy Engineering', 'Software Engineering and Information Technology', 'Mechatronics Engineering and Automation', 'Petroleum and Gas Engineering'] },
  { slug: 'economics-and-international-trade', names: ['Accounting', 'Finance and Investment', 'International Business', 'International Economics', 'Marketing and Innovation'] },
];
for (const group of programGroups) {
  for (const name of group.names) programmeRoutes.push(`/programmes/${group.slug}/${slugify(name)}`);
}

const allRoutes = [
  ...new Set([
    ...staticRoutes,
    ...facultyDirectory.map((s) => `/faculties/${s}`),
    ...programmeRoutes,
    ...newsSlugs.map((s) => `/news/${s}`),
    ...eventSlugs.map((s) => `/events/${s}`),
    ...enrichmentEventSlugs.map((s) => `/events/${s}`),
  ]),
].sort();

const invalidRoutes = [
  '/faculties/not-a-faculty',
  '/faculties/law/extra',
  '/programmes/not-a-faculty/not-a-programme',
  '/programmes/engineering-and-technology/not-a-programme',
  '/programmes/engineering-and-technology',
  '/news/not-a-story',
  '/events/not-an-event',
  '/this-route-does-not-exist',
  '/campus-life/not-a-section',
];

// ---------------------------------------------------------------- browser
let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch {
  browser = await chromium.launch({ headless: true, channel: 'msedge' });
}
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await mkdir(screenshotDir, { recursive: true });
const page = await context.newPage();

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push({ url: page.url(), text: m.text() }); });
page.on('pageerror', (e) => pageErrors.push({ url: page.url(), text: e.message }));
page.on('requestfailed', (r) => failedRequests.push({ url: page.url(), resource: r.url(), error: r.failure()?.errorText }));
page.on('response', (r) => { if (r.status() >= 400) failedRequests.push({ url: page.url(), resource: r.url(), error: `HTTP ${r.status()}` }); });

const linkTargets = new Map();
const pageResults = [];

const DEV_PATTERNS = [
  /verify article details/i,
  /reverify details/i,
  /confirm formal degree titles/i,
  /media rights have not been verified/i,
  /information awaits publication approval/i,
  /this section has no published information/i,
  /publishStatus\s*[:=]/i,
  /editorial[_ ]?review/i,
  /not officially approved/i,
  /awaiting written authorization/i,
  /requires a current approved ECU record before local publication/i,
];

for (const route of allRoutes) {
  consoleErrors.length = 0; pageErrors.length = 0; failedRequests.length = 0;
  let response;
  const started = Date.now();
  try {
    response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
  } catch (error) {
    record('P0', 'navigation', route, 'Navigation failed', error.message);
    continue;
  }
  const status = response ? response.status() : 0;
  if (status !== 200) record('P0', 'http-status', route, `Returned HTTP ${status}, expected 200`);

  const analysis = await page.evaluate(() => {
    const anchors = [...document.querySelectorAll('a[href]')];
    const internal = anchors.map((a) => a.getAttribute('href'))
      .filter((h) => h && !/^(https?:|mailto:|tel:|#)/.test(h));
    const external = anchors.map((a) => ({ href: a.href, text: a.textContent.trim().slice(0, 80) }))
      .filter((a) => /^https?:/.test(a.href) && !a.href.startsWith(location.origin));
    const imgs = [...document.querySelectorAll('img')];
    return {
      internalLinks: [...new Set(internal)],
      externalLinks: external,
      imagesWithoutAlt: imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src')),
      brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.getAttribute('src')),
      imgCount: imgs.length,
      unnamedButtons: [...document.querySelectorAll('button')].filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label')).length,
      unnamedLinks: anchors.filter((a) => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]')).length,
      h1Count: document.querySelectorAll('h1').length,
      h1: document.querySelector('h1')?.textContent.trim() || null,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || null,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      text: document.body.innerText,
      footerCount: document.querySelectorAll('footer').length,
      headerCount: document.querySelectorAll('header.site-header').length,
      hasSkipLink: Boolean(document.querySelector('a.skip-link')),
      hasMain: Boolean(document.querySelector('main')),
      landmarks: {
        nav: document.querySelectorAll('nav').length,
        main: document.querySelectorAll('main').length,
      },
    };
  });

  for (const href of analysis.internalLinks) {
    const absolute = new URL(href, `${baseUrl}${route}`).toString();
    linkTargets.set(absolute, { href, from: route });
  }

  if (analysis.h1Count !== 1) record(analysis.h1Count === 0 ? 'P1' : 'P2', 'accessibility', route, `h1 count is ${analysis.h1Count}, expected exactly 1`);
  if (analysis.imagesWithoutAlt.length) record('P2', 'accessibility', route, 'Images without alt text', analysis.imagesWithoutAlt.join(', '));
  if (analysis.brokenImages.length) record('P1', 'media', route, 'Broken images', analysis.brokenImages.join(', '));
  if (analysis.unnamedButtons) record('P2', 'accessibility', route, `${analysis.unnamedButtons} buttons without accessible name`);
  if (analysis.unnamedLinks) record('P2', 'accessibility', route, `${analysis.unnamedLinks} links without accessible name`);
  if (!analysis.lang) record('P2', 'accessibility', route, 'Missing document language');
  if (!analysis.title) record('P2', 'metadata', route, 'Missing page title');
  if (!analysis.description) record('P2', 'metadata', route, 'Missing meta description');
  if (!analysis.canonical) record('P3', 'metadata', route, 'Missing canonical link');
  if (analysis.footerCount !== 1) record('P2', 'structure', route, `${analysis.footerCount} footer elements (expected 1)`);
  if (analysis.headerCount !== 1) record('P2', 'structure', route, `${analysis.headerCount} site headers (expected 1)`);
  if (!analysis.hasSkipLink && route === '/') record('P2', 'accessibility', route, 'Missing skip link');
  if (analysis.overflow > 2) record('P1', 'responsive', route, `Horizontal overflow of ${analysis.overflow}px at 1440px`);
  if (analysis.text.trim().length < 400) record('P3', 'content', route, `Very little text rendered (${analysis.text.trim().length} chars)`);

  for (const pattern of DEV_PATTERNS) {
    if (pattern.test(analysis.text)) record('P1', 'public-copy', route, `Developer-facing copy visible: /${pattern.source}/.test(text)`);
  }

  for (const e of consoleErrors) record('P1', 'console', route, 'Console error', e.text);
  for (const e of pageErrors) record('P0', 'runtime', route, 'Uncaught page error', e.text);
  for (const f of failedRequests) {
    if (f.resource.includes('/_next/') || f.error === 'net::ERR_ABORTED' || f.resource.includes('?_rsc=')) continue;
    record('P1', 'network', route, 'Failing resource request', `${f.resource} (${f.error})`);
  }

  pageResults.push({
    route, status, ms: Date.now() - started, title: analysis.title, h1: analysis.h1,
    canonical: analysis.canonical, lang: analysis.lang, dir: analysis.dir,
    imgCount: analysis.imgCount, textLength: analysis.text.trim().length,
    overflow: analysis.overflow, footerCount: analysis.footerCount, headerCount: analysis.headerCount,
    externalLinks: analysis.externalLinks,
  });
}

// ---------------------------------------------------------------- invalid routes
const invalidResults = [];
for (const route of invalidRoutes) {
  let response;
  try {
    response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (error) {
    record('P1', 'dynamic-routes', route, 'Navigation threw instead of returning 404', error.message);
    continue;
  }
  const status = response ? response.status() : 0;
  const redirect = response?.request()?.redirectedFrom();
  let redirectStatus = null;
  if (redirect) {
    const redirectResponse = await redirect.response();
    redirectStatus = redirectResponse ? redirectResponse.status() : null;
  }
  const finalPath = new URL(page.url()).pathname.replace(/^\/(en|ar|zh)(?=\/|$)/, '') || '/';
  invalidResults.push({ route, status, redirectStatus, finalPath });

  // A locale/faculty redirect is an acceptable outcome for a partial slug, as long
  // as it resolves to a real page and not to a soft 404.
  const redirectedValidly = Boolean(redirectStatus && [301, 302, 307, 308].includes(redirectStatus) && status === 200);
  const is404 = status === 404 || status === 410;
  if (!is404 && !redirectedValidly) {
    record('P1', 'dynamic-routes', route, `Invalid slug returned HTTP ${status}, expected 404`, `finalPath=${finalPath}`);
  }
  const text = await page.evaluate(() => document.body.innerText);
  if (/cannot read properties|is not a function|is not defined|unhandled|TypeError/i.test(text)) {
    record('P0', 'dynamic-routes', route, 'Error text rendered for invalid slug', text.slice(0, 200));
  }
}

// ---------------------------------------------------------------- link crawl
const linkStatuses = [];
for (const [target, meta] of [...linkTargets.entries()].sort()) {
  const clean = target.split('#')[0];
  if (!clean || clean === `${baseUrl}/`) continue;
  try {
    const res = await context.request.get(clean, { timeout: 30000, maxRedirects: 0 });
    const status = res.status();
    linkStatuses.push({ ...meta, resolved: clean, status });
    if (status >= 400) record('P1', 'links', meta.from, `Internal link "${meta.href}" -> HTTP ${status}`, clean);
  } catch (error) {
    linkStatuses.push({ ...meta, resolved: clean, status: 0, error: error.message });
    record('P1', 'links', meta.from, `Internal link "${meta.href}" could not be resolved`, error.message);
  }
}

// label/destination mismatches for in-site navigation
const labelMismatch = [];
for (const [, meta] of linkTargets) {
  const label = meta.href;
  if (/\/faculties$/.test(label) && /faculty|programme|program/i.test(meta.href) && /view all/i.test('')) continue;
  labelMismatch.push(meta);
}
void labelMismatch;

// ---------------------------------------------------------------- responsive
const viewports = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1024', width: 1024, height: 800 },
  { name: '768', width: 768, height: 1024 },
  { name: '390', width: 390, height: 844 },
  { name: '320', width: 320, height: 640 },
];
const responsiveFindings = [];
const responsiveRoutes = ['/', '/about', '/faculties', '/programmes', '/admissions', '/services', '/research', '/news', '/events', '/news-events', '/achievements', '/campus-life', '/campus-life/gallery', '/campus-life/facilities', '/campus-life/visit', '/contact', '/search', '/faculties/engineering-and-technology', '/news/news-pharmacists-2024', '/events/activity-media-quality-day', '/programmes/engineering-and-technology/petroleum-and-gas-engineering'];
for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  for (const route of responsiveRoutes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) {
      record('P1', 'responsive', route, `Horizontal overflow of ${overflow}px at ${vp.width}px`);
      responsiveFindings.push({ route, viewport: vp.name, overflow });
    }
  }
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.screenshot({ path: `${screenshotDir}/audit-home-${vp.name}.png`, fullPage: true });
}

// ---------------------------------------------------------------- locales
await page.setViewportSize({ width: 1440, height: 900 });
const localeFindings = [];
for (const prefix of ['en', 'ar', 'zh']) {
  for (const route of ['/', '/faculties', '/programmes', '/contact', '/campus-life/gallery', '/news', '/admissions']) {
    const target = route === '/' ? `/${prefix}` : `/${prefix}${route}`;
    const res = await page.goto(`${baseUrl}${target}`, { waitUntil: 'networkidle', timeout: 45000 });
    const state = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelector('h1')?.textContent.trim() || null,
      untranslated: [...document.querySelectorAll('header.site-header a, header.site-header button, header.site-header select')].map((n) => n.textContent.trim()),
    }));
    const expectedLang = prefix === 'zh' ? 'zh-Hans' : prefix;
    const expectedDir = prefix === 'ar' ? 'rtl' : 'ltr';
    if (state.lang !== expectedLang) record('P1', 'localization', target, `lang="${state.lang}", expected "${expectedLang}"`);
    if (state.dir !== expectedDir) record('P1', 'localization', target, `dir="${state.dir}", expected "${expectedDir}"`);
    if (state.overflow > 2) record('P1', 'responsive', target, `Horizontal overflow of ${state.overflow}px`);
    localeFindings.push({ target, status: res.status(), ...state });
  }
  await page.goto(`${baseUrl}/${prefix}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.screenshot({ path: `${screenshotDir}/audit-home-${prefix}.png`, fullPage: true });
}

// ---------------------------------------------------------------- interactions
const interactions = [];
const check = (name, passed, detail) => {
  interactions.push({ name, passed, ...(detail ? { detail } : {}) });
  if (!passed) record('P1', 'interaction', name, 'Interaction check failed', detail);
};

await page.setViewportSize({ width: 1440, height: 900 });

// 1. desktop mega menu
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await page.click('button.nav-menu-trigger');
await page.waitForTimeout(300);
let mega = await page.evaluate(() => {
  const m = document.querySelector('.mega-menu');
  if (!m) return null;
  const r = m.getBoundingClientRect();
  return { visible: r.height > 0 && r.width > 0, links: [...m.querySelectorAll('a')].map((a) => a.getAttribute('href')), expanded: document.querySelector('.nav-menu-trigger')?.getAttribute('aria-expanded') };
});
check('desktop mega menu opens with links', Boolean(mega && mega.visible && mega.links.length > 0), JSON.stringify(mega));
await page.keyboard.press('Escape');
await page.waitForTimeout(250);
mega = await page.evaluate(() => ({ expanded: document.querySelector('.nav-menu-trigger')?.getAttribute('aria-expanded'), present: Boolean(document.querySelector('.mega-menu')) }));
check('mega menu closes on Escape', mega.expanded === 'false', JSON.stringify(mega));

// 2. click outside dismissal
await page.click('button.nav-menu-trigger');
await page.waitForTimeout(200);
await page.mouse.click(20, 700);
await page.waitForTimeout(300);
const outside = await page.evaluate(() => document.querySelector('.nav-menu-trigger')?.getAttribute('aria-expanded'));
check('mega menu closes on outside click', outside === 'false' || outside === null, `aria-expanded=${outside}`);

// 3. mobile menu
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await page.click('button.menu-button');
await page.waitForTimeout(300);
const mobileMenu = await page.evaluate(() => {
  const nav = document.querySelector('nav#main-menu');
  const r = nav.getBoundingClientRect();
  return { visible: r.width > 0 && r.height > 0, expanded: document.querySelector('button.menu-button')?.getAttribute('aria-expanded'), linkCount: nav.querySelectorAll('a').length };
});
check('mobile menu opens', mobileMenu.visible && mobileMenu.expanded === 'true' && mobileMenu.linkCount > 3, JSON.stringify(mobileMenu));
await page.screenshot({ path: `${screenshotDir}/audit-mobile-menu-390.png`, fullPage: false });

// 4. locale switch
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await page.selectOption('select[aria-label]', 'ar');
await page.waitForTimeout(1500);
const afterLocale = await page.evaluate(() => ({ url: location.pathname, lang: document.documentElement.lang, dir: document.documentElement.dir }));
check('locale switch navigates to /ar and sets RTL', afterLocale.url.startsWith('/ar') && afterLocale.dir === 'rtl', JSON.stringify(afterLocale));

// The locale switch stores a preference cookie. Clear it so the remaining
// checks run against the default (unprefixed) routes.
await context.clearCookies();
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => window.localStorage.clear());

// 4b. locale prefixed header navigation stays inside the language
await page.goto(`${baseUrl}/ar`, { waitUntil: 'networkidle' });
const localeNav = await page.evaluate(() => ({
  links: [...document.querySelectorAll('header.site-header nav a')].map((a) => a.getAttribute('href')),
  utility: [...document.querySelectorAll('.utility-bar a')].map((a) => a.getAttribute('href')),
  englishLabels: [...document.querySelectorAll('header.site-header nav a')]
    .map((a) => a.textContent.trim())
    .filter((text) => /^(News & events|Campus life|Services|About ECU|Academics|Admissions|Research|Contact|Search)$/i.test(text)),
}));
check('Arabic header navigation links stay in /ar', localeNav.links.every((href) => href.startsWith('/ar')), JSON.stringify(localeNav.links));
check('Arabic header navigation is translated', localeNav.englishLabels.length === 0, JSON.stringify(localeNav.englishLabels));
check('Utility bar links point to real ECU destinations', localeNav.utility.every((href) => href.startsWith('/ar/services#')), JSON.stringify(localeNav.utility));
await context.clearCookies();
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => window.localStorage.clear());

// 5. search journey
await page.goto(`${baseUrl}/search`, { waitUntil: 'networkidle' });
const searchHasInput = await page.evaluate(() => Boolean(document.querySelector('input[type="search"], input[name="q"], input[type="text"]')));
check('search page exposes a query input', searchHasInput);
if (searchHasInput) {
  const input = page.locator('input[type="search"], input[name="q"], input[type="text"]').first();
  await input.fill('engineering');
  await input.press('Enter');
  await page.waitForTimeout(1500);
  const searchResult = await page.evaluate(() => ({ url: location.href, text: document.body.innerText }));
  check('search returns results for "engineering"', /engineering/i.test(searchResult.text), searchResult.url);
  await page.screenshot({ path: `${screenshotDir}/audit-search-results.png`, fullPage: true });

  // the same story must not appear twice in the result list
  const input2 = page.locator('input[type="search"], input[name="q"], input[type="text"]').first();
  await input2.fill('shanghai');
  await input2.press('Enter');
  await page.waitForTimeout(1200);
  const duplicates = await page.evaluate(() => {
    const titles = [...document.querySelectorAll('[data-search-result] h2, [data-search-result] h3, .search-result h2, .search-result h3, article h3')]
      .map((n) => n.textContent.trim()).filter(Boolean);
    const counts = titles.reduce((acc, title) => ({ ...acc, [title]: (acc[title] || 0) + 1 }), {});
    return Object.entries(counts).filter(([, count]) => count > 1);
  });
  check('search does not list the same story twice', duplicates.length === 0, JSON.stringify(duplicates));
}

// 6. faculty directory filters
await page.goto(`${baseUrl}/faculties`, { waitUntil: 'networkidle' });
const facultyControls = await page.evaluate(() => ({
  inputs: document.querySelectorAll('input[type="search"], input[type="text"]').length,
  selects: document.querySelectorAll('select').length,
  buttons: [...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean).slice(0, 12),
  cards: document.querySelectorAll('.faculty-card, .directory-card, [data-faculty-card]').length,
}));
check('faculty directory has a search control', facultyControls.inputs > 0, JSON.stringify(facultyControls));
if (facultyControls.inputs > 0) {
  const facultyInput = page.locator('input[type="search"], input[type="text"]').first();
  const before = await page.evaluate(() => document.querySelectorAll('.faculty-card, .directory-card, [data-faculty-card]').length);
  await facultyInput.fill('engineering');
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => document.querySelectorAll('.faculty-card, .directory-card, [data-faculty-card]').length);
  check('faculty search filters the directory', after < before && after > 0, `before=${before} after=${after}`);
  await facultyInput.fill('zzzznotarealfaculty');
  await page.waitForTimeout(500);
  const empty = await page.evaluate(() => document.body.innerText);
  check('faculty search shows a no-results state', /no (results|match|facult)/i.test(empty), empty.slice(0, 160));
  await facultyInput.fill('');
  await page.waitForTimeout(300);
}

// 7. gallery filters + image count
await page.goto(`${baseUrl}/campus-life/gallery`, { waitUntil: 'networkidle' });
const gallery = await page.evaluate(() => ({
  images: document.querySelectorAll('img').length,
  galleryImages: document.querySelectorAll('.gallery-grid img, .approved-gallery img, figure img').length,
  buttons: [...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean),
  text: document.body.innerText.slice(0, 600),
}));
check('gallery renders published photographs', gallery.galleryImages >= 9, JSON.stringify({ images: gallery.images, galleryImages: gallery.galleryImages }));

// 8. contact campus selector
await page.goto(`${baseUrl}/contact`, { waitUntil: 'networkidle' });
const contact = await page.evaluate(() => ({
  radios: document.querySelectorAll('input[type="radio"], [role="tab"], button[aria-pressed]').length,
  mapLinks: [...document.querySelectorAll('a')].filter((a) => /google\.(com|ae)\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(a.href)).map((a) => a.href).slice(0, 10),
  copyButtons: [...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter((t) => /copy/i.test(t)),
  telLinks: [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href')),
}));
check('contact exposes campus selectors', contact.radios > 0, JSON.stringify(contact));
check('contact exposes Google Maps links', contact.mapLinks.length > 0, JSON.stringify(contact.mapLinks));
check('contact exposes a copy-address action', contact.copyButtons.length > 0, JSON.stringify(contact.copyButtons));

// 9. programme comparison
await page.goto(`${baseUrl}/programmes`, { waitUntil: 'networkidle' });
const programmes = await page.evaluate(() => ({
  checkboxes: document.querySelectorAll('input[type="checkbox"]').length,
  compareText: /compare/i.test(document.body.innerText),
  items: document.querySelectorAll('[data-programme], .programme-card, .programme-row').length,
}));
check('programmes page exposes a comparison control', programmes.compareText, JSON.stringify(programmes));

// 10. admissions application link
await page.goto(`${baseUrl}/admissions`, { waitUntil: 'networkidle' });
const admissions = await page.evaluate(() => ({
  externalApply: [...document.querySelectorAll('a[target="_blank"]')].map((a) => a.href),
  checklist: document.querySelectorAll('input[type="checkbox"], .checklist li, .admission-checklist li').length,
}));
check('admissions links to the official application portal', admissions.externalApply.some((h) => /admission|apply/i.test(h)), JSON.stringify(admissions.externalApply));

// 11. web fonts are actually applied
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
const fonts = await page.evaluate(async () => {
  await document.fonts.ready;
  const heading = document.querySelector('h1');
  const headingFamily = heading ? getComputedStyle(heading).fontFamily : '';
  const loaded = [...document.fonts].map((f) => `${f.family}|${f.status}`);
  return { headingFamily, loaded: loaded.slice(0, 12), count: document.fonts.size };
});
check('web fonts are loaded by the browser', fonts.count > 0 && /Manrope|Inter/i.test(fonts.headingFamily), JSON.stringify(fonts));

// 12. response headers on the audited origin
const headerResults = [];
try {
  const headResponse = await context.request.get(`${baseUrl}/`, { timeout: 30000, maxRedirects: 0 });
  const headers = headResponse.headers();
  const csp = headers['content-security-policy'] || '';
  const expected = {
    'strict-transport-security': headers['strict-transport-security'] || null,
    'x-content-type-options': headers['x-content-type-options'] || null,
    'x-frame-options': headers['x-frame-options'] || null,
    'referrer-policy': headers['referrer-policy'] || null,
    'permissions-policy': headers['permissions-policy'] || null,
    'content-security-policy': csp || null,
    'x-powered-by': headers['x-powered-by'] || null,
  };
  headerResults.push({ url: `${baseUrl}/`, status: headResponse.status(), headers: expected });
  if (expected['x-powered-by']) record('P2', 'headers', '/', 'Server leaks the framework via x-powered-by', expected['x-powered-by']);
  if (!expected['x-content-type-options']) record('P2', 'headers', '/', 'Missing X-Content-Type-Options header');
  if (!expected['x-frame-options']) record('P2', 'headers', '/', 'Missing X-Frame-Options header');
  if (!expected['referrer-policy']) record('P3', 'headers', '/', 'Missing Referrer-Policy header');
  if (!expected['permissions-policy']) record('P3', 'headers', '/', 'Missing Permissions-Policy header');
  if (!expected['strict-transport-security']) record('P2', 'headers', '/', 'Missing Strict-Transport-Security header');
  if (!csp) {
    record('P1', 'headers', '/', 'Missing Content-Security-Policy header');
  } else {
    if (!/frame-src[^;]*https:\/\/www\.google\.com/.test(csp)) record('P1', 'headers', '/', 'CSP frame-src does not allow the Google Maps embed', csp);
    if (!/frame-ancestors/.test(csp)) record('P2', 'headers', '/', 'CSP is missing frame-ancestors');
    if (!/object-src 'none'/.test(csp)) record('P2', 'headers', '/', 'CSP is missing object-src none');
  }
} catch (error) {
  record('P2', 'headers', '/', 'Could not read response headers', error.message);
}

await browser.close();

const severityCount = (s) => issues.filter((i) => i.severity === s).length;
const summary = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  routesAudited: pageResults.length,
  staticRoutesDiscovered: staticRoutes.length,
  invalidRoutesTested: invalidResults.length,
  linksChecked: linkStatuses.length,
  issueCount: issues.length,
  P0: severityCount('P0'),
  P1: severityCount('P1'),
  P2: severityCount('P2'),
  P3: severityCount('P3'),
  interactionsFailed: interactions.filter((i) => !i.passed).length,
};

await mkdir(path.dirname(path.join(root, outputPath)), { recursive: true });
await writeFile(path.join(root, outputPath), `${JSON.stringify({ summary, issues, interactions, invalidResults, pages: pageResults, links: linkStatuses, responsiveFindings, localeFindings, headerResults }, null, 2)}\n`);
console.log(`\n${JSON.stringify(summary, null, 2)}`);
console.log(`Report written to ${outputPath}`);
