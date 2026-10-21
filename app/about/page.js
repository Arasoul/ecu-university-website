import Link from 'next/link';
import InformationLayout from '../../components/InformationLayout';
import { officialSources, campusLocations } from '../../lib/siteContent';
import { getImportedRecord } from '../../lib/importedContent';
import '../information.css';

export const metadata = { title: 'About ECU | Egyptian Chinese University' };

export default function AboutPage() {
  const profile = getImportedRecord('uni-profile');
  const mission = getImportedRecord('uni-mission');
  const vision = getImportedRecord('uni-vision');
  const objectives = getImportedRecord('uni-objectives');
  const cooperation = getImportedRecord('uni-international');
  return <InformationLayout eyebrow="ABOUT ECU" title="A university shaped by education and connection." intro="Explore ECU’s public university profile, academic community and campus pathways. Institutional details are shown only where the current source is available.">
    <section className="information-section wrap"><div className="information-grid"><div><p className="eyebrow">UNIVERSITY IDENTITY</p><h2>{profile.title}</h2><p>{profile.summary}</p><p className="status-note">This imported source summary is marked for ECU editorial review before it is treated as final institutional copy.</p></div><div className="info-cards"><article className="info-card"><h3>Academic community</h3><p>Discover the verified faculty directory and published study areas.</p><Link className="text-link" href="/faculties">Explore faculties -&gt;</Link></article><article className="info-card"><h3>Campus pathways</h3><p>Find current branch information and contact routes for a visit.</p><Link className="text-link" href="/contact">Contact ECU -&gt;</Link></article><article className="info-card"><h3>Research connection</h3><p>Read ECU’s published research objectives and source material.</p><Link className="text-link" href="/research">Explore research -&gt;</Link></article></div></div></section>
    <section className="information-section wrap about-content-grid"><article><p className="eyebrow">MISSION</p><h2>{mission.title}</h2><p>{mission.summary}</p><a className="text-link" href={mission.source_url} target="_blank" rel="noreferrer">Read source -&gt;</a></article><article><p className="eyebrow">VISION</p><h2>{vision.title}</h2><p>{vision.summary}</p><a className="text-link" href={vision.source_url} target="_blank" rel="noreferrer">Read source -&gt;</a></article><article><p className="eyebrow">OBJECTIVES</p><h2>{objectives.title}</h2><ul className="content-list">{objectives.items.map((item) => <li key={item}>{item}</li>)}</ul></article><article><p className="eyebrow">INTERNATIONAL CONNECTION</p><h2>{cooperation.title}</h2><p>{cooperation.summary}</p><p className="status-note">Named partners and current agreements require reconfirmation before prominent publication.</p></article></section>
    <section className="information-section research-panel"><div className="wrap"><div className="section-intro"><div><p className="eyebrow">VISIT ECU</p><h2>Two Cairo branch locations.</h2></div><div className="location-list">{campusLocations.map((campus) => <div key={campus.name}><strong>{campus.name}</strong><span>{campus.address}</span></div>)}</div></div></div></section>
    <section className="information-section research-panel"><div className="wrap"><div className="section-intro"><div><p className="eyebrow">CONTINUE YOUR ECU JOURNEY</p><h2>Move from profile to pathway.</h2></div><div className="actions"><Link className="button" href="/faculties">Explore faculties <span aria-hidden="true">-&gt;</span></Link><Link className="text-link" href="/contact">Visit ECU <span aria-hidden="true">-&gt;</span></Link></div></div></div></section>
  </InformationLayout>;
}
