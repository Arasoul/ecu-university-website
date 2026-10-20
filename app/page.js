'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import FacultyCard from '../components/FacultyCard';
import ProgrammeFinder from '../components/ProgrammeFinder';
import SiteHeader from '../components/SiteHeader';
import { featuredFaculties } from '../lib/faculties';
import { programmeDirectory } from '../lib/programmes';

const labels = {
  en: { skip: 'Skip to content', faculties: 'Explore faculties', apply: 'Apply now', more: 'View all faculties', official: 'Visit official ECU source', view: 'View faculty', programmes: 'Academic programmes', admissions: 'Admissions', scholarships: 'Scholarships', services: 'Student services', continuing: 'Continuing education', achievements: 'Hall of achievements', news: 'News and events', research: 'Research and innovation', partnerships: 'International partnerships', campus: 'Campus life', contact: 'Visit and contact', unavailable: 'This section will be published when ECU-approved content is available.' },
  ar: { skip: 'انتقل إلى المحتوى', faculties: 'استكشف الكليات', apply: 'قدّم الآن', more: 'عرض جميع الكليات', official: 'زيارة مصدر ECU الرسمي', view: 'عرض الكلية', programmes: 'البرامج الأكاديمية', admissions: 'القبول', scholarships: 'المنح الدراسية', services: 'خدمات الطلاب', continuing: 'التعليم المستمر', achievements: 'قاعة الإنجازات', news: 'الأخبار والفعاليات', research: 'البحث والابتكار', partnerships: 'الشراكات الدولية', campus: 'الحياة الجامعية', contact: 'زيارة وتواصل', unavailable: 'سيُنشر هذا القسم عند توفر محتوى معتمد من ECU.' },
  zh: { skip: '跳转到内容', faculties: '探索学院', apply: '立即申请', more: '查看全部学院', official: '访问 ECU 官方来源', view: '查看学院', programmes: '学术课程', admissions: '招生', scholarships: '奖学金', services: '学生服务', continuing: '继续教育', achievements: '成就殿堂', news: '新闻与活动', research: '研究与创新', partnerships: '国际合作', campus: '校园生活', contact: '参观与联系', unavailable: 'ECU 批准内容发布后，此部分将会开放。' },
};

export default function Home() {
  const [lang, setLang] = useState('en');
  const t = labels[lang];

  useEffect(() => {
    const stored = window.localStorage.getItem('ecu-locale');
    if (stored === 'ar' || stored === 'zh') setLang(stored);
    const handleLocale = (event) => setLang(event.detail);
    window.addEventListener('ecu-locale-change', handleLocale);
    return () => window.removeEventListener('ecu-locale-change', handleLocale);
  }, []);

  return <main>
    <a className="skip-link" href="#main">{t.skip}</a>
    <SiteHeader onLocaleChange={setLang} />
    <section className="hero hero-refined" aria-labelledby="hero-title"><div className="hero-image" aria-hidden="true"><div className="hero-art"><span /><span /><span /></div></div><div id="main" className="wrap hero-content"><p className="eyebrow">EGYPTIAN CHINESE UNIVERSITY</p><h1 id="hero-title">History creates your future.</h1><p className="lead">Explore ECU’s academic community, connecting education, research and practical learning.</p><div className="actions"><Link className="button" href="/admissions">{t.apply} <span aria-hidden="true">-&gt;</span></Link><Link className="text-link" href="#programmes">{t.programmes} <span aria-hidden="true">-&gt;</span></Link></div><div className="hero-index" aria-hidden="true"><span>01</span><span>ECU / ACADEMIC COMMUNITY</span></div></div></section>

    <section className="quick wrap" aria-label="Quick access"><Link href="/faculties"><b>01</b><span>{t.faculties}</span><small>Explore ECU’s 12 faculty records</small><i aria-hidden="true">-&gt;</i></Link><Link href="#programmes"><b>02</b><span>{t.programmes}</span><small>Search published study areas</small><i aria-hidden="true">-&gt;</i></Link><Link href="/admissions"><b>03</b><span>{t.admissions}</span><small>Requirements and application</small><i aria-hidden="true">-&gt;</i></Link><Link href="/contact"><b>04</b><span>{t.contact}</span><small>Find verified campus routes</small><i aria-hidden="true">-&gt;</i></Link></section>

    <section className="section institutional-story" aria-labelledby="story-title"><div className="wrap story-grid"><div className="story-intro"><p className="eyebrow">THE ECU EXPERIENCE</p><h2 id="story-title">An academic community built for connection.</h2><p>ECU’s published profile brings together education across engineering, medicine, physical therapy and business, with cooperation involving Chinese universities.</p><Link className="outlined-link" href="/about">Discover ECU’s profile -&gt;</Link></div><div className="story-panel"><div className="story-panel-heading"><span>01 / ECU TODAY</span><strong>Learn with purpose.</strong></div><div className="story-lines"><div><b>01</b><span>Academic breadth</span><Link href="/faculties" aria-label="Explore ECU faculties">-&gt;</Link></div><div><b>02</b><span>Research direction</span><Link href="/research" aria-label="Explore ECU research">-&gt;</Link></div><div><b>03</b><span>International connection</span><Link href="/about" aria-label="Read about ECU">-&gt;</Link></div></div></div></div></section>

    <section className="section wrap" aria-labelledby="featured-title"><div className="section-intro"><div><p className="eyebrow">FEATURED FACULTIES</p><h2 id="featured-title">Choose a direction. Build what comes next.</h2></div><Link className="outlined-link" href="/faculties">{t.more} -&gt;</Link></div><div className="faculty-grid">{featuredFaculties.map((faculty, index) => <FacultyCard key={faculty.slug} faculty={faculty} index={index} featured />)}</div></section>

    <section id="programmes" className="section programmes-home" aria-labelledby="programmes-title"><div className="wrap"><div className="section-intro"><div><p className="eyebrow">{t.programmes}</p><h2 id="programmes-title">Start with a field that fits your ambition.</h2></div><Link className="outlined-link" href="/programmes">{t.more} -&gt;</Link></div><ProgrammeFinder programmes={programmeDirectory} initialLimit={6} /></div></section>

    <section id="admissions" className="section feature" aria-labelledby="admissions-title"><div className="wrap feature-grid"><div><p className="eyebrow">{t.admissions}</p><h2 id="admissions-title">Find the requirements before you apply.</h2><p>ECU publishes entry requirements and required documents for Egyptian, Arab and international secondary certificates.</p><Link className="button" href="/admissions">{t.admissions} <span aria-hidden="true">-&gt;</span></Link></div><aside className="admissions-steps"><p>YOUR NEXT THREE STEPS</p><ol><li><b>01</b><span>Review entry requirements</span></li><li><b>02</b><span>Prepare the required documents</span></li><li><b>03</b><span>Continue through the secure application pathway</span></li></ol></aside></div></section>

    <section id="research" className="section research-panel"><div className="wrap research"><div><p className="eyebrow">{t.research}</p><h2>Research with a direction. Cooperation with purpose.</h2></div><div><p>Read ECU’s published research plans and projects, plus current faculty initiatives, through the official website. ECU’s public profile also references cooperation with Chinese universities.</p><div className="research-actions"><Link className="button" href="/research">{t.research} <span aria-hidden="true">-&gt;</span></Link><Link className="text-link" href="/about">{t.partnerships} <span aria-hidden="true">-&gt;</span></Link></div></div></div></section>

    <footer id="contact"><div className="wrap footer-grid"><div><img src="/assets/images/ecu-logo.png" alt="Egyptian Chinese University" className="footer-logo" /><h2>Egyptian Chinese University</h2><Link href="/about">About ECU</Link><Link href="/faculties">{t.faculties}</Link><Link href="/contact">{t.contact}</Link><a href="https://ecu.edu.eg/" target="_blank" rel="noreferrer">{t.official}</a></div><div><p><strong>Heliopolis Branch</strong><br />Gesr ElSuez St., behind Tagneed Bridge, Cairo, Egypt.</p><p><strong>Nasr City Branch</strong><br />Al Hay Al Asher, Nasr City, Cairo, Egypt.</p></div></div><div className="wrap copyright"><span>Copyright {new Date().getFullYear()} Egyptian Chinese University.</span><Link href="#main">Back to top</Link></div></footer>
  </main>;
}
