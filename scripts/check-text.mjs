import { chromium } from 'playwright';

const base = (process.argv.find((arg) => arg.startsWith('--base=')) || '--base=http://127.0.0.1:3100').split('=')[1].replace(/\/$/, '');
const route = process.argv.find((arg) => arg.startsWith('--route='))?.split('=')[1] || '/about';

const browser = await chromium.launch({ headless: true, channel: 'msedge' }).catch(() => chromium.launch({ headless: true }));
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
const text = await page.evaluate(() => document.body.innerText);
text.split('\n').forEach((line, index) => {
  if (/typeerror|cannot read|undefined/i.test(line)) console.log(`line ${index}: ${line}`);
});
console.log('--- total lines', text.split('\n').length);
await browser.close();
