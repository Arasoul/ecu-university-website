import './globals.css';
import './refinements.css';
import './programmes.css';
import './home.css';
import './discovery.css';
import './information.css';
import './editorial.css';
import './campus.css';
import { headers } from 'next/headers';
import { Inter, Manrope, Noto_Sans_Arabic, Noto_Sans_SC } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700', '800'],
  variable: '--font-manrope',
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-noto-arabic',
});

const notoSc = Noto_Sans_SC({
  subsets: ['chinese-simplified'],
  display: 'swap',
  weight: ['400', '500', '700'],
  preload: false,
  variable: '--font-noto-sc',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecu-university-website.vercel.app';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#B51F2B',
};

export function generateMetadata() {
  const locale = headers().get('x-ecu-locale') || 'en';
  const path = (headers().get('x-ecu-path') || '/').replace(/^\/(en|ar|zh)(?=\/|$)/, '') || '/';
  const host = headers().get('x-forwarded-host') || headers().get('host') || 'ecu-university-website.vercel.app';
  const protocol = headers().get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;
  const localizedPath = (value) => `/${value}${path === '/' ? '' : path}`;
  const canonical = `${origin}${localizedPath(locale)}`;
  const title = 'Egyptian Chinese University | ECU';
  const description = 'Official Egyptian Chinese University digital experience.';
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: 'Egyptian Chinese University',
    icons: {
      icon: '/assets/images/ecu-logo.png',
      apple: '/assets/images/ecu-logo.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-video-preview': -1, 'max-snippet': -1 },
    },
    openGraph: {
      type: 'website',
      siteName: 'Egyptian Chinese University',
      locale: locale === 'zh' ? 'zh_CN' : locale,
      url: canonical,
      title,
      description,
      images: [{ url: '/images/ecu/campus/nasr-city-campus-opening.jpg', width: 1024, height: 816, alt: 'ECU Nasr City campus entrance with its glass-fronted central facade' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/ecu/campus/nasr-city-campus-opening.jpg'],
    },
    alternates: {
      canonical,
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
  return <html lang={locale === 'zh' ? 'zh-Hans' : locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${inter.variable} ${manrope.variable} ${notoArabic.variable} ${notoSc.variable}`}><body>{children}</body></html>;
}
