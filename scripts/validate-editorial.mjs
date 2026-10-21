import { readFile } from 'node:fs/promises';

const dataset = JSON.parse(await readFile(new URL('../data/imports/ecu_verified_content_2026-10-21.json', import.meta.url)));
const stories = dataset.archivedStories;
const ids = new Set();
for (const record of stories) {
  if (ids.has(record.id)) throw new Error(`Duplicate story id: ${record.id}`);
  if (!record.title || !record.summary || !record.sourceUrls?.length) throw new Error(`Incomplete story: ${record.id}`);
  if (record.eventDate && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(record.eventDate)) throw new Error(`Invalid event date: ${record.id}`);
  if (record.kind === 'archived-news' && !/^\d{4}-\d{2}-\d{2}$/.test(record.publishDate || '')) throw new Error(`News needs publication date: ${record.id}`);
  ids.add(record.id);
}
if (dataset.mediaCandidates.some((record) => record.publish)) throw new Error('Unapproved media marked publishable');
console.log(`Validated ${stories.length} editorial source records and ${dataset.mediaCandidates.length} media candidates.`);
