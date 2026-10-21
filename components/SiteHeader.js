'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isLocale, localeKey, translations } from '../lib/translations';

export default function SiteHeader({ onLocaleChange }) {
  const [locale, setLocale] = useState('en');
  const [open, setOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem('ecu-locale');
    const initialLocale = isLocale(stored) ? stored : 'en';
    setLocale(initialLocale);
    document.documentElement.lang = localeKey(initialLocale);
    document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
    const handleLocale = (event) => {
      if (!isLocale(event.detail)) return;
      setLocale(event.detail);
      document.documentElement.lang = localeKey(event.detail);
      document.documentElement.dir = event.detail === 'ar' ? 'rtl' : 'ltr';
    };
    window.addEventListener('ecu-locale-change', handleLocale);
    return () => window.removeEventListener('ecu-locale-change', handleLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = localeKey(locale);
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setAcademicsOpen(false);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const changeLocale = (event) => {
    const next = event.target.value;
    window.localStorage.setItem('ecu-locale', next);
    document.cookie = `ecu-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setLocale(next);
    window.dispatchEvent(new CustomEvent('ecu-locale-change', { detail: next }));
    if (onLocaleChange) onLocaleChange(next);
    const pathWithoutLocale = pathname.replace(/^\/(en|ar|zh)(?=\/|$)/, '') || '/';
    router.push(`/${next}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`);
  };

  const t = translations[locale];
  return <header className="site-header">
    <div className="utility-bar"><div className="wrap utility-inner"><span>Egyptian Chinese University</span><div className="utility-actions"><Link href="/contact">{t.students}</Link><Link href="/contact">{t.staff}</Link><Link href="/about">{t.alumni}</Link><Link href="/services">{t.library}</Link><label><span className="sr-only">{t.language}</span><select aria-label={t.language} value={locale} onChange={changeLocale}><option value="en">EN</option><option value="ar">AR</option><option value="zh">中文</option></select></label></div></div></div>
    <div className="nav wrap">
      <Link className="brand" href="/" onClick={() => setOpen(false)}><img src="/assets/images/ecu-logo.png" alt="Egyptian Chinese University" /><span>Egyptian<br />Chinese University</span></Link>
      <nav id="main-menu" aria-label="Primary navigation" className={open ? 'nav-links is-open' : 'nav-links'}>
        <Link href="/about" onClick={() => setOpen(false)}>{t.about}</Link>
        <div className="nav-menu"><button className="nav-menu-trigger" aria-expanded={academicsOpen} aria-controls="academics-menu" onClick={() => setAcademicsOpen((value) => !value)}>{t.academics}<span aria-hidden="true">{academicsOpen ? '−' : '+'}</span></button>{academicsOpen && <div id="academics-menu" className="mega-menu"><div><strong>{t.academics}</strong><Link href="/faculties" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>{t.faculties}</Link><Link href="/programmes" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>{t.programmes}</Link></div><div><strong>{t.research}</strong><Link href="/research" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>{t.researchOverview}</Link><Link href="/services" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>{t.learningResources}</Link></div><div className="mega-feature"><span>{t.startHere}</span><b>{t.exploreMessage}</b><Link href="/programmes" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>{t.exploreProgrammes}</Link></div></div>}</div>
        <Link href="/admissions" onClick={() => setOpen(false)}>{t.admissions}</Link><Link href="/research" onClick={() => setOpen(false)}>{t.research}</Link><Link href="/news-events" onClick={() => setOpen(false)}>News & events</Link><Link href="/campus-life" onClick={() => setOpen(false)}>Campus life</Link><Link href="/services" onClick={() => setOpen(false)}>Services</Link><Link href="/contact" onClick={() => setOpen(false)}>{t.contact}</Link><Link href="/search" onClick={() => setOpen(false)}>{t.search}</Link>
      </nav>
      <a className="button desktop-apply" href="https://admission.ecu.edu.eg/" target="_blank" rel="noreferrer">{t.apply} <span aria-hidden="true">-&gt;</span></a>
      <button className="menu-button" aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen((value) => !value)}>{open ? t.close : t.menu} <span aria-hidden="true">{open ? '×' : '='}</span></button>
    </div>
  </header>;
}
