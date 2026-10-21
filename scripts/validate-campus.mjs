import { readFile } from 'node:fs/promises';

const dataset = JSON.parse(await readFile(new URL('../data/imports/ecu_verified_content_2026-10-21.json', import.meta.url)));
const activities = dataset.archivedStories.filter((record) => record.kind === 'archived-activity');
const locations = [
  { name: 'Heliopolis Branch', address: 'Gesr ElSuez St., behind Tagneed Bridge, Cairo, Egypt.' },
  { name: 'Nasr City Branch', address: 'Al Hay Al Asher, Nasr City, Cairo, Egypt.' },
];
if (activities.some((record) => !/^\d{4}-\d{2}-\d{2}$/.test(record.eventDate || ''))) throw new Error('Campus activity without a valid occurrence date');
if (locations.some((location) => !location.name || !location.address)) throw new Error('Incomplete campus location');
if (dataset.mediaCandidates.some((record) => record.publish || record.rights !== 'unverified')) throw new Error('Campus media authorization boundary violated');
console.log(`Validated ${activities.length} campus activities, ${locations.length} locations, and ${dataset.mediaCandidates.length} unauthorized media candidates.`);
