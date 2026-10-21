import Link from 'next/link';
import { formatEditorialDate } from '../lib/editorial/records';

export default function EditorialDetail({ record, backHref, backLabel = 'Back to archive' }) {
  const facultyHref = record.facultyId ? `/faculties/${record.facultyId.replace(/^faculty-/, '')}` : null;
  return <article className="editorial-detail wrap"><Link className="breadcrumb" href={backHref}>{backLabel}</Link><p className="eyebrow">{record.category}</p><h1>{record.title}</h1><div className="editorial-detail-meta"><time dateTime={record.publicationDate || record.eventDate || undefined}>{formatEditorialDate(record.publicationDate || record.eventDate)}</time>{record.facultyName ? facultyHref ? <Link href={facultyHref}>{record.facultyName}</Link> : <span>{record.facultyName}</span> : null}</div><p className="editorial-detail-lead">{record.summary}</p><div className="source-panel"><p className="eyebrow">EDITORIAL STATUS</p><p>This is a concise source-backed summary, not a reproduced article. The record was verified from ECU’s public source and remains in English.</p><a className="button" href={record.sourceUrl} target="_blank" rel="noreferrer">Open original ECU source -&gt;</a></div></article>;
}
