'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const copy = {
  en: { menu: 'Menu', close: 'Close menu', apply: 'Apply now', about: 'About ECU', academics: 'Academics', faculties: 'Faculties', programmes: 'Academic programmes', admissions: 'Admissions', research: 'Research & innovation', contact: 'Contact', official: 'Official ECU website', students: 'Students', staff: 'Staff', alumni: 'Alumni', library: 'Library', language: 'Language' },
  ar: { menu: 'القائمة', close: 'إغلاق القائمة', apply: 'قدّم الآن', about: 'عن ECU', academics: 'الدراسة الأكاديمية', faculties: 'الكليات', programmes: 'البرامج الأكاديمية', admissions: 'القبول', research: 'البحث والابتكار', contact: 'تواصل معنا', official: 'موقع ECU الرسمي', students: 'الطلاب', staff: 'أعضاء هيئة التدريس', alumni: 'الخريجون', library: 'المكتبة', language: 'اللغة' },
  zh: { menu: '菜单', close: '关闭菜单', apply: '立即申请', about: '关于 ECU', academics: '学术', faculties: '学院', programmes: '学术课程', admissions: '招生', research: '研究与创新', contact: '联系我们', official: 'ECU 官方网站', students: '学生', staff: '教职员工', alumni: '校友', library: '图书馆', language: '语言' },
};

export const localeKey = (value) => value === 'zh' ? 'zh-Hans' : value;

export default function SiteHeader({ onLocaleChange }) {
  const [locale, setLocale] = useState('en');
  const [open, setOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('ecu-locale');
    const initialLocale = stored === 'ar' || stored === 'zh' ? stored : 'en';
    setLocale(initialLocale);
    document.documentElement.lang = localeKey(initialLocale);
    document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';

    const handleLocale = (event) => {
      const next = event.detail;
      setLocale(next);
      document.documentElement.lang = localeKey(next);
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
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
    setLocale(next);
    document.documentElement.lang = localeKey(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    window.dispatchEvent(new CustomEvent('ecu-locale-change', { detail: next }));
    onLocaleChange?.(next);
  };

  const t = copy[locale];
  return <header className="site-header">
    <div className="utility-bar"><div className="wrap utility-inner"><span>Egyptian Chinese University</span><div className="utility-actions"><Link href="/contact">{t.students}</Link><Link href="/contact">{t.staff}</Link><Link href="/about">{t.alumni}</Link><Link href="/contact">{t.library}</Link><a href="https://ecu.edu.eg/" target="_blank" rel="noreferrer">{t.official}</a><label><span className="sr-only">{t.language}</span><select aria-label={t.language} value={locale} onChange={changeLocale}><option value="en">EN</option><option value="ar">AR</option><option value="zh">中文</option></select></label></div></div></div>
    <div className="nav wrap">
      <Link className="brand" href="/" onClick={() => setOpen(false)}><img src="/assets/images/ecu-logo.png" alt="Egyptian Chinese University" /><span>Egyptian<br />Chinese University</span></Link>
      <nav id="main-menu" aria-label="Primary navigation" className={open ? 'nav-links is-open' : 'nav-links'}>
        <Link href="/about" onClick={() => setOpen(false)}>{t.about}</Link>
        <div className="nav-menu">
          <button className="nav-menu-trigger" aria-expanded={academicsOpen} aria-controls="academics-menu" onClick={() => setAcademicsOpen((value) => !value)}>{t.academics}<span aria-hidden="true">{academicsOpen ? '−' : '+'}</span></button>
          {academicsOpen && <div id="academics-menu" className="mega-menu"><div><strong>{t.academics}</strong><Link href="/faculties" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>{t.faculties}</Link><Link href="/programmes" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>{t.programmes}</Link></div><div><strong>{t.research}</strong><Link href="/research" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>Research overview</Link><Link href="/contact" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>Learning resources</Link></div><div className="mega-feature"><span>START HERE</span><b>Find a faculty and explore verified study areas.</b><Link href="/programmes" onClick={() => { setOpen(false); setAcademicsOpen(false); }}>Explore ECU programmes -&gt;</Link></div></div>}
        </div>
        <Link href="/admissions" onClick={() => setOpen(false)}>{t.admissions}</Link>
        <Link href="/research" onClick={() => setOpen(false)}>{t.research}</Link>
        <Link href="/contact" onClick={() => setOpen(false)}>{t.contact}</Link>
      </nav>
      <a className="button desktop-apply" href="https://ecu.edu.eg/about-ecu/admission/" target="_blank" rel="noreferrer">{t.apply} <span aria-hidden="true">-&gt;</span></a>
      <button className="menu-button" aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen((value) => !value)}>{open ? t.close : t.menu} <span aria-hidden="true">{open ? '×' : '='}</span></button>
    </div>
  </header>;
}
