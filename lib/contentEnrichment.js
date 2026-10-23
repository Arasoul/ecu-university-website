import dataset from '../data/content/milestone-6-enrichment.json';

export const enrichmentDataset = dataset;
export const enrichmentActivities = dataset.publishedActivities;
export const facultyEnrichment = dataset.facultyEnrichment;
export const achievementCandidates = dataset.achievementCandidates;
export const publishedAchievements = dataset.achievementCandidates.filter((record) => record.publishStatus === 'published');
export const researchRecords = dataset.researchRecords;
export const facilityRecords = dataset.facilityRecords;
export const mediaCandidates = dataset.mediaCandidates;
export const sourceRegistry = dataset.sourceRegistry;
export const coverageGaps = dataset.coverageGaps;
