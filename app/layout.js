import './globals.css';
import './refinements.css';
import './programmes.css';
import './home.css';
import './discovery.css';
import './information.css';
import { headers } from 'next/headers';

export function generateMetadata() {
  const locale = headers().get('x-ecu-locale') || 'en';
  const path = headers().get('x-ecu-path') || '/';
  const host = headers().get('x-forwarded-host') || headers().get('host') || 'ecu-university-website.vercel.app';
  const protocol = headers().get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;
  const localizedPath = (value) => `/${value}${path === '/' ? '' : path}`;
  return {
    title: 'Egyptian Chinese University | ECU',
    description: 'Official Egyptian Chinese University digital experience.',
    alternates: {
      canonical: `${origin}${localizedPath(locale)}`,
      languages: {
        en: `${origin}${localizedPath('en')}`,
        ar: `${origin}${localizedPath('ar')}`,
        'zh-Hans': `${origin}${localizedPath('zh')}`,
      },
    },
  };
}

export default function RootLayout({ children }) {
  const locale = headers().get('x-ecu-locale') || 'en';
  return <html lang={locale === 'zh' ? 'zh-Hans' : locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}><body>{children}</body></html>;
}
