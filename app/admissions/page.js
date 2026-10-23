import InformationLayout from '../../components/InformationLayout';
import { admissionsTopics, officialSources } from '../../lib/siteContent';
import AdmissionsGuide from '../../components/AdmissionsGuide';
import { verifiedAdmissions } from '../../lib/verifiedContent';
import '../information.css';

export const metadata = { title: 'Admissions | Egyptian Chinese University' };

export default function AdmissionsPage() {
  return <InformationLayout eyebrow="ADMISSIONS" title="Find the requirements before you apply." intro="Use this page as a clear starting point, then confirm current requirements and instructions on ECU’s official admissions destination.">
    <section className="information-section wrap"><div className="information-grid"><div><p className="eyebrow">APPLICATION GUIDANCE</p><h2>Prepare with the current official instructions.</h2><p>ECU publishes entry requirements and required documents for Egyptian, Arab and international secondary certificates. The live admissions platform remains the authoritative place to apply.</p><div className="info-cards">{admissionsTopics.map((topic, index) => <article className="info-card" key={topic}><span className="eyebrow">0{index + 1}</span><p>{topic}</p></article>)}</div></div><div><div className="source-panel"><p className="eyebrow">APPLICATION DESTINATION</p><p>Do not submit personal information through this informational page. Continue to ECU’s official admissions service.</p><a className="button" href={officialSources.admissions} target="_blank" rel="noreferrer">Open admissions <span aria-hidden="true">-&gt;</span></a></div><p className="status-note">Tuition, deadlines, scholarship eligibility and FAQ answers are published on ECU’s official admissions destination.</p></div></div></section>
    <section className="information-section wrap admissions-records"><div className="section-intro"><div><p className="eyebrow">CERTIFICATE PATHWAYS</p><h2>Choose the guidance that matches your qualification.</h2></div><p>These summaries follow ECU’s published requirements for each certificate type.</p></div><AdmissionsGuide records={verifiedAdmissions} /></section>
  </InformationLayout>;
}
