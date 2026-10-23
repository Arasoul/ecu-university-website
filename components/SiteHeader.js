'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isLocale, localeFromLang, localeFromPath, localeHref, localeKey, translations } from '../lib/translations';

const ACADEMICS_LINKS = [
  { key: 'faculties', href: '/faculties' },
  { key: 'programmes', href: '/programmes' },
];

const UTILITY_LINKS = [
  { key: 'utilityStudents', href: '/services#students' },
  { key: 'utilityStaff', href: '/services#staff' },
  { key: 'utilityAlumni', href: '/services#alumni' },
  { key: 'utilityLibrary', href: '/services#library' },
];

export default function SiteHeader({ onLocaleChange }) {
  const [locale, setLocale] = useState('en');
  const [open, setOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef(null);
  const academicsRef = useRef(null);

  useEffect(() => {
    // The URL prefix is authoritative because the server rendered the document
    // language and direction from it. The stored preference is only a fallback
    // for visits without an explicit prefix.
    const urlLocale = localeFromPath(window.location.pathname);
    const serverLocale = localeFromLang(document.documentElement.lang);
    const stored = window.localStorage.getItem('ecu-locale');
    const initialLocale = urlLocale || serverLocale || (isLocale(stored) ? stored : 'en');
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

  // Any navigation closes both menus.
  useEffect(() => {
    setOpen(false);
    setAcademicsOpen(false);
  }, [pathname]);

  const closeAll = useCallback(() => {
    setOpen(false);
    setAcademicsOpen(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (academicsOpen) {
        setAcademicsOpen(false);
        academicsRef.current?.focus();
      } else {
        closeAll();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [academicsOpen, closeAll]);

  // Clicking outside the navigation closes the open mega menu.
  useEffect(() => {
    if (!academicsOpen) return undefined;
    const onPointerDown = (event) => {
      const target = event.target;
      if (navRef.current?.contains(target) || academicsRef.current?.contains(target)) return;
      setAcademicsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [academicsOpen]);

  const changeLocale = (event) => {
    const next = event.target.value;
    window.localStorage.setItem('ecu-locale', next);
    document.cookie = `ecu-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setLocale(next);
    window.dispatchEvent(new CustomEvent('ecu-locale-change', { detail: next }));
    if (onLocaleChange) onLocaleChange(next);
    const pathWithoutLocale = pathname.replace(/^\/(en|ar|zh)(?=\/|$)/, '') || '/';
    closeAll();
    router.push(localeHref(pathWithoutLocale, next));
  };

  const t = translations[locale];
  const to = (href) => localeHref(href, locale);
  const isActive = (href) => {
    const path = pathname.replace(/^\/(en|ar|zh)(?=\/|$)/, '') || '/';
    const target = href.split('#')[0];
    return path === target || (target !== '/' && path.startsWith(`${target}/`));
  };

  const navLink = (href, label) => (
    <Link
      href={to(href)}
      onClick={closeAll}
      aria-current={isActive(href) ? 'page' : undefined}
      className={isActive(href) ? 'is-active' : undefined}
    >{label}</Link>
  );

  return <header className="site-header">
    <div className="utility-bar">
      <div className="wrap utility-inner">
        <span>Egyptian Chinese University</span>
        <div className="utility-actions">
          {UTILITY_LINKS.map((item) => <Link key={item.key} href={to(item.href)} onClick={closeAll}>{t[item.key]}</Link>)}
          <label>
            <span className="sr-only">{t.language}</span>
            <select aria-label={t.language} value={locale} onChange={changeLocale}>
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="zh">中文</option>
            </select>
          </label>
        </div>
      </div>
    </div>
    <div className="nav wrap" ref={navRef}>
      <Link className="brand" href={to('/')} onClick={closeAll}>
        <Image src="/assets/images/ecu-logo.png" alt="" width={64} height={64} priority />
        <span>Egyptian<br />Chinese University</span>
      </Link>
      <nav id="main-menu" aria-label="Primary navigation" className={open ? 'nav-links is-open' : 'nav-links'}>
        {navLink('/about', t.about)}
        <div className="nav-menu">
          <button
            type="button"
            className="nav-menu-trigger"
            ref={academicsRef}
            aria-expanded={academicsOpen}
            aria-controls="academics-menu"
            onClick={() => setAcademicsOpen((value) => !value)}
          >{t.academics}<span aria-hidden="true">{academicsOpen ? '−' : '+'}</span></button>
          {academicsOpen && <div id="academics-menu" className="mega-menu">
            <div>
              <strong>{t.academics}</strong>
              {ACADEMICS_LINKS.map((item) => <Link key={item.key} href={to(item.href)} onClick={closeAll}>{t[item.key]}</Link>)}
            </div>
            <div>
              <strong>{t.research}</strong>
              <Link href={to('/research')} onClick={closeAll}>{t.researchOverview}</Link>
              <Link href={to('/services')} onClick={closeAll}>{t.learningResources}</Link>
            </div>
            <div className="mega-feature">
              <span>{t.startHere}</span>
              <b>{t.exploreMessage}</b>
              <Link href={to('/programmes')} onClick={closeAll}>{t.exploreProgrammes}</Link>
            </div>
          </div>}
        </div>
        {navLink('/admissions', t.admissions)}
        {navLink('/research', t.research)}
        {navLink('/news-events', t.newsEvents)}
        {navLink('/campus-life', t.campusLife)}
        {navLink('/services', t.services)}
        {navLink('/contact', t.contact)}
        {navLink('/search', t.search)}
      </nav>
      <a className="button desktop-apply" href="https://admission.ecu.edu.eg/" target="_blank" rel="noreferrer">{t.apply} <span aria-hidden="true">-&gt;</span></a>
      <button type="button" className="menu-button" aria-expanded={open} aria-controls="main-menu" onClick={() => { setOpen((value) => !value); setAcademicsOpen(false); }}>{open ? t.close : t.menu} <span aria-hidden="true">{open ? '×' : '='}</span></button>
    </div>
  </header>;
}
