import Link from 'next/link';
import InformationLayout from '../../components/InformationLayout';
import { officialSources } from '../../lib/siteContent';
import '../information.css';

export const metadata = { title: 'News and Events | Egyptian Chinese University' };

export default function NewsEventsPage() {
  return <InformationLayout eyebrow="NEWS & EVENTS" title="Stay close to ECU updates." intro="Browse the verified local archive, then continue to ECU’s official publication source for current announcements.">
    <section className="information-section wrap"><div className="information-grid"><div><p className="eyebrow">EDITORIAL ARCHIVE</p><h2>Start with verified local records.</h2><p>Browse dated news summaries, historical activity reports and an evidence-led achievements section.</p><div className="source-list"><Link href="/news">Browse ECU news -&gt;</Link><Link href="/events">Explore events and activities -&gt;</Link><Link href="/achievements">Hall of achievements -&gt;</Link></div></div><div className="source-panel"><p className="eyebrow">CURRENT SOURCE</p><p>Current announcements, registration details and new publication dates remain on ECU’s official source.</p><a className="button" href={officialSources.news} target="_blank" rel="noreferrer">Visit official news <span aria-hidden="true">-&gt;</span></a></div></div></section>
  </InformationLayout>;
}
