import InformationLayout from '../../components/InformationLayout';
import EditorialArchive from '../../components/EditorialArchive';
import { achievementRecords } from '../../lib/editorial/records';
import '../information.css';

export const metadata = { title: 'Hall of Achievements | Egyptian Chinese University', description: 'Achievements, awards and distinctions documented in official ECU sources.' };
export default function AchievementsPage() {
  return <InformationLayout eyebrow="HALL OF ACHIEVEMENTS" title="A space for evidence-backed recognition." intro="Achievements are published here when ECU sources clearly document a concrete accomplishment, award or distinction."><section className="information-section wrap"><div className="achievement-intro"><p className="eyebrow">RECOGNITION</p><h2>Recognition deserves evidence.</h2><p>ECU’s student and staff achievements, competitions and academic distinctions are announced through the university’s official news channels. Open the official ECU news source to read the current record of awards and recognitions.</p><a className="button" href="https://ecu.edu.eg/news/" target="_blank" rel="noreferrer">Review official ECU news -&gt;</a></div><EditorialArchive records={achievementRecords} emptyMessage="No achievements have been published here yet. Open the official ECU news source for the current record of awards and recognitions." /></section></InformationLayout>;
}
