import { notFound } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import EditorialDetail from '../../../components/EditorialDetail';
import { eventRecords, getEvent, undatedActivityRecords } from '../../../lib/editorial/records';
import '../../information.css';

export function generateStaticParams() { return [...eventRecords, ...undatedActivityRecords].map((record) => ({ slug: record.slug })); }
export const metadata = { title: 'ECU Activity | Egyptian Chinese University' };
export default function EventDetailPage({ params }) { const record = getEvent(params.slug); if (!record) notFound(); return <main><SiteHeader /><header className="information-hero"><div className="wrap"><p className="eyebrow">ECU ACTIVITY ARCHIVE</p><p>{record.eventDate ? 'Historical source-backed record' : 'Source-backed record, date to be confirmed'}</p></div></header><EditorialDetail record={record} backHref="/events" backLabel="Back to events" /><SiteFooter /></main>; }
