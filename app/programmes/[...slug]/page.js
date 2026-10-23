import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import { getProgramme, programmeDirectory } from '../../../lib/programmes';
import { facultyDirectory } from '../../../lib/faculties';
import '../../programmes.css';

export function generateStaticParams() {
  return programmeDirectory.map(({ slug }) => ({ slug: slug.split('/') }));
}

export function generateMetadata({ params }) {
  const programme = getProgramme(params.slug[0], params.slug[1]);
  if (!programme) return { title: 'Programme not found | Egyptian Chinese University' };
  return {
    title: `${programme.name} | Egyptian Chinese University`,
    description: programme.summary || `${programme.name} is a published study area in the ${programme.faculty} faculty at the Egyptian Chinese University.`,
  };
}

export default function ProgrammePage({ params }) {
  const segments = params.slug || [];
  // A single segment is a faculty slug, not a programme. Send it to the faculty record.
  if (segments.length === 1) {
    const faculty = facultyDirectory.find((item) => item.slug === segments[0]);
    if (faculty) redirect(`/faculties/${faculty.slug}`);
    notFound();
  }
  const programme = getProgramme(segments[0], segments[1]);
  if (!programme) notFound();

  return <main>
    <SiteHeader />
    <header className="directory-header programme-detail-header"><div className="wrap"><Link className="breadcrumb" href="/programmes">All programmes</Link><p className="eyebrow">ACADEMIC PROGRAMME</p><h1>{programme.name}</h1><p>{programme.summary || `This study area is listed in the ECU ${programme.faculty} faculty record.`}</p></div></header>
    <section className="section wrap programme-detail-grid"><div><p className="eyebrow">PROGRAMME OVERVIEW</p><h2>Continue with the faculty source.</h2><p>{programme.verification}</p><div className="programme-detail-actions"><a className="button" href={programme.sourceUrl} target="_blank" rel="noreferrer">Open official ECU source <span aria-hidden="true">-&gt;</span></a><Link className="outlined-link" href={`/faculties/${programme.facultySlug}`}>View faculty</Link></div></div><aside className="programme-facts"><span>FACULTY</span><strong>{programme.faculty}</strong><Link href={`/faculties/${programme.facultySlug}`}>Explore faculty -&gt;</Link><hr /><span>DETAILS STATUS</span><p>Programme naming and the published description are reproduced from the ECU faculty record.</p></aside></section>
    <SiteFooter />
  </main>;
}
