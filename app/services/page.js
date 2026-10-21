import InformationLayout from '../../components/InformationLayout';
import { serviceGroups } from '../../lib/services';
import '../information.css';

export const metadata = { title: 'University Services | Egyptian Chinese University', description: 'Verified public ECU routes for students, staff, alumni and visitors.' };

export default function ServicesPage() {
  return <InformationLayout eyebrow="UNIVERSITY SERVICES" title="Choose the right ECU route." intro="This directory lists public and source-backed destinations. Secured systems are never guessed or replicated.">
    <section className="information-section wrap services-directory">{serviceGroups.map((group) => <section className="service-group" aria-labelledby={`service-${group.id}`} key={group.id}><div className="section-intro"><div><p className="eyebrow">{group.title.toUpperCase()}</p><h2 id={`service-${group.id}`}>{group.title}</h2></div><p>{group.description}</p></div><div className="info-cards">{group.services.map((service) => <article className="info-card" key={service.id}><span className={`service-status ${service.status}`}>{service.status === 'unavailable' ? 'Not published' : service.status === 'verified' ? 'Verified destination' : 'Local route'}</span><h3>{service.title}</h3><p>{service.description}</p>{service.href ? service.href.startsWith('/') ? <a className="text-link" href={service.href}>Open service -&gt;</a> : <a className="text-link" href={service.href} target="_blank" rel="noreferrer">Open official destination -&gt;</a> : <p className="status-note">Ask ECU for the current authorized destination.</p>}</article>)}</div></section>)}</section>
  </InformationLayout>;
}
