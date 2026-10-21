import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import ProgrammeExplorer from '../../components/ProgrammeExplorer';
import { programmeDirectory } from '../../lib/programmes';
import '../programmes.css';

export const metadata = {
  title: 'Academic Programmes | Egyptian Chinese University',
  description: 'Search verified ECU programme areas and continue to the relevant faculty source.',
};

export default function ProgrammesPage() {
  return <main>
    <SiteHeader />
    <header className="directory-header programme-directory-header"><div className="wrap"><Link className="breadcrumb" href="/">ECU home</Link><p className="eyebrow">ACADEMICS</p><h1>Find an academic programme</h1><p>Search the programme areas currently recorded from ECU faculty sources. Fields such as duration, tuition and detailed curricula are shown only when verified.</p></div></header>
    <section className="section wrap programme-directory-section"><div className="section-intro"><div><p className="eyebrow">PROGRAMME DIRECTORY</p><h2>Start with a subject, faculty or study area.</h2></div><p className="directory-note">{programmeDirectory.length} verified programme areas currently indexed.</p></div><ProgrammeExplorer programmes={programmeDirectory} /></section>
  </main>;
}
