import Link from 'next/link';
export default function FacultyCard({ faculty, index, featured = false }) {
  return <Link href={`/faculties/${faculty.slug}`} className={featured ? 'faculty-card' : 'directory-card'}>
    <div className="faculty-card-top"><span>{String(index + 1).padStart(2, '0')}</span><img src="/assets/images/ecu-logo.png" alt="" /></div>
    <h3>{faculty.name}</h3>
    {faculty.summary && <p>{faculty.summary}</p>}
    {!faculty.summary && <p>{featured ? 'Explore the faculty' : 'View faculty overview'}</p>}
    {faculty.programs?.length ? <small>{faculty.programs.length} published study areas</small> : null}
    <i aria-hidden="true">-&gt;</i>
  </Link>;
}
