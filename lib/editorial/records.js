import dataset from '../../data/imports/ecu_verified_content_2026-10-21.json';
import { facultyDirectory } from '../faculties';
import { enrichmentActivities } from '../contentEnrichment';

const facultyName = (id) => facultyDirectory.find((faculty) => faculty.id === id)?.name || null;
const source = (record) => record.sourceUrls?.[0] || null;
const validDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const recordMedia = {
  'news-shanghai-2024': {
    imagePath: '/images/ecu/editorial/international-students-shanghai.jpg',
    imageAlt: 'ECU students connected with Shanghai University gathered in an academic hall',
  },
  'news-pharmacists-2024': {
    imagePath: '/images/ecu/editorial/pharmacy-syndicate-cooperation.jpeg',
    imageAlt: 'ECU and Cairo Pharmacists Syndicate representatives signing a cooperation protocol',
  },
};

const base = (record, type, category) => ({
  id: record.id,
  slug: record.id,
  type,
  title: record.title,
  summary: record.summary,
  category,
  facultyId: record.facultyId || null,
  facultyName: facultyName(record.facultyId),
  publicationDate: validDate(record.publishDate) ? record.publishDate : null,
  eventDate: validDate(record.eventDate) ? record.eventDate : null,
  sourceUrl: source(record),
  verification: record.verification,
  editorialStatus: 'reviewed-source-summary',
  publishStatus: 'published',
  locale: 'en',
  imageAuthorization: 'unverified',
  ...recordMedia[record.id],
});

export const newsRecords = dataset.archivedStories
  .filter((record) => record.kind === 'archived-news' && validDate(record.publishDate))
  .map((record) => base(record, 'news', 'University news'));

export const eventRecords = dataset.archivedStories
  .filter((record) => record.kind === 'archived-activity' && validDate(record.eventDate))
  .map((record) => base(record, 'event', 'Historical activity'))
  .concat(enrichmentActivities.map((record) => ({
    ...record,
    type: 'event',
    slug: record.slug || record.id,
    publicationDate: null,
    locale: 'en',
  })));

export const galleryRecords = dataset.archivedStories
  .filter((record) => record.kind === 'gallery-entry')
  .map((record) => base(record, 'gallery', 'Official gallery record'));

export const achievementRecords = [];

export const editorialRecords = [...newsRecords, ...eventRecords, ...galleryRecords];

export const getNews = (slug) => newsRecords.find((record) => record.slug === slug);
export const getEvent = (slug) => eventRecords.find((record) => record.slug === slug);
export const getAchievement = (slug) => achievementRecords.find((record) => record.slug === slug);

export function isUpcoming(record, now = new Date()) {
  return Boolean(record.eventDate && new Date(`${record.eventDate}T23:59:59Z`) >= now);
}

export function formatEditorialDate(value, locale = 'en') {
  if (!value) return 'Date not published';
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-Hans' : locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
}
