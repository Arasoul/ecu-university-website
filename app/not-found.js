import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export const metadata = { title: 'Page not found | Egyptian Chinese University' };

export default function NotFound() {
  return <main>
    <SiteHeader />
    <header className="information-hero"><div className="wrap"><p className="eyebrow">PAGE NOT FOUND</p><h1>This page is not part of the current ECU site.</h1><p>The address may have changed, or the record it referred to has not been published.</p></div></header>
    <section className="information-section wrap"><div className="information-grid"><div><p className="eyebrow">CONTINUE EXPLORING</p><h2>Start from a published section.</h2></div><div className="info-cards"><article className="info-card"><h3>Faculties</h3><p>Browse the verified faculty directory and study areas.</p><Link className="text-link" href="/faculties">Explore faculties -&gt;</Link></article><article className="info-card"><h3>Programmes</h3><p>Search the published academic programmes.</p><Link className="text-link" href="/programmes">Find a programme -&gt;</Link></article><article className="info-card"><h3>News and events</h3><p>Read dated source-backed records.</p><Link className="text-link" href="/news-events">Open the archive -&gt;</Link></article><article className="info-card"><h3>Contact</h3><p>Find the two published Cairo branch locations.</p><Link className="text-link" href="/contact">Contact ECU -&gt;</Link></article></div></div></section>
    <SiteFooter />
  </main>;
}
