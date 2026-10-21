import dataset from '../data/content/milestone-6-enrichment.json' with { type: 'json' };

const ids = new Set();
const requiredSource = (record) => record.sourceUrl && dataset.sourceRegistry.some((source) => source.url === record.sourceUrl) || record.sourceUrl;
const records = [
  ...dataset.publishedActivities,
  ...dataset.facultyEnrichment,
  ...dataset.achievementCandidates,
  ...dataset.researchRecords,
  ...dataset.facilityRecords,
  ...dataset.mediaCandidates,
];

for (const record of records) {
  if (!record.id || ids.has(record.id)) throw new Error(`Duplicate or missing enrichment ID: ${record.id}`);
  if (!record.title && !record.name && !record.subject) throw new Error(`Missing enrichment title: ${record.id}`);
  if (!requiredSource(record)) throw new Error(`Missing source URL: ${record.id}`);
  if (record.publishStatus === 'published' && record.verification !== 'official_public_source') throw new Error(`Unverified published enrichment: ${record.id}`);
  if (record.publishable === true && record.rightsStatus !== 'authorized') throw new Error(`Unauthorized publishable media: ${record.id}`);
  if (record.eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(record.eventDate)) throw new Error(`Invalid event date: ${record.id}`);
  ids.add(record.id);
}

if (dataset.achievementCandidates.some((record) => record.publishStatus === 'published')) throw new Error('Held achievement candidates must remain unpublished until evidence is complete');
if (dataset.mediaCandidates.some((record) => record.publishable)) throw new Error('Media candidates must remain unpublished without authorization');

console.log(`Validated ${dataset.sourceRegistry.length} sources, ${dataset.publishedActivities.length} activities, ${dataset.researchRecords.length} research records, ${dataset.facilityRecords.length} facilities, ${dataset.achievementCandidates.length} held achievement candidates, and ${dataset.mediaCandidates.length} media candidates.`);
