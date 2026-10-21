'use client';

import Link from 'next/link';
import { useState } from 'react';
import { campusContactRecords, verifiedContactChannels } from '../lib/campus/contact';

const copy = {
  en: {
    tabs: 'Choose a campus',
    selected: 'Selected campus',
    address: 'Verified address',
    faculties: 'Faculties associated with this branch',
    source: 'Official location source',
    maps: 'Open Google Maps',
    directions: 'Get directions',
    copy: 'Copy address',
    copied: 'Address copied',
    copyFailed: 'Copy is unavailable; select the address above.',
    map: 'Campus map',
    mapFallback: 'The map is provided as a convenience. Use the text address or Google Maps links if it is unavailable.',
    noImage: 'Campus photography is not published',
    noImageText: 'ECU media rights are not confirmed for the available campus images. This page uses a typography-first presentation instead of presenting unlicensed photography.',
    hotline: 'University hotline',
    application: 'Official application portal',
    admissions: 'Admissions guidance',
    services: 'Student services',
    sourceStatus: 'Verified against ECU public sources on 21 October 2026.',
  },
  ar: {
    tabs: 'اختر الحرم الجامعي',
    selected: 'الحرم المحدد',
    address: 'العنوان الموثق',
    faculties: 'الكليات المرتبطة بهذا الفرع',
    source: 'مصدر الموقع الرسمي',
    maps: 'فتح خرائط Google',
    directions: 'الحصول على الاتجاهات',
    copy: 'نسخ العنوان',
    copied: 'تم نسخ العنوان',
    copyFailed: 'النسخ غير متاح؛ حدد العنوان أعلاه.',
    map: 'خريطة الحرم',
    mapFallback: 'الخريطة للراحة فقط. استخدم العنوان النصي أو روابط خرائط Google إذا لم تتوفر الخريطة.',
    noImage: 'لم تُنشر صور للحرم',
    noImageText: 'لم يتم التحقق من حقوق استخدام صور الحرم المتاحة من ECU. لذلك تستخدم الصفحة عرضاً تحريرياً بدلاً من نشر صور غير مرخصة.',
    hotline: 'الخط الساخن للجامعة',
    application: 'بوابة التقديم الرسمية',
    admissions: 'إرشادات القبول',
    services: 'خدمات الطلاب',
    sourceStatus: 'تم التحقق من المصادر العامة لـ ECU في 21 أكتوبر 2026.',
  },
  zh: {
    tabs: '选择校区',
    selected: '当前校区',
    address: '已核实地址',
    faculties: '与此校区相关的学院',
    source: '官方位置来源',
    maps: '打开 Google 地图',
    directions: '获取路线',
    copy: '复制地址',
    copied: '地址已复制',
    copyFailed: '复制不可用；请选中上方地址。',
    map: '校区地图',
    mapFallback: '地图仅供参考。如果地图不可用，请使用文字地址或 Google 地图链接。',
    noImage: '未发布校区照片',
    noImageText: '现有 ECU 校区照片的再使用权尚未核实。因此本页面采用文字设计，不展示未经授权的照片。',
    hotline: '大学热线',
    application: '官方申请门户',
    admissions: '招生指南',
    services: '学生服务',
    sourceStatus: '已于 2026 年 10 月 21 日根据 ECU 公共来源核实。',
  },
};

function getLocale() {
  if (typeof window === 'undefined') return 'en';
  const value = window.localStorage.getItem('ecu-locale');
  return value === 'ar' || value === 'zh' ? value : 'en';
}

export default function CampusContactExplorer({ initialLocale = 'en' }) {
  const [activeId, setActiveId] = useState(campusContactRecords[0].id);
  const [locale] = useState(() => initialLocale || getLocale());
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const t = copy[locale];
  const active = campusContactRecords.find((branch) => branch.id === activeId) || campusContactRecords[0];

  const copyAddress = async () => {
    setCopyFailed(false);
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(active.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyFailed(true);
    }
  };

  return <div className="contact-explorer">
    <div className="campus-tabs" role="tablist" aria-label={t.tabs}>
      {campusContactRecords.map((branch) => <button
        key={branch.id}
        type="button"
        role="tab"
        id={`tab-${branch.id}`}
        aria-selected={active.id === branch.id}
        aria-controls={`panel-${branch.id}`}
        className={active.id === branch.id ? 'is-active' : ''}
        onClick={() => { setActiveId(branch.id); setCopied(false); setCopyFailed(false); }}
      >{branch.name}</button>)}
    </div>
    <noscript><p className="status-note">JavaScript is required for the campus selector. Both branch addresses are available on <Link href="/campus-life/visit">Campus visit</Link>.</p></noscript>
    <section className="campus-detail-panel" id={`panel-${active.id}`} role="tabpanel" aria-labelledby={`tab-${active.id}`}>
      <div className="campus-detail-copy">
        <p className="eyebrow">{t.selected}</p>
        <h2>{active.name}</h2>
        <p>{active.description}</p>
        <p className="campus-address"><strong>{t.address}</strong><span>{active.address}</span></p>
        <div className="campus-actions">
          <a className="button" href={active.directionsUrl} target="_blank" rel="noreferrer">{t.directions} <span aria-hidden="true">-&gt;</span></a>
          <a className="outlined-link" href={active.mapsSearchUrl} target="_blank" rel="noreferrer">{t.maps}</a>
          <button type="button" className="text-button" onClick={copyAddress}>{copied ? t.copied : t.copy}</button>{copyFailed ? <span className="copy-status" role="status">{t.copyFailed}</span> : null}
        </div>
        <div className="campus-faculty-list">
          <p className="eyebrow">{t.faculties}</p>
          <ul>{active.faculties.map((faculty) => <li key={faculty.slug}><Link href={`/faculties/${faculty.slug}`}>{faculty.name}</Link></li>)}</ul>
        </div>
        <a className="source-link" href={active.sourceUrl} target="_blank" rel="noreferrer">{t.source} <span aria-hidden="true">-&gt;</span></a>
      </div>
      <div className="campus-map-column">
        <div className="campus-map-heading"><p className="eyebrow">{t.map}</p><span aria-hidden="true">{active.shortName}</span></div>
        <iframe className="campus-map" title={`${active.name} map`} src={active.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <p className="map-fallback">{t.mapFallback}</p>
        <div className="campus-media-status"><p className="eyebrow">{t.noImage}</p><p>{t.noImageText}</p></div>
      </div>
    </section>
    <p className="verification-note">{t.sourceStatus}</p>
    <section className="quick-contact-strip" aria-label="Verified contact pathways">
      <a href={`tel:${verifiedContactChannels.hotline}`}><span>{t.hotline}</span><strong dir="ltr">{verifiedContactChannels.hotline}</strong></a>
      <a href={verifiedContactChannels.applicationUrl} target="_blank" rel="noreferrer"><span>{t.application}</span><strong>admission.ecu.edu.eg</strong></a>
      <Link href={verifiedContactChannels.admissionsRoute}><span>{t.admissions}</span><strong>ECU admissions</strong></Link>
      <Link href={verifiedContactChannels.servicesRoute}><span>{t.services}</span><strong>ECU services</strong></Link>
    </section>
  </div>;
}
