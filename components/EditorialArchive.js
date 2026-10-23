'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { formatEditorialDate } from '../lib/editorial/records';

export default function EditorialArchive({ records, detailPath, emptyMessage = 'No records match these filters.' }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [faculty, setFaculty] = useState('all');
  const categories = [...new Set(records.map((record) => record.category).filter(Boolean))];
  const faculties = [...new Map(records.filter((record) => record.facultyId).map((record) => [record.facultyId, record.facultyName])).entries()];
  const filtered = useMemo(() => records.filter((record) => {
    const haystack = `${record.title} ${record.summary} ${record.facultyName || ''}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (category === 'all' || record.category === category) && (faculty === 'all' || record.facultyId === faculty);
  }), [category, faculty, query, records]);
  const detailHref = (record) => (detailPath ? `${detailPath}/${record.slug}` : null);
  return <div className="editorial-archive">
    <div className="archive-controls"><label>Search<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search verified records" /></label><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Faculty<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option value="all">All faculties</option>{faculties.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label></div>
    <p className="archive-status" aria-live="polite">{filtered.length} verified record{filtered.length === 1 ? '' : 's'}</p>
    {filtered.length ? <div className="editorial-grid">{filtered.map((record) => { const href = detailHref(record); const date = record.publicationDate || record.eventDate; return <article className="editorial-card" key={record.id}>{record.imagePath ? <Image className="editorial-card-image" src={record.imagePath} alt={record.imageAlt} width={800} height={600} sizes="(max-width: 700px) 100vw, 33vw" /> : null}<div className="editorial-card-top"><span>{record.category}</span><time dateTime={date || undefined}>{formatEditorialDate(date)}</time></div><h2>{href ? <Link href={href}>{record.title}</Link> : record.title}</h2><p>{record.summary}</p>{record.facultyName ? <strong>{record.facultyName}</strong> : null}{href ? <Link className="text-link" href={href}>Read source-backed summary -&gt;</Link> : null}</article>; })}</div> : <div className="archive-empty">{emptyMessage}</div>}
  </div>;
}
