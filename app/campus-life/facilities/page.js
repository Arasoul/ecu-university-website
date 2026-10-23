import InformationLayout from '../../../components/InformationLayout';
import Link from 'next/link';
import { campusFacilities } from '../../../lib/campus/records';
import '../../information.css';

export const metadata = { title: 'Campus Facilities | Egyptian Chinese University' };
export default function CampusFacilitiesPage() {
  return <InformationLayout eyebrow="CAMPUS LIFE / FACILITIES" title="Facilities published with evidence." intro="Only facilities that ECU publicly identifies are listed here. Equipment, opening hours and access rules are not inferred."><section className="information-section wrap">{campusFacilities.length ? <div className="information-grid"><div><p className="eyebrow">PUBLISHED FACILITIES</p><h2>{campusFacilities.length} facility record{campusFacilities.length === 1 ? '' : 's'} available.</h2><p>Each entry reproduces what ECU publishes about the facility. Capacity, schedules and access conditions are not published in the source and are therefore not shown.</p></div><div className="info-cards">{campusFacilities.map((facility) => <article className="info-card" key={facility.id}><h3>{facility.title}</h3><p>{facility.summary}</p>{facility.campus ? <p><span className="eyebrow">SCOPE</span><br />{facility.campus}</p> : null}<a className="text-link" href={facility.sourceUrl} target="_blank" rel="noreferrer">Read official source -&gt;</a></article>)}</div></div> : <div className="archive-empty">No facility records are currently published in the verified ECU dataset.<p><Link className="text-link" href="/campus-life/visit">Explore verified campus locations -&gt;</Link></p></div>}</section></InformationLayout>;
}
