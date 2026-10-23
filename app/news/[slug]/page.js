import { notFound } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import EditorialDetail from '../../../components/EditorialDetail';
import { getNews, newsRecords } from '../../../lib/editorial/records';
import '../../information.css';

export function generateStaticParams() { return newsRecords.map((record) => ({ slug: record.slug })); }
export const metadata = { title: 'ECU News Story | Egyptian Chinese University' };
export default function NewsDetailPage({ params }) { const record = getNews(params.slug); if (!record) notFound(); return <main><SiteHeader /><header className="information-hero"><div className="wrap"><p className="eyebrow">ECU NEWS ARCHIVE</p><p>Source-backed editorial summary</p></div></header><EditorialDetail record={record} backHref="/news" backLabel="Back to ECU news" /><SiteFooter /></main>; }
