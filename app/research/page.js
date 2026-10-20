import InformationLayout from '../../components/InformationLayout';
import { officialSources, researchObjectives } from '../../lib/siteContent';
import '../information.css';

export const metadata = { title: 'Research and Innovation | Egyptian Chinese University' };

export default function ResearchPage() {
  return <InformationLayout eyebrow="RESEARCH & INNOVATION" title="Research with purpose, partnership and impact." intro="ECU’s published research plan sets objectives around sustainability, innovation, researcher development and cooperation with local and international institutions.">
    <section className="information-section wrap"><div className="section-intro"><div><p className="eyebrow">PUBLISHED OBJECTIVES</p><h2>A source-led view of ECU research.</h2></div><a className="button" href={officialSources.research} target="_blank" rel="noreferrer">Read research plan <span aria-hidden="true">-&gt;</span></a></div><div className="info-cards">{researchObjectives.map((objective, index) => <article className="info-card" key={objective}><span className="eyebrow">0{index + 1}</span><p>{objective}</p></article>)}</div><p className="status-note">Research centers, publications, projects and research-news records require a current ECU feed or approved content export before they are listed as local records.</p></section>
  </InformationLayout>;
}
