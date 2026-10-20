import Link from 'next/link';
import SiteHeader from '../../../components/SiteHeader';
import { getProgramme, programmeDirectory } from '../../../lib/programmes';
import '../../programmes.css';

export function generateStaticParams() {
  return programmeDirectory.map(({ slug }) => ({ slug: slug.split('/') }));
}

export default function ProgrammePage({ params }) {
  const programme = getProgramme(params.slug[0], params.slug[1]);
  if (!programme) return <main><SiteHeader /><section className="section wrap"><p className="eyebrow">ECU ACADEMICS</p><h1>Programme not found</h1><Link className="outlined-link" href="/programmes">Return to programmes</Link></section></main>;

  return <main>
    <SiteHeader />
    <header className="directory-header programme-detail-header"><div className="wrap"><Link className="breadcrumb" href="/programmes">All programmes</Link><p className="eyebrow">ACADEMIC PROGRAMME</p><h1>{programme.name}</h1><p>{programme.summary || 'This programme area is listed in the ECU faculty record. Detailed programme information should be confirmed with ECU.'}</p></div></header>
    <section className="section wrap programme-detail-grid"><div><p className="eyebrow">PROGRAMME OVERVIEW</p><h2>Continue with the faculty source.</h2><p>{programme.verification}</p><div className="programme-detail-actions"><a className="button" href={programme.sourceUrl} target="_blank" rel="noreferrer">Open official ECU source <span aria-hidden="true">-&gt;</span></a><Link className="outlined-link" href={`/faculties/${programme.facultySlug}`}>View faculty</Link></div></div><aside className="programme-facts"><span>FACULTY</span><strong>{programme.faculty}</strong><Link href={`/faculties/${programme.facultySlug}`}>Explore faculty -&gt;</Link><hr /><span>DETAILS STATUS</span><p>Only verified programme naming and available description are shown locally.</p></aside></section>
  </main>;
}
