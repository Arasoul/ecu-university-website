import InformationLayout from '../../components/InformationLayout';
import { officialSources } from '../../lib/siteContent';
import '../information.css';

export const metadata = { title: 'News and Events | Egyptian Chinese University' };

export default function NewsEventsPage() {
  return <InformationLayout eyebrow="NEWS & EVENTS" title="Stay close to the latest ECU updates." intro="Browse current university news and events through ECU’s official publication source. Local cards will be added when dated records are approved for this platform.">
    <section className="information-section wrap"><div className="information-grid"><div><p className="eyebrow">CURRENT SOURCE</p><h2>One reliable place for current updates.</h2><p>Dates, event status, registration details and article content must be kept current. Until a feed is available, the official ECU news destination is the safest source for visitors.</p><div className="source-list"><a href={officialSources.news} target="_blank" rel="noreferrer">Open ECU news <span aria-hidden="true">-&gt;</span></a><a href={officialSources.home} target="_blank" rel="noreferrer">Open ECU events and homepage <span aria-hidden="true">-&gt;</span></a></div></div><div className="source-panel"><p className="eyebrow">CONTENT STATUS</p><p>No local news or upcoming-event records are published without a verified publication date and source URL.</p><a className="button" href={officialSources.news} target="_blank" rel="noreferrer">Visit official news <span aria-hidden="true">-&gt;</span></a></div></div></section>
  </InformationLayout>;
}
