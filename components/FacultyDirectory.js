'use client';

import { useMemo, useState } from 'react';
import FacultyCard from './FacultyCard';

export default function FacultyDirectory({ faculties }) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');
  const filteredFaculties = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return faculties.filter((faculty) => {
      const matchesQuery = !normalized || `${faculty.name} ${faculty.summary || ''} ${faculty.programs?.map((program) => program.name).join(' ') || ''}`.toLowerCase().includes(normalized);
      const matchesScope = scope === 'all' || (scope === 'programmes' ? faculty.programs?.length : !faculty.programs?.length);
      return matchesQuery && matchesScope;
    });
  }, [faculties, query, scope]);

  return <div className="faculty-directory-tools">
    <div className="directory-search">
      <label htmlFor="faculty-search">Search faculties</label>
      <input id="faculty-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by faculty name" />
      {query && <button type="button" onClick={() => setQuery('')}>Clear</button>}
    </div>
    <div className="directory-filters" role="group" aria-label="Filter faculties"><button type="button" className={scope === 'all' ? 'is-active' : ''} onClick={() => setScope('all')}>All faculties</button><button type="button" className={scope === 'programmes' ? 'is-active' : ''} onClick={() => setScope('programmes')}>Published programmes</button><button type="button" className={scope === 'directory' ? 'is-active' : ''} onClick={() => setScope('directory')}>Directory entries</button></div>
    <p className="result-count" aria-live="polite">{filteredFaculties.length} of {faculties.length} faculties</p>
    {filteredFaculties.length ? <div className="directory-grid">{filteredFaculties.map((faculty, index) => <FacultyCard key={faculty.slug} faculty={faculty} index={index} />)}</div> : <div className="directory-empty"><strong>No faculties match that search.</strong><button type="button" onClick={() => setQuery('')}>Reset search</button></div>}
  </div>;
}
