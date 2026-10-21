import InformationLayout from '../../../components/InformationLayout';
import Link from 'next/link';
import { campusFacilities } from '../../../lib/campus/records';
import '../../information.css';

export const metadata = { title: 'Campus Facilities | Egyptian Chinese University' };
export default function CampusFacilitiesPage() {
  return <InformationLayout eyebrow="CAMPUS LIFE / FACILITIES" title="Facilities published with evidence." intro="Only facilities that ECU publicly identifies are listed here. Equipment, opening hours and access rules are not inferred."><section className="information-section wrap"><div className="archive-empty">{campusFacilities.length ? 'Verified facilities will appear here.' : 'No facility records are currently published in the verified ECU dataset.'}<p><Link className="text-link" href="/campus-life/visit">Explore verified campus locations -&gt;</Link></p></div></section></InformationLayout>;
}
