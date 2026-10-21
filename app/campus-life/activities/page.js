import InformationLayout from '../../../components/InformationLayout';
import EditorialArchive from '../../../components/EditorialArchive';
import { campusActivities } from '../../../lib/campus/records';
import '../../information.css';

export const metadata = { title: 'Campus Activities | Egyptian Chinese University' };
export default function CampusActivitiesPage() {
  return <InformationLayout eyebrow="CAMPUS LIFE / ACTIVITIES" title="Published activity records, kept in context." intro="Filter historical ECU workshops, visits and student activities. Each activity links to its canonical event record rather than duplicating content."><section className="information-section wrap"><EditorialArchive records={campusActivities} detailPath="/events" emptyMessage="No published activity records match these filters." /></section></InformationLayout>;
}
