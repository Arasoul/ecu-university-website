'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';

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
  return <div className="editorial-archive">
    <div className="archive-controls"><label>Search<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search verified records" /></label><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Faculty<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option value="all">All faculties</option>{faculties.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label></div>
    <p className="archive-status" aria-live="polite">{filtered.length} verified record{filtered.length === 1 ? '' : 's'}</p>
    {filtered.length ? <div className="editorial-grid">{filtered.map((record) => <article className="editorial-card" key={record.id}>{record.imagePath ? <Image className="editorial-card-image" src={record.imagePath} alt={record.imageAlt} width={800} height={600} sizes="(max-width: 700px) 100vw, 33vw" /> : null}<div className="editorial-card-top"><span>{record.category}</span><time dateTime={record.publicationDate || record.eventDate || undefined}>{record.publicationDate || record.eventDate || 'Date not published'}</time></div><h2><Link href={`${detailPath}/${record.slug}`}>{record.title}</Link></h2><p>{record.summary}</p>{record.facultyName ? <strong>{record.facultyName}</strong> : null}<Link className="text-link" href={`${detailPath}/${record.slug}`}>Read source-backed summary -&gt;</Link></article>)}</div> : <div className="archive-empty">{emptyMessage}</div>}
  </div>;
}
