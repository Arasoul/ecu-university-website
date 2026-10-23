'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('ECU page error:', error);
  }, [error]);

  return <main>
    <SiteHeader />
    <header className="information-hero"><div className="wrap"><p className="eyebrow">SOMETHING WENT WRONG</p><h1>This section could not be loaded.</h1><p>The record may still be available on ECU’s official website.</p></div></header>
    <section className="information-section wrap"><div className="information-grid"><div><p className="eyebrow">NEXT STEPS</p><h2>Try again, or continue from a published section.</h2><div className="actions"><button className="button" type="button" onClick={reset}>Try again</button><Link className="text-link" href="/">Return to the homepage -&gt;</Link></div></div><div className="info-cards"><article className="info-card"><h3>Official ECU site</h3><p>Open the source website for the latest published information.</p><a className="text-link" href="https://ecu.edu.eg/" target="_blank" rel="noreferrer">Open ecu.edu.eg -&gt;</a></article><article className="info-card"><h3>Contact</h3><p>Find the two published Cairo branch locations and contact routes.</p><Link className="text-link" href="/contact">Contact ECU -&gt;</Link></article></div></div></section>
    <SiteFooter />
  </main>;
}
