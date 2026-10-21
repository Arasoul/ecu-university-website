import { mkdir, writeFile } from 'node:fs/promises';
import dataset from '../data/content/milestone-6-enrichment.json' with { type: 'json' };
import facultyDataset from '../data/imports/ecu_verified_content_2026-10-21.json' with { type: 'json' };

const counts = {
  facultiesAudited: facultyDataset.faculties.length,
  newPublishedActivities: dataset.publishedActivities.filter((record) => record.publishStatus === 'published').length,
  publishedActivities: 5 + dataset.publishedActivities.filter((record) => record.publishStatus === 'published').length,
  publishedAchievements: dataset.achievementCandidates.filter((record) => record.publishStatus === 'published').length,
  heldAchievementCandidates: dataset.achievementCandidates.filter((record) => record.publishStatus === 'held').length,
  researchRecords: dataset.researchRecords.length,
  facilityRecords: dataset.facilityRecords.length,
  mediaCandidates: 4 + dataset.mediaCandidates.length,
  approvedMedia: dataset.mediaCandidates.filter((record) => record.publishable === true && record.rightsStatus === 'authorized').length,
};
const detailedFacultyIds = new Set(facultyDataset.facultyDetails.map((faculty) => faculty.facultyId));

const report = {
  generatedOn: '2026-10-21',
  branch: 'milestone-6-content-enrichment',
  before: {
    publishedNews: 2,
    historicalActivities: 5,
    publishedAchievements: 0,
    researchRecords: 0,
    verifiedFacilities: 0,
    mediaCandidates: 4,
  },
  after: counts,
  sourceCount: dataset.sourceRegistry.length,
  coverageGaps: dataset.coverageGaps,
  facultyCoverage: facultyDataset.faculties.map((faculty) => ({
    id: faculty.id,
    name: faculty.title,
    status: detailedFacultyIds.has(faculty.id) ? 'detailed' : 'directory-only',
    missing: detailedFacultyIds.has(faculty.id) ? ['leadership', 'approved contact'] : ['overview', 'leadership', 'departments', 'programmes', 'research', 'contact'],
  })),
};

const markdown = `# ECU Milestone 6 Content Coverage\n\nGenerated: ${report.generatedOn}\n\n## Before and after\n\n| Category | Before | After |\n|---|---:|---:|\n| Faculties audited | 0 | ${counts.facultiesAudited} |\n| Published activities | ${report.before.historicalActivities} | ${counts.publishedActivities} |\n| Published achievements | ${report.before.publishedAchievements} | ${counts.publishedAchievements} |\n| Held achievement candidates | 0 | ${counts.heldAchievementCandidates} |\n| Research records | ${report.before.researchRecords} | ${counts.researchRecords} |\n| Verified facilities | ${report.before.verifiedFacilities} | ${counts.facilityRecords} |\n| Media candidates | ${report.before.mediaCandidates} | ${counts.mediaCandidates} |\n| Approved/publishable images | 0 | ${counts.approvedMedia} |\n\n## Faculty coverage\n\n${report.facultyCoverage.map((faculty) => `- **${faculty.name}**: ${faculty.status}${faculty.missing.length ? ` — missing ${faculty.missing.join(', ')}` : ''}`).join('\\n')}\n\n## Held or incomplete research leads\n\n${dataset.coverageGaps.map((gap) => `- **${gap.category} / ${gap.scope}**: ${gap.status}; missing ${gap.missing.join(', ')}`).join('\\n')}\n\nAll media candidates remain unpublished until written authorization is recorded. New editorial translations remain provisional pending ECU review.\n`;

await mkdir(new URL('../reports/', import.meta.url), { recursive: true });
await writeFile(new URL('../reports/content-coverage.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(new URL('../reports/content-coverage.md', import.meta.url), markdown.replace(/\\n/g, '\n'));
console.log(`Generated coverage report for ${counts.facultiesAudited} faculties and ${dataset.sourceRegistry.length} sources.`);
