import Link from 'next/link';
import Image from 'next/image';
export default function FacultyCard({ faculty, index, featured = false }) {
  return <Link href={`/faculties/${faculty.slug}`} className={featured ? 'faculty-card' : 'directory-card'}>
    {faculty.slug === 'arts-and-design' ? <Image className="faculty-card-image" src="/images/ecu/faculties/arts-design-students.jpg" alt="Arts and Design students and faculty gathered outside Hall 4" width={1024} height={768} sizes="(max-width: 700px) 100vw, 33vw" /> : null}
    <div className="faculty-card-top"><span>{String(index + 1).padStart(2, '0')}</span><b className="faculty-mark" aria-hidden="true">{faculty.name.slice(0, 2).toUpperCase()}</b></div>
    <h3>{faculty.name}</h3>
    {faculty.summary && <p>{faculty.summary}</p>}
    {!faculty.summary && <p>{featured ? 'Explore the faculty' : 'View faculty overview'}</p>}
    {faculty.programs?.length ? <small>{faculty.programs.length} published study areas</small> : null}
    <i aria-hidden="true">-&gt;</i>
  </Link>;
}
