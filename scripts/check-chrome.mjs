import { chromium } from 'playwright';

const base = (process.argv.find((arg) => arg.startsWith('--base=')) || '--base=http://127.0.0.1:3100').split('=')[1].replace(/\/$/, '');
const routes = [
  '/', '/about', '/achievements', '/admissions', '/campus-life', '/campus-life/activities',
  '/campus-life/facilities', '/campus-life/gallery', '/campus-life/visit', '/contact', '/events',
  '/faculties', '/news', '/news-events', '/programmes', '/research', '/search', '/services',
  '/faculties/computers-and-information-systems', '/news/news-pharmacists-2024',
  '/events/activity-media-quality-day', '/programmes/computers-and-information-systems',
  '/not-a-real-page',
];

const browser = await chromium.launch({ headless: true, channel: 'msedge' }).catch(() => chromium.launch({ headless: true }));
const context = await browser.newContext();
const page = await context.newPage();

for (const route of routes) {
  await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const info = await page.evaluate(() => ({
    footer: !!document.querySelector('footer'),
    nav: !!document.querySelector('nav'),
    h1: document.querySelectorAll('h1').length,
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
  }));
  const flags = Object.entries(info).filter(([k, v]) => (k === 'footer' || k === 'nav' ? !v : v === 0)).map(([k]) => k);
  console.log(`${flags.length ? 'WARN' : ' ok '} ${route} ${JSON.stringify(info)}`);
}

await browser.close();
