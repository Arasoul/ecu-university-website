import { facultyDirectory } from './faculties';
import { programmeDirectory } from './programmes';
import { verifiedAdmissions, verifiedStories, verifiedUniversity } from './verifiedContent';
import { editorialRecords } from './editorial/records';

const source = (record) => record.sourceUrls?.[0] || record.source_url;
const services = [
  ['service-about', 'About ECU', 'University profile, mission, vision and campus information.', '/about'],
  ['service-faculties', 'Faculties', 'Browse the ECU faculty directory.', '/faculties'],
  ['service-programmes', 'Academic programmes', 'Search verified ECU programme areas.', '/programmes'],
  ['service-admissions', 'Admissions guidance', 'Review certificate pathways and preparation guidance.', '/admissions'],
  ['service-research', 'Research', 'Explore ECU research objectives and activities.', '/research'],
  ['service-contact', 'Contact ECU', 'Find campus and contact information.', '/contact'],
].map(([id, title, summary, href]) => ({ id, type: 'Service', title, summary, href, keywords: `${title} ${summary}`.toLowerCase() }));

const rawSearchIndex = [
  ...facultyDirectory.map((faculty) => ({
    id: `faculty-${faculty.slug}`,
    type: 'Faculty',
    title: faculty.name,
    summary: faculty.summary || 'Explore the faculty profile and official ECU source.',
    href: `/faculties/${faculty.slug}`,
    keywords: faculty.name.toLowerCase(),
  })),
  ...programmeDirectory.map((programme) => ({
    id: `programme-${programme.id}`,
    type: 'Programme',
    title: programme.name,
    summary: programme.summary || `Study area in ${programme.faculty}.`,
    href: `/programmes/${programme.slug}`,
    keywords: `${programme.faculty} ${programme.name}`.toLowerCase(),
  })),
  ...verifiedUniversity.map((record) => ({
    id: record.id,
    type: 'University',
    title: record.title,
    summary: record.summary,
    href: record.targetRoute || '/about',
    sourceUrl: source(record),
    keywords: `${record.title} ${record.summary}`.toLowerCase(),
  })),
  ...verifiedAdmissions.map((record) => ({
    id: record.id,
    type: 'Admissions',
    title: record.title,
    summary: record.summary,
    href: '/admissions',
    sourceUrl: source(record),
    keywords: `${record.title} ${record.summary}`.toLowerCase(),
  })),
  ...verifiedStories.filter((record) => record.publishDate || record.eventDate).map((record) => ({
    id: record.id,
    type: record.kind === 'archived-news' ? 'News' : 'Activity',
    title: record.title,
    summary: record.summary,
    href: '/news-events',
    sourceUrl: source(record),
    keywords: `${record.title} ${record.summary}`.toLowerCase(),
  })),
  ...services,
  ...editorialRecords.map((record) => ({
    id: `editorial-${record.id}`,
    type: record.type === 'news' ? 'News' : record.type === 'event' ? 'Activity' : 'Gallery',
    title: record.title,
    summary: record.summary,
    href: record.type === 'news' ? `/news/${record.slug}` : record.type === 'event' ? `/events/${record.slug}` : '/news-events',
    keywords: `${record.title} ${record.summary} ${record.facultyName || ''}`.toLowerCase(),
  })),
];

export const searchIndex = [...new Map(rawSearchIndex.map((record) => [record.id, record])).values()];

export function searchRecords(query, type = 'all') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return searchIndex
    .filter((record) => type === 'all' || record.type === type)
    .map((record) => {
      const title = record.title.toLowerCase();
      const keywords = record.keywords || '';
      const score = title === normalized ? 100 : title.startsWith(normalized) ? 60 : title.includes(normalized) ? 40 : keywords.includes(normalized) ? 20 : 0;
      return { ...record, score };
    })
    .filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
