import { chromium } from 'playwright';

const base = (process.argv.find((arg) => arg.startsWith('--base=')) || '--base=http://127.0.0.1:3100').split('=')[1].replace(/\/$/, '');
const paths = ['/', '/ar/', '/ar/about', '/zh/about', '/ar/faculties/engineering-and-technology'];

const browser = await chromium.launch({ headless: true, channel: 'msedge' }).catch(() => chromium.launch({ headless: true }));
const context = await browser.newContext();
const page = await context.newPage();

for (const path of paths) {
  const raw = await context.request.get(`${base}${path}`);
  const html = await raw.text();
  const serverLang = html.match(/<html[^>]*lang="([^"]*)"/)?.[1] ?? '?';
  const serverDir = html.match(/<html[^>]*dir="([^"]*)"/)?.[1] ?? '?';
  const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(750);
  const info = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    stored: window.localStorage.getItem('ecu-locale'),
  }));
  console.log(`${path} => HTTP ${response.status()} | server lang=${serverLang} dir=${serverDir} | dom lang=${info.lang} dir=${info.dir} | localStorage=${info.stored}`);
}

await browser.close();
