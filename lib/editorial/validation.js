import { editorialRecords } from './records';

export function validateEditorialRecords(records = editorialRecords) {
  const ids = new Set();
  records.forEach((record) => {
    if (ids.has(record.id)) throw new Error(`Duplicate editorial record: ${record.id}`);
    if (!record.slug || !record.title || !record.summary || !record.sourceUrl) throw new Error(`Incomplete editorial record: ${record.id}`);
    if (record.publishStatus === 'published' && record.verification !== 'official_public_source') throw new Error(`Unverified published record: ${record.id}`);
    if (record.eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(record.eventDate)) throw new Error(`Invalid event date: ${record.id}`);
    ids.add(record.id);
  });
  return records;
}
