import { campusActivities, campusFacilities, campusGalleries, campusLocationRecords, practicalLearning } from './records';

export function validateCampusRecords() {
  const records = [...campusActivities, ...practicalLearning, ...campusFacilities, ...campusGalleries, ...campusLocationRecords];
  const ids = new Set();
  records.forEach((record) => {
    if (ids.has(record.id)) throw new Error(`Duplicate campus record: ${record.id}`);
    if (!record.title && !record.name) throw new Error(`Campus record needs a title: ${record.id}`);
    if (!record.sourceUrl && !record.sourceUrls?.length) throw new Error(`Campus record needs a source: ${record.id}`);
    ids.add(record.id);
  });
  if (campusGalleries.some((record) => record.publishableMedia)) throw new Error('Unauthorized campus media is publishable');
  return { activities: campusActivities.length, learning: practicalLearning.length, facilities: campusFacilities.length, galleries: campusGalleries.length, locations: campusLocationRecords.length };
}
