import InformationLayout from '../../components/InformationLayout';
import EditorialArchive from '../../components/EditorialArchive';
import { achievementRecords } from '../../lib/editorial/records';
import { achievementCandidates } from '../../lib/contentEnrichment';
import '../information.css';

export const metadata = { title: 'Hall of Achievements | Egyptian Chinese University' };
export default function AchievementsPage() {
  return <InformationLayout eyebrow="HALL OF ACHIEVEMENTS" title="A space for evidence-backed recognition." intro="Achievements are published only when ECU sources clearly document a concrete accomplishment, award or distinction."><section className="information-section wrap"><div className="achievement-intro"><p className="eyebrow">EDITORIAL STANDARD</p><h2>Recognition deserves evidence.</h2><p>The verified dataset currently contains no records that meet the publication threshold for an achievement. Participation, visits and cooperation announcements are not converted into awards.</p><a className="button" href="https://ecu.edu.eg/news/" target="_blank" rel="noreferrer">Review official ECU news -&gt;</a></div><EditorialArchive records={achievementRecords} detailPath="/achievements" emptyMessage="No evidence-backed achievements are currently published in the local dataset." /><p className="status-note">{achievementCandidates.length} achievement leads remain held for source completion; they are not presented as awards.</p></section></InformationLayout>;
}
