export const translations = {
  en: {
    menu: 'Menu', close: 'Close menu', apply: 'Apply now', about: 'About ECU', academics: 'Academics',
    faculties: 'Faculties', programmes: 'Academic programmes', admissions: 'Admissions',
    research: 'Research & innovation', contact: 'Contact', official: 'Official ECU website',
    students: 'Students', staff: 'Staff', alumni: 'Alumni', library: 'Library', language: 'Language',
    search: 'Search', researchOverview: 'Research overview', learningResources: 'Learning resources',
    startHere: 'START HERE', exploreMessage: 'Find a faculty and explore verified study areas.',
    exploreProgrammes: 'Explore ECU programmes ->',
    newsEvents: 'News & events', campusLife: 'Campus life', services: 'Services',
    home: 'ECU home', skipToContent: 'Skip to content', backToTop: 'Back to top',
    utilityStudents: 'Students', utilityStaff: 'Staff', utilityAlumni: 'Alumni', utilityLibrary: 'Library',
    footerAbout: 'About ECU', footerFaculties: 'Faculties', footerContact: 'Visit and contact',
    footerAdmissions: 'Admissions', footerServices: 'University services', footerCampus: 'Campus life',
    footerProgrammes: 'Academic programmes', footerNews: 'News & events', footerResearch: 'Research',
  },
  ar: {
    menu: 'القائمة', close: 'إغلاق القائمة', apply: 'تقدم الآن', about: 'عن ECU', academics: 'الدراسة الأكاديمية',
    faculties: 'الكليات', programmes: 'البرامج الأكاديمية', admissions: 'القبول',
    research: 'البحث والابتكار', contact: 'تواصل معنا', official: 'موقع ECU الرسمي',
    students: 'الطلاب', staff: 'أعضاء هيئة التدريس', alumni: 'الخريجون', library: 'المكتبة', language: 'اللغة',
    search: 'بحث', researchOverview: 'نظرة عامة على البحث', learningResources: 'موارد التعلم',
    startHere: 'ابدأ من هنا', exploreMessage: 'اعثر على كلية واستكشف مجالات الدراسة الموثقة.',
    exploreProgrammes: 'استكشف برامج ECU ←',
    newsEvents: 'الأخبار والفعاليات', campusLife: 'الحياة الجامعية', services: 'الخدمات',
    home: 'الصفحة الرئيسية لـ ECU', skipToContent: 'انتقل إلى المحتوى', backToTop: 'العودة إلى الأعلى',
    utilityStudents: 'الطلاب', utilityStaff: 'أعضاء هيئة التدريس', utilityAlumni: 'الخريجون', utilityLibrary: 'المكتبة',
    footerAbout: 'عن ECU', footerFaculties: 'الكليات', footerContact: 'الزيارة والتواصل',
    footerAdmissions: 'القبول', footerServices: 'خدمات الجامعة', footerCampus: 'الحياة الجامعية',
    footerProgrammes: 'البرامج الأكاديمية', footerNews: 'الأخبار والفعاليات', footerResearch: 'البحث',
  },
  zh: {
    menu: '菜单', close: '关闭菜单', apply: '立即申请', about: '关于 ECU', academics: '学术',
    faculties: '学院', programmes: '学术课程', admissions: '招生',
    research: '研究与创新', contact: '联系我们', official: 'ECU 官方网站',
    students: '学生', staff: '教职员工', alumni: '校友', library: '图书馆', language: '语言',
    search: '搜索', researchOverview: '研究概览', learningResources: '学习资源',
    startHere: '从这里开始', exploreMessage: '查找学院并探索已核实的学习领域。',
    exploreProgrammes: '探索 ECU 课程 →',
    newsEvents: '新闻与活动', campusLife: '校园生活', services: '服务',
    home: 'ECU 首页', skipToContent: '跳转到内容', backToTop: '返回顶部',
    utilityStudents: '学生', utilityStaff: '教职员工', utilityAlumni: '校友', utilityLibrary: '图书馆',
    footerAbout: '关于 ECU', footerFaculties: '学院', footerContact: '参观与联系',
    footerAdmissions: '招生', footerServices: '大学服务', footerCampus: '校园生活',
    footerProgrammes: '学术课程', footerNews: '新闻与活动', footerResearch: '研究',
  },
};

export const localeKey = (value) => value === 'zh' ? 'zh-Hans' : value;
export const isLocale = (value) => value === 'en' || value === 'ar' || value === 'zh';

export const localeFromPath = (pathname) => {
  const segment = String(pathname || '').split('/')[1];
  return isLocale(segment) ? segment : null;
};

export const localeFromLang = (lang) => {
  if (lang === 'zh-Hans' || lang === 'zh') return 'zh';
  return isLocale(lang) ? lang : null;
};

// Builds an in-site link that stays inside the visitor's current language.
export const localeHref = (href, locale = 'en') => {
  if (!href || !href.startsWith('/')) return href;
  const withoutLocale = href.replace(/^\/(en|ar|zh)(?=\/|$)/, '') || '/';
  return `/${locale}${withoutLocale === '/' ? '' : withoutLocale}`;
};
