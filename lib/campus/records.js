import { campusContactRecords } from './contact';
import { eventRecords, galleryRecords, undatedActivityRecords } from '../editorial/records';
import { verifiedLearningRecords } from '../verifiedContent';
import { resolveFaculty } from '../faculties';
import { facilityRecords } from '../contentEnrichment';

const facultyRecord = (id) => resolveFaculty(id);

export const campusActivities = [...eventRecords, ...undatedActivityRecords].map((record) => ({
  ...record,
  campusCategory: record.title.toLowerCase().includes('workshop') ? 'Workshops' : record.title.toLowerCase().includes('visit') ? 'Industry and academic visits' : 'Student activities',
  canonicalHref: `/events/${record.slug}`,
}));

export const practicalLearning = verifiedLearningRecords.map((record) => {
  const faculty = facultyRecord(record.facultyId);
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
    facultyId: faculty ? faculty.id : null,
    facultySlug: faculty ? faculty.slug : null,
    facultyName: faculty ? faculty.name : null,
    sourceUrl: record.sourceUrls?.[0],
    verification: record.verification,
    category: 'Practical learning',
  };
});

export const campusFacilities = facilityRecords
  .filter((record) => record.publishStatus === 'published')
  .map((record) => ({
    id: record.id,
    title: record.name,
    summary: record.description,
    campus: record.campus,
    sourceUrl: record.sourceUrl,
    verification: record.verification,
    mediaStatus: record.mediaStatus,
    category: 'Published facility record',
  }));
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
