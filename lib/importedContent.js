import contentInventory from '../data/imports/ecu_official_content.json';
import imageInventory from '../data/imports/ecu_official_image_urls.json';

const requiredContentFields = ['id', 'type', 'title', 'source_url', 'target_route', 'verification', 'editorial_status'];
const requiredImageFields = ['id', 'url', 'source_page', 'usage_rights', 'publish_status'];

function validateRecords(records, requiredFields, label) {
  if (!Array.isArray(records)) throw new Error(`${label} inventory must contain an array`);
  const ids = new Set();
  records.forEach((record) => {
    requiredFields.forEach((field) => {
      if (!record[field]) throw new Error(`${label} record is missing ${field}`);
    });
    if (ids.has(record.id)) throw new Error(`Duplicate ${label} record: ${record.id}`);
    ids.add(record.id);
  });
  return records;
}

export const importedContentRecords = validateRecords(contentInventory.records, requiredContentFields, 'Content');
export const importedImageRecords = validateRecords(imageInventory.images, requiredImageFields, 'Image');
export const publishedContentRecords = importedContentRecords.filter((record) => record.editorial_status === 'approved');
export const reviewContentRecords = importedContentRecords.filter((record) => record.editorial_status !== 'approved');
export const publishableImageRecords = importedImageRecords.filter((record) => record.publish_status === 'approved' && record.usage_rights === 'approved');
export const approvalPendingImageRecords = importedImageRecords.filter((record) => !publishableImageRecords.includes(record));

export function getImportedRecord(id) {
  return importedContentRecords.find((record) => record.id === id);
}

export function getAdmissionRecords() {
  return importedContentRecords.filter((record) => record.type === 'admissions');
}
