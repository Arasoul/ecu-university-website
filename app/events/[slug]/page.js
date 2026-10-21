import { notFound } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import EditorialDetail from '../../../components/EditorialDetail';
import { eventRecords, getEvent } from '../../../lib/editorial/records';
import '../../information.css';

export function generateStaticParams() { return eventRecords.map((record) => ({ slug: record.slug })); }
export const metadata = { title: 'ECU Activity | Egyptian Chinese University' };
export default function EventDetailPage({ params }) { const record = getEvent(params.slug); if (!record) notFound(); return <main><SiteHeader /><header className="information-hero"><div className="wrap"><p className="eyebrow">ECU ACTIVITY ARCHIVE</p><p>Historical source-backed record</p></div></header><EditorialDetail record={record} backHref="/events" backLabel="Back to events" /></main>; }
