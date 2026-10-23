import { chromium } from 'playwright';

const base = (process.argv.find((arg) => arg.startsWith('--base=')) || '--base=http://127.0.0.1:3100').split('=')[1].replace(/\/$/, '');
const routes = (process.argv.find((arg) => arg.startsWith('--routes='))?.split('=')[1] || '/campus-life/facilities,/news-events,/achievements,/campus-life').split(',');

const browser = await chromium.launch({ headless: true, channel: 'msedge' }).catch(() => chromium.launch({ headless: true }));
const context = await browser.newContext();
const page = await context.newPage();

for (const route of routes) {
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
  const info = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('section')].map((section) => ({
      id: section.id || null,
      className: section.className,
      headings: [...section.querySelectorAll('h1,h2,h3')].map((h) => h.textContent.trim()).slice(0, 3),
      textLength: section.innerText.trim().length,
    }));
    return { title: document.title, sections, bodyLength: document.body.innerText.trim().length };
  });
  console.log(`\n===== ${route} :: ${info.title} (${info.bodyLength} chars)`);
  for (const section of info.sections) {
    console.log(`  - [${section.className}] h: ${section.headings.join(' | ')} (${section.textLength} chars)`);
  }
}

await browser.close();
