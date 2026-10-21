import InformationLayout from '../../../components/InformationLayout';
import { campusLocationRecords } from '../../../lib/campus/records';
import '../../information.css';
import '../../contact/contact.css';

export const metadata = { title: 'Visit ECU | Egyptian Chinese University' };
export default function CampusVisitPage() {
  return <InformationLayout eyebrow="CAMPUS LIFE / VISIT" title="Plan around published campus information." intro="These branch addresses and faculty associations are reproduced from ECU’s public campus-location source. Confirm current arrangements before travelling."><section className="information-section wrap"><div className="location-list campus-location-list">{campusLocationRecords.map((location) => <article key={location.id}><p className="eyebrow">PUBLISHED BRANCH</p><h2>{location.name}</h2><p>{location.address}</p><div className="campus-actions"><a className="outlined-link" href={location.directionsUrl} target="_blank" rel="noreferrer">Get directions -&gt;</a><a className="outlined-link" href={location.mapsSearchUrl} target="_blank" rel="noreferrer">Open Google Maps</a></div><ul className="content-list">{location.faculties.map((faculty) => <li key={faculty.slug}><a href={`/faculties/${faculty.slug}`}>{faculty.name}</a></li>)}</ul></article>)}</div><p className="status-note">No building coordinates, opening hours, parking, shuttle or accessibility claims are added without an official ECU record.</p><a className="button" href="https://ecu.edu.eg/campus-location/" target="_blank" rel="noreferrer">Confirm official location information -&gt;</a></section></InformationLayout>;
}
