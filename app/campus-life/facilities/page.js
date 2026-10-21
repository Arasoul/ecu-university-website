import InformationLayout from '../../../components/InformationLayout';
import { campusFacilities } from '../../../lib/campus/records';
import '../../information.css';

export const metadata = { title: 'Campus Facilities | Egyptian Chinese University' };
export default function CampusFacilitiesPage() {
  return <InformationLayout eyebrow="CAMPUS LIFE / FACILITIES" title="Facilities published with evidence." intro="Only facilities that ECU publicly identifies are listed here. Equipment, opening hours and access rules are not inferred."><section className="information-section wrap"><div className="archive-empty">{campusFacilities.length ? 'Verified facilities will appear here.' : 'No facility records are currently published in the verified ECU dataset. Check the official ECU source for current campus information.'}<p><a className="text-link" href="https://ecu.edu.eg/" target="_blank" rel="noreferrer">Open official ECU website -&gt;</a></p></div></section></InformationLayout>;
}
