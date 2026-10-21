import InformationLayout from '../../../components/InformationLayout';
import { campusLocationRecords } from '../../../lib/campus/records';
import '../../information.css';

export const metadata = { title: 'Visit ECU | Egyptian Chinese University' };
export default function CampusVisitPage() {
  return <InformationLayout eyebrow="CAMPUS LIFE / VISIT" title="Plan around published campus information." intro="These branch addresses are reproduced from ECU’s public faculty source. Confirm current opening hours, contacts and directions before travelling."><section className="information-section wrap"><div className="location-list campus-location-list">{campusLocationRecords.map((location) => <article key={location.id}><p className="eyebrow">PUBLISHED BRANCH</p><h2>{location.name}</h2><p>{location.address}</p></article>)}</div><p className="status-note">No building coordinates, opening hours or accessibility claims are added without an official ECU record.</p><a className="button" href="https://ecu.edu.eg/faculties/" target="_blank" rel="noreferrer">Confirm official location information -&gt;</a></section></InformationLayout>;
}
