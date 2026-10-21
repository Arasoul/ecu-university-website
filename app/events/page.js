import InformationLayout from '../../components/InformationLayout';
import EditorialArchive from '../../components/EditorialArchive';
import { pastEvents, upcomingEvents } from '../../lib/editorial/selectors';
import '../information.css';

export const metadata = { title: 'ECU Events and Activities | Egyptian Chinese University' };
export default function EventsPage() {
  const upcoming = upcomingEvents();
  return <InformationLayout eyebrow="EVENTS & ACTIVITIES" title="Explore dated ECU activity records." intro="Only records with verified occurrence dates can appear in this archive. No upcoming events are shown unless the date is genuinely in the future."><section className="information-section wrap"><div className="event-callout"><p className="eyebrow">UPCOMING</p><h2>{upcoming.length ? `${upcoming.length} upcoming event${upcoming.length === 1 ? '' : 's'}` : 'No verified upcoming events'}</h2><p>{upcoming.length ? 'These records have future occurrence dates in the verified dataset.' : 'The available ECU records are historical. Check the official source for current announcements and registration information.'}</p><a className="button" href="https://ecu.edu.eg/news/" target="_blank" rel="noreferrer">Open official ECU news -&gt;</a></div><div className="section-intro"><div><p className="eyebrow">PAST ACTIVITIES</p><h2>Historical records, accurately dated.</h2></div><p>{pastEvents().length} source-backed activities are available.</p></div><EditorialArchive records={pastEvents()} detailPath="/events" /></section></InformationLayout>;
}
