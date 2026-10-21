import { campusContactRecords } from './contact';
import { eventRecords, galleryRecords } from '../editorial/records';
import { verifiedLearningRecords } from '../verifiedContent';
import { facultyDirectory } from '../faculties';

const facultyName = (id) => facultyDirectory.find((faculty) => faculty.id === id)?.name || null;

export const campusActivities = eventRecords.map((record) => ({
  ...record,
  campusCategory: record.title.toLowerCase().includes('workshop') ? 'Workshops' : record.title.toLowerCase().includes('visit') ? 'Industry and academic visits' : 'Student activities',
  canonicalHref: `/events/${record.slug}`,
}));

export const practicalLearning = verifiedLearningRecords.map((record) => ({
  id: record.id,
  title: record.title,
  summary: record.summary,
  facultyId: record.facultyId,
  facultyName: facultyName(record.facultyId),
  sourceUrl: record.sourceUrls?.[0],
  verification: record.verification,
  category: 'Practical learning',
}));

export const campusFacilities = [];
export const campusGalleries = galleryRecords.map((record) => ({
  ...record,
  rights: 'unverified',
  publishableMedia: false,
  caption: record.summary,
}));
export const campusLocationRecords = campusContactRecords.map((location) => ({
  ...location,
  sourceUrl: location.sourceUrl,
}));
