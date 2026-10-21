export const translations = {
  en: {
    menu: 'Menu', close: 'Close menu', apply: 'Apply now', about: 'About ECU', academics: 'Academics',
    faculties: 'Faculties', programmes: 'Academic programmes', admissions: 'Admissions',
    research: 'Research & innovation', contact: 'Contact', official: 'Official ECU website',
    students: 'Students', staff: 'Staff', alumni: 'Alumni', library: 'Library', language: 'Language',
    search: 'Search', researchOverview: 'Research overview', learningResources: 'Learning resources',
    startHere: 'START HERE', exploreMessage: 'Find a faculty and explore verified study areas.',
    exploreProgrammes: 'Explore ECU programmes ->',
  },
  ar: {
    menu: 'القائمة', close: 'إغلاق القائمة', apply: 'تقدم الآن', about: 'عن ECU', academics: 'الدراسة الأكاديمية',
    faculties: 'الكليات', programmes: 'البرامج الأكاديمية', admissions: 'القبول',
    research: 'البحث والابتكار', contact: 'تواصل معنا', official: 'موقع ECU الرسمي',
    students: 'الطلاب', staff: 'أعضاء هيئة التدريس', alumni: 'الخريجون', library: 'المكتبة', language: 'اللغة',
    search: 'بحث', researchOverview: 'نظرة عامة على البحث', learningResources: 'موارد التعلم',
    startHere: 'ابدأ من هنا', exploreMessage: 'اعثر على كلية واستكشف مجالات الدراسة الموثقة.',
    exploreProgrammes: 'استكشف برامج ECU ←',
  },
  zh: {
    menu: '菜单', close: '关闭菜单', apply: '立即申请', about: '关于 ECU', academics: '学术',
    faculties: '学院', programmes: '学术课程', admissions: '招生',
    research: '研究与创新', contact: '联系我们', official: 'ECU 官方网站',
    students: '学生', staff: '教职员工', alumni: '校友', library: '图书馆', language: '语言',
    search: '搜索', researchOverview: '研究概览', learningResources: '学习资源',
    startHere: '从这里开始', exploreMessage: '查找学院并探索已核实的学习领域。',
    exploreProgrammes: '探索 ECU 课程 →',
  },
};

export const localeKey = (value) => value === 'zh' ? 'zh-Hans' : value;
export const isLocale = (value) => value === 'en' || value === 'ar' || value === 'zh';
