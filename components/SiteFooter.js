'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { localeFromPath, localeHref, translations } from '../lib/translations';
import { campusContactRecords } from '../lib/campus/contact';

const FOOTER_LINKS = [
  { key: 'footerAbout', href: '/about' },
  { key: 'footerFaculties', href: '/faculties' },
  { key: 'footerProgrammes', href: '/programmes' },
  { key: 'footerAdmissions', href: '/admissions' },
  { key: 'footerResearch', href: '/research' },
  { key: 'footerNews', href: '/news-events' },
  { key: 'footerCampus', href: '/campus-life' },
  { key: 'footerServices', href: '/services' },
  { key: 'footerContact', href: '/contact' },
];

export default function SiteFooter() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname) || 'en';
  const t = translations[locale];
  const to = (href) => localeHref(href, locale);

  return <footer className="site-footer">
    <div className="wrap footer-grid">
      <div className="footer-brand">
        <Image className="footer-logo" src="/assets/images/ecu-logo.png" alt="" width={60} height={60} />
        <h2>Egyptian Chinese University</h2>
        <p>Established under Egyptian Presidential Decree No. 118 of 2013.</p>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        {FOOTER_LINKS.map((item) => <Link key={item.key} href={to(item.href)}>{t[item.key]}</Link>)}
      </nav>
      <div className="footer-locations">
        <p className="eyebrow">CAMPUS LOCATIONS</p>
        {campusContactRecords.map((location) => <p key={location.id}><strong>{location.name}</strong><br />{location.address}</p>)}
        <Link className="text-link" href={to('/campus-life/visit')}>{t.footerCampus} -&gt;</Link>
      </div>
    </div>
    <div className="wrap copyright">
      <span>Copyright {new Date().getFullYear()} Egyptian Chinese University.</span>
      <Link href="#main">{t.backToTop}</Link>
    </div>
  </footer>;
}
