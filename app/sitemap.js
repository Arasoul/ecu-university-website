import { facultyDirectory } from '../lib/faculties';
import { programmeDirectory } from '../lib/programmes';
import { eventRecords, newsRecords, undatedActivityRecords } from '../lib/editorial/records';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecu-university-website.vercel.app';
const locales = ['en', 'ar', 'zh'];
const localeAlternates = { en: 'en', ar: 'ar', zh: 'zh-Hans' };

const staticRoutes = [
  '/',
  '/about',
  '/achievements',
  '/admissions',
  '/campus-life',
  '/campus-life/activities',
  '/campus-life/facilities',
  '/campus-life/gallery',
  '/campus-life/visit',
  '/contact',
  '/events',
  '/faculties',
  '/news',
  '/news-events',
  '/programmes',
  '/research',
  '/search',
  '/services',
];

export default function sitemap() {
  const dynamicRoutes = [
    ...facultyDirectory.map((faculty) => `/faculties/${faculty.slug}`),
    ...programmeDirectory.map((programme) => `/programmes/${programme.slug}`),
    ...newsRecords.map((record) => `/news/${record.slug}`),
    ...[...eventRecords, ...undatedActivityRecords].map((record) => `/events/${record.slug}`),
  ];

  // The canonical URL of every page is locale prefixed, so the sitemap lists the
  // locale prefixed variants directly and links the alternates with hreflang.
  const entries = [...staticRoutes, ...dynamicRoutes].flatMap((route) => locales.map((locale) => ({
    url: `${baseUrl}/${locale}${route === '/' ? '' : route}`,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.startsWith('/faculties') || route.startsWith('/programmes') ? 0.8 : 0.6,
    alternates: {
      languages: Object.fromEntries(locales.map((entryLocale) => [localeAlternates[entryLocale], `${baseUrl}/${entryLocale}${route === '/' ? '' : route}`])),
    },
  })));

  return entries;
}
