'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function ProgrammeFinder({ programmes }) {
  const [query, setQuery] = useState('');
  const [faculty, setFaculty] = useState('all');
  const facultyOptions = useMemo(() => [...new Map(programmes.map((program) => [program.facultySlug, program.faculty])).entries()], [programmes]);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return programmes.filter((program) => {
      const matchesFaculty = faculty === 'all' || program.facultySlug === faculty;
      const matchesQuery = !normalized || `${program.name} ${program.summary || ''} ${program.faculty}`.toLowerCase().includes(normalized);
      return matchesFaculty && matchesQuery;
    });
  }, [faculty, programmes, query]);

  const clearFilters = () => {
    setQuery('');
    setFaculty('all');
  };

  return <div className="programme-finder">
    <div className="finder-controls">
      <label>Search programmes<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by subject or faculty" /></label>
      <label>Faculty<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option value="all">All faculties</option>{facultyOptions.map(([slug, name]) => <option value={slug} key={slug}>{name}</option>)}</select></label>
      <button type="button" onClick={clearFilters}>Clear filters</button>
    </div>
    <p className="finder-status" aria-live="polite">{results.length} verified programme areas</p>
    {results.length ? <div className="programme-grid">{results.map((program) => <Link className="programme-card" href={`/faculties/${program.facultySlug}`} key={`${program.facultySlug}-${program.name}`}><span>{program.faculty}</span><h3>{program.name}</h3><p>{program.summary || 'View the current faculty programme information.'}</p><i aria-hidden="true">-&gt;</i></Link>)}</div> : <div className="finder-empty"><strong>No verified programme areas match those filters.</strong><button type="button" onClick={clearFilters}>Reset programme search</button></div>}
  </div>;
}
