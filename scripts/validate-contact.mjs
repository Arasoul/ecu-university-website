import { campusContactRecords, verifiedContactChannels } from '../lib/campus/contact.js';

if (campusContactRecords.length !== 2) throw new Error('Expected exactly two verified campus branches');
if (verifiedContactChannels.hotline !== '19346') throw new Error('Unexpected hotline value');

for (const branch of campusContactRecords) {
  if (!branch.id || !branch.address || !branch.sourceUrl || !branch.verifiedOn) throw new Error(`Incomplete campus record: ${branch.id}`);
  if (!branch.mapsSearchUrl.includes('google.com/maps/search')) throw new Error(`Missing map search URL: ${branch.id}`);
  if (!branch.directionsUrl.includes('google.com/maps/dir')) throw new Error(`Missing directions URL: ${branch.id}`);
  if (branch.faculties.length === 0) throw new Error(`Campus has no faculty associations: ${branch.id}`);
  if (branch.media.publishable) throw new Error(`Unverified campus media is publishable: ${branch.id}`);
}

console.log(`Validated ${campusContactRecords.length} campus contact records, ${campusContactRecords.reduce((count, branch) => count + branch.faculties.length, 0)} faculty associations, and unverified media boundaries.`);
