import InformationLayout from '../../components/InformationLayout';
import EditorialArchive from '../../components/EditorialArchive';
import EditorialPhotoRail from '../../components/EditorialPhotoRail';
import { latestNews } from '../../lib/editorial/selectors';
import '../information.css';

export const metadata = { title: 'ECU News | Egyptian Chinese University', description: 'Verified archived ECU news summaries and official source links.' };

export default function NewsPage() {
  return <InformationLayout eyebrow="ECU NEWS" title="Stories from the university archive." intro="Browse concise summaries of dated ECU publications. Each record links to its official source; no current announcement is implied."><section className="information-section wrap"><div className="section-intro"><div><p className="eyebrow">VERIFIED ARCHIVE</p><h2>Read the source, keep the context.</h2></div><p>Publication dates are preserved from the source dataset. Historical records are not presented as current announcements.</p></div><EditorialArchive records={latestNews()} detailPath="/news" /></section><EditorialPhotoRail items={[{ id: 'news-shanghai', path: '/images/ecu/editorial/international-students-shanghai.jpg', alt: 'ECU students connected with Shanghai University gathered in an academic hall', width: 800, height: 600, label: 'Shanghai University students', context: 'International academic exchange' }, { id: 'news-pharmacists', path: '/images/ecu/editorial/pharmacy-syndicate-cooperation.jpeg', alt: 'ECU and Cairo Pharmacists Syndicate representatives signing a cooperation protocol', width: 800, height: 423, label: 'Pharmacy cooperation', context: 'Source-backed ECU news' }]} /></InformationLayout>;
}
