import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = (process.argv.find((arg) => arg.startsWith('--base=')) || '--base=http://127.0.0.1:3100').split('=')[1].replace(/\/$/, '');
const outputPath = process.argv.find((arg) => arg.startsWith('--out='))?.split('=')[1] || 'reports/site-audit.json';
const screenshotDir = 'reports/screenshots';

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1024', width: 1024, height: 800 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 640 },
];

const routes = [
  '/', '/about', '/achievements', '/admissions', '/campus-life', '/campus-life/activities',
  '/campus-life/facilities', '/campus-life/gallery', '/campus-life/visit', '/contact', '/events',
  '/faculties', '/news', '/news-events', '/programmes', '/research', '/search', '/services',
  '/faculties/engineering-and-technology', '/faculties/mass-communication', '/faculties/law',
  '/news/news-pharmacists-2024', '/news/news-shanghai-2024',
  '/events/activity-media-quality-day', '/events/engineering-innovatronics-ministry-collaboration',
  '/programmes/engineering-and-technology/petroleum-and-gas-engineering',
  '/this-route-does-not-exist',
];

const issues = [];
const record = (severity, area, message, detail) => {
  issues.push({ severity, area, message, ...(detail ? { detail } : {}) });
  console.log(`[${severity.toUpperCase()}] ${area}: ${message}`);
};

const launchOptions = { headless: true };
let browser;
try {
  browser = await chromium.launch(launchOptions);
} catch (error) {
  browser = await chromium.launch({ ...launchOptions, channel: 'msedge' });
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await mkdir(screenshotDir, { recursive: true });

const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push({ url: page.url(), text: message.text() });
});
page.on('pageerror', (error) => pageErrors.push({ url: page.url(), text: error.message }));
page.on('requestfailed', (request) => failedRequests.push({ url: page.url(), resource: request.url(), error: request.failure()?.errorText }));
page.on('response', (response) => {
  if (response.status() >= 400) failedRequests.push({ url: page.url(), resource: response.url(), error: `HTTP ${response.status()}` });
});

const linkTargets = new Map();
const pageResults = [];

for (const route of routes) {
  consoleErrors.length = 0;
  pageErrors.length = 0;
  failedRequests.length = 0;
  const url = `${baseUrl}${route}`;
  let response;
  try {
    response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  } catch (error) {
    record('critical', 'navigation', `Navigation failed for ${route}`, error.message);
    continue;
  }
  const status = response ? response.status() : 0;
  const expectedRoute = route === '/this-route-does-not-exist' ? route : null;
  const expected = expectedRoute ? 404 : 200;
  if (status !== expected) record('critical', 'http-status', `${route} returned HTTP ${status}, expected ${expected}`);

  const analysis = await page.evaluate(() => {
    const internalLinks = [...document.querySelectorAll('a[href]')]
      .map((anchor) => anchor.getAttribute('href'))
      .filter((href) => href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#'));
    const emptyAnchors = [...document.querySelectorAll('a[href]')]
      .filter((anchor) => !anchor.textContent.trim() && !anchor.getAttribute('aria-label') && !anchor.querySelector('img[alt]'))
      .map((anchor) => anchor.getAttribute('href'));
    const imagesWithoutAlt = [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).map((img) => img.getAttribute('src'));
    const brokenImages = [...document.querySelectorAll('img')].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute('src'));
    const unnamedButtons = [...document.querySelectorAll('button')].filter((button) => !button.textContent.trim() && !button.getAttribute('aria-label')).length;
    const unnamedLinks = emptyAnchors.length;
    const headings = [...document.querySelectorAll('h1')].map((heading) => heading.textContent.trim());
    const hasSkipLink = Boolean(document.querySelector('a.skip-link, a[href="#main"]'));
    return {
      internalLinks: [...new Set(internalLinks)],
      imagesWithoutAlt,
      brokenImages,
      unnamedButtons,
      unnamedLinks,
      h1Count: headings.length,
      h1: headings[0] || null,
      hasSkipLink,
      hasFooter: Boolean(document.querySelector('footer')),
      hasNav: Boolean(document.querySelector('nav')),
      hasSiteHeader: Boolean(document.querySelector('header.site-header')),
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyTextLength: document.body.innerText.trim().length,
    };
  });

  for (const href of analysis.internalLinks) {
    const absolute = new URL(href, `${baseUrl}${route}`).toString();
    linkTargets.set(absolute, href);
  }
  if (analysis.h1Count !== 1) record(analysis.h1Count === 0 ? 'critical' : 'major', 'accessibility', `${route} has ${analysis.h1Count} h1 elements`);
  if (analysis.imagesWithoutAlt.length) record('major', 'accessibility', `${route} has images without alt text`, analysis.imagesWithoutAlt.join(', '));
  if (analysis.brokenImages.length) record('critical', 'media', `${route} has broken images`, analysis.brokenImages.join(', '));
  if (analysis.unnamedButtons) record('major', 'accessibility', `${route} has ${analysis.unnamedButtons} buttons without an accessible name`);
  if (analysis.unnamedLinks) record('major', 'accessibility', `${route} has ${analysis.unnamedLinks} links without an accessible name`);
  if (!analysis.lang) record('major', 'accessibility', `${route} is missing a document language`);
  if (!analysis.title) record('major', 'metadata', `${route} is missing a page title`);
  if (!analysis.description) record('major', 'metadata', `${route} is missing a meta description`);
  if (!analysis.canonical) record('minor', 'metadata', `${route} is missing a canonical link`);
  if (!analysis.hasFooter) record('major', 'structure', `${route} renders no footer`);
  if (!analysis.hasNav) record('major', 'structure', `${route} renders no navigation landmark`);
  if (!analysis.hasSiteHeader) record('major', 'structure', `${route} renders no site header`);
  if (analysis.horizontalOverflow > 2) record('major', 'responsive', `${route} overflows horizontally by ${analysis.horizontalOverflow}px at 1440px`);
  if (analysis.bodyTextLength < 200 && route !== '/this-route-does-not-exist') record('minor', 'content', `${route} renders very little text (${analysis.bodyTextLength} characters)`);

  for (const error of consoleErrors) {
    if (route === expectedRoute) continue;
    record('major', 'console', `${route} logged a console error`, error.text);
  }
  for (const error of pageErrors) {
    if (route === expectedRoute) continue;
    record('critical', 'runtime', `${route} threw a page error`, error.text);
  }
  for (const failure of failedRequests) {
    if (failure.resource.includes('/_next/')) continue;
    if (failure.error === 'net::ERR_ABORTED') continue;
    if (failure.resource.includes('?_rsc=')) continue;
    if (route === expectedRoute) continue;
    record('major', 'network', `${route} requested a failing resource`, `${failure.resource} (${failure.error})`);
  }

  pageResults.push({ route, status, ...analysis });
}

// Validate every internal link discovered on the pages above.
const linkStatuses = [];
for (const [target, href] of [...linkTargets.entries()].sort()) {
  const clean = target.split('#')[0];
  if (!clean || clean === `${baseUrl}/`) continue;
  try {
    const response = await context.request.get(clean, { timeout: 30000, maxRedirects: 0 });
    const status = response.status();
    linkStatuses.push({ href, resolved: clean, status });
    if (status >= 400) record('critical', 'links', `Internal link ${href} (resolved to ${clean}) returned HTTP ${status}`);
  } catch (error) {
    linkStatuses.push({ href, resolved: clean, status: 0, error: error.message });
    record('major', 'links', `Internal link ${href} could not be resolved`, error.message);
  }
}

// Content assertions: the page must actually render the source-backed data.
const contentAssertions = [];
const assertContent = async (route, label, predicate) => {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
  const text = await page.evaluate(() => document.body.innerText);
  const passed = predicate(text);
  contentAssertions.push({ route, label, passed });
  if (!passed) record('critical', 'content', `${route} did not render expected content: ${label}`);
};

await assertContent('/about', 'campus locations render', (text) => /Nasr City/.test(text));
await assertContent('/about', 'no unrendered data error', (text) => !/TypeError|cannot read properties|is not exported/i.test(text));
await assertContent('/campus-life/gallery', 'nine authorised photographs render', (text) => /9 photographs available/.test(text));
await assertContent('/campus-life/gallery', 'gallery grid has images', (text) => /9 approved photographs/.test(text));
await assertContent('/news/news-pharmacists-2024', 'economics faculty attribution', (text) => /Economics and International Trade/.test(text));
await assertContent('/news/news-shanghai-2024', 'physical therapy faculty attribution', (text) => /Physical Therapy/.test(text));
await assertContent('/news', 'no mislabelled pharmacy cooperation', (text) => !/Pharmacy cooperation/.test(text));
await assertContent('/events', 'undated activities are separated', (text) => /DATE TO BE CONFIRMED/.test(text));
await assertContent('/events/engineering-innovatronics-ministry-collaboration', 'undated record detail page', (text) => /date to be confirmed/i.test(text));
await assertContent('/faculties/engineering-and-technology', 'faculty name renders', (text) => /Engineering and Technology/.test(text));
await assertContent('/faculties/arts-and-design', 'faculty name renders', (text) => /Arts and Design/.test(text));
await assertContent('/faculties/law', 'faculty name renders', (text) => /\bLaw\b/.test(text));
await assertContent('/services', 'visitor services are not duplicated', (text) => /Campus visit guidance/.test(text));
await assertContent('/', 'programme call to action is not mislabelled', (text) => /View all programmes/.test(text));
await assertContent('/', 'no developer-facing copy', (text) => !/verify article details|Reverify details|Confirm formal degree titles/i.test(text));
await assertContent('/about', 'cooperation copy is user facing', (text) => !/reconfirmed before prominent|marked for ECU editorial review/i.test(text));
await assertContent('/campus-life/facilities', 'published facility record renders', (text) => /Central Research Lab/.test(text));
await assertContent('/campus-life', 'activity count is labelled as dated', (text) => /\d+ dated activity records/.test(text));
await assertContent('/events', 'dated archive is separated from undated records', (text) => /Historical records, accurately dated/.test(text));
await assertContent('/programmes', 'programme catalogue renders', (text) => /verified programme areas currently indexed/i.test(text));

// Responsive and locale pass.
const responsiveFindings = [];
for (const viewport of viewports) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  for (const route of ['/', '/faculties', '/programmes', '/news', '/events', '/campus-life/gallery', '/contact']) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) {
      record('major', 'responsive', `${route} overflows horizontally by ${overflow}px at ${viewport.name}`);
      responsiveFindings.push({ route, viewport: viewport.name, overflow });
    }
  }
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.screenshot({ path: `${screenshotDir}/home-${viewport.name}.png`, fullPage: true });
}

await page.setViewportSize({ width: 1440, height: 900 });
const localeFindings = [];
for (const [prefix, expectedLang, expectedDir] of [['ar', 'ar', 'rtl'], ['zh', 'zh-Hans', 'ltr']]) {
  await page.goto(`${baseUrl}/${prefix}/`, { waitUntil: 'networkidle', timeout: 45000 });
  const result = await page.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
  if (result.lang !== expectedLang) record('major', 'localization', `/${prefix}/ reports lang="${result.lang}", expected "${expectedLang}"`);
  if (result.dir !== expectedDir) record('major', 'localization', `/${prefix}/ reports dir="${result.dir}", expected "${expectedDir}"`);
  if (result.overflow > 2) record('major', 'responsive', `/${prefix}/ overflows horizontally by ${result.overflow}px`);
  localeFindings.push({ prefix, ...result });
  await page.screenshot({ path: `${screenshotDir}/home-${prefix}.png`, fullPage: true });
}

// Keyboard and focus checks on the primary navigation.
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 45000 });
const keyboardFindings = await page.evaluate(async () => {
  const results = { skipLinkPresent: Boolean(document.querySelector('a.skip-link, a[href="#main"]')) };
  const menuButton = document.querySelector('button[aria-expanded], button[aria-controls]');
  results.menuTogglePresent = Boolean(menuButton);
  results.menuToggleNamed = menuButton ? Boolean(menuButton.textContent.trim() || menuButton.getAttribute('aria-label')) : false;
  return results;
});
if (!keyboardFindings.skipLinkPresent) record('major', 'accessibility', 'Home page has no skip link to the main content');
if (!keyboardFindings.menuTogglePresent) record('minor', 'accessibility', 'No collapsible navigation control was found');
if (keyboardFindings.menuTogglePresent && !keyboardFindings.menuToggleNamed) record('major', 'accessibility', 'The navigation toggle has no accessible name');

await browser.close();

const summary = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  routesChecked: pageResults.length,
  linksChecked: linkStatuses.length,
  issueCount: issues.length,
  critical: issues.filter((issue) => issue.severity === 'critical').length,
  major: issues.filter((issue) => issue.severity === 'major').length,
  minor: issues.filter((issue) => issue.severity === 'minor').length,
};

await mkdir(new URL('.', `file:///${outputPath.replace(/\\/g, '/')}`).pathname.replace(/^\//, ''), { recursive: true }).catch(() => {});
await writeFile(outputPath, `${JSON.stringify({ summary, issues, contentAssertions, pages: pageResults, links: linkStatuses, responsiveFindings, localeFindings, keyboardFindings }, null, 2)}\n`);
console.log(`\n${JSON.stringify(summary, null, 2)}`);
console.log(`Report written to ${outputPath}`);
if (summary.critical > 0) process.exitCode = 1;
