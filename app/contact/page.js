import InformationLayout from '../../components/InformationLayout';
import { campusLocations, officialSources } from '../../lib/siteContent';
import '../information.css';

export const metadata = { title: 'Contact and Services | Egyptian Chinese University' };

export default function ContactPage() {
  return <InformationLayout eyebrow="CONTACT & SERVICES" title="Find a branch, then choose the right official route." intro="Use the verified branch information below and continue to ECU’s official website for current contact channels and digital services.">
    <section className="information-section wrap"><div className="section-intro"><div><p className="eyebrow">VISIT ECU</p><h2>Campus locations</h2></div><a className="button" href={officialSources.home} target="_blank" rel="noreferrer">Official contact source <span aria-hidden="true">-&gt;</span></a></div><div className="info-cards">{campusLocations.map((location) => <article className="info-card" key={location.name}><h3>{location.name}</h3><p>{location.address}</p></article>)}</div><p className="status-note">Telephone numbers, email addresses, portal links, library/LMS services and social accounts are not displayed until ECU confirms the current official records.</p></section>
  </InformationLayout>;
}
