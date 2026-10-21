import Link from 'next/link';
import SiteHeader from './SiteHeader';

export default function InformationLayout({ eyebrow, title, intro, children }) {
  return <main>
    <SiteHeader />
    <header className="information-hero"><div className="wrap"><Link className="breadcrumb" href="/">ECU home</Link><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></header>
    {children}
    <footer className="simple-footer"><div className="wrap simple-footer-inner"><Link href="/">Egyptian Chinese University</Link><Link href="/faculties">Faculties</Link><Link href="/contact">Visit and contact</Link><Link href="/admissions">Admissions</Link></div></footer>
  </main>;
}

export function SourcePanel({ href, children }) {
  return <aside className="source-panel"><p className="eyebrow">OFFICIAL SOURCE</p><p>{children}</p><a className="button" href={href} target="_blank" rel="noreferrer">Open ECU source <span aria-hidden="true">-&gt;</span></a></aside>;
}
