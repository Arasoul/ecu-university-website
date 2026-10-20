'use client';

import { useMemo, useState } from 'react';
import FacultyCard from './FacultyCard';

export default function FacultyDirectory({ faculties }) {
  const [query, setQuery] = useState('');
  const filteredFaculties = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return faculties;
    return faculties.filter((faculty) => `${faculty.name} ${faculty.summary || ''}`.toLowerCase().includes(normalized));
  }, [faculties, query]);

  return <div className="faculty-directory-tools">
    <div className="directory-search">
      <label htmlFor="faculty-search">Search faculties</label>
      <input id="faculty-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by faculty name" />
      {query && <button type="button" onClick={() => setQuery('')}>Clear</button>}
    </div>
    <p className="result-count" aria-live="polite">{filteredFaculties.length} of {faculties.length} faculties</p>
    {filteredFaculties.length ? <div className="directory-grid">{filteredFaculties.map((faculty, index) => <FacultyCard key={faculty.slug} faculty={faculty} index={index} />)}</div> : <div className="directory-empty"><strong>No faculties match that search.</strong><button type="button" onClick={() => setQuery('')}>Reset search</button></div>}
  </div>;
}
