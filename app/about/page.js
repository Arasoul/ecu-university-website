import Link from 'next/link';
import InformationLayout from '../../components/InformationLayout';
import { officialSources } from '../../lib/siteContent';
import '../information.css';

export const metadata = { title: 'About ECU | Egyptian Chinese University' };

export default function AboutPage() {
  return <InformationLayout eyebrow="ABOUT ECU" title="A university shaped by education and connection." intro="Explore ECU’s public university profile, academic community and campus pathways. Institutional details are shown only where the current source is available.">
    <section className="information-section wrap"><div className="information-grid"><div><p className="eyebrow">UNIVERSITY IDENTITY</p><h2>Egyptian Chinese University</h2><p>ECU’s public profile presents an academic community connecting education, research and practical learning, with cooperation involving Chinese universities.</p><p className="status-note">Mission, vision, history, leadership and partnership records require current ECU-approved editorial content before local publication.</p></div><div className="info-cards"><article className="info-card"><h3>Academic community</h3><p>Discover the verified faculty directory and published study areas.</p><Link className="text-link" href="/faculties">Explore faculties -&gt;</Link></article><article className="info-card"><h3>Campus pathways</h3><p>Find current branch information and contact routes for a visit.</p><Link className="text-link" href="/contact">Contact ECU -&gt;</Link></article><article className="info-card"><h3>Research connection</h3><p>Read ECU’s published research objectives and source material.</p><Link className="text-link" href="/research">Explore research -&gt;</Link></article></div></div></section>
    <section className="information-section research-panel"><div className="wrap"><div className="section-intro"><div><p className="eyebrow">SOURCE-LED CONTENT</p><h2>Start with the information ECU publishes.</h2></div><a className="button" href={officialSources.home} target="_blank" rel="noreferrer">Official ECU website <span aria-hidden="true">-&gt;</span></a></div></div></section>
  </InformationLayout>;
}
