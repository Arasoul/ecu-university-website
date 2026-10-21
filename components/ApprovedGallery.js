'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

export default function ApprovedGallery({ assets }) {
  const [category, setCategory] = useState('all');
  const categories = [...new Set(assets.flatMap((asset) => asset.categories || []))];
  const filtered = useMemo(() => category === 'all'
    ? assets
    : assets.filter((asset) => asset.categories?.includes(category)), [assets, category]);

  return <div className="approved-gallery">
    <div className="gallery-filters" role="group" aria-label="Filter approved photographs">
      <button type="button" className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')}>All photographs</button>
      {categories.map((item) => <button type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}
    </div>
    <p className="gallery-result" aria-live="polite">{filtered.length} approved photograph{filtered.length === 1 ? '' : 's'}</p>
    <div className="approved-gallery-grid">
      {filtered.map((asset) => <figure className="approved-gallery-card" key={asset.id}>
        <Image src={`/${asset.localFile.replace(/^public\//, '')}`} alt={asset.altText} width={asset.dimensions.width} height={asset.dimensions.height} sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw" />
        <figcaption><strong>{asset.subject}</strong><span>{asset.campus || asset.faculty || 'ECU source photograph'}</span><small>{asset.credit}</small></figcaption>
      </figure>)}
    </div>
  </div>;
}
