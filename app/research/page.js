import InformationLayout from '../../components/InformationLayout';
import { officialSources, researchObjectives } from '../../lib/siteContent';
import { facilityRecords, researchRecords } from '../../lib/contentEnrichment';
import '../information.css';

export const metadata = { title: 'Research and Innovation | Egyptian Chinese University' };

export default function ResearchPage() {
  return <InformationLayout eyebrow="RESEARCH & INNOVATION" title="Research with purpose, partnership and impact." intro="ECU’s published research plan sets objectives around sustainability, innovation, researcher development and cooperation with local and international institutions.">
    <section className="information-section wrap"><div className="section-intro"><div><p className="eyebrow">PUBLISHED OBJECTIVES</p><h2>A source-led view of ECU research.</h2></div><a className="button" href={officialSources.research} target="_blank" rel="noreferrer">Read research plan <span aria-hidden="true">-&gt;</span></a></div><div className="info-cards">{researchObjectives.map((objective, index) => <article className="info-card" key={objective}><span className="eyebrow">0{index + 1}</span><p>{objective}</p></article>)}</div><div className="enrichment-record-grid">{researchRecords.map((record) => <article className="info-card" key={record.id}><p className="eyebrow">{record.category}</p><h3>{record.title}</h3><p>{record.summary}</p><a className="text-link" href={record.sourceUrl} target="_blank" rel="noreferrer">Read source -&gt;</a></article>)}{facilityRecords.map((record) => <article className="info-card" key={record.id}><p className="eyebrow">DOCUMENTED FACILITY</p><h3>{record.name}</h3><p>{record.description}</p><a className="text-link" href={record.sourceUrl} target="_blank" rel="noreferrer">Read source -&gt;</a></article>)}</div><p className="status-note">The local inventory contains strategy and facility records, not claims of completed research projects, funding or equipment availability. Further records require a current ECU feed or approved content export.</p></section>
  </InformationLayout>;
}
