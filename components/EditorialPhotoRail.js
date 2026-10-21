import Image from 'next/image';

export default function EditorialPhotoRail({ items, eyebrow = 'SOURCE-BACKED IMAGERY', title = 'Moments from the ECU archive.' }) {
  return <section className="editorial-photo-rail" aria-labelledby="editorial-photo-rail-title">
    <div className="section-intro"><div><p className="eyebrow">{eyebrow}</p><h2 id="editorial-photo-rail-title">{title}</h2></div><p>Photographs are shown only when their ECU source and reuse basis are recorded in the media manifest.</p></div>
    <div className="editorial-photo-grid">{items.map((item) => <figure key={item.id} className="editorial-photo-card"><Image src={item.path} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 700px) 100vw, 33vw" /><figcaption><strong>{item.label}</strong><span>{item.context}</span></figcaption></figure>)}</div>
  </section>;
}
