'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { searchRecords, searchIndex } from '../lib/searchIndex';

const types = ['all', ...new Set(searchIndex.map((record) => record.type))];

export default function UniversitySearch() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const results = useMemo(() => searchRecords(query, type), [query, type]);

  return <div className="university-search">
    <div className="search-controls"><label htmlFor="site-search">Search ECU</label><input id="site-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try faculty, programme or admissions" autoFocus /><label htmlFor="search-type">Content type</label><select id="search-type" value={type} onChange={(event) => setType(event.target.value)}>{types.map((item) => <option value={item} key={item}>{item === 'all' ? 'All content' : item}</option>)}</select></div>
    <p className="search-status" aria-live="polite">{query ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Search verified ECU content by title, description or keyword.'}</p>
    {query && !results.length ? <div className="search-empty"><h2>No verified results found</h2><p>Try a faculty, programme, certificate type or university topic.</p></div> : null}
    <div className="search-results">{results.map((result) => <article className="search-result" key={result.id}><span>{result.type}</span><h2><Link href={result.href}>{result.title}</Link></h2><p>{result.summary}</p>{result.sourceUrl ? <a href={result.sourceUrl} target="_blank" rel="noreferrer">Official source -&gt;</a> : null}</article>)}</div>
  </div>;
}
