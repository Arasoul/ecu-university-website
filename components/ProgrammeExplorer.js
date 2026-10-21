'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const interests = [
  { id: 'technology', label: 'Technology and computing', terms: ['computer', 'information', 'software', 'artificial', 'cyber', 'data', 'engineering', 'energy', 'mechatronics'] },
  { id: 'business', label: 'Business and economics', terms: ['accounting', 'finance', 'business', 'economics', 'marketing'] },
  { id: 'design', label: 'Design and communication', terms: ['design', 'media', 'communication'] },
];

export default function ProgrammeExplorer({ programmes }) {
  const [query, setQuery] = useState('');
  const [faculty, setFaculty] = useState('all');
  const [selected, setSelected] = useState([]);
  const [interest, setInterest] = useState('');
  const faculties = useMemo(() => [...new Map(programmes.map((program) => [program.facultySlug, program.faculty])).entries()], [programmes]);
  const results = useMemo(() => programmes.filter((program) => {
    const text = `${program.name} ${program.summary || ''} ${program.faculty}`.toLowerCase();
    return (faculty === 'all' || program.facultySlug === faculty) && (!query.trim() || text.includes(query.trim().toLowerCase()));
  }), [faculty, programmes, query]);
  const recommendations = useMemo(() => {
    if (!interest) return [];
    const selectedInterest = interests.find((item) => item.id === interest);
    return programmes.map((program) => {
      const text = `${program.name} ${program.summary || ''}`.toLowerCase();
      const matches = selectedInterest.terms.filter((term) => text.includes(term));
      return { program, matches };
    }).filter((item) => item.matches.length).sort((a, b) => b.matches.length - a.matches.length).slice(0, 5);
  }, [interest, programmes]);
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  const compared = programmes.filter((program) => selected.includes(program.id));

  return <div className="programme-explorer">
    <section className="catalog-panel" aria-labelledby="catalog-title"><div className="section-intro"><div><p className="eyebrow">PROGRAMME CATALOG</p><h2 id="catalog-title">Search verified study areas.</h2></div><p>Subject areas are not presented as separate awarded degrees unless ECU confirms that distinction.</p></div><div className="finder-controls"><label>Search programmes<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by subject or faculty" /></label><label>Faculty<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option value="all">All faculties</option>{faculties.map(([slug, name]) => <option value={slug} key={slug}>{name}</option>)}</select></label></div><p className="finder-status" aria-live="polite">{results.length} verified programme areas</p><div className="programme-grid">{results.map((program) => <article className="programme-card" key={program.id}><span>{program.faculty}</span><h3>{program.name}</h3><p>{program.summary || 'Verified programme area; detailed metadata requires confirmation.'}</p><label className="compare-check"><input type="checkbox" checked={selected.includes(program.id)} onChange={() => toggle(program.id)} /> Compare</label><Link href={`/programmes/${program.slug}`}>View details -&gt;</Link></article>)}</div></section>
    <section className="guidance-panel" aria-labelledby="guidance-title"><div><p className="eyebrow">FIND MY PROGRAM</p><h2 id="guidance-title">Start with an interest.</h2><p>These transparent suggestions match words in verified programme records. They are not admissions decisions or employment guarantees.</p></div><div className="interest-options">{interests.map((item) => <button type="button" className={interest === item.id ? 'is-active' : ''} onClick={() => setInterest(item.id)} key={item.id}>{item.label}</button>)}</div>{interest ? <div className="recommendations" aria-live="polite">{recommendations.map(({ program, matches }) => <article key={program.id}><span>{program.faculty}</span><h3>{program.name}</h3><p>Recommended because it matches: {matches.join(', ')}.</p><Link href={`/programmes/${program.slug}`}>Explore programme -&gt;</Link></article>)}</div> : null}</section>
    <section className="comparison-panel" aria-labelledby="comparison-title"><div className="section-intro"><div><p className="eyebrow">COMPARE PROGRAMMES</p><h2 id="comparison-title">Make a short list.</h2></div><p>Select up to three programme areas above. Only verified names, faculties and available summaries are compared.</p></div>{compared.length ? <div className="comparison-grid">{compared.map((program) => <article key={program.id}><button type="button" aria-label={`Remove ${program.name} from comparison`} onClick={() => toggle(program.id)}>×</button><p className="eyebrow">{program.faculty}</p><h3>{program.name}</h3><dl><dt>Summary</dt><dd>{program.summary || 'Not locally published.'}</dd><dt>Degree</dt><dd>Not confirmed</dd><dt>Duration</dt><dd>Not confirmed</dd></dl></article>)}</div> : <p className="comparison-empty">Choose two or three areas to compare their verified information side by side.</p>}</section>
  </div>;
}
