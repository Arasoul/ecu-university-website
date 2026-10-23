export default function ProgrammeList({ programs, contactHref = '/contact' }) {
  if (!programs?.length) return null;
  return <section className="programmes-section wrap" aria-labelledby="programmes-title"><div><p className="eyebrow">ACADEMIC PROGRAMMES</p><h2 id="programmes-title">Explore areas of study</h2></div><div className="programme-grid">{programs.map((program) => <article className="programme-card" key={program.name}>{program.code && <span>{program.code}</span>}<h3>{program.name}</h3>{program.summary && <p>{program.summary}</p>}<a href={contactHref}>Ask ECU about this programme -&gt;</a></article>)}</div></section>;
}
