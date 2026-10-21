import InformationLayout from '../../../components/InformationLayout';
import { campusGalleries } from '../../../lib/campus/records';
import '../../information.css';

export const metadata = { title: 'Campus Gallery | Egyptian Chinese University' };
export default function CampusGalleryPage() {
  return <InformationLayout eyebrow="CAMPUS LIFE / GALLERY" title="A gallery designed around permission." intro="Public image URLs do not establish reuse rights. Candidate subjects are recorded without downloading or hotlinking unauthorized media."><section className="information-section wrap"><div className="gallery-status"><p className="eyebrow">MEDIA AUTHORIZATION</p><h2>{campusGalleries.length} candidate subjects, 0 publishable images.</h2><p>ECU approval and original media rights are required before a public gallery can render photographs. The source subjects remain useful editorial leads without presenting unapproved imagery.</p><a className="button" href="https://ecu.edu.eg/photo-gallery/" target="_blank" rel="noreferrer">Visit official photo gallery -&gt;</a></div><div className="info-cards">{campusGalleries.map((record) => <article className="info-card" key={record.id}><span className="service-status unavailable">Image not authorized</span><h3>{record.title}</h3><p>{record.caption}</p></article>)}</div></section></InformationLayout>;
}
