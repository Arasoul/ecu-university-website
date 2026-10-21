export const publicStatuses = new Set(['approved', 'published', 'official_public_source']);

export function isPublicRecord(record) {
  if (!record || record.publishStatus === 'unpublished' || record.imageAuthorization === 'do_not_publish_until_authorized') return false;
  return !record.editorialStatus || publicStatuses.has(record.editorialStatus) || publicStatuses.has(record.verification);
}

export function contentMetadata(record) {
  return {
    source: record.sourceUrls || [],
    verifiedOn: record.verifiedOn || null,
    editorialStatus: record.editorialStatus || 'review_required',
    publishStatus: record.publishStatus || 'unpublished',
    locale: record.locale || 'en',
  };
}
