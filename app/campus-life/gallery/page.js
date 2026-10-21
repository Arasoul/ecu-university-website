import InformationLayout from '../../../components/InformationLayout';
import ApprovedGallery from '../../../components/ApprovedGallery';
import mediaManifest from '../../../data/media/manifest.json';
import '../../information.css';

export const metadata = { title: 'Campus Gallery | Egyptian Chinese University' };
export default function CampusGalleryPage() {
  const assets = mediaManifest.publishedAssets.filter((asset) => asset.filePath?.match(/\.(jpe?g|png|webp|avif)$/i)).map((asset) => ({
    ...asset,
    categories: [
      asset.campus ? 'Campus' : null,
      asset.faculty ? 'Faculty and learning' : null,
      asset.subject.toLowerCase().includes('student') ? 'Student life' : null,
      asset.subject.toLowerCase().includes('research') || asset.subject.toLowerCase().includes('pharmac') ? 'Research and cooperation' : null,
    ].filter(Boolean),
  }));
  return <InformationLayout eyebrow="CAMPUS LIFE / GALLERY" title="ECU in photographs." intro="Browse the authorized ECU-hosted photographs currently available for this replacement website. Each image retains its source and rights record."><section className="information-section wrap"><div className="gallery-status"><p className="eyebrow">AUTHORIZED MEDIA LIBRARY</p><h2>{assets.length} photographs available.</h2><p>Images are shown with source-backed subjects and descriptive alternatives. Categories appear only where the associated content is documented.</p><a className="button" href="https://ecu.edu.eg/photo-gallery/" target="_blank" rel="noreferrer">View official source gallery -&gt;</a></div><ApprovedGallery assets={assets} /></section></InformationLayout>;
}
