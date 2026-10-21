import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../../components/SiteHeader';
import ProgrammeList from '../../../components/ProgrammeList';
import { facultyDirectory, getFaculty } from '../../../lib/faculties';
import '../faculties.css';
import { getFacultyDetail, getFacultyLearningRecords } from '../../../lib/verifiedContent';
import { facultyEnrichment } from '../../../lib/contentEnrichment';

export function generateStaticParams() {
  return facultyDirectory.map(({ slug }) => ({ slug }));
}

export default function FacultyPage({ params }) {
  const faculty = getFaculty(params.slug);
  if (!faculty) return <main><SiteHeader /><section className="section wrap"><p className="eyebrow">ECU ACADEMICS</p><h1>Faculty not found</h1><Link className="outlined-link" href="/faculties">Return to faculties</Link></section></main>;

  const isComputing = faculty.slug === 'computers-and-information-systems';
  const isMassCommunication = faculty.slug === 'mass-communication';
  const massDetail = isMassCommunication ? getFacultyDetail('faculty-mass-communication') : null;
  const massLearning = isMassCommunication ? getFacultyLearningRecords('faculty-mass-communication') : [];
  const enrichedFaculty = facultyEnrichment.find((record) => record.facultySlug === faculty.slug);
  const campus = ['veterinary-medicine', 'computers-and-information-systems', 'arts-and-design'].includes(faculty.slug) ? 'Nasr City' : ['physical-therapy', 'engineering-and-technology', 'pharmacy-and-drug-technology', 'economics-and-international-trade'].includes(faculty.slug) ? 'Heliopolis / Gesr El Suez' : null;
  const overviewFallback = `ECU has published this faculty in its directory. Further programme and department content will be added when it is available from an official ECU source.`;
  return <main>
    <SiteHeader />
    <header className="directory-header faculty-hero"><div className="wrap"><Link className="breadcrumb" href="/faculties">All faculties</Link><div className="faculty-hero-grid"><div><p className="eyebrow">ECU FACULTY</p><h1>{faculty.name}</h1><p>{faculty.summary || 'Explore current faculty information through ECU’s official source.'}</p></div>{faculty.slug === 'arts-and-design' ? <Image className="faculty-hero-photo" src="/images/ecu/faculties/arts-design-students.jpg" alt="Arts and Design students and faculty gathered outside Hall 4" width={1024} height={768} priority sizes="(max-width: 700px) 100vw, 40vw" /> : <div className="faculty-emblem" aria-hidden="true"><img src="/assets/images/ecu-logo.png" alt="" /><span>{isComputing ? 'CIS' : 'ECU'}</span></div>}</div><nav className="faculty-jump-nav" aria-label="On this page"><a href="#overview">Overview</a>{faculty.programs?.length ? <a href="#programmes">Programmes</a> : null}<a href="#source">Official source</a></nav></div></header>

    <section id="overview" className="section wrap detail-grid"><div><p className="eyebrow">OVERVIEW</p><h2>{isComputing ? 'A clear starting point for computing study.' : 'Academic identity'}</h2><p>{faculty.summary || overviewFallback}</p><div className="faculty-path-actions"><Link className="button" href="/admissions">Review admissions pathway <span aria-hidden="true">-&gt;</span></Link><Link className="outlined-link" href="/programmes">Compare programmes</Link></div></div><aside className="faculty-facts"><span>CONTENT STATUS</span><strong>{faculty.programs?.length ? `${faculty.programs.length} published study areas` : 'Directory entry verified'}</strong>{campus ? <><span>CAMPUS ASSOCIATION</span><strong>{campus}</strong><Link className="text-link" href="/campus-life/visit">Plan a campus visit -&gt;</Link></> : null}<p>Only ECU-published information is shown in this experience.</p></aside></section>

    {faculty.programs?.length ? <div id="programmes"><ProgrammeList programs={faculty.programs} /></div> : null}
    {massDetail ? <section className="section wrap faculty-content-story"><div className="section-intro"><div><p className="eyebrow">REFERENCE FACULTY EXPERIENCE</p><h2>Communication, creativity and professional practice.</h2></div><p>{massDetail.summary}</p></div><div className="faculty-departments"><div><p className="eyebrow">PUBLISHED DEPARTMENTS</p>{massDetail.departments.map((department) => <a href={department.sourceUrl} target="_blank" rel="noreferrer" key={department.id}><strong>{department.name}</strong><span>Read official department source -&gt;</span></a>)}</div><aside><p className="eyebrow">ACADEMIC LEADERSHIP</p><h3>{massDetail.deanListed}</h3><p>Leadership listing requires reconfirmation before it is treated as current.</p></aside></div><div className="faculty-learning-grid">{massLearning.map((record) => <article key={record.id}><p className="eyebrow">{record.kind === 'academic-structure' ? 'FOUNDATION' : 'LEARNING AREA'}</p><h3>{record.title}</h3><p>{record.summary}</p>{record.tracks ? <ul className="content-list">{record.tracks.map((track) => <li key={track}>{track}</li>)}</ul> : null}<a className="text-link" href={record.sourceUrls[0]} target="_blank" rel="noreferrer">Read source -&gt;</a></article>)}</div></section> : null}
    {enrichedFaculty ? <section className="section wrap faculty-content-story"><div className="section-intro"><div><p className="eyebrow">SOURCE-LED FACULTY PROFILE</p><h2>{enrichedFaculty.title}</h2></div><p>{enrichedFaculty.overview}</p></div><div className="faculty-learning-grid"><article><p className="eyebrow">STUDY STRUCTURE</p><h3>{enrichedFaculty.studyStructure}</h3><p>Study duration is reproduced from the linked ECU source and should be reconfirmed for current admissions.</p></article><article><p className="eyebrow">PUBLISHED AREAS</p><ul className="content-list">{enrichedFaculty.publishedAreas.map((area) => <li key={area}>{area}</li>)}</ul></article></div><a className="text-link" href={enrichedFaculty.sourceUrl} target="_blank" rel="noreferrer">Read official faculty source -&gt;</a></section> : null}

    <section id="source" className="section faculty-source"><div className="wrap source-grid"><div><p className="eyebrow">MORE FACULTY INFORMATION</p><h2>Use the official ECU source for current details.</h2></div><div><p>Departments, laboratories, academic staff, research, achievements, events and contact records are not included here until ECU provides approved content for publication.</p><a className="text-link" href={faculty.sourceUrl} target="_blank" rel="noreferrer">Open {faculty.name} source <span aria-hidden="true">-&gt;</span></a></div></div></section>
  </main>;
}
