import Link from 'next/link';
import SiteHeader from '../../../components/SiteHeader';
import ProgrammeList from '../../../components/ProgrammeList';
import { facultyDirectory, getFaculty } from '../../../lib/faculties';
import '../faculties.css';

export function generateStaticParams() {
  return facultyDirectory.map(({ slug }) => ({ slug }));
}

export default function FacultyPage({ params }) {
  const faculty = getFaculty(params.slug);
  if (!faculty) return <main><SiteHeader /><section className="section wrap"><p className="eyebrow">ECU ACADEMICS</p><h1>Faculty not found</h1><Link className="outlined-link" href="/faculties">Return to faculties</Link></section></main>;

  const isComputing = faculty.slug === 'computers-and-information-systems';
  const overviewFallback = `ECU has published this faculty in its directory. Further programme and department content will be added when it is available from an official ECU source.`;
  return <main>
    <SiteHeader />
    <header className="directory-header faculty-hero"><div className="wrap"><Link className="breadcrumb" href="/faculties">All faculties</Link><div className="faculty-hero-grid"><div><p className="eyebrow">ECU FACULTY</p><h1>{faculty.name}</h1><p>{faculty.summary || 'Explore current faculty information through ECU’s official source.'}</p></div><div className="faculty-emblem" aria-hidden="true"><img src="/assets/images/ecu-logo.png" alt="" /><span>{isComputing ? 'CIS' : 'ECU'}</span></div></div><nav className="faculty-jump-nav" aria-label="On this page"><a href="#overview">Overview</a>{faculty.programs?.length ? <a href="#programmes">Programmes</a> : null}<a href="#source">Official source</a></nav></div></header>

    <section id="overview" className="section wrap detail-grid"><div><p className="eyebrow">OVERVIEW</p><h2>{isComputing ? 'A clear starting point for computing study.' : 'Academic identity'}</h2><p>{faculty.summary || overviewFallback}</p><a className="button" href={faculty.sourceUrl} target="_blank" rel="noreferrer">Visit official ECU source <span aria-hidden="true">-&gt;</span></a></div><aside className="faculty-facts"><span>CONTENT STATUS</span><strong>{faculty.programs?.length ? `${faculty.programs.length} published study areas` : 'Directory entry verified'}</strong><p>Only ECU-published information is shown in this experience.</p></aside></section>

    {faculty.programs?.length ? <div id="programmes"><ProgrammeList programs={faculty.programs} /></div> : null}

    <section id="source" className="section faculty-source"><div className="wrap source-grid"><div><p className="eyebrow">MORE FACULTY INFORMATION</p><h2>Use the official ECU source for current details.</h2></div><div><p>Departments, laboratories, academic staff, research, achievements, events and contact records are not included here until ECU provides approved content for publication.</p><a className="text-link" href={faculty.sourceUrl} target="_blank" rel="noreferrer">Open {faculty.name} source <span aria-hidden="true">-&gt;</span></a></div></div></section>
  </main>;
}
