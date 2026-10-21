import './globals.css';
import './refinements.css';
import './programmes.css';
import './home.css';
import './discovery.css';
import './information.css';
export const metadata = { title: 'Egyptian Chinese University | ECU', description: 'Official Egyptian Chinese University digital experience.', alternates: { languages: { en: '/en', ar: '/ar', 'zh-Hans': '/zh' } } };
export default function RootLayout({ children }) { return <html lang="en" dir="ltr"><body>{children}</body></html>; }
